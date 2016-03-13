// Open a long-lived connections with the background page
var port = chrome.runtime.connect({name: "channel"});

port.postMessage({meet: "Nice to meet you marty"});
port.onMessage.addListener( function(msg) {
	console.log(msg.reply);
});

// Send a message with type file to trigger activation of shared worker in background
function onUpload(files) {
	var file = files[0]
	
	// Sending the file to background
	chrome.runtime.getBackgroundPage(function (backgroundPage) {
		backgroundPage.postMessage(file, "*")
	})
}

function processHashUrl(event) {
	if(event.data.hash != undefined) {
		console.log(event.data.hash)
		$('#hash').text(event.data.hash)
	}
}	

$('#file').change( function() {
    onUpload(this.files)
})

window.addEventListener("message", processHashUrl, false)


