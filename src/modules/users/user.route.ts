import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { UserController } from "./user.controller";
import { AuthMiddleware } from "../../middlewares/auth.middleware";

export class UserRoute {

    private router!: Router;
    private userController!: UserController;
    private authMiddleware!: AuthMiddleware;

    constructor() {
        this.router = Router();
        this.registerRoutes();
        this.userController = new UserController();
        this.authMiddleware = new AuthMiddleware();
    }

    registerRoutes(): void {
        this.router.get("/profile", (req: Request, res: Response, next: NextFunction) => this.authMiddleware.verifyToken(req, res, next), async (req: Request, res: Response) => {
            await this.userController.getProfile(req, res);
        });
        this.router.post("/create", async (req: Request, res: Response) => {
            await this.userController.createUser(req, res);
        });
        this.router.post("/login", async (req: Request, res: Response) => {
            await this.userController.loginUser(req, res);
        });
    }

    getRoutes(): Router {
        return this.router;
    }
}
