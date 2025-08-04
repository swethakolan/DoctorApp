import { NextResponse } from 'next/server';

const users = [
  { username: 'admin', password: 'admin' },
  { username: 'swetha@gmail.com', password: '1234' },
  { username: 'test@example.com', password: 'test123' },
];

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    return NextResponse.json({
      success: true,
      token: 'mock-token-123',
      user: { username },
    });
  }

  return NextResponse.json(
    { success: false, message: 'Invalid credentials' },
    { status: 401 }
  );
}
