import React, { useState, useMemo } from "react";
import { Link, Navigate } from "react-router-dom";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

import { resetGraphQLLink } from "../../grapgql"
import { logIn, register } from "../../apis/auth";
import { useAuthReducer } from "../../atoms/auth";
import { validateEmail } from "../../utils/validators";

const EmailPasswordForm = ({ create = false }) => {
  const { t } = useTranslation();
  const { login } = useAuthReducer()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const validEmail = () => {
    return email === "" || validateEmail(email);
  };
  const validPassword = () => {
    return (email === "" && password === "") || password.length >= 8;
  };
  const validPassword2 = () => {
    return (
      !create || (password === "" && password2 === "") || password2 === password
    );
  };
  const inputStyle = (para, validPara) =>
    para.length > 0 ? (validPara() ? "input-success" : "input-error") : "";

  const submitForm = async (e) => {
    e.preventDefault();
    if (!(email.length > 0) || !(password.length > 0)) {
      // TODO: set modal or error message.
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
      console.log(error)
    }
  };

  return (
    <div className="card w-full max-w-sm flex-shrink-0 bg-base-100 shadow-2xl">
      <form className="card-body" onSubmit={submitForm}>
        <div className="form-control">
          <label className="label">
            <span className="label-text">{t("Email")}</span>
          </label>
          <input
            type="email"
            placeholder={t("Email Placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={classNames(
              "input",
              "input-bordered",
              inputStyle(email, validEmail)
            )}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">{t("Password")}</span>
          </label>
          <input
            type="password"
            placeholder={t("Password Placeholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={classNames(
              "input",
              "input-bordered",
              inputStyle(password, validPassword)
            )}
          />
        </div>
        {create ? (
          <div className="form-control">
            <label className="label">
              <span className="label-text">{t("Confirm Password")}</span>
            </label>
            <input
              type="password"
              placeholder="Confirm Password Placeholder"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className={classNames(
                "input",
                "input-bordered",
                inputStyle(password2, validPassword2)
              )}
            />
          </div>
        ) : null}
        <div className="form-control mt-6">
          <button
            className={`btn btn-primary ${!validEmail() || !validPassword() || !validPassword2()
                ? "btn-disabled"
                : ""
              }`}
            type="submit"
            onClick={submitForm}
          >
            {create ? t("Create Account") : t("Login")}
          </button>
          {!create ? (
            <label className="label">
              <Link
                to="/create-account"
                className="link link-accent link-hover"
              >
                Create Account
              </Link>
            </label>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default EmailPasswordForm;
