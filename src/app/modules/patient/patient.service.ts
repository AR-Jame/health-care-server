import { Prisma } from "@prisma/client";
import { calculatePagination } from "../../helper/paginationHelper";
import { prisma } from "../../shared/prisma";
import { patientSearchableFields } from "./patient.constant";

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

const updatePatient = async (
  id: string,
  payload: Prisma.PatientUncheckedUpdateInput
) => {
  const result = await prisma.patient.update({
    where: { id },
    data: payload,
  });

  return result;
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
  updatePatient
};
