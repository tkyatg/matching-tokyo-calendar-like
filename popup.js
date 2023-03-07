let enabled = false;

// 起動時の処理
// content_scriptが実行中か確認する
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs.sendMessage(
    tabs[0].id,
    { message: "isStarted" },
    function (item) {
      console.log(item);
      if (item && !item.stop) {
        $("#start-button")[0].value = "とめる";
      }
    }
  );
});

// 開始ボタンクリック
$("#start-button").on("click", function (event) {
  if (!enabled) {
    // 開始状態にする
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { message: "start" },
        function (item) {}
      );
    });
    enabled = true;
    $("#start-button")[0].value = "とめる";
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
  }
});
