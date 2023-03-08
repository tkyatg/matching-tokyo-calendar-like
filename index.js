lc_switch("input[type=checkbox], input[type=radio]", {
  on_txt: "ON",
  off_txt: "OFF",
  on_color: false,
  compact_mode: true,
});

let enabled = false;

// 起動時の処理
// content_scriptが実行中か確認する
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs.sendMessage(tabs[0].id, { message: "starting" }, function (item) {
    if (item && !item.stop) {
      $("#startBtn").value = "とめる";
      $(".likeLimit").prop("disabled", true);
    }
    setTimeout(function () {
      $(".likeLimit").val(item ? item.param.likeLimit : 1000);
    }, 10);
  });
});

// 開始ボタンクリック
$("#startBtn").on("click", function (event) {
  const likeLimit = parseInt($(".likeLimit").val());
  const param = { likeLimit };

  const toggleState = (enabled) => {
    const message = enabled ? "stop" : "start";
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { message, param },
        function (item) {}
      );
    });
    $("#startBtn").val(enabled ? "はじめる" : "とめる");
    $(".likeLimit").prop("disabled", enabled);
  };
  if (!enabled) {
    // 開始状態にする
    enabled = true;
    toggleState(enabled);
  } else {
    // 停止状態にする
    enabled = false;
    toggleState(enabled);
  }
});
