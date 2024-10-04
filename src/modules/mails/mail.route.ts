import { Request, Response } from "express";
import { Router } from "express";
import { MailController } from "./mail.controller";

export class MailRoute {

    private router!: Router;
    private mailController!: MailController;

    constructor() {
        this.router = Router();
        this.registerRoutes();
        this.mailController = new MailController();
    }

    registerRoutes(): void {
        this.router.post("/send", async (req: Request, res: Response) => {
            await this.mailController.sendMail(req, res);
        });
    }

    getRoutes(): Router {
        return this.router;
    }
}
