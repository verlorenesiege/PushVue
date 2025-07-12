const { app } = require('@azure/functions');

const { NotificationHubsClient,  createTagExpression  } = require ("@azure/notification-hubs")

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
            const userId = reqJson.userId
            const subscription = reqJson.subscription
            const browserInstallation = {
                platform: "browser",
                installationId: Buffer.from(subscription.endpoint).toString("base64"),
                pushChannel: {
                    endpoint: subscription.endpoint,
                    p256dh: subscription.keys.p256dh,
                    auth: subscription.keys.auth,
                },
                tags: [`user:${userId}`],
                userId: userId,
            }
            const result =  await client.createOrUpdateInstallation(browserInstallation)
            console.log("result -----------------------------------------------------------------------")
            console.log(result)
 
            const resultInstallation = await client.getInstallation(browserInstallation.installationId)
            console.log("resultInstallation -----------------------------------------------------------------------")
            console.log(resultInstallation)

            //const tagExpression = `$UserId:${userId}`
            const tags = ["UserId", "userId"];
            const tagExpression = createTagExpression(tags);

            console.log(tagExpression)
            
            const sendResult = await client.sendNotification(
                {
                    platform: "browser",
                    body:"登録完了",
                    contentType: "text/plain;charset=utf-8",
                },
                {
                    tagExpression: tagExpression
                }
            )
            console.log("sendResult -----------------------------------------------------------------------")
            console.log(sendResult)
 
            console.log("createOrUpdateInstallation success :")
            //console.log(result);
            return { status:200, body: { status: "success", correlationId: result.correlationId }}
        } catch (error) {
            console.log("NotificationHubsClient error")
            console.log(error)
            return { status:500, body: "Failed to register device."};
        }
        //const name = request.query.get('name') || await request.text() || 'world';

    }
});
