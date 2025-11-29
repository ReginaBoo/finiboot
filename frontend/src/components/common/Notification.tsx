import { Fragment, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { IoIosCloseCircleOutline } from "react-icons/io";
interface NotificationProps {
  show: boolean;
  message: string;
  onClose: () => void;
  type?: 'success' | 'error' | 'warning';
  duration?: number;
}

export function Notification({ show, message, onClose, type = 'success', duration = 2000 }: NotificationProps) {
  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  };



  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);
  return (
    <>
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          <Transition
            show={show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg ${styles[type]}`}>
              <div className="p-4">
                <div className="flex items-start">

                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium">
                      {message}
                    </p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md hover:bg-white hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close</span>
                      <IoIosCloseCircleOutline size={24} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
}