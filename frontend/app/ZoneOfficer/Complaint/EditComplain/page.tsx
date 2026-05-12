"use client";

import { useState } from "react";
import Header from "../../../../components/header";
import Footer from "@/components/footer";   
import axios from "axios";

export default function Complaints() {
    const [officerId, setOfficerId] = useState<number>(0);
    const [jsonData, setJsonData] = useState(null);
    const [fetchError, setFetchError] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<{ [key: number]: string }>({});  // For PATCH — track status per complaint
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
                // Refresh after delete
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
                <div key={index} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                    <h2>complaintId: {item.complaintId}</h2>
                    <h2>zoneName: {item.zoneName}</h2>
                    <h2>areaName: {item.areaName}</h2>
                    <h2>description: {item.description}</h2>
                    <h2>status: {item.status}</h2>
                    <h2>zoneOfficerId: {item.zoneOfficerId}</h2>

                    {/* PATCH — Update Status */}
                    <div style={{ marginTop: "8px" }}>
                        <label>Update Status: </label>
                        <select
                            value={selectedStatus[item.complaintId] || item.status}
                            onChange={(e) => setSelectedStatus((prev) => ({
                                ...prev,
                                [item.complaintId]: e.target.value
                            }))}
                            className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                        <button
                            onClick={() => updateStatus(item.complaintId)}
                            style={{ marginLeft: "8px" }}
                        >
                            Update Status
                        </button>
                    </div>

                    {/* DELETE */}
                    <div style={{ marginTop: "8px" }}>
                        <button
                            onClick={() => deleteComplaint(item.complaintId)}
                            style={{ color: "red" }}
                        >
                            Delete
                        </button>
                    </div>

                    <hr />
                </div>
            ))
        );
    };

    // const printObject = (jsonData: any) => {
    //     return (
    //         <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
    //             <h2>complaintId: {jsonData.complaintId}</h2>
    //             <h2>zoneName: {jsonData.zoneName}</h2>
    //             <h2>areaName: {jsonData.areaName}</h2>
    //             <h2>description: {jsonData.description}</h2>
    //             <h2>status: {jsonData.status}</h2>
    //             <h2>zoneOfficerId: {jsonData.zoneOfficerId}</h2>

    //             {/* PATCH — Update Status */}
    //             <div style={{ marginTop: "8px" }}>
    //                 <label>Update Status: </label>
    //                 <select
    //                     value={selectedStatus[jsonData.complaintId] || jsonData.status}
    //                     onChange={(e) => setSelectedStatus((prev) => ({
    //                         ...prev,
    //                         [jsonData.complaintId]: e.target.value
    //                     }))}
    //                     className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
    //                 >
    //                     <option value="Pending">Pending</option>
    //                     <option value="In Progress">In Progress</option>
    //                     <option value="Resolved">Resolved</option>
    //                 </select>
    //                 <button
    //                     onClick={() => updateStatus(jsonData.complaintId)}
    //                     style={{ marginLeft: "8px" }}
    //                 >
    //                     Update Status
    //                 </button>
    //             </div>

    //             {/* DELETE */}
    //             <div style={{ marginTop: "8px" }}>
    //                 <button
    //                     onClick={() => deleteComplaint(jsonData.complaintId)}
    //                     style={{ color: "red" }}
    //                 >
    //                     Delete
    //                 </button>
    //             </div>
    //             <hr />
    //         </div>
    //     );
    // };

    return (
        <>
            {<Header props={{ page: "Complaints" }} />}

            <h1>Complaints</h1>

            {/* GET — Fetch Complaints by Officer ID */}
            <form onSubmit={fetchComplaints}>
                <div>
                    <label htmlFor="officerId">Zone Officer ID:</label>
                    <input
                        type="number"
                        id="officerId"
                        value={officerId}
                        onChange={(e) => setOfficerId(Number(e.target.value))}
                        className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {fetchError && <p style={{ color: "red" }}>{fetchError}</p>}

                <button type="submit">Get Complaints</button>
            </form>

            {/* PATCH / DELETE feedback messages */}
            {patchSuccess && <p style={{ color: "green" }}>{patchSuccess}</p>}
            {patchError && <p style={{ color: "red" }}>{patchError}</p>}
            {deleteSuccess && <p style={{ color: "green" }}>{deleteSuccess}</p>}
            {deleteError && <p style={{ color: "red" }}>{deleteError}</p>}

            {/* Display Complaints */}
            <div style={{ marginTop: "20px" }}>
                {jsonData != null && (
                    <div>
                        {Array.isArray(jsonData) ? printArray(jsonData) : printArray([jsonData])}
                    </div>
                )}
            </div>

            <Footer />  
        </> 
    );
}