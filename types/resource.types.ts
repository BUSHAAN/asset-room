export interface Resource {
  _id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  previewImage?: string | null;
  createdAt?: any;
  updatedAt?: any;
}

export interface ResourceInput {
  title: string;
  url: string;
  description: string;
  tags: string[];
}