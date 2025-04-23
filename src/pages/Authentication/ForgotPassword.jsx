import React, { useEffect, useState } from "react";
import { Input } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import HelmetTitle from "../../components/HelmetTitle";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../features/auth/authSlice";
import { toast, Bounce } from "react-toastify";

function ForgotPassword() {

  const [email , setEmail] = useState("")
  const [error , setError] = useState('')
  const [catchError, setCatchError] = useState(""); // backend error
  const {user} = useSelector(state => state.auth)

  const dispatch = useDispatch()

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.emailError = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.emailError = "Enter a valid email";
    }
  
    return newErrors;
  };

  useEffect(() => {
    const emailField = document.querySelector('input[name="email"]');
  
    if (emailField) {
      emailField.style.border = error.emailError ? '2px solid crimson' : '';
    }
    
  }, [error]);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }
  
    try {
      const resetPasswordPromise = dispatch(forgotPassword({ email })).unwrap();
      await toast.promise(
        resetPasswordPromise,
        {
          pending: "Sending reset password link...",
          success: "Reset password link sent successfully!",
          error: "Failed to send reset password link!",
        },
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        }
      );

      resetPasswordPromise.then(() => {
        setTimeout(() => {
          window.open(
            `https://mail.google.com/mail/u/0/?authuser=${encodeURIComponent(email)}`,
            '_blank'
          );
        }, 1500);
      });
      
    } catch (error) {
      console.log(error);
      setCatchError(error.response.data.message || "An unexpected error occurred");
    }
  };
  

  console.log(catchError)

  return (
    <main className="grid place-items-center px-6 py-16 sm:py-32 lg:px-8 ">
    <HelmetTitle title="Reset Password" />
        
      <div className="text-center bg-white px-20 py-12 rounded-lg shadow-2xl">
        <div className="flex flex-col gap-10">
        <h1 className="capitalize text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          forgot your password <span className="text-4xl font-extrabold">?</span>
        </h1>
        <p className="capitalize text-base text-gray-600">
          we will send you an email to reset your password
        </p>
        </div>
        {/* foam */}
        <div className="flex-col grid place-items-center w-full mt-3">
          <Input size="md" label="Enter Your Email" name="email" value={user ? user.email : email} onChange={(e)=>{
            setEmail(e.target.value)
            setError('')
          }}/>
        </div>
        {/* error */}
        {error.emailError && <p className="text-left text-sm text-red-800 px-3">{error.emailError}</p>}
        {catchError && <p className="text-left text-sm text-red-800 px-3">{catchError}</p>}
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button
            onClick={(e)=>handleForgotPassword(e)}
            className="rounded-full bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>
          <Link to="/contact" className="text-sm font-semibold text-gray-900">
            Contact support <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default ForgotPassword;
