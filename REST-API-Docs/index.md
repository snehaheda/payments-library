# payment360 Apex API

## Introduction

The purpose of the Apex API is to provide salesforce developers classes and methods to manipulate payment methods, transactions and customers. The API is created in a form of a global Apex class, so it is available in your org if the payment360 package is installed.

## Structure
All off classes are parts of the `bt_stripe.P360_API_v1` class.

The following wrapper classes are available:

* `bt_stripe.Customer` represents a Customer in Stripe database. Corresponds to the __bt_stripe__Stripe_Customer__c__ object
* `bt_stripe.PM` represents Payment Method in Stripe database. Corresponds to the __bt_stripe__Payment_Method__c__ object
* `bt_stripe.Tra` represents Transaction in Stripe database. Corresponds to the __bt_stripe__Transaction__c__ object

You should create these objects using factory methods because the API class should register their in the background. Use the following factory methods:

* `bt_stripe.P360_API_v1.customerFactory`
* `bt_stripe.P360_API_v1.paymentMethodFactory`
* `bt_stripe.P360_API_v1.transactionFactory`





