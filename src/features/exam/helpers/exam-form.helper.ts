import { ExActTextType } from '#/core/models/core.model';

export const defaultQuestion = {
  text: '',
  textType: ExActTextType.Text,
  choices: Array.from(Array(4), () => ({
    text: '',
    textType: ExActTextType.Text,
    isCorrect: false,
  })) as any[],
} as any;

export function createDefaultStageQuestion(stageNumber: number) {
  return { ...defaultQuestion, stageNumber };
}
