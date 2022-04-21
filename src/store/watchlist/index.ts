import { firestore } from "@/firebaseConfig";
import { doc, getDoc } from "@firebase/firestore";

type WatchlistStoreType = {
  error: string | undefined;
  loading: boolean;
  data: Array<any> | undefined;
  total: Number | undefined;
};

const state: WatchlistStoreType = {
  error: undefined,
  loading: true,
  data: undefined,
  total: undefined,
};

export default {
  state,
  mutations: {
    setUserWatchlist(state: WatchlistStoreType, payload: any) {
      state.data = payload;
    },
    setWatchlistError(state: WatchlistStoreType, payload: any) {
      state.error = payload;
    },
    setWatchlistLoading(state: WatchlistStoreType, payload: any) {
      state.loading = payload;
    },
    setWatchlistTotal(state: WatchlistStoreType, payload: any) {
      state.total = payload;
    },
  },
  actions: {
    async fetchUserWatchlist({
      commit,
      getters,
    }: {
      commit: any;
      getters: any;
    }) {
      try {
        commit("setWatchlistError", undefined);
        commit("setWatchlistLoading", true);

        if (!getters.user) {
          throw Error("User is not logged in");
        }
        const docRef = doc(firestore, "watchlists", getters.user.id);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data()?.primary;

        if (!data) {
          throw Error("User watchlist data does not exist");
        }

        commit("setUserWatchlist", data);
        commit("setWatchlistTotal", Object.keys(data).length);
        commit("setWatchlistLoading", false);
      } catch (error) {
        console.log(error);
        commit("setWatchlistError", error);
        commit("setWatchlistLoading", false);
      }
    },
    clearUserWatchlist({ commit }: { commit: any }) {
      commit("setUserWatchlist", undefined);
    },
  },
  getters: {
    userWatchlist(state: WatchlistStoreType) {
      return state.data;
    },
    userWatchlistError(state: WatchlistStoreType) {
      return state.error;
    },
    userWatchlistLoading(state: WatchlistStoreType) {
      return state.loading;
    },
    userWatchlistTotal(state: WatchlistStoreType) {
      return state.total;
    },
  },
};
