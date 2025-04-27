"use server"

import db from "./db"
import { User, Session } from "../../../prisma/generated/client";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { cookies } from "next/headers";
import { cache } from "react";

// type SessionValidationResult = { session: Session; user: User } | { session: null; user: null };

export async function setSessionTokenCookie(token: string, expiresAt: Date): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.set("session", token, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: expiresAt
    });
}

export async function deleteSessionTokenCookie(): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.set("session", "", {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0
    });
}

export async function generateSessionToken(): Promise<string> {
    const tokenBytes = new Uint8Array(20);
    crypto.getRandomValues(tokenBytes);
    const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
    return token;
}

export async function createSession(token: string, userId: number): Promise<Session> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const sessionData: Session = {
        id: sessionId,
        userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    };
    const session = await db.session.create({
        data: sessionData,
    })
    return session;
}

// TODO: Validate session token
// export const getCurrentSession = cache(async (): Promise<SessionValidationResult> => {
//     const cookieStore = await cookies()
//     const token = cookieStore.get("session")?.value ?? null;
//     if (token === null) {
//         return { session: null, user: null };
//     }
//     const result = validateSessionToken(token);
//     return result;
// });