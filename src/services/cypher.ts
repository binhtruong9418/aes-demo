import aesjs from "aes-js";

export const IV = "c4400e655c3be674d3cf74df66e17e1e";
export const sha256 = async (message: string) => {
    //hash the pin use sha256
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string                  
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

export const getCipherKey = async (PIN: string, encryptedKey: string) => {
    const hashedPin = await sha256(PIN);
    const hashedPinBytes = aesjs.utils.hex.toBytes(hashedPin);
    //use the hashed pin to decrypt the encrypted key using aes-256-cbc
    const ivBytes = aesjs.utils.hex.toBytes(IV);
    const aesCbc = new aesjs.ModeOfOperation.cbc(hashedPinBytes, ivBytes);
    //set block size to 256

    const encryptedBytes = aesjs.utils.hex.toBytes(encryptedKey);
    console.log({ encryptedBytes });
    const decryptedBytes = aesCbc.decrypt(encryptedBytes);
    //we just need the first 32 bytes the rest is 101010 (non-sense)
    const slice = decryptedBytes.slice(0, 32);
    const cipherKey = aesjs.utils.hex.fromBytes(slice);
    return cipherKey;
}