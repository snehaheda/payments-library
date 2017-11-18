/*
Use the following call to obtain an access token:

curl https://login.salesforce.com/services/oauth2/token -X POST -d 'grant_type=password&client_id=3MVG9szVa2RxsqBaVMAZFSLdWv5BZvhnb15ChwBZzbVVyb_u9j08M.xnlQ5Ly15mI6KZfVRTsjTQSMsY27rDT&client_secret=5979639566859185104&username=peter%40paym6.dev&password=stdev%2B19843go69jH2St9TNsWLGuFK3kTHz' 
*/

var ACCESS_TOKEN = '00D41000000FyUV!AQcAQMkNY7JnRSHf0AgsGy1Yp5.SI03Dxv3hrtJXy8eljMQS07zZwaaodsdVybKeV2VMGstLWoBX33edQp2qWuAT1HJhnxj1';

var PUBLIC_ENDPOINT = 'https://paym6-dev-developer-edition.na35.force.com/h/services/apexrest/v1';
var PRIVATE_ENDPOINT = 'https://p360-dev-6-dev-ed.my.salesforce.com/services/apexrest/v1';
var PUBLISHABLE_KEY = 'pk_test_rx6uxcAgv6PZM2LuH7TL9imW';

var CONSUMER_KEY = '';
var CONSUMER_SECRET = '';
var SF_USERNAME = 'peter@paym6.dev';
var SF_PASSWORD = '';

var CONTACT_ID = "00341000003ftLlAAI";
var ACCOUNT_ID = "00141000004fyVJAAY";
var CUSTOMER_ID = "a0741000003CzqkAAC";

var PAYMENT_METHOD_ID1 = 'a024100000334ocAAA';
var PAYMENT_METHOD_ID2 = 'a0241000003353pAAA';

var assert = require("assert");
var request = require('request');
var expect = require("chai").expect;

var TIMEOUT_MS = 10000;





var callREST_API = function(d, usePublic, callback) {
       var url;

    	var headers = {
        //     "content-type": "text/plain"
        };
		
		if (usePublic == true) {
        	url = PUBLIC_ENDPOINT;
    	} else {
        	url = PRIVATE_ENDPOINT;
        	headers.Authorization = 'Bearer ' + ACCESS_TOKEN;
       }


		var options = {
			method : 'POST',
        	url : url,
        	headers : headers,
            body : JSON.stringify(d),
       	};

		request(options, function(err, res, body) {
			if (err) {
				throw "Something went wrong sending the HTTP request";
			}
			callback(JSON.parse(body));
		})
	}








