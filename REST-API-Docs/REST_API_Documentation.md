# Current working functionality for the REST API

The purpose of the REST API is to create and retrieve payment360 records, as well as perform various actions (capture, retrieve, etc).
In order to use the REST API you need to expose the __REST_API_v1__ class to your REST webservice user.
You also need to grant acceess rights to the used p360 sObjects.

## Endpoints

There are 2 endpoints:

Public: https://<YOUR_FORCE_DOT_COM_URL>/<YOUR_SITE_LABEL>/services/apexrest/v1
Private: https://<YOUR_ORG_URL>/services/apexrest/v1

The difference between these 2 endpoints that you can access the public one WITHOUT oAuth authentication, while the second one is available only for an authenticated users.

### Public endpoint

The primary use case for the public endpoint is to register a new Payment Method, and possibly capture a transaction.
Because you can use this endpoint without an authentication, it is safe to implement a call on the front-end. However, as this is a publicly accessible endpoint, only some actions are available. You can't perform ANY actions from the public endoint which touches any existing P360 records. (Payment Method linking to existing Customers/Contact doesn't count)

In order to set up the public endpoint, create a public site (Setup | Site) and grant acces to your Guest User to the __REST_API_v1__ class and objects.

### Private Endpoint

The purpose of the private endpoint is to perform action which are dealing with existing p360 data. As this data is sensible, you always need to authenticate yourself before performing actions.

P360 private endpoint is a standard force.com webservice, so you can use one of the available oAuth authentication flows. Please see the documentation here:

https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_what_is_rest_api.htm
https://developer.salesforce.com/page/Digging_Deeper_into_OAuth_2.0_on_Force.com

In order to set up this endpoint, you need to set up a Connected App and make sure that your authenticated user has access to the __REST_API_v1__ class and objects. 


### Payload

* Both p360 endoints accessing HTTP POST calls. 
* In the body you need to provide a valid JSON string.
* If this is a call to the private endpoint, you need the provide an ```Authorization: Bearer <YOUR ACCESS_KEY>``` header.
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

The Stripe Payload parameter used in __createPaymentMethod__ is returned by the stripe.js and has specific format:
it should be a JSON object dumbed to a string. Please see the example above.

### The result

The result returned by the REST API is a JSON string with the following parameters:

* Boolean success
* String errorMessage
* String errorParam
* Tra[] transactionList
* PM[] paymentMethodList
* Customer[] customerList

Not every property is populated in every action.

## Success and Error handling

The __success__ property is always provided by the REST API. If it equals true, than the action was performed properly, and you should receive your data in the corresponding properties. 

If the __success__ parameter equels false, than your action was not successful. You should get an error message in the __errorMessage__ property, and the __errorParam__ propery usually gives you some clue about the wrong parameter.

##  Actions

### createPaymentMethod

Currently the __createPaymentMethod__ is the only available action on the public endpoint. You can create a new Payment Method, link it to a Contact, Account or Stripe Customer. You can also charge the newly creted transaction. 

It is important to understand that you can not pass directly credit card data to your endpoint. Instead, you are retrieving a JSON token from stripe.js and passing this data as the __stripePayload__ parameter. This way credit card data doesn't travel through possibly insecure network or code. 


Params:
* __action__ : required, always equals 'createPaymentMethod'
* __paymentGatewayId__ : required, the Id of your Payment Gateway. This represents your Stripe Account.
* __publishableKey__ : instead of __paymentGatewayId__ you can provide this property of the Payment Gateway
* __stripePayload__ : String value of the JSON object returned by stripe.js
* __email__ : the customer's email
* __contactId__ : the customer's Contact id. The Payment Method will be linked to this Contact.
* __accountId__ : the customer's Account id. The Payment Method will be linked to this Account.
* __customerId__ : the customer's String Customer id. The Payment Method will be linked to this Stripe Customer.


### getPaymentMethods

