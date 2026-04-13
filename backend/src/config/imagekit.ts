import ImageKit from "@imagekit/nodejs";
import { envConfig } from "../envConfig.ts";

const imagekit = new ImageKit({
    privateKey: envConfig.IMAGEKIT_PRIVATE_KEY,
});

export default imagekit;
