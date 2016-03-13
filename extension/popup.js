// Open a long-lived connections with the background page
var port = chrome.runtime.connect({name: "channel"});

port.postMessage({meet: "Nice to meet you marty"});
port.onMessage.addListener( function(msg) {
	console.log(msg.reply);
});

// When we get the file we serialize it as a JSON string and send it as a message to background