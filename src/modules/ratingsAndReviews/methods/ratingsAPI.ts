import { firestore } from "@/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  Timestamp,
  updateDoc,
  query,
  where,
  getDocs,
} from "@firebase/firestore";
import type { UserRatingInfoInDb } from "../types";

//! Read Operations
export const fetchUserMediaRating = async ({
  mediaIdentifier,
  userId,
}: {
  mediaIdentifier: string;
  userId: string;
}): Promise<UserRatingInfoInDb> => {
  try {
    const ratingDocRef = collection(firestore, "ratings");
    const mediaRatingQuery = query(
      ratingDocRef,
      where("author_id", "==", userId),
      where("mediaId", "==", mediaIdentifier)
    );

    const querySnapshot = await getDocs(mediaRatingQuery);

    let docId;
    let rating;
    querySnapshot.forEach((doc) => {
      docId = doc?.id || undefined;
      rating = doc.data().rating || 0;
    });
    return {
      isExists: !querySnapshot.empty,
      id: docId,
      rating,
    };
  } catch (error) {
    throw Error();
  }
};

export const fetchMediaVoteAverage = async ({
  mediaIdentifier,
}: {
  mediaIdentifier: string;
}): Promise<number> => {
  try {
    const ratingDocRef = collection(firestore, "ratings");
    const mediaRatingQuery = query(
      ratingDocRef,
      where("mediaId", "==", mediaIdentifier)
    );

    const querySnapshot = await getDocs(mediaRatingQuery);
    let totalRating: number = 0;
    querySnapshot.forEach((doc) => {
      totalRating += doc.data().rating;
    });

    return totalRating / querySnapshot.size;
  } catch (error) {
    throw Error();
  }
};


//! Write/Update Operations
export const updateRating = async ({
  rating,
  docId,
}: {
  rating: number;
  docId: string | undefined;
}) => {
  try {
    //@ts-ignore
    const ratingRef = doc(firestore, "ratings", docId);

    await updateDoc(ratingRef, {
      rating,
    });
  } catch (error) {
    throw Error();
  }
};

export const addNewRating = async ({
  userId,
  mediaIdentifier,
  rating,
}: {
  userId: string;
  mediaIdentifier: string;
  rating: number;
}) => {
  try {
    const ratingDocRef = collection(firestore, "ratings");

    await addDoc(ratingDocRef, {
      author_id: userId,
      //   author: this.userRef,
      created_at: Timestamp.now(),
      mediaId: mediaIdentifier,
      rating: rating,
    });
  } catch (error) {
    throw Error();
  }
};
