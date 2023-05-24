import React, { useState } from "react";
import aesjs from "aes-js";
import FileSaver from "file-saver";
import CryptoJS from "crypto-js";

const App = () => {
    const [file, setFile] = useState(null);
    const [encryptedFile, setEncryptedFile] = useState(null);
    const [decryptedFile, setDecryptedFile] = useState(null);

    var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

    // const keyString =
    //     "2ddcea99ec2e73772fa86f9761a927fdf037e283383e32210c78a48f6f9fc15331fa66ee707dc480926b70279f827c71";
    const ivString = "c4400e655c3be674d3cf74df66e17e1e";
    // const key = CryptoJS.enc.Hex.parse(keyString);

    // const iv = aesjs.utils.hex
    //     .toBytes(ivString)
    // const iv = aesjs.utils.randomBytes(16);
    const iv = aesjs.utils.hex.toBytes(ivString);

    console.log(iv, "iv");
    console.log(ivString, "ivString");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleEncrypt = async () => {
        setDecryptedFile(null);
        if (!file) return;

        console.log(key, "key");
        // console.log(iv, "iv");

        const fileContents = await readFileAsArrayBuffer(file);
        const encryptFileData = new Uint8Array(fileContents);
        console.log(encryptFileData, "encryptFileData");

        // Create a new AES-CBC mode instance
        const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);

        const paddedFileData = aesjs.padding.pkcs7.pad(encryptFileData);

        // Encrypt the input file contents
        const encryptedBytes = aesCbc.encrypt(paddedFileData);
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

        const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);

        // Decrypt the encrypted file contents
        const decryptedBytes = aesCbc.decrypt(decryptedFileData);
        console.log(decryptedBytes, "decryptedBytes");

        const unpaddedDecryptedBytes =
            aesjs.padding.pkcs7.strip(decryptedBytes);

        // Write the decrypted file to a new file
        const decryptedFile = new Blob([unpaddedDecryptedBytes], {
            type: file.type,
        });
        console.log(decryptedFile, "decryptedFile");
        setDecryptedFile(decryptedFile);
    };

    const handleSave = (file) => {
        FileSaver.saveAs(file, file.name);
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

// import React from "react";
// import aesjs from "aes-js";
// import FileSaver from "file-saver";

// const App = () => {
//     const [file, setFile] = React.useState(null);
//     const [encryptedFile, setEncryptedFile] = React.useState(null);
//     const [decryptedFile, setDecryptedFile] = React.useState(null);

//     const handleFileChange = (e) => {
//         setFile(e.target.files[0]);
//     };
//     const key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
//     const iv = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];

//     const handleFileEncrypt = () => {
//         const reader = new FileReader();
//         setDecryptedFile(null);
//         reader.onload = () => {
//             const fileData = new Uint8Array(reader.result);

//             const paddedFileData = aesjs.padding.pkcs7.pad(fileData);

//             const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
//             const encryptedBytes = aesCbc.encrypt(paddedFileData);

//             // save the encrypted file
//             const encryptedBlob = new Blob([encryptedBytes], {
//                 type: file.type,
//             });
//             setEncryptedFile(encryptedBlob);
//         };
//         reader.readAsArrayBuffer(file);
//     };

//     const handleFileDecrypt = () => {
//         const reader = new FileReader();
//         setEncryptedFile(null);
//         reader.onload = () => {
//             // convert file data to array buffer
//             const fileData = new Uint8Array(reader.result);

//             // extract IV and encrypted bytes
//             const encryptedBytes = fileData.slice(16);

//             // decrypt the file data
//             const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
//             const decryptedBytes = aesCbc.decrypt(encryptedBytes);

//             const unpaddedDecryptedBytes =
//                 aesjs.padding.pkcs7.strip(decryptedBytes);

//             // save the decrypted file
//             const decryptedBlob = new Blob([unpaddedDecryptedBytes], {
//                 type: file.type,
//             });
//             setDecryptedFile(decryptedBlob);
//         };
//         reader.readAsArrayBuffer(file);
//     };

//     const handleFileSaveEncrypt = () => {
//         if (encryptedFile) {
//             FileSaver.saveAs(file, file.name);
//         }
//     };

//     const handleFileSaveDecrypt = () => {
//         if (decryptedFile) {
//             FileSaver.saveAs(file, file.name );
//         }
//     };

//     return (
//         <div>
//             <input type="file" onChange={handleFileChange} />
//             <button onClick={handleFileEncrypt}>Encrypt</button>
//             <button onClick={handleFileDecrypt}>Decrypt</button>
//             {encryptedFile && (
//                 <div>
//                     <h3>Encrypted File:</h3>
//                     <button onClick={handleFileSaveEncrypt}>
//                         Save Encrypted File
//                     </button>
//                 </div>
//             )}
//             {decryptedFile && (
//                 <div>
//                     <h3>Decrypted File:</h3>
//                     <button onClick={handleFileSaveDecrypt}>
//                         Save Decrypted File
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default App;
