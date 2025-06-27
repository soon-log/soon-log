import { act, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { CodeBlock, InlineCode } from './code-block';

describe('CodeBlock 컴포넌트', () => {
  let mockWriteText: jest.Mock;

  beforeEach(() => {
    mockWriteText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: mockWriteText
      },
      writable: true,
      configurable: true
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

  test('js 언어 별칭이 올바르게 처리된다', () => {
    // Given & When
    const { container } = render(<CodeBlock {...defaultProps} language="js" />);

    // Then
    expect(container).toHaveTextContent(/const a = 1;/);
    expect(container).toHaveTextContent(/const b = 2;/);
    expect(container).toHaveTextContent(/const c = a \+ b;/);
    expect(screen.getByText('js')).toBeInTheDocument();
  });

  test('Copy 버튼 클릭 시 클립보드에 코드가 복사된다', async () => {
    // Given
    const codeSnippet = 'console.log("Hello World");';
    render(<CodeBlock>{codeSnippet}</CodeBlock>);

    const copyButton = screen.getByRole('button', { name: 'Copy' });

    // When
    await userEvent.click(copyButton);

    // Then
    expect(mockWriteText).toHaveBeenCalledTimes(1);
    expect(mockWriteText).toHaveBeenCalledWith(codeSnippet.trim());
    expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copied!' })).toBeDisabled();
  });

  test('Copy 버튼 클릭 후 Copied! 상태로 변경되고 2초 후 되돌아간다', async () => {
    // Given
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const snippet = 'console.log("Hello World");';
    render(<CodeBlock>{snippet}</CodeBlock>);

    const copyButton = screen.getByRole('button', { name: 'Copy' });

    // When
    await user.click(copyButton);

    // Then
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument();
    });
    expect(screen.queryByRole('button', { name: 'Copy' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copied!' })).toBeDisabled();

    // When
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Then
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
    });
    expect(screen.queryByRole('button', { name: 'Copied!' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy' })).toBeEnabled();
  });

  test('Copy 버튼이 disabled 상태일 때 중복 클릭이 방지된다', async () => {
    // Given
    const codeSnippet = 'console.log("Hello World");';
    render(<CodeBlock>{codeSnippet}</CodeBlock>);

    const copyButton = screen.getByRole('button', { name: 'Copy' });

    // When
    await userEvent.click(copyButton);

    // Then
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Copied!' })).toBeDisabled();
    });
    expect(mockWriteText).toHaveBeenCalledTimes(1);

    // Given

    // When
    const copiedButton = screen.getByRole('button', { name: 'Copied!' });
    await userEvent.click(copiedButton);

    // Then
    expect(mockWriteText).toHaveBeenCalledTimes(1);
  });
});

describe('InlineCode 컴포넌트', () => {
  const defaultProps = {
    children: 'const a = 1;'
  };

  test('인라인 코드가 정상적으로 렌더링된다', () => {
    // Given & When
    const { container } = render(<InlineCode {...defaultProps} />);

    // Then
    expect(container).toHaveTextContent(/const a = 1;/);
  });

  test('추가 props가 올바르게 전달된다', () => {
    // Given & When
    render(<InlineCode {...defaultProps} className="custom-class" />);

    // Then - code 엘리먼트를 직접 찾아서 확인
    const codeElement = screen.getByText('const a = 1;');
    expect(codeElement).toHaveClass('custom-class');
  });
});
