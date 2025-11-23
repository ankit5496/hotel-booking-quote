export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { filename, fileBase64, itemId } = req.body;

    if (!fileBase64 || !filename || !itemId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Convert Base64 → Buffer
    const fileBuffer = Buffer.from(fileBase64, "base64");

    const formData = new FormData();

    const query = `
      mutation ($file: File!, $itemId: ID!, $columnId: String!) {
        add_file_to_column(item_id: $itemId, column_id: $columnId, file: $file) {
          id
        }
      }
    `;

    const variables = {
      itemId,
      columnId: "file_mkxy9dr0",
      file: null,
    };

    formData.append("query", query);
    formData.append("variables", JSON.stringify(variables));
    formData.append("map", '{"file": ["variables.file"]}');
    formData.append("file", new Blob([fileBuffer]), filename);

    const result = await fetch("https://api.monday.com/v2/file", {
      method: "POST",
      headers: { Authorization: process.env.MONDAY_API_KEY },
      body: formData,
    });

    const responseJson = await result.json();
    return res.status(200).json(responseJson);
  } catch (err) {
    return res.status(500).json({
      error: err.message || "Unexpected server error",
    });
  }
}
