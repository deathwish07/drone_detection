import React, { useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";

const ImageUploader = () => {
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const canvasRef = useRef(null);

  // Load the YOLO model
  const loadModel = async () => {
    if (!model) {
      console.log("Loading model...");
      const loadedModel = await tf.loadGraphModel(`${process.env.PUBLIC_URL}/model/model.json`);
      setModel(loadedModel);
      console.log("Model loaded!");
    }
  };

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !model) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Preprocess the image
      const inputTensor = tf.browser.fromPixels(canvas)
        .resizeNearestNeighbor([416, 416]) // Adjust based on model input size
        .toFloat()
        .div(255.0)
        .expandDims(0);

      // Run inference
      const outputs = await model.executeAsync(inputTensor);
      const [boxes, scores, classes] = outputs.map((output) => output.arraySync());

      // Set predictions for display
      setPredictions({ boxes, scores, classes });
      drawBoundingBoxes(ctx, boxes, scores, classes);

      tf.dispose([inputTensor, outputs]);
    };
  };

  // Draw bounding boxes on canvas
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
      <h1>YOLO Drone Detection</h1>
      <button onClick={loadModel}>Load Model</button>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <canvas ref={canvasRef} style={{ border: "1px solid black" }}></canvas>
      {predictions.length > 0 && (
        <div>
          <h3>Predictions:</h3>
          <pre>{JSON.stringify(predictions, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
