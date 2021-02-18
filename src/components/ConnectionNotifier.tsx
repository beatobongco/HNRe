import React, { useEffect, useState } from "react";
import "./ConnectionNotifier.css";

const notifDuration = 2500;

enum ConnectionMessage {
  ONLINE = "Connected to HN",
  OFFLINE = "Offline, using cache",
}

interface ConnectionNotifierProps {
  isOnline: boolean;
}

export const ConnectionNotifier = ({ isOnline }: ConnectionNotifierProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, notifDuration);
    return () => clearTimeout(timer);
  }, [isOnline]);

  return isVisible ? (
    <div className="connection-notifier">
      {isOnline ? ConnectionMessage.ONLINE : ConnectionMessage.OFFLINE}
    </div>
  ) : null;
};
