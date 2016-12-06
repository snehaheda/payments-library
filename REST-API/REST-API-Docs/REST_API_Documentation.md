# Current working functionality for the REST API

The purpose of the REST API is to create and retrieve payment360 records, as well as perform various actions (capture, retrieve, etc).
In order to use the REST API you need to expose the __REST_API_v1__ class to your REST webservice user.
You also need to grant acceess rights to the used p360 sObjects. Please see the __Setting up and test__ document for details.

## Endpoints

There are 2 endpoints:

Public: https://<YOUR_FORCE_DOT_COM_URL>/<YOUR_SITE_LABEL>/services/apexrest/v1
Private: https://<YOUR_ORG_URL>/services/apexrest/v1

The difference between these 2 endpoints that you can access the public one WITHOUT oAuth authentication, while the second one is available only for an authenticated users.

### Public endpoint

The primary use case for the public endpoint is to register a new Payment Method, and possibly capture a transaction.
Because you can use this endpoint without an authentication, it is safe to implement a call on the front-end. However, as this is a publicly accessible endpoint, only some actions are available. You can't perform ANY actions from the public endoint which touches any existing P360 records. (Payment Method linking to existing Customers/Contact doesn't count if you already have the Id's of the existing records)

In order to set up the public endpoint, create a public site (Setup | Site) and grant acces to your Guest User to the __REST_API_v1__ class and objects.

### Private Endpoint

The purpose of the private endpoint is to perform actions which are dealing with existing p360 data. As this data is sensible, you always need to authenticate yourself before performing actions.

P360 private endpoint is a standard force.com webservice, so you can use one of the available oAuth authentication flows. Please see the documentation here:

https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_what_is_rest_api.htm
https://developer.salesforce.com/page/Digging_Deeper_into_OAuth_2.0_on_Force.com

In order to set up this endpoint, you need to set up a Connected App and make sure that your authenticated user has access to the __REST_API_v1__ class and paymentt360 objects. 


## Payload

* Both p360 endoints accept HTTP POST calls. 
* In the body you need to provide a valid JSON string.
* If this is a call to the private endpoint, you need the provide an `Authorization: Bearer <YOUR ACCESS_KEY>` header (please see the force.com documentation on oAuth flow for details).
* Every payload should include an 'action' property. This property tells the REST API, what action to perform.

Example call to the public endpoint:

```
{
	"action" : "createPaymentMethod",
	"paymentGatewayId" : "a0141000001jhoh"
	"stripePayload" : "{\"id\":\"tok_19AkExDXJoGaqeOAHLrQSufI\",\"object\":\"token\",\"card\":{\"id\":\"card_19AkExDXJoGaqeOA9NDGpROK\",\"object\":\"card\",\"address_city\":null,\"address_country\":null,\"address_line1\":null,\"address_line1_check\":null,\"address_line2\":null,\"address_state\":null,\"address_zip\":null,\"address_zip_check\":null,\"brand\":\"Visa\",\"country\":\"US\",\"cvc_check\":\"unchecked\",\"dynamic_last4\":null,\"exp_month\":11,\"exp_year\":2019,\"funding\":\"credit\",\"last4\":\"4242\",\"metadata\":{},\"name\":\"sdada\",\"tokenization_method\":null},\"client_ip\":\"188.143.37.52\",\"created\":1477937435,\"livemode\":false,\"type\":\"card\",\"used\":false}",
}
```


### The stripe.js payload (stripePayload parameter)

The Stripe Payload parameter used in __createPaymentMethod__ is returned by the stripe.js. Its purpose is to tokenize your customer's credit card data, so payment360's public endpoint doesn't handle directly with raw credit card data. You can think about this payload as a token.

It should have a specific format: a JSON object dumbed to a string. Please see the example above.

## The result

The result returned by the REST API is a JSON string with the following parameters:

* Boolean success
* String errorMessage
* String errorParam
* Tra[] transactionList
* PM[] paymentMethodList
* Customer[] customerList

Not every property is populated in every action.

An example result:

