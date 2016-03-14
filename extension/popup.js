window.addEventListener("message", readFromBackground, false)

function handleFileSelect(evt) {
	evt.stopPropagation() 
	evt.preventDefault() 

  	var files = evt.dataTransfer.files  // FileList object.

  	// files is a FileList of File objects. List some properties.
  	var output = [] 
  	for (var i = 0, f  f = files[i]  i++) {
  		output.push('<li><strong>', escape(f.name)) 
  	}
  	onUpload(files)
  	document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>' 
}

function handleDragOver(evt) {
	evt.stopPropagation() 
	evt.preventDefault() 
  	evt.dataTransfer.dropEffect = 'copy'  // Explicitly show this is a copy.
}

// Setup the dnd listeners.
var dropZone = document.getElementById('file') 
dropZone.addEventListener('dragover', handleDragOver, false) 
dropZone.addEventListener('drop', handleFileSelect, false) 

var linkInput = document.getElementById("link")
linkInput.addEventListener("keydown", function (e) {
	if (e.keyCode == 13) {
		sendToBackground({link: linkInput.value})
	}
})


// Send a message with type file to trigger activation of shared worker in background
function onUpload(files) {
	var file = files[0]
	console.log("sending to background")
	// Sending the file to background
	sendToBackground(file)
}

function processHashUrl(link) {
	console.log(link)
	$('#hash').text(link)
}

function processBlobURL(url) {
	console.log("Modding the DOM")
	$("#download").html("<a href=" + url + ">Download</a>")
}

function readFromBackground(evt) {
	if (evt.data.link != undefined)
		processHashUrl(evt.data.link)
	if (evt.data.BlobURL != undefined)
		processBlobURL(evt.data.BlobURL)
}

function sendToBackground(data) {

	chrome.runtime.getBackgroundPage(function (backgroundPage) {
		backgroundPage.postMessage(data, "*")
	})
}