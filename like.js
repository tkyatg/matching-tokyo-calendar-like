let stop = true;
let param = {
  likeLimit: 1000,
};

async function online_like(param) {
  function sleep(msec) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve();
      }, msec);
    });
  }

  while (true) {
    for (var i = 0; i < param.likeLimit; i++) {
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
      document.getElementsByClassName("hmenu_close")[1].click();
      scrollTo(0, (i * 245) / 2);
      await sleep(1000 + Math.random() * 500);
      if (stop) {
        return;
      }
    }
    stop = true;
    return;
  }
}

// index.jsからの開始、停止メッセージの受信
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "starting") {
    sendResponse({ stop, param });
  }

  if (stop && request.message === "start") {
    stop = false;
    param = request.param;
    online_like(request.param);
  }
  if (request.message === "stop") {
    stop = true;
  }
  sendResponse();
  return true;
});