```
{
    "transactionList": [
        {
            "transactionStatus": "Completed",
            "transactionId": "a083600000Gn5rlAAB",
            "refundAmount": null,
            "paymentStatus": "Authorized",
            "paymentMethodId": "a013600000Ij3BfAAJ",
            "paymentGatewayId": "a003600000AjOeLAAV",
            "openOnly": false,
            "errorMessage": null,
            "dueDate": "2019-01-01",
            "customFieldMap": null,
            "authOnly": true,
            "amount": 111
        },
        {
            "transactionStatus": "Open",
            "transactionId": "a083600000Gn5rmAAB",
            "refundAmount": null,
            "paymentStatus": null,
            "paymentMethodId": "a013600000Ij3BfAAJ",
            "paymentGatewayId": "a003600000AjOeLAAV",
            "openOnly": true,
            "errorMessage": null,
            "dueDate": "2019-03-03",
            "customFieldMap": null,
            "authOnly": false,
            "amount": 55
        },
        {
            "transactionStatus": "Completed",
            "transactionId": "a083600000Gn5rnAAB",
            "refundAmount": null,
            "paymentStatus": "Captured",
            "paymentMethodId": "a013600000Ij3BfAAJ",
            "paymentGatewayId": "a003600000AjOeLAAV",
            "openOnly": false,
            "errorMessage": null,
            "dueDate": null,
            "customFieldMap": null,
            "authOnly": false,
            "amount": 77
        }
    ],
    "success": true,
    "paymentMethodList": [
        {
            "transactionList": null,
            "stripePayload": null,
            "status": "Valid",
            "publishableKey": null,
            "paymentMethodId": "a013600000Ij3BfAAJ",
            "paymentGatewayId": "a003600000AjOeLAAV",
            "matchByEmail": null,
            "last4": "4242",
            "holderName": "Holder Maki",
            "expYear": "2019",
            "expMonth": "5",
            "email": null,
            "customFieldMap": null,
            "customerId": "a053600000HbMpUAAV",
            "contactId": null,
            "brand": "Visa",
            "addressStreet": "Add l. 1",
            "addressPostalCode": "1234",
            "addressCountry": "Hungary",
            "addressCity": "Budapest",
            "accountId": null
        }
    ],
    "errorParam": null,
    "errorMessage": null,
    "customerList": null
}
```

### Success and error handling

The __success__ property is always provided by the REST API. If it equals true, than the action was performed properly, and you should receive your data in the corresponding properties. 

If the __success__ parameter equals false, than your action was not successful. You should get an error message in the __errorMessage__ property, and the __errorParam__ propery usually gives you some clue about the wrong parameter.

### Payment Method List
The API returns a list of successfully created Payment Methods in the __paymentMethodList__ property. For most of the actions this is a single Payment Method.

### Transaction List

The API returns a list of successfully created Transactions in the __transactionList__ property. Not that these Transactions can be in _Open_, _Authorized_ or _Charged_ property.

### Customer List

The API returns a list of successfully created Stripe Customers in the __customerList__ property. You can't add a Payment Method without creating a Stripe Customer, so if you are not linking your Payment Method to an existing Stripe Customer, it is automatically created.

##  Actions

Every request should have an __action__ parameter. This parameter tells the API what to do. Every action has it's list of required and optional parameters (so they are vary with the action).

### createPaymentMethod

Currently the __createPaymentMethod__ is the only available action on the public endpoint. You can create a new Payment Method, link it to a Contact, Account or Stripe Customer. 

Optionally, you can add one or more Transactions to the newly created Payment Method. These Transaction(s) can be in Open status (so charged later), Authorized or charged immediately.

It is important to understand that you can not pass directly credit card data to your endpoint. Instead, you are retrieving a JSON token from stripe.js and passing this data as the __stripePayload__ parameter. This way credit card data doesn't travel through a possibly insecure network or code. 


Params:

