# What this repo is about

This is an example for a "Hosted Fields" client for using Google Pay on a Braintree account.

# Setup

- Install Node if you don't have it - https://nodejs.org/en/download/.
- This client relies on the matching server found at https://github.com/juan-m-medina/bt-test-server.
- Clone the repo to a location of your choice.
- Create a ```config.json``` file to the url/endpoint for the server you are using. Example for TEST below. For PRODUCTION make sure to update the values accordingly.
  ```
  config = {  
    "environment": "TEST", 
    "merchantId": "_type_here_your_google_merchant_id_can_be_empty_on_test_",
    "tokenEndpoint": "http://localhost:8000/token",  
    "customerEndpoint": "http://localhost:8000/customer"
  }  
  ```
- Run `npx http-server`. This should install all the necessary node dependencies
- You should get output that looks something like this:
  ```
  ❯ npx http-server
  npx: installed 23 in 3.044s
  Starting up http-server, serving ./
  Available on:
    http://192.168.0.1:8080
    http://10.0.0.22:8080
    http://127.0.0.1:8080
    http://172.22.144.1:8080
  Hit CTRL-C to stop the server  
  ```
- Open your browser to any of the addresses listed on your "Available on:" list.

# Relevant Documentation

- Braintree Hosted Fields overview: https://developers.braintreepayments.com/guides/hosted-fields/overview/javascript/v3
- Google Pay Web Documentation: https://developers.google.com/pay/api/web/overview