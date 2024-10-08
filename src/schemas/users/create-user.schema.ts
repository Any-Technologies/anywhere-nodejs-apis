import { z } from "zod";
import validator from "validator";

export const CreateUserSchema = z.object({
    username: z
        .string({
            required_error: "Username is required",
            invalid_type_error: "Username must be a string",
        })
        .min(1, { message: "Username cannot be empty" })
        .max(50, { message: "Username cannot contain more than 50 characters" })
        .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, digits, and underscores and cannot contain spaces" }),
    fullName: z
        .string({
            required_error: "Full name is required",
            invalid_type_error: "Full name must be a string",
        })
        .min(1, { message: "Full name cannot be empty" })
        .max(100, { message: "Full name cannot contain more than 100 characters" }),
    email: z
        .string({
            required_error: "Email is required",
        })
        .min(1, { message: "Email cannot be empty" })
        .refine((value) => validator.isEmail(value), {
            message: "Invalid email address",
        }),
});
