import { Toaster } from "sonner";
import ReduxProvider from "../redux/provider";
import ReactQueryProvider from "./react-query";

// Wrapper component to provide all providers to the app
function Providers({ children }) {
  return (
    <>
      <ReactQueryProvider>
        <Toaster
          richColors
          toastOptions={{
            className: "rounded-lg shadow-lg",
          }}
          position="top-right"
        />
        <ReduxProvider>{children}</ReduxProvider>
      </ReactQueryProvider>
    </>
  );
}

export default Providers;
