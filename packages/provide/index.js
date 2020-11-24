import AgoraRTC from 'web_rtc'
import EventEmitter from 'events'

class webRTC extends EventEmitter {
  constructor (options) {
    super()
    this.client = AgoraRTC.createClient({ ...options, mode: options.mode || 'rtc', codec: options.codec || 'vp8' })
    this.localAudioTrack = null
    this.localVideoTrack = null
    this.uid = null
    this.romoteAudioTrack = []
    this.romoteVideoTrack = []
  }

  // 登录 加入频道
  async login (APPID, channel, token = null) {
    this.uid = await this.client.join(APPID, channel, token, null)
  }

  // 发布音视频流
  async publishStream () {
    this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack()
    this.localVideoTrack = await AgoraRTC.createCameraVideoTrack()
    this.localAudioTrack && this.client.publish([this.localAudioTrack, this.localVideoTrack])
    this.emit('published-stream', this.localVideoTrack, this.localAudioTrack)
  }

  // 取消发布音视频
  async unpublishStream () {
    await this.client.unpublish([this.localAudioTrack, this.localVideoTrack]) && await this.client.unpublish()
    this.emit('unpublished-stream')
  }

  // webRTC事件
  async subscribeRTCEvents () {
    this.client.on('user-published', async (user, mediaType) => {
      await this.client.subscribe(user, mediaType) // 订阅远端用户

      //   const audioTrack = this.romoteAudioTrack.filter(row => row.uid === user.uid)
      //   const videoTrack = this.romoteVideoTrack.filter(row => row.uid === user.uid)

      if (mediaType === 'video') this.romoteVideoTrack.push({ uid: user.uid, track: user.videoTrack })

      if (mediaType === 'audio') this.romoteAudioTrack.push({ uid: user.uid, track: user.audioTrack })

      this.emit('user-published', this.romoteVideoTrack, this.romoteAudioTrack)
    })

    this.client.on('user-unpublished', async (user, mediaType) => {
      console.log('user-unpublished', user, mediaType)
      //   const playerContainer = document.getElementById(`player-${String(user.uid)}`)
      //   playerContainer && playerContainer.remove()
      const audioIndex = this.romoteAudioTrack.findIndex(row => row.uid === user.uid)
      const videoIndex = this.romoteVideoTrack.findIndex(row => row.uid === user.uid)

      if (audioIndex > -1) this.romoteAudioTrack.splice(audioIndex, 1)
      if (videoIndex > -1) this.romoteVideoTrack.splice(videoIndex, 1)

      this.emit('user-unpublished', user.uid)
    })

    this.client.on('network-quality', state => {
    //   console.log(state)
      this.emit('network-quality', state)
    })

    this.client.on('exception', event => {
      console.log(event)
      this.emit('exception', event)
    })

    this.client.on('user-joined', (...args) => {
      console.log('user-joined', args)
      this.emit('exception', ...args)
    })
  }

  // 手动取消订阅远端流
  async unsubscribeStream (user, type = undefined) {
    this.client.unsubscribe(user, type)
  }

  // 是否关闭本地视频采集
  async isVideo (enabled) {
    const videoTrack = await AgoraRTC.createCameraVideoTrack()
    await videoTrack.setEnabled(enabled)
  }

  // 调整本地音量
  async setLocalVolume (volume) {
    const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack()
    localAudioTrack.setVolume(volume)
  }

  // 离开频道
  async logout () {
    this.localAudioTrack && this.localAudioTrack.stop() && this.localAudioTrack.close()
    this.localVideoTrack && this.localVideoTrack.stop() && this.localVideoTrack.close()
    this.romoteAudioTrack = []
    this.romoteVideoTrack = []
    await this.unpublishStream()
    await this.client.leave()
  }
}

export default webRTC
