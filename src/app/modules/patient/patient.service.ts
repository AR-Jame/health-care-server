import { Prisma } from "@prisma/client";
import { calculatePagination } from "../../helper/paginationHelper";
import { prisma } from "../../shared/prisma";
import { patientSearchableFields } from "./patient.constant";
import { JwtPayload } from "jsonwebtoken";

const getAllPatient = async ({ options, filters }: any) => {
  const { sortBy, sortOrder, limit, page, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andCondition: Prisma.PatientWhereInput[] = [];

  if (searchTerm) {
    const searchArray = patientSearchableFields.map((term) => ({
      [term]: {
        contains: searchTerm,
        mode: "insensitive",
      },
    }));
    andCondition.push({ OR: searchArray });
  }

  if (Object.keys(filterData).length > 0) {
    const filterArray = Object.keys(filterData).map((value) => ({
      [value]: {
        equals: filterData[value],
      },
    }));

    andCondition.push(...filterArray);
  }

  const whereInput: Prisma.PatientWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.patient.findMany({
    where: whereInput,
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.patient.count({ where: whereInput });

  return {
    data: result,
    meta: {
      page,
      limit,
      total,
    },
  };
};

const getPatientById = async (id: string) => {
  const result = await prisma.patient.findUnique({
    where: {
      id: id,
    },
  });

  return result;
};

const updatePatient = async (user: JwtPayload, payload: any) => {
  const { patientHealthData, medicalReport, ...patientData } = payload;

  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: { email: user.email, isDeleted: false },
  });

  return await prisma.$transaction(async (tnx) => {
    await tnx.patient.update({
      where: { id: patientInfo.id },
      data: patientData,
    });

    if (patientHealthData) {
      await tnx.patientHealthData.upsert({
        where: {
          patientId: patientInfo.id,
        },
        update: patientHealthData,
        create: {
          ...patientHealthData,
          patientId: patientInfo.id,
        },
      });
    }

    if (medicalReport) {
      await tnx.medicalReport.create({
        data: {
          ...medicalReport,
          patientId: patientInfo.id,
        },
      });
    }

    return await prisma.patient.findUniqueOrThrow({
      where: { id: patientInfo.id },
      include: {
        patientHealthData: true,
        medicalReports: true,
      },
    });
  });
};

const deletePatient = async (id: string) => {
  const result = await prisma.patient.delete({
    where: {
      id: id,
    },
  });

  return result;
};

export const patientService = {
  getAllPatient,
  getPatientById,
  deletePatient,
  updatePatient,
};
