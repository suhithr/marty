// Listens for the connect() call in popup.js
chrome.runtime.onConnect.addListener( function(port) {
	console.log("Port name : " + port.name);

	port.onMessage.addListener( function(msg) {
		console.log(msg.meet);
		port.postMessage({reply: "Marty to Marty"});

		// Listener for when a file is sent
		if (msg.type == "file") {
			// We recieve the file which has been encoded as a JSON string and we must re-encode it into a file object and send to webtorrent
		}
	});
});