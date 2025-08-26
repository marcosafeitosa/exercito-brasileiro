// chrome.action.onClicked.addListener((tab) => {
//   if (tab.id) {
//     chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       files: ["dist/content.bundle.js"],
//     });
//   }
// });

// chrome.action.onClicked.addListener((tab) => {
//   if (tab.id) {
//     chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       files: ["./content.js"],
//     });
//   }
// });

// chrome.webNavigation.onCompleted.addListener(
//   (details) => {
//     console.log("Evento onCompleted disparado na aba:", details.tabId);
//   },
//   { url: [{ urlMatches: "https://ofc.exbrhabbo.com/.*" }] }
// );
