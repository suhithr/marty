var server = ""
// An external port object for using outside the onConnect function
var clonePort
var portName = "channel"



// Listens for the connect() call in popup.js
chrome.runtime.onConnect.addListener( function (port) {
	console.log("Port name : " + port.name)

	port.onMessage.addListener( function(msg) {
		// Cloning the port object for use outside this function
		clonePort = $.extend(true, {}, port)

		port.postMessage({reply: "Marty to Marty"})

		if (msg.type == "hash") {
			var hash = msg.data
			getMagnet(hash)
		}
	})
})


window.addEventListener("message", onWorkerMessage, false)

function onWorkerMessage(evt) {
	var file = evt.data
	console.log("received file : " + file)
	if (!!client || client == undefined)
		var client = new WebTorrent()
	client.seed(file, function(torrent) {

		$.ajax({
			url: server + '/url',
			processData: true,
			type: "POST",
			async: true,
			mimeType: "application/json",
			cache: false,
			data: {"uri": torrent.magnetURI},
			success: function(data, textStatus, jqXHR) {
				console.log(data);
				// Send the hash to popup.js
				// If the clonePort has been correctly cloned
				// Else we must try shared worker or setting up a new connection with a diff name
				if (clonePort.name == portName) {
					// We will send the dataURL to popup.js
					// If doesn't work we will send the file via SharedWorker
					console.log("sending hash")
					clonePort.postMessage({hash: data["hash"]})
				}
			}
		})

	})
}

// Fetches the magnet link from the server and calls download function
function getMagnet(hash) {
	// Get magnet URL from server
	$.ajax({
		url: server + '/magnet',
		processData: true,
		type: "POST",
		async: true,
		mimeType: "application/json",
		cache: false,
		data: {"hash": hash},
		success: function(data, textStatus, jqXHR) {
			console.log(data)
			var magnet = data["magnet"];
			console.log(magnet)
			downloadFile(magnet)
		},
	})
}

function downloadFile(magnet) {
	var client
	// If client has not been previously created
	if (!!client || client == undefined)
		client = new WebTorrent()

	client.add(magnet, function(torrent) {
		// We will assume the torrent only contains the first file and take it
		var file = torrent.files[0]
		var fileURL = file.getBlobURL( function(err, url) {
			if (err) throw err

			// If the clonePort has been correctly cloned 
			if (clonePort.name == portName) {
				// We will send the dataURL to popup.js
				// If doesn't work we will send the file via SharedWorker
				clonePort.postMessage({BlobURL: url})
			}
		})
	})
}