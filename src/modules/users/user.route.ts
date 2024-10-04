import { Request, Response } from "express";
import { Router } from "express";

export class UserRoute {

    private router: Router;

    constructor() {
        this.router = Router();
        this.registerRoutes();
    }

    registerRoutes(): void {

    }

    getRoutes(): Router {
        return this.router;
    }
}
