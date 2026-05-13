"use client";

import { useEffect } from "react";

export default function PusherNotification() {
    useEffect(() => {
        // Only run in browser
        if (typeof window === "undefined") return;

        // Initialize Pusher Beams
        import("@pusher/push-notifications-web").then(({ Client }) => {
            const beamsClient = new Client({
                instanceId: "1fb854d6-0a46-44a4-a861-a5f192854748",
            });

            beamsClient
                .start()
                .then(() => beamsClient.addDeviceInterest("complaints"))
                .then(() => {
                    console.log("✅ Pusher Beams: subscribed to complaints channel");
                })
                .catch((error: any) => {
                    console.error("Pusher Beams error:", error);
                });
        });
    }, []);

    return null; // no UI — runs in background
}