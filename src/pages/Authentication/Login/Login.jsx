// import React,{ useEffect, useState } from "react";
// import styles from "./Login.module.css";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { login } from "../../../redux/features/auth/authSlice";
// import { toast,  } from "react-hot-toast";

// function LoginForm() {
//   const [email, setEmail] = useState("anurag053@gmail.com");
//   const [password, setPassword] = useState("123456");
//   const [error, setError] = useState({});
//   const [catchError , setCatchError] = useState("") // backend error
//   const dispatch = useDispatch();
//   const navigate = useNavigate()


//  // Function to validate form fields
//  const validateForm = () => {
//   const newErrors = {};
//   if (!email) {
//     newErrors.emailError = "Email is required";
//   } else if (!/\S+@\S+\.\S+/.test(email)) {
//     newErrors.emailError = "Enter a valid email";
//   }

//   if (!password) {
//     newErrors.passwordError = "Password is required";
//   }

//   return newErrors;
// };

// // Apply border styles based on error states
// useEffect(() => {
//   const emailField = document.querySelector('input[name="email"]');
//   const passwordField = document.querySelector('input[name="password"]');
 
//   if (emailField) {
//     emailField.style.border = error.emailError ? '2px solid crimson' : '';
//   }
//   if (passwordField) {
//     passwordField.style.border = error.passwordError ? '2px solid crimson' : '';
//   }
// }, [error]);

// // Handle form submission
// const handleLogin = async () => {
//   const newErrors = validateForm();
//   if (Object.keys(newErrors).length > 0) {
//     setError(newErrors);
//     return;
//   }

//   try {
//     const authPromise = dispatch(login({ email, password })).unwrap();
//     toast.promise(
//       authPromise,
//       {
//         success: "Login Successfully!",
//         error: "Login failed!",
//       },
//       {
//         position: "top-right",
//         autoClose: 5000,
//         theme: "dark",
//         transition: Bounce,
//       }
//     );

//     // await authPromise;
//     authPromise.then(async ()=>{
//       localStorage.setItem('tour', JSON.stringify(true)); // to show tour first time only 
//       navigate('/admin');
      
//       // set offline image
//       const response = await fetch('https://raw.githubusercontent.com/anurag-sonkar/Ecommerce_MERN_Shopkart_admin_panel/main/public/assets/offline.png')

//       const blob = await response.blob();
//       const reader = new FileReader();

//       reader.onloadend = () => {
//         const base64Image = reader.result;
//         localStorage.setItem("offline-image", base64Image);
//       };

//       reader.readAsDataURL(blob);

      
//     })
//   } catch (error) {
//     // Handle login errors
//     setError({});
//     setCatchError( error.response.data.error)
//   }
// };


//   return (
//     <form className={styles.form}>
//       <h1 className={styles.title}>Sign in</h1>
//       <input
//         type="email"
//         className={styles.input}
//         placeholder="Email"
//         value={email}
//         name="email"
//         onChange={(e) =>setEmail(e.target.value)}
//       />
//       {error.emailError && <div className={styles.errorMessage}>{error.emailError}</div>} 
//       <input
//         type="password"
//         className={styles.input}
//         placeholder="Password"
//         value={password}
//         name="password"
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       {error.passwordError && <div className={styles.errorMessage}>{error.passwordError}</div>}
//       {catchError && <div className={styles.errorMessage}>{catchError}</div>}  
//       <Link to="/forgot-password" className={styles.anchor}>
//         Forgot your password?
//       </Link>
//       <button type="button" className={styles.button} onClick={handleLogin}>
//         Sign In
//       </button>
//       <div className="my-4 lg:hidden block">
//         <Link to="/signup">
//           Don't have an account?
//           <span className="text-blue-800 font-semibold px-1">Signup</span>
//         </Link>
//       </div>
//     </form>
//   );
// }

// export default LoginForm;

import React, { useEffect, useState } from "react";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import axios from "axios"; // Import axios for API calls
import { base_url } from "../../../../utils/base_url";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const [catchError, setCatchError] = useState(""); // backend error
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Function to validate form fields
  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.emailError = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.emailError = "Enter a valid email";
    }

    if (!password) {
      newErrors.passwordError = "Password is required";
    }

    return newErrors;
  };

  // Apply border styles based on error states
  useEffect(() => {
    const emailField = document.querySelector('input[name="email"]');
    const passwordField = document.querySelector('input[name="password"]');

    if (emailField) {
      emailField.style.border = error.emailError ? '2px solid crimson' : '';
    }
    if (passwordField) {
      passwordField.style.border = error.passwordError ? '2px solid crimson' : '';
    }
  }, [error]);

  // Handle form submission
  const handleLogin = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    try {
      // Clear any previous errors
      setError({});
      setCatchError("");

      // Show loading toast
      const toastId = toast.loading("Logging in...");

      // Call the backend API
      const response = await axios.post(`${base_url}/api/admin/auth`, {
        email,
        password
      });

      // Handle successful login
      toast.success("Login successful!", { id: toastId });

      // Store the token and admin info in localStorage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.admin));
      localStorage.setItem('tour', JSON.stringify(true)); // to show tour first time only

      // Dispatch login action (you'll need to define this in your Redux slice)
      dispatch({
        type: 'auth/loginSuccess',
        payload: {
          user: response.data.admin,
          token: response.data.token
        }
      });

      // Navigate to admin dashboard
      navigate('/dashboard');

      // Set offline image (as in your original code)
      try {
        const imageResponse = await fetch('https://raw.githubusercontent.com/anurag-sonkar/Ecommerce_MERN_Shopkart_admin_panel/main/public/assets/offline.png');
        const blob = await imageResponse.blob();
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64Image = reader.result;
          localStorage.setItem("offline-image", base64Image);
        };

        reader.readAsDataURL(blob);
      } catch (imageError) {
        console.error("Failed to load offline image:", imageError);
      }

    } catch (error) {
      // Handle login errors
      toast.error("Login failed!");
      setError({});
      setCatchError(error.response?.data?.message || "Authentication failed. Please check your credentials.");
    }
  };

  return (
    <form className={styles.form}>
      <h1 className={styles.title}>Sign in</h1>
      <input
        type="email"
        className={styles.input}
        placeholder="Email"
        value={email}
        name="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      {error.emailError && <div className={styles.errorMessage}>{error.emailError}</div>}
      <input
        type="password"
        className={styles.input}
        placeholder="Password"
        value={password}
        name="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      {error.passwordError && <div className={styles.errorMessage}>{error.passwordError}</div>}
      {catchError && <div className={styles.errorMessage}>{catchError}</div>}
      <Link to="/forgot-password" className={styles.anchor}>
        Forgot your password?
      </Link>
      <button type="button" className={styles.button} onClick={handleLogin}>
        Sign In
      </button>
      <div className="my-4 lg:hidden block">
        <Link to="/signup">
          Don't have an account?
          <span className="text-blue-800 font-semibold px-1">Signup</span>
        </Link>
      </div>
    </form>
  );
}

export default LoginForm;