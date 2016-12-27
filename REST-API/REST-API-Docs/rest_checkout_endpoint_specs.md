# Specs for the Payment Request REST endpoint 

This is a single endpoint for passing payment request data for PAYMENT360.
This endpoint runs as a public site on behalf of the guest user.
All data is passed in a single POST call in format `application/json`


## URL conventions

`https://org_url/public_site_name/services/apexrest/bt_stripe/checkout`

## Object descriptions

### The __Transaction__ object

* __paymentGatewayId__
* __amount__ Amount of the transaction (currently only in USD until multi-currency is supported)
* __currencyISO__ Currency ISO
* __authOnly__ If true, will create an auth only transaction.
* __openOnly__ If true, will not charge the transaction.
* __dueDate__ Due date of the transaction, in YYYY-MM-DD format.
* __transactionId__ Transaction Id -- if this is an existing record. Used only in private mode.
* __paymentMethodId__ The associated PM Id. Used only in private mode. 
* __transactionStatus__ -- Read only field
* __paymentStatus__ -- Read only field
* __customFieldMap__ A key/value map for any other maps to be populated. 
* __refundAmount__ -- Amount to refund. Used only in refund context.


### The __Customer__ object

* __paymentGatewayId__
* __name__ - updateable
* __email__ - updateable
* __id__
* __contactId__ 
* __accountId__
* __created__
* __customFieldMap__ A key/value map for any other maps to be populated. 

### The __Payment Method__ object

* __holderName__
* __email__
* __expMonth__ - updateable
* __expYear__ - updateable
* __last4__
* __status__
* __brand__
* __customerId__ -- Stripe Customer Id. If passed, don't pass contactId and/or accountId
* __contactId__
* __accountId__
* __addressStreet__
* __addressCity__
* __addressPostalCode__
* __addressCountry__
* __stripePayload__ The payload returned by stripe.js. For format see section _Stripe Payload Sample_. A JSON dumped to a string.
* __paymentGatewayId__ Payment Gateway or publishable key are required. Only one of them should be passed.
* __publishableKey__ This key can be found on your Payment Gateway record in Salesforce. This is not a key from the Stripe Dashboard.
* __matchByEmail__ If set to True, matches to an existing customer based on email
* __customFieldMap__ A key/value map for any other maps to be populated. 
* __transactionList__ List of Transaction records. 
* __paymentMethodId__ Id of the PM record.

### The return object
All the actions return this object. The fields are populated in context of the given action.

### Properties
* __success__
* __errorMessage__
* __errorParam__
* __transactionList__ List of Transactions
* __paymentMethodList__ The Payment Method record
* __customerList__ The Stripe Customer record


# Public Actions
(available without oauth authentication)

Action names are passed in the `action` param.

### createPaymentMethod
Creates a new PM from a stripe.js payload.

Accepts a single __Payment Method__ object.

#### Params

The following field are accepted from the object:

* __stripePayload__
* __customerId__ -- Stripe Customer Id. If passed, don't pass contactId and/or accountId
* __contactId__
* __accountId__
* __paymentGatewayId__ Payment Gateway or publishable key are required. Only one of them should be passed.
* __publishableKey__ This key can be found on your Payment Gateway record in Salesforce. This is not a key from the Stripe Dashboard.
* __matchByEmail__ if set to True, matches to an existing customer based on email
* __customFieldMap__ A key/value map for any other maps to be populated. 
* __transactionList__ list of Transaction records. If a __transactionList__ param provided, creates and links the transaction(s) to the PM. If the Transactions doesn't have the __openOnly__ param set to __true__, the transaction will be charged immediately.
* __email__ Email of the customer

# Private actions
(available with oauth authentication)

## Specs for the private checkout REST endpoint

This endpoint is available using an oAuth token.

## Actions

### getPaymentMethods

Lists all the PMs for a given stripe customer / account / contact

#### Params

* __paymentMethodId__[]
* __customerId__[] Stripe Customer Id. If passed, don't pass contactId and/or accountId
* __accountId__[]
* __contactId__[]

You can provide ONLY ONE of these parameters.
All the parameters are a list. Returns all the matching PMs (i.e. not only for a single customer).


### updatePaymentMethods

#### params

* __paymentMethodList__ -- List of PMs to update. Payment Method ID is required.

Updateable fields in the PM object:
* email
* expMonth
* expYear
* contactId
* accountId
* addressStreet
* addressCity
* addressPostalCode
* addressCountry
* addressState
* customFieldMap


### deletePaymentMethods

* __paymentMethodList__ -- List of PMs to update. Payment Method ID is required.

### createTransactions

Creates a transaction assigned to an already existing PM. You SHOULD provide a __paymentMethodId__ your transactions.

#### Params

* __transactionList__ -- List of transactions to create.

### getTransactions

Lists transactions. 

* __paymentMethodId[]__ * -- PMId of the transactions to list
* __transactionId[]__ * 
* __transactionStatus[]__ *
* __dueDate__ { value, condition = "eq/gt/lt"}



### captureTransactions

Charges an already existing transaction.

Lists transactions. You SHOULD provide a __id__

In order to authorize only the open transaction, use the __authOnly__ flag.

#### Params

* __transactionList__ -- List of transactions to create.

### refundTransactions

Refunds transactions. You need to provide a __id__ on transactions. If __refundAmount__ is provided on transactions, a partial refund will be created.

#### Params

* __transactionList__ -- List of transactions to create

### getCustomers

You can query customer by the following parameters:
* __id__
* __email__
* __accountId__
* __contactId__

### createCustomers

### updateCustomers

### deleteTransaction

## Stripe Payload Sample
```
{
  "id": "tok_18rSYFDXJoGaqeOAr9RlV0nP",
  "object": "token",
  "card": {
    "id": "card_18rSYFDXJoGaqeOAHmq37sAi",
    "object": "card",
    "address_city": "Budapest",
    "address_country": "Hungary",
    "address_line1": "oleh 22",
    "address_line1_check": "pass",
    "address_line2": null,
    "address_state": "BU",
    "address_zip": "1111",
    "address_zip_check": "pass",
    "brand": "Visa",
    "country": "US",
    "cvc_check": "pass",
    "dynamic_last4": null,
    "exp_month": 11,
    "exp_year": 2019,
    "funding": "credit",
    "last4": "4242",
    "metadata": {},
    "name": "a",
    "tokenization_method": null
  },
  "client_ip": "188.143.23.177",
  "created": 1473341207,
  "email": "ahaha@xxx.xxx.hu",
  "livemode": false,
  "type": "card",
  "used": false
}
```