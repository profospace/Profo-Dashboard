// import React, { useEffect, useState } from "react";
// import styles from "./Signup.module.css";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { register } from "../../../redux/features/auth/authSlice";
// import { toast,  } from "react-hot-toast";
// // import Loader from "../components/Loader";

// /* check screen size for animation after account create*/
// const useScreenSize = () => {
//   const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsLargeScreen(window.innerWidth >= 1024);
//     };

//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   return isLargeScreen;
// };

// function SignupForm({ setSignIn }) {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState("");
//   const isLargeScreen = useScreenSize(); // custom hook
//   const [error, setError] = useState({});
//   const [catchError, setCatchError] = useState(""); // backend error

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user, registerState, isLoading, isError, isSuccess, message } =
//     useSelector((state) => state.auth);
//     // console.log(registerState)

//   // Function to validate form fields
//   const validateForm = () => {
//     const newErrors = {};
//     if (!name) {
//       newErrors.nameError = "name is required";
//     } if (!email) {
//       newErrors.emailError = "email is required";
//     }  if (!/\S+@\S+\.\S+/.test(email)) {
//       newErrors.emailError = "enter a valid email";
//     }  if (!password) {
//       newErrors.passwordError = "Password is required";
//     } else if (!confirmPassword) {
//       newErrors.confirmPasswordError = "Confirm your password";
//     }
//     return newErrors;
//   };

//   // Apply border styles based on error states
//   useEffect(() => {
//     const nameField = document.querySelector('input[name="name"]');
//     const emailField = document.querySelector('input[name="email"]');
//     const passwordField = document.querySelector('input[name="password"]');
//     const confirmPasswordField = document.querySelector(
//       'input[name="confirmPassword"]'
//     );

//     if (nameField) {
//       nameField.style.border = error.nameError ? "2px solid crimson" : "";
//     }
//     if (emailField) {
//       emailField.style.border = error.emailError ? "2px solid crimson" : "";
//     }
//     if (passwordField) {
//       passwordField.style.border = error.passwordError
//         ? "2px solid crimson"
//         : "";
//     }
//     if (confirmPasswordField) {
//       confirmPasswordField.style.border = error.confirmPasswordError
//         ? "2px solid crimson"
//         : "";
//     }
//   }, [error]);


//   // hanldle image - limit size as backend limit 1 mb 
//   // const handleImageChange = (event) => {
//   //   const file = event.target.files[0];
//   //   const reader = new FileReader();
//   //   reader.onloadend = () => {
//   //     setImagePreview(reader.result);
//   //     setImage(file);
//   //   };
//   //   if (file) {
//   //     reader.readAsDataURL(file);
//   //   }
//   // };
//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       // Check file size (1 MB = 1024 * 1024 bytes)
//       if (file.size > 1024 * 1024) {
//         setCatchError("Max file size allowed is 1 MB");
//         return;
//       }else{
//         setCatchError(null)
//       }
  
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//         setImage(file);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSignup = (e) => {
//     e.preventDefault();
//     const newErrors = validateForm();
//     if (Object.keys(newErrors).length > 0) {
//       setError(newErrors);
//       return;
//     }
  
//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("email", email);
//     formData.append("password", password);
//     formData.append("cpassword", confirmPassword);
//     formData.append("admin", true);
  
//     if (image) {
//       formData.append("photo", image);
//     }

//     // if(catchError) return
  
//     const registerPromise = dispatch(register(formData)).unwrap();
  
//     toast.promise(
//       registerPromise,
//       {
//         pending: "Creating Account...",
//         success: "Registered Successfully!",
//         error: "Registration failed!",
//       },
//       {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "dark",
//         transition: Bounce,
//       }
//     );
  
//     registerPromise
//       .then(() => {
//         if (isLargeScreen) {
//           setSignIn(true);
//         } else {
//           navigate("/login");
//         }
//         toast.success(
//           `${(registerState?.name) || "You can"} login now`,
//           {
//             position: "top-right",
//             autoClose: 5000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//             theme: "dark",
//             transition: Bounce,
//           }
//         );
//       })
//       .catch((error) => {
//         // console.error("Caught error:", error); 
//         setCatchError(error.response.data.error || "An unexpected error occurred");
//       });
//   };
  
//   return (
//     <form className={styles.form}>
//       {image == null ? (
//         <h1 className={styles.title}>Sign up</h1>
//       ) : (
//         <div className={styles.profile}>
//           <img src={imagePreview} />
//         </div>
//       )}

