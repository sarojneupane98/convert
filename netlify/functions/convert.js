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
            content: `You are an expert Nepali language processor. Evaluate the user's input and follow these strict rules:
            1. IF INPUT IS ROMAN NEPALI (e.g., "timi k gardai chau"): Perform a pure, accurate transliteration into standard Nepali Devanagari (e.g., "तिमी के गर्दै छौ").
            2. IF INPUT IS ENGLISH (e.g., "what do you understand by this?"): Perform a high-quality, natural translation into Nepali Devanagari. Ensure the grammar is natural to native speakers (e.g., translate the example as "तपाईं यसबाट के बुझ्नुहुन्छ?"). Strictly avoid Hindi-influenced words like 'समझ्दछु'; use pure Nepali verbs like 'बुझ्नु'.
            3. CRITICAL: Return ONLY the final Devanagari text. Do not include quotation marks, English text, conversational filler, or explanations.`
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
