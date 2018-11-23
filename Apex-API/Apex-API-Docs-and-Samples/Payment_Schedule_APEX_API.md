# Payment Schedules API -- APEX

## First, some examples:

All open, generate, Daily preset
```
P360_API_v1.PmtSchd psc = new P360_API_v1.PmtSchd();
psc.preset = 'Daily';
psc.startDate = Date.newInstance(2017, 4, 6);
psc.count = 7;
psc.eachAmount = 5;
psc.generate();
```

All open, different initial amount, Monthly preset

```
P360_API_v1.PmtSchd psc = new P360_API_v1.PmtSchd();
psc.preset = 'Monthly';
psc.startDate = Date.newInstance(2017, 4, 6);
psc.count = 7;
psc.eachAmount = 5;
psc.initialAmount = 10;
psc.generate();
```

First captured, Daily preset -- so there is a Payment Method set!
```
P360_API_v1.PmtSchd psc = new P360_API_v1.PmtSchd();
psc.preset = 'Daily';
psc.startDate = Date.newInstance(2017, 4, 6);
psc.count = 7;
psc.eachAmount = 5;
psc.pmId = bt.pm.Id;
psc.captureFirst = true;
psc.generate();
```

Saved as a Draft:

```
P360_API_v1.PaymentSchedule psc = new P360_API_v1.PaymentSchedule();
psc.preset = 'Daily';
psc.startDate = Date.newInstance(2017, 4, 6);
psc.count = 7;
psc.eachAmount = 5;
psc.saveDraft();
```


## Reference

`P360_API_v1.PaymentSchedule`

### Properties


* public PM pm;
* public Id pmId;
*	public String preset;
* public String repeats;
* public Integer count;
* public Integer frequency;
* public Date startDate;
* public Date endDate;
* public Decimal initialAmount;
* public Decimal totalAmount;
* public Decimal eachAmount;
* public String onThe;
* public String dayOfWeek;
* public String dayOfMonth;
* public String monthOfYear;
* public String currencyISO;
* public Boolean captureFirst;
* public Boolean autoCapture;
* public String recurrenceMethod;
* public Payment_Schedule__c record;


### Methods

* `saveDraft()` -- creates a PSC record and saves as a Draft.
* `generate()` -- creates a PSC record and generates the Transactions.

After both you can get the record as the `record` property.

### More about Payment Methods

You can set a Payment Methods in 2 ways. 

* If you already have a PM in database, you can simply set the `pmId` property.

* If want to create a PM on the fly, or already have a P360_API_v1 PM instance in your running context, you can set it on the `pm` property.

* Don't set both `pm` and `pmId` properties and the same time.

Example of creating a Payment Method. For more examples check the full APEX API documentation.

```
// A customer
//////////////////////
P360_API_v1.Customer apiCustomer = P360_API_v1.customerFactory();
apiCustomer.paymentGatewayId = paymentGatewayId;
apiCustomer.name = 'Peter';
apiCustomer.email = 'peter@hello.com';

// A Payment Method
//////////////////////
P360_API_v1.PM apiPM = P360_API_v1.paymentMethodFactory();
apiPM.paymentGatewayId = paymentGatewayId;
apiPM.stripeToken = 'xxxxxxxxxxxxxxxxxxxxxxxxx';
apiPM.email = 'peter@test.com';
apiPM.customer = apiCustomer;

// The Payment Schedule
//////////////////////
P360_API_v1.PmtSchd psc = new P360_API_v1.PmtSchd();
psc.preset = 'Daily';
psc.startDate = Date.newInstance(2019, 4, 6);
psc.count = 7;
psc.eachAmount = 5;
psc.pm = apiPM;
psc.captureFirst = true;
psc.generate();

```

