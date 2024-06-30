import { Router } from "express";
import { needsPhotographerToken, needsClientToken } from "../middleware/authMiddleware";
import {errorMiddleware} from "../middleware/errorHandler";
import { photographerAuthController } from "../controllers/photographerAuthController";
import { clientAuthController } from "../controllers/clientAuthController"
import { albumController } from "../controllers/albumController";
import { photoController, upload } from '../controllers/photoController';
import { clientController } from "../controllers/clientController";
import { paymentController } from "../controllers/paymentController";

const router = Router();

router.post('/photographer/login', errorMiddleware(photographerAuthController.loginPhotographer));

router.post('/client/getOtp', errorMiddleware(clientAuthController.sendOtp));
router.get('/client/checkOtp', errorMiddleware(clientAuthController.checkOtp));

router.get('/client/info', errorMiddleware(needsClientToken(clientController.getInfo)));
router.post('/client/change/name', errorMiddleware(needsClientToken(clientController.changeName)));
router.post('/client/change/email', errorMiddleware(needsClientToken(clientController.changeEmail)));
router.get('/client/albums', errorMiddleware(needsClientToken(clientController.getAlbums)));
router.get('/client/photos', errorMiddleware(needsClientToken(clientController.getPhotos)));
router.get('/client/dashboard', errorMiddleware(needsClientToken(clientController.getDashboard)));

router.post('/photographer/newAlbum', errorMiddleware(needsPhotographerToken(albumController.createAlbum)));
router.get('/photographer/albums', errorMiddleware(needsPhotographerToken(albumController.getAlbums)));
router.get('/photographer/albumInfo', errorMiddleware(needsPhotographerToken(albumController.getInfo)));

router.post('/photographer/uploadPhotos', upload.array('photos', 10), errorMiddleware(needsPhotographerToken(photoController.uploadPhotographerPhotos)));
router.post('/client/uploadSelfies', upload.array('selfies', 10), errorMiddleware(needsClientToken(photoController.uploadSelfies)));
router.post('/photographer/clients', errorMiddleware(needsPhotographerToken(photoController.addClients)))

router.post('/stripe/createPaymentIntent', errorMiddleware(needsClientToken(paymentController.createPayment)));
router.get('/stripe/getPaymentIntentStatus', errorMiddleware(needsClientToken(paymentController.getPaymentIntentStatus)));
router.post('/stripe/webhook', errorMiddleware(paymentController.webhook));

export { router };