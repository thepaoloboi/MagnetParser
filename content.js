function extractNodes(document) {
	return document.evaluate("//a[contains(@href,'magnet:')]", document, null, XPathResult.ANY_TYPE, null);
}

function extractHrefStringsFromNodes(nodes) {

	var node, hrefStrings = [];
  
	while (node = nodes.iterateNext()) {
		hrefStrings.push(node.getAttribute('href'));
	}

	return hrefStrings;
}

/* Handle the request received by the extension. */
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		var extractedNodes = extractNodes(document);

		var hrefStrings = extractHrefStringsFromNodes(extractedNodes);

		sendResponse({ hrefs: hrefStrings });
	});
	