import { Router } from "express";
import {
    createRentalItem,
    deleteRentalItem,
    getMyRentalItems,
    listPublicRentalItems,
    updateRentalItem,
} from "../controllers/rentalItems.controller.ts";
import { authenticate } from "../middlewares/authenticate.middleware.ts";

const rentalItemsRouter = Router();

rentalItemsRouter.get("/", listPublicRentalItems);
rentalItemsRouter.get("/me", authenticate, getMyRentalItems);
rentalItemsRouter.post("/", authenticate, createRentalItem);
rentalItemsRouter.put("/:id", authenticate, updateRentalItem);
rentalItemsRouter.delete("/:id", authenticate, deleteRentalItem);

export default rentalItemsRouter;
