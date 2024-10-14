import { PinataSDK } from "pinata-web3";

export const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL
})


export const defaultGroupId = '1c988f08-cc83-4268-8079-9a8585aecd7d';
