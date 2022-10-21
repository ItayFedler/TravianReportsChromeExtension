
var match

file()('sites/config.json', (err, config) => {
  match = JSON.parse(config)
    .filter(({ enable, match, inject }) => enable && match && inject)
    .reduce((all, item) => {
      item.match.forEach((domain) => {
        all[domain] = item
      })
      return all
    }, {})
})

var send = (tab, item) => {
  if (item.cache && item.code) {
    chrome.tabs.sendMessage(tab.id, { message: 'inject', body: item.code })
  }
  else {
    load(item, (code) => {
      if (item.cache) {
        item.code = code
      }
      chrome.tabs.sendMessage(tab.id, { message: 'inject', body: code })
    })
  }
}

chrome.runtime.onMessage.addListener((req, sender, res) => {
  if (req.message === 'check') {
    if (match['*']) {
      if (!(match['*'].ignore || []).includes(req.location.host)) {
        send(sender.tab, match['*'])
      }
    }
    if (match[req.location.host]) {
      send(sender.tab, match[req.location.host])
    }
  }

})

chrome.runtime.onMessageExternal.addListener(handleMessageExternal);

function handleMessageExternal(request, sender, sendResponse) {

  console.log(request);
  
  if (JSON.stringify(request).indexOf("addtolist") === 1) {
    var rid = JSON.stringify(request).split("?rid=")[1].split("?")[0]
    console.log(request)
    console.log(JSON.stringify(request).split("?c=")[1] );
    //chrome.storage.sync.clear()

    //index.js:46 addtolist?rid=2522365alid=aid=2?a=Thanos?d=Gotham?t=06.10.20, 08:46:11
    chrome.storage.sync.set({ [JSON.stringify(request).split("?rid=")[1].split("?")[0]]: { rid: JSON.stringify(request).split("?rid=")[1].split("?")[0], "alid": JSON.stringify(request).split("?alid=")[1].split("?")[0], "a": JSON.stringify(request).split("?a=")[1].split("?")[0], "d": JSON.stringify(request).split("?d=")[1].split("?")[0], "t": JSON.stringify(request).split("?t=")[1].split("?")[0], "c": JSON.stringify(request).split("?c=")[1].split(`"`)[0] } }, function () {
      console.log('Value is set to ' + request);
    });

    chrome.storage.sync.get(null, function (result) {
      
      console.log("chrome.storage.sync.get");
      console.log(result);
      console.log("chrome.storage.sync.get");
      sendResponse({ result: result });
    });
  }
  if (JSON.stringify(request).indexOf("getlist") === 1) {
    // var rid = JSON.stringify(request).split("?rid=")[1].split("?")[0]
    // console.log(rid);
    // //chrome.storage.sync.clear()

    // //index.js:46 addtolist?rid=2522365alid=aid=2?a=Thanos?d=Gotham?t=06.10.20, 08:46:11
    // chrome.storage.sync.set({ [JSON.stringify(request).split("?rid=")[1].split("?")[0]]: { rid: JSON.stringify(request).split("?rid=")[1].split("?")[0], "alid": JSON.stringify(request).split("?alid=")[1].split("?")[0], "a": JSON.stringify(request).split("?a=")[1].split("?")[0], "d": JSON.stringify(request).split("?d=")[1].split("?")[0], "t": JSON.stringify(request).split("?t=")[1] } }, function () {
    //   console.log('Value is set to ' + request);
    // });

    chrome.storage.sync.get(null, function (result) {
      sendResponse({ result: result });
      console.log("getlist");

    });
  }


}
