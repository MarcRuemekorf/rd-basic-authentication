"use client"

import { getCurrentSession } from "@/src/lib/server/session"
import { useEffect, useState } from "react"
import { Session } from "@/prisma/generated/client"
import { SignOutAction } from "../(auth)/actions"
import { useRouter } from "next/navigation"

const Nav = () => {
    const router = useRouter()
    const [currentSession, setCurrentSession] = useState<Session | null>(null)

    const handleSignOut = async () => {
        await SignOutAction()

        router.push("/sign-in")
    }

    useEffect(() => {
        const updateSession = async () => {
            const { session } = await getCurrentSession()
            setCurrentSession(session)
        }

        updateSession()
    }, [])

    if (currentSession === null) {
        return (
            <nav className="nav">
                <ul>
                    <li><a href="/sign-in" className="nav-item">Sign In</a></li>
                    <li><a href="/sign-up" className="nav-item">Sign Up</a></li>
                </ul>
            </nav>
        )
    }

    return (
        <nav className="nav">
            <ul>
                <li><button onClick={handleSignOut} className="nav-item">Sign Out</button></li>
            </ul>
        </nav>
    )
}

export default Nav;