"use server";

import { PrismaClient } from "../../../prisma/generated/client";
import { hashPassword } from "./password";

const prisma = new PrismaClient();

export async function createUser(formData: FormData): Promise<{ message: string }> {

    if (!formData.get("email") || !formData.get("password")) {
        throw new Error("Invalid form data");
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: passwordHash,
        },
    })

    if (user === null) {
        throw new Error("Unexpected error");
    }

    return { message: "User created" };
}