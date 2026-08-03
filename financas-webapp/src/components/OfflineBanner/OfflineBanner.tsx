import { useEffect, useState } from "react";

import "./OfflineBanner.css";

/**
 * Banner fixo exibido no topo da aplicação quando o navegador perde a
 * conexão, e novamente por alguns segundos ao reconectar. Não depende do
 * Service Worker diretamente — usa os eventos nativos `online`/`offline`
 * do navegador para refletir o estado de rede em tempo real dentro da SPA.
 */
function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      setShowReconnected(true);
    }

    function handleOffline() {
      setIsOnline(false);
      setShowReconnected(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!showReconnected) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setShowReconnected(false);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [showReconnected]);

  if (isOnline && !showReconnected) {
    return null;
  }

  return (
    <div
      className={`offline-banner ${isOnline ? "online" : "offline"}`}
      role="status"
    >
      <span className="offline-banner-dot" />

      {isOnline
        ? "Conexão restabelecida."
        : "Você está offline. Exibindo dados em cache quando disponíveis."}
    </div>
  );
}

export default OfflineBanner;
