import { Router } from "express";
import { UserRouter } from "../modules/users/usre.route";

export const router = Router();

const RoutesModel = [
    {
        path: "/user",
        route: UserRouter
    }
];

RoutesModel.forEach((route) => {
    router.use(route.path, route.route);
});