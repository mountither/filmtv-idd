import "@/assets/css/main.min.css";

import "vue-skeletor/dist/vue-skeletor.css";
import "viewerjs/dist/viewer.css";
import "vue-toast-notification/dist/theme-sugar.css";
import "@vueform/slider/themes/default.css";
import "vue-select/dist/vue-select.css";

import { library } from "@fortawesome/fontawesome-svg-core";

import { createApp } from "vue";
import App from "./App.vue";
import { store } from "./store";

import router from "./router";
import MainLayout from "./common/layouts/MainLayout.vue";
import { Skeletor } from "vue-skeletor";
import axios from "axios";
import VueAxios from "vue-axios";
import { RouterLink } from "vue-router";
import VueViewer from "v-viewer";
import vfmPlugin from "vue-final-modal";
import VueToast from "vue-toast-notification";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faAdd,
  faCheck,
  faExclamationTriangle,
  faClose,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { faTwitter, faGoogle } from "@fortawesome/free-brands-svg-icons";
import FloatingVue from "floating-vue";
import "floating-vue/dist/style.css";
//@ts-ignore
import VueCollapsiblePanel from "@dafcoe/vue-collapsible-panel";
import { ObserveVisibility } from "vue-observe-visibility";


//* firebase auth
import { getAuth } from "firebase/auth";

getAuth().onAuthStateChanged(async (user) => {
  console.log("onAuthStateChanged");
  if (user) {
    await store.dispatch("autoSignIn", user);
    //* fetch current user's watchlist and store it.
    await store.dispatch("fetchUserWatchlist");
  } else {
    store.dispatch("clearUser");
    store.dispatch("clearUserWatchlist");
    store.commit("setUserLoading", false);
  }
});

const app = createApp(App);

library.add(
  faAdd,
  faGoogle,
  faTwitter,
  faCheck,
  faExclamationTriangle,
  faClose,
  faFilter
);
app.directive("observe-visibility", ObserveVisibility);
app.component("font-awesome-icon", FontAwesomeIcon);

app.component(`main-layout`, MainLayout);
app.component("skeletor", Skeletor);
app.component("router-link", RouterLink);

app.use(router);
app.use(store);
app.use(VueAxios, axios);
app.use(VueViewer);
app.use(vfmPlugin);
app.use(VueToast, {
  position: "top",
});
app.use(VueCollapsiblePanel);
app.use(FloatingVue);

app.mount("#app");

import "bootstrap/dist/js/bootstrap.js";
