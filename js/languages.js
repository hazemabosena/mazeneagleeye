(() => {
  const fallbackTranslations = {
    en: {
      navTrust: "Trust",
      navSystems: "Systems",
      navProjects: "Projects",
      navVideos: "Videos",
      navAI: "AI",
      heroTag: "Creator Command Center",
      heroName: "Mazen EagleEye",
      heroDescription: "I build creative tools with Python and Node.js, from Discord bots and automation tools to web apps that help online communities. I love experimenting with new ideas, leveling up my coding skills, and shipping projects that are actually useful. More projects and advanced systems are coming soon.",
      heroYouTube: "YouTube",
      heroDiscord: "Discord",
      heroInstagram: "Instagram",
      statsTitle: "Live Stats",
      trustTag: "Proof Of Work",
      trustTitle: "Creator Trust",
      systemsTag: "What I Build",
      systemsTitle: "Featured Systems",
      projectsTag: "Code & Projects",
      projectsTitle: "Projects & Code",
      projectsIntro: "I build creative tools with Python and Node.js, from Discord bots and automation tools to web apps that help online communities. I love experimenting with new ideas, leveling up my coding skills, and shipping projects that are actually useful. More projects and advanced systems are coming soon.",
      proj1Title: "Tacticool Discord Bot (TACTIOPBOT)",
      proj1Text: "Clan missions, operator picker, and an auto-generated 500x1301 mission image.",
      proj2Title: "AI Multi-Tool Website",
      proj2Text: "Flask-powered AI hub with assistant, sentiment, speech-to-text, study tools, and text generation.",
      proj3Title: "AI YouTube Automation System",
      proj3Text: "Auto-generate videos and voice, then publish to YouTube with zero manual editing.",
      proj4Title: "Mega Discord Bot (All-in-One)",
      proj4Text: "AI chat, image generation, music, tickets, games, moderation, and welcome system.",
      sys1Title: "Guide Engine",
      sys1Text: "Structured tutorials for fast learning, cleaner loadouts, and better team play in Tacticool.",
      sys2Title: "Community Ops",
      sys2Text: "Event coordination, moderation workflows, and Tacticool support for members.",
      sys3Title: "Creator Automation",
      sys3Text: "Bots and content pipelines to publish updates, highlights, and smart responses.",
      videosTag: "Tacticool Feed",
      videosTitle: "Latest Videos",
      shortsTag: "Quick Clips",
      shortsTitle: "Latest Shorts",
      chatTag: "Assistant",
      chatTitle: "Talk With My AI",
      actionTagOne: "Support",
      actionTagTwo: "Community",
      mygamesTitle: "Use my code in MY.GAMES web (mazen)",
      mygamesText: "Use code mazen in the MY.GAMES web page to support the channel.",
      tacticoolTitle: "Join Tacticool Discord",
      tacticoolText: "Meet players, get Tacticool updates, and build your team in the official community.",
      backTop: "Back to top"
    }
  };

  const languageLabels = {
    en: "English",
    ar: "العربية",
    fr: "Français",
    es: "Español",
    de: "Deutsch",
    it: "Italiano",
    pt: "Português",
    tr: "Türkçe",
    ru: "Русский",
    id: "Bahasa Indonesia"
  };

  let currentLang = "en";

  function applyTranslations(translations) {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      const value = translations[currentLang] && translations[currentLang][key];
      if (value) {
        element.textContent = value;
      }
    });
  }

  function buildLanguageOptions(select, available) {
    select.innerHTML = "";
    available.forEach((code) => {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = languageLabels[code] || code.toUpperCase();
      select.appendChild(option);
    });
  }

  async function loadTranslations() {
    try {
      const response = await fetch("data/languages.json");
      if (!response.ok) {
        return fallbackTranslations;
      }

      const json = await response.json();
      if (!json || typeof json !== "object" || !Object.keys(json).length) {
        return fallbackTranslations;
      }

      return json;
    } catch {
      return fallbackTranslations;
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const translations = await loadTranslations();
    const available = Object.keys(translations);
    if (!available.includes(currentLang)) {
      currentLang = available[0] || "en";
    }

    const stored = localStorage.getItem("lang");
    if (stored && available.includes(stored)) {
      currentLang = stored;
    }

    applyTranslations(translations);

    const select = document.getElementById("lang-select");
    if (!select) {
      return;
    }

    buildLanguageOptions(select, available);
    select.value = currentLang;

    select.addEventListener("change", () => {
      currentLang = select.value;
      localStorage.setItem("lang", currentLang);
      applyTranslations(translations);
    });
  });
})();
