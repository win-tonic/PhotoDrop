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

router.post('/loginPhotographer', errorMiddleware(photographerAuthController.loginPhotographer));

router.post('/getOtp', errorMiddleware(clientAuthController.sendOtp));
router.get('/checkOtp', errorMiddleware(clientAuthController.checkOtp));

router.get('/getClientInfo', errorMiddleware(needsClientToken(clientController.getInfo)));
router.post('/changeName', errorMiddleware(needsClientToken(clientController.changeName)));
router.post('/changeEmaiil', errorMiddleware(needsClientToken(clientController.changeEmail)));
router.get('/getClientAlbums', errorMiddleware(needsClientToken(clientController.getAlbums)));
router.get('/getClientPhotos', errorMiddleware(needsClientToken(clientController.getPhotos)));
router.get('/getClientDashboard', errorMiddleware(needsClientToken(clientController.getDashboard)));

router.post('/createAlbum', errorMiddleware(needsPhotographerToken(albumController.createAlbum)));
router.get('/getPhotographerAlbums', errorMiddleware(needsPhotographerToken(albumController.getAlbums)));
router.get('/getAlbumInfo', errorMiddleware(needsPhotographerToken(albumController.getInfo)));

router.post('/uploadPhotos', upload.array('photos', 10), errorMiddleware(needsPhotographerToken(photoController.uploadPhotographerPhotos)));
router.post('/uploadSelfies', upload.array('selfies', 10), errorMiddleware(needsClientToken(photoController.uploadSelfies)));
router.post('/addClients', errorMiddleware(needsPhotographerToken(photoController.addClients)))

router.post('/stripe/createPaymentIntent', errorMiddleware(needsClientToken(paymentController.createPayment)));
router.get('/stripe/getPaymentIntentStatus', errorMiddleware(needsClientToken(paymentController.getPaymentIntentStatus)));
router.post('/stripe/webhook', errorMiddleware(paymentController.webhook));

export { router };