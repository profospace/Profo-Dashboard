// src/pages/WhatsappScanner.jsx
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import QRCode from "qrcode";
import { base_url } from "../../../utils/base_url";

// const socket = io(base_url); // adjust backend URL if needed

const socket = io(base_url, {
    auth: {
        token: localStorage.getItem("authToken") // or from localStorage/session
    }
});

const WhatsappScanner = () => {
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [status, setStatus] = useState("connecting...");

    useEffect(() => {
        socket.on("connect", () => {
            setStatus("🟢 Connected to server");
        });

        socket.on("whatsapp-qr", async (qr) => {
            const qrDataUrl = await QRCode.toDataURL(qr);
            setQrCodeUrl(qrDataUrl);
            setStatus("📱 Scan this QR with your WhatsApp");
        });

        socket.on("whatsapp-ready", () => {
            setQrCodeUrl(null);
            setStatus("✅ WhatsApp is connected and ready!");
        });

        return () => {
            socket.off("whatsapp-qr");
            socket.off("whatsapp-ready");
        };
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="bg-white/70 backdrop-blur-xl shadow-xl rounded-3xl p-10 text-center w-[360px] border border-gray-100">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                    WhatsApp Client Setup
                </h1>
                <p className="text-sm text-gray-500 mb-6">{status}</p>

                {qrCodeUrl ? (
                    <div className="flex flex-col items-center">
                        <img
                            src={qrCodeUrl}
                            alt="WhatsApp QR"
                            className="w-60 h-60 shadow-md rounded-xl border border-gray-200"
                        />
                        <p className="mt-4 text-gray-500 text-sm">
                            Open WhatsApp → Linked Devices → Scan QR
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-60 text-gray-400">
                        <div className="w-12 h-12 border-4 border-t-gray-500 rounded-full animate-spin mb-3"></div>
                        <p>Waiting for QR...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WhatsappScanner;
