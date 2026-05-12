"use client";

import z from "zod";
import { useState, SyntheticEvent } from "react";
import Header from "../../../components/header";
import Footer from "../../../components/footer";
import axios from "axios";

// Validation Schema
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

        // Axios Call
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

            {/* <Header props={{ page: "Create Officer Account Page" }} /> */}

            {/* Centered Header with Emoji */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 text-3xl mb-4">
                    🌳
                </div>
                <h1 className="text-4xl font-bold text-gray-800">
                    Create Officer Account Page
                </h1>
            </div>

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
                                placeholder="10 digits NID"
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
            <style jsx>{`
                .page-wrapper {
                    display: flex;
                    flex-direction: .page-container {
                    max-width: 100px; /* Increased the width to 900px */
                    margin: 2rem auto;
                    padding: 2rem;
                    background-color: white;
                    border-radius: 1rem;
                    box-shadow: 0 4px 10px rgba(141, 24, 24, 0.71);
                };

                    min-height: 100vh;
                    background: linear-gradient(to bottom right, #fbf5f5ff, #c5fbd7ff,   #c8f5d6ff);
                }

                .page-container {
                    max-width: 900px; /* Increased the width to 900px */
                    margin: 2rem auto;
                    padding: 2rem;
                    background-color: white;
                    border-radius: 1rem;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                }

                .page-title {
                    font-size: 2rem;
                    font-weight: 600;
                    color: #2d3748;
                }

                .page-subtitle {
                    color: #4a5568;
                    font-size: 1rem;
                    margin-top: 0.5rem;
                }

                .form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                }

                .form-label {
                    font-size: 1rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    color: #2d3748;
                }

                .form-input {
                    padding: 0.75rem;
                    font-size: 1rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.5rem;
                    background-color: #f7fafc;
                    color: #2d3748;
                    outline: none;
                    transition: all 0.3s ease;
                }

                .alert-error {
                    background-color: #fff4f4;
                    color: #e53e3e;
                    border: 1px solid #e53e3e;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                }

                .alert-success {
                    background-color: #f0fdf4;
                    color: #38a169;
                    border: 1px solid #38a169;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                }

                .btn-primary {
                    padding: 0.75rem;
                    font-size: 1rem;
                    background-color: #38a169;
                    color: #fff;
                    border-radius: 0.5rem;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    width: 100%;
                }

                .btn-primary:hover {
                    background-color: #2f855a;
                }

                .text-blue-600 {
                    color: #3182ce;
                }

                .text-blue-600:hover {
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
}