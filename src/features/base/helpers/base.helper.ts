import dayjs from '#/config/dayjs.config';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const STORAGE_BASE_PATH = import.meta.env.VITE_SUPABASE_STORAGE_BASE_PATH;

export function transformToBaseModel(
  id: number,
  createdAt: string,
  updatedAt: string,
  deletedAt?: string,
) {
  return {
    id,
    createdAt: dayjs(createdAt).toDate(),
    updatedAt: dayjs(updatedAt).toDate(),
    deletedAt: deletedAt ? dayjs(deletedAt).toDate() : undefined,
  };
}

export function getQuestionImageUrl(filePath: string) {
  return `${SUPABASE_URL}/${STORAGE_BASE_PATH}/${filePath}?${Date.now()}`;
}
