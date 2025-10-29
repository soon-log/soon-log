export function ThemeInitializer() {
  const themeScript = `
    (function() {
      try {
        const theme = localStorage.getItem('theme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';

        let currentTheme;

        if (!theme || theme === 'system') {
          currentTheme = systemTheme;
        } else {
          currentTheme = theme;
        }

        document.documentElement.setAttribute('data-theme', currentTheme);

        if (currentTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (error) {
        console.error('[오류] 테마 초기화 오류:', error);
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
