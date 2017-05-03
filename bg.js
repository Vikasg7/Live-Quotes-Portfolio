 //hold symbols to be scraped
var symbols   = localStorage.symbols ? JSON.parse(localStorage.symbols) : {}
var inputSyms = []
var stockData

var stockData = [] //for holding stock data from ajax request
var interval  = 60 //in seconds
var loop      = setInterval(doStuff, interval * 1000)
var eventNotified = {target:[], stoploss:[]}

chrome.extension.onRequest.addListener(function (request) {
   if (request.action === "getData") {
      interval = request.interval
      fetch()
      clearInterval(loop)
      loop = setInterval(doStuff, interval * 1000)
   }
})

function doStuff() {
   if (!stopUpdate()) {
      setTimeout(function () { checkTS("target"); checkTS("stoploss") }, 10)
      fetch()
   }
}

function fetch() {
   if (getValues(symbols).length === 0 && inputSyms.length === 0) { 
      stockData = []
      chrome.extension.sendRequest({action: "updateView"})
      return 
   }

   var syms = getValues(symbols).concat(inputSyms).sort()
   inputSyms = []
   var url = "https://www.google.com/finance/info?client=ob&infotype=infoonebox&hl=en-IN&q=" + encodeURIComponent(syms.join(","))
   $.ajax({
      url: url,
      dataType: "text"
   }).then(function (data, status, xhr) {
      if (status !== "success") { print("Couldn't fetch!!"); return }
      print("fetching data!!")
      stockData = JSON.parse(data.substr(3))
      chrome.extension.sendRequest({action: "updateView"})
   })
}

function print() { console.log.apply(console, arguments) }
function deComma(text) { return (text ? Number((text+"").replace(/,/g, "")) : "") }
String.prototype.proper = function () { return this.charAt(0).toUpperCase() + this.slice(1) }
function getValues(obj) { var val = Object.keys(obj).map(function (key) { return obj[key] }); return val }

//target, stoploss and notification starts here
var target   = localStorage.target ? JSON.parse(localStorage.target)   : {}
var stoploss = localStorage.target ? JSON.parse(localStorage.stoploss) : {}

var tAudio   = new Audio("icons/target.mp3")
var sAudio   = new Audio("icons/stoploss.mp3")

function checkTS(ToS) {
   var findIn = JSON.stringify(stockData)
   var ids = Object.keys(window[ToS])

   ids.forEach(function (id, i) {
      if (eventNotified[ToS].indexOf(id) > -1) { return }

      var trORsl = window[ToS][id] 
      if (!trORsl) { return }

      var regex  = new RegExp('"' + id + '"[\\s\\S]+?"l":"(.*?)"', "i")
      var cv     = deComma(findIn.match(regex)[1])

      var test
      switch (ToS) {
         case "target"   : test = (Number(cv) >= Number(trORsl)); break;
         case "stoploss" : test = (Number(cv) <= Number(trORsl))
      }

      if (!test) { return }
      // Show notifcation
      var sym     = findIn.match(regex.source.replace("l", "t"))[1]
      var bodyStr = ToS.proper() + " of " + trORsl + " achieved for " + sym + " with " + cv + " on around " + new Date().toLocaleTimeString()
      notify(bodyStr, onShow)
      eventNotified[ToS].push(id)
      setTimeout(function () {
         eventNotified[ToS].splice(eventNotified[ToS].indexOf(id), 1)
      }, 15 * 60 * 1000)
   })

   function onShow() {
      if (ToS === "target") { tAudio.play() } else { sAudio.play() }
      chrome.extension.sendRequest({action: "updateTS"})
   }
}

function notify(bodyStr, callback) {
   var trORsl = bodyStr.split(" ")[0]
   var opt    = {
      icon:"icons/" + trORsl.toLowerCase() + ".png",
      body: bodyStr
   }
   var title  = trORsl.toUpperCase() + " hit!!"
   var notification = new Notification(title, opt)
   notification.onshow = callback
}

function stopUpdate() {
   var from = localStorage.from ? localStorage.from : 0
   var to   = localStorage.to   ? localStorage.to   : 0
   var now  = new Date().toLocaleTimeString("en-US",{hour12:false})
       now  = now.length === 10 ? "0" + now : now

   from = from.length == 1 ? "0" + from : from
   from = from + ":00:00"
   to   = to + ":00:00"
   return !(now >= from && now <= to)   // returning false as don't stop update
}