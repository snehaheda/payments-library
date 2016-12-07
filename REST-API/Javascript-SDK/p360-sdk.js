var $_jq = jQuery.noConflict();

var Payment360 = {

	// Properties
	publishableKey : null,
	endpoint : null,
	amount : null,
	successCallback : null,
	failCallback : null,

	// objects
	//////////

	PaymentMethod : function() {
		this.paymentGatewayId = null;
		this.customerId = null;
		this.accountId = null;
		this.stripePayload = null;
		this.email = null;
		this.transactionList = [];

		/*
		* This is a call for the REST endpoint.
		*/
		this._createPaymentMethod = function(successCallback, failCallback) {

			var d = {
				action : 'createPaymentMethod',
				publishableKey : Payment360.publishableKey,
				customerId : this.customerId,
				accountId : this.accountId,
				stripePayload : this.stripePayload,
				email : this.email,
				transactionList : this.transactionList
			};

			var that = this;

			var evalClosure = function() {
				return function(r) {
					Payment360._disableButton(false);
					that._evalAPIReturn(r, successCallback, failCallback);
				};
			};

            $_jq.ajax({
                type : 'POST',
                url : Payment360.endpoint,
                headers : {
                    "content-type": "text/plain"
                },
                data : JSON.stringify(d),
                success : evalClosure()
            }); 

		};

		this._evalAPIReturn = function(r, successCallback, failCallback) {
			if (r.success === true) {
				Payment360._successAction(successCallback, r);
			} else {
				Payment360._failAction(failCallback, r);
			}
		};

	},

	Transaction : function() {
		this.amount = null;
		this.dueDate = null;
		this.authOnly = null;
		this.openOnly = null;
	},

	// public methods
	//////////


	/*
	* Sets the publishable key globally. This is required in order to do any action
	*/
	setPublishableKey : function(publishableKey) {
		Payment360.publishableKey = publishableKey;
	},

	setEndpoint : function(endpoint) {
		Payment360.endpoint = endpoint;
	},

	/*
	* Pops the Stripe Checkout form and charges the card immediatally.
	*/
	popStripeCheckout : function(name, description, amount, image, successCallback, failCallback) {
		
		var handler = new StripeCheckout.configure({
			key: Payment360.publishableKey,
			locale: 'auto',
			token: function(payload) {
				Payment360._toggleSpinner();
				Payment360._chargePayload(payload, amount, successCallback, failCallback);
			}
		});

		handler.open({
			name: name,
			description: description,
			amount: amount * 100,
			image : image,
			billingAddress : true,	
		});

	},

	/*
	* Binds the payment to the form selected by the 'p360-form' class
	*/
	useCustomForm : function(amount, successCallback, failCallback) {
		Payment360.amount = amount;
		Payment360.successCallback = successCallback;
		Payment360.failCallback = failCallback;

		$_jq('.p360-form').submit(Payment360._submitForm);
		$_jq('.p360-form').keyup(Payment360._validateForm);
		Payment360._disableButton(true);
	},

	// private methods
	//////////////////
	_chargePayload : function(payload, amount, successCallback, failCallback) {
		var tra = new Payment360.Transaction();
		tra.amount = amount;

		var pm = new Payment360.PaymentMethod();
		pm.publishableKey = this.publishableKey;
		pm.stripePayload = JSON.stringify(payload);
		pm.transactionList.push(tra);

		pm._createPaymentMethod(successCallback, failCallback);
	},

	_validateForm : function(e) {
		var formData = Payment360._extractDataFromForm();

		var valid = (
			formData.name.length > 0
			&& formData.number.length >= 15 && formData.number.length <= 16
			&& !isNaN(formData.exp_month) && formData.exp_month >= 1 && formData.exp_month <= 12
			&& !isNaN(formData.exp_year) && ((formData.exp_year >= 16 && formData.exp_year <= 50) || (formData.exp_year >= 2016 && formData.exp_year <= 2050))
			&& !isNaN(formData.cvc) && (formData.cvc.length == 3 || formData.cvc.length == 4)
		);

		Payment360._disableButton(!valid);
	},

	_submitForm : function(e) {
		e.preventDefault();
		Payment360._disableButton(true);
		Payment360._toggleSpinner();

		var formData = Payment360._extractDataFromForm();

		formData.email = undefined;

		Stripe.setPublishableKey(Payment360.publishableKey);
		Stripe.card.createToken(formData, function(status, response) {
			if (status != 200) {
				console.log(response);
				return;
			}
			Payment360._chargePayload(response, Payment360.amount, Payment360.successCallback, Payment360.failCallback);
		});

	},

	_extractDataFromForm : function() {
		var formData = {};
		$_jq('.p360-form').find(':input').each(function() {
			var fieldName = $_jq(this).attr('data-p360');
			if (fieldName !== undefined) {
				formData[fieldName] = $_jq(this).val();
			} 
		});
		return formData;
	},

	// private DOM actions
	////////////////

	_successAction(callback, r) {
		Payment360._toggleSpinner();
		$_jq('.p360-success').show();
		$_jq('.p360-hide-on-result').hide();
		callback(r);
	},

	_failAction(callback, r) {
		Payment360._toggleSpinner();
		$_jq('.p360-fail').show();
		$_jq('.p360-hide-on-result').hide();
		callback(r);
	},

	_disableButton(valid) {
		$_jq('.p360-form').find(':submit').prop('disabled', valid);
	},

	_toggleSpinner() {
		$_jq('.p360-spinner').toggle();
		$_jq('.p360-hide-on-load').toggle();
	},

};

var _p360init = function() {
	$_jq('.p360-spinner').hide();
	$_jq('.p360-success').hide();
	$_jq('.p360-fail').hide();
};

$_jq(document).ready(_p360init);

