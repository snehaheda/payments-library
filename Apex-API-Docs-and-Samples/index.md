# payment360 Apex API

## Introduction

The purpose of the Apex API is to provide Salesforce developers classes and methods to manipulate payment methods, transactions and Stripe customers. The API is created in the form of a global Apex class, so it is available in your org if the payment360 package is installed.

## Structure
All of the classes are part of the `bt_stripe.P360_API_v1` class.

The following wrapper classes are available:

* `bt_stripe.Customer` represents a Customer in Stripe's database. Corresponds to the **bt_stripe__Stripe_Customer__c** object
* `bt_stripe.PM` represents Payment Method in Stripe's database. Corresponds to the **bt_stripe__Payment_Method__c** object
* `bt_stripe.Tra` represents Transaction in Stripe's database. Corresponds to the **bt_stripe__Transaction__c** object

You should create these objects using factory methods because the API class should register them in the background. Use the following factory methods:

* `bt_stripe.P360_API_v1.customerFactory()`
* `bt_stripe.P360_API_v1.paymentMethodFactory()`
* `bt_stripe.P360_API_v1.transactionFactory()`

After you create your entity objects and some actions, you need to commit your work using the following method:

`bt_stripe.P360_API_v1.commitWork()`

This call saves your work in existing or new SOQL objects. This is a DML operation, so make sure you don't make any HTTP callouts after making the commit call. Also, after the commit don't do any payment360 API actions -- this should be the last action in your executing context.

## A basic example

This code snippet creates a new Customer and adds a new Payment Method. Once the Payment Method is registered to Stripe, a new Transaction is created and captured.

Note that all the entities are created using the factory methods. You need to set all the required properties and after they are set, you can call action methods on them. For example `c.registerCustomer()` or `t.capture()`.

Also note that `bt_stripe.P360_API_v1.commitWork()` is happening as the very last action.

