var Payment360 = {

	// objects
	//////////

	PaymentMethod : function() {
		this.paymentGatewayId = null;
		this.publishableKey = null;
		this.customerId = null;
		this.accountId = null;
		this.stripePayload = null;
		this.email = null;
		this.transactionList = [];
	},

	Transaction : function() {
		this.amount = null;
		this.dueDate = null;
		this.authOnly = null;
		this.openOnly = null;
	},

	// methods
	//////////

	setPublishableKey : function(publishableKey) {
		Payment360.publishableKey = publishableKey;
	},

	popStripeCheckout : function(name, description, amount, image, callback) {
		var tokenCallback = function() {

		};
	
		var handler = new StripeCheckout.configure({
			key: Payment360.publishableKey,
			locale: 'auto',
			token: tokenCallback
		});

		handler.open({
			name: name,
			description: description,
			amount: amount * 100,
			image : image,
			billingAddress : true,	
		});


	},

	createPaymentMethod: function(stripePayload, transactions) {

	}

};

