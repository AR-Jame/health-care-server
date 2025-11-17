import { Gender } from "@prisma/client";

interface ISpecialty {
  id: string;
  isDeleted?: boolean;
}

export interface IDoctor {
  name: string;
  email: string;
  profilePhoto: string | null;
  contactNumber: string;
  address: string;
  registrationNumber: string;
  experience: number;
  gender: Gender;
  appointmentFee: number;
  qualification: string;
  currentWorkingPlace: string;
  designation: string;
  isDeleted: boolean;
  specialties: ISpecialty[];
}
