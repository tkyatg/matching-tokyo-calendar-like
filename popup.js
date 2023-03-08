lc_switch("input[type=checkbox], input[type=radio]", {
  on_txt: "ON",
  off_txt: "OFF",
  on_color: false,
  compact_mode: true,
});

function disableInputs() {
  $(".limit-count").prop("disabled", true);
}
function enableInputs() {
  $(".limit-count").prop("disabled", false);
}

let enabled = false;

// 起動時の処理
// content_scriptが実行中か確認する
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs.sendMessage(
    tabs[0].id,
    { message: "isStarted" },
    function (item) {
      console.log(item);
      if (!item.stop) {
        $("#start-button")[0].value = "とめる";
        disableInputs();
      }

      setTimeout(function () {
        $(".limit-count").val(item.param.limitCount);
      }, 10);
    }
  );
});

// 初期ではオンラインにチェックを入れる
// $('input[name="online"]').prop('checked',true)

// 開始ボタンクリック
$("#start-button").on("click", function (event) {
  const limitCount = parseInt($(".limit-count").val());
  const param = { limitCount };
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
    $("#start-button")[0].value = "とめる";
    disableInputs();
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
    $("#start-button")[0].value = "はじめる";
    enableInputs();
  }
});
