import { get } from "../../utils/object";

import useMaybeT from "../../hooks/useMaybeT";

const FieldError = ({ errors, name }) => {
  const err = get(errors, name);
  const maybeT = useMaybeT();
  if (!err) return null;
  return <p className="mt-1 text-xs text-error">{maybeT(err.message)}</p>;
};

export default FieldError;

