"use server";

import db from "../db"
import { User } from "../../../prisma/generated/client";
import { hashPassword } from "./password";

export async function createUser(formData: FormData): Promise<{ message: string }> {

    if (!formData.get("email") || !formData.get("password")) {
        throw new Error("Invalid form data");
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const passwordHash = await hashPassword(password);

    const user = await db.user.create({
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

export async function getUserFromEmail(email: string): Promise<User | null> {
    const user = await db.user.findUnique({
        where: {
            email: email,
        },
    });

    if (user === null) {
        return null;
    }

    return user;
}

export async function getUserPasswordHash(userId: number): Promise<string> {
    const user = await db.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (user === null) {
        throw new Error("Invalid user ID");
    }
    return user.password;
}