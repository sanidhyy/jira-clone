import { Models } from 'node-appwrite';

export enum MemberRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export type Member = Models.Document & {
  workspaceId: string;
  userId: string;
  role: MemberRole;
};
