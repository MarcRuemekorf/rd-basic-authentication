"use server";

import { PrismaClient } from "../../../prisma/generated/client";

const prisma = new PrismaClient();

export async function checkEmailAvailability(email: string): Promise<boolean> {

    const user = await prisma.user.findUnique({
        where: {
            email: email
        },
    })

    return user === null;
}