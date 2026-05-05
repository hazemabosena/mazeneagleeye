(() => {
  const fallbackTrust = [
    "Official MY.GAMES Creator Partner",
    "Tacticool Community Helper",
    "Trusted Tacticool Content Creator"
  ];

  const statsConfig = [
    { key: "subscribers", label: "Subscribers" },
    { key: "views", label: "Views" },
    { key: "videos", label: "Videos" }
  ];

  async function getJSON(path, fallback) {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        return fallback;
      }
      const data = await response.json();
      if (!data || (Array.isArray(data) && data.length === 0)) {
        return fallback;
      }
      return data;
    } catch {
      return fallback;
    }
  }

  function animateNumber(rawValue, element, formatter) {
    const target = Number(rawValue);
    if (!Number.isFinite(target)) {
      element.textContent = String(rawValue);
      return;
    }

    const duration = 700;
    const start = performance.now();

    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const value = target * p;
      if (formatter) {
        element.textContent = formatter(value, p);
      } else {
        element.textContent = value.toFixed(target % 1 ? 1 : 0);
      }
      if (p < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  function makeCardKeyboardAccessible(element, callback) {
    element.tabIndex = 0;
    element.setAttribute("role", "button");
    element.addEventListener("click", callback);
    element.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        callback();
      }
    });
  }

  function initReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    document.querySelectorAll(".reveal").forEach((el) => {
      const delay = Number(el.dataset.delay || 0);
      if (delay) {
        el.style.transitionDelay = `${delay}ms`;
      }
      observer.observe(el);
    });
  }

  function initTilt() {
    document.querySelectorAll(".tilt").forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rx = ((y / rect.height) - 0.5) * -8;
        const ry = ((x / rect.width) - 0.5) * 8;
        card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "rotateX(0deg) rotateY(0deg)";
      });
    });
  }

  function renderStatCards(host, values) {
    host.innerHTML = "";
    statsConfig.forEach((item) => {
      const node = document.createElement("article");
      node.className = "stat";
      node.dataset.statKey = item.key;

      const strong = document.createElement("strong");
      strong.textContent = values[item.key] || "—";

      const label = document.createElement("span");
      label.textContent = item.label;

      node.append(strong, label);
      host.appendChild(node);
    });
  }

  async function renderStats() {
    const host = document.getElementById("stats-grid");
    if (!host) {
      return;
    }

    const creator = await getJSON("data/creator.json", {});
    renderStatCards(host, {
      subscribers: creator?.stats?.[0]?.value || "1,466",
      views: creator?.stats?.[1]?.value || "209",
      videos: creator?.stats?.[2]?.value || "531"
    });

    const config = window.YT_CONFIG || {};
    if (!config.apiKey || !config.channelId) {
      return;
    }

    try {
      const endpoint = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${config.channelId}&key=${config.apiKey}`;
      const response = await fetch(endpoint);
      if (!response.ok) {
        return;
      }

      const data = await response.json();
      const stats = data?.items?.[0]?.statistics;
      if (!stats) {
        return;
      }

      const formatter = new Intl.NumberFormat();
      const mapping = {
        subscribers: stats.subscriberCount,
        views: stats.viewCount,
        videos: stats.videoCount
      };

      Object.entries(mapping).forEach(([key, value]) => {
        const card = host.querySelector(`[data-stat-key="${key}"]`);
        const strong = card?.querySelector("strong");
        if (!strong) {
          return;
        }

        animateNumber(value, strong, (num, progress) => {
          if (progress < 1) {
            return formatter.format(Math.max(0, Math.floor(num)));
          }
          return formatter.format(Number(value));
        });
      });
    } catch {
      return;
    }
  }

  async function renderTrust() {
    const host = document.getElementById("trust-grid");
    if (!host) {
      return;
    }

    const data = await getJSON("data/trust.json", { items: fallbackTrust });
    const items = Array.isArray(data) ? data : data.items;
    const safeItems = Array.isArray(items) && items.length ? items : fallbackTrust;

    host.innerHTML = "";
    safeItems.forEach((text, index) => {
      const card = document.createElement("article");
      card.className = "trust-item reveal";
      card.dataset.delay = String(index * 80);

      const heading = document.createElement("h3");
      heading.textContent = String(index + 1);

      const paragraph = document.createElement("p");
      paragraph.textContent = text;

      card.append(heading, paragraph);
      host.appendChild(card);
    });
  }

  function initActionCards() {
    document.querySelectorAll(".action-card").forEach((card) => {
      const href = card.dataset.href;
      if (!href) {
        return;
      }
      makeCardKeyboardAccessible(card, () => {
        window.open(href, "_blank", "noopener");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", async () => {
    await Promise.all([renderStats(), renderTrust()]);
    initActionCards();
    initReveal();
    initTilt();
  });
})();
