export type Task = {
  id: number;
  name: string;
  brief: string;
  description: string;
  severity: number;
  customFields: any;
  position: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};
export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};
