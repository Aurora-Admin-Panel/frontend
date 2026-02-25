import { useState, useCallback, useEffect } from "react";
import { useModal } from "../atoms/modal";

const useServerItem = (server, refetch) => {
  const { open } = useModal();
  const [sshRefetch, setSSHRefetch] = useState(null);
  const [sshConnected, setSSHConnected] = useState(false);

  const registerSSHRefetch = useCallback((func) => {
    setSSHRefetch(func);
  }, []);

  // Initialize sshConnected from lastSeen
  useEffect(() => {
    if (Date.now() - server.lastSeen > 1000 * 60 * 10) {
      setSSHConnected(false);
    } else {
      setSSHConnected(true);
    }
  }, [server]);

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
