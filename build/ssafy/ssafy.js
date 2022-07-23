"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _discord = _interopRequireDefault(require("discord.js"));

var _action = require("../common/action");

const ssafy = new _discord.default.Client();
ssafy.on("ready", () => {
  ssafy.user.setActivity("Hello SSAFY", {
    type: "PLAYING"
  });
  console.log(`logged in as ${ssafy.user.tag} in SSAFY BOT`);
});
ssafy.login(process.env.SSAFY); // 시간에 맞춰 메세지 보내기 webhook으로 보내기

class sendMessage {
  static timer(ms) {
    return new Promise(resolve => {
      const timers = setInterval(() => {
        console.log(`${ms / 1000} sec passed`);
        let {
          day,
          hour,
          minute
        } = (0, _action.getDay)();

        if (day === "Sun" && hour === 23 && minute === 50) {
          (0, _action.resetPost)();
          console.log("post list reset");
        }

        if (day === "Sun" && hour === 20 && minute === 0) {
          (0, _action.showPostList)();
        }
      }, ms);
    });
  }

}

sendMessage.timer(58000);
ssafy.on("message", async msg => {
  const commad = await (0, _action.ssafyMessageType)(msg);

  if (commad === undefined) {} else if (commad.result === "welcome") {
    // 새로운 사람 추가 시 공지 알림
    const title = commad.message;
    const welcome = (0, _action.welcomMessage)(title);
    msg.channel.send(welcome);
  } else if (commad.result === "week") {
    msg.channel.send(commad.message);
  } else if (commad.result === "posting") {
    msg.channel.send(commad.message);
  } else if (commad.result === "reset") {
    msg.channel.send(commad.message);
  }
});