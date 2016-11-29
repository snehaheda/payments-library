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


### The stripe.js payload

## Error handling

##  Actions

### createPaymentMethod

### getPaymentMethods

