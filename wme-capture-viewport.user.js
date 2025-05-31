// ==UserScript==
// @name         WME Capture Viewport
// @namespace    https://github.com/gncnpk/wme-capture-viewport
// @version      0.1
// @description  Captures the viewport in WME and appends it to the page.
// @author       Gavin Canon-Phratsachack (https://github.com/gncnpk)
// @match               https://beta.waze.com/*editor*
// @match               https://www.waze.com/*editor*
// @exclude             https://www.waze.com/*user/*editor/*
// @exclude             https://www.waze.com/discuss/*
// @license      MIT
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // the sdk init function will be available after the SDK is initialized
    window.SDK_INITIALIZED.then(initScript);
    let viewPortElement;
    function initScript() {
        const wmeSDK = getWmeSdk({scriptId: "wme-capture-viewport", scriptName: "Capture Viewport"});
        let js = document.createElement("script");
        js.type = "text/javascript";
        js.src = "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
        document.head.appendChild(js);
        viewPortElement = wmeSDK.Map.getMapViewportElement().id
        let viewPortChildren = document.getElementById("OpenLayers_Map_136_OpenLayers_ViewPort").children;
        for(let i = 1; i < viewPortChildren.length; i++) {
        viewPortChildren[i].setAttribute("data-html2canvas-ignore", "")
        }
    }
    function capturePreview(viewPortElement) {
        html2canvas(document.querySelector(`#${viewPortElement}`), {allowTaint:true, useCors:true}).then(canvas => {
            document.body.append(canvas)
        });
    }
})();
