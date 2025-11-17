import { DoctorSpecialties, Prisma } from "@prisma/client";
import { calculatePagination } from "../../helper/paginationHelper";
import { doctorSearchableFields } from "./doctor.constant";
import { prisma } from "../../shared/prisma";
import { IDoctor } from "./doctor.interface";

const getAllDoctor = async (options: any, filters: any) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);

  const { searchTerm, specialties, ...filterData } = filters;

  const andCondition: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: filterData[key],
      },
    }));
    andCondition.push(...filterConditions);
  }

  const whereConditions: Prisma.DoctorWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.doctor.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateDoctor = async (id: string, payload: Partial<IDoctor>) => {
  console.log(id);

  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const { specialties, ...doctorData } = payload;

  // Here we use transaction rollback 

  return await prisma.$transaction(async (tnx) => {
    if (specialties && specialties.length > 0) {
      const deleteSpecialty: string[] = [];
      const createSpecialty: DoctorSpecialties[] = [];

      specialties.forEach((specialty) => {
        if (specialty.isDeleted) {
          deleteSpecialty.push(specialty.id);
        } else {
          createSpecialty.push({
            specialtiesId: specialty.id,
            doctorId: id,
          });
        }
      });

      if (deleteSpecialty.length > 0) {
        await tnx.doctorSpecialties.deleteMany({
          where: {
            doctorId: id,
            specialtiesId: {
              in: deleteSpecialty,
            },
          },
        });
      }

      if (createSpecialty.length > 0) {
        await tnx.doctorSpecialties.createMany({
          data: createSpecialty,
        });
      }
    }

    const updatedData = await tnx.doctor.update({
      where: {
        id: doctorInfo.id,
      },
      include: {
        doctorSpecialties: {
          include: { specialties: true },
        },
      },
      data: doctorData,
    });

    return updatedData;
  });
};

export const doctorServices = {
  getAllDoctor,
  updateDoctor,
};
