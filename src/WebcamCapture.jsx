import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useSettings } from "./SettingsContext";

const WebcamCapture = ({ addManualResult, addAutoResult }) => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const { serverUrl, autoSend } = useSettings();

  const [loading, setLoading] = useState(false);
  const [statusMessages, setStatusMessages] = useState([]);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    };

    const startVideo = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    };

    loadModels().then(startVideo);
  }, []);

  useEffect(() => {
    const detect = async () => {
      if (!videoRef.current) return;

      const detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );

      const canvas = canvasRef.current;
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      detections.forEach((det) => {
        const { x, y, width, height } = det.box;
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
      });
    };

    const interval = setInterval(detect, 100);
    return () => clearInterval(interval);
  }, []);

  const captureAndSend = async (mode = "manual") => {
    if (!serverUrl) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);
    const fullBase64 = canvas.toDataURL("image/jpeg");
    const base64 = fullBase64.split(",")[1];

    const id = uuidv4();
    const timestamp = new Date().toLocaleString();

    const localStatusMessages = [];

    if (mode === "manual") setLoading(true);
    setStatusMessages(localStatusMessages);

    let result = {
      id,
      timestamp,
      status: "pending",
      data: null,
      msg: "",
    };

    if (mode === "manual") addManualResult(result);
    else addAutoResult(result);

    try {
      const response = await axios.post(`${serverUrl}/verify`, {
        image: base64,
      });

      if (response.data.is_real) {
        localStatusMessages.push({
          timestamp,
          message: "Face verification successful!",
          status: "done",
        });

        result = {
          ...result,
          status: "done",
          data: response.data,
          msg: localStatusMessages
            .map((m) => `${m.status.toUpperCase()}: ${m.message}`)
            .join(" | "),
        };
      } else {
        localStatusMessages.push({
          timestamp,
          message: getErrorMessage(response.data.error),
          status: "error",
        });

        result = {
          ...result,
          status: "error",
          data: response.data.error,
          msg: localStatusMessages
            .map((m) => `${m.status.toUpperCase()}: ${m.message}`)
            .join(" | "),
        };
      }
    } catch (err) {
      const errorMsg = err.response
        ? `Server error: ${err.response.data.error || err.response.statusText}`
        : err.request
        ? "No response from the server. Please check the backend."
        : `Error during request setup: ${err.message}`;

      console.log(errorMsg);

      localStatusMessages.push({
        timestamp,
        message: errorMsg,
        status: "error",
      });

      result = {
        ...result,
        status: "error",
        data: err.message,
        msg: localStatusMessages
          .map((m) => `${m.status.toUpperCase()}: ${m.message}`)
          .join(" | "),
      };
    } finally {
      if (mode === "manual") setLoading(false);
      setStatusMessages(localStatusMessages);

      if (mode === "manual") addManualResult(result);
      else addAutoResult(result);
    }
  };

  const getErrorMessage = (errorCode) => {
    const errorMessages = {
      "Missing 'image' in request": "No image sent with the request.",
      "Image decoding failed": "There was an issue decoding the image.",
      "Multiple faces detected. Only one face is allowed.":
        "Multiple faces detected, only one is allowed.",
      "No valid face detected": "No face detected in the image.",
    };
    return errorMessages[errorCode] || "An unknown error occurred.";
  };

  useEffect(() => {
    if (!autoSend || !serverUrl) return;

    const autoInterval = setInterval(() => {
      captureAndSend("auto");
    }, 5000);

    return () => clearInterval(autoInterval);
  }, [autoSend, serverUrl]);

  return (
    <div className="bg-gradient-to-r from-blue-100 to-blue-300 p-6 rounded-lg shadow-xl">
      {/* Video Container */}
      <div className="relative w-full h-[480px] rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="absolute w-full h-full object-cover scale-x-[-1]"
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full scale-x-[-1]"
        />
      </div>

      {/* Check Frame Button */}
      <div className="w-full flex items-center justify-center mt-4">
        <button
          onClick={() => captureAndSend("manual")}
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-200 hover:scale-105 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Check Frame"}
        </button>
      </div>
    </div>
  );
};

export default WebcamCapture;
