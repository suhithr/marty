window.addEventListener("message", readFromBackground, false)


$('#file_input_file').change( function() {
    onUpload(this.files)
})

var linkInput = document.getElementById("link")
linkInput.addEventListener("keydown", function (e) {
	if (e.keyCode == 13) {
		sendToBackground({link: linkInput.value})
	}
})


// Send a message with type file to trigger activation of shared worker in background
function onUpload(files) {
	var file = files[0]
	
	// Sending the file to background
	sendToBackground(file)
}

function processHashUrl(link) {
	console.log(link)
	$('#hash').text(link)
}

function processBlobURL(url) {
	document.getElementById("download").setAttribute("href", url)
	document.getElementById("download").style.display = "inline"
}

function readFromBackground(evt) {
	if (evt.data.hash != undefined)
		processHashUrl(evt.data.link)
	if (evt.data.BlobURL != undefined)
		processBlobURL(evt.data.BlobURL)
}

function sendToBackground(data) {

	chrome.runtime.getBackgroundPage(function (backgroundPage) {
		backgroundPage.postMessage(data, "*")
	})
}