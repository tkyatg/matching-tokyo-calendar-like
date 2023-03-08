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
  chrome.tabs.sendMessage(
    tabs[0].id,
    { message: "isStarted" },
    function (item) {
      if (item && !item.stop) {
        $("#startBtn")[0].value = "とめる";
        $(".likeLimit").prop("disabled", true);
      }

      setTimeout(function () {
        if (item) {
          $(".likeLimit").val(item.param.likeLimit);
        } else {
          $(".likeLimit").val(1000);
        }
      }, 10);
    }
  );
});

// 開始ボタンクリック
$("#startBtn").on("click", function (event) {
  const likeLimit = parseInt($(".likeLimit").val());
  const param = { likeLimit };
  if (!enabled) {
    // 開始状態にする
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { message: "start", param },
        function (item) {}
      );
    });
    enabled = true;
    $("#startBtn")[0].value = "とめる";
    $(".likeLimit").prop("disabled", true);
  } else {
    // 停止状態にする
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { message: "stop" },
        function (item) {}
      );
    });
    enabled = false;
    $("#startBtn")[0].value = "はじめる";
    $(".likeLimit").prop("disabled", false);
  }
});
