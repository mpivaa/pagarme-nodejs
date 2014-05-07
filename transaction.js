module.exports = function(PagarMe) {
  var https = require('https');
  var querystring = require('querystring');
  function Transaction() {}

  Transaction.prototype.charge = function() {
    var _this = this;
    var params = this;
    params.api_key = PagarMe.api_key;
    var data = querystring.stringify(params);
    var options = {
        host: PagarMe.endpoint,
        port: '443',
        path: PagarMe.api_path('transactions'),
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': data.length
        }
    };

    var req = https.request(options, function(res) {
      res.setEncoding('utf8');
      var data;
      res.on('data', function (chunk) {
        data = chunk;
        if(res.statusCode === 200) {
          obj = JSON.parse(chunk);
          for(var i in obj) {
            _this[i] = obj[i];
          }
        }
      });
      res.on('end', function() {
        if(res.statusCode !== 200) {
          _this.api_error(JSON.parse(data));
        }
        if(_this.status === "refused") {
          _this.refused();
        } else if(_this.status === "paid") {
          _this.paid();
        }
      })
    });

    req.on('error', function(e) {
      _this.http_error(e);
    });

    req.write(data);
    req.end();
  }

  Transaction.prototype.paid = function () {}
  Transaction.prototype.refused = function () {}
  Transaction.prototype.http_error = function () {}
  Transaction.prototype.api_error = function () {}
  return Transaction;
}