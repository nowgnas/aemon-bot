"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _discord = _interopRequireWildcard(require("discord.js"));

var _db = require("../db");

var _axios = _interopRequireDefault(require("axios"));

var _action = require("../common/action");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// import { UserModel } from "./db";
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
      }, ms);
    });
  }

}

sendMessage.timer(58000);
ssafy.on("message", async msg => {
  const commad = await (0, _action.ssafyMessageType)(msg);

  if (commad === undefined) {} else if (commad.result === "welcome") {// 새로운 사람 추가 시 공지 알림
  } else if (commad.result === "week") {
    msg.channel.send(commad.message);
  }
});