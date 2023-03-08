let stop = true;

async function online_like(param) {
  async function sleep(msec) {
    return new Promise((resolve) => setTimeout(resolve, msec));
  }

  while (true) {
    for (let i = 0; i < param.likeLimit; i++) {
      const link = document.querySelectorAll("#matchableUsers .radius0")[i];
      if (!link) {
        continue;
      }
      link.click();
      await sleep(1000 + Math.random() * 500);
      if (stop) {
        return;
      }
      const likeLink = document.querySelectorAll("#user_buttons div a");
      if (likeLink.length === 1 && likeLink[0].textContent === "いいね") {
        likeLink[0].click();
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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "starting") {
    sendResponse({ stop, param: { likeLimit: param.likeLimit } });
  } else if (request.message === "start" && stop) {
    stop = false;
    param = request.param;
    online_like(param);
  } else if (request.message === "stop") {
    stop = true;
  }
  sendResponse();
});
