import React from "react";
import ReduxProvider from "../redux/provider";

// Wrapper component to provide all providers to the app
function Providers({ children }) {
  return (
    <>
      <ReduxProvider>{children}</ReduxProvider>
    </>
  );
}

export default Providers;
