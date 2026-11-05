import CryptoJS from "crypto-js";

const encryptPassword = (password: string): string => {
    const passphrase = process.env.REACT_APP_ENCRYPTION_KEY;
    if (!passphrase) {
        throw new Error("Sign-up is temporarily unavailable. Please try again later.");
    }

    const saltWords = Array.from({ length: 2 }, () => Math.floor(Math.random() * 0x100000000) | 0);
    const salt = CryptoJS.lib.WordArray.create(saltWords, 8);
    const derived = CryptoJS.kdf.OpenSSL.execute(passphrase, 256 / 32, 128 / 32, salt);
    const encrypted = CryptoJS.AES.encrypt(password, derived.key, { iv: derived.iv });

    return CryptoJS.lib.CipherParams.create({ ciphertext: encrypted.ciphertext, salt }).toString(CryptoJS.format.OpenSSL);
};

export default encryptPassword;
