import { Request } from "express";
import { prisma } from "../../shared/prisma";
import bcryptjs from "bcryptjs";
import { fileUpload } from "../../helper/fileUploader";
import { UploadApiResponse } from "cloudinary";
import { Prisma, UserRole, UserStatus } from "@prisma/client";
import { userSearchableFields } from "./user.constant";
import { calculatePagination } from "../../helper/paginationHelper";

const createPatient = async (req: Request) => {
  let uploadResult: UploadApiResponse | void;
  console.log(req.file);
  if (req.file) {
    uploadResult = await fileUpload.uploadToCloudinary(req.file);
    console.log(uploadResult);
  }

  const hashedPassword = await bcryptjs.hash(req?.body?.password, 10);

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.email,
        password: hashedPassword,
      },
    });
    return await tnx.patient.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        profilePhoto: uploadResult?.secure_url,
      },
    });
  });

  return result;
};

const createDoctor = async (req: Request) => {
  let uploadResult: UploadApiResponse | void;

  if (req.file) {
    uploadResult = await fileUpload.uploadToCloudinary(req.file);
  }

  const hashedPassword = await bcryptjs.hash(req?.body?.password, 10);

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req?.body?.email,
        password: hashedPassword,
        role: UserRole.DOCTOR,
      },
    });

    delete req.body.password;

    return await tnx.doctor.create({
      data: {
        ...req.body,
        profilePhoto: uploadResult?.secure_url,
      },
    });
  });

  return result;
};

const createAdmin = async (req: Request) => {
  let uploadResult: UploadApiResponse | void;

  if (req.file) {
    uploadResult = await fileUpload.uploadToCloudinary(req.file);
  }

  const hashedPassword = await bcryptjs.hash(req?.body?.password, 10);

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req?.body?.email,
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
    });

    delete req.body.password;

    return await tnx.admin.create({
      data: {
        ...req.body,
        profilePhoto: uploadResult?.secure_url,
      },
    });
  });

  return result;
};

const getAllUser = async (params: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondition: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.UserWhereInput =
    andCondition.length > 0
      ? {
          AND: andCondition,
        }
      : {};

  const res = await prisma.user.findMany({
    skip,
    take: limit,
    where: whereCondition,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.user.count({
    where: whereCondition,
  });

  return {
    data: res,
    meta: {
      page,
      limit,
      total,
    },
  };
};

const changeProfileStatus = async ({
  id,
  payload,
}: {
  id: string;
  payload: { status: UserStatus };
}) => {
  const updatedStatus = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
  });

  return updatedStatus;
};

export const userService = {
  createPatient,
  createDoctor,
  createAdmin,
  getAllUser,
  changeProfileStatus,
};
