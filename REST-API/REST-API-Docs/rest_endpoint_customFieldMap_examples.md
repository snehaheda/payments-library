# Custom field mapping on the Transaction object
--------------------------

## Example 1
Populating fields on the Transaction record.

```
{
   "action" : "createTransactions",
   "transactionList" : [
	{
		"amount" : "10",
		"currencyISO" : "EUR",
		"customFieldMap" : {
			"test_text__c" : "hali",
			"test_longtext__c" : "buuu buuub uuu",
			"test_bool__c" : true,
			"test_number__c" : 55.79,
			"test_picklist__c" : "dog",
			"test_currency__c" : 99.99,
			"test_percent__c" : 66.55,
			"test_email__c" : "maki@xx.com",
			"test_phone__c" : "666-666-666",
			"test_encrypted__c" : "my dirty secret",
			"test_url__c" : "http://444.hu",
			"test_lookup__c" : "0016A000004MlBm",
			"test_date__c" : "2017-07-07T15:48:19Z",
			"test_datetime__c" : "2017-07-07T15:48:19Z",
			"test_multi__c" : ["dog", "kangaroo"]

		}
	}
   ]
}
```

---------------
## Example 2
Create nested records in the `customFieldMap`. The records are inserted automatically.
`test_lookup__c` is a lookup field, so it can be both an Id or a nested object.

```
{
   "action" : "createTransactions",
   "transactionList" : [
	{
		"amount" : "10",
		"currencyISO" : "EUR",
		"customFieldMap" : {
			"test_text__c" : "hali",
			"test_longtext__c" : "buuu buuub uuu",
			"test_bool__c" : true,
			"test_number__c" : 55.79,
			"test_picklist__c" : "dog",
			"test_currency__c" : 99.99,
			"test_percent__c" : 66.55,
			"test_email__c" : "maki@xx.com",
			"test_phone__c" : "666-666-666",
			"test_encrypted__c" : "my dirty secret",
			"test_url__c" : "http://444.hu",
			"test_lookup__c" : {
				"Name" : "Buuu XXXXX",
				"SLA__c" : "Gold"
			},
			"test_date__c" : "2017-07-07T15:48:19Z",
			"test_datetime__c" : "2017-07-07T15:48:19Z",
			"test_multi__c" : ["dog", "kangaroo"]

		}
	}
   ]
}
```


