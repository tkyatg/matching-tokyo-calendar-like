lc_switch("input[type=checkbox], input[type=radio]", {
  on_txt: "ON",
  off_txt: "OFF",
  on_color: false,
  compact_mode: true,
});

function disableInputs() {
  lcs_disable($('input[name="online"]'));
  lcs_disable($('input[name="recentLogin"]'));
  lcs_disable($('input[name="newUser"]'));
  $(".limit-count").prop("disabled", true);
}
function enableInputs() {
  lcs_enable($('input[name="online"]'));
  lcs_enable($('input[name="recentLogin"]'));
  lcs_enable($('input[name="newUser"]'));
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
        $("#start-button")[0].value = "停止";
        disableInputs();
      }

      setTimeout(function () {
        // フォームの再現
        if (item.param.online) {
          console.log("online on");
          lcs_on($('input[name="online"]'));
        } else {
          lcs_off($('input[name="online"]'));
        }
        if (item.param.recentLogin) {
          console.log("recentLogin on");
          lcs_on($('input[name="recentLogin"]'));
        } else {
          lcs_off($('input[name="recentLogin"]'));
        }

        if (item.param.newUser) {
          lcs_on($('input[name="newUser"]'));
        } else {
          lcs_off($('input[name="newUser"]'));
        }

        $(".limit-count").val(item.param.limitCount);
      }, 10);
    }
  );
});

// 初期ではオンラインにチェックを入れる
// $('input[name="online"]').prop('checked',true)

// 開始ボタンクリック
$("#start-button").on("click", function (event) {
  const online = $('input[name="online"]').prop("checked");
  const recentLogin = $('input[name="recentLogin"]').prop("checked");
  const newUser = $('input[name="newUser"]').prop("checked");
  // const refreshCount = parseInt($('.refresh-count').val())
  const limitCount = parseInt($(".limit-count").val());
  const param = { online, recentLogin, newUser, limitCount };
  console.log(param); // {online: false, recentLogin: false, newUser: false, limitCount:1000}

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
    $("#start-button")[0].value = "停止";
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
    $("#start-button")[0].value = "開始";
    enableInputs();
  }
});
