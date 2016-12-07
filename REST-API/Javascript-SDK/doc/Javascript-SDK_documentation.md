# payment360 front-end SDK

__payment360 front-end SDK__ makes easy to implement common payment use-cases on websites.


## Setting up the payment360 SDK

There are a couple of prerequisites.

You need need to include the following Javascript scripts in your site (probably in the _head_ section)

```
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script src="https://js.stripe.com/v2/"></script>
<script src="https://checkout.stripe.com/checkout.js"></script>
<script src="./p360-sdk.js"></script>
```

* You need to inclued jQuery
* You need to include stripe checkout only if you want to use the checkout flow

## Using stripe checkout flow

You can use stripe checkout with payment360 SDK. https://stripe.com/checkout
With stripe checkout you don't need to worry about the form itself, as it is managed by the code provided by stripe.
However, passing the credit card token to Salesforce and charging the Transaction is managed by payment360.

### Example

```
<button onclick="popCheckout();">Pay</button>

<script>
	var success = function(r) {}
	var fail = function(r) {}

	var popCheckout = function() {
		Payment360.popStripeCheckout('Product', 'Description', 115.81, 'logo.png', success, fail);
	}

	Payment360.setPublishableKey('pk_test_rx6uxcAgv6PZM2LuH7TL9imW');
	Payment360.setEndpoint('https://maki-dev-developer-edition.na30.force.com/services/apexrest/bt_stripe/v1');
</script>
```

1. `Payment360.setPublishableKey` sets your Payment Gateway's publishable key
2. `Payment360.setEndpoint` sets the URL of the payment360 REST API in your Salesforce org
3. `Payment360.popStripeCheckout` pops the payment form. List of parameters:
 ..1. Product Name
 ..2. Product Description
 ..3. Price
 ..4. Logo url
 ..5. Success callback function
 ..6. Failure callback function



