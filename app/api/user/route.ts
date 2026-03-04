import { NextResponse } from 'next/server';
import os from 'os';

export async function GET() {
  try {
    const username = os.userInfo().username;
    return NextResponse.json({ username });
  } catch (error) {
    return NextResponse.json({ username: 'Usuário' }, { status: 200 });
  }
}
