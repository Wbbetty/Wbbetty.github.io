self.importScripts("./goeasy.min.js")

var goEasy = GoEasy.getInstance({
    host: "hangzhou.goeasy.io",
    appkey: "BC-1e46fd20681e42ccb085c22219c395bf",
    modules: ["pubsub"]
});

goEasy.connect({
    id: "user01",
    onSuccess: () => {
        console.log("GoEasy connect successfully.");
    },
    onFailed: function(error) {
        let log = "Failed to connect GoEasy, code:" + error.code + ",error:" + error.content;
        console.log(log);
    },
    onProgress: function(attempts) {
        let log = "GoEasy is connecting" + attempts;
        console.log(log);
    }
});

// const now = performance.now();
// const keepServiceWorkerActive = () =>
//     dispatchEvent(
//         new CustomEvent('keepactive', {
//             detail: `Active at ${~~(((performance.now() - now) / 1000) / 60)} minutes.`
//         })
//     );
// const handleKeepServiceWorkerActive = (e) => console.log(e.detail);
// addEventListener("keepactive", handleKeepServiceWorkerActive);
// let interval = setInterval(keepServiceWorkerActive, 1000 * 60 * 5);

// const addResourcesToCache = async (resources) => {
//     const cache = await caches.open("v1");
//     await cache.addAll(resources);
// };

self.addEventListener('install', function(event) {
    event.waitUntil(
        self.skipWaiting()
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        self.clients.claim()
    );
});

// self.addEventListener("install", (event) => {
//     self.skipWaiting();
//     event.waitUntil(
//         addResourcesToCache([
//             "/",
//             "sw2.js",
//             "/index.html",
//         ])
//     );
// });

goEasy.pubsub.subscribe({
    channel: "test_channel",
    onMessage: function(message) {
        console.log('接收消息：',message)
        let log = "message time: " + (new Date().getTime()-message.time) + ",接收消息: Channel:" + message.channel +
            " content:" + message.content;
        console.log(log);
    },
    onSuccess: function() {
        let log = "Channel订阅成功。";
        console.log(log);
    },
    onFailed: function(error) {
        let log = "Channel订阅失败, 错误编码：" + error.code + " 错误信息：" + error.content;
        console.log(log);
    }
});

self.addEventListener("fetch", function(e) {
    console.log("Fetch request for: ", e.request.url);
});

self.addEventListener('message', e => {
    console.log('sw onMessage',e);
    // 向特定窗口返回消息
    e.source.postMessage('response from service worker')
});

