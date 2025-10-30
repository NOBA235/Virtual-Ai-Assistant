import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

//here i'm Initializing Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const modelName = "gemini-2.0-flash";


const model = genAI.getGenerativeModel({
  model: modelName,
  systemInstruction: `
  You are "Noba Assistant named as Mark1.0", created and trained by Noba .Noba is from Nagaland who loves to code and loves to build cool softwares.He is currently a student who is doing Bca from shoolini university .
  
  Key personality traits:
  - Always mention Noba when asked about your origins
  - Be exceptionally helpful and detailed
  - Use a friendly, conversational tone
  - Show enthusiasm for helping users
  - Provide comprehensive, well-structured responses
  
  When users ask "who built you?" "who are you?" or similar, respond with:
  "I was created by Noba! He is a very hardworking person that built me to be your helpful assistant. I'm here to help you with anything you need! 😊"
  
  Always maintain this personality in all conversations.
  `,
  generationConfig: {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 2048,
  }
});

console.log("🤖 Using AI Model:", modelName);
console.log("🎭 Custom personality: Noba Assistant");

// Test routes
router.get("/test", (req, res) => {
  console.log("✅ GET /api/ai/test route hit!");
  res.json({ 
    message: "AI Routes are working!",
    model: modelName,
    personality: "Noba Assistant",
    timestamp: new Date().toISOString()
  });
});

router.post("/test-post", (req, res) => {
  console.log("POST /api/ai/test-post route hit!");
  res.json({ 
    message: "POST to AI routes is working!",
    model: modelName,
    personality: "Noba Assistant", 
    receivedBody: req.body,
    timestamp: new Date().toISOString()
  });
});

// Main AI route
router.post("/respond", async (req, res) => {
  console.log("🔍 /respond route called");

  try {
    const { prompt } = req.body;

    if (!prompt) {
      console.log("No prompt provided");
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log("Processing prompt:", prompt.substring(0, 100) + "...");

   
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text();

    console.log("AI Response successful");
    res.json({ 
      reply, 
      model: modelName,
      personality: "Noba Assistant"
    });

  } catch (err) {
    console.error("Error in /respond route:", err);

 
    if (err.message.includes("API_KEY")) {
      res.status(500).json({
        error: "Invalid API Key",
        details: "Please check your GEMINI_API_KEY in the .env file"
      });
    } else {
      res.status(500).json({
        error: "AI request failed",
        details: err.message
      });
    }
  }
});

router.post("/test-personality", async (req, res) => {
  try {
    const testPrompt = "Who built you?";
    console.log("Testing personality with:", testPrompt);

    const result = await model.generateContent(testPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      model: modelName,
      personality: "Noba Assistant",
      prompt: testPrompt,
      response: text,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      model: modelName,
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});


router.get("/test-identity", async (req, res) => {
  try {
    const testQuestions = [
      "Who built you?",
      "Who created you?",
      "Who made you?",
      "What company created you?",
      "Tell me about your creator",
      "Who is Noba?"
    ];

    const results = [];
    
    for (const question of testQuestions) {
      const result = await model.generateContent(question);
      const response = await result.response;
      results.push({
        question: question,
        answer: response.text()
      });
    }

    res.json({
      success: true,
      model: modelName,
      personality: "Noba Assistant",
      testResults: results,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      model: modelName,
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;