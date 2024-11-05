import { type Models } from 'node-appwrite';

export type Project = Models.Document & {
  name: string;
  imageId?: string;
  imageUrl?: string;
  workspaceId: string;
};
