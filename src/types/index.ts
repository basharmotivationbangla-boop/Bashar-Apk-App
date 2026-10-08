export type AppStatus = 'published' | 'draft';

export interface AppItem {
  id: string;
  slug: string;
  name: string;
  iconUrl: string;
  apkFileUrl: string;
  apkFileName: string;
  apkFileSize: string; // e.g. "24.5 MB"
  shortDescription: string;
  fullDescription: string;
  version: string; // e.g. "v2.8.4"
  androidRequirement: string; // e.g. "Android 8.0+"
  developerName: string;
  developerWebsite?: string;
  developerEmail?: string;
  developerLogo?: string;
  categoryId: string;
  categoryName: string;
  subCategory?: string;
  packageName: string; // e.g. "com.bashar.app"
  releaseDate: string;
  lastUpdatedDate: string;
  downloadCount: number;
  rating: number; // e.g. 4.8
  ratingCount: number;
  screenshots: string[];
  featuredImage?: string;
  status: AppStatus;
  isFeatured: boolean;
  isPopular: boolean;
  isNew: boolean;
  tags: string[];
  features?: string[];
  whatsNew?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  sha256Checksum?: string;
  virusScanned?: boolean;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string; // Lucide icon name
  color: string;
  appCount?: number;
}

export interface WebsiteSettings {
  name: string;
  tagline: string;
  description: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  heroTitle: string;
  heroSubtitle: string;
  heroExploreText: string;
  heroLatestText: string;
  footerText: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    telegram?: string;
    youtube?: string;
    github?: string;
    linkedin?: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
  };
}

export interface DownloadRecord {
  id: string;
  appId: string;
  appName: string;
  timestamp: string;
  ip?: string;
  userAgent?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  status: 'unread' | 'read' | 'replied';
}

export interface ActivityLog {
  id: string;
  action: string;
  target: string;
  timestamp: string;
  details?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'superadmin' | 'admin';
  lastLogin?: string;
}

export interface AnalyticsSummary {
  totalApps: number;
  publishedApps: number;
  draftApps: number;
  totalDownloads: number;
  featuredApps: number;
  popularApps: number;
  totalCategories: number;
  recentDownloadsTimeline: { date: string; downloads: number }[];
  categoryBreakdown: { categoryName: string; count: number }[];
  topDownloadedApps: { id: string; name: string; downloads: number; iconUrl: string }[];
}
