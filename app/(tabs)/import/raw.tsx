import { Html5QrCodeScanner } from '@/src/components/import-page/scanner/Html5QrScanner';


const Raw = () => {
  return (
    <Html5QrCodeScanner
      fps={10}
      qrbox={250}
      aspectRatio={1.0}
      disableFlip={false}
      verbose={true}
      onQrCodeSuccessCallback={() => {}}
    />
  );
};

export default Raw;
