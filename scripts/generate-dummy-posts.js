// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

// 더미 데이터 템플릿
const postTemplates = [
  {
    key: 'react-hooks-deep-dive',
    title: 'React Hooks 심화 가이드',
    category: 'frontend',
    tags: ['React', 'JavaScript', 'Hooks', '함수형컴포넌트'],
    summary: 'React Hooks의 동작 원리와 최적화 방법에 대해 깊이 있게 다룹니다.',
    hasImage: true
  },
  {
    key: 'typescript-advanced-types',
    title: 'TypeScript 고급 타입 활용법',
    category: 'frontend',
    tags: ['TypeScript', '타입시스템', '제네릭'],
    summary: 'TypeScript의 고급 타입 기능들을 실제 프로젝트에서 활용하는 방법을 소개합니다.',
    hasImage: false
  },
  {
    key: 'nodejs-performance-optimization',
    title: 'Node.js 성능 최적화 전략',
    category: 'backend',
    tags: ['Node.js', '성능최적화', '메모리관리'],
    summary: 'Node.js 애플리케이션의 성능을 향상시키는 다양한 기법들을 살펴봅니다.',
    hasImage: true
  },
  {
    key: 'docker-container-best-practices',
    title: 'Docker 컨테이너 모범 사례',
    category: 'devops',
    tags: ['Docker', '컨테이너', 'DevOps', '배포'],
    summary: 'Docker 컨테이너를 효율적으로 관리하고 배포하는 모범 사례를 정리했습니다.',
    hasImage: false
  },
  {
    key: 'ui-ux-design-principles',
    title: 'UI/UX 디자인 기본 원칙',
    category: 'design',
    tags: ['UI/UX', '디자인', '사용자경험'],
    summary: '좋은 사용자 경험을 만들기 위한 UI/UX 디자인의 기본 원칙들을 소개합니다.',
    hasImage: true
  },
  {
    key: 'agile-development-methodology',
    title: '애자일 개발 방법론 실전 적용',
    category: 'career',
    tags: ['애자일', '개발방법론', '프로젝트관리'],
    summary: '애자일 개발 방법론을 실제 프로젝트에 적용하는 방법과 노하우를 공유합니다.',
    hasImage: false
  },
  {
    key: 'javascript-async-patterns',
    title: 'JavaScript 비동기 패턴 완벽 가이드',
    category: 'frontend',
    tags: ['JavaScript', '비동기', 'Promise', 'async/await'],
    summary: 'JavaScript의 다양한 비동기 처리 패턴과 활용법을 체계적으로 정리했습니다.',
    hasImage: true
  },
  {
    key: 'database-optimization-techniques',
    title: '데이터베이스 성능 최적화 기법',
    category: 'backend',
    tags: ['데이터베이스', '성능최적화', 'SQL', '인덱싱'],
    summary: '데이터베이스 쿼리 성능을 향상시키는 다양한 최적화 기법들을 다룹니다.',
    hasImage: false
  },
  {
    key: 'clean-code-principles',
    title: '클린 코드 작성 원칙과 실습',
    category: 'etc',
    tags: ['클린코드', '코드품질', '리팩토링'],
    summary: '읽기 쉽고 유지보수하기 좋은 클린 코드를 작성하는 방법을 알아봅니다.',
    hasImage: true
  },
  {
    key: 'rest-api-design-guidelines',
    title: 'RESTful API 설계 가이드라인',
    category: 'backend',
    tags: ['REST API', 'API설계', '백엔드'],
    summary: '효율적이고 확장 가능한 RESTful API를 설계하는 방법을 상세히 설명합니다.',
    hasImage: false
  },
  {
    key: 'css-grid-flexbox-mastery',
    title: 'CSS Grid와 Flexbox 완전 정복',
    category: 'frontend',
    tags: ['CSS', 'Grid', 'Flexbox', '레이아웃'],
    summary: 'CSS Grid와 Flexbox를 활용한 현대적인 웹 레이아웃 구성 방법을 익힙니다.',
    hasImage: true
  },
  {
    key: 'git-workflow-strategies',
    title: 'Git 워크플로우 전략과 활용',
    category: 'devops',
    tags: ['Git', '버전관리', '협업', '워크플로우'],
    summary: '팀 개발에서 효과적인 Git 워크플로우 전략과 브랜치 관리 방법을 소개합니다.',
    hasImage: false
  },
  {
    key: 'microservices-architecture-guide',
    title: '마이크로서비스 아키텍처 설계 가이드',
    category: 'backend',
    tags: ['마이크로서비스', '아키텍처', '분산시스템'],
    summary: '마이크로서비스 아키텍처의 장단점과 실제 구현 시 고려사항들을 다룹니다.',
    hasImage: true
  },
  {
    key: 'responsive-web-design',
    title: '반응형 웹 디자인 구현 가이드',
    category: 'frontend',
    tags: ['반응형', 'CSS', '미디어쿼리', '모바일'],
    summary: '다양한 디바이스에서 최적화된 사용자 경험을 제공하는 반응형 웹을 만드는 방법입니다.',
    hasImage: false
  },
  {
    key: 'software-testing-strategies',
    title: '소프트웨어 테스팅 전략과 도구',
    category: 'etc',
    tags: ['테스팅', '단위테스트', '통합테스트', 'TDD'],
    summary: '효과적인 소프트웨어 테스팅 전략과 다양한 테스팅 도구들의 활용법을 알아봅니다.',
    hasImage: true
  },
  {
    key: 'web-security-fundamentals',
    title: '웹 보안 기초와 실무 적용',
    category: 'backend',
    tags: ['웹보안', 'HTTPS', 'XSS', 'CSRF'],
    summary: '웹 애플리케이션의 주요 보안 취약점과 이를 방어하는 방법들을 정리했습니다.',
    hasImage: false
  },
  {
    key: 'design-system-implementation',
    title: '디자인 시스템 구축과 운영',
    category: 'design',
    tags: ['디자인시스템', '컴포넌트', '일관성'],
    summary: '일관성 있는 사용자 경험을 위한 디자인 시스템 구축 방법과 운영 노하우를 공유합니다.',
    hasImage: true
  },
  {
    key: 'ci-cd-pipeline-setup',
    title: 'CI/CD 파이프라인 구축 실습',
    category: 'devops',
    tags: ['CI/CD', '자동화', '배포', 'GitHub Actions'],
    summary: 'GitHub Actions를 활용한 효율적인 CI/CD 파이프라인 구축 방법을 단계별로 설명합니다.',
    hasImage: false
  },
  {
    key: 'code-review-best-practices',
    title: '효과적인 코드 리뷰 방법론',
    category: 'career',
    tags: ['코드리뷰', '협업', '개발문화', '품질관리'],
    summary: '팀의 코드 품질과 개발 문화를 향상시키는 효과적인 코드 리뷰 방법을 소개합니다.',
    hasImage: true
  },
  {
    key: 'javascript-es2024-features',
    title: 'JavaScript ES2024 새로운 기능들',
    category: 'frontend',
    tags: ['JavaScript', 'ES2024', '최신기능'],
    summary: 'JavaScript ES2024에서 추가된 새로운 기능들과 실무에서의 활용 방법을 알아봅니다.',
    hasImage: false
  },
  {
    key: 'aws-serverless-architecture',
    title: 'AWS 서버리스 아키텍처 구현',
    category: 'backend',
    tags: ['AWS', '서버리스', 'Lambda', 'API Gateway'],
    summary: 'AWS 서비스들을 활용한 서버리스 아키텍처 설계와 구현 방법을 실습해봅니다.',
    hasImage: true
  },
  {
    key: 'frontend-performance-optimization',
    title: '프론트엔드 성능 최적화 가이드',
    category: 'frontend',
    tags: ['성능최적화', '웹성능', '번들링', '캐싱'],
    summary: '웹 애플리케이션의 로딩 속도와 런타임 성능을 향상시키는 다양한 기법들을 다룹니다.',
    hasImage: false
  },
  {
    key: 'team-communication-skills',
    title: '개발자를 위한 효과적인 소통 방법',
    category: 'career',
    tags: ['소통', '협업', '개발문화', '리더십'],
    summary: '개발팀에서 원활한 소통을 위한 실용적인 방법과 도구들을 소개합니다.',
    hasImage: true
  },
  {
    key: 'mongodb-data-modeling',
    title: 'MongoDB 데이터 모델링 가이드',
    category: 'backend',
    tags: ['MongoDB', 'NoSQL', '데이터모델링'],
    summary: 'MongoDB의 특성을 활용한 효율적인 데이터 모델링 방법과 스키마 설계를 알아봅니다.',
    hasImage: false
  },
  {
    key: 'accessibility-web-development',
    title: '웹 접근성을 고려한 개발',
    category: 'frontend',
    tags: ['웹접근성', 'ARIA', '사용자경험', '표준'],
    summary: '모든 사용자가 접근 가능한 웹 애플리케이션을 만들기 위한 접근성 고려사항을 다룹니다.',
    hasImage: true
  },
  {
    key: 'kubernetes-deployment-guide',
    title: 'Kubernetes 배포 전략과 운영',
    category: 'devops',
    tags: ['Kubernetes', '컨테이너', '오케스트레이션', '배포'],
    summary: 'Kubernetes를 활용한 애플리케이션 배포 전략과 클러스터 운영 방법을 정리했습니다.',
    hasImage: false
  },
  {
    key: 'career-growth-developer',
    title: '개발자 커리어 성장 로드맵',
    category: 'career',
    tags: ['커리어', '성장', '개발자', '스킬업'],
    summary: '주니어부터 시니어까지, 개발자의 단계별 성장 과정과 필요한 역량들을 정리했습니다.',
    hasImage: true
  },
  {
    key: 'graphql-api-development',
    title: 'GraphQL API 개발과 최적화',
    category: 'backend',
    tags: ['GraphQL', 'API', '쿼리최적화'],
    summary: 'GraphQL을 활용한 효율적인 API 개발 방법과 성능 최적화 기법을 소개합니다.',
    hasImage: false
  },
  {
    key: 'remote-work-productivity',
    title: '원격 근무 생산성 향상 팁',
    category: 'career',
    tags: ['원격근무', '생산성', '워라밸', '협업도구'],
    summary: '원격 근무 환경에서 생산성을 높이고 효과적으로 협업하는 방법을 공유합니다.',
    hasImage: true
  }
];

