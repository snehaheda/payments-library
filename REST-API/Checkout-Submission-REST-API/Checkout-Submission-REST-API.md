# Checkout Submission REST API

## Context

When making a _checkout_, an Order type Sales Document is being created. If a Transaction included, it is linked to the Sales Document.
The _checkout_ itself is recorded in a `Checkout Submissiomn` record; Line Items on the Sales Document and the Transaction is linked to the record;
the payload of the HTTP call is recorded on the record; even if the _checkout_ wasn't successful.

### Submit
The call can be sent without submission. In this case, only the price calculation is returned, but no records are created.

## Example

## Reference

### `Payload` object

* `String currencyISO` If null, USD is used
* `Id priceBookId; // The priceBook for the given calculation. Every Product should have a price entry for products
* `APIpayloadLineItem[] lineItemList` List of APIpayloadLineItem objects 
* `Id discountCodeId` Discount code applied
* `String discountCodeName` OR discount code name
* `Id contactId` Contact of the billTo buyer
* `ContactWrapper contactBillTo` If it is a new contact, the details go into this object
* `Id transactionId` Id of the transaction
* `Boolean submit` If true, the Checkout is submitted. If false (or null), only the price calculation is returned.


### `APIpayloadLineItem` object

* `Id productId` Id of the Project
* `Decimal unitPrice` If product id not set, need to set unitPrice (anonymous product)
* `Decimal quantity`

### `ContactWrapper` object
* `String firstName`
* `String lastName`
* `String title`
* `String email`
* `String phone`
* `String street`
* `String city`
* `String state`
* `String postalCode`
* `String country`
