"use client";

import z from "zod";
import { useState, SyntheticEvent } from "react";
import Header from "../../../../components/header";
import Footer from "@/components/footer";
import axios from "axios";

const ZoneOfficerHomeSchema = z.object({
    zoneName: z
        .string()
        .min(1, "Zone name is required")
        .max(25, "Zone name cannot exceed 25 characters")
        .regex(/^[a-zA-Z\s]+$/, "Zone name must contain only letters"),
    areaName: z
        .string()
        .min(1, "Area name is required")
        .max(25, "Area name cannot exceed 25 characters")
        .regex(/^[a-zA-Z\s]+$/, "Area name must contain only letters"),
    description: z
        .string()
        .min(1, "Description is required")
        .max(100, "Description cannot exceed 100 characters"),
    status: z.enum(["Pending", "In Progress", "Resolved"], {
        message: "Please select a valid status",
    }),
    zoneOfficerId: z
        .number({ message: "Zone officer ID is required" })
        .min(1, "Zone officer ID is required")
        .int("Must be a whole number"),
});

export default function ZoneOfficerHomeForm() {
    const [zoneName, setZoneName] = useState<string>("");
    const [areaName, setAreaName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [zoneOfficerId, setZoneOfficerId] = useState<number>(0);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = (e: SyntheticEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const result = ZoneOfficerHomeSchema.safeParse({
            zoneName,
            areaName,
            description,
            status,
            zoneOfficerId,
        });

        if (!result.success) {
            setError(result.error.issues[0]?.message || "Validation error");
            return;
        }

        setLoading(true);
        axios
            .post(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/zone-officer/create-complaint`,
                result.data
            )
            .then((response) => {
                console.log(response);
                setSuccess("Complaint submitted successfully!");
                setZoneName("");
                setAreaName("");
                setDescription("");
                setStatus("");
                setZoneOfficerId(0);
            })
            .catch((error) => {
                console.error(error);
                setError("Failed to create complaint. Please try again.");
            })
            .finally(() => setLoading(false));
    };

    return (
        <>
            {/* <Header props={{ page: "Create Complaint" }} /> */}

            {/* Page background */}
            <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-green-100 py-10 px-4">
                <div className="max-w-2xl mx-auto">

                    {/* Page heading */}
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 text-green-600 text-2xl mb-4">
                            🌿
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Submit a Complaint
                        </h1>
                        <p className="text-gray-500 mt-2 text-sm">
                            Help us make your city cleaner and greener
                        </p>
                    </div>

                    {/* Form card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Zone Name */}
                            <div>
                                <label
                                    htmlFor="zoneName"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Zone Name
                                </label>
                                <input
                                    type="text"
                                    id="zoneName"
                                    value={zoneName}
                                    onChange={(e) => setZoneName(e.target.value)}
                                    placeholder="Enter zone name"
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                                />
                            </div>

                            {/* Area Name */}
                            <div>
                                <label
                                    htmlFor="areaName"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Area Name
                                </label>
                                <input
                                    type="text"
                                    id="areaName"
                                    value={areaName}
                                    onChange={(e) => setAreaName(e.target.value)}
                                    placeholder="Enter area name"
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the issue in detail..."
                                    rows={4}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition resize-none"
                                />
                            </div>

                            {/* Status + Officer ID — side by side */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="status"
                                        className="block text-sm font-medium text-gray-700 mb-1.5"
                                    >
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition bg-white"
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                    </select>
                                </div>

                                <div>
                                    <label
                                        htmlFor="zoneOfficerId"
                                        className="block text-sm font-medium text-gray-700 mb-1.5"
                                    >
                                        Zone Officer ID
                                    </label>
                                    <input
                                        type="number"
                                        id="zoneOfficerId"
                                        value={zoneOfficerId}
                                        onChange={(e) => setZoneOfficerId(Number(e.target.value))}
                                        placeholder="Enter your zone officer id"
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                                    />
                                </div>
                            </div>

                            {/* Error / Success messages */}
                            {error && (
                                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                                    <span>⚠️</span>
                                    <span>{error}</span>
                                </div>
                            )}
                            {success && (
                                <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg px-4 py-3">
                                    <span>✅</span>
                                    <span>{success}</span>
                                </div>
                            )}

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold py-3 rounded-lg text-sm transition-colors"
                            >
                                {loading ? "Submitting..." : "Submit Complaint"}
                            </button>

                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}