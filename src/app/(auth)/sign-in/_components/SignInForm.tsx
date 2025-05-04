"use client";

import { useActionState } from "react";
import { signInAction } from "../../actions";

const initialState = {
    message: ""
};

const SignInForm = () => {
    const [state, action] = useActionState(signInAction, initialState);

    return (
        <form action={action}>
            <h1>Sign In</h1>
            <div>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required />
            </div>
            <button type="submit">Sign In</button>
        </form >
    )

}

export default SignInForm;