import fs from 'fs';
import path from 'path';

export async function GET(request) {
  const filePath = path.resolve('D:/test.txt'); // Absolute path to the file

  try {
    // Read file content
    const data = fs.readFileSync(filePath, 'utf8');
    return new Response(
      JSON.stringify({ success: true, content: data }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error reading file:', error.message);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to read file' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
