import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useApolloClient } from "@apollo/client";
import classNames from "classnames";
import DataLoading from "../DataLoading";
import DeploymentStatusBadge from "./DeploymentStatusBadge";
import {
  GET_SERVER_DEPLOYMENT,
  REDEPLOY_EXECUTABLE,
  STOP_DEPLOYMENT,
  START_DEPLOYMENT,
  REMOVE_DEPLOYMENT,
  TASK_STREAM_SUBSCRIPTION,
} from "../../queries/deployment";
import { useModal } from "../../atoms/modal";
import ModalShell from "../ui/ModalShell";

const DeploymentDetailModal = ({ modalProps, close, resolve }) => {
  const { t } = useTranslation();
  const { confirm } = useModal();
  const client = useApolloClient();
  const { deploymentId } = modalProps;

  const { data, loading, refetch } = useQuery(GET_SERVER_DEPLOYMENT, {
    variables: { id: deploymentId },
    fetchPolicy: "network-only",
  });

  const [redeployMutation, { loading: redeploying }] = useMutation(REDEPLOY_EXECUTABLE);
  const [stopMutation, { loading: stopping }] = useMutation(STOP_DEPLOYMENT);
  const [startMutation, { loading: starting }] = useMutation(START_DEPLOYMENT);
  const [removeMutation, { loading: removing }] = useMutation(REMOVE_DEPLOYMENT);

  // Streaming output
  const [streamingTaskId, setStreamingTaskId] = useState(null);
  const [streamOutput, setStreamOutput] = useState([]);
  const outputRef = useRef(null);

  const deployment = data?.serverDeployment;
  const logs = deployment?.logs ?? [];

  // Auto-scroll output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [streamOutput]);

  // Subscribe to task stream
  useEffect(() => {
    if (!streamingTaskId) return;
    setStreamOutput([]);

    const subscription = client
      .subscribe({
        query: TASK_STREAM_SUBSCRIPTION,
        variables: { taskId: streamingTaskId },
      })
      .subscribe({
        next: ({ data }) => {
          if (data?.taskStream) {
            const msg = data.taskStream;
            if (typeof msg === "object" && msg.data) {
              setStreamOutput((prev) => [...prev, msg.data]);
            } else if (typeof msg === "string") {
              setStreamOutput((prev) => [...prev, msg]);
            } else if (typeof msg === "object" && msg.text) {
              setStreamOutput((prev) => [...prev, msg.text]);
            }
          }
        },
        error: () => {
          setStreamingTaskId(null);
        },
        complete: () => {
          setStreamingTaskId(null);
          refetch();
        },
      });

    return () => subscription.unsubscribe();
  }, [streamingTaskId, client]);

  const handleRedeploy = async () => {
    const confirmed = await confirm({
      title: t("Redeploy"),
      message: t("Are you sure you want to redeploy?"),
    });
    if (!confirmed) return;
    const { data } = await redeployMutation({
      variables: { deploymentId },
    });
    if (data?.redeployExecutable?.taskId) {
      setStreamingTaskId(data.redeployExecutable.taskId);
    }
    refetch();
  };

  const handleStop = async () => {
    const confirmed = await confirm({
      title: t("Stop"),
      message: t("Are you sure you want to stop this deployment?"),
    });
    if (!confirmed) return;
    const { data } = await stopMutation({
      variables: { deploymentId },
    });
    if (data?.stopDeployment?.taskId) {
      setStreamingTaskId(data.stopDeployment.taskId);
    }
    refetch();
  };

  const handleStart = async () => {
    const { data } = await startMutation({
      variables: { deploymentId },
    });
    if (data?.startDeployment?.taskId) {
      setStreamingTaskId(data.startDeployment.taskId);
    }
    refetch();
  };

  const handleRemove = async () => {
    const confirmed = await confirm({
      title: t("Remove"),
      message: t("Are you sure you want to remove this deployment? This will stop the service and delete files."),
    });
    if (!confirmed) return;
    const { data } = await removeMutation({
      variables: { deploymentId },
    });
    if (data?.removeDeployment?.taskId) {
      setStreamingTaskId(data.removeDeployment.taskId);
    }
    refetch();
  };

  const handleViewLog = useCallback((log) => {
    if (log.taskId) {
      setStreamingTaskId(log.taskId);
    }
  }, []);

  const handleClose = () => {
    if (resolve) resolve(true);
    close();
  };

  const isActionLoading = redeploying || stopping || starting || removing;

  return (
    <ModalShell
      title={`${t("Deployment")} #${deploymentId}`}
      onClose={handleClose}
      maxWidth="max-w-3xl"
      footer={
        <button className="btn btn-outline" onClick={handleClose}>
          {t("Close")}
        </button>
      }
    >
      {loading ? (
        <div className="py-8">
          <DataLoading />
        </div>
      ) : !deployment ? (
        <div className="py-8 text-center text-sm opacity-70">
          {t("Deployment not found")}
        </div>
      ) : (
        <>
          {/* Status overview */}
          <div className="flex flex-wrap items-center gap-3">
            <DeploymentStatusBadge status={deployment.status} />
            <span className="text-xs opacity-60">
              {t("Server")}: #{deployment.serverId}
            </span>
            <span className="text-xs opacity-60">
              {t("Binding")}: #{deployment.serviceBindingId}
            </span>
            {deployment.port && (
              <span className="badge badge-outline badge-sm">
                {t("Port")} {deployment.port.num}
                {deployment.port.externalNum && deployment.port.externalNum !== deployment.port.num
                  ? ` (ext: ${deployment.port.externalNum})`
                  : ""}
              </span>
            )}
            <span className="text-xs opacity-60">
              {t("Updated")}:{" "}
              {deployment.updatedAt
                ? new Date(deployment.updatedAt).toLocaleString()
                : "-"}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              className={classNames("btn btn-primary btn-sm", { loading: redeploying })}
              onClick={handleRedeploy}
              disabled={isActionLoading}
            >
              {t("Redeploy")}
            </button>
            {deployment.status === "deployed" && (
              <button
                className={classNames("btn btn-warning btn-sm", { loading: stopping })}
                onClick={handleStop}
                disabled={isActionLoading}
              >
                {t("Stop")}
              </button>
            )}
            {deployment.status === "stopped" && (
              <button
                className={classNames("btn btn-success btn-sm", { loading: starting })}
                onClick={handleStart}
                disabled={isActionLoading}
              >
                {t("Start")}
              </button>
            )}
            <button
              className={classNames("btn btn-error btn-outline btn-sm", {
                loading: removing,
              })}
              onClick={handleRemove}
              disabled={isActionLoading}
            >
              {t("Remove")}
            </button>
          </div>

          {/* Current values */}
          {deployment.valuesJson &&
            Object.keys(deployment.valuesJson).length > 0 && (
              <details className="collapse collapse-arrow bg-base-300">
                <summary className="collapse-title text-sm font-medium">
                  {t("Current Values")}
                </summary>
                <div className="collapse-content">
                  <pre className="max-h-40 overflow-auto rounded bg-base-100 p-2 text-xs">
                    {JSON.stringify(deployment.valuesJson, null, 2)}
                  </pre>
                </div>
              </details>
            )}

          {/* Streaming output */}
          {streamOutput.length > 0 && (
            <div>
              <h4 className="mb-1 text-sm font-semibold">{t("Live Output")}</h4>
              <div
                ref={outputRef}
                className="max-h-48 overflow-auto rounded-lg bg-neutral p-3 font-mono text-xs text-neutral-content"
              >
                {streamOutput.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
                {streamingTaskId && (
                  <div className="animate-pulse opacity-60">&#9608;</div>
                )}
              </div>
            </div>
          )}

          {/* Logs history */}
          <div>
            <h4 className="mb-1 text-sm font-semibold">{t("Log History")}</h4>
            {logs.length === 0 ? (
              <div className="text-xs opacity-60">{t("No logs yet")}</div>
            ) : (
              <div className="max-h-48 overflow-auto">
                <table className="table table-xs">
                  <thead>
                    <tr>
                      <th>{t("Action")}</th>
                      <th>{t("Status")}</th>
                      <th>{t("Output")}</th>
                      <th>{t("Time")}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="hover">
                        <td>
                          <span className="badge badge-outline badge-xs">
                            {log.action}
                          </span>
                        </td>
                        <td>
                          <DeploymentStatusBadge status={log.status} />
                        </td>
                        <td className="max-w-xs truncate text-xs">
                          {log.output || "-"}
                        </td>
                        <td className="text-xs">
                          {log.createdAt
                            ? new Date(log.createdAt).toLocaleString()
                            : "-"}
                        </td>
                        <td>
                          {log.taskId && (
                            <button
                              className="btn btn-ghost btn-xs"
                              onClick={() => handleViewLog(log)}
                              type="button"
                            >
                              {t("View")}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </ModalShell>
  );
};

export default DeploymentDetailModal;
