"use client";

import z from "zod";
import { useState, SyntheticEvent } from "react";
import Header from "../../../components/header";
import axios from "axios";

const ZoneOfficerLogInSchema = z.object({
    name: z
        .string()
        .min(1, "Zone officer name is required")
        .regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces"),
    email: z
        .string()
        .min(1, "Zone officer email is required")
        .email("Zone officer email must be an email")
        .regex(/^[a-zA-Z0-9]+@gmail\.com$/, "Email must be a valid Gmail address"),
    password: z
        .string()
        .min(1, "Zone officer password is required")
        .min(8, "Zone officer password must be at least 8 characters long")
        .max(25, "Zone officer password cannot exceed 25 characters"),
    nid: z
        .string()
        .min(1, "Zone officer NID is required")
        .length(10, "Zone officer NID must be 10 digits long")
        .regex(/^[0-9]{10}$/, "Zone officer NID must be only digits"),
});

type ZoneOfficerLogInType = z.infer<typeof ZoneOfficerLogInSchema>;

export default function ZoneOfficerLogInForm() {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [nid, setNID] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");

    const handleSubmit = (e: SyntheticEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const result = ZoneOfficerLogInSchema.safeParse({
            name,
            email,
            password,
            nid,
        });

        if (!result.success) {
            setError(result.error.issues[0]?.message || "Validation error");
            return;
        }

        //Axios Call — POST /zone-officer/create-ZoneOfficer
        axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/zone-officer/create-ZoneOfficer`, {
            ...result.data,
            nid: Number(result.data.nid)
        })
            .then((response) => {
                console.log(response);
                setSuccess("Zone officer created successfully!");
                setName("");
                setEmail("");
                setPassword("");
                setNID("");
            })
            .catch((error) => {
                console.error(error);
                setError("Failed to create zone officer. Please try again.");
            });
    };

    return (
        <>
            {<Header props={{ page: "Zone Officer Log In" }} />}

            <h1>Zone Officer Log In</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                {success && <p style={{ color: "green" }}>{success}</p>}

                <button type="submit">Submit</button>
            </form>
        </>
    );
}