"use client";

import { useActionState } from "react";
import { signUpAction } from "../../actions";

const initialState = {
    message: ""
};

const SignUpForm = () => {
    const [state, action] = useActionState(signUpAction, initialState);

    return (
        <form action={action}>
            <h1>Sign Up</h1>
            <div>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required />
            </div>
            <button type="submit">Sign Up</button>
        </form >
    )

}

export default SignUpForm;