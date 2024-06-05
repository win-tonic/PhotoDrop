//maybe wrong controller and middleware logic, check if that correct
import { Request, Response, NextFunction } from 'express';
import { authPhotographersController } from '../controllers/authPhotographersController';

class AuthController{

    public async loginPhotographer(req: Request, res: Response){
        const login = req.query.login as string;
        const password = req.query.password as string;
        const token = await authPhotographersController(login, password);
        if(token){
            res.status(200).json({token: token});
        }
        else{
            res.status(401).json({'status': 401, 'message': 'Failed to log in'})
        }
    }
}

const authController = new AuthController();
export {authController};