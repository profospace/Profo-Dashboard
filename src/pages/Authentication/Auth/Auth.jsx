import React,{ useEffect, useState } from "react";
import styles from "./Auth.module.css";
import SignupForm from "../Signup/Signup";
import LoginForm from "../Login/Login";
import { useSelector } from "react-redux";
import { Alert, Flex, Spin } from 'antd';
import { useNavigate } from "react-router-dom";

function AuthenticationForm() {
  const [signIn, setSignIn] = useState(true);
  const navigate = useNavigate()
  const {isLoading  ,isError , isSuccess , message} = useSelector(state => state.auth)
  // const contentStyle = {
  //   padding: 50,
  //   background: 'rgba(0, 0, 0, 0.05)',
  //   borderRadius: 4,
  // };
  // const content = <div style={contentStyle} />;

  useEffect(
    ()=>{
      const token = localStorage.getItem("authToken");
      if(token){
        navigate('/dashboard')
      }
    },[]
  )


  return (
    <div className={styles.authContainer}>
    {
      isLoading && <Spin tip="Loading..." fullscreen={true} size="large" />
    }
      <div className={`${styles.container} ${signIn ? "" : styles.rightPanelActive}`}>
        <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
          <SignupForm signIn={signIn} setSignIn={setSignIn}/>
        </div>
        <div className={`${styles.formContainer} ${styles.signInContainer}`}>
          <LoginForm />
        </div>
        <div className={styles.overlayContainer}>
          <div className={styles.overlay}>
            <div className={`${styles.overlayPanel} ${styles.leftOverlayPanel}`}>
              <h1 className={styles.title}>Welcome Back!</h1>
              <p className={styles.paragraph}>
                To keep connected with us please login with your personal info
              </p>
              <button className={styles.ghostButton} onClick={() => setSignIn(true)}>
                Sign In
              </button>
            </div>
            <div className={`${styles.overlayPanel} ${styles.rightOverlayPanel}`}>
              <h1 className={styles.title}>Hello, Friend!</h1>
              <p className={styles.paragraph}>
                Enter your personal details and start your journey with us
              </p>
              <button className={styles.ghostButton} onClick={() => setSignIn(false)}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthenticationForm;
