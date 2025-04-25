import { User } from "../../../../prisma/generated/client";
import { checkEmailAvailability } from "@/lib/server/email";
import { createUser } from "../../../lib/server/user";
import { redirect } from "next/navigation";

interface ActionResult {
    message: string;
}

export const signUpAction = (_prev: ActionResult, formData: User) => {
    const emailAvailable = checkEmailAvailability(formData.email);
    if (!emailAvailable) {
        return {
            message: "Email is already used"
        };
    }
    createUser(formData)

    return redirect("/2fa/setup");
}