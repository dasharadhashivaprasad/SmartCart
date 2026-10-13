jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    requestPermission: jest.fn().mockResolvedValue(undefined),
    createChannel: jest.fn().mockResolvedValue('cart-reminders'),
    createTriggerNotification: jest
      .fn()
      .mockResolvedValue('smartcart-cart-reminder'),
    cancelNotification: jest.fn().mockResolvedValue(undefined),
  },
  AndroidImportance: { DEFAULT: 3 },
  TriggerType: { TIMESTAMP: 0 },
}));
import notifee from '@notifee/react-native';
import {
  cancelCartReminder,
  scheduleCartReminder,
} from '../src/services/notifications';

it('schedules the abandoned-cart reminder and can cancel it', async () => {
  await scheduleCartReminder();
  expect(notifee.createTriggerNotification).toHaveBeenCalledWith(
    expect.objectContaining({
      id: 'smartcart-cart-reminder',
      title: 'Your picks are waiting',
    }),
    expect.objectContaining({ type: 0, timestamp: expect.any(Number) }),
  );
  await cancelCartReminder();
  expect(notifee.cancelNotification).toHaveBeenCalledWith(
    'smartcart-cart-reminder',
  );
});
