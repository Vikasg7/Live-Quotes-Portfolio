var bg  = chrome.extension.getBackgroundPage() 
var app = angular.module("liveQuotesPortfolio", [])
	app.controller("bodyCtrl", bodyCtrl)

function bodyCtrl($scope, $window) {
	$scope.list = bg.stockData
	$scope.symbol = ""
	$scope.cost = []; $scope.target = []; $scope.stoploss = []; $scope.shares = []
	$scope.addSymbol = addSymbol
	
	function addSymbol($event) {
		if ($event.keyCode !== 13) { return }
		var syms = $scope.symbol.toUpperCase().replace(/ /g, "").split(",")
		syms = syms.filter(function (el, i) { return bg.symbols.indexOf(el) < 0 && el.trim() !== "" && syms.indexOf(el) === i })
		bg.symbols = bg.symbols.concat(syms)
		//emptying the input box
		$scope.symbol = ""
		chrome.extension.sendRequest({action: "getData", interval: 5})
	}
}

window.onunload = beforeUnload

function beforeUnload () {
	chrome.extension.sendRequest({action: "getData", interval: 60})
	//saving prefs in localStorage
	bg.symbols.length === 0 ? localStorage.removeItem("symbols") 
							: localStorage.symbols = JSON.stringify(bg.symbols)
}

chrome.extension.onRequest.addListener(function (request) {
	if (request.action === "updateView") {
		//thats how we can refer App Scope outside the App Scope or Controller
		var scope = angular.element($('[ng-app]')).scope()
		scope.$apply(function () { scope.list = bg.stockData })
	}
})

function print() { console.log.apply(console, arguments) }