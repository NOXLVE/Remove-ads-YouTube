// ==UserScript==
// @name         Remove YouTube ads
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove ads and disable the message banning ad blockers!
// @author       NG_NOXLVE
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Config
    const adblocker = true;
    const removePopup = true;
    const debugMessages = true;

    const logDebug = (message) => { if (debugMessages) console.log(`Remove Adblock Thing: ${message}`); };

    const keyEvent = new KeyboardEvent("keydown", {
        key: "k",
        code: "KeyK",
        keyCode: 75,
        which: 75,
        bubbles: true,
        cancelable: true,
        view: window
    });

    const mouseEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window
    });

    let unpausedAfterSkip = 0;

    // Setup
    logDebug("Script started");

    if (adblocker) removeAds();
    if (removePopup) popupRemover();

    function popupRemover() {
        const observer = new MutationObserver(() => {
            const modalOverlay = document.querySelector("tp-yt-iron-overlay-backdrop");
            const popup = document.querySelector(".style-scope ytd-enforcement-message-view-model");
            const popupButton = document.getElementById("dismiss-button");
            const fullScreenButton = document.querySelector(".ytp-fullscreen-button");

            if (modalOverlay) {
                modalOverlay.removeAttribute("opened");
                modalOverlay.remove();
            }

            if (popup) {
                logDebug("Popup detected, removing...");

                popupButton?.click();
                popup.remove();
                unpausedAfterSkip = 2;

                // Fullscreen mode should not be triggered after removing the popup
                // fullScreenButton?.dispatchEvent(mouseEvent);

                setTimeout(() => {
                    // Avoid triggering fullscreen mode again after a delay
                    // fullScreenButton?.dispatchEvent(mouseEvent);
                }, 500);

                logDebug("Popup removed");
            }

            unPauseVideo(document.querySelector("#movie_player > video.html5-main-video"));
            unPauseVideo(document.querySelector("#movie_player > .html5-video-container > video"));
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function removeAds() {
        logDebug("removeAds()");

        const observer = new MutationObserver(() => {
            const ad = document.querySelector('.ad-showing');
            const adBlockMessage = document.querySelector('#dialog');

            if (adBlockMessage) {
                logDebug("Adblock message detected, removing...");
                adBlockMessage.remove();
            }

            if (ad) {
                logDebug("Found Ad");

                const video = document.querySelector('video');
                const skipBtn = document.querySelector('.videoAdUiSkipButton,.ytp-ad-skip-button');
                const nonVid = document.querySelector(".ytp-ad-skip-button-modern");

                if (video) {
                    video.playbackRate = 10;
                    video.volume = 0;
                    video.currentTime = video.duration || 0;
                    video.style.display = 'block'; // Ensure the video is visible
                }

                skipBtn?.click();
                nonVid?.click();

                logDebug("Skipped Ad (✔️)");
            }

            const adContainer = document.querySelector(".ad-container");
            if (adContainer) {
                logDebug("Ad container found, removing...");
                adContainer.style.display = 'none';
            }

            const videoAdPlayerOverlay = document.querySelector(".ytp-ad-player-overlay");
            if (videoAdPlayerOverlay) {
                logDebug("Ad player overlay found, removing...");
                videoAdPlayerOverlay.style.display = 'none';
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        removePageAds();
    }

    function removePageAds() {
        const style = document.createElement('style');
        style.textContent = `
            ytd-action-companion-ad-renderer,
            div#root.style-scope.ytd-display-ad-renderer.yt-simple-endpoint,
            div#sparkles-container.style-scope.ytd-promoted-sparkles-web-renderer,
            div#main-container.style-scope.ytd-promoted-video-renderer,
            ytd-in-feed-ad-layout-renderer,
            .ytd-video-masthead-ad-v3-renderer,
            div#player-ads.style-scope.ytd-watch-flexy,
            yt-about-this-ad-renderer,
            yt-mealbar-promo-renderer,
            #masthead-ad,
            #dialog,
            ytd-popup-container,
            tp-yt-paper-dialog {
                display: none !important;
            }

            .ad-container,
            .ytp-ad-player-overlay,
            .ytp-ad-module,
            .ytp-ad-overlay-container {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
        logDebug("Removed page ads (✔️)");
    }

    function unPauseVideo(video) {
        if (video && video.paused && unpausedAfterSkip > 0) {
            document.dispatchEvent(keyEvent);
            unpausedAfterSkip = 0;
            logDebug("Unpaused video using 'k' key");
        } else if (unpausedAfterSkip > 0) {
            unpausedAfterSkip--;
        }
    }
})();
