import express from 'express';
import { userRouter } from '../modules/user/user.router';
import { authRoutes } from '../modules/auth/auth.router';


const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: userRouter
    },
    {
        path: '/auth',
        route: authRoutes
    },
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;