import { serve } from "bun";

const MONDAY_API_TOKEN = "YOUR_TOKEN";
const FILE_COLUMN_ID = "file_mkxy94cc";

serve({
  port: 3001, // IMPORTANT: different from Vite 5173
  async fetch(req) {
    try {
      // --- CORS ---
      if (req.method === "OPTIONS") {
        return new Response(null, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "*",
          },
        });
      }

      const { pathname } = new URL(req.url);

      if (req.method === "POST" && pathname === "/api/upload-to-monday") {
        const formData = await req.formData();
        const file = formData.get("file");
        const itemId = formData.get("itemId");

        if (!file || !itemId) {
          return json({ error: "Missing file or itemId" }, 400);
        }

        // Convert Bun File -> Blob (Bun bug fix)
        const fileBlob = new Blob([await file.arrayBuffer()], {
          type: file.type,
        });

        const mondayFD = new FormData();
        mondayFD.append(
          "query",
          `mutation add_file($file: File!, $itemId: ID!, $column: String!) {
            add_file_to_column(item_id: $itemId, column_id: $column, file: $file) {
              id
            }
          }`
        );

        mondayFD.append("variables[itemId]", itemId);
        mondayFD.append("variables[column]", FILE_COLUMN_ID);
        mondayFD.append("file", fileBlob, file.name);

        // Send to Monday
        const apiRes = await fetch("https://api.monday.com/v2/file", {
          method: "POST",
          headers: {
            Authorization: MONDAY_API_TOKEN,
          },
          body: mondayFD,
        });

        const data = await apiRes.json(); // this is now safe

        return json(data);
      }

      return json({ error: "Not Found" }, 404);
    } catch (err) {
      return json({ error: err.message || "Server Error" }, 500);
    }
  },
});

// helper
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
