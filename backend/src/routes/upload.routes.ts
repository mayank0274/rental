import { Router } from "express";
import multer from "multer";
import {
    uploadSingleFile,
    uploadMultipleFiles,
} from "../controllers/upload.controller.ts";
import { authenticate } from "../middlewares/authenticate.middleware.ts";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/svg+xml",
        ];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`File type ${file.mimetype} is not allowed`));
        }
    },
});

const uploadRouter = Router();

uploadRouter.post(
    "/single",
    // authenticate,
    upload.single("file"),
    uploadSingleFile
);

uploadRouter.post(
    "/multiple",
    // authenticate,
    upload.array("files", 4),
    uploadMultipleFiles
);

export default uploadRouter;
