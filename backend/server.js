import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/ai", aiRoutes);

// Health check with model info
app.get("/health", (req, res) => {
  res.json({ 
    status: "Backend is running!",
    port: PORT,
    service: "AI Assistant Backend",
    timestamp: new Date().toISOString()
  });
});

// Model info endpoint
app.get("/model-info", (req, res) => {
  res.json({
    available_models: [
      "gemini-pro",
      "gemini-pro-vision", 
      "gemini-1.5-flash",
      "gemini-1.5-pro"
    ],
    default_model: "gemini-pro",
    note: "Some models may require specific API access"
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Model info: http://localhost:${PORT}/model-info`);
  console.log(`AI test: http://localhost:${PORT}/api/ai/test`);
});
