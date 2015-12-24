 //hold symbols to be scraped
var	symbols   = localStorage.symbols ? JSON.parse(localStorage.symbols) : {}
var inputSyms = []

var stockData = [] //for holding stock data from ajax request
var interval  = 60 //in seconds
var loop	  = setInterval(doStuff, interval * 1000)

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
	var url = "https://www.google.com/finance/info?client=ob&hl=en-IN&q=" + encodeURIComponent(syms.join(","))
	$.ajax({url: url})
	  .then(function (data, status, xhr) {
		if (status !== "success") { print("Couldn't fetch!!"); return }
		print("fetching data!!")
		stockData = JSON.parse(data.substr(3))
		chrome.extension.sendRequest({action: "updateView"})
	})
}

function print() { console.log.apply(console, arguments) }
function deComma(text) { return (text ? (text+"").replace(/,/g, "") : "") }
String.prototype.proper = function () {	return this.charAt(0).toUpperCase() + this.slice(1) }
function getValues(obj) { var val = Object.keys(obj).map(function (key) { return obj[key] }); return val }

//target, stoploss and notification starts here
var target 	 = localStorage.target ? JSON.parse(localStorage.target) 	: {}
var stoploss = localStorage.target ? JSON.parse(localStorage.stoploss) 	: {}

var tAudio   = new Audio("icons/target.mp3")
var sAudio   = new Audio("icons/stoploss.mp3")

function checkTS(ToS) {
	var cv, trORsl, findIn, regex, test, bodyStr, sym, ids = []
	findIn = JSON.stringify(stockData)
	ids = Object.keys(window[ToS])

	ids.forEach(function (id, i) {
		
		trORsl 	= window[ToS][id] 
		if (!trORsl) { return }
		regex 	= new RegExp('"' + id + '"[\\s\\S]+?"l":"(.*?)"', "i")
		cv 		= deComma(findIn.match(regex)[1])

		switch (ToS) {
			case "target"	: test = (cv >= trORsl); break
			case "stoploss" : test = (cv <= trORsl)
		}

		if (!test) { return }
		// Show notifcation
		sym 	= findIn.match(regex.source.replace("l", "t"))[1]
		bodyStr = ToS.proper() + " of " + trORsl + " achieved for " + sym + " with " + cv + " on around " + new Date().toLocaleTimeString()
		notify(bodyStr, onShow)
		delete window[ToS][id]

	})

	function onShow() {
		if (ToS === "target") { tAudio.play() } else { sAudio.play() }
		localStorage[ToS] = JSON.stringify(window[ToS])
		chrome.extension.sendRequest({action: "updateTS"})
	}
}

function notify(bodyStr, callback) {
	var opt, title, notification, trORsl
	trORsl = bodyStr.split(" ")[0]
	opt    = {
		icon:"icons/" + trORsl + ".png",
		body: bodyStr,
		sound:"icons/target.mp3"
	}
	title  = trORsl.toUpperCase() + " hit!!"
	notification = new Notification(title, opt)
	notification.onshow = callback
}

function stopUpdate() {
	var from = localStorage.from ? localStorage.from : 0
	var to 	 = localStorage.to   ? localStorage.to 	: 0
	var now  = new Date().toLocaleTimeString("en-US",{hour12:false})
		now  = now.length === 10 ? "0" + now : now

	from = from.length == 1 ? "0" + from : from
	from = from + ":00:00"
	to 	 = to + ":00:00"
	return !(now >= from && now <= to)	// returning false as don't stop update
}