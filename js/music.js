(() => {
  const MUSIC_ID = "bg-music";
  const TOGGLE_ID = "music-toggle";
  const STORAGE_KEY = "musicEnabled";
  const DEFAULT_VOLUME = 0.2;

  function setupMusic() {
    const music = document.getElementById(MUSIC_ID);
    const toggle = document.getElementById(TOGGLE_ID);
    if (!music || !toggle) {
      return;
    }

    music.volume = DEFAULT_VOLUME;

    const stored = localStorage.getItem(STORAGE_KEY);
    let enabled = stored ? stored === "true" : true;

    function updateUI() {
      toggle.classList.toggle("is-off", !enabled);
      toggle.setAttribute("aria-pressed", String(enabled));
      toggle.setAttribute("aria-label", enabled ? "Mute background music" : "Play background music");
      toggle.title = enabled ? "Mute music" : "Play music";
    }

    async function playMusic() {
      try {
        await music.play();
        return true;
      } catch {
        return false;
      }
    }

    function waitForUserGesture() {
      const startOnGesture = async () => {
        await playMusic();
      };

      document.addEventListener("pointerdown", startOnGesture, { once: true });
      document.addEventListener(
        "keydown",
        (event) => {
          if (event.key === "Enter" || event.key === " ") {
            startOnGesture();
          }
        },
        { once: true }
      );
    }

    async function applyState() {
      if (enabled) {
        const started = await playMusic();
        if (!started) {
          waitForUserGesture();
        }
      } else {
        music.pause();
      }
      updateUI();
    }

    toggle.addEventListener("click", async () => {
      enabled = !enabled;
      localStorage.setItem(STORAGE_KEY, String(enabled));
      if (enabled) {
        const started = await playMusic();
        if (!started) {
          waitForUserGesture();
        }
      } else {
        music.pause();
      }
      updateUI();
    });

    applyState();
  }

  document.addEventListener("DOMContentLoaded", setupMusic);
})();
