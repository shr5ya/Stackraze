const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

export async function refineText(content, instruction) {
  try {

    if (!apiKey) {
      throw new Error("Missing API key!");
    }

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin, 
        "X-Title": "Anchor"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a professional text refinement assistant.
            - Improve grammar, clarity, and tone
            - Follow user instruction strictly
            - Do NOT add explanations- Preserve original meaning`
          },
          {
            role: "user",
            content: `Instruction: ${instruction}\nText: ${content}`
          }
        ]
      })
    });

    // 🔥 Get raw response text first
    const raw = await res.text();

    if (!res.ok) {
      console.error("❌ OpenRouter Error:", raw);
      throw new Error("API response not ok");
    }

    const data = JSON.parse(raw);

    if (!data?.choices?.[0]?.message?.content) {
      console.error("❌ Invalid format:", data);
      throw new Error("Invalid response format");
    }

    return data.choices[0].message.content;

  } catch (error) {
    console.error("Refinement Error:", error);
    return "Oops, I am finding difficulty while refining. Please try after some time.";
  }
}

export async function refineNews(newsItems) {
  try {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

    if (!apiKey) {
      throw new Error("Missing API key");
    }

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "Anchor"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are a professional news editor.

Your job:
- Rewrite headlines to be catchy and clear
- Expand and enrich content with more context and details
- Keep information factual and aligned with original meaning
- Make content slightly longer and more informative
- DO NOT add explanations

Return ONLY valid JSON in this format:
{
  "articles": [
    {
      "headline": "Improved headline",
      "content": "Expanded and refined content"
    }
  ]
}
`
          },
          {
            role: "user",
            content: `Refine the following news:\n${JSON.stringify(newsItems)}`
          }
        ]
      })
    });

    const raw = await res.text();

    if (!res.ok) {
      console.error("❌ OpenRouter Error:", raw);
      throw new Error("API response not ok");
    }

    const data = JSON.parse(raw);

    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      console.error("❌ Invalid format:", data);
      throw new Error("Invalid response format");
    }

    // Ensure JSON parsing is safe
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      console.error("❌ JSON Parse Error:", content);
      throw new Error("AI did not return valid JSON");
    }

    return parsed;

  } catch (error) {
    console.error("Refine News Error:", error);

    return {
      articles: [],
      error: "Failed to refine news. Please try again later."
    };
  }
}