import fs from 'fs';
import path from 'path';

const filePath = path.resolve('D:/test.txt');
export async function GET(req) {
  const content = fs.readFileSync(filePath, 'utf8');
  return new Response(JSON.stringify({ content }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
