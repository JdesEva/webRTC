import RTCInstance from '../packages/main'

let client = null

const channel = '330106001'
const cButton = document.getElementById('my-button')

cButton.onclick = function () {
  const cInput = document.getElementById('appId')

  const APPID = cInput.value
  client = new RTCInstance({ codec: 'h264' })

  client.login(APPID, channel)

  client.subscribeRTCEvents()
  client.publishStream()
  console.log(client)

  client.on('published-stream', (localVideoTrack, localAudioTrack) => {
    console.log('published-stream', localVideoTrack, localAudioTrack)
    localVideoTrack.play('local-player')
    localAudioTrack.play()
  })

  client.on('user-published', (romoteVideoTrack, romoteAudioTrack) => {
    console.log(2222, romoteVideoTrack, romoteAudioTrack)
    romoteVideoTrack.forEach(row => {
      console.log('user-published', row.track)
      // 订阅完成后，从 `user` 中获取远端视频轨道对象。
      // 动态插入一个 DIV 节点作为播放远端视频轨道的容器。
      const playerContainer = document.createElement('div')
      // 给这个 DIV 节点指定一个 ID，这里指定的是远端用户的 UID。
      playerContainer.id = `player-${String(row.uid)}`
      document.body.append(playerContainer)
      row.track && row.track.play(`player-${String(row.uid)}`)
    })

    romoteAudioTrack.forEach(row => {
      row.track && row.track.play()
    })
  })
}

export default client
