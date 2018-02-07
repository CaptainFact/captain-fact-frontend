# Installation

The application is available on the
[Chrome Web Store](https://chrome.google.com/webstore/detail/captainfact-beta/fnnhlmbnlbgomamcolcpgncflofhjckm)
and for [Firefox](https://addons.mozilla.org/en-US/firefox/addon/captainfact/)

# Source code

CaptainFact's extension is fully open sourced (GPL3/AGPL3). The main repository is available here:
* https://github.com/CaptainFact/captain-fact-extension

The extension also make use of another internal project which injects facts into HTML videos in javascript:
* https://github.com/CaptainFact/captain-fact-overlay-injector

# FAQ

## Why do you need storage permissions ?

We store a local cache of videos ids that exist on CaptainFact. This cache gets updated when you visit Youtube
if it's older than 15 minutes. This is a privacy improvement that guarantees we don't track the videos you're 
watching and don't send unnecessary requests.

## Why do you need tabs permissions ?

Because we inject script programmatically from background (only if video is known from cache) and
to be able to disable CaptainFact on all tabs when you unselect it from extension popup.

You can check by yourself in `chrome/extension/background.js` (look for `chrome.tabs.`)

## Why do you need Youtube permissions ?

To be able to inject the facts overlay on Youtube videos.

## Why do you only inject on youtube.com and not in embedded players everywhere else ?

We may want to implement this in a separate release in the future. We don't want to implement
this feature in main extension cause it means asking for permissions to access all your sites. 

## Can I add sources on videos directly from the extension ?
 
Not at the moment.