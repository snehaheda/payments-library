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
	1. Product Name
	2. Product Description
	3. Amount
	4. Logo url
	5. Success callback function
	6. Failure callback function

Note that on callback functions getting the full response object from payment360 REST API, so you can process further the result.

## Using the custom form flow

With the custom form flow you can use your own design on the payment form.
1. You should use the standard html `form` tag on your form.
2. You should add a `p360-form` to your form, so the SDK know which form to process.
3. There should be a `<input type="submit" />` tag on your form.
4. You should add the following fields
	* Holder Name
	* Card Number
	* Expiration Month
	* Expiration Year
	* CVC
5. You are setting the input field with th `data-p360` property. For example, on the card number input field you should includ the `data-p360="number"` property.

### Example

```
<form class="p360-form p360-hide-on-result">
		<div>
			<label>
				Holder Name
				<input type="text" data-p360="name" />
			</label>
		</div>

		<div>
			<label>
				Card Number
				<input type="text" data-p360="number" />
			</label>
		</div>

		<div>
			<label>
				Expiration Month
				<input type="text" data-p360="exp_month" />
			</label>
		</div>

		<div>
			<label>
				Expiration Year
				<input type="text" data-p360="exp_year" />
			</label>
		</div>

		<div>
			<label>
				CVC
				<input type="text" data-p360="cvc" />
			</label>
		</div>

		<div>
			<label>
				Email
				<input type="text" data-p360="email" />
			</label>
		</div>

		<div>
			<input type="submit" />
		</div>

</form>

<script>
	Payment360.setPublishableKey('pk_test_rx6uxcAgv6PZM2LuH7TL9imW');
	Payment360.setEndpoint('https://maki-dev-developer-edition.na30.force.com/services/apexrest/bt_stripe/v1');
	Payment360.useCustomForm(200, success, fail);	
</script>
```

1. `Payment360.setPublishableKey` sets your Payment Gateway's publishable key
2. `Payment360.setEndpoint` sets the URL of the payment360 REST API in your Salesforce org
3. `Payment360.useCustomForm` tells the payment360 SDK to use the customer form. Parameters:
	1. Amount
	2. Success callback
	3. Failure callback

## Using the pre-built form

payment360 SDK can build a payment form dynamically inside a specified HTML `div` element.

NEED TO BE IMPLEMENTED


# CSS Classes

The payment360 SDK provides CSS classes, so you can easily set which elements to show or hide on different steps of the payment process. For example, you can set what kind of spinner show when the payment data is processed.

## p360-spinner

This element is shown when the SDK is communicating with the server, i.e. loading. By default it's hidden.

## p360-hide-on-load

This element is hidden when the SDK is communicating with the server. By default it's shown.

## p360-hide-on-result

This element is hidden when the payment got a result (successful is failed). By default it's shown.

## p360-success

This element is shown on a successful payment. By default it's hidden.

## p360-fail

This element is shown on a failed payment. By default it's hidden.


## p360-error

This should be an empty HTML node, a `div` or a `span`. If there is a failure or an error, the error is shown in this element as simple text.


## Example

```
	<div class="p360-hide-on-load p360-hide-on-result">
		<button onclick="popCheckout();">Pay</button>
	</div>

	<div class="p360-spinner">
		<!-- This div is shown on loading -->
		<img src="https://d13yacurqjgara.cloudfront.net/users/82092/screenshots/1073359/spinner.gif" style="width: 40px" />
	</div>

	<div class="p360-success">
		<!-- This div is shown on success -->
		This was a successful payment.
	</div>

	<div class="p360-fail">
		<!-- This div is shown on fail -->
		Your payment is failed.
		<p/>
		<span class="p360-error" />
	</div>
```



