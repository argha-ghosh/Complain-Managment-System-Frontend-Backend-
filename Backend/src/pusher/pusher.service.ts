import * as dotenv from 'dotenv';
import * as path from 'path';
import PushNotifications from '@pusher/push-notifications-server';
import Pusher from 'pusher';

// Load .env here so this module can read Pusher config even if env vars are not preloaded
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// ─── Pusher Channels (used by admin part) ────────────────────────────────────
const pusherAppId = process.env.PUSHER_APP_ID?.trim();
const pusherKey = process.env.PUSHER_KEY?.trim();
const pusherSecret = process.env.PUSHER_CHANNELS_SECRET?.trim() || process.env.PUSHER_SECRET_KEY?.trim();

export const pusher = (pusherAppId && pusherKey && pusherSecret)
  ? new Pusher({
      appId: pusherAppId,
      key: pusherKey,
      secret: pusherSecret,
      cluster: process.env.PUSHER_CLUSTER || 'ap1',
      useTLS: true,
    })
  : null;

// ─── Pusher Beams (used by Zone Officer part) ─────────────────────────────────
let beamsClient: PushNotifications | null = null;

function getBeamsClient(): PushNotifications | null {
  if (beamsClient) return beamsClient;

  const secretKey = process.env.PUSHER_SECRET_KEY?.trim();
  console.log('🔑 SECRET KEY:', secretKey);
  console.log('🔑 INSTANCE ID:', process.env.PUSHER_INSTANCE_ID);

  if (!secretKey) {
    console.warn('PUSHER_SECRET_KEY not set. Pusher Beams notifications will be disabled.');
    return null;
  }

  const instanceId = process.env.PUSHER_INSTANCE_ID?.trim();
  if (!instanceId) {
    console.warn('PUSHER_INSTANCE_ID not set. Pusher Beams notifications will be disabled.');
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
  if (client) {
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
      return;
    } catch (error) {
      console.error('Pusher Beams error:', error);
      return;
    }
  }

  // Pusher Channels not configured — silently return
  if (!pusher) {
    return;
  }

  try {
    await pusher.trigger('complaints', 'complaint-created', {
      title: '🌿 New Complaint Submitted',
      zoneName,
      areaName,
    });
    console.log('✅ Pusher Channels notification sent');
  } catch (error) {
    console.error('Pusher Channels error:', error);
  }
}