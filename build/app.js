"use strict";

var _discord = _interopRequireWildcard(require("discord.js"));

var _db = require("./db");

require("dotenv/config");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const client = new _discord.default.Client();

const txtEmbed = member => {
  return {
    type: "rich",
    title: `${member}님!!\n 깃디밭 잔디 정원사들 모임에 오신것을 환영합니다!!🎉🎉`,
    description: `1일 1커밋 운동을 하기 위한 모임입니다.\n정보 공유 및 함께 공부하는 모임입니다!!`,
    color: 0x82e983,
    fields: [{
      name: `그룹 목적`,
      value: `- 1일 1커밋으로 하루에 코드 한줄이라도 짜자!!`
    }, {
      name: "\u200B",
      value: `- 프로그래밍에 대한 감을 잃지 않을 수 있다!!`
    }, {
      name: `그룹 규칙`,
      value: `- 1일 1커밋을 하고 인증을 한다.\n- 인증은 잔디 캡처와 !commit 명령어를 사용한다.\n   ex) !commit 커밋 했어요!!\n- 벌금 여부는 구성원들과 상의 후 결정한다.`
    }, {
      name: `나중에 하면 좋을 것 같다.. (시간 되면)`,
      value: `- 2차 프로젝트를 가지고  TS로 변경 해보기\n- 도커로 배포 해보기 \n- nestjs로 변경해보기 \n....`
    }],
    image: {
      url: `https://user-images.githubusercontent.com/55802893/167468708-1f2d14bf-9b49-4542-889f-33739a19c0c0.png`,
      height: 0,
      width: 0
    }
  };
};

client.on("ready", () => {
  console.log(`logged in as ${client.user.tag}`);
});

const getDay = () => {
  const date = new Date();
  let day = date.toString().slice(0, 3);
  let hour = date.getHours();
  let minute = date.getMinutes();
  return {
    day,
    hour,
    minute
  };
};

const messageType = async (msg, userId, userName) => {
  const type = msg.type;
  const command = msg.content.split(" ")[0];
  let commitCount = null;

  if (type === "GUILD_MEMBER_JOIN") {
    // new user enter
    return {
      result: "welcome",
      message: "님 깃디밭 정원사들 모임에 오신것을 환영합니다!!"
    };
  } else if (type === "DEFAULT") {
    // default
    commitCount = await _db.UserModel.findOne({
      userId
    });

    if (commitCount === null) {
      commitCount = 1;
    } else {
      commitCount = commitCount.commitCount + 1;
    }

    switch (command) {
      case "!commit":
        // 요일 가져와서 저장
        await _db.UserModel.updateOne({
          userId,
          userName
        }, {
          commitCount
        }, {
          upsert: true
        });
        return {
          result: "complete",
          message: "오늘도 commit 성공!!"
        };

      case "!resetcommit":
        await resetCommitCount();
        return {
          result: "reset",
          message: "모든 사용자의 커밋을 초기화 했습니다."
        };

      default:
        break;
    }
  }
};

const resetCommitCount = async () => {
  const userReset = await _db.UserModel.updateMany({}, {
    commitCount: 0
  });
  console.log(userReset);
};

const resultEmbed = users => {
  let fields = [];
  let userObject = [...users];
  userObject.forEach(element => {
    fields.push({
      name: element.userName,
      value: `${element.commitCount} commits`,
      inline: true
    });
  });
  return {
    type: "rich",
    title: `이번주 잔디 정원사들의 실적입니다!`,
    description: "",
    color: 0x82e983,
    fields,
    image: {
      url: `https://user-images.githubusercontent.com/55802893/167468708-1f2d14bf-9b49-4542-889f-33739a19c0c0.png`,
      height: 0,
      width: 0
    }
  };
};

client.on("message", async msg => {
  const command = await messageType(msg, msg.author.id, msg.author.username);

  if (command === undefined) {} else if (command.result === "welcome") {
    const user = msg.author.username;
    const tEmbed = txtEmbed(user);
    const embed = new _discord.MessageEmbed(tEmbed);
    msg.channel.send(embed);
  } else if (command.result === "complete") {
    msg.channel.send(`${msg.author.username}님 ${command.message}`);
  } else if (command.result === "reset") {
    msg.channel.send(`${command.message}`);
  }

  setInterval(async () => {
    const {
      day,
      hour,
      minute
    } = getDay();

    if (hour === 21 && minute > 30) {
      msg.channel.send("여려분!! commit 하셨나요??");
    }

    if (day === "Sun" && hour === 23 && minute === 50) {
      await resetCommitCount();
    }

    if (day === "Sun" && hour === 23 && minute === 30) {
      const users = await _db.UserModel.find({});
      const resEmbed = resultEmbed(users);
      const embedResult = new _discord.MessageEmbed(resEmbed);
      msg.channel.send(embedResult);
    }
  }, 59000);
});
client.login(process.env.TOKEN);