const ErrorMessage = ({
    message = "Something went wrong. Please try again.",
    onRetry,
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">

            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-2xl font-bold">
                !
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-800">
                Something went wrong
            </h3>

            <p className="mt-2 max-w-md text-sm text-slate-500">
                {message}
            </p>

            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-5 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                >
                    Try Again
                </button>
            )}

        </div>
    );
};

export default ErrorMessage;