const logEl = document.getElementById("log");
const form = document.getElementById("form");
const msgEl = document.getElementById("msg");
const sendBtn = document.getElementById("send");

const API_URL = "/api/chat.php";

const history = [];

function appendBubble(role, text, isError = false) {
  const div = document.createElement("div");
  div.className = `bubble ${isError ? "error" : role}`;
  div.textContent = text;
  logEl.appendChild(div);
  logEl.scrollTop = logEl.scrollHeight;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = msgEl.value.trim();
  if (!text) return;

  msgEl.value = "";
  history.push({ role: "user", content: text });
  appendBubble("user", text);

  sendBtn.disabled = true;
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.ok) {
      const err =
        data.error ||
        data.detail?.error?.message ||
        JSON.stringify(data.detail || data);
      const normalized = String(err).toLowerCase();
      const friendly =
        normalized.includes('token') ||
        normalized.includes('rate limit') ||
        normalized.includes('intente luego')
          ? 'Hubo un problema de servicio o tokens. Intenta nuevamente en unos minutos.'
          : err;
      appendBubble("assistant", `Error: ${friendly}`, true);
      history.pop();
      return;
    }

    const answer = data.message || "(sin texto)";
    history.push({ role: "assistant", content: answer });
    appendBubble("assistant", answer);
  } catch (err) {
    appendBubble("assistant", `Error de red: ${err.message}`, true);
    history.pop();
  } finally {
    sendBtn.disabled = false;
    msgEl.focus();
  }
});
