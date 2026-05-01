"use client";

import z from "zod";
import { useState, ChangeEvent, SyntheticEvent, useEffect } from "react";
import Header from "../../../components/header";


const ZoneOfficerHomeSchema = z.object({
    zoneName: z
        .string()
        .min(1, "Zone name is required")
        .max(25, "Zone name cannot exceed 25 characters"),
    areaName: z
        .string()
        .min(1, "Area name is required")
        .max(25, "Area name cannot exceed 25 characters"),
    description: z
        .string()
        .min(1, "Description is required")
        .max(100, "Description cannot exceed 100 characters"),
    status: z
        .string()
        .min(1, "Status is required")
        .regex(/^(Pending|In Progress|Resolved)$/, {
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

    const handleSubmit = (e: SyntheticEvent<HTMLFormElement>): void => {
        e.preventDefault();

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

        console.log(result.data);
        setZoneName("");
        setAreaName("");
        setDescription("");
        setStatus("");
        setZoneOfficerId(0);
        setError("");
    };

    return (
        <>

            {<Header props={{ page: "Home" }} />}

            <h1>Zone Officer Home</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="zoneName">Zone Name:</label>
                    <input
                        type="text"
                        id="zoneName"
                        value={zoneName}
                        onChange={(e) => setZoneName(e.target.value)}
                        className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="areaName">Area Name:</label>
                    <input
                        type="text"
                        id="areaName"
                        value={areaName}
                        onChange={(e) => setAreaName(e.target.value)}
                        className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="status">Status:</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit">Submit</button>
            </form>
        </>
    );
}
