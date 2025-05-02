"use server";

import db from "./db";

export async function checkEmailAvailability(email: string): Promise<boolean> {

    const user = await db.user.findUnique({
        where: {
            email: email
        },
    })

    return user === null;
}