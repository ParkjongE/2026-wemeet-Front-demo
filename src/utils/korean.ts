// 이름 뒤 조사 처리. 받침이 있는 이름은 "도윤이는"처럼 '이'를 붙여 부르는 게 자연스럽다.
export function hasBatchim(word: string): boolean {
  const last = word.trim().slice(-1);
  if (!last) return false;
  const code = last.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return false;
  return code % 28 !== 0;
}

export interface NameForms {
  plain: string; // 서아 / 도윤
  call: string; // 서아 / 도윤이
  는: string;
  가: string;
  를: string;
  와: string;
  의: string;
  에게: string;
  도: string;
  야: string; // 부를 때: 서아야 / 도윤아
}

export function nameForms(name: string): NameForms {
  const plain = name.trim();
  const batchim = hasBatchim(plain);
  const call = batchim ? `${plain}이` : plain;
  return {
    plain,
    call,
    는: `${call}는`,
    가: `${call}가`,
    를: `${call}를`,
    와: `${call}와`,
    의: `${call}의`,
    에게: `${call}에게`,
    도: `${call}도`,
    야: batchim ? `${plain}아` : `${plain}야`,
  };
}

// "서아의 하루", "도윤이의 하루"
export const possessive = (name: string) => nameForms(name).의;
