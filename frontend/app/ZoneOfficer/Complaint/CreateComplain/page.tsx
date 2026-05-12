"use client";

import z from "zod";
import { useState, ChangeEvent, SyntheticEvent, useEffect } from "react";
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
    status: z
        .enum(["Pending", "In Progress", "Resolved"], {
            message: "Please select a valid status",
        }),
    zoneOfficerId: z
        .number({ message: "Zone officer ID is required" })
        .min(1, "Zone officer ID is required")
        .int("Must be a whole number"),
});

type ZoneOfficerHomeType = z.infer<typeof ZoneOfficerHomeSchema>;


export default function ZoneOfficerHomeForm() {
    const [zoneName, setZoneName] = useState<string>("");
    const [areaName, setAreaName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [zoneOfficerId, setZoneOfficerId] = useState<number>(0);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");

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

        //Axios Call — POST /zone-officer/create-complaint
        axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/zone-officer/create-complaint`, result.data)
            .then((response) => {
                console.log(response);
                setSuccess("Complaint created successfully!");
                setZoneName("");
                setAreaName("");
                setDescription("");
                setStatus("");
                setZoneOfficerId(0);
            })
            .catch((error) => {
                console.error(error);
                setError("Failed to create complaint. Please try again.");
            });
    };

    return (
        <>

            {<Header props={{ page: "Home" }} />}

            <h1>Create your complain...</h1>
            <h1>Make you city cleaner and greener...</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="zoneName">Zone Name:</label>
                    <input
                        type="text"
                        id="zoneName"
                        value={zoneName}
                        onChange={(e) => setZoneName(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="areaName">Area Name:</label>
                    <input
                        type="text"
                        id="areaName"
                        value={areaName}
                        onChange={(e) => setAreaName(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="status">Status:</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="">Select Status</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="zoneOfficerId">Zone Officer ID:</label>
                    <input
                        type="number"
                        id="zoneOfficerId"
                        value={zoneOfficerId}
                        onChange={(e) => setZoneOfficerId(Number(e.target.value))}
                    />
                </div>

                {error && <p style={{ color: "red" }}>{error}</p>}
                {success && <p style={{ color: "green" }}>{success}</p>}

                <button type="submit">Submit</button>
            </form>

            <Footer />  
        </>
    );
}