var $_jq = jQuery.noConflict();

var Payment360 = {

	// Properties
	publishableKey : null,
	endpoint : null,

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
			$_jq('.p360-spinner').show();

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
					$_jq('.p360-spinner').hide();
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
				successCallback(r);
			} else {
				failCallback(r);
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

};

var _p360init = function() {
	$_jq('.p360-spinner').hide();
};

$_jq(document).ready(_p360init);

