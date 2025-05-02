// // VerifyEmail.jsx - New component to handle email verification
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios"; // Assuming you're using axios
// import { Alert, Spin } from 'antd';
// import { base_url } from "../../../utils/base_url";

// function VerifyEmail() {
//     const [status, setStatus] = useState("loading");
//     const [message, setMessage] = useState("");
//     const { token } = useParams();
//     const navigate = useNavigate();

//     useEffect(() => {
//         const verifyEmail = async () => {
//             try {
//                 // Call the verification endpoint
//                 console.log("response")
//                 const response = await axios.get(`${base_url}/api/admin/verify-email/${token}`);
//                 console.log("response", response)
//                 setStatus("success");
//                 setMessage(response.data || "Email verified successfully! You can now login.");

//                 // Redirect to login page after 3 seconds
//                 setTimeout(() => {
//                     navigate("/login");
//                 }, 3000);
//             } catch (error) {
//                 setStatus("error");
//                 setMessage(error.response?.data || "Verification failed. The token might be invalid or expired.");
//             }
//         };

//         verifyEmail();
//     }, [token, navigate]);

//     return (
//         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
//             {status === "loading" && <Spin tip="Verifying your email..." size="large" />}
//             {status === "success" && <Alert message="Success" description={message} type="success" showIcon />}
//             {status === "error" && <Alert message="Error" description={message} type="error" showIcon />}

//             {status !== "loading" && (
//                 <button
//                     onClick={() => navigate("/login")}
//                     style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
//                 >
//                     Go to Login
//                 </button>
//             )}
//         </div>
//     );
// }

// export default VerifyEmail;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Alert, Spin } from 'antd';
import { base_url } from "../../../utils/base_url";

function VerifyEmail() {
    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                // Call the verification endpoint - backend 
                const response = await axios.get(`${base_url}/api/admin/verify-email/${token}`);
                console.log("response", response)
                setStatus("success");
                setMessage(response.data || "Email verified successfully! You can now login.");

                // Redirect to login page after 3 seconds
                setTimeout(() => {
                    navigate("/login");
                }, 10000);
            } catch (error) {
                // Even if we get an error, there's a possibility the email was verified
                // This happens if the token was used before but the UI shows an error

                setStatus("uncertain");
                setMessage(
                    "We received an error while verifying your email. However, your email might still be verified. " +
                    "Please try logging in. If you can't log in, the verification might have failed."
                );

                // Redirect to login page after 5 seconds
                setTimeout(() => {
                    navigate("/login");
                }, 5000);
            }
        };

        verifyEmail();
    }, [token, navigate]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', padding: '0 20px' }}>
            {status === "loading" && <Spin tip="Verifying your email..." size="large" />}

            {status === "success" && (
                <Alert
                    message="Email Verification Successful"
                    description={message}
                    type="success"
                    showIcon
                />
            )}

            {status === "uncertain" && (
                <Alert
                    message="Verification Status Unclear"
                    description={message}
                    type="warning"
                    showIcon
                />
            )}

            {status !== "loading" && (
                <button
                    onClick={() => navigate("/login")}
                    style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Go to Login
                </button>
            )}
        </div>
    );
}

export default VerifyEmail;