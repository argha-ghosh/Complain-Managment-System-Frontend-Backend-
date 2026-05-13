"use client";

import axios from "axios";
import { useRouter } from "next/navigation";

export default function DeleteOfficerButton({ id }: { id: string }) {
    const router = useRouter();

    function handleDelete() {
        if (!confirm("Are you sure you want to delete this officer?")) return;

        axios.delete(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/zone-officer/delete-zone-officer/${id}`)
            .then(() => {
                alert("Officer deleted successfully!");
                router.push("/ZoneOfficer");  // redirect after delete
            })
            .catch((error) => {
                console.error(error);
                alert("Failed to delete officer. Please try again.");
            });
    }

    return (
        <button
            onClick={handleDelete}
            className="flex-1 text-center border border-red-300 hover:bg-red-50 text-red-600 text-sm font-medium py-2 rounded-lg transition-colors"
        >
            Delete Officer
        </button>
    );
}