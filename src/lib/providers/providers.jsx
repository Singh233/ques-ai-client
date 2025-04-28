import { Toaster } from "sonner";
import ReduxProvider from "../redux/provider";
import ReactQueryProvider from "./react-query";
import AuthProvider from "~/lib/providers/AuthProvider";
import NextTopLoader from "nextjs-toploader";

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
          closeButton
        />
        <NextTopLoader color="#7E22CE" showSpinner={false} height={4} />

        <ReduxProvider>
          <AuthProvider>{children}</AuthProvider>
        </ReduxProvider>
      </ReactQueryProvider>
    </>
  );
}

export default Providers;
