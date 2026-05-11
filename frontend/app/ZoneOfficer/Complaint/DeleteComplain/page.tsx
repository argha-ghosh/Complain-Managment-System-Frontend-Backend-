"use client";

import { useState } from "react";
import Header from "../../../../components/header";
import axios from "axios";

export default function DeleteComplaint() {
    const [complaintId, setComplaintId] = useState<number>(0);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");

    const handleDelete = (e: React.SyntheticEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (complaintId <= 0) {
            setError("Please enter a valid complaint ID.");
            return;
        }

        // Axios Call — DELETE /zone-officer/delete-complaint/:id
        axios.delete(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/zone-officer/delete-complaint/${complaintId}`)
            .then((response) => {
                console.log(response);
                setSuccess(`Complaint ID ${complaintId} deleted successfully!`);
                setComplaintId(0);
            })
            .catch((error) => {
                console.error(error);
                setError("Failed to delete complaint. Please check the ID and try again.");
            });
    };

    return (
        <>
            {<Header props={{ page: "Delete Complaint" }} />}

            <h1>Delete Complaint</h1>

            <form onSubmit={handleDelete}>
                <div>
                    <label htmlFor="complaintId">Complaint ID:</label>
                    <input
                        type="number"
                        id="complaintId"
                        value={complaintId}
                        onChange={(e) => setComplaintId(Number(e.target.value))}
                        className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {error && <p style={{ color: "red" }}>{error}</p>}
                {success && <p style={{ color: "green" }}>{success}</p>}

                <button type="submit">Delete</button>
            </form>
        </>
    );
}