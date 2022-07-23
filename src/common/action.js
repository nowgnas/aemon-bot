import Discord, { MessageEmbed } from "discord.js";
import { SSAFYUserModel } from "../db";

// 날짜 받기
export function getDay() {
    const date = new Date();
    let day = date.toString().slice(0, 3);
    let hour = date.getHours();
    let minute = date.getMinutes();
    return { day, hour, minute };
}

export function msgEmbed(txtJson) {
    return new MessageEmbed(txtJson);
}

export async function ssafyMessageType(msg) {
    const userId = msg.author.id;
    const userName = msg.author.username;
    const content = msg.content;
    const type = msg.type;

    let result = "";
    let message = "";

    if (type === "GUILD_MEMBER_JOIN") {
        return {
            result: "welcome",
            message: "님 SSAFY 19반 채널에 오신 것을 환영합니다!!",
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
                const ssafyUser = await SSAFYUserModel.findOne({ userId });
                if (!ssafyUser) {
                    await SSAFYUserModel.create({
                        userId,
                        userName,
                        posting: [postUrl],
                    });
                    result = "posting";
                    message = `${userName}님의 지식이 공유 되었습니다!!`;
                } else {
                    await SSAFYUserModel.updateOne(
                        { userId, userName },
                        { $push: { posting: { $each: [postUrl] } } },
                        { upsert: true }
                    );
                    result = "posting";
                    message = `${userName}님의 지식이 공유 되었습니다!!`;
                }
                return {
                    result,
                    message,
                };
            case "week":
                const { title, fields } = await postingEmbed();
                let embed = messageEmbed({ title, fields });
                let embedMessage = msgEmbed(embed);
                return {
                    result: "week",
                    message: embedMessage,
                };
            case "commit":
                const { day } = getDay();
                const getUser = await SSAFYUserModel.findOne({ userId });
                if (!getUser) {
                    await SSAFYUserModel.create({
                        userId,
                        userName,
                        commitDay: [day],
                    });
                    result = "complete";
                    message = "오늘도 commit 성공!";
                } else {
                    if (getUser.commitDay.includes(day)) {
                        result = "exist";
                        message = `${userName}님 오늘 커밋 인증 하셨었네요!!`;
                    } else {
                        await SSAFYUserModel.updateOne(
                            { userId, userName },
                            { $push: { commitDay: { $each: [day] } } },
                            { upsert: true }
                        );
                        result = "complete";
                        message = message = "오늘도 commit 성공!!";
                    }
                }
                return {
                    result,
                    message,
                };

            default:
                break;
        }
    }
}

export function messageEmbed({ title, description = "", fields = [] }) {
    return {
        type: "rich",
        title,
        description,
        color: 0x53b0e2,
        fields,
    };
}

const postingEmbed = async () => {
    const users = await SSAFYUserModel.find({});

    let fields = [];
    let userObject = [...users];
    userObject.forEach((element) => {
        let post = [...element.posting];
        let message = "";
        post.forEach((posting) => {
            message += `${posting}\n`;
        });
        fields.push({
            name: element.userName,
            value: message,
            inline: false,
        });
    });
    return {
        title: "이번 주에 공유된 지식들 입니다!",
        fields,
    };
};
