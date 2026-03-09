import { useState, useCallback, useEffect } from "react";
import { useModal } from "../atoms/modal";

const useServerItem = (server, refetch, metric) => {
  const { open } = useModal();
  const [sshRefetch, setSSHRefetch] = useState(null);
  const [sshConnected, setSSHConnected] = useState(false);

  const registerSSHRefetch = useCallback((func) => {
    setSSHRefetch(func);
  }, []);

  // Initialize sshConnected from lastSeen
  useEffect(() => {
    const lastSeen = server.lastSeen ? new Date(server.lastSeen).getTime() : 0;
    if (Date.now() - lastSeen > 1000 * 60 * 10) {
      setSSHConnected(false);
    } else {
      setSSHConnected(true);
    }
  }, [server]);

  // Update sshConnected from metric isOnline
  useEffect(() => {
    if (metric?.isOnline === true) setSSHConnected(true);
    else if (metric?.isOnline === false) setSSHConnected(false);
  }, [metric?.isOnline]);

  const handleEdit = useCallback(async () => {
    const result = await open("serverInfo", {
      serverId: server.id,
    });

    if (result) {
      refetch();
      if (sshRefetch) sshRefetch();
    }
  }, [server.id, refetch, sshRefetch, open]);

  return { sshConnected, setSSHConnected, registerSSHRefetch, handleEdit };
};

export default useServerItem;
