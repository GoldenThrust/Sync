import fs from "fs";
import process from "process";

const certdir = "C:\\Users\\adeni\\Documents\\Cert\\";

if (fs.existsSync(`${certdir}localhost.key`) && fs.existsSync(`${certdir}localhost.crt`)) {
  export const certOptions = {
    key: fs.readFileSync(`${certdir}localhost.key`),
    cert: fs.readFileSync(`${certdir}localhost.crt`),
    passphrase: process.env.CERT_PASSWORD
  };
}