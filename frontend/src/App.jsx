import { useState } from "react";

/*
  Simple UI:
  - textarea for paste content
  - optional TTL
  - optional max views
*/
function App() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [views, setViews] = useState("");
  const [url, setUrl] = useState("");

  // Call backend API to create paste
  const createPaste = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/pastes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        ttl_seconds: ttl ? Number(ttl) : undefined,
        max_views: views ? Number(views) : undefined,
      }),
    });

    const data = await response.json();
    setUrl(data.url);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Pastebin Lite</h1>

        <textarea
          className="w-full border p-2 mb-3"
          rows="6"
          placeholder="Enter your paste..."
          onChange={(e) => setContent(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-2"
          placeholder="TTL (seconds)"
          onChange={(e) => setTtl(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-3"
          placeholder="Max views"
          onChange={(e) => setViews(e.target.value)}
        />

        <button
          onClick={createPaste}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Create Paste
        </button>

        {url && (
          <p className="mt-4">
            Share URL:
            <a className="text-blue-600 ml-1" href={url}>
              {url}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
