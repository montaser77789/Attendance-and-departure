declare module 'pdfmake/build/pdfmake' {
    interface PdfMake {
      vfs: { [key: string]: string };
      createPdf(docDefinition: DocumentDefinition): {
        download(filename: string): void;
      };
    }
    const pdfMake: PdfMake;
    export default pdfMake;
  }
  