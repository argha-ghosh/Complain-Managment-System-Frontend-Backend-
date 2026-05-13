"use client";

import { useState } from "react";
import Header from "../../../../components/header";
import Footer from "@/components/footer";   
import axios from "axios";

export default function Complaints() {
    const [officerId, setOfficerId] = useState<number>(0);
    const [jsonData, setJsonData] = useState(null);
    const [fetchError, setFetchError] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<{ [key: number]: string }>({});
    const [patchSuccess, setPatchSuccess] = useState<string>("");
    const [patchError, setPatchError] = useState<string>("");
    const [deleteSuccess, setDeleteSuccess] = useState<string>("");
    const [deleteError, setDeleteError] = useState<string>("");

    // Axios Call #1 — GET /zone-officer/officer/:officerId/complaints
    function fetchComplaints(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        setFetchError("");
        setJsonData(null);
        setPatchSuccess("");
        setPatchError("");
        setDeleteSuccess("");
        setDeleteError("");

        if (officerId <= 0) {
            setFetchError("Please enter a valid Officer ID.");
            return;
        }

        axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/zone-officer/officer/${officerId}/complaints`)
            .then((response) => {
                console.log(response);
                const jsonData = response.data;
                console.log(jsonData);
                setJsonData(jsonData);
            })
            .catch((error) => {
                console.error(error);
                setFetchError("Failed to fetch complaints. Please check the Officer ID.");
            });
    }

    // Axios Call #2 — PATCH /zone-officer/update-complaint/:id
    function updateStatus(complaintId: number) {
        setPatchSuccess("");
        setPatchError("");

        const status = selectedStatus[complaintId];
        if (!status) {
            setPatchError("Please select a status first.");
            return;
        }

        axios.patch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/zone-officer/update-complaint/${complaintId}`,
            { status: status }
        )
            .then((response) => {
                console.log(response);
                setPatchSuccess(`Complaint ID ${complaintId} status updated to "${status}" successfully!`);
            })
            .catch((error) => {
                console.error(error);
                setPatchError("Failed to update status. Please try again.");
            });
    }

    // Axios Call #3 — DELETE /zone-officer/delete-complaint/:id
    function deleteComplaint(complaintId: number) {
        setDeleteSuccess("");
        setDeleteError("");

        axios.delete(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/zone-officer/delete-complaint/${complaintId}`)
            .then((response) => {
                console.log(response);
                setDeleteSuccess(`Complaint ID ${complaintId} deleted successfully!`);
                axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/zone-officer/officer/${officerId}/complaints`)
                    .then((res) => setJsonData(res.data))
                    .catch((err) => console.error(err));
            })
            .catch((error) => {
                console.error(error);
                setDeleteError("Failed to delete complaint. Please try again.");
            });
    }

    const printArray = (jsonData: any) => {
        return (
            jsonData.map((item: any, index: number) => (
                <div key={index} className="bg-white shadow-lg rounded-lg p-6 mb-6">
                    <div className="bg-gray-100 p-4 rounded-lg border border-gray-300 mb-4">
                        <div className="text-lg font-bold text-gray-800">Complaint ID: {item.complaintId}</div>
                        <div className="mt-2 text-gray-600">Zone: {item.zoneName}</div>
                        <div className="mt-2 text-gray-600">Area: {item.areaName}</div>
                        <div className="mt-2 text-gray-600">Description: {item.description}</div>
                        <div className="mt-2 text-gray-600">Status: {item.status}</div>
                        <div className="mt-2 text-gray-600">Zone Officer ID: {item.zoneOfficerId}</div>
                    </div>

                    {/* PATCH — Update Status */}
                    <div className="status-update mt-4">
                        <label htmlFor={`status-${item.complaintId}`} className="block text-sm text-gray-700">Update Status: </label>
                        <select
                            id={`status-${item.complaintId}`}
                            value={selectedStatus[item.complaintId] || item.status}
                            onChange={(e) => setSelectedStatus((prev) => ({
                                ...prev,
                                [item.complaintId]: e.target.value
                            }))}
                            className="status-select border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                        <button
                            onClick={() => updateStatus(item.complaintId)}
                            className="status-update-btn ml-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all"
                        >
                            Update Status
                        </button>
                    </div>

                    {/* ✅ CHANGED — Delete button now visible with red background */}
                    <div className="mt-4">
                        <button
                            onClick={() => deleteComplaint(item.complaintId)}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-lg transition-all"
                        >
                            🗑 Delete
                        </button>
                    </div>
                </div>
            ))
        );
    };

    return (
        // ✅ CHANGED — background color to green mixed with light gray
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-green-100">

            {/* <Header props={{ page: "Complaints" }} /> */}

            {/* Emoji and Title Section */}
            <div className="text-center mb-6 pt-10">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-yellow-300 text-green-600 text-3xl mb-4">
                    🌿
                </div>
                <h1 className="text-5xl font-extrabold text-gray-800">Complaints</h1>
            </div>

            {/* GET — Fetch Complaints by Officer ID */}
            <form onSubmit={fetchComplaints} className="flex justify-center mb-6">
                <div className="flex items-center space-x-4">
                    <label htmlFor="officerId" className="text-lg">Zone Officer ID:</label>
                    <input
                        type="number"
                        id="officerId"
                        value={officerId}
                        onChange={(e) => setOfficerId(Number(e.target.value))}
                        className="input-field border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {fetchError && <p className="error-message text-red-500">{fetchError}</p>}
                    <button type="submit" className="fetch-button bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition-all">
                        Get Complaints
                    </button>
                </div>
            </form>

            {/* PATCH / DELETE feedback messages */}
            {patchSuccess && <p className="text-center text-green-600">{patchSuccess}</p>}
            {patchError && <p className="text-center text-red-600">{patchError}</p>}
            {deleteSuccess && <p className="text-center text-green-600">{deleteSuccess}</p>}
            {deleteError && <p className="text-center text-red-600">{deleteError}</p>}

            {/* Display Complaints */}
            <div className="max-w-3xl mx-auto px-4 mt-6 pb-10">
                {jsonData != null && (
                    <div>
                        {Array.isArray(jsonData) ? printArray(jsonData) : printArray([jsonData])}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}