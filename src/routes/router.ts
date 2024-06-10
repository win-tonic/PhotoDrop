import { Router } from "express";
import { needsPhotographerToken, needsClientToken } from "../middleware/authMiddleware";
import { photographerAuthController } from "../controllers/photographerAuthController";
import { clientAuthController } from "../controllers/clientAuthController"
import { albumController} from "../controllers/albumController";
import { photoController, upload } from '../controllers/photoController';
import {clientController} from "../controllers/clientController";

const router = Router();

router.post('/loginPhotographer', photographerAuthController.loginPhotographer);

router.post('/getOtp', clientAuthController.sendOtp);
router.get('/checkOtp', clientAuthController.checkOtp);

router.get('/getClientInfo', needsClientToken(clientController.getInfo));
router.post('/changeName', needsClientToken(clientController.changeName));
router.get('/getClientAlbums', needsClientToken(clientController.getAlbums));
router.get('/getClientPhotos', needsClientToken(clientController.getPhotos));
router.get('/getClientDashboard', needsClientToken(clientController.getDashboard));

router.post('/createAlbum', needsPhotographerToken(albumController.createAlbum));
router.get('/getPhotographerAlbums', needsPhotographerToken(albumController.getAlbums));
router.get('/getAlbumInfo', needsPhotographerToken(albumController.getInfo));

router.post('/uploadPhotos', upload.array('photos', 10), needsPhotographerToken(photoController.uploadPhotographerPhotos));
router.post('/uploadSelfies', upload.array('selfies', 10), needsClientToken(photoController.uploadSelfies));
router.post('/addClients', needsPhotographerToken(photoController.addClients))

export { router };