async function online_like(param) {
  function sleep(msec) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve();
      }, msec);
    });
  }

  jq = $;

  while (true) {
    for (var i = 0; i < param.limitCount; i++) {
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

    function profile_close() {
      $("#userProfile").hide();
      $("#mainContent").show();
      $("html,body").scrollTop(0, ((i - 1) * 245) / 2);
      $(window).data("loading", false);
      // jq('a.hmenu_close').trigger('click')
      // jq('a.hmenu_close')[0].dispatchEvent(new MouseEvent("click"));
    }
    // profile_close()
    document.getElementsByClassName("hmenu_close")[1].click();

    scrollTo(0, (i * 245) / 2);

    await sleep(1000 + Math.random() * 500);
    if (stop) {
      return;
    }
    stop = true;
    return;
  }
}

let stop = true;
let param = {
  online: true,
  recentLogin: true,
  newUser: false,
  limitCount: 1000,
};

// popup.jsからの開始、停止メッセージの受信
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request.message);
  if (request.message === "isStarted") {
    sendResponse({ stop, param });
  }

  if (stop && request.message === "start") {
    console.log(request.param); // {online: false, recentLogin: false, newUser: false}
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
