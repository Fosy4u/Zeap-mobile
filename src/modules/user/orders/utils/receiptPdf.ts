
import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import IOrderDetails from "../models/orderDetails_model";
import ZEAPER_LOGO_BASE64 from "./zeaperLogoBase64";
import { MONTSERRAT_REGULAR_BASE64, MONTSERRAT_SEMIBOLD_BASE64 } from "./receiptFontsBase64";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 48;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const RIGHT_EDGE = MARGIN + CONTENT_WIDTH;

// Mirrors the on-screen card: name on the left, quantity + price clustered right.
const PRICE_COL_WIDTH = 110;
const QTY_COL_WIDTH = 70;
const COL_GAP = 16;
const QTY_RIGHT = RIGHT_EDGE - PRICE_COL_WIDTH - COL_GAP;
const ITEMS_COL_WIDTH = CONTENT_WIDTH - PRICE_COL_WIDTH - QTY_COL_WIDTH - COL_GAP * 2;

const INK = rgb(0.067, 0.094, 0.153);
const BODY = rgb(0.216, 0.255, 0.318);
const MUTED = rgb(0.42, 0.447, 0.502);
const LINE = rgb(0.898, 0.906, 0.922);

const BOTTOM_LIMIT = MARGIN + 40;

const CONTACT_LINES = [
    "admin@zeaper.com",
    "+447518465207 (United Kingdom)",
    "+2347075374026 (Nigeria)",
];

const GLYPH_FALLBACKS: Record<string, string> = {
    "\u2018": "'", "\u2019": "'", "\u201A": "'",
    "\u201C": '"', "\u201D": '"', "\u201E": '"',
    "\u2010": "-", "\u2011": "-", "\u2012": "-",
    "\u2013": "-", "\u2014": "-", "\u2212": "-",
    "\u2026": "...", "\u2022": "-",
    "\u00A0": " ", "\u2009": " ", "\u202F": " ",
};

/* The embedded Montserrat subset covers Latin-1 plus the currency signs;
   anything else (emoji, CJK) would render as .notdef boxes, so drop it. */
const sanitize = (text?: string | number | null): string =>
    String(text ?? "")
        .replace(
            /[\u2018\u2019\u201A\u201C\u201D\u201E\u2010\u2011\u2012\u2013\u2014\u2212\u2026\u2022\u00A0\u2009\u202F]/g,
            (m) => GLYPH_FALLBACKS[m],
        )
        .replace(/[^\x20-\x7E\xA1-\xFF\u20A6\u20AC\u20B9]/g, "");

/* Matches the on-screen receipt: real currency symbols, and the same decimal rule
   as formatCurrency — Naira hides a ".00", every other currency keeps both. */
const formatPdfCurrency = (amount: number, currency: string = "NGN"): string => {
    const localeMap: Record<string, string> = {
        NGN: "en-NG", USD: "en-US", GBP: "en-GB", CAD: "en-CA", EUR: "de-DE",
    };
    const hasFraction = Math.round(amount * 100) % 100 !== 0;
    const fractionDigits = (currency.toUpperCase() === "NGN" && !hasFraction) ? 0 : 2;

    try {
        const formatted = new Intl.NumberFormat(localeMap[currency] || "en-NG", {
            style: "currency",
            currency,
            currencyDisplay: "symbol",
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits,
        }).format(amount);
        return sanitize(formatted).replace(/\s+/g, " ").trim();
    } catch {
        return `${ currency } ${ amount.toLocaleString("en-US", { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }) }`;
    }
};

const formatReceiptDate = (input?: Date | string): string => {
    if (!input) { return ""; }
    const d = new Date(input);
    if (Number.isNaN(d.getTime())) { return ""; }
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
};

interface IDrawOptions {
    size?: number;
    font?: PDFFont;
    color?: ReturnType<typeof rgb>;
}

// Wraps on whole words, hard-splitting any single word wider than maxWidth.
const wrapText = (text: string, font: PDFFont, size: number, maxWidth: number): string[] => {
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length === 0) { return [""]; }

    const lines: string[] = [];
    let current = "";

    for (const word of words) {
        const candidate = current ? `${ current } ${ word }` : word;
        if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
            current = candidate;
            continue;
        }
        if (current) { lines.push(current); }

        let remainder = word;
        while (font.widthOfTextAtSize(remainder, size) > maxWidth && remainder.length > 1) {
            let cut = remainder.length - 1;
            while (cut > 1 && font.widthOfTextAtSize(remainder.slice(0, cut), size) > maxWidth) { cut--; }
            lines.push(remainder.slice(0, cut));
            remainder = remainder.slice(cut);
        }
        current = remainder;
    }

    if (current) { lines.push(current); }
    return lines;
};

