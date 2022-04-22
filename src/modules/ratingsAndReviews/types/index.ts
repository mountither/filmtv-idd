import type { Ref } from "vue";

export type UserReviewInfoInDb = {
  isExists: boolean;
  id: string | undefined;
  title: string | undefined;
  content: string | undefined;
  hasSpoilers: boolean | undefined;
};

export type UserRatingInfoInDb = {
  isExists: boolean;
  id: string | undefined;
  rating: number | undefined;
};

export type RatingForm = {
  rating: number;
};

export type ReviewForm = {
  title: string;
  content: string;
  hasSpoilers: boolean;
  rating: number;
};

export type RatingData = {
  mediaId: string | undefined;
  rating: number;
  mediaPoster: string | undefined;
  mediaTitle: string | undefined;
  ratedAt: string | undefined;
  mediaType: MediaTypes;
};

export type ReviewData = {
  title: string;
  reviewedAt: string;
  rating: number;
  content: string;
  mediaId: string;
  mediaType: MediaTypes;
  mediaTitle: string;
  mediaPoster: string;
  hasSpoilers: boolean;
};
