(() => {
  const prompts = [
    "How do I join the community?",
    "Where is your latest content?",
    "How can I support the channel?"
  ];

  function getReply(message) {
    const text = message.toLowerCase();

    if (text.includes("join") || text.includes("community") || text.includes("discord")) {
      return "Join the official Tacticool Discord: https://discord.gg/tacticool";
    }

    if (text.includes("latest") || text.includes("video") || text.includes("youtube")) {
      return "Latest uploads are on YouTube: https://www.youtube.com/@MAZENEAGLEEYE";
    }

    if (text.includes("support") || text.includes("code") || text.includes("my.games")) {
      return "You can support by using the creator code in MY.GAMES events and sharing the channel with your squad.";
    }

    if (text.includes("guide") || text.includes("tips")) {
      return "Ask for a specific role or map and I will suggest a Tacticool starting plan.";
    }

    return "Ask about Discord access, latest videos, Tacticool guides, or support options.";
  }

  function addMessage(host, role, text) {
    const msg = document.createElement("p");
    msg.className = `msg ${role}`;
    msg.textContent = text;
    host.appendChild(msg);
    host.scrollTop = host.scrollHeight;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const shell = document.querySelector(".ai-box");
    const promptsHost = document.getElementById("quick-prompts");
    if (!shell || !promptsHost) {
      return;
    }

    shell.innerHTML = "";

    const history = document.createElement("div");
    history.className = "chat-history";

    const controls = document.createElement("div");
    controls.className = "chat-controls";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Ask Tacticool questions...";

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Send";

    controls.append(input, button);
    shell.append(history, controls);

    addMessage(history, "bot", "AI assistant online. Ask me about community links, videos, or support options.");

    function send() {
      const text = input.value.trim();
      if (!text) {
        return;
      }

      addMessage(history, "user", text);
      addMessage(history, "bot", getReply(text));
      input.value = "";
      input.focus();
    }

    button.addEventListener("click", send);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        send();
      }
    });

    prompts.forEach((prompt) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.textContent = prompt;
      chip.addEventListener("click", () => {
        input.value = prompt;
        send();
      });
      promptsHost.appendChild(chip);
    });
  });
})();
