import React, { useEffect, useState } from "react";
import "./ConnectionNotifier.css";

const notifDuration = 2500;

enum ConnectionMessage {
  ONLINE = "Connected to HN",
  OFFLINE = "Offline, using cache",
}

enum CMAnimation {
  ONLINE = "fadeInRight",
  OFFLINE = "fadeOutRight",
}

interface ConnectionNotifierProps {
  isOnline: boolean;
}

/**
 * A toast-like notification that lets the user know the state of their connection
 */
export const ConnectionNotifier = ({ isOnline }: ConnectionNotifierProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, notifDuration);
    return () => clearTimeout(timer);
  }, [isOnline]);

  return (
    <div
      className={`connection-notifier ${
        isVisible ? CMAnimation.ONLINE : CMAnimation.OFFLINE
      }`}
    >
      {isOnline ? ConnectionMessage.ONLINE : ConnectionMessage.OFFLINE}
    </div>
  );
};
