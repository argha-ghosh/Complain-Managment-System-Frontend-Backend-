"use client";

import z from "zod";
import { useState, SyntheticEvent } from "react";
import Header from "../../../components/header";
import Footer from "@/components/footer";   
import axios from "axios";

const UpdateZoneOfficerSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces"),
    email: z
        .string()
        .min(1, "Email is required")
        .regex(/^[a-zA-Z0-9]+@gmail\.com$/, "Email must be a valid Gmail address"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters")
        .max(25, "Password cannot exceed 25 characters"),
    nid: z
        .string()
        .min(1, "NID is required")
        .length(10, "NID must be exactly 10 digits")
        .regex(/^[0-9]{10}$/, "NID must contain only digits"),
});

export default function EditZoneOfficer() {
    const [searchId, setSearchId] = useState<number>(0);
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [nid, setNID] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [fetched, setFetched] = useState<boolean>(false);

    // Axios Call #7 — GET /zone-officer/:id
    function handleFetch(e: SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setSuccess("");
        setFetched(false);

        if (searchId <= 0) {
            setError("Please enter a valid Officer ID.");
            return;
        }

        axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/zone-officer/${searchId}`)
            .then((response) => {
                console.log(response);
                const jsonData = response.data;
                console.log(jsonData);
                setName(jsonData.name);
                setEmail(jsonData.email);
                setNID(jsonData.nid.toString());
                setFetched(true);
            })
            .catch((error) => {
                console.error(error);
                setError("Officer not found. Please check the ID.");
            });
    }

    // Axios Call #8 — PUT /zone-officer/update/:id
    const handleSubmit = (e: SyntheticEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const result = UpdateZoneOfficerSchema.safeParse({ name, email, password, nid });
        if (!result.success) {
            setError(result.error.issues[0]?.message || "Validation error");
            return;
        }

        axios.put(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/zone-officer/update/${searchId}`, {
            ...result.data,
            nid: Number(result.data.nid),
        })
            .then((response) => {
                console.log(response);
                setSuccess("Zone Officer updated successfully!");
                setPassword("");
            })
            .catch((error) => {
                console.error(error);
                setError("Failed to update. Please try again.");
            });
    };

    return (
        <>
            {<Header props={{ page: "Edit Zone Officer" }} />}

            <h1>Edit Zone Officer</h1>

            {/* Step 1 — Search Officer by ID */}
            <form onSubmit={handleFetch}>
                <div>
                    <label htmlFor="searchId">Enter Officer ID:</label>
                    <input
                        type="number"
                        id="searchId"
                        value={searchId}
                        onChange={(e) => setSearchId(Number(e.target.value))}
                        className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button type="submit">Search</button>
            </form>

            {/* Step 2 — Edit Form (only shows after search) */}
            {fetched && (
                <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
                    <h2>Editing Officer ID: {searchId}</h2>

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
                        <label htmlFor="password">New Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
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
                            maxLength={10}
                            className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {success && <p style={{ color: "green" }}>{success}</p>}

                    <button type="submit">Update</button>
                </form>
            )}

            {error && !fetched && <p style={{ color: "red" }}>{error}</p>}

            <Footer />
        </> 
    );
}