(function() {
	/**
	 * Check and set global guard variable
	 * If this content script is injected into the same page again,
	 * it will do nothing next time, but return current state to 
	 * background.js
	 */
	if (window.hasRun === true) {
		let response = {
			hasRun:window.hasRun,
			isEnabled:window.isEnabled 
		};
		return response;
	}
	//set global flags on first injection
	window.hasRun = true;
	window.isEnabled = false;
	
	function enableExtension(tabId){
		window.isEnabled = true;
		//send message to backround to change badge state
		browser.runtime.sendMessage({
			setBadge:'on'
		});
	}
	function disableExtension(tabId){
		window.isEnabled = false;
		//send message to backround to change badge state
		browser.runtime.sendMessage({
			setBadge:'off'
		});
	}
	function handleMessage(request, sender, sendResponse) {
		request.enableExtension ? enableExtension() : disableExtension();
		console.log(`isEnabled: ${window.isEnabled}`);
	}
	browser.runtime.onMessage.addListener(handleMessage)
})();