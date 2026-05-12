import Header from "@/components/header";
import { notFound } from "next/navigation";
import DeleteOfficerButton from "@/components/DeleteOfficerButton";

async function getOfficer(id: string) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}/zone-officer/${id}`,
            { cache: "no-store" }
        );
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

export default async function OfficerDetail({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const officer = await getOfficer(id);

    if (!officer) {
        notFound();
    }

    return (
        <>
            <Header props={{ page: "Officer Detail" }} />
            <main className="max-w-2xl mx-auto px-4 py-10">
                <a href="/ZoneOfficer" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
                    ← Back to All Officers
                </a>

                <div className="border border-gray-200 rounded-xl bg-white shadow-sm p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl uppercase">
                            {officer.name?.charAt(0) || "?"}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">{officer.name}</h1>
                            <p className="text-sm text-gray-500">Zone Officer</p>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        <DetailRow label="Officer ID" value={`#${id}`} />
                        <DetailRow label="Email" value={officer.email} />
                        <DetailRow label="NID" value={officer.nid} />
                    </div>

                    <div className="mt-6 flex gap-3">
                        <a href="/ZoneOfficer/EditOfficer"
                            className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                            Edit Officer
                        </a>

                        <DeleteOfficerButton id={id} />
                    </div>
                </div>
            </main>
        </>
    );
}

function DetailRow({ label, value }: { label: string; value: any }) {
    return (
        <div className="flex justify-between py-3">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-sm font-medium text-gray-800">{value}</span>
        </div>
    );
}