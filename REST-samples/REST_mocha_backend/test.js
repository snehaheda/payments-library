/*
Use the following call to obtain an access token:

curl https://login.salesforce.com/services/oauth2/token -X POST -d 'grant_type=password&client_id=3MVG9szVa2RxsqBaVMAZFSLdWv5BZvhnb15ChwBZzbVVyb_u9j08M.xnlQ5Ly15mI6KZfVRTsjTQSMsY27rDT&client_secret=5979639566859185104&username=peter%40paym6.dev&password=xstdev%2B19843go69jH2St9TNsWLGuFK3kTHz' 
*/

var ACCESS_TOKEN = '00D41000000FyUV!AQcAQLqHpInN5kMq3g4SDUAMkqgnjfXi6p4kRzxcNcFlNJ0XQOPjlNcn.iv16APbrU2fxuo9zgWCMrnzP0kJfoj_dGH6zaJL';

var assert = require("assert");
var request = require('request');
var expect = require("chai").expect;

var TIMEOUT_MS = 10000;
var PUBLIC_ENDPOINT = 'https://paym6-dev-developer-edition.na35.force.com/h/services/apexrest/v1';
var PRIVATE_ENDPOINT = 'https://p360-dev-6-dev-ed.my.salesforce.com/services/apexrest/v1';
var PUBLISHABLE_KEY = 'pk_test_rx6uxcAgv6PZM2LuH7TL9imW';

var CONSUMER_KEY = '3MVG9szVa2RxsqBaVMAZFSLdWv5BZvhnb15ChwBZzbVVyb_u9j08M.xnlQ5Ly15mI6KZfVRTsjTQSMsY27rDT';
var CONSUMER_SECRET = '5979639566859185104';
var SF_USERNAME = 'peter@paym6.dev';
var SF_PASSWORD = 'stdev+1984';

var CC_HOLDER_NAME = "Holder Maki";
var CC_NUMBER = "4242424242424242";
var CC_CVC = "123";
var EXP_MONTH = "5";
var EXP_YEAR = "2019";

var ADDRESS_CITY = "Budapest";
var ADDRESS_LINE1 = "Add l. 1";
var ADDRESS_ZIP = "1234";
var ADDRES_COUNTRY = "Hungary";
var CUSTOMER_EMAIL = "maki@gmail.com";

var PAYMENT_GATEWAY_ID = "a0141000001jhohAAA";
var CONTACT_ID = "00341000003ftLmAAI";
var ACCOUNT_ID = "00141000004fyVJAAY";
var CUSTOMER_ID = "a0741000002RrjOAAS";




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
                "paymentMethodId" : ["a024100000334ocAAA"]
            };

            callREST_API(d, false, function(r) {
            	try {
            		expect(r.success).to.equal(true);
            		expect(r.errorParam).to.equal(null);
            		expect(r.paymentMethodList.length).to.equal(1);

            		expect(r.paymentMethodList[0].paymentMethodId).to.equal('a024100000334ocAAA');

            		done();
            	} catch(e) {
            		done(e);
            	}
            });
		}).timeout(TIMEOUT_MS);	

		it("getPaymentMethods: retrieving two paymentMethod", function(done) {
			var d = {
                "action" : "getPaymentMethods",
                "paymentMethodId" : ["a024100000334ocAAA", "a0241000003353pAAA"]
            };

            callREST_API(d, false, function(r) {
            	try {
            		expect(r.success).to.equal(true);
            		expect(r.errorParam).to.equal(null);
            		expect(r.paymentMethodList.length).to.equal(2);

            		expect(r.paymentMethodList[0].paymentMethodId).to.equal('a024100000334ocAAA');
            		expect(r.paymentMethodList[1].paymentMethodId).to.equal('a0241000003353pAAA');

            		done();
            	} catch(e) {
            		done(e);
            	}
            });
		}).timeout(TIMEOUT_MS);	

	});




});