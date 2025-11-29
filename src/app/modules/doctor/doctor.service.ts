import { DoctorSpecialties, Prisma } from "@prisma/client";
import { calculatePagination } from "../../helper/paginationHelper";
import { doctorSearchableFields } from "./doctor.constant";
import { prisma } from "../../shared/prisma";
import { IDoctor } from "./doctor.interface";
import { openai } from "../../helper/open-router";
import ApiError from "../../error/ApiError";
import { extractJsonFromMessage } from "../../helper/extractJsonFromMessage";

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

  if (specialties) {
    andCondition.push({
      doctorSpecialties: {
        some: {
          specialties: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
      },
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
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
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

const getDoctorById = async (id: string) => {
  const result = await prisma.doctor.findUnique({
    where: {
      id: id,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
      doctorSchedule: {
        include: {
          Schedule: true,
        },
      },
    },
  });

  return result;
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

const deleteDoctor = async (id: string) => {
  // TODO: we have to sync doctor schedule before doctor deletion.

  const result = await prisma.doctor.delete({
    where: {
      id: id,
    },
  });

  return result;
};

const getAISuggestion = async (symptoms: string) => {
  if (!symptoms) {
    throw new ApiError(500, "Please provide symptoms.");
  }

  const doctors = await prisma.doctor.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  const prompt = `You are a medical assistant AI. Based on the patient's symptoms, suggest the top 3 most suitable doctors.
Each doctor has specialties and years of experience.
Only suggest doctors who are relevant to the given symptoms.

Symptoms: ${symptoms}

Here is the doctor list (in JSON):
${JSON.stringify(doctors, null, 2)}

Return your response in JSON format with full individual doctor data. 
`;

  console.log("analyzing......\n");

  const completion = await openai.chat.completions.create({
    model: "x-ai/grok-4.1-fast:free",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful AI medical assistant that provides doctor suggestions.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const result = await extractJsonFromMessage(completion.choices[0].message);
  return result;
};

export const doctorServices = {
  getAllDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorById,
  getAISuggestion,
};
