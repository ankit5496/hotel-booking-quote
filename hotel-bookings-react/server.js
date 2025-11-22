import { serve } from 'bun';

const MONDAY_API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjU4OTUwNDc1MywiYWFpIjoxMSwidWlkIjo5NjYxNjc5OSwiaWFkIjoiMjAyNS0xMS0yMlQwNjoxMDoxOS41OTJaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MzI1NzMzNDIsInJnbiI6ImFwc2UyIn0.VPdRSYJv5ZAAw4S-ATgzauxoir1DnLeHOvllxDCGf_E';
const FILE_COLUMN_ID = 'file_mkxy94cc';

serve({
  port: 3001,
  async fetch(req) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (req.method === 'POST' && new URL(req.url).pathname === '/api/upload-to-monday') {
      try {
        const formData = await req.formData();
        const file = formData.get('file');
        const itemId = formData.get('itemId');

        const query = `mutation add_file($file: File!, $itemId: ID!, $columnId: String!) {
          add_file_to_column(item_id: $itemId, column_id: $columnId, file: $file) {
            id
          }
        }`;

        const mondayFormData = new FormData();
        mondayFormData.append('query', query);
        mondayFormData.append('variables[itemId]', itemId);
        mondayFormData.append('variables[columnId]', FILE_COLUMN_ID);
        mondayFormData.append('file', file);

        const response = await fetch('https://api.monday.com/v2/file', {
          method: 'POST',
          headers: {
            'Authorization': MONDAY_API_TOKEN,
          },
          body: mondayFormData,
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }

    return new Response('Not Found', { status: 404 });
  },
});

console.log('Server running on http://localhost:3001');