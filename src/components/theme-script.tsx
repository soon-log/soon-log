export function ThemeScript() {
  const themeScript = `
    (function() {
      try {
        const theme = localStorage.getItem('theme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';

        let currentTheme;

        if (theme === 'system' || !theme) {
          currentTheme = systemTheme;
        } else {
          currentTheme = theme;
        }

        // data-theme 속성 사용으로 더 명확한 테마 구분
        document.documentElement.setAttribute('data-theme', currentTheme);

        // 기존 class 방식도 호환성을 위해 유지
        if (currentTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (error) {
        console.error('Theme initialization error:', error);
        // 에러 발생 시 기본값 설정
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.classList.remove('dark');
      }
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: themeScript
      }}
    />
  );
}
