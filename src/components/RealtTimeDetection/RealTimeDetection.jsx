import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";

const RealTimeDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  // Load the YOLO model when the button is clicked
  const loadModel = async () => {
    console.log("Loading model...");
    const loadedModel = await tf.loadGraphModel(`${process.env.PUBLIC_URL}/model/model.json`);
    setModel(loadedModel);
    setIsModelLoaded(true);
    console.log("Model loaded!");
  };

  // Start the camera feed
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };
    startCamera();
  }, []);

  // Perform detection on each video frame
  useEffect(() => {
    if (model) {
      const detectFrame = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const processFrame = async () => {
          if (model && video.readyState === 4) {
            const inputTensor = tf.browser.fromPixels(video)
              .resizeNearestNeighbor([416, 416]) // Adjust based on model input size
              .toFloat()
              .div(255.0)
              .expandDims(0);

            const outputs = await model.executeAsync(inputTensor);
            const [boxes, scores, classes] = outputs.map((output) => output.arraySync());

            // Draw the live feed and bounding boxes
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            drawBoundingBoxes(ctx, boxes, scores, classes);

            tf.dispose([inputTensor, outputs]);
          }
          requestAnimationFrame(processFrame);
        };

        processFrame();
      };
      detectFrame();
    }
  }, [model]);

  // Draw bounding boxes
  const drawBoundingBoxes = (ctx, boxes, scores, classes) => {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;

    boxes.forEach((box, i) => {
      if (scores[i] > 0.5) { // Confidence threshold
        const [y1, x1, y2, x2] = box;
        const width = (x2 - x1) * ctx.canvas.width;
        const height = (y2 - y1) * ctx.canvas.height;

        ctx.strokeRect(x1 * ctx.canvas.width, y1 * ctx.canvas.height, width, height);
        ctx.fillText(`Class: ${classes[i]} Score: ${scores[i].toFixed(2)}`, x1 * ctx.canvas.width, y1 * ctx.canvas.height - 5);
      }
    });
  };

  return (
    <div>
      <h1>Real-Time Object Detection</h1>
      {!isModelLoaded && (
        <button onClick={loadModel} style={styles.button}>
          Load Model
        </button>
      )}
      <div style={styles.container}>
        {/* Live camera feed */}
        <video
          ref={videoRef}
          style={{
            ...styles.video,
          }}
        />
        {/* Detection canvas */}
        {isModelLoaded && (
          <canvas
            ref={canvasRef}
            style={{
              ...styles.canvas,
            }}
          />
        )}
      </div>
    </div>
  );
};

const styles = {
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  container: {
    position: "relative",
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto",
  },
  video: {
    width: "100%",
    borderRadius: "8px",
  },
  canvas: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: "8px",
    pointerEvents: "none", // Prevent interaction with the canvas
  },
};

export default RealTimeDetection;
