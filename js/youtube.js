(() => {
  const YT_API_KEY = "AIzaSyA8MKfoBOLlBiXRSUWd_PDiQbVhDY-h-w0";
  const CHANNEL_ID = "UCWwUfOYvuSlj84KE0LnxUGA";
  const VIDEO_COUNT = 6;
  const SHORTS_COUNT = 6;

  window.YT_CONFIG = {
    apiKey: YT_API_KEY,
    channelId: CHANNEL_ID
  };

  const fallbackVideos = [
    {
      title: "Latest Tacticool Uploads",
      description: "Open channel to watch all videos.",
      duration: "Live",
      date: "YouTube",
      thumbnail: "",
      url: "https://www.youtube.com/@MAZENEAGLEEYE"
    }
  ];

  const fallbackShorts = [
    {
      title: "Latest Shorts",
      description: "Open channel to watch all shorts.",
      duration: "Live",
      date: "YouTube",
      thumbnail: "",
      url: "https://www.youtube.com/@MAZENEAGLEEYE/shorts"
    }
  ];

  function formatDate(isoDate) {
    if (!isoDate) {
      return "New";
    }

    try {
      const date = new Date(isoDate);
      return date.toLocaleDateString();
    } catch {
      return "New";
    }
  }

  function normalizeVideosFromAPI(items) {
    return items
      .filter((item) => item.id && item.id.videoId)
      .map((item) => ({
        title: item.snippet?.title || "YouTube Video",
        description: item.snippet?.description || "Open video on YouTube.",
        duration: "Watch",
        date: formatDate(item.snippet?.publishedAt),
        thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || "",
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`
      }));
  }

  function renderVideos(videos, hostId) {
    const host = document.getElementById(hostId);
    if (!host) {
      return;
    }

    host.innerHTML = "";

    videos.forEach((video, index) => {
      const card = document.createElement("article");
      card.className = "video-card";

      if (video.thumbnail) {
        const image = document.createElement("img");
        image.className = "video-thumb";
        image.src = video.thumbnail;
        image.alt = video.title;
        image.loading = "lazy";
        card.appendChild(image);
      }

      const title = document.createElement("h3");
      title.textContent = video.title;

      const description = document.createElement("p");
      description.textContent = (video.description || "").slice(0, 120);

      const meta = document.createElement("div");
      meta.className = "video-meta";

      const duration = document.createElement("span");
      duration.textContent = video.duration;

      const date = document.createElement("span");
      date.textContent = video.date;

      meta.append(duration, date);
      card.append(title, description, meta);

      card.tabIndex = 0;
      const open = () => window.open(video.url, "_blank", "noopener");
      card.addEventListener("click", open);
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open();
        }
      });

      host.appendChild(card);
    });
  }

  async function fetchVideos({ endpoint, hostId, fallback }) {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        renderVideos(fallback, hostId);
        return;
      }

      const data = await response.json();
      const videos = normalizeVideosFromAPI(data.items || []);
      renderVideos(videos.length ? videos : fallback, hostId);
    } catch {
      renderVideos(fallback, hostId);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const videosEndpoint = `https://www.googleapis.com/youtube/v3/search?key=${YT_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${VIDEO_COUNT}&type=video`;
    const shortsEndpoint = `https://www.googleapis.com/youtube/v3/search?key=${YT_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${SHORTS_COUNT}&type=video&videoDuration=short`;

    fetchVideos({ endpoint: videosEndpoint, hostId: "videos-grid", fallback: fallbackVideos });
    fetchVideos({ endpoint: shortsEndpoint, hostId: "shorts-grid", fallback: fallbackShorts });
  });
})();
