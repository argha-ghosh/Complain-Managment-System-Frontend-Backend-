import PushNotifications from '@pusher/push-notifications-server';
import Pusher from 'pusher';

// ─── Pusher Channels (used by admin part) ────────────────────────────────────
// Triggers realtime events to connected frontend clients
export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || '',
  key: process.env.PUSHER_KEY || '',
  secret: process.env.PUSHER_CHANNELS_SECRET || '',
  cluster: process.env.PUSHER_CLUSTER || 'ap1',
  useTLS: true,
});

// ─── Pusher Beams (used by Zone Officer part) ─────────────────────────────────
// Sends push notifications to subscribed devices/browsers
const instanceId = process.env.PUSHER_INSTANCE_ID || '';

let beamsClient: PushNotifications | null = null;

function getBeamsClient(): PushNotifications | null {
  if (beamsClient) return beamsClient;

  const secretKey = process.env.PUSHER_SECRET_KEY;
  if (!secretKey) {
    console.warn(
      'PUSHER_SECRET_KEY not set. Pusher Beams notifications will be disabled.',
    );
    return null;
  }

  beamsClient = new PushNotifications({ instanceId, secretKey });
  return beamsClient;
}

export async function notifyComplaintCreated(
  zoneName: string,
  areaName: string,
): Promise<void> {
  const client = getBeamsClient();
  if (!client) return;

  try {
    await client.publishToInterests(['complaints'], {
      web: {
        notification: {
          title: '🌿 New Complaint Submitted',
          body: `Zone: ${zoneName} — Area: ${areaName}`,
          icon: 'https://cdn-icons-png.flaticon.com/512/2452/2452565.png',
        },
      },
    });
    console.log('✅ Pusher Beams notification sent');
  } catch (error) {
    console.error('Pusher Beams error:', error);
  }
}
