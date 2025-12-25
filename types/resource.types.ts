export interface Resource {
  _id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  createdAt?: any;
  updatedAt?: any;
}

export interface ResourceInput {
  title: string;
  url: string;
  description: string;
  tags: string[];
}