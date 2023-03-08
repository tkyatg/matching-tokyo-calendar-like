let enabled = false;

// start / stop 受信
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "starting") {
    const { stop, param } = request;
    if (!stop) {
      $("#startBtn")[0].value = "とめる";
      $(".likeLimit").prop("disabled", true);
    }
    $(".likeLimit").val(param.likeLimit);
  }
  sendResponse();
});

// ボタンクリック
$("#startBtn").on("click", function () {
  const likeLimit = parseInt($(".likeLimit").val());
  const param = { likeLimit };
  const message = enabled ? "stop" : "start";

  // content_scriptにメッセージを送信する
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message, param }, function () {});
  });

  enabled = !enabled;
  $("#startBtn")[0].value = enabled ? "とめる" : "はじめる";
  $(".likeLimit").prop("disabled", enabled);
});
