var buttonExtract;
var buttonCopyToClipboard;
var textAreaMagnetContainer;

function handleButtonExtract_click(hrefs) {

  var text = generateTextContent(hrefs);

  fillTextArea(text);

  toggleCopiedMessagetext(true);
}

function generateTextContent(magnetLinks) {
	var collector;

	collector = "";

	if(magnetLinks != null)
	{
		for(var i = 0; i < magnetLinks.length; i++) {
			collector = collector + magnetLinks[i] + "\n\n";
		};
  }
  
  return collector;	
}

function fillTextArea(textContent) {
	textAreaMagnetContainer.value = textContent;

	textAreaMagnetContainer.dispatchEvent(new Event('keyup'));
}

function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");

  //
  // *** This styling is an extra step which is likely not required. ***
  //
  // Why is it here? To ensure:
  // 1. the element is able to have focus and selection.
  // 2. if element was to flash render it has minimal visual impact.
  // 3. less flakyness with selection and copying which **might** occur if
  //    the textarea element is not visible.
  //
  // The likelihood is the element won't even render, not even a flash,
  // so some of these are just precautions. However in IE the element
  // is visible whilst the popup box asking the user for permission for
  // the web page to copy to the clipboard.
  //

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = 'transparent';

  textArea.value = text;

  document.body.appendChild(textArea);

  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }

  document.body.removeChild(textArea);

  toggleCopiedMessagetext(false);
}

function enableButtonCopyToClipboard()
{
	buttonCopyToClipboard.disabled = (textAreaMagnetContainer.value == "");
}

function toggleCopiedMessagetext(hide) {
  document.getElementById('copiedMessageText').style.display = hide == true ? "none" : "inline";
}

/* -- -- -- -- -- -- -- -- */

document.addEventListener('DOMContentLoaded', () => {

	buttonExtract = document.getElementById('buttonExtract');
  buttonCopyToClipboard = document.getElementById('buttonCopyToClip');
	textAreaMagnetContainer = document.getElementById('magnetContainer');

	buttonExtract.addEventListener('click', function() {
		chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
				handleButtonExtract_click(response.hrefs);
			});
		});
	});

	buttonCopyToClipboard.addEventListener('click', function() {
		copyTextToClipboard(textAreaMagnetContainer.value);
	});

	textAreaMagnetContainer.addEventListener('keyup', function() {
		enableButtonCopyToClipboard();
		console.log('changed');
	});

	enableButtonCopyToClipboard();
});
