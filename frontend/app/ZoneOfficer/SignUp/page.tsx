"use client";

import z from "zod";
import { useState, SyntheticEvent } from "react";
import Header from "../../../components/header";
import Footer from "../../../components/footer";
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
        <div className="page-wrapper">
            <Header props={{ page: "Zone Officer Sign Up" }} />

            <main className="page-container">
                <div className="text-center mb-8">
                    <h1 className="page-title">Create Account</h1>
                    <p className="page-subtitle">Register a new zone officer in the system</p>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Enter full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="name@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="nid" className="form-label">NID (10 Digits)</label>
                            <input
                                type="text"
                                id="nid"
                                placeholder="1234567890"
                                value={nid}
                                onChange={(e) => setNID(e.target.value)}
                                className="form-input"
                            />
                        </div>

                        {error && (
                            <div className="alert-error">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="alert-success">
                                {success}
                            </div>
                        )}

                        <div className="pt-4">
                            <button type="submit" className="btn-primary">
                                Create Officer Account
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <a href="/ZoneOfficer" className="text-sm text-blue-600 hover:underline">
                        ← Back to All Officers
                    </a>
                </div>
            </main>

            <Footer />
        </div>
    );
}