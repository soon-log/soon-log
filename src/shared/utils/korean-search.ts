const ENG_TO_KOR_MAP: Record<string, string> = {
  q: 'ㅂ',
  w: 'ㅈ',
  e: 'ㄷ',
  r: 'ㄱ',
  t: 'ㅅ',
  y: 'ㅛ',
  u: 'ㅕ',
  i: 'ㅑ',
  o: 'ㅐ',
  p: 'ㅔ',
  a: 'ㅁ',
  s: 'ㄴ',
  d: 'ㅇ',
  f: 'ㄹ',
  g: 'ㅎ',
  h: 'ㅗ',
  j: 'ㅓ',
  k: 'ㅏ',
  l: 'ㅣ',
  z: 'ㅋ',
  x: 'ㅌ',
  c: 'ㅊ',
  v: 'ㅍ',
  b: 'ㅠ',
  n: 'ㅜ',
  m: 'ㅡ',
  Q: 'ㅃ',
  W: 'ㅉ',
  E: 'ㄸ',
  R: 'ㄲ',
  T: 'ㅆ',
  O: 'ㅒ',
  P: 'ㅖ'
};

const CHO = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ'
];

const JUNG = [
  'ㅏ',
  'ㅐ',
  'ㅑ',
  'ㅒ',
  'ㅓ',
  'ㅔ',
  'ㅕ',
  'ㅖ',
  'ㅗ',
  'ㅘ',
  'ㅙ',
  'ㅚ',
  'ㅛ',
  'ㅜ',
  'ㅝ',
  'ㅞ',
  'ㅟ',
  'ㅠ',
  'ㅡ',
  'ㅢ',
  'ㅣ'
];

const JONG = [
  '',
  'ㄱ',
  'ㄲ',
  'ㄳ',
  'ㄴ',
  'ㄵ',
  'ㄶ',
  'ㄷ',
  'ㄹ',
  'ㄺ',
  'ㄻ',
  'ㄼ',
  'ㄽ',
  'ㄾ',
  'ㄿ',
  'ㅀ',
  'ㅁ',
  'ㅂ',
  'ㅄ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ'
];

const IEUNG = 'ㅇ';

const CONSONANTS = new Set([
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ'
]);

const VOWELS = new Set(JUNG);

const VOWEL_COMBINATIONS: Record<string, string> = {
  ㅗㅏ: 'ㅘ',
  ㅗㅐ: 'ㅙ',
  ㅗㅣ: 'ㅚ',
  ㅜㅓ: 'ㅝ',
  ㅜㅔ: 'ㅞ',
  ㅜㅣ: 'ㅟ',
  ㅡㅣ: 'ㅢ'
};

const FINAL_COMBINATIONS: Record<string, string> = {
  ㄱㅅ: 'ㄳ',
  ㄴㅈ: 'ㄵ',
  ㄴㅎ: 'ㄶ',
  ㄹㄱ: 'ㄺ',
  ㄹㅁ: 'ㄻ',
  ㄹㅂ: 'ㄼ',
  ㄹㅅ: 'ㄽ',
  ㄹㅌ: 'ㄾ',
  ㄹㅍ: 'ㄿ',
  ㄹㅎ: 'ㅀ',
  ㅂㅅ: 'ㅄ'
};

const FINAL_SPLIT: Record<string, [string, string]> = {
  ㄳ: ['ㄱ', 'ㅅ'],
  ㄵ: ['ㄴ', 'ㅈ'],
  ㄶ: ['ㄴ', 'ㅎ'],
  ㄺ: ['ㄹ', 'ㄱ'],
  ㄻ: ['ㄹ', 'ㅁ'],
  ㄼ: ['ㄹ', 'ㅂ'],
  ㄽ: ['ㄹ', 'ㅅ'],
  ㄾ: ['ㄹ', 'ㅌ'],
  ㄿ: ['ㄹ', 'ㅍ'],
  ㅀ: ['ㄹ', 'ㅎ'],
  ㅄ: ['ㅂ', 'ㅅ']
};

