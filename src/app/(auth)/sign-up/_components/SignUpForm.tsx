"use client";

import { useFormState } from "react-dom";
import { signUpAction } from "../actions";

const initialState = {
    message: ""
};

const SignUpForm = () => {
    const [state, action] = useFormState(signUpAction, initialState);

    const onSubmit = (formData: any) => {
        return action(formData);
    }

    return (
        <form onSubmit={onSubmit}>
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