It is very important to catch the error. If some error happens (for example, a Payment Method can't be registered for some reason), the API is throwing a `bt_stripe.P360_API_v1.P360_Exception`. Catching the error can let you decide about the further flow of your business logic. 


```
		// You need to select a Payment Gateway.
		// It is important to set the paymentGatewayId property on all object instances.
		
		bt_stripe__Payment_Gateway__c[] pgList = [SELECT Id
													FROM bt_stripe__Payment_Gateway__c
													WHERE bt_stripe__Default__c = true];
		
		
		// It is a good practice to put your p360 action in a try block. If something goes wrong,
		// the API throws a bt_stripe.P360_API_v1.P360_Exception exception
		
		try {
		
			// You can initialize object instances using factory methods.
			
			bt_stripe.P360_API_v1.Customer c = bt_stripe.P360_API_v1.customerFactory();
			c.paymentGatewayId = pgList[0].Id;
			c.name = name;
			c.email = email;
			
			// After setting all the required properties you can call the action methods.
			
			c.registerCustomer();

			bt_stripe.P360_API_v1.PM pm = bt_stripe.P360_API_v1.paymentMethodFactory();
			pm.paymentGatewayId = pgList[0].Id;
			
			// Some properties are object instances. For example a bt_stripe.P360_API_v1.Customer object instance.
			
			pm.customer = c;
			pm.cardHolderName = name;
			pm.cardNumber = cardNumber;
			pm.cardExpYear = cardExpYear;
			pm.cardExpMonth = cardExpMonth;
			pm.cvv = cvc;
			pm.registerPM();


			bt_stripe.P360_API_v1.Tra t = bt_stripe.P360_API_v1.transactionFactory();
			t.paymentGatewayId = pgList[0].Id;
			t.pm = pm;
			t.amount = amount;
			t.capture();

			// It is important to call the commitWork() method after calling the action methods.
			// If you not call this method, the data IS NOT SAVED as SOQL in records.
			// Also, as this is a DML action, you can not do any HTTP callouts after this point.
		
			bt_stripe.P360_API_v1.commitWork();
			
		} catch(bt_stripe.P360_API_v1.P360_Exception e) {
			// Do something on errors
			system.debug(e.getMessage());
		}

```

## Classes

### bt_stripe.P360_API_v1.Customer

Represents a Stripe Customer

#### Initializing

Use the `customerFactory()` method.

* `bt_stripe.P360_API_v1.Customer c = bt_stripe.P360_API_v1.customerFactory();`

Creates an empty Customer class.

* `bt_stripe.P360_API_v1.Customer c = bt_stripe.P360_API_v1.customerFactory(stripeCustomerId);`

Creates a Customer class from an existing SOQL **bt_stripe__Stripe_Customer__c** object.

#### Properties

* __name__ Name of the Customer. Required.
* __email__ Email of the Customer.
* __paymentGatewayId__ Id of the Payment Gateway associated with the Stripe Customer. Required.
* __accountId__ Id of the Account associated with the Customer.
* __contactId__ Id of the Contact associated with the Customer.
* __record__ **bt_stripe__Stripe_Customer__c** record of the Customer. Available after calling the `registerCustomer()` method.

#### Actions

* `registerCustomer()` Registers the Customer in Stripe. After calling the method, __record__ property is available.

* `updateCustomer()` Need to implement.




### bt_stripe.P360_API_v1.PM

Represents a Stripe Payment Method (Works with credit cards only for now)

#### Initializing

Use the `paymentMethodFactory()` method.

* `bt_stripe.P360_API_v1.PM p = bt_stripe.P360_API_v1.paymentMethodFactory();`

Creates an empty PM class.

* `bt_stripe.P360_API_v1.PM p = bt_stripe.P360_API_v1.paymentMethodFactory(paymentMethodId);`

Creates a PM class from an existing SOQL **bt_stripe__Payment_Method__c** object.

#### Properties

* __customer__ reference to bt_stripe.P360_API_v1.Customer object for associating Payment Method to Customer. Required.
* __cardHolderName__ Name on the card. Required.
* __cardNumber__ The card number, as a string without any separators. Required.
* __cardExpYear__ Two or four digit number representing the card's expiration year. Required. 
* __cardExpMonth__ Two digit number representing the card's expiration month. Required.
* __cvv__ Card security code. Not required, but it is a good practive to always pass this property.
* __paymentGatewayId__ Id of the Payment Gateway associated with the Stripe Payment Method. Required.
* __record__ **bt_stripe__Payment_Method__c** record of the Payment Method. Available after calling the `registerPM()` method.

#### Actions

* `registerPM()` Registers the Payment Method in Stripe. After calling the method, __record__ property is available.

* `updatePM()` Need to implement.


### bt_stripe.P360_API_v1.Tra

Represents a Stripe Transaction

#### Initializing

Use the `transactionFactory()` method.

* `bt_stripe.P360_API_v1.Tra t = bt_stripe.P360_API_v1.transactionFactory();`

Creates an empty Tra class.

* `bt_stripe.P360_API_v1.Tra t = bt_stripe.P360_API_v1.transactionFactory(transId);`

Creates a Tra class from an existing SOQL **bt_stripe__Transaction__c** object.

#### Properties

* __pm__ reference to bt_stripe.P360_API_v1.PM object for associating Transaction to Payment Method. Required.
* __amount__ Decimal number representing how much to charge (in dollars). The smallest accepted amount is 0.05. Required.
* __dueDate__ Non-mandatory information, used by Payment360 app for auto-processing transactions on scheduled dates.
* __authOnly__ Boolean flag for creating authorize-only transaction. Default value is false.
* __paymentGatewayId__ Id of the Payment Gateway associated with the Stripe Transaction. Required.
* __record__ **bt_stripe__Transaction__c** record of the Payment Method. Available after calling the `register()` method.

#### Actions

* `register()` Registers an open transaction in Salesforce.com database without sending it to Stripe server. After calling the method, __record__ property is available.

* `authorize()` Authorizes a new or existing open transaction. Throws exception if transaction is already authorized or captured.

* `capture()` Captures a new or existing open/authorized transaction. Throws exception if transaction is already captured.

* `refund()` For making full refund on captured transaction. Need to implement.

* `refundAmount(Decimal refundAmount)` For making partial refund on captured transaction. Need to implement.

* `setParent(Schema.SObjectField field, Object value)` For associating transaction record to a parent SObject record. Need to implement.

### Examples

Example 1: creating a Stripe Customer

	try {
		bt_stripe.P360_API_v1.Customer c = bt_stripe.P360_API_v1.customerFactory();
		
		c.paymentGatewayId = pgList[0].Id;
		c.name = name;
		c.email = email;
		
		//optionally set AccountId and/or ContactId for associating new customer with
		c.accountId = accountId;
		c.contactId = contactId;
		
		//bt_stripe.P360_API_v1.P360_Exception if something goes wrong with creating customer in Stripe
		c.registerCustomer();
		
		//bt_stripe.P360_API_v1.P360_Exception if something goes wrong with committing records in database
		bt_stripe.P360_API_v1.commitWork();
	} catch (Exception ex) {
		//do error handling here
	}

Example 2: creating a Stripe Customer and Stripe Payment Method

	try {
		bt_stripe.P360_API_v1.Customer c = bt_stripe.P360_API_v1.customerFactory();
		
		c.paymentGatewayId = pgList[0].Id;
		c.name = name;
		c.email = email;
		//optionally set AccountId and/or ContactId for associating new customer with
		c.accountId = accountId;
		c.contactId = contactId;
		//bt_stripe.P360_API_v1.P360_Exception if something goes wrong with creating customer in Stripe
		c.registerCustomer();
		
		bt_stripe.P360_API_v1.PM pm = bt_stripe.P360_API_v1.paymentMethodFactory();
		pm.paymentGatewayId = pgList[0].Id;
		pm.customer = c;
		pm.cardHolderName = 'test customer';
		pm.cardNumber = '4242424242424242';
		pm.cardExpYear = '19';
		pm.cardExpMonth = '09';
		pm.cvv = '000';
		//bt_stripe.P360_API_v1.P360_Exception if something goes wrong with creating Payment Method in Stripe
		pm.registerPM();
		
		//bt_stripe.P360_API_v1.P360_Exception if something goes wrong with committing records in database
		bt_stripe.P360_API_v1.commitWork();
	} catch (Exception ex) {
		//do error handling here
	}

Example 3: creating a Stripe Customer, Stripe Payment Method and capture Stripe Transaction

	try {
		bt_stripe.P360_API_v1.Customer c = bt_stripe.P360_API_v1.customerFactory();
		
		c.paymentGatewayId = pgList[0].Id;
		c.name = name;
		c.email = email;
		//optionally set AccountId and/or ContactId for associating new customer with
		c.accountId = accountId;
		c.contactId = contactId;
		//bt_stripe.P360_API_v1.P360_Exception if something goes wrong with creating customer in Stripe
		c.registerCustomer();
		
		bt_stripe.P360_API_v1.PM pm = bt_stripe.P360_API_v1.paymentMethodFactory();
		pm.paymentGatewayId = pgList[0].Id;
		pm.customer = c;
		pm.cardHolderName = 'test customer';
		pm.cardNumber = '4242424242424242';
		pm.cardExpYear = '19';
		pm.cardExpMonth = '09';
		pm.cvv = '000';
		//bt_stripe.P360_API_v1.P360_Exception if something goes wrong with creating Payment Method in Stripe
		pm.registerPM();
		
		bt_stripe.P360_API_v1.Tra t = bt_stripe.P360_API_v1.transactionFactory();
		t.paymentGatewayId = pgList[0].Id;
		t.pm = pm;
		t.amount = 110.5;
		//bt_stripe.P360_API_v1.P360_Exception if something goes wrong with processing Transaction
		t.capture();
		
		//bt_stripe.P360_API_v1.P360_Exception if something goes wrong with committing records in database
		bt_stripe.P360_API_v1.commitWork();
	} catch (Exception ex) {
		//do error handling here
	}
	
Example 4: Creating Payment Method for existing Customer

	try {
		bt_stripe.P360_API_v1.Customer c = bt_stripe.P360_API_v1.customerFactory('0Xxxx0123afg');
		
		bt_stripe.P360_API_v1.PM pm = bt_stripe.P360_API_v1.paymentMethodFactory();
		pm.paymentGatewayId = pgList[0].Id;
		pm.customer = c;
		pm.cardHolderName = 'test customer';
		pm.cardNumber = '4242424242424242';
		pm.cardExpYear = '19';
		pm.cardExpMonth = '09';
		pm.cvv = '000';
		//bt_stripe.P360_API_v1.P360_Exception if something goes wrong with creating Payment Method in Stripe
		pm.registerPM();
		
		//bt_stripe.P360_API_v1.P360_Exception if something goes wrong with committing records in database
		bt_stripe.P360_API_v1.commitWork();
	} catch (Exception ex) {
		//do error handling here
	}
	
Example 5: Creating an Open transaction with existing Payment Method (and customer, as its associated with PM)

	try {
		bt_stripe.P360_API_v1.PM pm = bt_stripe.P360_API_v1.paymentMethodFactory('0Xxxx0123afg');
		
		bt_stripe.P360_API_v1.Tra t = bt_stripe.P360_API_v1.transactionFactory();
		t.paymentGatewayId = pgList[0].Id;
		t.pm = pm;
		t.amount = 110.5;
		t.register();
		
		//bt_stripe.P360_API_v1.P360_Exception if something goes wrong with committing records in database
		bt_stripe.P360_API_v1.commitWork();
	} catch (Exception ex) {
		//do error handling here
	}
	
Example 5: Authorizing an existing Open transaction

	try {
		bt_stripe.P360_API_v1.Tra t = bt_stripe.P360_API_v1.transactionFactory('0Xxxx0123afg');
		t.authorize();
		
		//bt_stripe.P360_API_v1.P360_Exception if something goes wrong with committing records in database
		bt_stripe.P360_API_v1.commitWork();
	} catch (Exception ex) {
		//do error handling here
	}
	
Example 6: Capturing an existing Open/Authorized transaction

	try {
		bt_stripe.P360_API_v1.Tra t = bt_stripe.P360_API_v1.transactionFactory('0Xxxx0123afg');
		t.capture();
		
		//bt_stripe.P360_API_v1.P360_Exception if something goes wrong with committing records in database
		bt_stripe.P360_API_v1.commitWork();
	} catch (Exception ex) {
		//do error handling here
	}
	
Example 7: Processing multiple transactions

	try {
		bt_stripe.P360_API_v1.PM pm = bt_stripe.P360_API_v1.paymentMethodFactory('0Xxxx0123afg');
		
		bt_stripe.P360_API_v1.Tra t1 = bt_stripe.P360_API_v1.transactionFactory();
		t1.paymentGatewayId = pgList[0].Id;
		t1.pm = pm;
		t1.amount = 110.5;
		t1.capture();
		
		bt_stripe.P360_API_v1.Tra t2 = bt_stripe.P360_API_v1.transactionFactory();
		t2.paymentGatewayId = pgList[0].Id;
		t2.pm = pm;
		t2.amount = 110.5;
		t2.capture();
		
		bt_stripe.P360_API_v1.Tra t3 = bt_stripe.P360_API_v1.transactionFactory();
		t3.paymentGatewayId = pgList[0].Id;
		t3.pm = pm;
		t3.amount = 110.5;
		t3.capture();
		
		//bt_stripe.P360_API_v1.P360_Exception if something goes wrong with committing records in database
		bt_stripe.P360_API_v1.commitWork();
	} catch (Exception ex) {
		//do error handling here
	}

Example 7: Error handling and partial commits

Each `registerCustomer()`, `registerPM()`, `capture()` and `authorize()` call is one webservice callout and is independent of each other. Therefore, its possible to handle error and perform partial commits to database.

	try {
		bt_stripe.P360_API_v1.PM pm = bt_stripe.P360_API_v1.paymentMethodFactory('0Xxxx0123afg');
		
		try {
			bt_stripe.P360_API_v1.Tra t1 = bt_stripe.P360_API_v1.transactionFactory();
			t1.paymentGatewayId = pgList[0].Id;
			t1.pm = pm;
			t1.amount = 110.5;
			t1.capture();
		} catch (Exception ex) {
			//do error handling here
		}
		
		try {
			bt_stripe.P360_API_v1.Tra t2 = bt_stripe.P360_API_v1.transactionFactory();
			t2.paymentGatewayId = pgList[0].Id;
			t2.pm = pm;
			t2.amount = 110.5;
			t2.capture();
		} catch (Exception ex) {
			//do error handling here
		}
		
		try {
			bt_stripe.P360_API_v1.Tra t3 = bt_stripe.P360_API_v1.transactionFactory();
			t3.paymentGatewayId = pgList[0].Id;
			t3.pm = pm;
			t3.amount = 110.5;
			t3.capture();
		} catch (Exception ex) {
			//do error handling here
		}
		
		//bt_stripe.P360_API_v1.P360_Exception if something goes wrong with committing records in database
		bt_stripe.P360_API_v1.commitWork();
	} catch (Exception ex) {
		//do error handling here
	}














