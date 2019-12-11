/**
 * Set browser action(on toolbar) badge state, 
 * Visually shows user if web-extenson is active 
 * on that tab or not.
 */
function setBadgeState(state, tab) {
	if (state === 'on') {
			browser.browserAction.setBadgeText({
				text: 'on',
				tabId: tab.id
			});
			browser.browserAction.setBadgeBackgroundColor({
				'color':'green',
				tabId: tab.id
			})
	} else if (state === 'off') {
		browser.browserAction.setBadgeText({
			text: '',
			tabId: tab.id
		});
	}
	
}
/**
 * Toggles extension on or off inside each individual tab
 * Tries to inject content script. If already injected, 
 * gets extensions active state on the tab. And toggles based on * that 'result' response. 
 * otherwise if script not previously injected (hasRun) enable
 * extension on that tab.
 */
function toggleEnableTab(tab) {
	browser.tabs.executeScript(tab.id, {
		file: "/content_scripts/cloud-explorer.js"
	}).then(results => {
		console.log(results); //debugging
		let msg = {}
		if (results[0] === undefined) {
			//has not run before
			//inject css here..
			msg.enableExtension = true;
//			setBadgeState('on', tab.id);
		} else if (results[0].isEnabled === true) {
			//has run and is enabled on tab
			msg.enableExtension = false;
		} else if (results[0].isEnabled === false) {
			//has run and is not enabled on tab
			msg.enableExtension = true;
		}
		browser.tabs.sendMessage(tab.id, msg);
	});
}

/**
 * Listen for clicks on toolbar browser action,
 * And toggle extension on/off on that tab
 */
browser.browserAction.onClicked.addListener(toggleEnableTab);

/**
 * Listen for messages from tabs, and set browser 
 * action badge state on that tab from response. 
 */
browser.runtime.onMessage.addListener(function(msg, sender, sendResponse){
	const newBadgeState = msg.setBadge,
			tab = sender.tab;
	setBadgeState(newBadgeState, tab);
})