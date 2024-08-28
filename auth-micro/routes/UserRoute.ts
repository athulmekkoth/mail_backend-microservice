import {Router} from "express"
import UserController from "../controller/UserController" 
const router=Router()
router.post('/register', UserController.register);
router.post('/login', UserController.login);
// router.post('/protect', protectedRoute);
router.post('/refresh', UserController.refreshToken);
router.post('/logout', UserController.logout);
router.delete('/delete', UserController.deleteUser);

export default router