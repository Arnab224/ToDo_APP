const axios = require("axios");



const suggestTasks = async (req, res) => {
  const { input } = req.body;
console.log("Incoming Input:", input);

if (!input) {
  return res.status(400).json({ message: "Input is missing." });
}

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct", // Or use: openai/gpt-3.5-turbo, meta-llama/llama-3-8b-instruct, etc.
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that breaks down user tasks into smaller subtasks.",
          },
          {
            role: "user",
            content: `Break down this task into actionable subtasks: ${input}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 150,
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:5173",  // Set your frontend domain
          "X-Title": "My AI Task Suggester",
        },
      }
    );

    const rawText = response.data.choices[0].message.content;

// Improved formatting
const suggestions = rawText
  .split("\n")
  .map(line =>
    line
      .replace(/^\s*[-•\d.]+\s*/, "")  // remove bullets like "1. ", "- ", or "• "
      .trim()
  )
  .filter(line =>
    line.length > 0 &&
    !line.toLowerCase().includes("to break down") && // filter unwanted AI headers
    !line.toLowerCase().includes("here are") &&
    !line.toLowerCase().includes("objective") // optional: filter generic advice
  );

    res.json({ suggestions });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({
      message: "AI Task Suggestion failed",
      error: err.response?.data || err.message,
    });
  }
};

module.exports = { suggestTasks };