// 현재 날짜에서 역순으로 날짜 생성
function generateDates() {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}

// MDX 콘텐츠 생성
function generateMdxContent(template) {
  return `# ${template.title}

${template.summary}

## 개요

이 글에서는 ${template.title.toLowerCase()}에 대해 자세히 알아보겠습니다. 실무에서 바로 활용할 수 있는 실용적인 내용들을 중심으로 정리했습니다.

## 핵심 내용

### 1. 기본 개념

\`\`\`javascript
// 예제 코드
const example = {
  title: '${template.title}',
  category: '${template.category}',
  tags: ${JSON.stringify(template.tags)}
};

console.log('예제:', example);
\`\`\`

### 2. 실제 활용

실제 프로젝트에서 이러한 개념들을 어떻게 활용할 수 있는지 구체적인 예시를 통해 살펴보겠습니다.

### 3. 모범 사례

- **첫 번째 원칙**: 명확성과 일관성 유지
- **두 번째 원칙**: 성능과 유지보수성 고려
- **세 번째 원칙**: 팀 협업과 문서화 중시

## 주의사항

프로젝트에 적용할 때 고려해야 할 주요 사항들:

1. 팀의 기술 스택과의 호환성
2. 기존 코드베이스와의 일관성
3. 성능에 미치는 영향
4. 유지보수 비용

## 결론

${template.summary} 지속적인 학습과 실습을 통해 더 나은 개발자로 성장해 나가길 바랍니다.

---

*이 글이 도움이 되셨다면 공유해주세요! 😊*
`;
}

