require('dotenv').config();
const Koa = require('koa');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');
const { PubSub } = require('@google-cloud/pubsub');


const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SCOPES, HOST } = process.env;

const app = new Koa();

app.use(session(app));
app.keys = [SHOPIFY_API_SECRET];

app.use(
  createShopifyAuth({
    apiKey: SHOPIFY_API_KEY,
    secret: SHOPIFY_API_SECRET,
    scopes: SCOPES.split(','),
    afterAuth(ctx) {
      const { shop, accessToken } = ctx.session;
      ctx.redirect('/');
    },
  }),
);

app.listen(5000, () => {
  console.log('App is running on port 3000');
});

const pubsub = new PubSub({
  keyFilename: '/shopify-app-testing-repo/testing-node-app/service account key pubsub/shopify-app-deployment-74fc6f8b07bd.json',
});

// Access environment variables
const pubsubCredentials = process.env.PUBSUB_CREDENTIALS;
const topicName = process.env.PUBSUB_TOPIC;
const subscriptionName = process.env.PUBSUB_SUBSCRIPTION;