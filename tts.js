

// 네이버 음성합성 Open API 예제
var express = require('express');
var app = express();
var client_id = 'i05q7mjoxj';
var client_secret = 'Egi4tkVR5Qbx3y77KMsxrwHOKnospB8mgcSQzcFI';
var fs = require('fs');
app.get('/tts', function(req, res) {
  var api_url = 'https://naveropenapi.apigw.ntruss.com/voice-premium/v1/tts';
  var request = require('request');
  console.log("req : ", req);
  var txt = '김미혜!, 김미혜!, 김미혜!, 김미혜!, 김미혜!, 김미혜!,  뿡뿡뿡!! 뿡뿡뿡 빵빠라삥뽕 쭈쭈쭈~ 캴캴캴~ 닐리리뽕쁑! 닐리리뽕쁑 뿡뿡뿡!! 뿡뿡뿡 빵빠라삥뽕 쭈쭈쭈~ 캴캴캴~ 닐리리뽕쁑! 닐리리뽕쁑';
  var options = {
    url: api_url,
    form: { speaker: 'nara', volume: '0', speed: '0', pitch: '0', emotion: '0', text: txt, format: 'mp3' },
    headers: { 'X-NCP-APIGW-API-KEY-ID': client_id, 'X-NCP-APIGW-API-KEY': client_secret },
  };
  var writeStream = fs.createWriteStream('./tts1.mp3');
  var _req = request.post(options).on('response', function(response) {
    console.log(response.statusCode); // 200
    console.log(response.headers['content-type']);
  });
  _req.pipe(writeStream); // file로 출력
  _req.pipe(res); // 브라우저로 출력
});
app.listen(3000, function() {
  console.log('http://127.0.0.1:3000/tts app listening on port 3000!');
});