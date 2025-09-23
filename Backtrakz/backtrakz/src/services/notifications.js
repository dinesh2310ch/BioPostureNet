// src/services/notifications.js
import { LocalNotifications } from '@capacitor/local-notifications';

// Function to schedule a daily reminder
export const scheduleDailyReminder = async () => {
  try {
    // 1. Request permission
    await LocalNotifications.requestPermissions();

    // 2. Clear any old notifications to avoid duplicates
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel(pending);
    }

    // 3. Schedule a new daily notification for 2 PM
    await LocalNotifications.schedule({
      notifications: [
        {
          title: "Posture Check!",
          body: "Don't forget your 2 PM posture monitoring session.",
          id: 1, // A unique ID
          schedule: {
            on: {
              hour: 14, // 2 PM
              minute: 0,
            },
            repeats: true, // Repeat daily
          },
        },
      ],
    });

    console.log("✅ Daily notification scheduled successfully!");

  } catch (error) {
    console.error("Error scheduling notification:", error);
  }
};

// Function to cancel all scheduled notifications
export const cancelAllNotifications = async () => {
  try {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
        await LocalNotifications.cancel(pending);
        console.log("🚫 All notifications cancelled.");
    }
  } catch(error) {
      console.error("Error cancelling notifications:", error);
  }
};