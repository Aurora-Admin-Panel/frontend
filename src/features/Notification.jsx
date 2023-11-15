import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { X } from "phosphor-react";
import classNames from "classnames";
import { removeNotification } from "../store/reducers/notification";

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
  const { notifications } = useSelector((state) => state.notification);
  const dispatch = useDispatch();
  const { t } = useTranslation();
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
      dispatch(removeNotification(id));
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
          dispatch(removeNotification(notification.id));
          timers.current.delete(notification.id);
          startTimes.current.delete(notification.id);
          remainingDurations.current.delete(notification.id);
        }, notification.duration);
        timers.current.set(notification.id, timer);
        startTimes.current.set(notification.id, Date.now());
        remainingDurations.current.set(notification.id, notification.duration);
      }
    });
  }, [notifications, dispatch]);

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);
  return (
    <>
      <div className="fixed top-16 right-8 z-50 flex flex-col items-end space-y-2">
        {notifications.map((notification) => (
          <div
            className="inline-flex"
            key={notification.id}
            onMouseEnter={() => pauseTimer(notification.id)}
            onMouseLeave={() => resumeTimer(notification.id)}
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
                    <div className="text-xs">
                      {notification.title && (<span className="font-bold">[{t(notification.title)}]&nbsp;</span>)}
                      {t(notification.body)}
                    </div>
                  )}
                </div>
              </div>
              <button
                className="btn btn-circle btn-outline btn-xs"
                onClick={() => dispatch(removeNotification(notification.id))}
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
          </div>
        ))}
      </div>
    </>
  );
};

export default Notification;
