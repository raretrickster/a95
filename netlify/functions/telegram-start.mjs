export default async (request) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const token = Netlify.env.get("TELEGRAM_BOT_TOKEN");

  if (!token) {
    return new Response("Bot token is not configured", { status: 500 });
  }

  let update;

  try {
    update = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const message = update.message;
  if (!message?.chat?.id || message.text !== "/start") {
    return new Response("OK", { status: 200 });
  }

  const keyboard = {
    inline_keyboard: [[
      {
        text: "📖 Начать читать",
        web_app: { url: "https://amplituda95.netlify.app/" }
      }
    ]]
  };

  const result = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: message.chat.id,
        text: "Добро пожаловать в «Амплитуду 95».\n\nИнтерактивная история о дружбе, выборе и цене собственных решений. Готов начать?",
        reply_markup: keyboard
      })
    }
  );

  if (!result.ok) {
    console.error("Telegram sendMessage failed:", await result.text());
    return new Response("Telegram API error", { status: 502 });
  }

  return new Response("OK", { status: 200 });
};
