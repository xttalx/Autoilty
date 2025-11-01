import { CountryCode } from '@/lib/countries';

export interface ForumUser {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  country?: CountryCode;
  joinDate: string;
  postCount?: number;
}

export interface ForumPost {
  id: string;
  threadId: string;
  userId: string;
  user: ForumUser;
  content: string;
  createdAt: string;
  updatedAt?: string;
  parentId?: string; // For threaded replies
  likes?: number;
  isEdited?: boolean;
  attachments?: string[];
}

export interface ForumThread {
  id: string;
  title: string;
  content: string;
  category: string;
  country: CountryCode;
  userId: string;
  user: ForumUser;
  createdAt: string;
  updatedAt?: string;
  viewCount: number;
  postCount: number;
  lastPost?: ForumPost;
  isPinned?: boolean;
  isLocked?: boolean;
  tags?: string[];
  listingId?: string; // Link to car listing
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  threadCount: number;
  postCount: number;
  country?: CountryCode;
}

