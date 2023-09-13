const MainContent = ({ children }) => {
  return (
    <>
      <input id="drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col flex-auto items-center h-full lg:container lg:mx-auto">
        <div className="flex flex-col items-center w-full h-full px-2">
          {children}
        </div>
      </div>
    </>
  );
};

export default MainContent;