//       <input
//         type="text"
//         className={styles.input}
//         placeholder="Name"
//         value={name}
//         name="name"
//         onChange={(e) => setName(e.target.value)}
//       />
//       {error.nameError && (
//         <div className={styles.errorMessage}>{error.nameError}</div>
//       )}
//       <input
//         type="email"
//         className={styles.input}
//         placeholder="Email"
//         value={email}
//         name="email"
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       {error.emailError && (
//         <div className={styles.errorMessage}>{error.emailError}</div>
//       )}
//       <input
//         type="password"
//         className={styles.input}
//         placeholder="Password"
//         value={password}
//         name="password"
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       {error.passwordError && (
//         <div className={styles.errorMessage}>{error.passwordError}</div>
//       )}
//       <input
//         type="password"
//         className={styles.input}
//         placeholder="Confirm Password"
//         value={confirmPassword}
//         name="confirmPassword"
//         onChange={(e) => setConfirmPassword(e.target.value)}
//       />
//        {error.confirmPasswordError && (
//         <div className={styles.errorMessage}>{error.confirmPasswordError}</div>
//       )}
      
//       <input
//         type="file"
//         className={styles.input}
//         onChange={handleImageChange}
//       />
//       {catchError && (
//       <div className={styles.errorMessage} style={{padding:"2px 6px" , fontSize:"10px , "}}>{catchError}</div> // Ensure catchError is displayed here
//     )}
//       <button type="button" className={styles.button} onClick={handleSignup}>
//         Sign Up
//       </button>
//       <div className="my-4 lg:hidden block">
//         <Link to="/login">
//           Already have an account?{" "}
//           <span className="text-blue-800 font-semibold">Login</span>
//         </Link>
//       </div>
//     </form>
//   );
// }

// export default SignupForm;

import React, { useEffect, useState } from "react";
import styles from "./Signup.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import axios from "axios"; // Import axios for API calls
import { base_url } from "../../../../utils/base_url";

/* check screen size for animation after account create*/
const useScreenSize = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isLargeScreen;
};

function SignupForm({ setSignIn }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const isLargeScreen = useScreenSize(); // custom hook
  const [error, setError] = useState({});
  const [catchError, setCatchError] = useState(""); // backend error

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Function to validate form fields
  const validateForm = () => {
    const newErrors = {};
    // if (!name) {
    //   newErrors.nameError = "Name is required";
    // }
    if (!email) {
      newErrors.emailError = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.emailError = "Enter a valid email";
    }
    if (!password) {
      newErrors.passwordError = "Password is required";
    }
    if (!confirmPassword) {
      newErrors.confirmPasswordError = "Confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPasswordError = "Passwords don't match";
    }
    return newErrors;
  };

  // Apply border styles based on error states
  useEffect(() => {
    // const nameField = document.querySelector('input[name="name"]');
    const emailField = document.querySelector('input[name="email"]');
    const passwordField = document.querySelector('input[name="password"]');
    const confirmPasswordField = document.querySelector(
      'input[name="confirmPassword"]'
    );

    // if (nameField) {
    //   nameField.style.border = error.nameError ? "2px solid crimson" : "";
    // }
    if (emailField) {
      emailField.style.border = error.emailError ? "2px solid crimson" : "";
    }
    if (passwordField) {
      passwordField.style.border = error.passwordError
        ? "2px solid crimson"
        : "";
    }
    if (confirmPasswordField) {
      confirmPasswordField.style.border = error.confirmPasswordError
        ? "2px solid crimson"
        : "";
    }
  }, [error]);

  // Handle image - limit size as backend limit 1 mb
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (1 MB = 1024 * 1024 bytes)
      if (file.size > 1024 * 1024) {
        setCatchError("Max file size allowed is 1 MB");
        return;
      } else {
        setCatchError("");
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    // Don't proceed if there's a catch error (like file size)
    if (catchError) return;

    try {
      // Clear any previous errors
      setError({});
      setCatchError("");

      // Show loading toast
      const toastId = toast.loading("Creating account...");

      // Create form data for multipart/form-data request
      const formData = new FormData();
      // formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      // formData.append("cpassword", confirmPassword);
      // formData.append("admin", true);

      // if (image) {
      //   formData.append("photo", image);
      // }

      // Call the registration endpoint
      const response = await axios.post(`${base_url}/api/admin/auth`, formData);

      // Handle successful registration
      toast.success("Registration successful! Check your email to verify your account.", { id: toastId });

      // Dispatch registration success action
      dispatch({
        type: 'auth/registerSuccess',
        payload: {
          message: response.data.message,
          redirectUrl: response.data.redirectUrl
        }
      });

      // Handle navigation based on screen size
      if (isLargeScreen && setSignIn) {
        setSignIn(true); // Switch to sign-in panel
      } else {
        navigate("/login"); // Navigate to login page
      }

    } catch (error) {
      // Handle registration errors
      toast.error("Registration failed!");
      setCatchError(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <form className={styles.form}>
      {/* {image == null ? (
        <h1 className={styles.title}>Sign up</h1>
      ) : (
        <div className={styles.profile}>
          <img src={imagePreview} alt="Profile Preview" />
        </div>
      )} */}

      {/* <input
        type="text"
        className={styles.input}
        placeholder="Name"
        value={name}
        name="name"
        onChange={(e) => setName(e.target.value)}
      />
      {error.nameError && (
        <div className={styles.errorMessage}>{error.nameError}</div>
      )} */}
      <input
        type="email"
        className={styles.input}
        placeholder="Email"
        value={email}
        name="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      {error.emailError && (
        <div className={styles.errorMessage}>{error.emailError}</div>
      )}
      <input
        type="password"
        className={styles.input}
        placeholder="Password"
        value={password}
        name="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      {error.passwordError && (
        <div className={styles.errorMessage}>{error.passwordError}</div>
      )}
      <input
        type="password"
        className={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        name="confirmPassword"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {error.confirmPasswordError && (
        <div className={styles.errorMessage}>{error.confirmPasswordError}</div>
      )}

      {/* <input
        type="file"
        className={styles.input}
        onChange={handleImageChange}
      />
      {catchError && (
        <div className={styles.errorMessage} style={{ padding: "2px 6px", fontSize: "10px" }}>{catchError}</div>
      )} */}
      <button type="button" className={styles.button} onClick={handleSignup}>
        Sign Up
      </button>
      <div className="my-4 lg:hidden block">
        <Link to="/login">
          Already have an account?{" "}
          <span className="text-blue-800 font-semibold">Login</span>
        </Link>
      </div>
    </form>
  );
}

export default SignupForm;