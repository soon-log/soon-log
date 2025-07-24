# `search-bar.tsx` 컴포넌트 분석 및 개선 계획

이 문서는 `search-bar.tsx` 컴포넌트의 현재 구조를 분석하고, Toss Frontend 디자인 가이드라인에 입각하여 코드 품질을 개선하기 위한 구체적인 제안을 담고 있습니다. 개선은 **가독성, 예측 가능성, 응집도, 결합도**라는 네 가지 핵심 원칙을 중심으로 진행됩니다.

---

## 1. 가독성 (Readability)

코드의 명확성과 이해 용이성을 높입니다.

### 문제점

- **매직 넘버 사용**: `handleBlur` 함수의 `setTimeout`에 사용된 `200`, 결과 목록 표시에 사용된 `10`, 태그 표시에 사용된 `3`과 같은 매직 넘버는 코드의 의도를 파악하기 어렵게 만듭니다.
- **복잡한 조건부 렌더링**: 검색 결과 드롭다운 내부는 `isLoading`, `error`, `results.length` 등 여러 조건에 따라 복잡한 삼항 연산자로 렌더링 로직이 얽혀있습니다.

### 개선 제안

- **매직 넘버를 명명된 상수로 대체**: "Naming Magic Numbers" 규칙에 따라, 의도가 명확한 이름의 상수로 변경합니다.
  - `200` → `BLUR_TIMEOUT_MS`
  - `10` → `MAX_DROPDOWN_RESULTS`
  - `3` → `MAX_DISPLAY_TAGS`
- **조건부 렌더링 로직 분리**: "Separating Code Paths for Conditional Rendering" 규칙을 적용하여, 검색 결과 표시 부분을 별도의 `SearchResultsDropdown` 컴포넌트로 분리합니다. 이를 통해 각 컴포넌트는 명확하고 단일화된 렌더링 책임을 갖게 되어 가독성이 향상됩니다.

---

## 2. 예측 가능성 (Predictability)

코드가 이름, 파라미터, 컨텍스트를 기반으로 예상대로 동작하도록 합니다.

### 문제점

- **숨겨진 로직**: `handleBlur`의 `setTimeout`은 클릭 이벤트를 처리하기 위한 의도이지만, 처음 보는 개발자에게는 왜 지연이 필요한지 즉시 파악하기 어렵습니다.
- **다중 책임을 가진 함수**: `handleResultClick` 함수는 페이지 이동(`router.push`), 상태 초기화(`setQuery`, `setIsOpen`), 포커스 관리(`inputRef.current?.blur()`) 등 여러 부수 효과를 동시에 처리하고 있어 함수의 단일 책임 원칙을 위배합니다.

### 개선 제안

- **로직의 의도 명확화**: 매직 넘버를 상수로 대체하고, 해당 상수를 사용하는 이유에 대한 주석을 추가하여 코드의 예측 가능성을 높입니다.
- **단일 책임 원칙 적용**: "Revealing Hidden Logic (Single Responsibility)" 규칙에 따라, `handleResultClick`과 같은 함수는 `onResultSelect`와 같은 콜백 함수를 호출하는 역할만 수행하도록 변경합니다. 실제 라우팅 및 상태 변경 로직은 해당 콜백 함수를 사용하는 상위 컴포넌트에서 처리하도록 위임하여 역할을 분리합니다.

---

## 3. 응집도 (Cohesion)

관련된 코드를 함께 유지하고, 모듈이 잘 정의된 단일 목적을 갖도록 합니다.

### 문제점

- **낮은 응집도**: 현재 `SearchBar` 컴포넌트는 검색어 입력 처리, 키보드 이벤트, 포커스 관리, 드롭다운 표시 여부, API 연동 상태(로딩, 에러, 결과) 관리 등 너무 많은 책임을 한 곳에서 처리하고 있습니다.

### 개선 제안

- **기능/도메인별 코드 구성**: "Organizing Code by Feature/Domain" 규칙을 따라, 컴포넌트의 책임을 분리합니다.
  - **`SearchBar` (Container)**: `useSearch` 훅을 사용하여 API 데이터를 관리하고, 검색 입력과 관련된 상태(`query`, `isOpen` 등)를 제어하는 역할만 담당합니다.
  - **`SearchInput` (Presentational)**: 실제 `input` 엘리먼트와 키보드 이벤트, 포커스/블러 이벤트를 처리합니다.
  - **`SearchResultsDropdown` (Presentational)**: 로딩, 에러, 결과 목록 등 전달받은 데이터를 화면에 그리는 역할만 수행합니다.

---

## 4. 결합도 (Coupling)

코드베이스의 다른 부분 간의 의존성을 최소화합니다.

### 문제점

- **강한 결합도**: `SearchBar` 컴포넌트는 검색 결과를 어떻게 렌더링할지에 대한 구체적인 DOM 구조와 스타일에 직접적으로 의존하고 있습니다. 이로 인해 결과 표시 방법을 변경하려면 `SearchBar` 컴포넌트 전체를 수정해야 합니다.

### 개선 제안

- **컴포넌트 분리를 통한 결합도 감소**: `SearchResultsDropdown` 컴포넌트를 분리하여 결합도를 낮춥니다. `SearchBar`는 `isLoading`, `results`와 같은 데이터만 props로 전달하며, 결과가 어떻게 렌더링되는지에 대한 책임은 `SearchResultsDropdown`에 위임합니다.
- **상태 관리 범위 제한**: "Scoping State Management" 원칙에 따라, 각 컴포넌트는 자신에게 필요한 상태에만 의존하도록 만듭니다. 예를 들어, `selectedIndex` 상태는 `SearchResultsDropdown` 내부에서 관리하는 것이 더 적절할 수 있습니다. 이를 통해 불필요한 리렌더링을 방지하고 컴포넌트 간의 의존성을 더욱 낮출 수 있습니다.
