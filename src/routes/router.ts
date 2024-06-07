import { Router } from "express";
import { authController } from "../controllers/authController";
import { albumController} from "../controllers/albumController";
import { photoController, upload } from '../controllers/photoController';

const router = Router();

router.post('/loginPhotographer', authController.loginPhotographer);

router.post('/createAlbum', albumController.createAlbum);
router.get('/getAlbumInfo', albumController.getInfo);
router.get('/getAlbumPhotos', albumController.getPhotos);

router.post('/uploadPhotos', upload.array('photos', 10), photoController.uploadPhotos);
router.post('/addClients', photoController.addClients)

export { router };