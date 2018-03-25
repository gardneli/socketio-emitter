/* Socket.io emitter */
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const jsyaml = require('js-yaml');
const testJson = {
  "symbol": "AAPL",
  "companyName": "Apple Inc.",
  "primaryExchange": "Nasdaq Global Select",
  "sector": "Technology",
  "calculationPrice": "tops",
  "open": 154,
  "openTime": 1506605400394,
  "close": 153.28,
  "closeTime": 1506605400394,
  "high": 154.80,
  "low": 153.25,
  "latestPrice": 158.73,
  "latestSource": "Previous close",
  "latestTime": "September 19, 2017",
  "latestUpdate": 1505779200000,
  "latestVolume": 20567140,
  "iexRealtimePrice": 158.71,
  "iexRealtimeSize": 100,
  "iexLastUpdated": 1505851198059,
  "delayedPrice": 158.71,
  "delayedPriceTime": 1505854782437,
  "previousClose": 158.73,
  "change": -1.67,
  "changePercent": -0.01158,
  "iexMarketPercent": 0.00948,
  "iexVolume": 82451,
  "avgTotalVolume": 29623234,
  "iexBidPrice": 153.01,
  "iexBidSize": 100,
  "iexAskPrice": 158.66,
  "iexAskSize": 100,
  "marketCap": 751627174400,
  "peRatio": 16.86,
  "week52High": 159.65,
  "week52Low": 93.63,
  "ytdChange": 0.3665,
};

let configMap;
let configMessage = "Default config message: Hello, Default!";

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  let i = 1;
  function transmitLoop() {
    setTimeout(function () {
      console.log('Transmitting message: ', testJson.symbol);
      io.emit('message', testJson);
      i++;
      if (i < 10) {
        transmitLoop();
      }
    }, 2000);
  }
  transmitLoop();

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

http.listen(3001, function() {
  console.log('listening on *:3001');
});

// Function to periodically retrieve the ConfigMap
setInterval(() => {
  retrieveConfigMap().then((config) => {
    if (!config) {
      configMessage = null;
      return;
    }

    if (JSON.stringify(config) !== JSON.stringify(configMap)) {
      configMap = config;
      configMessage = config.message;
      console.log('ConfigMap message: ', config.message);
    }
  }).catch((err) => {

  });
}, 2000);

// Function to find the ConfigMap
const openshiftRestClient = require('openshift-rest-client');
function retrieveConfigMap() {
  const settings = {
    request: {
      strictSSL: false
    }
  };

  return openshiftRestClient(settings).then((client) => {
    const configMapName = 'app-config';
    return client.configmaps.find(configMapName).then((configMap) => {
      return jsyaml.safeLoad(configMap.data['app-config.yml']);
    });
  });
}
