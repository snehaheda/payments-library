**payment360 REST API Documentation**
-------------------------------------
  payment360 provides REST API for developers in subscriber orgs to create applications and public websites that use payment360 functionality for custom web applications. To keep things simple, our API is structured on simple REST based POST calls with action based JSON payloads. The API consists of two kinds of actions:
  # Public actions: Public actions are for providing unaunthenticated access to API functionalities which can be used by public websites providing payment method and transaction creation. We will cover them in detail below.
  # Private actions: Private actions are more comprehensive list of functionalities which can be used in authenticated user context and consists of API calls for retrieving, creating and updating core payment360 entities. We will cover them in detail later in this document.
  
**Getting started**
-------------------
  In order to get started, we first need to setup payment360 API access and class permissions. Please complete steps mentioned under Setup section.
  
**Setting up and Testing the __payment360 REST API__**
------------------------------------------------------

**Setting up your public facing site**
--------------------------------------

  Go to __Setup | Sites__ and click __New__.

  ![Public facing site](site1.png)

  Note the url of your site. We suggest you to set up a HTTPS endpoint if available. However, as your endpoint is NOT dealing directly with sensitive credit card details, you can use HTTP as well.


**Setting up guest user permissions**
-------------------------------------

**Objects**
-----------

  Your guest user should have permissions to use all the payment360 objects.

  * Click the __Public Access Settings__ button
  * Go to __Object Settings__
  * Grant read access to __Payment Gateways__ and to all its fields
  * Grant read/write/edit access to __Stripe Customer__, __Payment Method__ and __Transaction__ objects and all fields. Grant access to all __Transaction__ record types.

**Apex Class Access**
---------------------

  On the guest user profile go to __Apex Class Access__ section.
  Click __Edit__ and grant access to the __bt_stripe.REST_API_v1__ class.

  ![Apex Class Access](class_access.png)

**Test your endpoint**
----------------------

  You can test your endpoint by 'pinging' it with a dummy request. This way you can make sure the Apex Class is available for your guest user.

  Open Terminal and type in the following command:

  `curl https://<YOUR_SITE_URL>/services/apexrest/bt_stripe/v1 -d x`

  Your response should be similar to the following. You should see a JSON response, with a 'false' success property.

  ![curl response](curl.png)

**Downloading the automated frontend tests**
--------------------------------------------

  You can test the payment360 REST endpoint from your browser, so you can make sure your org is set up properly.

**Clone the payment360 library repository**
-------------------------------------------

  In order to get the testing environment, you need to clone the payment360 library. Type in the following command:

  `git clone https://bitbucket.org/blackthornio/payment360-library`
  (you need the have git installed)

  After this command, you should have the `payment360-library` folder in your working directory.

**Runnig the automated frontend tests**
---------------------------------------

**Running the testing environment on your own machine**
-------------------------------------------------------

  Enter the `payment360-library` folder : `cd payment360-library`

  Enter the sample folder: `cd REST-samples`

  Run a local HTTP server on your machine: `python -m SimpleHTTPServer`

  ![local HTTP server](local_server.png)


**Opening the testing environment in your browser**
---------------------------------------------------

  Open the following URL in your browser:

  `http://localhost:8000/REST_mocha_tests1.html`

  You should see the following page:

  ![mocha test page](mocha1.png)

  Fill out all the field values __from your own org__ (the default settings are referring to blackthorn.io's test org).

  * __Endpoint__ : your payment360 REST API's endpoint (see section one in this document)
  * __Publishable key__ : copy this field value from your org's Payment Gateway
  * __Payment Gateway Id__ : your org's Payment Gateway Id (please note that your Payment Gateway should be connected to Stripe before testing the REST API)
  * __Contact Id__ : An Id of an arbitrary Contact from your org 
  * __Account Id__ : An Id of an arbitrary Account from your org 
  * __Customer Id__ : An Id of an arbitrary Stripe Customer. Therefore, you should have at least one Stripe Custmer registered, otherwise some test cases will fail.

  Click __Start Tests__ button.

  The tests will start.

  Ideally, you should have a result similar to this (all test cases passed, no failures).


  ![mocha test page](mocha2.png)


**Considerations**
------------------

  * You should use long (18-byte long) record Id's in Account, Contact and Stripe Customer Fields
  * If some test cases are failing, make sure your the USD is a valid value on the __Currency ISO__ on the 'Stripe' record type

**API Request Structure**
-------------------------

  payment360 REST API is designed to use simple and uniform request and response structure for intuitive usage and increased code reuse. Any API call to payment360 REST API will need following components:

* **Endpoints**

  There are 2 endpoints:
  Public: https://<YOUR_FORCE_DOT_COM_URL>/<YOUR_SITE_LABEL>/services/apexrest/v1 
  Private: https://<YOUR_ORG_URL>/services/apexrest/v1
  
  The difference between these 2 endpoints is that you can access the public one without oAuth authentication, while the second one is available only for an authenticated users.
  
* **Public endpoint**

  The primary use case for the public endpoint is to register a new Payment Method, and optionally capture a Transaction. Because you can use this endpoint without authentication, it is safe to implement a call on the front-end. However, as this is a publicly accessible endpoint, only some actions are available. You can't perform any actions from the public endoint which touch any existing payment360 records. (Payment Method linking to existing Stripe Customers or Contacts doesn't count if you already have the Id's of the existing records.)
  
  In order to set up the public endpoint, create a public site (Setup | Site) and grant access to your Guest User to the REST_API_v1 class and related objects. See http://docs.payment360.io/docs/setup for a listing of all the objects to configure.

* **Private Endpoint**
  The purpose of the private endpoint is to perform actions that deal with existing payment360 data. As this data is sensitive, you always need to authenticate yourself before performing actions.
  
  The payment360 private endpoint is a standard Force.com web service, so you can use one of the available oAuth authentication flows. Please see the documentation here:
  
  https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_what_is_rest_api.htm 
  https://developer.salesforce.com/page/Digging_Deeper_into_OAuth_2.0_on_Force.com
  
  In order to set up this endpoint, you need to set up a Connected App and make sure that your authenticated user has access to the REST_API_v1 class and payment360 objects.

* **Method:**
  
  `POST`
  
  To keep things simple, payment360 API works with HTTP POST calls only for create, update and retrieve actions according to action parameter passed in data parameter (payload).
  
* **Data Params**

  <_If making a post request, what should the body payload look like? URL Params rules apply here too._>

* **Success Response:**
  
  <_What should the status code be on success and is there any returned data? This is useful when people need to to know what their callbacks should expect!_>

  * **Code:** 200 <br />
    **Content:** `{ id : 12 }`
 
* **Error Response:**

  <_Most endpoints will have many ways they can fail. From unauthorized access, to wrongful parameters etc. All of those should be liste d here. It might seem repetitive, but it helps prevent assumptions from being made where they should be._>

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error : "Log in" }`

  OR

  * **Code:** 422 UNPROCESSABLE ENTRY <br />
    **Content:** `{ error : "Email Invalid" }`

* **Sample Call:**

  <_Just a sample call to your endpoint in a runnable format ($.ajax call or a curl request) - this makes life easier and more predictable._> 

* **Notes:**

  <_This is where all uncertainties, commentary, discussion etc. can go. I recommend timestamping and identifying oneself when leaving comments here._> 