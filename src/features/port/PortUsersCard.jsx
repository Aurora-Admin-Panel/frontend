import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Plus, X, Minus } from "phosphor-react";
import classNames from "classnames";
import gql from "graphql-tag";
import { useGetUsersByEmailQuery } from "./PortUsersCard.generated";
import DataLoading from "../DataLoading";

const _ = gql`
  query GetUsersByEmail($email: String!, $limit: Int) {
    paginatedUsers(email: $email, limit: $limit) {
      items {
        id
        email
      }
    }
  }
`;

const UserSearchSelect = ({ open, onSelect }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const inputRef = useRef();
  const { data: usersData, isLoading: usersLoading } = useGetUsersByEmailQuery({
    email,
    limit: 5,
  });
  useEffect(() => {
    if (open) {
      inputRef.current.focus();
      setEmail("");
    }
  }, [open]);

  return (
    <>
      <input
        type="text"
        className="input input-ghost input-sm mt-2 w-full"
        placeholder={t("Please enter an email address")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        ref={inputRef}
      />
      {usersLoading ? (
        <DataLoading />
      ) : (
        <div className="h-30 mt-2 flex flex-col overflow-y-auto">
          {usersData?.paginatedUsers.items.map((user) => (
            <div
              className="flex w-full flex-row items-center justify-start"
              key={user.id}
            >
              <span className="text-sm">{user.email}</span>
              <div className="flex flex-grow flex-row items-center justify-end">
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={() => onSelect(user)}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

const PortUsersCard = ({ port, setSelected }) => {
  const { t } = useTranslation();
  const [add, setAdd] = useState(port.allowedUsers.length === 0);
  // const { data: usersData, isLoading: usersLoading } = useGetUsersByEmailQuery();

  return (
    <div className="relative flex w-full flex-col items-center justify-center space-y-2 py-4 px-4">
      <div className="absolute top-2 right-2" onClick={() => setSelected(null)}>
        <div className="btn btn-outline btn-ghost btn-circle btn-xs">
          <X size={20} />
        </div>
      </div>
      <div className="flex w-full flex-row items-center justify-start space-x-2">
        <span className="card-title">
          {port.externalNum ? port.externalNum : port.num} {t("Users List")}
        </span>
        <div
          className="btn btn-success btn-circle btn-xs"
          onClick={() => setAdd((prev) => !prev)}
        >
          <Plus size={16} className="text-success-content" />
        </div>
      </div>
      <div
        className={classNames(
          "collapse flex w-full flex-col items-center justify-center",
          { "collapse-open": add }
        )}
      >
        <div className="collapse-content flex w-full flex-col">
          <UserSearchSelect open={add} />
        </div>
      </div>
      <div className="max-h-32 flex flex-row items-center justify-center overflow-y-auto w-full">
        {port.users &&
          port.users.map((user) => (
            <div
              className="flex w-full flex-row items-center justify-start"
              key={user.id}
            >
              <span className="text-sm">{user.email}</span>
              <div className="flex flex-grow flex-row items-center justify-end">
                <button
                  className="btn btn-ghost btn-xs btn-error btn-circle"
                  onClick={() => console.log("remove")}
                >
                  <Minus size={16} />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PortUsersCard;
