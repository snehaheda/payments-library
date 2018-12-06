# Checkout Submission REST API

## Context

When making a _checkout_, an Order type Sales Document is being created. If a Transaction included, it is linked to the Sales Document.
The _checkout_ itself is recorded in a `Checkout Submissiomn` record; Line Items on the Sales Document and the Transaction is linked to the record;
the payload of the HTTP call is recorded on the record; even if the _checkout_ wasn't successful.

### Submit
The call can be sent without submission. In this case, only the price calculation is returned, but no records are created.

## Example

* Endpoint: `https://<INSTANCE_URL>/services/apexrest/bt_stripe/checkout`
* Method: POST
* Content-Type : application/json
* Authorization : oAuth

Payload:
```
{
	"submit" : true,
	"transactionId" : "a0Gf4000008Kfq3",
	"contactId" : "003f400000iONl1",
	"lineItemList" : [
		{
			"productId" : "01tf40000013ZUF",
			"quantity" : 3
		}
	]
}
```

Response:

```
{
    "success": true,
    "salesDocument": {
        "toInsert": null,
        "success": true,
        "errorMessage": null,
        "totalAmount": 75000,
        "subtotalAmount": 75000,
        "shipToStreet": null,
        "shipToState": null,
        "shipToPostalCode": null,
        "shipToCountry": null,
        "shipToCity": null,
        "shipToAccountId": null,
        "sd": null,
        "salesDocumentType": "Order",
        "netAmount": 75000,
        "lineItemList": [
            {
                "toInsert": null,
                "success": null,
                "errorMessage": null,
                "unitPrice": 25000,
                "totalAmount": 75000,
                "subtotalAmount": 75000,
                "quantity": 3,
                "productName": "GenWatt Diesel 200kW",
                "productId": "01tf40000013ZUFAA2",
                "priceBookId": null,
                "netAmount": 75000,
                "listPrice": 25000,
                "li": null,
                "id": "a0Vf40000056BF3EAM",
                "discountAmount": 0,
                "description": null,
                "additionalDiscountPercentage": null,
                "additionalDiscountAmount": null
            }
        ],
        "isBuilt": true,
        "id": "a0Wf40000029LtqEAE",
        "dueDate": null,
        "discountCodeNameExists": null,
        "discountCodeName": null,
        "discountCodeId": null,
        "discountCode": null,
        "discountAmount": 0,
        "currencyISO": "USD",
        "billToStreet": "Lehel st 24",
        "billToState": "Pest",
        "billToPostalCode": "1135",
        "billToCountry": "Hungary",
        "billToContactId": "003f400000iONl1AAG",
        "billToCity": "Budapest",
        "billToAccountId": null,
        "additionalDiscountPercentage": null,
        "additionalDiscountAmount": null
    },
    "id": "a0Xf4000002roqEEAQ"
}
```

## Reference

### `Payload` object

* `String currencyISO` If null, USD is used
* `Id priceBookId` The PriceBook for the given calculation. Every Product should have a price entry for products
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
