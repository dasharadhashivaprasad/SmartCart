import notifee, {
  AndroidImportance,
  TriggerType,
  type TimestampTrigger,
} from '@notifee/react-native';
const reminderId = 'smartcart-cart-reminder';
export async function scheduleCartReminder() {
  await notifee.requestPermission();
  await notifee.createChannel({
    id: 'cart-reminders',
    name: 'Cart reminders',
    importance: AndroidImportance.DEFAULT,
  });
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: Date.now() + 60 * 60 * 1000,
  };
  await notifee.createTriggerNotification(
    {
      id: reminderId,
      title: 'Your picks are waiting',
      body: 'Come back to SmartCart when you are ready to check out.',
      android: { channelId: 'cart-reminders' },
    },
    trigger,
  );
}
export async function cancelCartReminder() {
  await notifee.cancelNotification(reminderId);
}
