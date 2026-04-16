import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware.ts";
import {
    getConversationMessages,
    getMyConversations,
} from "../controllers/chat.controller.ts";

const chatRouter = Router();

// All chat routes require authentication
chatRouter.use(authenticate);

chatRouter.get("/conversations", getMyConversations);
chatRouter.get("/conversations/:item_id/:other_user_id", getConversationMessages);

export default chatRouter;
