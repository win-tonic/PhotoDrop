import { Router } from "express";
import { authController } from "../controllers/authController";
import { albumController} from "../controllers/albumController"

const router = Router();

router.post('/loginPhotographer', authController.loginPhotographer);

export { router };