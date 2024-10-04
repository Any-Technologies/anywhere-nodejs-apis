import { Request, Response } from "express";
import dotenv from "dotenv";
import { ZodError } from "zod";
import { v4 as uuidv4 } from "uuid";
import { sequelize } from "../../configs/database.config";
import Users from "../../models/users/users.model";
import { CreateUserSchema } from "../../schemas/users/create-user.schema";

dotenv.config();

export class UserController {

    constructor() { }

    async createUser(req: Request, res: Response) {
        const transaction = await sequelize.transaction();
        try {
            const validatedRequestBody = CreateUserSchema.parse(req.body);
            const { username, fullName, email } = validatedRequestBody;
            const existingUserByUsername = await Users.findOne({
                where: {
                    username: username,
                    is_active: true,
                },
                transaction,
            });
            if (existingUserByUsername) {
                await transaction.rollback();
                return res.status(409).json({
                    message: "Username already taken",
                    status: 409,
                });
            }
            const existingUserByEmail = await Users.findOne({
                where: {
                    email: email,
                    is_active: true,
                },
                transaction,
            });
            if (existingUserByEmail) {
                await transaction.rollback();
                return res.status(409).json({
                    message: "Email already exists",
                    status: 409,
                });
            }
            const userId = "user_" + uuidv4().replace(/-/g, "");
            await Users.create(
                {
                    user_id: userId,
                    username: username,
                    full_name: fullName,
                    email: email,
                },
                { transaction }
            );
            await transaction.commit();
            return res.status(201).json({
                message: "User created successfully",
                status: 201,
            });
        } catch (error) {
            console.log(error);
            await transaction.rollback();
            if (error instanceof ZodError) {
                return res.status(400).json({
                    message: error.errors,
                    status: 400,
                });
            } else {
                return res.status(400).json({
                    message: "Error creating user",
                    status: 400,
                });
            }
        }
    };
}