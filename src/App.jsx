import React, { useState } from "react";
import aesjs from "aes-js";

const App = () => {
    const [file, setFile] = useState(null);
    const [encryptedFile, setEncryptedFile] = useState(null);
    const [decryptedFile, setDecryptedFile] = useState(null);

    var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleEncrypt = async () => {
        setDecryptedFile(null);
        if (!file) return;

        const fileContents = await readFileAsArrayBuffer(file);
        const encryptFileData = new Uint8Array(fileContents);
        console.log(encryptFileData, "encryptFileData");

        // Create a new AES-CTR mode instance
        const aesCtr = new aesjs.ModeOfOperation.ctr(key);

        // Encrypt the input file contents
        const encryptedBytes = aesCtr.encrypt(encryptFileData);
        console.log(encryptedBytes, "encryptedBytes");

        // Write the encrypted file to a new file
        const encryptedFile = new Blob([encryptedBytes], { type: file.type });
        console.log(encryptedFile, "encryptedFile");

        setEncryptedFile(encryptedFile);
    };

    const handleDecrypt = async () => {
        setEncryptedFile(null);
        if (!file) return;

        const fileContents = await readFileAsArrayBuffer(file);
        const decryptedFileData = new Uint8Array(fileContents);

        // const key = generateKey(password);

        const aesCtr = new aesjs.ModeOfOperation.ctr(key);

        // Decrypt the encrypted file contents
        const decryptedBytes = aesCtr.decrypt(decryptedFileData);
        console.log(decryptedBytes, "decryptedBytes");

        // Write the decrypted file to a new file
        const decryptedFile = new Blob([decryptedBytes], {
            type: file.type,
        });
        console.log(decryptedFile, "decryptedFile");
        setDecryptedFile(decryptedFile);
    };

    const handleSave = (file) => {
        const downloadLink = document.createElement("a");
        const url = URL.createObjectURL(file);
        downloadLink.href = url;
        downloadLink.download = file.name;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    const readFileAsArrayBuffer = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsArrayBuffer(file);
        });
    };
    return (
        <div>
            <h1>File Encryption/Decryption</h1>
            <div>
                <label htmlFor="file-input">Choose a file:</label>
                <input
                    type="file"
                    id="file-input"
                    onChange={handleFileChange}
                />
            </div>
            <div>
                <button onClick={handleEncrypt}>Encrypt</button>
                <button onClick={handleDecrypt}>Decrypt</button>
            </div>
            {encryptedFile && (
                <div>
                    <h2>Encrypted File</h2>
                    <p>Click the button below to save the encrypted file:</p>
                    <button onClick={() => handleSave(encryptedFile)}>
                        Save Encrypted File
                    </button>
                </div>
            )}
            {decryptedFile && (
                <div>
                    <h2>Decrypted File</h2>
                    <p>Click the button below to save the decrypted file:</p>
                    <button onClick={() => handleSave(decryptedFile)}>
                        Save Decrypted File
                    </button>
                </div>
            )}
        </div>
    );
};

export default App;
