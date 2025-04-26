import ReduxProvider from "../redux/provider";
import ReactQueryProvider from "./react-query";

// Wrapper component to provide all providers to the app
function Providers({ children }) {
  return (
    <>
      <ReactQueryProvider>
        <ReduxProvider>{children}</ReduxProvider>
      </ReactQueryProvider>
    </>
  );
}

export default Providers;
