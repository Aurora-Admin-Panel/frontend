import { useState, useCallback, useEffect } from "react";
import { useModalReducer } from "../atoms/modal";

const useServerItem = (server, refetch) => {
  const { showModal } = useModalReducer();
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

  const handleEdit = useCallback(() => {
    showModal({
      modalType: "serverInfo",
      modalProps: {
        serverId: server.id,
        refetch: refetch,
      },
      onConfirm: () => {
        refetch();
        if (sshRefetch) sshRefetch();
      },
    });
  }, [server.id, refetch, sshRefetch, showModal]);

  return { sshConnected, setSSHConnected, registerSSHRefetch, handleEdit };
};

export default useServerItem;
