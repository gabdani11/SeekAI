import {Router} from 'express';
import {registerValidator, loginValidator} from '../validator/authValidator.js';
import {register, login,getMe} from '../controllers/auth.controller.js';
import {verifyEmail} from '../controllers/auth.controller.js';
import { auth } from 'googleapis/build/src/apis/abusiveexperiencereport/index.js';
import { authUser } from '../middleware/auth.middleware.js';
const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body {username, email, password}
 */

authRouter.post('/register', registerValidator, register);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 * @body {email, password}
 */
authRouter.post('/login', loginValidator, login);

/**
 * @route GET /api/auth/get-me
 * @desc Get current user details
 * @access Private
 * @header {Authorization: Bearer token}
 */
authRouter.get('/get-me', authUser, getMe);
 
/**
 * @route GET /api/auth/verify-email
 * @desc Verify email
 * @access Public
 * @query {token}
 */
authRouter.get('/verify-email', verifyEmail);

export default authRouter;