"use client";

import z from "zod";
import { useState, SyntheticEvent } from "react";
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

        const result = ZoneOfficerLogInSchema.safeParse({ name, email, password, nid });

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
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-green-50">

            {/* ── Hero Banner ── */}
            <div className="py-8 px-4 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 text-3xl mb-4">
                    🌳
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Create Officer Account
                </h1>
                <p className="text-gray-500 text-sm">
                    Register a new zone officer in the system
                </p>
            </div>

            {/* ── Form Card ── */}
            <main className="max-w-2xl mx-auto px-4 py-10">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div className="flex flex-col gap-1">
                            <label htmlFor="name" className="text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Enter full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border border-gray-300 rounded-lg py-2.5 px-4 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border border-gray-300 rounded-lg py-2.5 px-4 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border border-gray-300 rounded-lg py-2.5 px-4 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="nid" className="text-sm font-medium text-gray-700">
                                NID (10 Digits)
                            </label>
                            <input
                                type="text"
                                id="nid"
                                placeholder="Enter 10 digit NID"
                                value={nid}
                                onChange={(e) => setNID(e.target.value)}
                                maxLength={10}
                                className="border border-gray-300 rounded-lg py-2.5 px-4 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg px-4 py-3">
                                {success}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-lg transition text-sm"
                        >
                            Create Officer Account
                        </button>
                    </form>
                </div>

                <div className="mt-6 text-center">
                    <a href="/ZoneOfficer" className="text-sm text-blue-600 hover:underline">
                        ← Back to All Officers
                    </a>
                </div>
            </main>

            <Footer />
        </div>
    );
}