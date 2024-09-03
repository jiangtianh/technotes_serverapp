import express from 'express';
const router = express.Router();
import { getAllUsers, createNewUser, updateUser, deleteUser } from '../controllers/usersController.js';
import verifyJWT from '../middleware/verigyJWT.js';

router.use(verifyJWT);

router.route('/')
    .get(getAllUsers)
    .post(createNewUser)
    .patch(updateUser)
    .delete(deleteUser);


export default router;