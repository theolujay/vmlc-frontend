import React from "react";
import Spinner from "@/components/ui/spinner/spinner";

export const LoadingView = ({ message = "Loading data..." }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center p-20 w-full">
    <Spinner size={40} color="#3E4095" />
    <p className="mt-4 text-sm text-[#667185] font-medium animate-pulse">{message}</p>
  </div>
);

interface ErrorViewProps {
  title?: string;
  description?: string;
  onRetry: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
  title = "Failed to load data",
  description = "There was an error retrieving the data. Please try again.",
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center p-20 w-full text-center">
    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
      <span className="text-red-500 text-2xl font-bold">!</span>
    </div>
    <h2 className="text-lg font-bold text-[#101828]">{title}</h2>
    <p className="text-sm text-[#667185] mt-1 max-w-xs mx-auto">{description}</p>
    <button
      onClick={onRetry}
      className="mt-6 px-6 py-2 bg-[#3E4095] text-white rounded-full font-bold text-sm hover:bg-[#2d2f6e] transition-colors"
    >
      Retry
    </button>
  </div>
);
