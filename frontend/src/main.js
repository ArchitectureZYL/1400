import './assets/main.css'
import router from './router';
import {
  createApp
} from 'vue'
import App from './App.vue';
import axios from 'axios';


const app = createApp(App)
app.use(router)
app.use(axios)
app.mount('#app')