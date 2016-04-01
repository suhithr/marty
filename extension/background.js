var server = "http://415b1a40.ngrok.com"

var portName = "channel"

var popupPage

chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
	chrome.tabs.sendMessage(tabs[0].id, {action: "toggle"});
	});
});


window.addEventListener("message", receiveMessage, false)

function receiveMessage(evt) {
	if (evt.data.link == undefined)
		uploadFile(evt.data)
	else
		getMagnet(evt.data.link)
}

function uploadFile(file) {

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

				popupPage = chrome.extension.getViews({type: 'popup'})[0];
				console.log(popupPage)
				// Send data to popup
				popupPage.postMessage( {link: data["hash"]}, "*")
			}
		})

	})
}

// Fetches the magnet link from the server and calls download function
function getMagnet(link) {
	// Get magnet URL from server
	$.ajax({
		url: server + '/magnet',
		processData: true,
		type: "POST",
		async: true,
		mimeType: "application/json",
		cache: false,
		data: {"hash": link},
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
	console.log("downloading")
	// If client has not been previously created
	if (!!client || client == undefined)
		client = new WebTorrent()

	client.add(magnet, function(torrent) {
		// We will assume the torrent only contains the first file and take it
		var file = torrent.files[0]
		var fileURL = file.getBlobURL( function(err, url) {
			if (err) throw err

			popupPage = chrome.extension.getViews({type: 'popup'})[0];
			popupPage.postMessage({BlobURL: url}, "*")

		})
	})
}