* __action__ : required, always equals `createPaymentMethod`.
* __paymentGatewayId__ : required. The SF Id of your Payment Gateway. This represents your Stripe Account.
* __publishableKey__ : optional. Instead of __paymentGatewayId__ you can provide this property of the Payment Gateway.
* __stripePayload__ : required. String representation value of the JSON object returned by stripe.js
* __email__ : optional. The customer's email. If provided, this email is set on the newly created Stripe Customer.
* __contactId__ : optional. The customer's Contact id. The Payment Method will be linked to this Contact.
* __accountId__ : optional. The customer's Account id. The Payment Method will be linked to this Account.
* __customerId__ : optional The customer's String Customer id. The Payment Method will be linked to this Stripe Customer, so no new Stripe Customer is created. The Stripe Customer should exist on the same Payment Gateway which you are using in this call.

#### Examples

Creating a new Payment Method. No charges.
```
{
    "action": "createPaymentMethod",
    "paymentGatewayId": "a003600000AjOeL",
    "stripePayload": "{\"id\":\"tok_19NftIDXJoGaqeOAok9pc4oY\",\"object\":\"token\",\"card\":{\"id\":\"card_19NftIDXJoGaqeOAkW7uEBa3\",\"object\":\"card\",\"address_city\":\"Budapest\",\"address_country\":\"Hungary\",\"address_line1\":\"Add l. 1\",\"address_line1_check\":\"unchecked\",\"address_line2\":null,\"address_state\":null,\"address_zip\":\"1234\",\"address_zip_check\":\"unchecked\",\"brand\":\"Visa\",\"country\":\"US\",\"cvc_check\":\"unchecked\",\"dynamic_last4\":null,\"exp_month\":5,\"exp_year\":2019,\"funding\":\"credit\",\"last4\":\"4242\",\"metadata\":{},\"name\":\"Holder Maki\",\"tokenization_method\":null},\"client_ip\":\"94.21.254.28\",\"created\":1481018980,\"livemode\":false,\"type\":\"card\",\"used\":false}"
}
```


Creating a new Payment Method and connecting to an existing Stripe Customer.

```
{
    "action": "createPaymentMethod",
    "paymentGatewayId": "a003600000AjOeL",
    "customerId": "a053600000HbCTiAAN",
    "stripePayload": "{\"id\":\"tok_19NftODXJoGaqeOAKIU8S1if\",\"object\":\"token\",\"card\":{\"id\":\"card_19NftODXJoGaqeOA8AgWiOZr\",\"object\":\"card\",\"address_city\":\"Budapest\",\"address_country\":\"Hungary\",\"address_line1\":\"Add l. 1\",\"address_line1_check\":\"unchecked\",\"address_line2\":null,\"address_state\":null,\"address_zip\":\"1234\",\"address_zip_check\":\"unchecked\",\"brand\":\"Visa\",\"country\":\"US\",\"cvc_check\":\"unchecked\",\"dynamic_last4\":null,\"exp_month\":5,\"exp_year\":2019,\"funding\":\"credit\",\"last4\":\"4242\",\"metadata\":{},\"name\":\"Holder Maki\",\"tokenization_method\":null},\"client_ip\":\"94.21.254.28\",\"created\":1481018986,\"livemode\":false,\"type\":\"card\",\"used\":false}"
}
```


Creating a new Payment Method and connecting it to a Contact.

```
{
    "action": "createPaymentMethod",
    "paymentGatewayId": "a003600000AjOeL",
    "contactId": "0033600000JHribAAD",
    "stripePayload": "{\"id\":\"tok_19NftQDXJoGaqeOA7rY3Rss8\",\"object\":\"token\",\"card\":{\"id\":\"card_19NftQDXJoGaqeOApBD6xhfI\",\"object\":\"card\",\"address_city\":\"Budapest\",\"address_country\":\"Hungary\",\"address_line1\":\"Add l. 1\",\"address_line1_check\":\"unchecked\",\"address_line2\":null,\"address_state\":null,\"address_zip\":\"1234\",\"address_zip_check\":\"unchecked\",\"brand\":\"Visa\",\"country\":\"US\",\"cvc_check\":\"unchecked\",\"dynamic_last4\":null,\"exp_month\":5,\"exp_year\":2019,\"funding\":\"credit\",\"last4\":\"4242\",\"metadata\":{},\"name\":\"Holder Maki\",\"tokenization_method\":null},\"client_ip\":\"94.21.254.28\",\"created\":1481018988,\"livemode\":false,\"type\":\"card\",\"used\":false}"
}
```


