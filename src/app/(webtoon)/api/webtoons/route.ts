import { promises as fs } from 'fs';
import path from 'path';

import { shuffle } from 'es-toolkit';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'webtoon', 'webtoons.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    return NextResponse.json({
      ...data,
      webtoons: shuffle(data.webtoons)
    });
  } catch (error) {
    console.error('[API 오류] webtoons.json 읽기 실패:', error);
    return NextResponse.json(
      { message: '[API 오류] webtoons.json 읽기 실패: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
