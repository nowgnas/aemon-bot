import Discord, { MessageEmbed } from "discord.js";
// import { UserModel } from "./db";
import { SaafyModel } from "../db";

import axios from "axios";
import { getDay, ssafyMessageType } from "../common/action";

const ssafy = new Discord.Client();

ssafy.on("ready", () => {
    ssafy.user.setActivity("Hello SSAFY", { type: "PLAYING" });
    console.log(`logged in as ${ssafy.user.tag} in SSAFY BOT`);
});

ssafy.login(process.env.SSAFY);

// 시간에 맞춰 메세지 보내기 webhook으로 보내기
class sendMessage {
    static timer(ms) {
        return new Promise((resolve) => {
            const timers = setInterval(() => {
                console.log(`${ms / 1000} sec passed`);
                let { day, hour, minute } = getDay();
            }, ms);
        });
    }
}

sendMessage.timer(58000);

ssafy.on("message", async (msg) => {
    const commad = await ssafyMessageType(msg);

    if (commad === undefined) {
    } else if (commad.result === "welcome") {
        // 새로운 사람 추가 시 공지 알림
    } else if (commad.result === "week") {
        msg.channel.send(commad.message);
    }
});