import React, { useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { useNotificationsReducer } from "../../atoms/notification";

import { resetGraphQLLink } from "../../graphql"
import { logIn, register } from "../../apis/auth";
import { useAuthReducer } from "../../atoms/auth";
import { validateEmail } from "../../utils/validators";

const EmailPasswordForm = ({ create = false }) => {
  const { t } = useTranslation();
  const { login } = useAuthReducer()
  const { addNotification } = useNotificationsReducer()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const validEmail = () => email === "" || validateEmail(email);
  const validPassword = () => (email === "" && password === "") || password.length >= 8;
  const validPassword2 = () =>
    !create || (password === "" && password2 === "") || password2 === password;
  const inputStyle = (para, validPara) =>
    para.length > 0 ? (validPara() ? "input-success" : "input-error") : "";

  const submitForm = async (e) => {
    e.preventDefault();
    if (!(email.length > 0) || !(password.length > 0)) {
      throw new Error("Email or password was not provided");
    }
    try {
      let response;
      if (create) {
        response = await register({ username: email, password: password });
      } else {
        response = await logIn({ username: email, password: password });
      }
      login(response.data)
      resetGraphQLLink()
    } catch (error) {
      addNotification({
        title: t("Error"),
        body: error.message,
        type: "error",
      })
    }
  };

  return (
    <form className="w-full max-w-sm space-y-5" onSubmit={submitForm}>
      <h2 className="text-2xl font-bold tracking-tight">
        {create ? t("Create Account") : t("Login")}
      </h2>

      <div>
        <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider opacity-40">
          {t("Email")}
        </label>
        <input
          type="email"
          placeholder={t("Email Placeholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={classNames(
            "input input-bordered w-full",
            inputStyle(email, validEmail)
          )}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider opacity-40">
          {t("Password")}
        </label>
        <input
          type="password"
          placeholder={t("Password Placeholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={classNames(
            "input input-bordered w-full",
            inputStyle(password, validPassword)
          )}
        />
      </div>

      {create && (
        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider opacity-40">
            {t("Confirm Password")}
          </label>
          <input
            type="password"
            placeholder={t("Confirm Password Placeholder")}
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            className={classNames(
              "input input-bordered w-full",
              inputStyle(password2, validPassword2)
            )}
          />
        </div>
      )}

      <div className="pt-2">
        <button
          className={classNames("btn btn-primary w-full", {
            "btn-disabled": !validEmail() || !validPassword() || !validPassword2(),
          })}
          type="submit"
        >
          {create ? t("Create Account") : t("Login")}
        </button>
      </div>

      <p className="text-center text-xs opacity-40">
        {create ? (
          <Link to="/login" className="link link-hover hover:opacity-70">
            {t("Login")}
          </Link>
        ) : (
          <Link to="/create-account" className="link link-hover hover:opacity-70">
            {t("Create Account")}
          </Link>
        )}
      </p>
    </form>
  );
};

export default EmailPasswordForm;
