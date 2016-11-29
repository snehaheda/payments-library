# Current working functionality for the REST API docs

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
Because you can use this endpoint without an authentication, it is safe to implement a call on the front-end.

### Private Endpoint

### Payload

### The stripe.js payload

## Error handling

##  Actions

### createPaymentMethod

### getPaymentMethods

