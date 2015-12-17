var bg  = chrome.extension.getBackgroundPage() 
var app = angular.module("liveQuotesPortfolio", [])
	app.controller("bodyCtrl", bodyCtrl)

function bodyCtrl($scope, $window) {
	$scope.list = bg.stockData
	$scope.symbol = ""
	$scope.cost = JSON.parse(localStorage.cost) || []
	$scope.target = JSON.parse(localStorage.target) || []
	$scope.stoploss = JSON.parse(localStorage.stoploss) || []
	$scope.shares = JSON.parse(localStorage.shares) || []
	$scope.addSymbol = addSymbol
	$scope.delRow = delRow
	$window.onunload = beforeUnload

	function addSymbol($event) {
		if ($event.keyCode !== 13) { return }
		var syms = $scope.symbol.toUpperCase().replace(/ /g, "").split(",")
		syms = syms.filter(function (el, i) { return bg.symbols.indexOf(el) < 0 && el.trim() !== "" && syms.indexOf(el) === i })
		bg.symbols = bg.symbols.concat(syms)
		//emptying the input box
		$scope.symbol = ""
		chrome.extension.sendRequest({action: "getData", interval: 5})
	}

	function delRow(sym, $index, $event) {
		$scope.list.splice($index, 1)
		bg.symbols.splice(bg.symbols.indexOf(sym),1)
		$scope.shares.splice($index, 1)
		$scope.cost.splice($index, 1)
		$scope.target.splice($index, 1)
		$scope.stoploss.splice($index, 1)
	}

	function beforeUnload() {
		chrome.extension.sendRequest({action: "getData", interval: 60})
		//saving prefs in localStorage
		if (bg.symbols.length === 0) {
			localStorage.removeItem("symbols")
			localStorage.removeItem("cost")
			localStorage.removeItem("target")
			localStorage.removeItem("stoploss")
			localStorage.removeItem("shares")
			return
		}
		localStorage.symbols = JSON.stringify(bg.symbols)
		localStorage.cost = JSON.stringify($scope.cost)
		localStorage.shares = JSON.stringify($scope.shares)
		localStorage.stoploss = JSON.stringify($scope.stoploss)
		localStorage.target = JSON.stringify($scope.target)
	}
}

//requesting data after loading the angular stuff
chrome.extension.sendRequest({action: "getData", interval: 60})

chrome.extension.onRequest.addListener(function (request) {
	if (request.action === "updateView") {
		var scope = angular.element($('[ng-app] tbody')).scope()	//thats how we can refer App Scope outside the App Scope or Controller
		scope.$apply(function () { scope.list = bg.stockData })
	}
})

function print() { console.log.apply(console, arguments) }