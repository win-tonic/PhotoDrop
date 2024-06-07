import { Router } from "express";
import { needsToken } from "../middleware/authMiddleware";
import { authController } from "../controllers/authController";
import { albumController} from "../controllers/albumController";
import { photoController, upload } from '../controllers/photoController';

const router = Router();

router.post('/loginPhotographer', authController.loginPhotographer);

router.post('/createAlbum', needsToken(albumController.createAlbum));
router.get('/getAlbumInfo', needsToken(albumController.getInfo));
router.get('/getAlbumPhotos', needsToken(albumController.getPhotos));

router.post('/uploadPhotos', upload.array('photos', 10), needsToken(photoController.uploadPhotos));
router.post('/addClients', needsToken(photoController.addClients))

export { router };