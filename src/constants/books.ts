export interface Textbook {
  id: string;
  title: string;
  coverUrl: string;
  pdfUrl: string;
}

export const TEXTBOOKS: Textbook[] = [
  {
    id: "sejarah-tingkatan-5",
    title: "Sejarah Tingkatan 5",
    coverUrl:
      "https://drive.google.com/uc?export=view&id=16RN49TBSr_6L3U4wUDlDV2oH6eQTYrGh",
    pdfUrl:
      "https://drive.google.com/file/d/1Ofe0YukHiyG-OEcnk1jeZ9wnMupFhVoQ/preview", // Sample PDF
  },
];
