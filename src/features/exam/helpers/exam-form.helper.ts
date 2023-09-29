export const defaultQuestion = {
  text: '',
  choices: Array.from(Array(4), () => ({
    text: '',
    isExpression: false,
    isCorrect: false,
  })) as any[],
} as any;
