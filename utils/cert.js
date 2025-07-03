import fs from "fs";
import process from "process";

const certdir = "C:\\Users\\adeni\\Documents\\Cert\\";
let certOptions = {};
if (fs.existsSync(`${certdir}localhost.key`) && fs.existsSync(`${certdir}localhost.crt`)) {
  certOptions = {
    key: fs.readFileSync(`${certdir}localhost.key`),
    cert: fs.readFileSync(`${certdir}localhost.crt`),
    passphrase: process.env.CERT_PASSWORD
  };
}

export { certOptions };