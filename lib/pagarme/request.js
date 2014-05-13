module.exports = function(PagarMe) {
  var https = require('https');
  var http = require('https');
  var querystring = require('querystring');

  var protocol = PagarMe.endpoint_protocol == 'http' ? http : https;

  function Request(path, method) {
    this.path = path
    this.method = method || 'POST'
    this.params = {}
    this.headers = {}
  }
  
  Request.prototype.run = function() {
    var _this = this, data, options, req;

    if(!PagarMe.api_key) {
      _this.error(new Error("You need to configure a API key before performing requests."));
    }

    _this.params.api_key = PagarMe.api_key;
    data = querystring.stringify(_this.params);
    console.log(data);

    _this.headers["Content-length"] = data.length;
    //if(this.method.toLowerCase() == "post")
      _this.headers['Content-Type'] = 'application/x-www-form-urlencoded';

    options = {
      host: PagarMe.endpoint,
      port: '443',
      path: PagarMe.api_path(_this.path),
      method: _this.method,
      headers: _this.headers
    };

    req = protocol.request(options, function(res) {
      var data;
      res.setEncoding('utf8');
      
      res.on('data', function (chunk) {
        data = JSON.parse(chunk);
      });
      res.on('end', function() {
        if(res.statusCode !== 200) {
          console.log(data);
          _this.api_error(data);
          return;
        }
        _this.success(res, data)
      })
    });

    req.on('error', function(e) {
      console.log(e);
      _this.error(e);
    });

    req.write(data);
    req.end();
  }

  Request.prototype.success = function(res, data) {}
  Request.prototype.error = function(e) {} 
  Request.prototype.api_error = function(e) {} 

  return Request;
}