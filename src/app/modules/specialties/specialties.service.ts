import { UploadApiResponse } from "cloudinary";
import { Request } from "express";
import { fileUpload } from "../../helper/fileUploader";
import { prisma } from "../../shared/prisma";
import ApiError from "../../error/ApiError";

const createSpecialties = async (req: Request) => {
  let uploadResult: UploadApiResponse | void;

  if (req.file) {
    uploadResult = await fileUpload.uploadToCloudinary(req.file);
    console.log(uploadResult);
  } else {
    throw new ApiError(500, "Please provide a file also");
  }

  if (!uploadResult?.secure_url) {
    throw new ApiError(500, "Image upload failed. Please try again later.");
  }

  const result = await prisma.specialties.create({
    data: {
      title: req.body.title,
      icon: uploadResult?.secure_url,
    },
  });

  return result;
};

const getAllSpecialty = async () => {
  const result = await prisma.specialties.findMany();
  return result;
};

const deleteSpecialty = async (id: string) => {
  const result = await prisma.specialties.delete({
    where: {
      id: id,
    },
  });
};

export const specialtiesService = {
  createSpecialties,
  deleteSpecialty,
  getAllSpecialty,
};
