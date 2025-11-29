import { useNotificationContext } from '../context/NotificationContext';
import { Notification } from './Notification';

export function GlobalNotification() {
  const { notification, hideNotification } = useNotificationContext();

  return (
    <Notification
      show={notification.show}
      message={notification.message}
      onClose={hideNotification}
      type={notification.type}
    />
  );
}