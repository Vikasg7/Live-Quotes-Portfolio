Object.prototype.values = function () {
	var obj = this
	var val = Object.keys(this).map(function (key) { return obj[key] })
	return val
 }

 var obj = {}
 console.log(obj.values())