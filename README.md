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

### login(APPID, channel[, token])

```js
client.login('123456789954855', '10086')
```

- 说明

| 参数 | 类型 | 值  | 说明 |
| ---- | ---- | --- | ---- |
