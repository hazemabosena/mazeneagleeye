import http from "http";
import fs from "fs";
import path from "path";

const PORT = 4173;
const ROOT = process.cwd();

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".mp4": "audio/mp4",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

http.createServer((req, res) => {
  const safePath = decodeURIComponent(req.url.split("?")[0]);
  const target = safePath === "/" ? "/index.html" : safePath;
  const filePath = path.join(ROOT, target);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (target !== "/index.html" && !path.extname(target)) {
        fs.readFile(path.join(ROOT, "index.html"), (fallbackErr, fallbackData) => {
          if (fallbackErr) {
            res.writeHead(404);
            res.end("Not Found");
            return;
          }

          res.writeHead(200, { "Content-Type": types[".html"] });
          res.end(fallbackData);
        });
        return;
      }

      res.writeHead(404);
      res.end("Not Found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`Creator website running at http://localhost:${PORT}`);
});