const CHO_INDEX: Record<string, number> = CHO.reduce(
  (acc, char, idx) => {
    acc[char] = idx;
    return acc;
  },
  {} as Record<string, number>
);

const JUNG_INDEX: Record<string, number> = JUNG.reduce(
  (acc, char, idx) => {
    acc[char] = idx;
    return acc;
  },
  {} as Record<string, number>
);

const JONG_INDEX: Record<string, number> = JONG.reduce(
  (acc, char, idx) => {
    acc[char] = idx;
    return acc;
  },
  {} as Record<string, number>
);

/** 영어 키보드로 입력된 문자열을 한글로 변환 */
export function convertEngToKor(eng: string): string {
  if (!eng) {
    return '';
  }

  const mappedChars = Array.from(eng).map((char) => ENG_TO_KOR_MAP[char] || char);
  let result = '';
  let syllable = {
    cho: '',
    jung: '',
    jong: ''
  };

  const flush = () => {
    if (!syllable.cho && !syllable.jung && !syllable.jong) {
      return;
    }

    if (syllable.cho && syllable.jung) {
      const choIndex = CHO_INDEX[syllable.cho];
      const jungIndex = JUNG_INDEX[syllable.jung];
      const jongIndex =
        syllable.jong !== '' ? (JONG_INDEX[syllable.jong] ?? undefined) : JONG_INDEX[''];

      if (
        typeof choIndex === 'number' &&
        typeof jungIndex === 'number' &&
        typeof jongIndex === 'number'
      ) {
        const code = 44032 + (choIndex * 21 + jungIndex) * 28 + jongIndex;
        result += String.fromCharCode(code);
      } else {
        if (syllable.cho) {
          result += syllable.cho;
        }
        if (syllable.jung) {
          result += syllable.jung;
        }
        if (syllable.jong) {
          result += syllable.jong;
        }
      }
    } else {
      if (syllable.cho) {
        result += syllable.cho;
      }
      if (syllable.jung) {
        result += syllable.jung;
      }
      if (syllable.jong) {
        result += syllable.jong;
      }
    }

    syllable = {
      cho: '',
      jung: '',
      jong: ''
    };
  };

  for (const char of mappedChars) {
    if (!CONSONANTS.has(char) && !VOWELS.has(char)) {
      flush();
      result += char;
      continue;
    }

    if (VOWELS.has(char)) {
      if (syllable.jong) {
        const split = FINAL_SPLIT[syllable.jong];
        let nextCho: string;
        if (split) {
          syllable.jong = split[0];
          nextCho = split[1];
        } else {
          nextCho = syllable.jong;
          syllable.jong = '';
        }
        flush();
        syllable.cho = nextCho || IEUNG;
        syllable.jung = char;
        continue;
      }

      if (!syllable.cho) {
        syllable.cho = IEUNG;
      }

      if (!syllable.jung) {
        syllable.jung = char;
        continue;
      }

      const vowelCombo = VOWEL_COMBINATIONS[syllable.jung + char];
      if (vowelCombo) {
        syllable.jung = vowelCombo;
        continue;
      }

      flush();
      syllable.cho = IEUNG;
      syllable.jung = char;
      continue;
    }

    if (!syllable.jung) {
      if (!syllable.cho) {
        syllable.cho = char;
        continue;
      }

      flush();
      syllable.cho = char;
      continue;
    }

    if (!syllable.jong) {
      syllable.jong = char;
      continue;
    }

    const finalCombo = FINAL_COMBINATIONS[syllable.jong + char];
    if (finalCombo) {
      syllable.jong = finalCombo;
      continue;
    }

    flush();
    syllable.cho = char;
  }

  flush();
  return result;
}

/** 한글 문자열을 초성으로 변환 */
export function getInitialConsonants(str: string): string {
  let result = '';
  for (const char of str) {
    const code = char.charCodeAt(0) - 44032; // '가'의 유니코드
    if (code >= 0 && code <= 11171) {
      const choIndex = Math.floor(code / 588);
      result += CHO[choIndex];
    } else {
      result += char; // 한글이 아니면 원본 문자 추가
    }
  }
  return result;
}
