import PushNotifications from "@pusher/push-notifications-server";

const instanceId = "1fb854d6-0a46-44a4-a861-a5f192854748";
let beamsClient: PushNotifications | null = null;

function getBeamsClient(): PushNotifications | null {
    if (beamsClient) {
        return beamsClient;
    }

    const secretKey = process.env.PUSHER_SECRET_KEY;
    if (!secretKey) {
        console.warn(
            "PUSHER_SECRET_KEY environment variable is not set. Pusher notifications will be disabled."
        );
        return null;
    }

    beamsClient = new PushNotifications({
        instanceId,
        secretKey,
    });

    return beamsClient;
}

export async function notifyComplaintCreated(
    zoneName: string,
    areaName: string
): Promise<void> {
    const client = getBeamsClient();
    if (!client) {
        return;
    }

    try {
        await client.publishToInterests(["complaints"], {
            web: {
                notification: {
                    title: "🌿 New Complaint Submitted",
                    body: `Zone: ${zoneName} — Area: ${areaName} `,

                    icon: "https://cdn-icons-png.flaticon.com/512/2452/2452565.png",
                },
            },
        });
        console.log("✅ Pusher notification sent");
    } catch (error) {
        console.error("Pusher notification error:", error);
    }
}
