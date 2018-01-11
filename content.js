
/* Handle the request received by the extension. */
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {		
		sendResponse({ innerHTML: document.body.innerHTML });
	});
	