import { Request, Response } from "express";
import { Router } from "express";
import { UserController } from "./user.controller";

export class UserRoute {

    private router!: Router;
    private userController!: UserController;

    constructor() {
        this.router = Router();
        this.registerRoutes();
        this.userController = new UserController();
    }

    registerRoutes(): void {
        this.router.post("/create", async (req: Request, res: Response) => {
            await this.userController.createUser(req, res);
        });
    }

    getRoutes(): Router {
        return this.router;
    }
}
