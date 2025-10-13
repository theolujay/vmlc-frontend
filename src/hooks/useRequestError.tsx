// import { useState } from "react";
// import toast from "react-hot-toast";

// export function useRequestError({ useToast = false } = {}) {
//   const [error, setError] = useState<string | null>(null);

//   const handleRequestError = async (arg: any) => {
//     let error;
//     if (typeof arg === "function") {
//       // if arg is a function invoke it
//       try {
//         await Promise.resolve(arg());
//       } catch (err) {
//         error = err;
//       }
//     } else {
//       error = arg;
//     }

//     if (error) {
//       let errMessage = error?.response?.data?.message || "An error occured!";
//       if (useToast) {
//         toast.error(errMessage);
//       } else {
//         // set error
//         setError(errMessage);
//       }
//     }
//   };

//   let resetError = () => setError(null);

//   return {
//     error,
//     resetError,
//     handleRequestError,
//     catch: handleRequestError,
//   };
// }
