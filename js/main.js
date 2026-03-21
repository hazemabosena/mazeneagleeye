(() => {
  const fallbackCreator = {
    name: "Mazen EagleEye",
    stats: [
      { label: "YouTube Subscribers", value: "1466" },
      { label: "Discord Server Members", value: "209" },
      { label: "Discord Friends", value: "531" }
    ]
  };

  const fallbackTrust = [
    "Official MY.GAMES Creator Partner",
    "Tacticool Community Helper",
    "Trusted Tacticool Content Creator"
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

  function animateNumber(rawValue, element) {
    const match = String(rawValue).match(/^(\d+(?:\.\d+)?)(.*)$/);
    if (!match) {
      element.textContent = rawValue;
      return;
    }

    const target = Number(match[1]);
    const suffix = match[2] || "";
    const duration = 700;
    const start = performance.now();

    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const value = (target * p).toFixed(target % 1 ? 1 : 0);
      element.textContent = `${value}${suffix}`;
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

  async function renderStats() {
    const host = document.getElementById("stats-grid");
    if (!host) {
      return;
    }

    const creator = await getJSON("data/creator.json", fallbackCreator);
    const stats = Array.isArray(creator.stats) && creator.stats.length ? creator.stats : fallbackCreator.stats;

    host.innerHTML = "";
    stats.forEach((item) => {
      const node = document.createElement("article");
      node.className = "stat";
      node.innerHTML = `<strong>0</strong><span>${item.label}</span>`;
      host.appendChild(node);
      animateNumber(item.value, node.querySelector("strong"));
    });
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
      card.innerHTML = `<h3>${index + 1}</h3><p>${text}</p>`;
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
