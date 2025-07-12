const { app } = require('@azure/functions');

const { NotificationHubsClient,  createAppleInstallation } = require ("@azure/notification-hubs")

const CONNECT_STRING = 'Endpoint=sb://SampleNameSpase.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=4lYZKMd5THs9u8sC4I0nlGQqXObZyWZG/mOI+DoWgSU='
const HUB_NAME= 'SampleHub1'
const client = new NotificationHubsClient(CONNECT_STRING, HUB_NAME);

app.http('subscription', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const reqJson = await request.json()
        console.log(reqJson)
        try {
            console.log("NotificationHubsClient success")
            const userId = reqJson.userId
            const subscription = reqJson.subscription

            // Web Push (ブラウザ) のための登録オブジェクトを作成
            const registration = {
                // endpoint, p256dh, authはブラウザから取得したPushSubscriptionのキー
                endpoint: subscription.endpoint,
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
                tags: [`user:${userId}`], // ユーザーIDなどでタグ付け
            }
            console.log("registration ----------------------------------------------")
            console.log(registration)
            // 登録を作成または更新
            const result = await client.createOrUpdateRegistration({
                // 登録IDはendpointを元に一意に生成するのが一般的
                registrationId: Buffer.from(subscription.endpoint).toString("base64"),
                body: registration,
            });
            console.log("✅ デバイスの登録に成功:", result.registrationId);
            res.status(200).json({ status: "success", registrationId: result.registrationId });
            return { status:200, body: { status: "success", registrationId: result.registrationId }}
        } catch (error) {
            console.log("NotificationHubsClient error")
            console.log(error)
            return { status:500, body: "Failed to register device."};
        }
        //const name = request.query.get('name') || await request.text() || 'world';

    }
});
