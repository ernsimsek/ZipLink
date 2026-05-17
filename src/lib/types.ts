export interface ShortLink {
  id: string;
  slug: string;
  originalUrl: string;
  shortUrl: string;
  title?: string;
  clicks: number;
  createdAt: string;
  expiresAt?: string;
  customSlug?: boolean;
  tags?: string[];
  clickHistory?: { date: string; count: number }[];
  isActive: boolean;
  password?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  ownerId: string;
}

export interface CreateLinkParams {
  originalUrl: string;
  customSlug?: string;
  title?: string;
  expiresAt?: string;
  tags?: string[];
  password?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export type PublicLinkResponse = {
  slug: string;
  isActive: boolean;
  isExpired: boolean;
  hasPassword: boolean;
  originalUrl?: string;
};
