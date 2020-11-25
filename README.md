# WebRTC_SDK

> 声网 SDK Promise 封装版本

## API 文档

### webRTC 实例

```js
const client = new webRTC({ mode: 'live', codec: 'h264' })
```

optios 选项列表

| 属性  | 类型   | 值            | 说明                                                   |
| ----- | ------ | ------------- | ------------------------------------------------------ |
| mode  | string | 'live'、'rtc' | 音视频通话类型， live 代表直播, rtc 代表高清音视频通话 |
| codec | string | 'h264'、'vp8' | 音视频通话编码格式                                     |

## 方法列表

> 如无特殊说明，所有方法均为 Promise 封装后的方法，返回值为 Promise

### login(APPID, channel[, token])

- 加入 RTC 频道

```js
client.login('123456789954855', '10086')
```

- 说明

| 参数    | 类型   | 值  | 说明       |
| ------- | ------ | --- | ---------- |
| APPID   | String | -   | 声网 APPID |
| channel | String | -   | 频道号     |
| token   | String | -   | 加密 Token |

### logout

- 退出频道

```js
client.logout()
```

### publishStream

- 推送本地音视频流，返回值为本地音视频流

```js
client.publishStream()
```

### unpublishStream

- 取消推送本地音视频流

```js
client.unpublishStream()
```

### subscribeRTCEvents

- 事件监听，请在加入 RTC 频道成功后立即调用，保证可以监听到 RTC 事件

```js
client.subscribeRTCEvents()
```

- 事件列表

| 事件名           | 说明                                                                                                     |
| ---------------- | -------------------------------------------------------------------------------------------------------- |
| user-published   | 发布本地音视频轨道成功的事件                                                                             |
| user-unpublished | 取消发布本地音视频轨道成功事件                                                                           |
| network-quality  | 网络上下行质量报告回调;用户加入频道后，SDK 会每 1 秒触发一次该回调，报告本地用户当前的上行和下行网络质量 |
| exception        | 频道内 SDK 监测出的异常事件                                                                              |
| user-joined      | 远端用户或主播加入频道回调事件                                                                           |

### unsubscribeStream(user, type)

- 取消订阅远端用户的音视频轨道

```js
client.unsubscribeStream(romote, 'audio')
```

- 参数列表

| 参数 | 类型   | 值               | 说明               |
| ---- | ------ | ---------------- | ------------------ |
| user | Object | -                | 远端用户对象       |
| type | String | 'audio'、'video' | 要取消订阅的流类型 |

### isVideo(enabled)

- 启用/禁用该轨道

```js
client.isVideo(true)
```

### setLocalVolume(volume)

- 调整本地音量

```js
client.setLocalVolume(50)
```