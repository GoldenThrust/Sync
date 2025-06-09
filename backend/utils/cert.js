import fs from "fs";

const certdir = "C:\\Users\\adeni\\Documents\\Cert\\";

export const certOptions = {
  key: fs.readFileSync(`${certdir}localhost.key`),
  cert: fs.readFileSync(`${certdir}localhost.crt`),
  passphrase: process.env.CERT_PASSWORD
};