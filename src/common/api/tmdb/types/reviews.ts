export interface ReviewsTypes {
  id?: number;
  page?: number;
  results?: Result[];
  total_pages?: number;
  total_results?: number;
}

export interface Result {
  author?: string;
  author_id?: string;
  mediaId?: string;
  author_details?: AuthorDetails;
  content?: string;
  created_at?: string;
  title?: string;
  id?: string;
  updated_at?: string;
  url?: string;
  rating?: number | undefined;
  has_spoilers?: boolean;
  is_local?: boolean;
}

export interface AuthorDetails {
  name?: string;
  username?: string;
  avatar_path?: string | undefined;
  rating?: number | undefined;
}
