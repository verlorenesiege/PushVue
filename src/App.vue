<script setup lang="ts">
import {ref, onMounted } from "vue"
import axios from 'axios'
import { register } from 'register-service-worker'

import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'

const text = ref("")

  onMounted(() => {

     /**
      * 購読処理
      */
     /* @ts-ignore  */
    document.getElementById('subscribe-button').addEventListener('click', async () => {
        try {
          /* @ts-ignore  */
          const permission = await Notification.requestPermission()
          if (permission === 'granted') {
            console.log('通知の許可が得られました。')
            // 次のステップ：Service Workerを登録し、購読処理へ進む
            subscribeUser();
          } else {
            console.log('通知が拒否されました。');
          }
        } catch (error) {
          console.error('通知許可の取得中にエラーが発生しました:', error);
        }
    })



  })

  function urlBase64ToUint8Array(base64String: string) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
  }  
  const subscribeUser = async () => {
      const responnse = await axios.get("/api/vapidPublicKey")
      const vapidPublicKey = await responnse.data
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey)
      console.log('convertedVapidKey: ', convertedVapidKey)

      try {
          const registration = await navigator.serviceWorker.ready
          console.log('registration: ', registration)
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey
          })

          console.log('プッシュサービスへの購読に成功しました:', subscription);

          // 購読情報をサーバーに送信して保存
          await sendSubscriptionToServer(subscription);
      } catch (error) {
          console.error('プッシュサービスの購読に失敗しました:');
          console.error(error);
      }


  }
  async function sendSubscriptionToServer(subscription:PushSubscription) {
      console.log(subscription.toJSON())
      const endpoint = subscription.endpoint
      const p256dh = btoa((String.fromCharCode.apply(null, Array.from(new Uint8Array(subscription.getKey('p256dh')!)))).replace(/\+/g, '-').replace(/\//g, '_'))
      const auth = btoa((String.fromCharCode.apply(null, Array.from(new Uint8Array(subscription.getKey('auth')!)))).replace(/\+/g, '-').replace(/\//g, '_'))
      let data:any = {
          user: "miya",
          subscription: {
              endpoint: endpoint,
              expirationTime: null,
              keys:{
                  p256dh: p256dh,
                  auth: auth.toString(),
              }
          }
      }

      console.log(data)
      console.log(JSON.stringify(data))

      axios.post('/api/subscription', data , {
        headers: {'Content-Type': 'application/json',},
      }).then((res) => {
          console.log('subscriptionに成功しました:');
      }).catch((err) =>{
          console.error('subscriptionに失敗しました:');
      })
      /**
      axios.get("/api/subscription?name=Miya")
        .then((response:any ) => {
            console.log(response.data)
            text.value = response.data
      })
      await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });
      */
  }
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld :msg="text" />
      <button id='subscribe-button'>購読</button>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
