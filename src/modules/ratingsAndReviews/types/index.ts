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

