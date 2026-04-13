import type { Request, Response } from "express";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.utils.ts";
import { ApiError, ApiSuccessRes } from "../utils/apiResponse.utils.ts";
import {
    uploadToImageKit,
    uploadMultipleToImageKit,
} from "../services/upload.service.ts";

export const uploadSingleFile = asyncErrorHandler(
    async (req: Request, res: Response) => {
        if (!req.file) throw ApiError.badRequest("No file provided");

        const result = await uploadToImageKit(
            req.file,
            (req.body.folder as string) || "/uploads"
        );

        return res
            .status(200)
            .json(new ApiSuccessRes(200, "File uploaded successfully", result));
    }
);

export const uploadMultipleFiles = asyncErrorHandler(
    async (req: Request, res: Response) => {
        const files = req.files as Express.Multer.File[] | undefined;
        if (!files || files.length === 0)
            throw ApiError.badRequest("No files provided");

        const results = await uploadMultipleToImageKit(
            files,
            (req.body.folder as string) || "/uploads"
        );

        return res
            .status(200)
            .json(
                new ApiSuccessRes(200, "Files uploaded successfully", results)
            );
    }
);