Creating a new Payment Method and charging it.


```
{
    "action": "createPaymentMethod",
    "paymentGatewayId": "a003600000AjOeL",
    "transactionList": [
        {
            "amount": 100
        }
    ],
    "stripePayload": "{\"id\":\"tok_19NftUDXJoGaqeOAt4NYdA1O\",\"object\":\"token\",\"card\":{\"id\":\"card_19NftUDXJoGaqeOA08ug7x36\",\"object\":\"card\",\"address_city\":\"Budapest\",\"address_country\":\"Hungary\",\"address_line1\":\"Add l. 1\",\"address_line1_check\":\"unchecked\",\"address_line2\":null,\"address_state\":null,\"address_zip\":\"1234\",\"address_zip_check\":\"unchecked\",\"brand\":\"Visa\",\"country\":\"US\",\"cvc_check\":\"unchecked\",\"dynamic_last4\":null,\"exp_month\":5,\"exp_year\":2019,\"funding\":\"credit\",\"last4\":\"4242\",\"metadata\":{},\"name\":\"Holder Maki\",\"tokenization_method\":null},\"client_ip\":\"94.21.254.28\",\"created\":1481018992,\"livemode\":false,\"type\":\"card\",\"used\":false}"
}
```


Creating a new Payment Method and creating a Transaction which will be charged in the future.

```
{
    "action": "createPaymentMethod",
    "paymentGatewayId": "a003600000AjOeL",
    "transactionList": [
        {
            "amount": 100,
            "dueDate": "2019-12-31",
            "openOnly": true
        }
    ],
    "stripePayload": "{\"id\":\"tok_19NftaDXJoGaqeOAt1pllkR3\",\"object\":\"token\",\"card\":{\"id\":\"card_19NftaDXJoGaqeOAzjXPWPu9\",\"object\":\"card\",\"address_city\":\"Budapest\",\"address_country\":\"Hungary\",\"address_line1\":\"Add l. 1\",\"address_line1_check\":\"unchecked\",\"address_line2\":null,\"address_state\":null,\"address_zip\":\"1234\",\"address_zip_check\":\"unchecked\",\"brand\":\"Visa\",\"country\":\"US\",\"cvc_check\":\"unchecked\",\"dynamic_last4\":null,\"exp_month\":5,\"exp_year\":2019,\"funding\":\"credit\",\"last4\":\"4242\",\"metadata\":{},\"name\":\"Holder Maki\",\"tokenization_method\":null},\"client_ip\":\"94.21.254.28\",\"created\":1481018998,\"livemode\":false,\"type\":\"card\",\"used\":false}"
}
```


Creating a new Payment Method and creating 3 Transactions. First one is authorized only, the second one will be charged in the future, and the third one is charged immediatelly.

```
{
    "action": "createPaymentMethod",
    "paymentGatewayId": "a003600000AjOeL",
    "transactionList": [
        {
            "amount": 111,
            "dueDate": "2019-1-1",
            "authOnly": true
        },
        {
            "amount": 55,
            "dueDate": "2019-3-3",
            "openOnly": true
        },
        {
            "amount": 77
        }
    ],
    "stripePayload": "{\"id\":\"tok_19NftkDXJoGaqeOAxA4r211C\",\"object\":\"token\",\"card\":{\"id\":\"card_19NftkDXJoGaqeOAaHJO8cZx\",\"object\":\"card\",\"address_city\":\"Budapest\",\"address_country\":\"Hungary\",\"address_line1\":\"Add l. 1\",\"address_line1_check\":\"unchecked\",\"address_line2\":null,\"address_state\":null,\"address_zip\":\"1234\",\"address_zip_check\":\"unchecked\",\"brand\":\"Visa\",\"country\":\"US\",\"cvc_check\":\"unchecked\",\"dynamic_last4\":null,\"exp_month\":5,\"exp_year\":2019,\"funding\":\"credit\",\"last4\":\"4242\",\"metadata\":{},\"name\":\"Holder Maki\",\"tokenization_method\":null},\"client_ip\":\"94.21.254.28\",\"created\":1481019008,\"livemode\":false,\"type\":\"card\",\"used\":false}"
}
```







