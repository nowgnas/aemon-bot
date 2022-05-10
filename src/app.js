import Discord, { MessageEmbed, User } from "discord.js";
import { UserModel } from "./db";
import "dotenv/config";

const client = new Discord.Client();
const txtEmbed = (member) => {
    return {
        type: "rich",
        title: `${member}님!!\n 깃디밭 잔디 정원사들 모임에 오신것을 환영합니다!!🎉🎉`,
        description: `1일 1커밋 운동을 하기 위한 모임입니다.\n정보 공유 및 함께 공부하는 모임입니다!!`,
        color: 0x82e983,
        fields: [
            {
                name: `그룹 목적`,
                value: `- 1일 1커밋으로 하루에 코드 한줄이라도 짜자!!`,
            },
            {
                name: "\u200B",
                value: `- 프로그래밍에 대한 감을 잃지 않을 수 있다!!`,
            },
            {
                name: `그룹 규칙`,
                value: `- 1일 1커밋을 하고 인증을 한다.\n- 인증은 잔디 캡처와 !commit 명령어를 사용한다.\n   ex) !commit 커밋 했어요!!\n- 벌금 여부는 구성원들과 상의 후 결정한다.`,
            },
            {
                name: `커밋 꿀팁!!`,
                value: `- 기술 블로그 작성(jekyll, gatsby 등등 - 궁금하면 도라에몽이 알려줌)\n- 알고리즘 풀고 푸시 하기\n- TIL(today i learned)쓰고 푸시하기\n- 프로젝트 한거 푸시하기\n... `,
            },
            {
                name: `나중에 하면 좋을 것 같다.. (시간 되면)`,
                value: `- 2차 프로젝트를 가지고  TS로 변경 해보기\n- 도커로 배포 해보기 \n- nestjs로 변경해보기 \n....`,
            },
        ],
        image: {
            url: `https://user-images.githubusercontent.com/55802893/167468708-1f2d14bf-9b49-4542-889f-33739a19c0c0.png`,
            height: 0,
            width: 0,
        },
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
    return { day, hour, minute };
};

const messageType = async (msg, userId, userName) => {
    const type = msg.type;

    if (type === "GUILD_MEMBER_JOIN") {
        // new user enter
        return {
            result: "welcome",
            message: "님 깃디밭 정원사들 모임에 오신것을 환영합니다!!",
        };
    } else if (type === "DEFAULT") {
        // default
        let commandType = "";

        const command = msg.content.split(" ")[0];
        if (command.includes("!commit")) {
            commandType = "commit";
        } else if (command.includes("!resetcommit")) {
            commandType = "reset";
        } else if (command.includes("!status")) {
            commandType = "status";
        } else if (command.includes("!공지")) {
            commandType = "announce";
        }

        switch (commandType) {
            case "commit":
                let result = "";
                let message = "";

                const { day } = getDay();
                const getUser = await UserModel.findOne({ userId });
                if (!getUser) {
                    const create = await UserModel.create({
                        userId,
                        userName,
                        commitDay: [day],
                    });
                    result = "complete";
                    message = "오늘도 commit 성공!!";
                } else {
                    if (getUser.commitDay.includes(day)) {
                        result = "exist";
                        message = `${userName}님 오늘 커밋 인증 하셨었네요!!`;
                    } else {
                        await UserModel.updateOne(
                            { userId, userName },
                            { $push: { commitDay: { $each: [day] } } },
                            { upsert: true }
                        );
                    }
                }
                return {
                    result,
                    message,
                };

            case "reset":
                await resetCommitCount();
                return {
                    result: "reset",
                    message: "모든 사용자의 커밋을 초기화 했습니다.",
                };
            case "announce":
                const user = msg.author.username;
                const tEmbed = txtEmbed(user);
                const embed = new MessageEmbed(tEmbed);
                return { result: "announce", embed };
            case "status":
                const state = await userState();
                return {
                    result: "state",
                    state,
                };
            default:
                break;
        }
    }
};

const resetCommitCount = async () => {
    await UserModel.updateMany({}, { commitDay: [] });
};

const resultEmbed = (users) => {
    let fields = [];
    let userObject = [...users];
    userObject.forEach((element) => {
        let message = "";
        if (element.commitDay.length < 3) {
            message = `${element.commitDay.length}일..?? 분발하세요!!`;
        } else if (element.commitDay.length < 6) {
            message = `${element.commitDay.length}일.. 조금만 더!!`;
        } else if (element.commitDay.length === 7) {
            message = `이번주 커밋 성공!! `;
        }
        fields.push({
            name: element.userName,
            value: message,
            inline: true,
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
            width: 0,
        },
    };
};

const msgEmbed = (txtJson) => {
    return new MessageEmbed(txtJson);
};

const userState = async () => {
    const users = await UserModel.find({});
    const resEmbed = resultEmbed(users);
    return msgEmbed(resEmbed);
};

client.on("message", async (msg) => {
    const command = await messageType(msg, msg.author.id, msg.author.username);
    if (command === undefined) {
    } else if (command.result === "welcome") {
        const user = msg.author.username;
        const tEmbed = txtEmbed(user);
        const embed = msgEmbed(tEmbed);
        msg.channel.send(embed);
    } else if (command.result === "complete") {
        console.log(`${msg.author.username} commit`);
        msg.channel.send(`${msg.author.username}님 ${command.message}`);
    } else if (command.result === "reset") {
        console.log(`reset command `);
        msg.channel.send(`${command.message}`);
    } else if (command.result === "announce") {
        console.log(`announce command`);
        msg.channel.send(command.embed);
    } else if (command.result === "state") {
        console.log(`state command`);
        msg.channel.send(command.state);
    } else if (command.result === "exist") {
        console.log(`${msg.author.username} already committed`);
        msg.channel.send(command.message);
    }
    setInterval(async () => {
        const { day, hour, minute } = getDay();
        if (hour === 22 && minute == 10) {
            console.log("interval");
            msg.channel.send("여려분!! commit 하셨나요??");
        }
        if (day === "Sun" && hour === 23 && minute === 50) {
            await resetCommitCount();
            console.log("reset user commit");
        }
        if (day === "Sun" && hour === 23 && minute === 30) {
            const state = userState();
            msg.channel.send(state);
        }
    }, 59900);
});

client.login(process.env.TOKEN);
