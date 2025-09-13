// import { WebQRScannerV2 } from "@/src/components/import-page/scanner/WebQRScannerV2"
// file = Html5QrcodePlugin.jsx
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Html5QrcodeScannerConfig } from 'html5-qrcode/esm/html5-qrcode-scanner';
import { useEffect } from 'react';

const qrcodeRegionId = "html5qr-code-full-region";


interface Html5QrcodePluginProps {
  fps: number;
  qrbox: number;
  aspectRatio: number;
  disableFlip: boolean;
  verbose: boolean;

  onQrCodeSuccessCallback: (decodedText: string, decodedResult: any) => void;
}

  
export const Html5QrCodeScanner = ({
  fps,
  qrbox,
  aspectRatio,
  disableFlip,
  verbose,
  onQrCodeSuccessCallback,
}: Html5QrcodePluginProps) => {

  // const onQrCodeSuccessCallback = (decodedText: string, decodedResult: any) => {
  //   console.log(`Scan result: ${decodedText}`, decodedResult);
  // };

  const onQrCodeErrorCallback = (error: any) => {
    // console.log("QR code error: ", error);
  };

  useEffect(() => {
      // when component mounts
      // const config = createConfig(props);
      // const config = {
      //   // fps: props.fps,
      //   // qrbox: props.qrbox,
      //   // aspectRatio: props.aspectRatio,
      //   // disableFlip: props.disableFlip,
      //   fps: 10,
      //   qrbox: 250,
      //   aspectRatio: 1.0,
      //   disableFlip: false,

      // };

      const config = {
        fps,
        qrbox,
        aspectRatio,
        disableFlip,
      } satisfies Html5QrcodeScannerConfig;

      // const verbose = props.verbose === true;
      // const verbose = true;
      // Suceess callback is required.
      // if (!(props.qrCodeSuccessCallback)) {
      //     throw "qrCodeSuccessCallback is required callback.";
      // }
      const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);
      html5QrcodeScanner.render(onQrCodeSuccessCallback, onQrCodeErrorCallback);

      // cleanup function when component will unmount
      return () => {
        html5QrcodeScanner.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
      };
    }, []);

    return (
      <div id={qrcodeRegionId} />
    );
};

// export default Html5QrcodePlugin;



//   return (
//     <WebQRScannerV2
//       onQRCodeScanned={() => {}}
//       isActive={true}
//       onStatusChange={() => {}}
//       scanStatus="Ready to scan"
//     />
//   );
// };

// export default Raw;
