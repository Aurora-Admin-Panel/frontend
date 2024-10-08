import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { gql, useQuery, useMutation, useApolloClient } from "@apollo/client";
import classNames from "classnames";
import { useDispatch, } from "react-redux";
import Icon from "../Icon";
import { GET_SERVER_QUERY, ADD_SERVER_MUTATION, UPDATE_SERVER_MUTATION, DELETE_SERVER_MUTATION } from "../../quries/server";
import { GET_SECRETS_QUERY, UPLOAD_FILE_MUTATION } from "../../quries/file";
import { TwoDotIcon } from "../../icons";
import { useModalReducer } from "../../atoms/modal";
import { FileTypeEnum } from "../../store/apis/types.generated";
import DataLoading from "../DataLoading";
import { showNotification } from "../../store/reducers/notification";


const ServerInfoModal = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const {
    modal: {
      modalProps: { serverId },
      onCancel,
      onConfirm,
    },
    showModal,
    showConfirmationModal,
    hideModal
  } = useModalReducer();
  const {
    data: secretsData,
    loading: secretsLoading,
    error: secretsError,
  } = useQuery(GET_SECRETS_QUERY);
  const {
    data: serverData,
    loading: serverLoading,
    error: serverError,
  } = serverId
      ? useQuery(GET_SERVER_QUERY, {
        variables: { id: serverId },
        fetchPolicy: 'network-only',
      })
      : { data: null, isLoading: false, error: null };
  const [uploadFile, { loading: uploadFileLoading, error: uploadFileError }] =
    useMutation(UPLOAD_FILE_MUTATION);
  const [
    updateServer,
    { loading: updateServerLoading, error: updateServerError },
  ] = useMutation(UPDATE_SERVER_MUTATION, {
    onCompleted: () => {
      dispatch(
        showNotification({
          type: "success",
          body: "Server saved successfully",
        })
      );
      if (onConfirm) onConfirm();
      hideModal();
    },
  });
  const [addServer, { loading: addServerLoading, error: addServerError }] =
    useMutation(ADD_SERVER_MUTATION, {
      onCompleted: () => {
        dispatch(
          showNotification({
            type: "success",
            body: "Server added successfully",
          })
        );
        if (onConfirm) onConfirm();
        hideModal();
      },
    });

  const [deleteServer, { loading: deleteServerLoading, error: deleteServerError }] =
    useMutation(DELETE_SERVER_MUTATION, {
      onCompleted: () => {
        dispatch(
          showNotification({
            type: "success",
            body: "Server deleted successfully",
          })
        );
        if (onConfirm) onConfirm();
        hideModal();
      },
    });

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [user, setUser] = useState("");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [sshPassword, setSSHPassword] = useState("");
  const [sshPasswordSet, setSSHPasswordSet] = useState(false);
  const [sshPasswordNotNeeded, setSSHPasswordNotNeeded] = useState(true);
  const [sudoPassword, setSudoPassword] = useState("");
  const [sudoPasswordSet, setSudoPasswordSet] = useState(false);
  const [sudoPasswordNotNeeded, setSudoPasswordNotNeeded] = useState(true);
  const [keyFile, setKeyFile] = useState(null);
  const [keyFileId, setKeyFileId] = useState("");

  const handleDelete = () => {
    showConfirmationModal({
      modalProps: {
        title: t("Delete Server"),
        message: t("Are you sure you want to delete this server?"),
      },
      onConfirm: async () => {
        if (serverId) {
          await deleteServer({ variables: { id: serverId } });
        }
      },
    })
  }
  const handleCancel = () => {
    if (onCancel) onCancel();
    hideModal();
  };
  const handleSubmit = async () => {
    let actualKeyFileId = keyFileId;
    if (keyFile && !!!keyFileId) {
      const fileData = {
        file: keyFile,
        name: keyFile.name,
        type: FileTypeEnum.Secret,
        notes: `${name} ${t("SSH Key")}`,
      };
      const result = await uploadFile(fileData);
      actualKeyFileId = result.data.uploadFile.id;
    }
    const data = {
      name,
      address,
    };
    if (serverId) {
      data.id = serverId;
    }
    if (user) {
      data.user = user;
    }
    if (host) {
      data.host = host;
    } else {
      data.host = address;
    }
    if (port) {
      data.port = Number(port);
    }
    if (sshPassword) {
      data.sshPassword = sshPassword;
    }
    if (sudoPassword) {
      data.sudoPassword = sudoPassword;
    }
    if (actualKeyFileId) {
      data.keyFileId = Number(actualKeyFileId);
    }
    const _ = serverId
      ? await updateServer({ variables: { ...data } })
      : await addServer({ variables: { ...data } });
  };

  useEffect(() => {
    if (serverData?.server) {
      const server = serverData.server;
      setName(server.name);
      setAddress(server.address);
      setUser(server.user);
      setHost(server.host);
      setPort(server.port);
      if (server.sshPasswordSet) {
        setSSHPasswordSet(true);
        setSSHPasswordNotNeeded(false);
      }
      if (server.sudoPasswordSet) {
        setSudoPasswordSet(true);
        setSudoPasswordNotNeeded(false);
      }
      if (server.keyFileId) {
        setKeyFileId(server.keyFileId);
      }
    }
  }, [serverData]);

  return (
    <>
      {serverLoading || secretsLoading ? (
        <DataLoading />
      ) : (
        <div className="modal-box relative">
          <label
            className="btn btn-circle btn-outline btn-sm absolute right-2 top-2"
            onClick={() => hideModal()}
          >
            ✕
          </label>
          <h3 className="-mt-3 text-lg font-bold">{serverId ? t("Edit Server") : t("Add Server")}</h3>

          <div className="mt-4 flex w-full flex-col space-y-0 px-2">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">{t("Name")}</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("Server Name Placeholder")}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">{t("Address")}</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="www.example.com"
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">{t("SSH Connection Info")}</span>
              </label>
              <div className="flex flex-row items-center">
                <input
                  type="text"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder={t("Username")}
                  className="input input-bordered w-1/4 text-xs"
                />
                <Icon icon="At" className="mx-1" />
                <input
                  type="text"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder={t("Host") + " " + t("Default as address")}
                  className="input input-bordered w-1/2 text-xs"
                />
                <TwoDotIcon />
                <input
                  type="number"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  placeholder={t("Port")}
                  className="input input-bordered w-1/4 text-xs"
                />
              </div>
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">{t("SSH Password")}</span>
                <span className="label-text-alt flex items-center">
                  <input
                    type="checkbox"
                    checked={sshPasswordNotNeeded}
                    onChange={() =>
                      setSSHPasswordNotNeeded(!sshPasswordNotNeeded)
                    }
                    className="checkbox-primary checkbox checkbox-xs"
                  />
                  <span className="label-text pl-1">
                    {t("SSH password not needed")}
                  </span>
                </span>
              </label>
              <input
                type="password"
                value={sshPassword}
                onChange={(e) => setSSHPassword(e.target.value)}
                placeholder={
                  sshPasswordSet
                    ? t("SSH Password Set Placeholder")
                    : t("SSH Password Placeholder")
                }
                className={classNames("input input-bordered w-full", {
                  "input-disabled": sshPasswordNotNeeded,
                })}
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">{t("SUDO Password")}</span>
                <span className="label-text-alt flex items-center">
                  <input
                    type="checkbox"
                    checked={sudoPasswordNotNeeded}
                    onChange={() =>
                      setSudoPasswordNotNeeded(!sudoPasswordNotNeeded)
                    }
                    className="checkbox-primary checkbox checkbox-xs"
                  />
                  <span className="label-text pl-1">
                    {t("SUDO password not needed")}
                  </span>
                </span>
              </label>
              <input
                type="password"
                value={sudoPassword}
                onChange={(e) => setSudoPassword(e.target.value)}
                placeholder={
                  sudoPasswordSet
                    ? t("SUDO Password Set Placeholder")
                    : t("SUDO Password Placeholder")
                }
                className={classNames("input input-bordered w-full", {
                  "input-disabled": sudoPasswordNotNeeded,
                })}
              />
            </div>
            <div className="flex flex-col items-center justify-center space-x-2 sm:flex-row">
              <div className="form-control w-full sm:w-1/2">
                <label className="label">
                  <span className="label-text">{t("Upload SSH Key")}</span>
                </label>
                <input
                  type="file"
                  onChange={(e) => setKeyFile(e.target.files[0])}
                  className="file-input file-input-bordered file-input-md w-full max-w-xs"
                />
              </div>
              <div className="form-control w-full sm:w-1/2">
                <label className="label">
                  <span className="label-text">{t("Select SSH Key")}</span>
                </label>
                <select
                  className="select select-bordered select-md"
                  value={keyFileId}
                  onChange={(e) => setKeyFileId(e.target.value)}
                >
                  <option value={""}>{t("No SSH Key")}</option>
                  {secretsData?.files.map((file) => (
                    <option key={file.id} value={file.id}>
                      {file.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="mt-4 flex w-full flex-row justify-end space-x-2 px-2">
            {serverId && (
              <label
                className="btn  btn-ghost text-error"
                onClick={handleDelete}
              >
                {t("Delete")}
              </label>
            )}
            <label
              className="btn btn-primary btn-outline"
              onClick={handleCancel}
            >
              {t("Cancel")}
            </label>
            <button
              className={classNames("btn btn-primary", {
                loading:
                  uploadFileLoading || updateServerLoading || addServerLoading || deleteServerLoading,
              })}
              onClick={handleSubmit}
            >
              {serverId ? t("Edit") : t("Add")}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ServerInfoModal;