describe("p360 REST API private actions", function() {
	
	describe("private / public endpoint tests", function() {
		it("createPaymentMethod should run on public", function(done) {
			var d = {
                "action" : "createPaymentMethod"
            };

            callREST_API(d, true, function(r) {
            	try {
            		expect(r.success).to.equal(false);
            		expect(r.errorParam).to.equal('paymentGatewayId');
            		done();
            	} catch(e) {
            		done(e);
            	}
            });
		}).timeout(TIMEOUT_MS);		

		it("noSuchAnAction should not run on public", function(done) {
			var d = {
                "action" : "noSuchAnAction"
            };

            callREST_API(d, true, function(r) {
            	try {
            		expect(r.success).to.equal(false);
            		expect(r.errorParam).to.equal('action');
            		done();
            	} catch(e) {
            		done(e);
            	}
            });
		}).timeout(TIMEOUT_MS);	

		it("noSuchAnAction should not run on private", function(done) {
			var d = {
                "action" : "noSuchAnAction"
            };

            callREST_API(d, false, function(r) {
            	try {
            		expect(r.success).to.equal(false);
            		expect(r.errorParam).to.equal('action');
            		done();
            	} catch(e) {
            		done(e);
            	}
            });
		}).timeout(TIMEOUT_MS);	

	});


	describe("getPaymentMethods action tests:", function() {

		it("getPaymentMethods: should not run on public (errorParam: action)", function(done) {
			var d = {
                "action" : "getPaymentMethods"
            };

            callREST_API(d, true, function(r) {
            	try {
            		expect(r.success).to.equal(false);
            		expect(r.errorParam).to.equal('action');
            		done();
            	} catch(e) {
            		done(e);
            	}
            });
		}).timeout(TIMEOUT_MS);	

		it("getPaymentMethods: should have some parameters", function(done) {
			var d = {
                "action" : "getPaymentMethods"
            };

            callREST_API(d, false, function(r) {
            	try {
            		expect(r.success).to.equal(false);
            		expect(r.errorParam).to.equal('paymentMethodId');
            		done();
            	} catch(e) {
            		done(e);
            	}
            });
		}).timeout(TIMEOUT_MS);	

		it("getPaymentMethods: retrieving one paymentMethod", function(done) {
			var d = {
                "action" : "getPaymentMethods",
                "paymentMethodId" : [PAYMENT_METHOD_ID1]
            };

            callREST_API(d, false, function(r) {
            	try {
            		expect(r.success).to.equal(true);
            		expect(r.errorParam).to.equal(null);
            		expect(r.paymentMethodList.length).to.equal(1);

            		expect(r.paymentMethodList[0].paymentMethodId).to.equal(PAYMENT_METHOD_ID1);

            		done();
            	} catch(e) {
            		done(e);
            	}
            });
		}).timeout(TIMEOUT_MS);	

		it("getPaymentMethods: retrieving two paymentMethod", function(done) {
			var d = {
                "action" : "getPaymentMethods",
                "paymentMethodId" : [PAYMENT_METHOD_ID1, PAYMENT_METHOD_ID2]
            };

            callREST_API(d, false, function(r) {
            	try {
            		expect(r.success).to.equal(true);
            		expect(r.errorParam).to.equal(null);
            		expect(r.paymentMethodList.length).to.equal(2);

            		expect(r.paymentMethodList[0].paymentMethodId).to.equal(PAYMENT_METHOD_ID1);
            		expect(r.paymentMethodList[1].paymentMethodId).to.equal(PAYMENT_METHOD_ID2);

            		done();
            	} catch(e) {
            		done(e);
            	}
            });
		}).timeout(TIMEOUT_MS);	

		it("getPaymentMethods: can't add more than one param 1", function(done) {
			var d = {
                "action" : "getPaymentMethods",
                "paymentMethodId" : [PAYMENT_METHOD_ID1],
                "customerId" : [PAYMENT_METHOD_ID1]
            };

            callREST_API(d, false, function(r) {
            	try {
            		expect(r.success).to.equal(false);
            		expect(r.errorParam).to.equal('customerId');
            		done();
            	} catch(e) {
            		done(e);
            	}
            });
		}).timeout(TIMEOUT_MS);	

		it("getPaymentMethods: can't add more than one param 2", function(done) {
			var d = {
                "action" : "getPaymentMethods",
                "paymentMethodId" : [PAYMENT_METHOD_ID1],
                "accountId" : [PAYMENT_METHOD_ID1]
            };

            callREST_API(d, false, function(r) {
            	try {
            		expect(r.success).to.equal(false);
            		expect(r.errorParam).to.equal('accountId');
            		done();
            	} catch(e) {
            		done(e);
            	}
            });
		}).timeout(TIMEOUT_MS);	

		it("getPaymentMethods: can't add more than one param 3", function(done) {
			var d = {
                "action" : "getPaymentMethods",
                "paymentMethodId" : [PAYMENT_METHOD_ID1],
                "contactId" : [PAYMENT_METHOD_ID1]
            };

            callREST_API(d, false, function(r) {
            	try {
            		expect(r.success).to.equal(false);
            		expect(r.errorParam).to.equal('contactId');
            		done();
            	} catch(e) {
            		done(e);
            	}
            });
		}).timeout(TIMEOUT_MS);	

		it("getPaymentMethods: can't add more than one param 4", function(done) {
			var d = {
                "action" : "getPaymentMethods",
                "customerId" : [PAYMENT_METHOD_ID1],
                "contactId" : [PAYMENT_METHOD_ID1]
            };

            callREST_API(d, false, function(r) {
            	try {
            		expect(r.success).to.equal(false);
            		expect(r.errorParam).to.equal('contactId');
            		done();
            	} catch(e) {
            		done(e);
            	}
            });
		}).timeout(TIMEOUT_MS);	

		it("getPaymentMethods: can't add more than one param 5", function(done) {
			var d = {
                "action" : "getPaymentMethods",
                "customerId" : [PAYMENT_METHOD_ID1],
                "accountId" : [PAYMENT_METHOD_ID1]
            };

            callREST_API(d, false, function(r) {
            	try {
            		expect(r.success).to.equal(false);
            		expect(r.errorParam).to.equal('accountId');
            		done();
            	} catch(e) {
            		done(e);
            	}
            });
		}).timeout(TIMEOUT_MS);	

		it("getPaymentMethods: can't add more than one param 6", function(done) {
			var d = {
                "action" : "getPaymentMethods",
                "contactId" : [PAYMENT_METHOD_ID1],
                "accountId" : [PAYMENT_METHOD_ID1]
            };

            callREST_API(d, false, function(r) {
            	try {
            		expect(r.success).to.equal(false);
            		expect(r.errorParam).to.equal('accountId');
            		done();
            	} catch(e) {
            		done(e);
            	}
            });
		}).timeout(TIMEOUT_MS);	

		it("getPaymentMethods: retrieving one paymentMethod by customerId", function(done) {
			var d = {
                "action" : "getPaymentMethods",
                "customerId" : [CUSTOMER_ID]
            };

            callREST_API(d, false, function(r) {
            	try {
            		expect(r.success).to.equal(true);
            		expect(r.errorParam).to.equal(null);
            		expect(r.paymentMethodList.length).to.equal(1);

            		expect(r.paymentMethodList[0].customerId).to.equal(CUSTOMER_ID);

            		done();
            	} catch(e) {
            		done(e);
            	}
            });
		}).timeout(TIMEOUT_MS);	

		it("getPaymentMethods: retrieving one paymentMethod by contactId", function(done) {
			var d = {
                "action" : "getPaymentMethods",
                "contactId" : [CONTACT_ID]
            };

            callREST_API(d, false, function(r) {
            	try {
            		expect(r.success).to.equal(true);
            		expect(r.errorParam).to.equal(null);

            		expect(r.paymentMethodList[0].contactId).to.equal(CONTACT_ID);

            		done();
            	} catch(e) {
            		done(e);
            	}
            });
		}).timeout(TIMEOUT_MS);	

		it("getPaymentMethods: retrieving one paymentMethod by accountId", function(done) {
			var d = {
                "action" : "getPaymentMethods",
                "accountId" : [ACCOUNT_ID]
            };

            callREST_API(d, false, function(r) {
            	try {
            		expect(r.success).to.equal(true);
            		expect(r.errorParam).to.equal(null);

            		r.paymentMethodList.forEach(function(e) {
            			expect(e.accountId).to.equal(ACCOUNT_ID);
            		});


            		done();
            	} catch(e) {
            		done(e);
            	}
            });
		}).timeout(TIMEOUT_MS);	

	});

});