import Header from "@/components/header";
import Footer from "@/components/footer";

async function getAllOfficers() {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}/zone-officer/all`,
            { cache: "no-store" }  // no-store = always fetch fresh (SSR)
        );
        if (!res.ok) throw new Error("Failed to fetch");
        return await res.json();
    } catch {
        return null;
    }
}

export default async function AllOfficers() {
    const officers = await getAllOfficers();

    return (
        <>
            {/* Gradient background applied to the whole page */}
            <div className="min-h-screen bg-gradient-to-br from-[#fbf5f5] via-[#c5fbd7] to-[#c8f5d6]">
                {/* <Header props={{ page: "All Officers" }} /> */}

                <main className="max-w-4xl mx-auto px-4 py-8">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800">
                        All Zone Officers
                    </h1>

                    {officers === null && (
                        <p className="text-red-500">
                            Failed to fetch zone officers. Please try again later.
                        </p>
                    )}

                    {officers && officers.length === 0 && (
                        <p className="text-gray-500">No zone officers found.</p>
                    )}

                    {officers && officers.length > 0 && (
                        <div className="grid gap-4">
                            {officers.map((officer: any) => (
                                <div
                                    key={officer.id}
                                    className="flex items-center justify-between border border-gray-200 rounded-lg px-5 py-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Avatar circle */}
                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm uppercase">
                                            {officer.name?.charAt(0) || "?"}
                                        </div>

                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {officer.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {officer.email}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                NID: {officer.nid} &nbsp;·&nbsp; ID: #{officer.id}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Link to dynamic detail page */}
                                    <a
                                        href={`/ZoneOfficer/${officer.id}`}
                                        className="text-sm text-blue-600 hover:underline font-medium"
                                    >
                                        View Details →
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
            <Footer />
        </>
    );
}
