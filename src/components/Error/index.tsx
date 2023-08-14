export const Error = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="mt-2 font-extrabold text-4xl">Error !!!</h1>
        <img
          src="/crashed-error.svg"
          alt="Error Icon"
          className="mx-auto w-1/2 md:w-1/4 mb-4"
        />
        <p className="text-lg text-gray-600">
          We're sorry, an error occurred while loading the data. Please check
          your internet connection and try again.
        </p>
      </div>
    </div>
  );
};
