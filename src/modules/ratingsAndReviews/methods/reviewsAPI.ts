import type { ReviewsTypes } from "@/common/api/tmdb/types/reviews";
import { firestore } from "@/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  Timestamp,
  query,
  where,
  getDocs,
  updateDoc,
  orderBy
} from "@firebase/firestore";
import type { UserReviewInfoInDb } from "../types";

//! Read Operations
export const fetchUserReview = async ({
  mediaIdentifier,
  userId,
}: {
  mediaIdentifier: string;
  userId: string;
}): Promise<UserReviewInfoInDb> => {
  try {
    const reviewsDocRef = collection(firestore, "reviews");
    const userMediaReviewsQuery = query(
      reviewsDocRef,
      where("author_id", "==", userId),
      where("mediaId", "==", mediaIdentifier)
    );

    const querySnapshot = await getDocs(userMediaReviewsQuery);

    let docId;
    let title;
    let content;
    let hasSpoilers;

    querySnapshot.forEach((doc) => {
      docId = doc?.id || undefined;
      title = doc.data().title || undefined;
      content = doc.data().content || undefined;
      hasSpoilers = doc.data().has_spoilers;
    });

    return {
      isExists: !querySnapshot.empty,
      id: docId,
      title,
      content,
      hasSpoilers,
    };
  } catch (error) {
    throw Error();
  }
};

export const fetchAllMediaReviews = async ({
  mediaIdentifier,
}: {
  mediaIdentifier: string;
}): Promise<ReviewsTypes["results"]> => {
  try {
    const reviewsDocRef = collection(firestore, "reviews");
    const mediaReviewsQuery = query(
      reviewsDocRef,
      where("mediaId", "==", mediaIdentifier),
      orderBy("created_at", "desc")
    );

    const querySnapshot = await getDocs(mediaReviewsQuery);

    let reviewData: any[] = [];
    querySnapshot.forEach((doc) => {
      reviewData.push({ id: doc.id, is_local: true, ...doc.data() });
    });

    return reviewData;
  } catch (error) {
    console.log(error)

    throw Error();
  }
};

//! Write/Update Operations
export const updateReview = async ({
  docId,
  title,
  content,
  hasSpoilers,
  rating,
}: {
  docId: string | undefined;
  title: string;
  content: string;
  hasSpoilers: boolean;
  rating: number;
}) => {
  try {
    if (!docId) {
      throw Error();
    }
    //@ts-ignore
    const reviewRef = doc(firestore, "reviews", docId);
    await updateDoc(reviewRef, {
      title: title,
      content: content,
      has_spoilers: hasSpoilers,
      updated_at: Timestamp.now(),
      rating: rating,
    });
  } catch (error) {
    throw Error();
  }
};

export const updateRatingInReviewDoc = async ({
  rating,
  docId,
}: {
  rating: number;
  docId: string | undefined;
}) => {
  try {
    //@ts-ignore
    const reviewRef = doc(firestore, "reviews", docId);
    await updateDoc(reviewRef, {
      rating,
    });
  } catch (error) {
    throw Error();
  }
};

export const addNewReview = async ({
  mediaIdentifier,
  title,
  content,
  hasSpoilers,
  rating,
  userId,
}: {
  mediaIdentifier: string;
  title: string;
  content: string;
  hasSpoilers: boolean | undefined;
  rating: number;
  userId: string;
}) => {
  try {
    const reviewDocRef = collection(firestore, "reviews");

    await addDoc(reviewDocRef, {
      title: title,
      content: content,
      has_spoilers: hasSpoilers || null,
      author_id: userId,
      mediaId: mediaIdentifier,
      updated_at: Timestamp.now(),
      created_at: Timestamp.now(),
      rating: rating,
    });
  } catch (error) {
    console.log(error);
    throw Error();
  }
};
