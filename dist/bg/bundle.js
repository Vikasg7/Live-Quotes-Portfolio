(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QuoteService {
    constructor() {
        this._data = localStorage["data"] ? JSON.parse(localStorage.getItem("data")) : [];
        this.apiKey = localStorage["apiKey"] || "2O6O8VPLX4F6IYNC";
        this._refreshIntervalInSec = parseFloat(localStorage["updateInterval"]) || 60;
        this._refreshIntervalRef = setInterval(() => this._refresh(), this._refreshIntervalInSec * 1000);
        this._waitInSec = 2;
        this._tAudio = new Audio("dist/assets/target.mp3");
        this._sAudio = new Audio("dist/assets/stoploss.mp3");
        this._refresh();
    }
    async _get(symbol) {
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&datatype=json&apikey=${this.apiKey}`;
        const resp = await fetch(url);
        if (resp.status >= 400) {
            throw new Error(`${resp.status} - ${resp.statusText}`);
        }
        const j = JSON.parse(await resp.text());
        const dates = Object.keys(j["Time Series (Daily)"]);
        const today = dates[0];
        const lastDay = dates[1];
        const price = parseFloat(j["Time Series (Daily)"][today]["4. close"]);
        const open = parseFloat(j["Time Series (Daily)"][lastDay]["4. close"]);
        return { price, open };
    }
    async add(symbol) {
        try {
            const { price, open } = await this._get(symbol);
            const q = {
                id: Date.now(),
                price,
                open,
                target: undefined,
                stoploss: undefined,
                cost: 0,
                shares: 0,
                symbol
            };
            this._data.push(q);
            this._saveData();
            this._log(`${symbol} added!`);
            return this._data;
        }
        catch (e) {
            this._log(`Can't add ${symbol}.`);
        }
    }
    del(id) {
        const i = this._data.findIndex((j, i) => j.id === id);
        if (i < 0)
            return;
        const q = this._data.splice(i, 1);
        this._saveData();
        this._log(`${q[0].symbol} deleted!`);
        return this._data;
    }
    update(q) {
        const i = this._data.findIndex((j, i) => j.id === q.id);
        if (i < 0)
            return;
        this._data.splice(i, 1, q);
        this._saveData();
        this._log(`${q.symbol} updated!`);
        return this._data;
    }
    async _refresh() {
        if (this._stopUpdate()) {
            this._saveData();
            return;
        }
        const len = this._data.length;
        for (let i = 0; i < len; i++) {
            const q = this._data[i];
            try {
                const { price, open } = await this._get(q.symbol);
                q.price = price;
                q.open = open;
            }
            catch (e) {
                this._log(`${q.symbol} -> ${e.toString()}`);
            }
            await this._wait();
        }
        chrome.runtime.sendMessage({ action: "data", data: this._data });
        this._checkTS();
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
    _notify(trSl, item) {
        const symbol = item.symbol;
        var opt = {
            icon: "dist/assets/" + trSl.toLowerCase() + ".png",
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
    _wait() {
        return new Promise((resolve, reject) => setTimeout(resolve, this._waitInSec * 1000));
    }
    _saveData() {
        localStorage.setItem("data", JSON.stringify(this._data));
    }
    _log(msg) {
        chrome.runtime.sendMessage({ action: "log", status: msg });
    }
    get() {
        return this._data;
    }
    updateApiKey(apiKey) {
        this.apiKey = apiKey;
        this._log("API Key updated!");
    }
    updateRefreshInterval(refreshInterval) {
        this._refreshIntervalInSec = parseFloat(refreshInterval);
        clearInterval(this._refreshIntervalRef);
        this._refreshIntervalRef = setInterval(() => this._refresh(), this._refreshIntervalInSec * 1000);
        this._log("Interval updated!");
    }
}
exports.QuoteService = QuoteService;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuoteService_1 = require("./QuoteService");
const QuoteSrv = window["QuoteSrv"] = new QuoteService_1.QuoteService();
chrome.runtime.onMessage.addListener(onMessage);
function onMessage(msg, sender, reply) {
    switch (msg.action) {
        case "add":
            QuoteSrv.add(msg.symbol).then(reply);
            break;
        case "del":
            reply(QuoteSrv.del(msg.id));
            break;
        case "update":
            reply(QuoteSrv.update(msg.q));
            break;
        case "get":
            reply(QuoteSrv.get());
            break;
        case "apiKey":
            QuoteSrv.updateApiKey(msg.apiKey);
            break;
        case "refreshInterval":
            QuoteSrv.updateRefreshInterval(msg.refreshInterval);
            break;
    }
    return true; // this means reply method will be called asynchronously
}

},{"./QuoteService":1}]},{},[2]);
