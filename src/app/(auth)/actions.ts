"use server"

import { checkEmailAvailability } from "@/lib/server/email";
import { createUser } from "@/lib/server/user";
import { verifyPasswordHash } from "@/lib/server/password";
import { createSession, deleteSessionTokenCookie, generateSessionToken, getCurrentSession, invalidateSession, setSessionTokenCookie } from "@/lib/server/session";
import { getUserFromEmail, getUserPasswordHash } from "@/lib/server/user";
import { redirect } from "next/navigation";

type ActionResult = {
    message: string;
}

export const signUpAction = async (_prev: ActionResult, formData: FormData): Promise<ActionResult> => {
    const email = formData.get("email");

    if (typeof email !== "string") {
        return {
            message: "Invalid email"
        };
    }

    const emailAvailable = checkEmailAvailability(email);
    if (!emailAvailable) {
        return {
            message: "Email is already used"
        };
    }
    await createUser(formData)

    return redirect("/");
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

export const SignOutAction = async () => {
    const { session } = await getCurrentSession();
    if (session === null) {
        return;
    }
    await invalidateSession(session.id);
    await deleteSessionTokenCookie();
}