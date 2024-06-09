// ==UserScript==
// @name         Remove YouTube ads
// @namespace    http://tampermonkey.net/
// @version      7
// @description  Remove ads and disable the message banning ad blockers!
// @author       NG_NOXLVE
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @updateURL    https://github.com/NOXLVE/Remove-ads-YouTube/raw/update-script/Remove%20YouTube%20ads-0.1.user.js
// @downloadURL  https://github.com/NOXLVE/Remove-ads-YouTube/raw/update-script/Remove%20YouTube%20ads-0.1.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Config
    const adblocker = true;
    const removePopup = true;
    const debugMessages = true;

    const logDebug = (message) => { if (debugMessages) console.log(`Remove Adblock Thing: ${message}`); };

    // Setup
    logDebug("Script started");

    if (adblocker) removeAds();
    if (removePopup) popupRemover();

    function popupRemover() {
        setInterval(() => {
            const modalOverlay = document.querySelector("tp-yt-iron-overlay-backdrop");
            const popup = document.querySelector(".style-scope ytd-enforcement-message-view-model");
            const popupButton = document.getElementById("dismiss-button");

            var video = document.querySelector('video');

            const bodyStyle = document.body.style;
            bodyStyle.setProperty('overflow-y', 'auto', 'important');

            if (modalOverlay) {
                modalOverlay.removeAttribute("opened");
                modalOverlay.remove();
            }

            if (popup) {
                logDebug("Popup detected, removing...");

                if(popupButton) popupButton.click();

                popup.remove();
                video.play();

                setTimeout(() => {
                    video.play();
                }, 500);

                logDebug("Popup removed");
            }
        }, 1000);
    }

    function removeAds() {
        logDebug("removeAds()");

        setInterval(() =>{

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

                if (video) {
                    video.playbackRate = 16; // Augmenter la vitesse pour passer l'annonce plus rapidement
                    video.currentTime = video.duration || 0; // Aller à la fin de la vidéo
                    video.volume = 0; // Désactiver le son de la vidéo
                }

                skipBtn?.click();

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

            // Vérifier périodiquement si la vidéo est en pause et la maintenir en pause si c'est le cas
            const video = document.querySelector('video');
            if (video && video.paused) {
                video.pause();
            }
        }, 1000);
    }

})();
