export interface Player {
    id: number;
    firstName: string;
    nationality: string;
    idNumber: string;
    image: string | File | undefined; // Allow both string and File
    birthday: string;
    phoneNumber: string;
    category: string;
    coach: string;
  }
  