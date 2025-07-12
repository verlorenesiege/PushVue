/**
console.log('serviceWorker start')
const swSelf = globalThis as unknown as ServiceWorkerGlobalScope;

swSelf.addEventListener("install", (event) => {
  event.waitUntil(swSelf.skipWaiting());
});


swSelf.addEventListener("push", (event) => {
    console.log('プッシュメッセージを受信しました。')
    let data = { title: '新しいお知らせ', body: 'サーバーからメッセージが届きました。', url: ''}
 if (event.data) {
   try {
     data = event.data.json() as any;
   } catch (e) {
     data.body = event.data.text();
   }
 }
 
 const options = {
   body: data.body,
   icon: '', // 通知に表示するアイコン
   badge: '', // Androidでステータスバーに表示される小さなアイコン
   data: {
     url: data.url || '/' // 通知クリック時の遷移先URL
   }
 };    
})

console.log('serviceWorker end')
 */
