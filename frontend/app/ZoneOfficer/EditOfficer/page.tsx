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
    const [originalEmail, setOriginalEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [nid, setNID] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [fetched, setFetched] = useState<boolean>(false);
    const [fetchLoading, setFetchLoading] = useState<boolean>(false);
    const [updateLoading, setUpdateLoading] = useState<boolean>(false);

    // OTP states
    const [otp, setOtp] = useState<string>("");
    const [otpSent, setOtpSent] = useState<boolean>(false);
    const [otpVerified, setOtpVerified] = useState<boolean>(false);
    const [otpLoading, setOtpLoading] = useState<boolean>(false);

    // Check if email has changed from original
    const emailChanged = email !== originalEmail;

    // Axios Call — GET /zone-officer/:id
    function handleFetch(e: SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setSuccess("");
        setFetched(false);
        setOtp("");
        setOtpSent(false);
        setOtpVerified(false);

        if (searchId <= 0) {
            setError("Please enter a valid Officer ID.");
            return;
        }

        setFetchLoading(true);
        axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/zone-officer/${searchId}`)
            .then((response) => {
                const jsonData = response.data;
                setName(jsonData.name);
                setEmail(jsonData.email);
                setOriginalEmail(jsonData.email);
                setNID(jsonData.nid.toString());
                setFetched(true);
            })
            .catch((error) => {
                console.error(error);
                setError("Officer not found. Please check the ID.");
            })
            .finally(() => setFetchLoading(false));
    }

    // Send OTP to new email
    const handleSendOtp = () => {
        setError("");
        setSuccess("");

        const emailCheck = z
            .string()
            .email()
            .regex(/^[a-zA-Z0-9]+@gmail\.com$/)
            .safeParse(email);

        if (!emailCheck.success) {
            setError("Please enter a valid Gmail address.");
            return;
        }

        setOtpLoading(true);
        axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/zone-officer/send-otp`, { email })
            .then(() => {
                setOtpSent(true);
                setSuccess("OTP sent to new email! Check your Gmail inbox.");
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to send OTP. Please try again.");
            })
            .finally(() => setOtpLoading(false));
    };

    // Verify OTP
    const handleVerifyOtp = () => {
        setError("");
        setSuccess("");

        if (otp.length !== 6) {
            setError("Please enter the 6-digit OTP.");
            return;
        }

        setOtpLoading(true);
        axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/zone-officer/verify-otp`, { email, otp })
            .then(() => {
                setOtpVerified(true);
                setSuccess("✅ New email verified!");
            })
            .catch((err) => {
                console.error(err);
                setError("Invalid or expired OTP. Please try again.");
            })
            .finally(() => setOtpLoading(false));
    };

    // Axios Call — PUT /zone-officer/update/:id
    const handleSubmit = (e: SyntheticEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Block update if email changed but OTP not verified
        if (emailChanged && !otpVerified) {
            setError("Please verify your new email with OTP before updating.");
            return;
        }

        const result = UpdateZoneOfficerSchema.safeParse({ name, email, password, nid });
        if (!result.success) {
            setError(result.error.issues[0]?.message || "Validation error");
            return;
        }

        setUpdateLoading(true);
        axios.put(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/zone-officer/update/${searchId}`, {
            ...result.data,
            nid: Number(result.data.nid),
        })
            .then((response) => {
                console.log(response);
                setSuccess("Zone Officer updated successfully!");
                setPassword("");
                setOriginalEmail(email);
                setOtpSent(false);
                setOtpVerified(false);
                setOtp("");
            })
            .catch((error) => {
                console.error(error);
                setError("Failed to update. Please try again.");
            })
            .finally(() => setUpdateLoading(false));
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-green-100">

                {/* <Header props={{ page: "Edit Zone Officer" }} /> */}

                {/* ── Hero Banner ── */}
                <div className="py-8 px-4 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 text-3xl mb-4">
                        ✏️
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Edit Zone Officer
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Search an officer by ID and update their details
                    </p>
                </div>

                <main className="max-w-2xl mx-auto px-4 pb-12">

                    {/* ── Step 1 — Search Card ── */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                        <h2 className="text-base font-semibold text-gray-700 mb-4">
                            Step 1 — Find Officer
                        </h2>
                        <form onSubmit={handleFetch} className="flex gap-2">
                            <input
                                type="number"
                                id="searchId"
                                placeholder="Enter Officer ID"
                                value={searchId}
                                onChange={(e) => setSearchId(Number(e.target.value))}
                                className="flex-1 border border-gray-300 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                            />
                            <button
                                type="submit"
                                disabled={fetchLoading}
                                className="px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-semibold rounded-lg transition"
                            >
                                {fetchLoading ? "Searching..." : "Search"}
                            </button>
                        </form>

                        {error && !fetched && (
                            <div className="mt-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                                ⚠️ {error}
                            </div>
                        )}
                    </div>

                    {/* ── Step 2 — Edit Form ── */}
                    {fetched && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-base font-semibold text-gray-700 mb-1">
                                Step 2 — Update Details
                            </h2>
                            <p className="text-xs text-gray-400 mb-5">
                                Editing Officer ID: <span className="font-semibold text-green-600">#{searchId}</span>
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-5">

                                {/* Name */}
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="name" className="text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="border border-gray-300 rounded-lg py-2.5 px-4 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                    />
                                </div>

                                {/* Email + Send OTP */}
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                        Email Address
                                        {emailChanged && !otpVerified && (
                                            <span className="ml-2 text-xs text-orange-500 font-normal">
                                                ⚠️ Changed — OTP verification required
                                            </span>
                                        )}
                                        {otpVerified && (
                                            <span className="ml-2 text-xs text-green-500 font-normal">
                                                ✅ New email verified
                                            </span>
                                        )}
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            disabled={otpVerified}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                setOtpSent(false);
                                                setOtpVerified(false);
                                                setOtp("");
                                            }}
                                            className="flex-1 border border-gray-300 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition disabled:bg-green-50 disabled:opacity-70"
                                        />
                                        {/* Send OTP button — only visible when email changed */}
                                        {emailChanged && (
                                            <button
                                                type="button"
                                                onClick={handleSendOtp}
                                                disabled={otpLoading || otpVerified}
                                                className="whitespace-nowrap px-4 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-green-400 text-white text-sm font-semibold rounded-lg transition"
                                            >
                                                {otpVerified ? "✅ Verified" : otpLoading ? "Sending..." : otpSent ? "Resend" : "Send OTP"}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* OTP Input — shows only when email changed + OTP sent */}
                                {emailChanged && otpSent && !otpVerified && (
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-gray-700">
                                            Enter 6-Digit OTP
                                        </label>
                                        <p className="text-xs text-gray-400">
                                            A code was sent to {email}. It expires in 5 minutes.
                                        </p>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Enter your 6 digit OTP"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                                maxLength={6}
                                                className="flex-1 border border-green-400 bg-green-50 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 tracking-widest font-mono transition"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleVerifyOtp}
                                                disabled={otpLoading}
                                                className="whitespace-nowrap px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-semibold rounded-lg transition"
                                            >
                                                {otpLoading ? "Verifying..." : "Verify"}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* New Password */}
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        className="border border-gray-300 rounded-lg py-2.5 px-4 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                    />
                                </div>

                                {/* NID */}
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="nid" className="text-sm font-medium text-gray-700">
                                        NID (10 Digits)
                                    </label>
                                    <input
                                        type="text"
                                        id="nid"
                                        value={nid}
                                        onChange={(e) => setNID(e.target.value)}
                                        maxLength={10}
                                        className="border border-gray-300 rounded-lg py-2.5 px-4 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                    />
                                </div>

                                {/* Error */}
                                {error && fetched && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                                        ⚠️ {error}
                                    </div>
                                )}

                                {/* Success */}
                                {success && (
                                    <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg px-4 py-3">
                                        {success}
                                    </div>
                                )}

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={updateLoading || (emailChanged && !otpVerified)}
                                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition text-sm"
                                >
                                    {updateLoading ? "Updating..." : "Update Officer"}
                                </button>

                                {/* Hint when email changed but not verified */}
                                {emailChanged && !otpVerified && (
                                    <p className="text-xs text-center text-orange-400">
                                        Verify your new email with OTP to enable update.
                                    </p>
                                )}

                            </form>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <a href="/ZoneOfficer" className="text-sm text-blue-600 hover:underline">
                            ← Back to All Officers
                        </a>
                    </div>
                </main>
            </div>
            <Footer />
        </>
    );
}