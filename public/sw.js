
self.addEventListener('push', event => {
    console.log('プッシュメッセージを受信しました。')
 
    let data = { title: '新しいお知らせ', body: 'サーバーからメッセージが届きました。' }
    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data.body = event.data.text();
        }
    }
 
    const options = {
        body: data.body,
        icon: '/images/icon-192x192.png', // 通知に表示するアイコン
        badge: '/images/badge-72x72.png', // Androidでステータスバーに表示される小さなアイコン
        data: {
            url: data.url || '/' // 通知クリック時の遷移先URL
        }
    }

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    )
})