import React from "react";
import { Loader } from "lucide-react";

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col gap-2 items-center justify-center py-12">
      <Loader className="size-8 animate-spin text-primary" />
      <p className="text-sm text-base-content/70">{message}</p>
    </div>
  );
};

export default LoadingSpinner;