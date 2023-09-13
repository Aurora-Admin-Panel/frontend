import Icon from "../Icon";

const Error = ({ error }) => {
  console.log(error);
  return (
    <div className="flex h-full w-full flex-col justify-center rounded-xl bg-base-200">
      <div className="flex h-full p-2 text-center">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold md:text-4xl">{error.message}</h1>
          <p className="overflow-auto py-6">{error.stack}</p>
        </div>
      </div>
    </div>
  );
};

export default Error;
