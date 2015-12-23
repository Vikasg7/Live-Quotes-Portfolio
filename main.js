var bg  = chrome.extension.getBackgroundPage() 
//initialising app and attaching stuff
angular.module("liveQuotesPortfolio", [])
	.controller("bodyCtrl", bodyCtrl)
	.directive("colorUp", colorUp)
	.directive("contenteditable", contentEditable)

function bodyCtrl($scope, $window, $filter) {
	
	$window.onunload = beforeUnload

	$scope.list 	= bg.stockData
	$scope.symbol 	= ""	//symbol in the input box
	
	$scope.cost 	= localStorage.cost 	? JSON.parse(localStorage.cost) 	: {}
	$scope.target 	= localStorage.target 	? JSON.parse(localStorage.target) 	: {}
	$scope.stoploss = localStorage.stoploss ? JSON.parse(localStorage.stoploss) : {}
	$scope.shares 	= localStorage.shares 	? JSON.parse(localStorage.shares) 	: {}

	$scope.from 	= localStorage.from 	? parseInt(localStorage.from) 		: 0
	$scope.to 		= localStorage.to 		? parseInt(localStorage.to) 		: 24
	$scope.interval = localStorage.interval ? parseInt(localStorage.interval)	: 5

	$scope.$watch("from", function(newVal, oldVal) { localStorage.from = newVal })
	$scope.$watch("to", function(newVal, oldVal) { localStorage.to = newVal })
	$scope.$watch("interval", function(newVal, oldVal) { localStorage.interval = newVal ? newVal : 5 })

	//watches for updating bg page Variables instantly
	//using watch with 3rd parameter as true for deep checking of object
	$scope.$watch("target", function(newVal, oldVal) { bg.target = newVal }, true)
	$scope.$watch("stoploss", function(newVal, oldVal) { bg.stoploss = newVal }, true)
	//individuals
	$scope.investment 	= investment
	$scope.value		= value
	$scope.ROI 			= ROI
	$scope.percentROI 	= percentROI
	//totals
	$scope.tInvestment 	= tInvestment
	$scope.tValue		= tValue
	$scope.tROI			= tROI
	$scope.tPercentROI	= tPercentROI
	
	$scope.addSymbol 	= addSymbol
	$scope.delRow 		= delRow

	function investment(ele) {
		var invest = $scope.shares[ele.id] && $scope.cost[ele.id]  ? $scope.cost[ele.id] * $scope.shares[ele.id] : null
		return invest
	}

	function value(ele) {
		var val = $scope.shares[ele.id] ? deComma(ele.l) * $scope.shares[ele.id] : null
		return val
	}

	function ROI(ele) {
		var ROI = deComma($scope.value(ele)) - deComma($scope.investment(ele))
		ROI = $scope.shares[ele.id] && $scope.cost[ele.id] ? ROI : null
		return ROI
	}

	function percentROI(ele) {
		var percentROI = deComma($scope.ROI(ele)) * 100 / deComma($scope.investment(ele))
		percentROI = $scope.shares[ele.id] && $scope.cost[ele.id] ? percentROI : null
		return percentROI
	}

	function tInvestment() {
		var total = 0
		$scope.list.forEach(function (el, i){ total = total + $scope.investment(el)	})
		return total
	}

	function tValue() {
		var total = 0
		$scope.list.forEach(function (el, i){ total = total + $scope.value(el)	})
		return total
	}

	function tROI() {
		var total = 0
		$scope.list.forEach(function (el, i){ total = total + $scope.ROI(el) })
		return total
	}

	function tPercentROI() {
		var total = 0
		total = $scope.tROI() * 100 / $scope.tInvestment()
		return total ? total : null
	}

	function addSymbol($event) {
		if ($event.keyCode !== 13) { return }
		var syms = $scope.symbol.toUpperCase().replace(/ /g, "").split(",")
		//emptying the input box
		$scope.symbol = ""
		syms = syms.filter(function (el, i) { return el.trim() !== "" && syms.indexOf(el) === i })
		bg.inputSyms = bg.inputSyms.concat(syms)
		chrome.extension.sendRequest({action: "getData", interval: 5})
	}

	function delRow(ele) {
		$scope.list.splice($scope.list.indexOf(ele), 1)
		delete bg.symbols[ele.id]
		delete $scope.shares[ele.id]
		delete $scope.cost[ele.id]
		delete $scope.target[ele.id]
		delete $scope.stoploss[ele.id]
		saveLocal()
	}

	function beforeUnload() {
		chrome.extension.sendRequest({action: "getData", interval: 60})
		bg.symbols = {}
		$scope.list.forEach(function (el, i) { bg.symbols[el.id] = el.e + ":" + el.t })
		saveLocal()
	}
	
	function saveLocal() {
		//saving prefs in localStorage
		if ($scope.list.length === 0) {
			localStorage.removeItem("symbols")
			localStorage.removeItem("cost")
			localStorage.removeItem("target")
			localStorage.removeItem("stoploss")
			localStorage.removeItem("shares")
			return
		}
		localStorage.symbols 	= JSON.stringify(bg.symbols)
		localStorage.cost 		= JSON.stringify($scope.cost)
		localStorage.shares 	= JSON.stringify($scope.shares)
		localStorage.stoploss 	= JSON.stringify($scope.stoploss)
		localStorage.target 	= JSON.stringify($scope.target)
	}

}

