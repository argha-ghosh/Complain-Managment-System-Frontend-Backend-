"use client";

import z from "zod";
import { useState, ChangeEvent, SyntheticEvent } from "react";
import Header from "../../../components/header";


const ZoneOfficerLogInSchema = z.object({
    userName: z
        .string()
        .min(1, "Zone officer user name is required"),
    email: z
        .string()
        .min(1, "Zone officer email is required")
        .email("Zone officer email must be an email"),
    password: z
        .string()
        .min(1, "Zone officer password is required")
        .min(8, "Zone officer password must be at least 8 characters long")
        .max(25, "Zone officer password cannot exceed 25 characters"),
    nid: z
        .string()
        .min(1, "Zone officer NID is required")
        .length(10, "Zone officer NID must be 10 digits long")
        .regex(/^[0-9]{10}$/, "Zone officer NID must be only digits")
});

type ZoneOfficerLogInType = z.infer<typeof ZoneOfficerLogInSchema>;

export default function ZoneOfficerLogInForm() {
    const [userName, setUserName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [nid, setNID] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleSubmit = (e: SyntheticEvent<HTMLFormElement>): void => {
        e.preventDefault();

        const result = ZoneOfficerLogInSchema.safeParse({
            userName,
            email,
            password,
            nid,
        });

        if (!result.success) {
            setError(result.error.issues[0]?.message || "Validation error");
            return;
        }

        console.log(result.data);
        setUserName("");
        setEmail("");
        setPassword("");
        setNID("");
        setError("");
    };

    return (
        <>
            {<Header props={{ page: "Zone Officer Log In" }} />}

            <h1>Zone Officer Log In</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="userName">User Name:</label>
                    <input
                        type="text"
                        id="userName"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="nid">NID:</label>
                    <input
                        type="text"
                        id="nid"
                        value={nid}
                        onChange={(e) => setNID(e.target.value)}
                        className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit">Submit</button>
            </form>
        </>
    );
}   
