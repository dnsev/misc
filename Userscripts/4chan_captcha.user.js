// ==UserScript==
// @name        4chan NoScript Captcha
// @description Lets you bypass the copy-paste part by having it automatically done
// @namespace   dnsev
// @include     http://boards.4chan.org/*
// @include     https://boards.4chan.org/*
// @include     http://www.google.com/recaptcha/api/noscript*
// @include     https://www.google.com/recaptcha/api/noscript*
// @version     1.0
// @grant       none
// @run-at      document-start
// @updateURL   https://github.com/dnsev/misc/raw/master/Userscripts/4chan_captcha.user.js
// @downloadURL https://github.com/dnsev/misc/raw/master/Userscripts/4chan_captcha.user.js
// ==/UserScript==

(function () {
	"use strict";

	var is_google = (window.location.hostname.toLowerCase().indexOf("google") >= 0);

	// Run test
	var test_interval = setInterval(function () {
		if (document.readyState == "interactive" || document.readyState == "complete") {
			clearInterval(test_interval);
			run.call(null);
		}
	}, 50);

	// Execute
	var run = function () {
		if (is_google) {
			// Inject script
			var head = document.head,
				e = document.createElement("script");
			e.innerHTML = "(" + setup_google_internal.toString() + ")();";
			if (head) {
				head.appendChild(e);
				head.removeChild(e);
			}

			// Check for answer
			var textarea = document.querySelector("textarea");
			if (textarea) {
				// Good
				window.postMessage(JSON.stringify({
					captcha: textarea.value
				}), window.location);
			}
		}
		else {
			// Listen for captcha
			window.addEventListener("message", on_4chan_message, false);
		}
	};

	// This goes into a <script> tag
	var setup_google_internal = function () {
		// Pass the message on to 4chan
		var on_transfer_to_parent = function (event) {
			if (event.origin.indexOf("google") >= 0) {
				try {
					parent.postMessage(event.data, "*");
				}
				catch (e) {
					console.log("Error: " + e);
				}
			}
		};

		window.addEventListener("message", on_transfer_to_parent, false);
	};

	// Userscript message recieve, 4chan side
	var on_4chan_message = function (event) {
		if (event.origin.indexOf("google") >= 0) {
			var obj;
			try {
				obj = JSON.parse(event.data);
			}
			catch (e) {
				obj = null;
			}
			if (obj && "captcha" in obj) {
				var field = document.getElementById("recaptcha_challenge_field");
				if (field) {
					field.value = obj.captcha;
					field.style.outline = "2px solid #0080ff";
				}
			}
		}
	};

})();


