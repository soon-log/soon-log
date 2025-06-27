import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { CodeBlock } from './code-block';

describe('CodeBlock 컴포넌트', () => {
  let mockWriteText: jest.Mock;

  beforeEach(() => {
    mockWriteText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText
      }
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  const defaultProps = {
    children: `
    const a = 1;
    const b = 2;
    const c = a + b;
    `,
    language: 'javascript'
  };

  test('코드 블록이 정상적으로 렌더링된다', () => {
    // Given & When
    const { container } = render(<CodeBlock {...defaultProps} />);

    // Then
    expect(screen.getByText('javascript')).toBeInTheDocument();
    expect(container).toHaveTextContent(/const a = 1;/);
    expect(container).toHaveTextContent(/const b = 2;/);
    expect(container).toHaveTextContent(/const c = a \+ b;/);
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
  });

  test('코드 블록 1, 3번 라인에 하이라이트가 적용된다', () => {
    // Given & When
    const { container } = render(<CodeBlock {...defaultProps} highlightLines={[1, 3]} />);

    // Then
    expect(container).toMatchSnapshot();
  });

  test('언어가 없는 경우 기본값인 "text"가 표시된다.', () => {
    // Given
    const codeSnippet = 'console.log("Hello World");';

    // When
    render(<CodeBlock>{codeSnippet}</CodeBlock>);

    // Then
    expect(screen.getByText('text')).toBeInTheDocument();
  });

  test('Copy 버튼 클릭 시 클립보드에 코드가 복사된다', async () => {
    // Given
    const codeSnippet = 'console.log("Hello World");';
    render(<CodeBlock>{codeSnippet}</CodeBlock>);

    // When
    const copyButton = screen.getByRole('button', { name: 'Copy' });
    await userEvent.click(copyButton);

    // Then
    expect(mockWriteText).toHaveBeenCalledTimes(1);
    expect(mockWriteText).toHaveBeenCalledWith(codeSnippet.trim());
    expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument();
  });

  test('Copy 버튼 클릭 후 Copied! 상태로 변경되고 2초 후 되돌아간다', async () => {
    // Given
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    jest.useFakeTimers();
    const snippet = 'console.log("Hello World");';
    render(<CodeBlock>{snippet}</CodeBlock>);

    // When
    const copyButton = screen.getByRole('button', { name: 'Copy' });
    await user.click(copyButton);

    // Then
    expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Copy' })).not.toBeInTheDocument();

    // When
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Then
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Copied!' })).not.toBeInTheDocument();
  });
  // test('Copy 버튼이 disabled 상태일 때 중복 클릭이 방지된다', () => {});
  // test('showLineNumbers가 false일 때 라인 번호가 표시되지 않는다', () => {});
  // test('showLineNumbers가 true일 때 라인 번호가 표시된다', () => {});
  // test('커스텀 theme이 적용된다', () => {});
  // test('className prop이 올바르게 적용된다', () => {});
  // test('빈 코드 블록도 정상적으로 렌더링된다', () => {});
  // test('코드 텍스트의 앞뒤 공백이 제거된다', () => {});
  // test('지원되는 언어 별칭(js, ts, py 등)이 올바르게 처리된다', () => {});
  // test('지원되지 않는 언어는 기본값으로 처리된다', () => {});
});

// describe('InlineCode 컴포넌트', () => {
//   test('인라인 코드가 정상적으로 렌더링된다', () => {});
//   test('추가 props가 올바르게 전달된다', () => {});
//   test('children이 올바르게 표시된다', () => {});
// });
