# Skinet
Things you need to do in order to run the application on your local machine:

1. In the /API folder run following command:
  - `dotnet watch run`

2. Run the docker containers
  - Postgresql database
  - Redis server
  - Adminer
  - Redis commander

3. Run the Stripe CLI in order to accpet payments. Go to the Stripe folder and run following command:
  - ./stripe.exe listen -f https://localhost:7283/api/payment/webhook -e payment_intent.succeeded,payment_intent.payment_failed
  
More information can be found in the inner README.md files per subfolder (API and Stripe each contains one)
