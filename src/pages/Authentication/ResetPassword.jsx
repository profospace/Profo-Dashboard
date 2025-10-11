// import React, { useEffect, useState } from "react";
// import { Input } from "@material-tailwind/react";
// import { Link, useParams } from "react-router-dom";
// import HelmetTitle from "../../components/HelmetTitle";
// import { useDispatch } from "react-redux";
// import { resetPassword } from "../../features/auth/authSlice";
// import { toast, Bounce } from "react-toastify";


// function ResetPassword() {
//   const {token} = useParams()
//   const dispatch = useDispatch()
//   const [password , setPassword] = useState("")
//   const [cPassword , setCpassword] = useState("")
//   const [error , setError] = useState('')
//   const [catchError, setCatchError] = useState(""); // backend error

//   const handleInputField = (e)=>{
//     setError("")
//     setCatchError("")
//     if(e.target.name === 'password'){
//       setPassword(e.target.value)
//     }

//     if(e.target.name === 'confirmPassword'){
//       setCpassword(e.target.value)
//     }
//   }
 
//   const validateForm = () => {
//     const newErrors = {};
  
//     if (!password) {
//       newErrors.passwordError = "Password is required";
//     }
    
//     if (!cPassword) {
//       newErrors.confirmPasswordError = "Confirm your password";
//     }
    
//     if (password && cPassword && password !== cPassword) {
//       newErrors.passwordMatchError = "Password and confirm password do not match";
//     }
  
//     return newErrors;
//   };
  

//   useEffect(() => {
//     const passwordField = document.querySelector('input[name="password"]');
//     const confirmPasswordField = document.querySelector('input[name="confirmPassword"]');
  
//     // Apply red border if password field has an error
//     if (passwordField) {
//       passwordField.style.border = error.passwordError || error.passwordMatchError
//         ? "1px solid crimson"
//         : "";
//     }
  
//     // Apply red border if confirm password field has an error
//     if (confirmPasswordField) {
//       confirmPasswordField.style.border = error.confirmPasswordError || error.passwordMatchError
//         ? "1px solid crimson"
//         : "";
//     }
//   }, [error]);
  


//   const handleResetPassword = async(e)=>{
//     e.preventDefault();
//     const newErrors = validateForm();
//     if (Object.keys(newErrors).length > 0) {
//       setError(newErrors);
//       return;
//     }

//     try {
//       const resetPromise = dispatch(resetPassword({token , password})).unwrap()
//       await toast.promise(
//         resetPromise,
//         {
//           pending: "Sending response...",
//           success: "Your password reset successfully",
//           error: "Failed to re-reset password!",
//         },
//         {
//           position: "top-right",
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "dark",
//           transition: Bounce,
//         }
//       );
//     } catch (error) {
//       console.log(error);
//       // setCatchError(error.response.data.message || "An unexpected error occurred");
      
//     }
    

//   }

//   return (
//     <main className="grid place-items-center  px-6 py-16  sm:py-16 lg:px-8 min-h-screen">
//     <HelmetTitle title="Reset Password" />
        
//       <div className="text-center bg-white  px-20 py-12 rounded-lg shadow-2xl">
//         <div className="flex flex-col gap-1">
//         <h1 className="capitalize text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
//           reset your password <span className="text-4xl font-extrabold">?</span>
//         </h1>
//         </div>
//         {/* foam */}
        
//         <div className="flex-col grid place-items-center w-full mt-3">
//           <Input size="md" label="Enter Your New Password" value={password} name="password" onChange={(e)=>handleInputField(e)} />
//         </div>
//         {error.passwordError && <p className="text-left text-sm text-red-800 px-3">{error.passwordError}</p>}
//         <div className="flex-col grid place-items-center w-full mt-3">
//           <Input size="md" label="Confirm New Password" name="confirmPassword" value={cPassword} onChange={(e)=>handleInputField(e)}/>
//         </div>
//         {/* error */}
//         {error.confirmPasswordError && <p className="text-left text-sm text-red-800 px-3">{error.confirmPasswordError}</p>}
//         {error.passwordMatchError && <p className="text-left text-sm text-red-800 px-3">{error.passwordMatchError}</p>}
//         {catchError && <p className="text-left text-sm text-red-800 px-3">{catchError}</p>}

//         <div className="mt-10 flex items-center justify-center gap-x-6">
//           <button
//             onClick={(e)=>handleResetPassword(e)}
//             className="rounded-full bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//           >
//             Submit
//           </button>
//           <Link to="/contact" className="text-sm font-semibold text-gray-900">
//             Contact support <span aria-hidden="true">&rarr;</span>
//           </Link>
//         </div>
//       </div>
//     </main>
//   );
// }

// export default ResetPassword;


import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { base_url } from "../../../utils/base_url";
import styles from "./Login/Login.module.css"; // Reuse login styles

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});

  const navigate = useNavigate();
  const { token } = useParams(); // Get token from URL

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!password) {
      newErrors.passwordError = "Password is required";
    } else if (password.length < 6) {
      newErrors.passwordError = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPasswordError = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPasswordError = "Passwords don't match";
    }

    return newErrors;
  };

  // Apply border styles based on errors
  useEffect(() => {
    const passwordField = document.querySelector('input[name="password"]');
    const confirmPasswordField = document.querySelector('input[name="confirmPassword"]');

    if (passwordField) {
      passwordField.style.border = error.passwordError ? "2px solid crimson" : "";
    }
    if (confirmPasswordField) {
      confirmPasswordField.style.border = error.confirmPasswordError ? "2px solid crimson" : "";
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Resetting password...");

    try {
      const response = await axios.post(
        `${base_url}/api/admin/reset-password/${token}`,
        { password }
      );

      toast.success(response.data.message, { id: toastId });

      // Clear form
      setPassword("");
      setConfirmPassword("");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to reset password",
        { id: toastId }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <h1 className={styles.title}>Reset Password</h1>
            <p className={styles.paragraph} style={{ fontSize: "14px", marginBottom: "20px" }}>
              Enter your new password below.
            </p>

            <input
              type="password"
              className={styles.input}
              placeholder="New Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            {error.passwordError && (
              <div className={styles.errorMessage}>{error.passwordError}</div>
            )}

            <input
              type="password"
              className={styles.input}
              placeholder="Confirm Password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
            {error.confirmPasswordError && (
              <div className={styles.errorMessage}>{error.confirmPasswordError}</div>
            )}

            <button
              type="submit"
              className={styles.button}
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>

            <div className="my-4">
              <Link to="/login">
                <span className="text-blue-800 font-semibold">
                  Back to Login
                </span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;