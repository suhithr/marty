// Open a long-lived connections with the background page
var port = chrome.runtime.connect({name: "channel"});

port.postMessage({meet: "Nice to meet you marty"});
port.onMessage.addListener( function(msg) {
	console.log(msg.reply);
});

// Send a message with type file to trigger activation of shared worker in background
function onUpload(files) {
	var file = files[0]
	
	port.postMessage({type: "file"})
	if (!!worker)
		var worker = new SharedWorker('worker.js')
	worker.port.addEventListener("message", onWorkerMessage, false)
	worker.port.start()

	worker.postMessage(file)
}

$('#file').change( function() {
    onUpload(this.files)
})

function onWorkerMessage(evt){
   alert("Message received from the worker: " + evt.data)
}
