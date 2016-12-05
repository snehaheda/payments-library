# Setting up and Testing payment 360 REST API

## Setting up your public facing site

Go to __Setup | Sites__ and click __New__.

![Public facing site](site1.png)

Note the url of your site.

## Setting up guest user permissions.

### Objects

Your guest user needs permissions the use all the payment360 objects.
* Click the __Public Access Settings__ button
* Go to __Object Settings__
* Grant read access to __Payment Gateways__ and to all its fields
* Grant read/write/edit access to __Stripe Customer__, __Payment Gateway__ and __Transaction__ objects and all properties. Grant access to all __Transaction__ record types.

### Apex Class Access

On the guest user profile go to __Apex Class Access__ section.
Click __Edit__ and grant access to the __bt_stripe.REST_API_v1__ class.

![Apex Class Access](class_access.png)

## Test your endpoint

You can test your endpoint by 'pinging' it with a dummy request. This way you can make sure the Apex Class is available for your guest user.

Open Terminal and type in the following command:

curl https://<YOUR_SITE_URL>/services/apexrest/bt_stripe/v1 -d x

Your response should be similar to the following. You should see a JSON response, with a 'false' success property.

![curl response](curl.png)

