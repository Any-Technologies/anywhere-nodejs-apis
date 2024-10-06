import { Request, Response } from "express";
import dotenv from "dotenv";
import { ZodError } from "zod";
import { v4 as uuidv4 } from "uuid";
import { sequelize } from "../../configs/database.config";
import Users from "../../models/users/users.model";
import { CreateUserSchema } from "../../schemas/users/create-user.schema";
import { LoginUserSchema } from "../../schemas/users/login-user.schema";
import { generateAccessToken } from "../../utils/jwt.util";

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
            }
            return res.status(400).json({
                message: "Error creating user",
                status: 400,
            });
        }
    };

    async getProfile(req: Request, res: Response) {
        const { userId } = req.user as { userId: string };

        if (!userId || typeof userId !== "string") {
            return res.status(400).json({
                message: "An unexpected error occurred",
                status: 400,
            });
        }
        const transaction = await sequelize.transaction();

        try {
            const user = await Users.findOne({
                where: {
                    user_id: userId,
                    is_active: true,
                },
                transaction,
            });

            if (!user) {
                await transaction.rollback();
                return res.status(404).json({
                    message: "User not found",
                    status: 404,
                });
            }

            const userData = {
                userId: user?.user_id,
                username: user?.username,
                fullName: user?.full_name,
                email: user?.email,
                gender: user?.gender,
                dateOfBirth: user?.date_of_birth,
                bio: user.bio,
                preferences: user?.preferences,
                profilePhoto: user?.profile_photo
            };
            await transaction.commit();
            return res.status(200).json({
                message: "User profile fetched successfully",
                data: userData,
                status: 200,
            });
        } catch (error) {
            console.log(error);
            await transaction.rollback();
            return res.status(400).json({
                message: "Error fetching user profile",
                status: 400,
            });
        }
    };

    async loginUser(req: Request, res: Response) {
        const transaction = await sequelize.transaction();

        try {
            const validatedRequestBody = LoginUserSchema.parse(req.body);
            const { email } = validatedRequestBody;

            const existingEmail = await Users.findOne({
                where: {
                    email: email,
                    is_active: true,
                },
                transaction,
            });

            if (!existingEmail) {
                await transaction.rollback();
                return res.status(404).json({
                    message: "Email doesn't exist",
                    status: 404,
                });
            }

            const userData = { userId: existingEmail.user_id }
            const accessToken = generateAccessToken(userData);
            await transaction.commit();
            return res.status(200).json({
                message: "User logged in successfully",
                data: {
                    accessToken: accessToken,
                    tokenType: "Bearer"
                },
                status: 200,
            });
        } catch (error) {
            console.log(error);
            await transaction.rollback();
            if (error instanceof ZodError) {
                return res.status(400).json({
                    message: error.errors,
                    status: 400,
                });
            }
            return res.status(400).json({
                message: "Error login user",
                status: 400,
            });
        }
    }
}