// 메타 데이터 생성
function generateMetaContent(template, date) {
  return `export const meta = {
  key: '${template.key}',
  title: '${template.title}',
  date: '${date}',
  tags: ${JSON.stringify(template.tags)},
  category: '${template.category}',
  summary: '${template.summary}'
};
`;
}

// 폴더 생성
function createDirectoryIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 파일 복사
function copyFile(src, dest) {
  try {
    fs.copyFileSync(src, dest);
  } catch (error) {
    console.log(`Warning: Could not copy ${src} to ${dest}:`, error.message);
  }
}

// 메인 실행 함수
async function generateDummyPosts() {
  console.log('🚀 더미 블로그 포스트 생성을 시작합니다...');

  const dates = generateDates();
  const postsDir = path.join(__dirname, 'posts');
  const publicPostsDir = path.join(__dirname, 'public', 'posts');
  const sourceThumbnail = path.join(publicPostsDir, 'test', 'thumbnail.jpg');

  // posts 폴더가 없으면 생성
  createDirectoryIfNotExists(postsDir);
  createDirectoryIfNotExists(publicPostsDir);

  for (let i = 0; i < postTemplates.length; i++) {
    const template = postTemplates[i];
    const date = dates[i];

    console.log(`📝 생성중: ${template.key}`);

    // posts/[key] 폴더 생성
    const postDir = path.join(postsDir, template.key);
    createDirectoryIfNotExists(postDir);

    // index.mdx 파일 생성
    const mdxPath = path.join(postDir, 'index.mdx');
    fs.writeFileSync(mdxPath, generateMdxContent(template));

    // meta.ts 파일 생성
    const metaPath = path.join(postDir, 'meta.ts');
    fs.writeFileSync(metaPath, generateMetaContent(template, date));

    // public/posts/[key] 폴더 생성
    const publicPostDir = path.join(publicPostsDir, template.key);
    createDirectoryIfNotExists(publicPostDir);

    // 썸네일 이미지 복사 (hasImage가 true인 경우만)
    if (template.hasImage && fs.existsSync(sourceThumbnail)) {
      const destThumbnail = path.join(publicPostDir, 'thumbnail.jpg');
      copyFile(sourceThumbnail, destThumbnail);
      console.log(`  📷 썸네일 이미지 복사됨: ${template.key}`);
    }
  }

  console.log('✅ 총 30개의 더미 블로그 포스트가 생성되었습니다!');
  console.log(`📁 Posts 폴더: ${postsDir}`);
  console.log(`🖼️  Public 폴더: ${publicPostsDir}`);

  // 이미지가 있는 포스트와 없는 포스트 수 출력
  const withImages = postTemplates.filter((p) => p.hasImage).length;
  const withoutImages = postTemplates.filter((p) => !p.hasImage).length;
  console.log(`📊 썸네일 이미지 있음: ${withImages}개, 없음: ${withoutImages}개`);
}

// 스크립트 실행
generateDummyPosts().catch(console.error);
