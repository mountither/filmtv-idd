import firebaseConfig, { firestore } from "@/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

firebaseConfig;

const auth = getAuth();

type UserType = {
  user: Array<any> | undefined;
  loadingUser: boolean;
  errorUser: string | undefined;
};

const state = {
  user: undefined,
  loadingUser: true,
  errorUser: undefined,
};

export default {
  state,
  mutations: {
    setUser(state: UserType, payload: any) {
      state.user = payload;
    },
    setUserLoading(state: UserType, payload: any) {
      state.loadingUser = payload;
    },
    setUserError(state: UserType, payload: any) {
      state.errorUser = payload;
    },
    clearError(state: UserType) {
      state.errorUser = undefined;
    },
  },
  actions: {
    async registerUser({ commit }: { commit: any }, payload: any) {
      try {
        commit("setUserLoading", true);

        commit("clearError");
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          payload.email,
          payload.password
        );

        const user = userCredential.user;
        await updateProfile(user, {
          displayName: payload.displayName,
        });
        await setDoc(doc(firestore, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          photoUrl: user.photoURL,
        });
        const newUser = {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          photoUrl: user.photoURL,
        };

        commit("setUser", newUser);
        commit("setUserLoading", false);
      } catch (error: any) {
        commit("setUserError", error.code);
        commit("setUserLoading", false);
      }
    },
    async signInUser({ commit }: { commit: any }, payload: any) {
      try {
        commit("setUserLoading", true);

        commit("clearError");

        const userCredential = await signInWithEmailAndPassword(
          auth,
          payload.email,
          payload.password
        );

        const user = userCredential.user;
        const newUser = {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          photoUrl: user.photoURL,
        };
        commit("setUser", newUser);
        commit("setUserLoading", false);
      } catch (error: any) {
        commit("setUserLoading", false);
        commit("setUserError", error.code);
        console.log(error.code);
      }
    },
    autoSignIn({ commit }: { commit: any }, payload: any) {
      commit("setUserLoading",true);

      commit("setUser", {
        id: payload.uid,
        name: payload.displayName,
        email: payload.email,
        photoUrl: payload.photoURL,
      });
      commit("setUserLoading", false);

    },
    clearUser({ commit }: { commit: any }) {
      commit("setUser", undefined);
    },
    async signOut({ commit, dispatch }: { commit: any; dispatch: any }) {
      try {
        await signOut(auth);
        commit("setUser", undefined);
        dispatch("clearUserWatchlist");
      } catch (error : any) {
        commit("setUserLoading", false);
        commit("setUserError", error.code);
      }
    },
  },
  getters: {
    user(state: UserType) {
      return state.user;
    },
    loadingUser(state: UserType) {
      return state.loadingUser;
    },
    errorUser(state: UserType) {
      return state.errorUser;
    },
  },
};
