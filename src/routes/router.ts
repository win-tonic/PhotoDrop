import { Router } from "express";
import { authController } from "../middleware/temporarynameauth";

const router = Router();

router.post('/loginPhotographer', authController.loginPhotographer);

export { router };