How to run the Stripe CLI locally
=================================

#### Execute following command in order to listen to a specific API endpoint:

Documentation: [https://dashboard.stripe.com/test/webhooks/](https://dashboard.stripe.com/test/webhooks/)

Information: To hit this endpoint, the strip cli need to **run**. To test you can set up a local listner with the endpoint URL that matches this method post route. You will need to add a local listener on the stripe website (Developers > Webhooks > Add local listener) that matches with your api post route.

*   \-f = forward
*   \-e = events

**Command:**

./stripe.exe listen -f https://localhost:7283/api/payment/webhook -e payment_intent.succeeded,payment_intent.payment_failed