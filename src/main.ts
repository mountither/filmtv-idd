import "@/assets/css/main.min.css";

import "vue-skeletor/dist/vue-skeletor.css";

import { library } from "@fortawesome/fontawesome-svg-core";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import MainLayout from "./common/layouts/MainLayout.vue";
import { Skeletor } from "vue-skeletor";

import axios from 'axios'
import VueAxios from 'vue-axios'
import { RouterLink } from 'vue-router';

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
library.add(faAdd);

const app = createApp(App);


app.component("font-awesome-icon", FontAwesomeIcon);
app.component(`main-layout`, MainLayout);
app.component("skeletor", Skeletor);
app.component("router-link", RouterLink);


app.use(router);
app.use(VueAxios, axios)

app.mount("#app");

import "bootstrap/dist/js/bootstrap.js";
