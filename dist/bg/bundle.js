(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = require("./lib/service");
const QuoteSrv = window["QuoteSrv"] = new service_1.QuoteService();
chrome.runtime.onMessage.addListener(onMessage);
function onMessage(msg, sender, reply) {
    switch (msg.action) {
        case "Add":
            QuoteSrv.addSymbol(msg.symbols, reply);
            break;
        case "Del":
            QuoteSrv.delSymbol(msg.symbol, reply);
            break;
        case "Get":
            QuoteSrv.getData(reply);
            break;
        case "Update":
            QuoteSrv.update(msg);
            break;
        case "ApiKey":
            QuoteSrv.updateApiKey(msg);
            break;
        case "UpdateInterval":
            QuoteSrv.updateInterval(msg);
            break;
    }
    return true; // this means reply will be called asynchronously
}

},{"./lib/service":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("thenForEach");
class QuoteService {
    constructor() {
        this._data = localStorage["data"] ? JSON.parse(localStorage.getItem("data")) : [];
        this.apiKey = localStorage["apiKey"] || "2O6O8VPLX4F6IYNC";
        this._updateIntervalInSec = parseFloat(localStorage["updateInterval"]) || 60;
        this._updateIntervalRef = setInterval(() => this._updateQuotes(), this._updateIntervalInSec * 1000);
        this._waitInSec = 2;
        // Updating quotes on load
        this._updateQuotes();
        this._tAudio = new Audio("../../../assets/target.mp3");
        this._sAudio = new Audio("../../../assets/stoploss.mp3");
    }
    _getQuotes(q) {
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${q}&datatype=json&apikey=${this.apiKey}`;
        return fetch(url)
            .then((resp) => resp.status >= 400 ? Promise.reject(`${resp.status} - ${resp.statusText}`) : resp.text())
            .then((text) => JSON.parse(text))
            .then((j) => {
            const dates = Object.keys(j["Time Series (Daily)"]);
            const today = dates[0];
            const lastDay = dates[1];
            const price = parseFloat(j["Time Series (Daily)"][today]["4. close"]);
            const open = parseFloat(j["Time Series (Daily)"][lastDay]["4. close"]);
            return { price, open };
        });
    }
    addSymbol(symbols, reply) {
        return Promise.resolve(symbols)
            .thenForEach((symbol) => {
            // Checking if symbol is already present
            if (this._data.findIndex((j, i) => j.symbol === symbol) > -1) {
                this._reportError(`${symbol} is a already present`);
            }
            else {
                return this._getQuotes(symbol.trim())
                    .then((resp) => {
                    resp.symbol = symbol;
                    resp.cost = 0;
                    resp.shares = 0;
                    this._data.push(resp);
                })
                    .catch((error) => this._reportError(`${symbol} -> ${error}`));
            }
        })
            .then(() => reply(this._data))
            .then(() => this._saveData());
    }
    delSymbol(symbol, reply) {
        const i = this._data.findIndex((j, i) => j.symbol === symbol);
        if (i >= 0)
            this._data.splice(i, 1);
        reply(this._data);
        this._saveData();
    }
    getData(reply) {
        reply(this._data);
    }
    // For updating cost, shares, target and stoploss
    update(msg) {
        const i = this._data.findIndex((j, i) => j.symbol === msg.symbol);
        this._data[i][msg.prop] = msg.value;
        this._saveData();
    }
    updateInterval(msg) {
        this._updateIntervalInSec = parseFloat(msg.updateInterval);
        clearInterval(this._updateIntervalRef);
        this._updateIntervalRef = setInterval(() => this._updateQuotes(), this._updateIntervalInSec * 1000);
        this._reportError("Interval updated!");
    }
    updateApiKey(msg) {
        this.apiKey = msg.apiKey;
        this._reportError("API Key updated!");
    }
    _reportError(errMsg) {
        chrome.runtime.sendMessage({ action: "ReportError", error: errMsg });
    }
    _updateQuotes() {
        if (this._stopUpdate()) {
            this._saveData(); // Saving the latest prices when update is stopped.
            console.log("Market is closed. Can't fetch!");
            return;
        }
        return Promise.resolve(this._data.entries())
            .thenForEach((item) => {
            const stock = item[1];
            return this._getQuotes(stock.symbol)
                .then((resp) => {
                stock.price = resp.price;
                stock.open = resp.open;
            })
                .catch((error) => this._reportError(`${stock.symbol} -> ${error}`))
                .then(() => this._wait());
        })
            .then(() => this._checkTS());
    }
    _wait() {
        return new Promise((resolve, reject) => setTimeout(resolve, this._waitInSec * 1000));
    }
    _saveData() {
        localStorage.setItem("data", JSON.stringify(this._data));
    }
    _notify(trSl, item) {
        const symbol = item.symbol;
        var opt = {
            icon: "../../../assets/" + trSl.toLowerCase() + ".png",
            body: `${symbol} has hit ${trSl} of ${item[trSl]}`
        };
        var title = trSl.toUpperCase() + " hit!!";
        var notification = new Notification(title, opt);
        notification.onshow = () => {
            if (trSl == "target") {
                this._tAudio.play();
            }
            else {
                this._sAudio.play();
            }
        };
    }
    _checkTS() {
        this._data.forEach((item, i) => {
            const price = parseFloat(item.price || 0);
            const target = parseFloat(item.target || 0);
            const stoploss = parseFloat(item.stoploss || 0);
            if (item.target !== undefined && item.target !== "") {
                if (price >= target) {
                    this._notify("target", item);
                }
            }
            if (item.stoploss !== undefined && item.stoploss !== "") {
                if (price <= stoploss) {
                    this._notify("stoploss", item);
                }
            }
        });
    }
    _stopUpdate() {
        let from = localStorage.from ? localStorage.from : 0;
        let to = localStorage.to ? localStorage.to : 0;
        let now = new Date().toLocaleTimeString("en-US", { hour12: false });
        now = now.length === 10 ? "0" + now : now;
        from = from.length == 1 ? "0" + from : from;
        to = to.length == 1 ? "0" + to : to;
        from = from + ":00:00";
        to = to + ":00:00";
        return !(now >= from && now <= to); // returning false as don't stop update
    }
}
exports.QuoteService = QuoteService;

},{"thenForEach":3}],3:[function(require,module,exports){
function thenForEach(doFn, context) {
    return this.then(validate).then(() => context);
    function validate(arrOrIterable) {
        let i = -1;
        if (arrOrIterable.context && arrOrIterable.arrOrIterable) {
            context = arrOrIterable.context;
            arrOrIterable = arrOrIterable.arrOrIterable;
        }
        if (Array.isArray(arrOrIterable)) {
            return iterateArr(arrOrIterable, i, context, doFn);
        }
        else if (typeof arrOrIterable[Symbol.iterator] === 'function') {
            return iterateIterable(arrOrIterable, i, context, doFn);
        }
        else {
            throw `Error: thenForEach must receive an array or iterable but ${typeof arrOrIterable} received.`;
        }
    }
}
function iterateArr(arr, i, context, doFn) {
    if (!arr.length)
        return;
    const item = arr.shift();
    return Promise.resolve(item)
        .then((item) => doFn(item, i += 1, context))
        .then((_continue) => _continue !== false && iterateArr(arr, i, context, doFn));
}
function iterateIterable(iterable, i, context, doFn) {
    const item = iterable.next();
    if (item.done)
        return;
    return Promise.resolve(item.value)
        .then((item) => doFn(item, i += 1, context))
        .then((_continue) => _continue !== false && iterateIterable(iterable, i, context, doFn));
}
// The pattern of extending global or third party class has been copied from rxjs/add/operator in angular2
Promise.prototype.thenForEach = thenForEach;

},{}]},{},[1]);
