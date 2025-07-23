import fs from 'fs/promises';
import path from 'path';

import { NextResponse } from 'next/server';

import { GET } from './route';

// fs/promises 모듈 모의 처리
jest.mock('fs/promises', () => ({
  readFile: jest.fn()
}));

// NextResponse.json 모의 처리
// 실제 NextResponse.json은 복잡한 객체를 반환하므로, 간단히 입력값을 그대로 반환하도록 설정
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data) => ({
      json: () => Promise.resolve(data), // .json() 메서드를 모의 처리하여 데이터를 반환
      status: 200
    }))
  }
}));

// console.error 모의 처리
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('GET /api/posts', () => {
  // 각 테스트 실행 후 모의 함수 기록 초기화
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 테스트 종료 후 스파이 복원
  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  test('성공: posts.json 파일을 읽고, 날짜순으로 정렬된 게시물 배열을 반환해야 한다.', async () => {
    // GIVEN: 테스트용 모의 데이터 준비
    const mockPostsData = {
      react: [{ title: 'React Post 1', date: '2023-01-01', description: '', category: 'react' }],
      javascript: [
        { title: 'JS Post 2', date: '2023-01-03', description: '', category: 'javascript' },
        { title: 'JS Post 1', date: '2023-01-02', description: '', category: 'javascript' }
      ]
    };

    const expectedSortedPosts = [
      { title: 'JS Post 2', date: '2023-01-03', description: '', category: 'javascript' },
      { title: 'JS Post 1', date: '2023-01-02', description: '', category: 'javascript' },
      { title: 'React Post 1', date: '2023-01-01', description: '', category: 'react' }
    ];

    // fs.readFile이 모의 데이터를 반환하도록 설정
    (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockPostsData));

    // WHEN: GET 함수 실행
    const response = await GET();
    const responseData = await response.json();

    // THEN: 결과 검증
    // 1. fs.readFile이 올바른 경로로 호출되었는지 확인
    const expectedFilePath = path.join(process.cwd(), 'public', 'posts', 'posts.json');
    expect(fs.readFile).toHaveBeenCalledWith(expectedFilePath, 'utf8');

    // 2. NextResponse.json이 정렬된 데이터로 호출되었는지 확인
    expect(NextResponse.json).toHaveBeenCalledWith(expectedSortedPosts);

    // 3. 실제 반환된 데이터가 기대한 값과 일치하는지 확인
    expect(responseData).toEqual(expectedSortedPosts);
  });

  test('실패: 파일 읽기 중 오류가 발생하면 에러를 던져야 한다.', async () => {
    // GIVEN: fs.readFile이 에러를 발생시키도록 설정
    const mockError = new Error('File not found');
    (fs.readFile as jest.Mock).mockRejectedValue(mockError);

    // WHEN/THEN: GET 함수 실행 시 에러가 발생하는지 검증
    await expect(GET()).rejects.toThrow(mockError);

    // console.error가 올바른 인자와 함께 호출되었는지 확인
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[API 오류] posts.json 파일 읽기 실패:',
      mockError
    );
  });
});
