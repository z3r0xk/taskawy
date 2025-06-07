export interface Todo {
  id: string;
  title: string;
  url: string;
  category: string;
  dueDate: Date;
  completed: boolean;
  pdfFile?: File;
}

export interface Category {
  id: string;
  name: string;
  color: string;
} 