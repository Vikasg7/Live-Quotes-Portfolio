(function (document) {
   // Checking if the #myApp is already present
   const myApp = document.querySelector("#myApp")
   if (myApp) { return }
   
   const handle = new XMLHttpRequest()
   const url = chrome.extension.getURL("./dist/app/index.html")
   handle.open("GET", url, true)

   handle.onload = function (e) {
      const parent = document.createElement("div")
      parent.id = "myApp"
      // Updating scripts paths in the html 
      const html = handle.responseText.replace(/\.\//g, chrome.extension.getURL("/dist/app/"))
      parent.innerHTML = html
      document.body.appendChild(parent)
      console.info("div has been loaded!")
   }

   handle.send()

})(document)