export const handler = async (event) => {
  // 1. Handle CORS Preflight requests (OPTIONS)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      },
      body: "OK"
    };
  }

  // 2. Reject anything that isn't a valid POST request
  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      headers: { "Access-Control-Allow-Origin": "*" },
      body: "Method Not Allowed" 
    };
  }

  try {
    const { text } = JSON.parse(event.body);

    // 3. Execute the Groq API request
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.text_api}` 
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a pure transliteration engine. Convert the provided Roman Nepali string directly into standard Nepali Unicode (Devanagari script). Return only the Devanagari characters. Do not include quotes, English translations, explanations, or any extra conversational text."
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.1,
        max_completion_tokens: 1024
      })
    });

    if (!response.ok) {
        throw new Error("Groq API responded with an error");
    }

    const data = await response.json();
    const unicodeText = data.choices[0]?.message?.content?.trim();

    // 4. Return success with CORS headers attached
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ result: unicodeText })
    };
    
  } catch (error) {
    console.error("Function Error:", error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Failed to process transliteration" })
    };
  }
};
