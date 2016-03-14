var server = "http://415b1a40.ngrok.com"

var portName = "channel"

var popupPage

/*
	Check if enable-panel flag is on
	If not, display alert and open chrome://flags#enable-panels
	Else Open Marty as a Panel :D
*/

/*
	To check if panels are enabled refer: http://stackoverflow.com/a/13631643/4219775
*/

var _isPanelEnabled
var _isPanelEnabledQueue = []
function getPanelFlagState(callback) {
    if (typeof callback != 'function') throw Error('callback function required')
    if (typeof _isPanelEnabled == 'boolean') {
        callback(_isPanelEnabled) // Use cached result
        return
    }
    _isPanelEnabledQueue.push(callback)

    if (_isPanelEnabled == 'checking')
        return

    _isPanelEnabled = 'checking'
    chrome.windows.create({
        url: 'about:blank',
        type: 'panel'
    }, function(windowInfo) {
        _isPanelEnabled = windowInfo.alwaysOnTop
        chrome.windows.remove(windowInfo.id)

        // Handle all queued callbacks
        while (callback = _isPanelEnabledQueue.shift()) {
            callback(windowInfo.alwaysOnTop)
        }
    })
}

// Usage:
getPanelFlagState(function(isEnabled){})

chrome.browserAction.onClicked.addListener(function(tab) {
	if (_isPanelEnabled) {
    	chrome.windows.create({ url: "popup.html", type:"panel" })
	}
    else {
    	chrome.windows.create({ url: "chrome://flags#enable-panels", type:"popup" })
    	alert('Select Enabled from the dropdown under "Panels"')
    }
})

// upload and download torrents
window.addEventListener("message", receiveMessage, false)

function receiveMessage(evt) {
	if (evt.data.link == undefined)
		uploadFile(evt.data)
	else
		getMagnet(evt.data.link)
}

function uploadFile(file) {

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
				console.log(data)

				popupPage = chrome.extension.getViews()[1]
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
			var magnet = data["magnet"]
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

			popupPage = chrome.extension.getViews()[1]
			popupPage.postMessage({BlobURL: url}, "*")

		})
	})
}