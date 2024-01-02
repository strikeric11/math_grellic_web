import isBase64 from 'validator/lib/isBase64';

import { ExActTextType } from '#/core/models/core.model';

import type { ExamQuestionFormData } from '../models/exam-form-data.model';

export const defaultQuestion = {
  text: '',
  textType: ExActTextType.Text,
  choices: Array.from(Array(4), () => ({
    text: '',
    textType: ExActTextType.Text,
    isCorrect: false,
  })) as any[],
} as any;

export async function generateImageFormData(
  orderNumber: number,
  questions: ExamQuestionFormData[],
): Promise<FormData> {
  const formData = new FormData();
  const files: { base64: string; filename: string }[] = [];
  const baseName = `e${orderNumber}`;
  const fileExt = 'png';

  // Append files array if imageData is present
  questions.forEach((question) => {
    if (question.imageData) {
      const filename = `${baseName}-q${question.orderNumber}.${fileExt}`;
      files.push({ base64: question.imageData, filename });
    }

    question.choices.forEach((choice) => {
      if (choice.imageData) {
        const filename = `${baseName}-q${question.orderNumber}-c${choice.orderNumber}.${fileExt}`;
        files.push({ base64: choice.imageData, filename });
      }
    });
  });

  // Convert base64 to blob and append files to formData
  for (const { base64, filename } of files) {
    const blob = await (await fetch(base64)).blob();
    formData.append('files', blob, filename);
  }

  return formData;
}

export async function generateImageFormDataStrict(
  orderNumber: number,
  questions: ExamQuestionFormData[],
): Promise<FormData> {
  const formData = new FormData();
  const files: { base64: string; filename: string }[] = [];
  const baseName = `e${orderNumber}`;
  const fileExt = 'png';

  // Append files array if imageData is present
  questions.forEach((question) => {
    if (
      question.imageData &&
      isBase64(question.imageData?.split(',').pop() || '')
    ) {
      const filename = `${baseName}-q${question.orderNumber}.${fileExt}`;
      files.push({ base64: question.imageData, filename });
    }

    question.choices.forEach((choice) => {
      if (
        choice.imageData &&
        isBase64(choice.imageData?.split(',').pop() || '')
      ) {
        const filename = `${baseName}-q${question.orderNumber}-c${choice.orderNumber}.${fileExt}`;
        files.push({ base64: choice.imageData, filename });
      }
    });
  });

  // Convert base64 to blob and append files to formData
  for (const { base64, filename } of files) {
    const blob = await (await fetch(base64)).blob();
    formData.append('files', blob, filename);
  }

  return formData;
}
