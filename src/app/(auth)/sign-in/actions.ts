"use server"

import { verifyPasswordHash } from "@/lib/server/password";
import { createSession, generateSessionToken, setSessionTokenCookie } from "@/lib/server/session";
import { getUserFromEmail, getUserPasswordHash } from "@/lib/server/user";
import { redirect } from "next/navigation";

type ActionResult = {
    message: string;
}

export const signInAction = async (_prev: ActionResult, formData: FormData): Promise<ActionResult> => {
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
        return {
            message: "Invalid or missing fields"
        };
    }
    if (email === "" || password === "") {
        return {
            message: "Email and password cannot be empty."
        };
    }

    const user = await getUserFromEmail(email);
    if (user === null) {
        return {
            message: "Account does not exist"
        };
    }

    const passwordHash = await getUserPasswordHash(user.id);
    const validPassword = await verifyPasswordHash(passwordHash, password);
    if (!validPassword) {
        return {
            message: "Invalid password"
        };
    }

    const sessionToken = await generateSessionToken();
    const session = await createSession(sessionToken, user.id);
    await setSessionTokenCookie(sessionToken, session.expiresAt);

    return redirect("/");
}