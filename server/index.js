const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3000;

// Load your API key from environment variables or fallback
const apiKey = "AIzaSyC0NZp5BQv8twHPQ9nc7PG07C3lIKwZ8NY";

// Initialize the GoogleGenerativeAI instance with the API key
const genAI = new GoogleGenerativeAI(apiKey);

// Define the model and configuration
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // Specify the model you're using
});

const generationConfig = {
  temperature: 2,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json", // Change to JSON format
};

// Use CORS middleware to allow cross-origin requests
app.use(cors());
app.use(express.json());

app.post("/useGeminiAI", async (req, res) => {
  const userInput = req.body.input;

  if (!userInput) {
    return res.status(400).json({ error: "Input is required" });
  }

  try {
    // Create a dynamic prompt for the Gemini model
    const prompt = `Generate a valid JSON object with detailed step-by-step guidance on the topic "${userInput}". 
    Ensure the JSON follows this structure:

    {
    "workflowId": "workflow_topic_id",
    "title": "Workflow Title",
    "nodes": [
        {
        "id": "1",
        "title": "Main Topic",
        "children": [
            {
            "id": "1-1",
            "title": "Subtopic 1",
            "children": [
                "id": "1-1-1",
                "title": "Subtopic 1",
                "children": [
                    "id": "1-1-1-1",
                    "title": "Subtopic 1",
                    "children": []
                ]
             ]
            }
        ]
        }
    ]
    }

    Expand on advanced sections with more depth. 
    For example:
    - Add **more hooks** like \`useReducer\`, \`useMemo\`, \`useCallback\`, \`useRef\`, \`useLayoutEffect\`, etc., in the "Hooks" section.
    - For "Working with Data," include advanced tools like **GraphQL**, **React Query**, etc.
    - Add **advanced testing tools** or libraries in "Testing in React."
    - Cover additional state management techniques such as **Recoil** or **Zustand**.

    Return **only valid JSON**. Do not include extra comments or explanations outside the JSON object.`;

    // Start a new chat session with the generative model
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    // Send the dynamic prompt to the model
    const result = await chatSession.sendMessage(prompt);

    // Extract the JSON content from the response
    const responseText = result.response.candidates[0].content.parts[0].text;

    // Handle potential invalid JSON responses
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(responseText);
    } catch (jsonError) {
      return res.status(500).json({
        error: "Invalid JSON response from Gemini API",
        details: responseText,
      });
    }

    // Send the parsed JSON response back to the client
    res.json(jsonResponse);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res
      .status(500)
      .json({ error: "Error calling Gemini AI API", details: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
