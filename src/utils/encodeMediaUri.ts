// Safely encodes a backend media URL so filenames containing spaces or other
// unencoded characters (e.g. "Promo slide 1 (1).mp4") resolve in the native
// image/video players. An unencoded space makes the player fail to load, which
// leaves the media empty/zero-sized — so it doesn't span its container.
//
// `decodeURI` first then `encodeURI` makes it idempotent: a raw link gets its
// spaces encoded, and an already-encoded link is left unchanged (no double
// "%2520"). Malformed input falls back to a plain encode.
const encodeMediaUri = (url?: string): string => {
    if (!url) return "";

    const trimmed = url.trim();
    try {
        return encodeURI(decodeURI(trimmed));
    } catch {
        return encodeURI(trimmed);
    }
};

export default encodeMediaUri;
