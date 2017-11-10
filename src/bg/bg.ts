import { QuoteService } from "./lib/service"

const QuoteSrv = window["QuoteSrv"] = new QuoteService()

chrome.runtime.onMessage.addListener(onMessage)

function onMessage(msg: any, sender: chrome.runtime.MessageSender, reply: (msg: any) => void) {
   switch (msg.action) {
      case "Add":
         QuoteSrv.addSymbol(<Array<string>>msg.symbols, reply)
         break
      case "Del":
         QuoteSrv.delSymbol(msg.symbol, reply)
         break
      case "Get":
         QuoteSrv.getData(reply)
         break
      case "Update":
         QuoteSrv.update(msg)
         break
      case "ApiKey":
         QuoteSrv.updateApiKey(msg)
         break
      case "UpdateInterval":
         QuoteSrv.updateInterval(msg)
         break
   }
   return true // this means reply will be called asynchronously
}