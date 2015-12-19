var symbols //hold symbols to be scraped
	symbols   = localStorage.symbols ? JSON.parse(localStorage.symbols) : {}
var inputSyms = []

var stockData = [] //for holding stock data from ajax request
var interval  = 60 //in seconds
var loop	  = setInterval(fetch, interval * 1000)

chrome.extension.onRequest.addListener(function (request) {
	if (request.action === "getData") {
		interval = request.interval
		fetch()
		clearInterval(loop)
		loop = setInterval(fetch, interval * 1000)
	}
})

function fetch() {
	if (getValues(symbols).length === 0 && inputSyms.length === 0) { 
		print("NO symbols")
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

function getValues(obj) {
	var val = Object.keys(obj).map(function (key) { return obj[key] })
	return val
}