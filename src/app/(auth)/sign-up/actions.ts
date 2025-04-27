"use server"

import { checkEmailAvailability } from "@/lib/server/email";
import { createUser } from "@/lib/server/user";
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