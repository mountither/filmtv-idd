import { getAuth, type UserCredential, type UserInfo } from "firebase/auth";
import type { ToastPluginApi } from "vue-toast-notification";
import { currentUser, firestore } from "@/firebaseConfig";
import {
  deleteField,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
  setDoc,
} from "@firebase/firestore";
import { store } from "@/store";
import type { MediaTypes } from "../types";
import type { Ref } from "vue";
import { watchEffect } from "vue";

const isUserWatchlistIncludeMedia = (data: any, id: string): boolean => {
  return data.hasOwnProperty(id);
};

export default function useManipulateUserWatchlist(
  toastInstance: ToastPluginApi,
  showNoAccessModal: Ref<boolean>,
  isMediaAddedToWl: Ref<boolean>,
  isProcessingWatchlistItem: Ref<boolean>,
  isErrorWl: Ref<boolean>,
  mediaInfo: {
    id: string | number | undefined;
    title: string | undefined;
    type: MediaTypes | undefined;
  }
) {
  const mediaIdentifier = `${mediaInfo.id}-${mediaInfo.type}`;

  const checkMediaInWatchlist = () => {
    isMediaAddedToWl.value = isUserWatchlistIncludeMedia(
      store.getters.userWatchlist,
      mediaIdentifier
    );
    isProcessingWatchlistItem.value = false;
  };

  const manipulateUserWatchlist = async () => {
    try {
      const userId = getAuth().currentUser?.uid;

      if (!userId) {
        showNoAccessModal.value = true;
        return;
      }
      isProcessingWatchlistItem.value = true;

      //* get ref to wl document and check if exists. if doc exists update doc, else set doc with new media.
      const docRef = doc(firestore, "watchlists", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap?.data()?.primary) {
        //* check if item has already been added before.
        const isMediaExist = isUserWatchlistIncludeMedia(
          docSnap.data().primary,
          mediaIdentifier
        );

        //* when user clicks on item again, remove from watchlist
        if (isMediaExist) {
          await updateDoc(doc(firestore, "watchlists", userId), {
            [`primary.${mediaIdentifier}`]: deleteField(),
          });

          toastInstance.open({
            message: `${mediaInfo.title} was removed from your watchlist.`,
            type: "info",
          });
        } else {
          await updateDoc(doc(firestore, "watchlists", userId), {
            [`primary.${mediaIdentifier}`]: {
              id: mediaInfo.id,
              mediaType: mediaInfo.type,
              date_added: Timestamp.now(),
            },
          });

          toastInstance.open({
            message: `Successfully added ${mediaInfo.title} to your watchlist.`,
            type: "success",
          });
        }
      } else {
        //* since theres no documnet, make a new one with the media item.
        await setDoc(doc(firestore, "watchlists", userId), {
          primary: {
            [`${mediaIdentifier}`]: {
              id: mediaInfo.id,
              mediaType: mediaInfo.type,
              date_added: Timestamp.now(),
            },
          },
        });
        toastInstance.open({
          message: `Successfully added ${mediaInfo.title} to your watchlist.`,
          type: "success",
        });
      }

      //* fetch user watchlist data. sync store with fs database
      store.dispatch("fetchUserWatchlist");
    } catch (error) {
      console.log(error);
      isErrorWl.value = true;
      toastInstance.open({
        message: "Failed to add to your watchlist, please try again.",
        type: "error",
      });
      isProcessingWatchlistItem.value = false;
    }
  };

  return { manipulateUserWatchlist, checkMediaInWatchlist };
}
