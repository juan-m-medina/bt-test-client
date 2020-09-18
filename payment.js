async function getToken() {
  try {
    const response = await fetch(config.tokenEndpoint);
    const tokenData = await response.json();
    return tokenData.clientToken;
  } catch (error) {
    alert('Error getting client token - ' + error);
  }
}

loadPaymentData = function(googlePaymentInstance, paymentsClient, paymentDataRequest) {
  const resultData = document.querySelector('#result-data');
  const customerData = document.querySelector('#customer-data');

  paymentsClient.loadPaymentData(paymentDataRequest)
  .then(function (paymentData) {
    return googlePaymentInstance.parseResponse(paymentData);
  }).then(function (result) {
    resultData.value = JSON.stringify(result, null, 2);
    return fetch(config.customerEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({ "nonce": result.nonce })
    });
  }).then(function (data) {
    return data.json();
  }).then(function(data) {
    customerData.value = JSON.stringify(data, null, 2);
  }).catch(function (error) {
    alert('Failure ' + error.statusMessage);
  });
}


getToken().then(async (client_token) => {
  const paymentsClient = new google.payments.api.PaymentsClient({
    environment: config.environment
  });

  const clientInstance = await braintree.client.create({
    authorization: client_token
  });
  
  const googlePaymentInstance = await braintree.googlePayment.create({
    client: clientInstance,
    googlePayVersion: 2,
    googleMerchantId: config.merchantId // FOR PRODUCITON NEEDS THE MERCHANT ID POPULATED HERE!
  });
  
  const isReadyToPay = await paymentsClient.isReadyToPay({
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: googlePaymentInstance.createPaymentDataRequest().allowedPaymentMethods,
    existingPaymentMethodRequired: true // MAY NEED TO PLAY WITH THIS FOR A BRAND NEW GOOGLE PAY USER
  });

  if (!isReadyToPay.result) {
    throw 'Google Instance is not ready to Pay';
  }


  // const buttonClickHandler = async function (event) {
  const buttonClickHandler = async function (event) {
    event.preventDefault();

    var paymentDataRequest = googlePaymentInstance.createPaymentDataRequest({
      transactionInfo: {
        currencyCode: 'USD',
        totalPriceStatus: 'FINAL',
        totalPrice: '0.01' // Your amount
      }
    });

    var cardPaymentMethod = paymentDataRequest.allowedPaymentMethods[0];
    cardPaymentMethod.parameters.billingAddressRequired = true;
    // cardPaymentMethod.parameters.billingAddressParameters = {
    //   format: 'MIN'
    // };
    cardPaymentMethod.parameters.billingAddressParameters = {
      format: 'FULL'
    };

    loadPaymentData(googlePaymentInstance, paymentsClient, paymentDataRequest);
  };


  const buttonContainer = document.querySelector('#button-container');
  const button = paymentsClient.createButton({
    buttonType: 'long',
    onClick: buttonClickHandler
  });
  buttonContainer.appendChild(button);
}).catch((error) => {
  alert('Error processing payment - ' + error);
});
