let stop = true;

async function online_like() {
  function sleep(msec) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve();
      }, msec);
    });
  }

  while (true) {
    for (var i = 0; i < 999999; i++) {
      console.log(i);
      let link = document.querySelectorAll("#matchableUsers .radius0")[i];
      if (!link) {
        continue;
      }

      link.click();
      await sleep(1000 + Math.random() * 500);
      if (stop) {
        return;
      }
      // いいねボタンがある
      if (
        document.querySelectorAll("#user_buttons div a").length === 1 &&
        document.querySelectorAll("#user_buttons div a")[0].textContent ===
          "いいね"
      ) {
        // いいね送信
        document.querySelectorAll("#user_buttons div a")[0].click();
        await sleep(1000 + Math.random() * 300);
        if (stop) {
          return;
        }
      }
    }
    document.getElementsByClassName("hmenu_close")[1].click();

    await sleep(1000 + Math.random() * 500);
    if (stop) {
      return;
    }
    stop = true;
    return;
  }
}

// popup.js からの開始、停止メッセージの受信
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request.message);
  if (request.message === "isStarted") {
    sendResponse({ stop });
  }

  if (stop && request.message === "start") {
    stop = false;
    online_like();
  }
  if (request.message === "stop") {
    stop = true;
  }
  sendResponse();
  return true;
});
