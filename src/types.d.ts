declare module '*.png' {
  const value: import('react-native').ImageSourcePropType;
  export default value;
}

declare module '*.jpg' {
  const value: import('react-native').ImageSourcePropType;
  export default value;
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  createdAt?: string;
}

// Category types
export interface Category {
  $id: string;
  name?: string;
  title?: string;
  label?: string;
  order?: number;
  $createdAt?: string;
  $updatedAt?: string;
  [key: string]: unknown;
}

// Content types
export interface Content {
  $id: string;
  title: string;
  role?: string;
  category?: string | Category;
  type: string;
  transcripts?: string[];
  images?: string[];
  files?: string[];
  tasks?: string[];
  $createdAt?: string;
  $updatedAt?: string;
  [key: string]: unknown;
}

