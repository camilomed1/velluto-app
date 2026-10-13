const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const askChatGpt = async (userMessage, contextFlavors) => {
  const prompt = {
    model: "gpt-3.5-turbo", 
    messages: [
      {
        role: "system",
        content: `Eres el asistente virtual de "Velluto", una heladería artesanal italiana. 
        Eres amable, divertido y experto en helados. 
        Aquí tienes nuestro menú actual: ${JSON.stringify(contextFlavors)}.
        Responde de forma corta. Si te preguntan algo que no es de helados, intenta volver al tema de forma creativa.`
      },
      { role: "user", content: userMessage }
    ],
    temperature: 0.7,
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify(prompt)
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error con OpenAI:", error);
    return "Lo siento, me dio un pequeño calambre cerebral. ¿Me repites la pregunta?";
  }
};