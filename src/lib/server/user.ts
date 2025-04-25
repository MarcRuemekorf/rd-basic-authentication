import { PrismaClient, User } from "../../../prisma/generated/client";
import { hashPassword } from "./password";

const prisma = new PrismaClient();

export async function createUser(formData: User): Promise<{ message: string }> {
    const passwordHash = await hashPassword(formData.password);

    const row = await prisma.user.create({
        data: {
            name: formData.name,
            email: formData.email,
            password: passwordHash,
        },
    })

    if (row === null) {
        throw new Error("Unexpected error");
    }

    return { message: "User created" };
}