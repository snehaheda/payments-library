**payment360 REST API Documentation**
-------------------------------------
  payment360 provides REST API for developers in subscriber orgs to create applications and public websites that use payment360 functionality for custom web applications. To keep things simple, our API is structured on simple REST based POST calls with action based JSON payloads. The API consists of two kinds of actions:
  # Public actions: Public actions are for providing unaunthenticated access to API functionalities which can be used by public websites providing payment method and transaction creation. We will cover them in detail below.
  # Private actions: Private actions are more comprehensive list of functionalities which can be used in authenticated user context and consists of API calls for retrieving, creating and updating core payment360 entities. We will cover them in detail later in this document.
  
**Getting started**
-------------------
  In order to get started, we first need to setup payment360 API access and class permissions. Please complete steps mentioned under Setup section.

**Setting up your public facing site**
--------------------------------------


* **URL**

  <_The URL Structure (path only, no root url)_>

* **Method:**
  
  <_The request type_>

  `GET` | `POST` | `DELETE` | `PUT`
  
*  **URL Params**

   <_If URL params exist, specify them in accordance with name mentioned in URL section. Separate into optional and required. Document data constraints._> 

   **Required:**
 
   `id=[integer]`

   **Optional:**
 
   `photo_id=[alphanumeric]`

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