// create an iframe for every tab, on **document_load**
// this will require a Chrome restart on installation of extension, look into this.

var iFrame  = document.createElement ("iframe")
iFrame.src  = chrome.extension.getURL ("popup.html")
iFrame.style = "position: fixed; top: 0px; right: 0px; z-index: 2147483647; transition: opacity 0.2s; height: 50%; width: 30%; visibility: hidden;"
iFrame.id = "marty"
document.body.insertBefore (iFrame, document.body.firstChild)

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
	if (msg.action == "toggle") {
		console.log(window.frames['marty'].style.visibility)
		if (window.frames['marty'].style.visibility == "hidden") 
			window.frames['marty'].style.visibility = "initial"
		else window.frames['marty'].style.visibility = "hidden"
	}
});


