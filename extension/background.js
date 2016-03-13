var server = ""
// An external port object for using outside the onConnect function
var clonePort = new Port()
var portName = "channel"


// Listens for the connect() call in popup.js
chrome.runtime.onConnect.addListener( function (port) {
	console.log("Port name : " + port.name)

	port.onMessage.addListener( function(msg) {
		// Cloning the port object for use outside this function
		clonePort = $.extend(true, {}, port)

		console.log(msg.meet)
		port.postMessage({reply: "Marty to Marty"})

		// Listener for when a file is sent
		if (msg.type == "file") {
			// We recieve the file which has been encoded as a JSON string and we must re-encode it into a file object and send to webtorrent
			setupWorker()
		}
		else if (msg.type == "hash") {
			var hash = msg.data
			getMagnet(hash)
		}
	})
})

function setupWorker() {
	if (!!worker)
			var worker = new SharedWorker('worker.js')
	worker.port.addEventListener("message", onWorkerMessage, false)
	worker.port.start()
}

function onWorkerMessage(evt) {
	var file = evt.data

	if (!!client)
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
	// If client has not been previously created
	if (!!client)
		var client = new WebTorrent()

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