import { PrismaClient } from "../../../prisma/generated/client";

const prisma = new PrismaClient();

export async function checkEmailAvailability(email: string): Promise<boolean> {

    const user = await prisma.user.findUnique({
        where: {
            email
        },
    })

    if (user !== null) {
        throw new Error();
    }

    return user === null;
}