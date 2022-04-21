import { createStore, createLogger } from "vuex";
import Auth from "./auth";
import Watchlist from "./watchlist";


export const store = createStore({
  modules: {
    Auth,
    Watchlist
  },
  plugins: [createLogger()],
});