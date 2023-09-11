import React, { useState, useMemo } from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames";
// import { Input, Label, Button } from '@windmill/react-ui'

import { login, signUp } from "../../store/reducers/auth";
import { validateEmail } from "../../utils/validators";

const EmailPasswordForm = ({ create = false }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const validEmail = () => {
    return email === "" || validateEmail(email);
  };
  const validPassword = () => {
    return password === "" || password.length >= 8;
  };
  const validPassword2 = () => {
    return (
      !create || (password === "" && password2 === "") || password2 === password
    );
  };
  const inputStyle = (para, validPara) =>
    para.length > 0 ? (validPara() ? "input-success" : "input-error") : "";

  const submitForm = (e) => {
    e.preventDefault();
    if (!(email.length > 0) || !(password.length > 0)) {
      // TODO: set modal or error message.
      throw new Error("Email or password was not provided");
    }
    if (create) dispatch(signUp({ email, password }));
    else dispatch(login({ email, password }));
  };

  // console.log(validEmail)
  return (
    <div className="card w-full max-w-sm flex-shrink-0 bg-base-100 shadow-2xl">
      <div className="card-body">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder="email"
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
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="password"
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
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="password"
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
            className={`btn btn-primary ${
              !validEmail() || !validPassword() || !validPassword2()
                ? "btn-disabled"
                : ""
            }`}
            onClick={submitForm}
          >
            Login
          </button>
          {!create ? (
            <label className="label">
              <Link
                to="/create-account"
                className="link link-hover label-text-alt link-secondary text-info"
              >
                Create Account
              </Link>
            </label>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default EmailPasswordForm;
