import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); 
app.use(cors()); 

// Make sure to include these imports:
// import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// test 
// const prompt = "Tell me about Dragon Ball ? : A Journey Through the Saiyan Life";
// const result = await model.generateContent(prompt);
// console.log(result.response.text());


app.post("/generate", async (req, res) => {
  const prompt = req.body.prompt + 'Make it short and sweet, instead of "\\n" simply write in next line. At max, keep the length of the response to 2 small paragraphs.';

  console.log(prompt);
  try {
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    res.status(200).json(
      { 
        success: true, 
        data: result.response.text() 
      }
    );
  } catch (error) {
    res.status(500).json(
      { 
        success: false, 
        error: error.message 
      }
    );
  }
});


// Default API Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.yellow.bold);
  console.log(`Connect to http://localhost:${PORT}`);
});
