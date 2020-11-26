const webPush = require("web-push");

const vapidKeys = {
  publicKey:
    "BA6Am-hHauHvcpUH-ciCc5HVO8JN4WLASk5BeShh09ljUr4CLElqfTNqqMhQ4o8EWj4Ctc6pZlJdZFIt5lPvRLE",
  privateKey: "f1xp1Ymp6fFpvCpTRscBjx_-YmKyt_C5Ty--sJXw4TQ",
};

webPush.setVapidDetails(
  "mailto:setyobagusn01@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
const pushSubscription = {
  endpoint:
    "https://sg2p.notify.windows.com/w/?token=BQYAAABVYBpsZTsn777PPrlTCLL053LxcGf8CDX4jrl29GTfIeB9ZfFegsUa3w5CcApq7NQ2lKuq2kNhvU%2fFzDLtucGC%2fbsSbizVLgIMBLkNAOirNYPLby5%2fap5aNKqTzdxWGVAIlrYTUV2K%2fxxGD0mxJ7Ex2w4%2b2S8NycoeDndNofSHeCwT%2fNxs86E1w7v9yb0UdAkgAGUQ6YOibKEyXDC7d3gm5DJh71tfR656G5xBjEugzyhTb0qZJ9%2bCoxJJCxEn6pt8z85YI6Pu1rZr2tFY1ySStEDO5ZPkqXZRpMzfwWbYjinIwRn1t0hQjIDjLGE1edQ%3d",
  keys: {
    p256dh:
      "BIr1ot/50xB89ZYWgun0GC4ozcxGtLqOt2JIaZH46Bu8l6FLlbg9CnIZUxnAh0UWC8+1MzOtSIsmDTnrNUOrrXY=",
    auth: "56G8FxFwjLSWCiuE2cmlpg==",
  },
};
const payload = "Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!";

const options = {
  gcmAPIKey: "801807987938",
  TTL: 60,
};
webPush.sendNotification(pushSubscription, payload, options);
