async function getToken() {
  try {
    const response = await fetch('http://localhost:8000/token');
    const tokenData = await response.json();
    return tokenData.clientToken;
  } catch (error) {
    alert('Error getting client token - ' + error);
  }
}

getToken().then(async (client_token) => {
  const paymentsClient = new google.payments.api.PaymentsClient({
    environment: 'TEST' // FOR PRODUCIION SET TO  'PRODUCTION'
  });

  const clientInstance = await braintree.client.create({
    authorization: client_token
  });
  
  const googlePaymentInstance = await braintree.googlePayment.create({
    client: clientInstance,
    googlePayVersion: 2,
    googleMerchantId: null // FOR PRODUCITON NEEDS THE MERCHANT ID POPULATED HERE!
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

  const resultData = document.querySelector('#result-data');
  const customerData = document.querySelector('#customer-data');

  // const buttonClickHandler = async function (event) {
  const buttonClickHandler = async function (event) {
    event.preventDefault();

    var paymentDataRequest = googlePaymentInstance.createPaymentDataRequest({
      transactionInfo: {
        currencyCode: 'USD',
        totalPriceStatus: 'FINAL',
        totalPrice: '1.00' // Your amount
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

    paymentsClient.loadPaymentData(paymentDataRequest)
    .then(function (paymentData) {
      return googlePaymentInstance.parseResponse(paymentData);
    }).then(function (result) {
      resultData.value = JSON.stringify(result, null, 2);
      return fetch('http://localhost:8000/customer', {
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
    }).catch(function (err) {
      alert('Failure ' + err);
    });
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
