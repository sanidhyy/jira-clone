import { type Models } from 'node-appwrite';

export type Workspace = Models.Document & {
  name: string;
  imageId?: string;
  imageUrl?: string;
  userId: string;
  inviteCode: string;
};
