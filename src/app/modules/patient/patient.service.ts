import { prisma } from "../../shared/prisma";

const getAllPatient = async () => {
  const result = await prisma.patient.findMany();
  return result;
};

export const patientService = {
  getAllPatient,
};
