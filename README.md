# Skinet

Skinet is a e-commerce web application build with Angular and C#7.0. This store contain fake products. It is not possible to buy those products. The payment system is a simmulation of a real world implementation.

Things you need to do in order to run the application on your local machine:

1. In order to download all the node packages, run following command at rool level (/skinet): `npm install`.

2. Run the docker containers. At rool level (/skinet) run the following command: `docker-compose up -d` to download and run the containers.
  - Postgresql database
  - Redis server
  - Adminer
  - Redis commander

3. Run the Stripe CLI in order to accpet payments. Go to the Stripe folder and run following command:
  - ./stripe.exe listen -f https://localhost:7283/api/payment/webhook -e payment_intent.succeeded,payment_intent.payment_failed

4. In the /API folder run following command:
  - `dotnet watch run`
  
In order to place a payment you can use a fake Stripe card with following number: 4242 4242 4242 4242. You can choose the other card information details. 
  
More information can be found in the inner README.md files per subfolder (API and Stripe each contains one)
