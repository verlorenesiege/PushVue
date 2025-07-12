const { app } = require('@azure/functions');

app.http('vapidPublicKey', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {

        return { body: "BKaKZJ8JOvB8LvSUDh6b5UIi2rFrxYuxWnbC_kKj209fyemXJMwKsDpO-gXWFmc8p62EzDY5k7zfBnO5GmvvfFc" };
    }
});
