PagarMe - node.js
--------------

````javascript
PagarMe = require('pagarme.js')
PagarMe.api_key = "ak_test_N7DGOazupaDE1SvVjCmP3HVqxiF9ne";
transaction = new PagarMe.Transaction;

//Error handling
transaction.http_error = function (e) { console.log(e) }
transaction.api_error = function (e) { console.log(e) }
transaction.paid = function() { console.log('paid') }
transaction.refused = function () { console.log(this.refuse_reason) }

//Card info
transaction.card_number = "4901720080344448"
transaction.card_holder_name = "Jose da Silva"
transaction.card_expiration_date = "1012"
transaction.card_cvv = "314"
transaction.amount = 1000

transaction.charge();
````