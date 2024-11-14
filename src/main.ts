import { createApp } from 'vue';
import './style.css';
import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/src/css/index.sass';
import { Quasar } from 'quasar';
import App from './App.vue';

const app = createApp(App);

app.use(Quasar, {
    plugins: {},
});

app.mount('#app');