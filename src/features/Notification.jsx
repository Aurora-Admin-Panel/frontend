import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { X } from "phosphor-react";
import classNames from "classnames";
import { useNotificationsReducer } from "../atoms/notification";

const typeToClass = (type) => {
  switch (type) {
    case "success":
    case "info":
    case "warning":
    case "error":
      return `alert-${type}`;
    default:
      return "";
  }
};

const ProgressBar = ({ duration, type, pausedState }) => {
  const [progress, setProgress] = useState(100);
  const interval = useRef(null);

  useEffect(() => {
    return () => clearInterval(interval.current);
  }, []);
  useEffect(() => {
    if (pausedState) {
      if (pausedState.paused) {
        clearInterval(interval.current);
      } else {
        interval.current = setInterval(() => {
          setProgress((prevProgress) =>
            Math.max(prevProgress - 100 / (duration / 100), 0)
          );
        }, 100);
      }
    } else {
      interval.current = setInterval(() => {
        setProgress((prevProgress) =>
          Math.max(prevProgress - 100 / (duration / 100), 0)
        );
      }, 100);
    }
  }, [duration, pausedState]);

  return (
    <div className={`h-1 w-full bg-${type}/50 rounded`}>
      <div
        className={`h-1 bg-${type}-content rounded`}
        style={{ width: `${progress}%`, transition: "width 100ms linear" }}
      ></div>
    </div>
  );
};

const Notification = () => {
  const { notifications, removeNotification } = useNotificationsReducer();
  const timers = useRef(new Map());
  const startTimes = useRef(new Map());
  const remainingDurations = useRef(new Map());
  const [pausedState, setPausedState] = useState({ id: null, paused: false });

  const pauseTimer = (id) => {
    clearTimeout(timers.current.get(id));
    remainingDurations.current.set(
      id,
      startTimes.current.get(id) +
      remainingDurations.current.get(id) -
      Date.now()
    );
    setPausedState({ id, paused: true });
  };

  const resumeTimer = (id) => {
    const timer = setTimeout(() => {
      removeNotification(id);
      timers.current.delete(id);
      startTimes.current.delete(id);
      remainingDurations.current.delete(id);
    }, remainingDurations.current.get(id));
    timers.current.set(id, timer);
    startTimes.current.set(id, Date.now());
    setPausedState({ id, paused: false });
  };

  useEffect(() => {
    notifications.forEach((notification) => {
      if (!timers.current.has(notification.id)) {
        const timer = setTimeout(() => {
          removeNotification(notification.id);
          timers.current.delete(notification.id);
          startTimes.current.delete(notification.id);
          remainingDurations.current.delete(notification.id);
        }, notification.duration);
        timers.current.set(notification.id, timer);
        startTimes.current.set(notification.id, Date.now());
        remainingDurations.current.set(notification.id, notification.duration);
      }
    });
  }, [notifications]);

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);
  return (
    <>
      <ul className="fixed top-16 right-8 z-50 flex flex-col items-end space-y-2">
        <AnimatePresence initial={false} mode="popLayout">
          {notifications.map((notification) => (
            <motion.li
              key={notification.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            >
              <div
                className={classNames(
                  "alert relative flex max-w-xs items-center overflow-hidden shadow-lg",
                  typeToClass(notification.type)
                )}
              >
                <div className="flex-1">
                  <div className="flex flex-row items-center justify-center space-x-2">
                    {notification.body && (
                      <div className={`text-xs text-${notification.type}-content`}>
                        {notification.title && (<span className="font-bold">[{notification.title}]&nbsp;</span>)}
                        {notification.body}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  className={`btn btn-circle btn-outline btn-xs text-${notification.type}-content`}
                  onClick={() => removeNotification(notification.id)}
                >
                  <X />
                </button>
                <div className="absolute inset-x-0 bottom-0 z-40 w-full">
                  <ProgressBar
                    duration={notification.duration}
                    type={notification.type}
                    pausedState={
                      pausedState.id === notification.id ? pausedState : null
                    }
                  />
                </div>

              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </>
  );
};

export default Notification;
