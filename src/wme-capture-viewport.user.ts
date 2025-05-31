// ==UserScript==
// @name         WME Capture Viewport
// @namespace    https://github.com/gncnpk/wme-capture-viewport
// @version      0.0.2
// @description  Captures the viewport in WME and appends it to the page.
// @author       Gavin Canon-Phratsachack (https://github.com/gncnpk)
// @match        https://beta.waze.com/*editor*
// @match        https://www.waze.com/*editor*
// @exclude      https://www.waze.com/*user/*editor/*
// @exclude      https://www.waze.com/discuss/*
// @license      MIT
// @grant        none
// ==/UserScript==
/// <reference types="wme-sdk-typings" />

(async function () {
  'use strict';
  // the sdk init function will be available after the SDK is initialized
  window.SDK_INITIALIZED.then(initScript);
  let viewPortElement: HTMLElement;
  let imgCanvas: HTMLCanvasElement;
  let imgCap;
  let frame;
  let imgBlob;
  let clipboardImgData;
  let track: MediaStreamTrack;
  function initScript() {
    if (!window.getWmeSdk) {
      console.error("WME SDK not found. Please ensure the WME SDK is loaded before this script.");
      return;
    }
    const wmeSDK = window.getWmeSdk({ scriptId: "wme-capture-viewport", scriptName: "Capture Viewport" });
    viewPortElement = wmeSDK.Map.getMapViewportElement()
    viewPortElement.style.cssText += 'isolation: isolate;transform-style: flat';
    imgCanvas = document.createElement("canvas")
  }
  async function startElementCapture() {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      // @ts-ignore
      preferCurrentTab: true,
    });
    [track] = stream.getVideoTracks();
    // @ts-ignore
    const restrictionTarget = await RestrictionTarget.fromElement(viewPortElement);
    // @ts-ignore
    await track.restrictTo(restrictionTarget);
  }
  async function captureImg() {
    const imgCap = new ImageCapture(track);
    // @ts-ignore
    const imageBitmap = await imgCap.grabFrame();

    // 2) size the canvas & draw into it
    imgCanvas.width = imageBitmap.width;
    imgCanvas.height = imageBitmap.height;
    const ctx = imgCanvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get canvas context");
    }
    ctx.drawImage(imageBitmap, 0, 0);

    // 3) turn canvas into a Blob
    const imgBlob: null | Blob = await new Promise(resolve =>
      imgCanvas.toBlob(resolve)
    );
    if (!imgBlob) {
      throw new Error("Failed to create image blob from canvas");
    }
    // 4) write to clipboard
    const clipboardItems = [
      new ClipboardItem({ [imgBlob.type]: imgBlob })
    ];
    await navigator.clipboard.write(clipboardItems);
  }
})();