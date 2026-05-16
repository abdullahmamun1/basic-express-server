import { Router } from "express";
import { profileController } from "./profile.controllers";

const router = Router();

router.post("/", profileController.createProfile);

export const profileRoute = router;
