"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDay = getDay;
exports.messageEmbed = messageEmbed;
exports.msgEmbed = msgEmbed;
exports.ssafyMessageType = ssafyMessageType;

var _discord = _interopRequireWildcard(require("discord.js"));

var _db = require("../db");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// 날짜 받기
function getDay() {
  const date = new Date();
  let day = date.toString().slice(0, 3);
  let hour = date.getHours();
  let minute = date.getMinutes();
  return {
    day,
    hour,
    minute
  };
}

function msgEmbed(txtJson) {
  return new _discord.MessageEmbed(txtJson);
}

async function ssafyMessageType(msg) {
  const userId = msg.author.id;
  const userName = msg.author.username;
  const content = msg.content;
  const type = msg.type;
  let result = "";
  let message = "";

  if (type === "GUILD_MEMBER_JOIN") {
    return {
      result: "welcome",
      message: "님 SSAFY 19반 채널에 오신 것을 환영합니다!!"
    };
  } else if (type === "DEFAULT") {
    let commandType = "";
    const command = content.split(" ")[0];
    const postUrl = content.split(" ")[1];

    if (command.includes("!posting")) {
      commandType = "posting";
    } else if (command.includes("!week")) {
      commandType = "week";
    } else if (command.includes("!commit")) {
      commandType = "commit";
    }

    switch (commandType) {
      case "posting":
        const ssafyUser = await _db.SSAFYUserModel.findOne({
          userId
        });

        if (!ssafyUser) {
          await _db.SSAFYUserModel.create({
            userId,
            userName,
            posting: [postUrl]
          });
          result = "posting";
          message = `${userName}님의 지식이 공유 되었습니다!!`;
        } else {
          await _db.SSAFYUserModel.updateOne({
            userId,
            userName
          }, {
            $push: {
              posting: {
                $each: [postUrl]
              }
            }
          }, {
            upsert: true
          });
          result = "posting";
          message = `${userName}님의 지식이 공유 되었습니다!!`;
        }

        return {
          result,
          message
        };

      case "week":
        const {
          title,
          fields
        } = await postingEmbed();
        let embed = messageEmbed({
          title,
          fields
        });
        let embedMessage = msgEmbed(embed);
        return {
          result: "week",
          message: embedMessage
        };

      case "commit":
        const {
          day
        } = getDay();
        const getUser = await _db.SSAFYUserModel.findOne({
          userId
        });

        if (!getUser) {
          await _db.SSAFYUserModel.create({
            userId,
            userName,
            commitDay: [day]
          });
          result = "complete";
          message = "오늘도 commit 성공!";
        } else {
          if (getUser.commitDay.includes(day)) {
            result = "exist";
            message = `${userName}님 오늘 커밋 인증 하셨었네요!!`;
          } else {
            await _db.SSAFYUserModel.updateOne({
              userId,
              userName
            }, {
              $push: {
                commitDay: {
                  $each: [day]
                }
              }
            }, {
              upsert: true
            });
            result = "complete";
            message = message = "오늘도 commit 성공!!";
          }
        }

        return {
          result,
          message
        };

      default:
        break;
    }
  }
}

function messageEmbed({
  title,
  description = "",
  fields = []
}) {
  return {
    type: "rich",
    title,
    description,
    color: 0x53b0e2,
    fields
  };
}

const postingEmbed = async () => {
  const users = await _db.SSAFYUserModel.find({});
  let fields = [];
  let userObject = [...users];
  userObject.forEach(element => {
    let post = [...element.posting];
    let message = "";
    post.forEach(posting => {
      message += `${posting}\n`;
    });
    fields.push({
      name: element.userName,
      value: message,
      inline: false
    });
  });
  return {
    title: "이번 주에 공유된 지식들 입니다!",
    fields
  };
};