/**
 * YouTube Data API v3 응답 타입 정의
 *
 * 공식 문서: https://developers.google.com/youtube/v3/docs
 */

// Videos: list API 응답
export interface YouTubeVideoResponse {
  kind: string;
  etag: string;
  items: YouTubeVideo[];
  pageInfo?: {
    totalResults: number;
    resultsPerPage: number;
  };
}

export interface YouTubeVideo {
  kind: string;
  etag: string;
  id: string;
  snippet?: VideoSnippet;
  contentDetails?: VideoContentDetails;
  statistics?: VideoStatistics;
  status?: VideoStatus;
}

export interface VideoSnippet {
  publishedAt: string; // ISO 8601 날짜
  channelId: string;
  title: string;
  description: string;
  thumbnails: Thumbnails;
  channelTitle: string;
  tags?: string[];
  categoryId?: string;
  liveBroadcastContent?: string;
  defaultLanguage?: string;
  localized?: {
    title: string;
    description: string;
  };
  defaultAudioLanguage?: string;
}

export interface VideoContentDetails {
  duration: string; // ISO 8601 형식 (예: PT15M33S)
  dimension: string; // "2d" | "3d"
  definition: string; // "hd" | "sd"
  caption: string; // "true" | "false"
  licensedContent: boolean;
  projection: string; // "rectangular" | "360"
}

export interface VideoStatistics {
  viewCount: string;
  likeCount?: string;
  dislikeCount?: string;
  favoriteCount?: string;
  commentCount?: string;
}

export interface VideoStatus {
  uploadStatus?: string;
  privacyStatus?: string;
  license?: string;
  embeddable?: boolean;
  publicStatsViewable?: boolean;
  madeForKids?: boolean;
}

export interface Thumbnails {
  default?: ThumbnailDetails;
  medium?: ThumbnailDetails;
  high?: ThumbnailDetails;
  standard?: ThumbnailDetails;
  maxres?: ThumbnailDetails;
}

export interface ThumbnailDetails {
  url: string;
  width: number;
  height: number;
}

// Channels: list API 응답
export interface YouTubeChannelResponse {
  kind: string;
  etag: string;
  items: YouTubeChannel[];
  pageInfo?: {
    totalResults: number;
    resultsPerPage: number;
  };
}

export interface YouTubeChannel {
  kind: string;
  etag: string;
  id: string;
  snippet?: ChannelSnippet;
  contentDetails?: ChannelContentDetails;
  statistics?: ChannelStatistics;
  status?: ChannelStatus;
}

export interface ChannelSnippet {
  title: string;
  description: string;
  customUrl?: string;
  publishedAt: string;
  thumbnails: Thumbnails;
  defaultLanguage?: string;
  localized?: {
    title: string;
    description: string;
  };
  country?: string;
}

export interface ChannelContentDetails {
  relatedPlaylists: {
    likes?: string;
    favorites?: string;
    uploads?: string;
  };
}

export interface ChannelStatistics {
  viewCount: string;
  subscriberCount: string;
  hiddenSubscriberCount: boolean;
  videoCount: string;
}

export interface ChannelStatus {
  privacyStatus?: string;
  isLinked?: boolean;
  longUploadsStatus?: string;
  madeForKids?: boolean;
}

export interface ChannelInfo {
  subscriberCount: number;
  verificationStatus: string;
  channelImageUrl: string;
}

// 에러 응답
export interface YouTubeAPIError {
  error: {
    code: number;
    message: string;
    errors: Array<{
      message: string;
      domain: string;
      reason: string;
    }>;
  };
}
