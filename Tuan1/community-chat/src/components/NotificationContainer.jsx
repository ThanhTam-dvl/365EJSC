// components/NotificationContainer.jsx
import { useNotifications } from '../stores/notification.store';

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 left-4 md:left-auto md:right-4 z-50 space-y-2 max-w-sm w-full mx-auto md:mx-0">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            p-4 rounded-lg shadow-lg border transform transition-all duration-300 animate-in slide-in-from-right
            ${notification.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-100' 
              : notification.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-100'
              : notification.type === 'warning'
              ? 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-100'
              : 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-100'
            }
          `}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 mr-2">
              {notification.title && (
                <h4 className="font-semibold text-sm mb-1">
                  {notification.title}
                </h4>
              )}
              <p className="text-sm break-words">{notification.message}</p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-lg font-bold"
              aria-label="Đóng thông báo"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}