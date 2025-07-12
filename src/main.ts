import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app');

(async () =>{
      if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Workerが正常に登録されました。スコープ:', registration.scope);
        return registration;
      } catch (error) {
        console.error('Service Workerの登録に失敗しました:', error);
      }
    } else {
      console.log('このブラウザはService Workerをサポートしていません。');
    }   
})()