function colorUp() {
	return {
		restrict: "A",
		link: linkFunc
	}

	function linkFunc (scope, element, attributes) {
		//adding an event handler to see elements' value changes
		element.on("DOMSubtreeModified", onValChange)

		function onValChange () {
			var eleVal = deComma(element.text())
			var color  = (eleVal > 0) ? "green": (eleVal < 0) ? "red": ""
			element.attr("class", "ng-binding " + color)
		}
	}
}

function contentEditable() {
	return {
		restrict: "A",
		require:"ngModel",
		link: linkFunc
	}

	function linkFunc(scope, element, attributes, ngModelController) {

		element.on("keypress", function (key) {
			//for Keypress event for enter key only
			if (key.keyCode === 13) { key.preventDefault(); element[0].blur() }
		})
		//triggering update of the ViewModel
		element.on("change blur", function () { 
			scope.$apply(updateViewModel)
		})

		function updateViewModel() {
			var htmlValue = element.text()
			ngModelController.$setViewValue(htmlValue)
		}
		//triggering update of html
		ngModelController.$render = updateHtmlValue

		function updateHtmlValue() {
			var viewModelValue = ngModelController.$viewValue
			// As undefined value won't update the html (leaving it with the current value),
			// so I am using empty string instead.
			viewModelValue = viewModelValue ? viewModelValue : ""
			element.text(viewModelValue)
		}

	}	
}

//requesting data after loading the angular stuff
chrome.extension.sendRequest({action: "getData", interval: parseInt(localStorage.interval)})

chrome.extension.onRequest.addListener(function (request) {
	var scope = angular.element($('[ng-app]')).scope()	//thats how we can refer App Scope outside the App Scope or Controller
	
	if (request.action === "updateView") {
		
		scope.$apply(function () { scope.list = bg.stockData })
		scope.list.forEach(function (el, i) { bg.symbols[el.id] = el.e + ":" + el.t })

	} else if (request.action === "updateTS") {
		
		scope.$apply(function () {
			scope.target   = bg.target
			scope.stoploss = bg.stoploss
		})

	}
})

function print() { console.log.apply(console, arguments) }
function deComma(text) { return (text ? (text+"").replace(/,/g, "") : "") }

//something are done without angular and with normal jQuery and Javascript
$("#input a:eq(0)").click(addToggle)
$("#input a:eq(1)").click(optionsToggle)

function addToggle() {
	if ($(this).text() === "Add!") {
		$("#symbols").removeAttr("style")
		$("#buttons a:eq(1)").css("display","none")		//hiding options button
		$(this).text("Hide!")
	} else if ($(this).text() === "Hide!") {
		$("#symbols").css("display", "none")
		$("#buttons a:eq(1)").removeAttr("style")		//displaying options button
		$(this).text("Add!")
	}
}

function optionsToggle() {
	if ($(this).text() === "Options") {
		$("#boxes div").removeAttr("style")
		$("#buttons a:eq(0)").css("display","none")		//hiding add button
		$(this).text("Hide!")
	} else if ($(this).text() === "Hide!") {
		$("#boxes div").css("display", "none")
		$("#buttons a:eq(0)").removeAttr("style")		//displaying add button
		$(this).text("Options")
		chrome.extension.sendMessage({action: "getData", interval: parseInt(localStorage.interval)})
	}
}