class ReceiptCanvas {
    private doc: PDFDocument;
    private page: PDFPage;
    private cursor: number;

    readonly regular: PDFFont;
    readonly bold: PDFFont;

    constructor(doc: PDFDocument, regular: PDFFont, bold: PDFFont) {
        this.doc = doc;
        this.regular = regular;
        this.bold = bold;
        this.page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        this.cursor = PAGE_HEIGHT - MARGIN;
    }

    get y(): number { return this.cursor; }
    get currentPage(): PDFPage { return this.page; }

    // Starts a new page when the next block wouldn't fit above the bottom margin.
    ensureSpace(height: number) {
        if (this.cursor - height >= BOTTOM_LIMIT) { return; }
        this.page = this.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        this.cursor = PAGE_HEIGHT - MARGIN;
    }

    move(down: number) { this.cursor -= down; }

    text(value: string, x: number, options: IDrawOptions = {}) {
        const size = options.size ?? 10;
        this.page.drawText(sanitize(value), {
            x,
            y: this.cursor,
            size,
            font: options.font ?? this.regular,
            color: options.color ?? BODY,
        });
    }

    textRight(value: string, rightX: number, options: IDrawOptions = {}) {
        const size = options.size ?? 10;
        const font = options.font ?? this.regular;
        const clean = sanitize(value);
        this.text(clean, rightX - font.widthOfTextAtSize(clean, size), options);
    }

    divider(gapAbove: number = 12, gapBelow: number = 12) {
        this.move(gapAbove);
        this.page.drawLine({
            start: { x: MARGIN, y: this.cursor },
            end: { x: RIGHT_EDGE, y: this.cursor },
            thickness: 1,
            color: LINE,
        });
        this.move(gapBelow);
    }
}

const drawHeader = async (canvas: ReceiptCanvas, doc: PDFDocument) => {
    try {
        const logo = await doc.embedPng(ZEAPER_LOGO_BASE64);
        const logoHeight = 56;
        const logoWidth = (logo.width / logo.height) * logoHeight;
        canvas.move(logoHeight);
        canvas.currentPage.drawImage(logo, {
            x: MARGIN,
            y: canvas.y,
            width: logoWidth,
            height: logoHeight,
        });
    } catch {
        // A missing/corrupt logo must not cost the user their receipt.
        canvas.move(16);
        canvas.text("ZEAPER", MARGIN, { size: 18, font: canvas.bold, color: INK });
    }

    canvas.move(20);
    for (const line of CONTACT_LINES) {
        canvas.text(line, MARGIN, { size: 9, color: MUTED });
        canvas.move(13);
    }
};

const drawParties = (canvas: ReceiptCanvas, orderDetails: IOrderDetails) => {
    const buyerName = `${ orderDetails?.user?.firstName ?? "" } ${ orderDetails?.user?.lastName ?? "" }`.trim();
    const top = canvas.y;

    canvas.move(14);
    canvas.text("Receipt to :", MARGIN, { size: 11, font: canvas.bold, color: INK });
    canvas.move(15);
    canvas.text(buyerName || "-", MARGIN, { size: 10, color: INK });
    canvas.move(13);
    canvas.text(orderDetails?.user?.email ?? "", MARGIN, { size: 9, color: MUTED });

    // Order meta sits on the same band, right-aligned.
    const bottom = canvas.y;
    const metaRows = [
        { label: "Order ID:", value: orderDetails?.orderId ?? "" },
        { label: "Date:", value: formatReceiptDate(orderDetails?.createdAt) },
    ];
    let metaY = top - 14;
    for (const row of metaRows) {
        const value = sanitize(row.value);
        const valueWidth = canvas.regular.widthOfTextAtSize(value, 10);
        canvas.currentPage.drawText(value, {
            x: RIGHT_EDGE - valueWidth,
            y: metaY,
            size: 10,
            font: canvas.regular,
            color: MUTED,
        });
        const labelWidth = canvas.bold.widthOfTextAtSize(row.label, 10);
        canvas.currentPage.drawText(row.label, {
            x: RIGHT_EDGE - valueWidth - 5 - labelWidth,
            y: metaY,
            size: 10,
            font: canvas.bold,
            color: INK,
        });
        metaY -= 16;
    }

    canvas.move(top - bottom > 0 ? 0 : 0);
};

