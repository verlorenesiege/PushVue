const { app } = require('@azure/functions');

const { NotificationHubsClient,  createAppleInstallation } = require ("@azure/notification-hubs")

const CONNECT_STRING = 'Endpoint=sb://SampleNameSpase.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=4lYZKMd5THs9u8sC4I0nlGQqXObZyWZG/mOI+DoWgSU='
const HUB_NAME= 'SampleHub1'

app.http('subscription', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const reqJson = await request.json()
        console.log(reqJson)
        try {
            const client = new NotificationHubsClient(CONNECT_STRING, HUB_NAME);
            console.log("NotificationHubsClient 初期化成功")
        } catch (error) {
            console.log("NotificationHubsClient 初期化失敗")
            console.log(error)
        }
        //const name = request.query.get('name') || await request.text() || 'world';

        return { body: `Hello, ${name}!` };
    }
});
