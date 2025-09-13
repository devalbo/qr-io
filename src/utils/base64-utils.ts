import { Buffer } from "buffer";


export const convertBase64ToBinary = (base64Content: string): Uint8Array => {
  return Buffer.from(base64Content, "base64");
  // const binary = atob(base64Content);
  
  // const binaryArray = new Uint8Array(binary.length);
  // for (let i = 0; i < binary.length; i++) {
  //   binaryArray[i] = binary.charCodeAt(i);
  // }
  // return binaryArray;  
}


export const convertBinaryToBase64 = (binaryContent: Uint8Array): string => {
  const b64 = Buffer.from(binaryContent).toString('base64');
  // const b64 = btoa(String.fromCharCode(...binaryContent));
  return b64;
}
