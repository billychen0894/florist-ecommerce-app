import { CheckCircleIcon } from '@heroicons/react/24/outline';

type ClickHandlerObj = {
  handler: () => void;
  buttonLabel: string;
};

interface NotificationProps {
  firstClickHanlder: ClickHandlerObj;
  secondClickHandler?: ClickHandlerObj;
  notificationText: string;
}

export default function Notification({
  firstClickHanlder,
  secondClickHandler,
  notificationText,
}: NotificationProps) {
  return (
    <div className="w-full max-w-sm space-y-3 p-2">
      <div className="flex items-center justify-center space-x-3">
        <CheckCircleIcon
          className="h-6 w-6 text-secondary-500"
          aria-hidden="true"
        />
        <p className="text-base font-medium text-gray-800">
          {notificationText}
        </p>
      </div>
      <div className="flex flex-shrink-0 space-x-2 justify-between items-center">
        <button
          type="button"
          className="inline-flex px-3 py-1 border rounded-full bg-primary-500 text-white hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          onClick={firstClickHanlder.handler}
        >
          {firstClickHanlder.buttonLabel}
        </button>
        {secondClickHandler && (
          <button
            type="button"
            className="inline-flex px-3 py-1 border rounded-full bg-primary-500 text-white hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            onClick={secondClickHandler?.handler}
          >
            {secondClickHandler?.buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
}
