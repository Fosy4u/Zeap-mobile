import CryptoJS from "crypto-js";

// Shared with the web client — the backend decrypts passwords sent to
// /user/guest/convert/emailPassword with this passphrase.
const PASSWORD_PASSPHRASE = "emVhcCBmYXNoaW9uIGFwcCBpcyBvd25lZCBieSBhcmluemUgYnV0IGJ1aWx0IGJ5IGZvc3Rlcg==";

// Produces the same OpenSSL-style output as the web's CryptoJS.AES.encrypt(password, passphrase).
// React Native has no native crypto for CryptoJS's random salt, so the salt is generated here.
const encryptPassword = (password: string): string => {
    const saltWords = Array.from({ length: 2 }, () => Math.floor(Math.random() * 0x100000000) | 0);
    const salt = CryptoJS.lib.WordArray.create(saltWords, 8);
    const derived = CryptoJS.kdf.OpenSSL.execute(PASSWORD_PASSPHRASE, 256 / 32, 128 / 32, salt);
    const encrypted = CryptoJS.AES.encrypt(password, derived.key, { iv: derived.iv });

    return CryptoJS.lib.CipherParams.create({ ciphertext: encrypted.ciphertext, salt }).toString(CryptoJS.format.OpenSSL);
};

export default encryptPassword;
