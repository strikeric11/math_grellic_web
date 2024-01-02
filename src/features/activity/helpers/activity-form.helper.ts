import isBase64 from 'validator/lib/isBase64';

import { defaultQuestion } from '#/exam/helpers/exam-form.helper';

import type { ActivityUpsertFormData } from '../models/activity-form-data.model';

export function createDefaultStageQuestion(stageNumber: number) {
  return { ...defaultQuestion, stageNumber };
}

export async function generateImageFormData(
  data: ActivityUpsertFormData,
): Promise<FormData> {
  const { orderNumber, categories } = data;
  const formData = new FormData();
  const files: { base64: string; filename: string }[] = [];
  const fileExt = 'png';

  categories.forEach((category) => {
    const { level, questions } = category;
    const baseName = `a${orderNumber}-l${level}`;

    if (level == null || !questions?.length) {
      return;
    }

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
  });

  // Convert base64 to blob and append files to formData
  for (const { base64, filename } of files) {
    const blob = await (await fetch(base64)).blob();
    formData.append('files', blob, filename);
  }

  return formData;
}

export async function generateImageFormDataStrict(
  data: ActivityUpsertFormData,
): Promise<FormData> {
  const { orderNumber, categories } = data;
  const formData = new FormData();
  const files: { base64: string; filename: string }[] = [];
  const fileExt = 'png';

  categories.forEach((category) => {
    const { level, questions } = category;
    const baseName = `a${orderNumber}-l${level}`;

    if (level == null || !questions?.length) {
      return;
    }

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
  });

  // Convert base64 to blob and append files to formData
  for (const { base64, filename } of files) {
    const blob = await (await fetch(base64)).blob();
    formData.append('files', blob, filename);
  }

  return formData;
}
