"use client";

import { Toaster } from "sonner";

const ToasterWrapper = () => {
  return (
    <>
      <Toaster
        toastOptions={{
          className: "rounded-lg shadow-lg",
        }}
      />
    </>
  );
};

export default ToasterWrapper;
