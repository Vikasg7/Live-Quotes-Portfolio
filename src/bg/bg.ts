import { QuoteService } from "./QuoteService";

const QuoteSrv = window["QuoteSrv"] = new QuoteService()

chrome.runtime.onMessage.addListener(onMessage)

function onMessage(msg: any, sender: any, reply: (resp: any) => void) {

   switch (msg.action) {

      case "add":
         QuoteSrv.add(msg.symbol).then(reply)
         break

      case "del":
         reply(QuoteSrv.del(msg.id))
         break

      case "update":
         reply(QuoteSrv.update(msg.q))
         break

      case "get":
         reply(QuoteSrv.get())
         break

      case "apiKey": 
         QuoteSrv.updateApiKey(msg.apiKey)
         break

      case "refreshInterval": 
         QuoteSrv.updateRefreshInterval(msg.refreshInterval)
         break

   }

   return true // this means reply method will be called asynchronously
}