const drawItemsTable = (canvas: ReceiptCanvas, orderDetails: IOrderDetails, currency: string) => {
    const productOrders = orderDetails?.productOrders ?? [];

    canvas.ensureSpace(60);
    canvas.text("Items", MARGIN, { size: 10, font: canvas.bold, color: INK });
    canvas.textRight("Quantity", QTY_RIGHT, { size: 10, font: canvas.bold, color: INK });
    canvas.textRight("Price", RIGHT_EDGE, { size: 10, font: canvas.bold, color: INK });
    canvas.divider(10, 14);

    if (productOrders.length === 0) {
        canvas.text("No items", MARGIN, { size: 10, color: MUTED });
        canvas.move(16);
        return;
    }

    for (const po of productOrders) {
        /* Per-item amounts are already in major units, unlike the payment
           totals which arrive in the smallest currency unit. */
        const price = po?.amount?.find((a) => a.currency === currency)?.value
            ?? po?.amount?.[0]?.value
            ?? 0;
        const titleLines = wrapText(sanitize(po?.product?.title ?? "Item"), canvas.regular, 10, ITEMS_COL_WIDTH);
        const rowHeight = Math.max(titleLines.length, 1) * 14 + 6;

        canvas.ensureSpace(rowHeight);
        const rowTop = canvas.y;

        titleLines.forEach((line, index) => {
            canvas.currentPage.drawText(line, {
                x: MARGIN,
                y: rowTop - index * 14,
                size: 10,
                font: canvas.regular,
                color: BODY,
            });
        });

        canvas.textRight(String(po?.quantity ?? 1), QTY_RIGHT, { size: 10 });
        canvas.textRight(formatPdfCurrency(price, currency), RIGHT_EDGE, { size: 10 });
        canvas.move(rowHeight);
    }
};

const drawTotals = (canvas: ReceiptCanvas, orderDetails: IOrderDetails, currency: string) => {
    // Gateway amounts arrive in the smallest currency unit (kobo/cents).
    const rows = [
        { label: "Subtotal", value: (orderDetails?.payment?.itemsTotal ?? 0) / 100 },
        { label: "Delivery Fee", value: (orderDetails?.payment?.deliveryFee ?? 0) / 100 },
        { label: "Applied Voucher Discount", value: (orderDetails?.payment?.appliedVoucherAmount ?? 0) / 100 },
    ];

    canvas.ensureSpace(110);
    canvas.divider(6, 16);

    const labelX = MARGIN + CONTENT_WIDTH * 0.4;
    for (const row of rows) {
        canvas.text(row.label, labelX, { size: 10, color: MUTED });
        canvas.textRight(formatPdfCurrency(row.value, currency), RIGHT_EDGE, { size: 10 });
        canvas.move(17);
    }

    canvas.move(4);
    canvas.currentPage.drawLine({
        start: { x: labelX, y: canvas.y },
        end: { x: RIGHT_EDGE, y: canvas.y },
        thickness: 1,
        color: LINE,
    });
    canvas.move(16);

    canvas.text("Total", labelX, { size: 12, font: canvas.bold, color: INK });
    canvas.textRight(
        formatPdfCurrency((orderDetails?.payment?.total ?? 0) / 100, currency),
        RIGHT_EDGE,
        { size: 12, font: canvas.bold, color: INK },
    );
};

const embedReceiptFonts = async (doc: PDFDocument): Promise<{ regular: PDFFont; bold: PDFFont }> => {
    try {
        doc.registerFontkit(fontkit);
        return {
            regular: await doc.embedFont(MONTSERRAT_REGULAR_BASE64, { subset: true }),
            bold: await doc.embedFont(MONTSERRAT_SEMIBOLD_BASE64, { subset: true }),
        };
    } catch (error) {
        console.log("RECEIPT FONT EMBED FAILED, USING STANDARD FONTS::: ", error);
        return {
            regular: await doc.embedFont(StandardFonts.Helvetica),
            bold: await doc.embedFont(StandardFonts.HelveticaBold),
        };
    }
};

// Returns the finished PDF as base64, ready for react-native-share.
/* fallbackCurrency is the currency the user selected in settings — used only
   when the order payload carries none, so the PDF never invents a symbol. */
const buildReceiptPdfBase64 = async (orderDetails: IOrderDetails, fallbackCurrency: string = "NGN"): Promise<string> => {
    const currency = orderDetails?.payment?.currency || fallbackCurrency;

    const doc = await PDFDocument.create();
    const { regular, bold } = await embedReceiptFonts(doc);
    const canvas = new ReceiptCanvas(doc, regular, bold);

    await drawHeader(canvas, doc);
    drawParties(canvas, orderDetails);
    canvas.divider(20, 18);
    drawItemsTable(canvas, orderDetails, currency);
    drawTotals(canvas, orderDetails, currency);

    doc.setTitle("Zeaper Receipt");
    doc.setSubject(`Receipt for order ${ orderDetails?.orderId ?? "" }`);

    return doc.saveAsBase64();
};

export default buildReceiptPdfBase64;
