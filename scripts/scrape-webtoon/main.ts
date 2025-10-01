import { promises as fs } from 'fs';
import path from 'path';

import axios from 'axios';
import { shuffle } from 'es-toolkit';

import { getNaverWeekdayWebtoons } from './services';

async function main() {
  try {
    const naverWeekdayWebtoons = await getNaverWeekdayWebtoons();

    const allWebtoons = {
      lastUpdated: new Date().toISOString(),
      webtoons: shuffle([...naverWeekdayWebtoons])
    };
    const dirPath = path.join(process.cwd(), 'webtoon');
    const filePath = path.join(dirPath, 'webtoons.json');

    await fs.mkdir(dirPath, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(allWebtoons, null, 2));

    console.log('✅ 웹툰 스크래핑 완료');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('❌ API 요청 실패:', error.message);
      console.error('Status:', error.response?.status);
    } else if (error instanceof Error) {
      console.error('❌ 스크래핑 실패:', error.message);
    } else {
      console.error('❌ 알 수 없는 오류');
    }
    process.exit(1);
  }
}

main();
