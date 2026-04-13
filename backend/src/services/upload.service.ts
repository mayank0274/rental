import { toFile } from "@imagekit/nodejs";
import imagekit from "../config/imagekit.ts";

interface UploadResult {
    url: string;
    fileId: string;
    name: string;
}


export const uploadToImageKit = async (
    file: Express.Multer.File,
    folder = "/uploads"
): Promise<UploadResult> => {
    // Convert Buffer to File object required by @imagekit/nodejs v7
    const ikFile = await toFile(file.buffer, file.originalname);

    const response = await imagekit.files.upload({
        file: ikFile,
        fileName: file.originalname,
        folder,
    });

    return {
        url: response.url || "",
        fileId: response.fileId || "",
        name: response.name || "",
    };
};

export const uploadMultipleToImageKit = async (
    files: Express.Multer.File[],
    folder = "/uploads"
): Promise<UploadResult[]> => {
    const results = await Promise.all(
        files.map((file) => uploadToImageKit(file, folder))
    );
    return results;
};
