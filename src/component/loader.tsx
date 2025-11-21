import { LoadingSpinnerProps } from "@/types/globaltypes";

export function LoadingSpinner({ message }: LoadingSpinnerProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-lg font-medium text-gray-700">{message}</p>
        </div>
    );
}