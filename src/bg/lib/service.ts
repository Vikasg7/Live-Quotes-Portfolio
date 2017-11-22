import "thenForEach"

export class QuoteService {
   private _data: Array<any>   
   public  apiKey: string
   private _updateIntervalInSec: number
   private _updateIntervalRef: NodeJS.Timer
   private _waitInSec: number
   private _tAudio: HTMLAudioElement
   private _sAudio: HTMLAudioElement

   constructor() {
      this._data = localStorage["data"] ? JSON.parse(localStorage.getItem("data")) : []
      this.apiKey = localStorage["apiKey"] || "2O6O8VPLX4F6IYNC"
      this._updateIntervalInSec = parseFloat(localStorage["updateInterval"]) || 60
      this._updateIntervalRef = setInterval(() => this._updateQuotes(), this._updateIntervalInSec * 1000)
      this._waitInSec = 2
      // Updating quotes on load
      this._updateQuotes()
      this._tAudio = new Audio("../../../assets/target.mp3")
      this._sAudio = new Audio("../../../assets/stoploss.mp3")
   } 

   private _getQuotes(q: string): Promise<any> {
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${q}&datatype=json&apikey=${this.apiKey}`
      return fetch(url)
         .then((resp) => resp.status >= 400 ? Promise.reject(`${resp.status} - ${resp.statusText}`) : resp.text())
         .then((text: string) => JSON.parse(text))
         .then((j: any) => {
            const dates = Object.keys(j["Time Series (Daily)"])
            const today = dates[0]
            const lastDay = dates[1]
            const price = parseFloat(j["Time Series (Daily)"][today]["4. close"])
            const open = parseFloat(j["Time Series (Daily)"][lastDay]["4. close"])
            return {price, open}
         })
   }

   public addSymbol(symbols: Array<string>, reply: (value: any) => void): Promise<void> {
      return Promise.resolve(symbols)
         .thenForEach<string>((symbol) => {
            // Checking if symbol is already present
            if (this._data.findIndex((j, i) => j.symbol === symbol) > -1) {
               this._reportError(`${symbol} is a already present`)
            } else {
               return this._getQuotes(symbol.trim())
                  .then((resp: any) => {
                     resp.symbol = symbol
                     resp.cost = 0
                     resp.shares = 0
                     this._data.push(resp)
                  })
                  .catch((error: any) => this._reportError(`${symbol} -> ${error}`))
            }
         })
         .then(() => reply(this._data))
         .then(() => this._saveData())
   }

   public delSymbol(symbol: string, reply: (value: any) => void) {
      const i = this._data.findIndex((j, i) => j.symbol === symbol)
      if (i >= 0) this._data.splice(i, 1)
      reply(this._data)
      this._saveData()
   }
   
   public getData(reply: (value: any) => void) {
      reply(this._data)
   }
   
   // For updating cost, shares, target and stoploss
   public update(msg: any) {
      const i = this._data.findIndex((j, i) => j.symbol === msg.symbol)
      this._data[i][msg.prop] = msg.value
      this._saveData()
   }

   public updateInterval(msg: any) {
      this._updateIntervalInSec = parseFloat(msg.updateInterval)
      clearInterval(this._updateIntervalRef)
      this._updateIntervalRef = setInterval(() => this._updateQuotes(), this._updateIntervalInSec * 1000)
      this._reportError("Interval updated!")
   }
   
   public updateApiKey(msg: any) {
      this.apiKey = msg.apiKey
      this._reportError("API Key updated!")
   }

   private _reportError(errMsg: string) {
      chrome.runtime.sendMessage({action: "ReportError", error: errMsg})
   }

   private _updateQuotes() {
      if (this._stopUpdate()) { console.log("Market is closed. Can't fetch!"); return }
      return Promise.resolve(this._data.entries())
         .thenForEach<any>((item) => {
            const stock = item[1]
            return this._getQuotes(stock.symbol)
               .then((resp: any) => {
                  stock.price = resp.price
                  stock.open = resp.open
               })
               .catch((error: any) => this._reportError(`${stock.symbol} -> ${error}`))
               .then(() => this._wait())
         })
         .then(() => this._checkTS())
   }

   private _wait() {
      return new Promise<void>((resolve, reject) => setTimeout(resolve, this._waitInSec * 1000))
   }

   private _saveData() {
      localStorage.setItem("data", JSON.stringify(this._data))
   }

   private _notify(trSl: string, item: any) {
      const symbol = item.symbol
      var opt = {
         icon: "../../../assets/" + trSl.toLowerCase() + ".png",
         body: `${symbol} has hit ${trSl} of ${item[trSl]}`
      }
      var title = trSl.toUpperCase() + " hit!!"
      var notification = new Notification(title, opt)
      notification.onshow = () => {
         if (trSl == "target") { this._tAudio.play() } else { this._sAudio.play() }
      }
   }

   private _checkTS() {
      this._data.forEach((item: any, i) => {
         const price = parseFloat(item.price || 0)
         const target = parseFloat(item.target || 0)
         const stoploss = parseFloat(item.stoploss || 0)
         if (item.target !== undefined && item.target !== "") {
            if (price >= target) { this._notify("target", item) }
         }
         if (item.stoploss !== undefined && item.stoploss !== "") {
            if (price <= stoploss) { this._notify("stoploss", item) }
         }
      })
   }

   private _stopUpdate() {
      let from = localStorage.from ? localStorage.from : 0
      let to = localStorage.to ? localStorage.to : 0
      let now = new Date().toLocaleTimeString("en-US", { hour12: false })
      now = now.length === 10 ? "0" + now : now

      from = from.length == 1 ? "0" + from : from
      to = to.length == 1 ? "0" + to : to
      from = from + ":00:00"
      to = to + ":00:00"
      return !(now >= from && now <= to)   // returning false as don't stop update
   }
}