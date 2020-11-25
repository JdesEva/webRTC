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

  /**
   * 登录 加入频道
   * @param {String} APPID   声网APPID
   * @param {String} channel  频道号
   * @param {String} token
   */
  async login (APPID, channel, token = null) {
    try {
      this.uid = await this.client.join(APPID, channel, token, null)
    } catch (e) {
      throw new Error(e)
    }
  }

  /**
   * 发布音视频流
   */
  async publishStream () {
    try {
      this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack()
      this.localVideoTrack = await AgoraRTC.createCameraVideoTrack()
      this.localAudioTrack && this.localVideoTrack && this.client.publish([this.localAudioTrack, this.localVideoTrack])
      this.emit('published-stream', this.localVideoTrack, this.localAudioTrack)
    } catch (e) {
      throw new Error(e)
    }
  }

  /**
   * 取消发布本地音视频轨道
   */
  async unpublishStream () {
    try {
      await this.client.unpublish([this.localAudioTrack, this.localVideoTrack]) && await this.client.unpublish()
      this.emit('unpublished-stream')
    } catch (e) {
      throw new Error(e)
    }
  }

  /**
   * webRTC事件
   *
   * 事件列表
   *
   * - user-published 发布本地音视频轨道
   * - user-unpublished  取消发布本地音视频轨道
   * - network-quality   网络上下行质量报告回调;用户加入频道后，SDK 会每 1 秒触发一次该回调，报告本地用户当前的上行和下行网络质量;
   * - exception  频道内 SDK 监测出的异常事件
   * - user-joined  远端用户或主播加入频道回调
   */
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
      this.emit('user-joined', ...args)
    })
  }

  /**
   * 取消订阅远端用户的音视频轨道
   * @param {Object} user 远端用户对象
   * @param {String} type 远端流类型  "video" | "audio"
   */
  async unsubscribeStream (user, type = undefined) {
    try {
      await this.client.unsubscribe(user, type)
    } catch (e) {
      throw new Error(e)
    }
  }

  /**
   * 启用/禁用该轨道
   * @param {Boolean} enabled  是否关闭
   */
  async isVideo (enabled) {
    try {
      const videoTrack = await AgoraRTC.createCameraVideoTrack()
      await videoTrack.setEnabled(enabled)
    } catch (e) {
      throw new Error(e)
    }
  }

  /**
   * 调整本地音量
   * @param {Number} volume   音量大小
   */
  async setLocalVolume (volume) {
    try {
      const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack()
      localAudioTrack.setVolume(volume)
    } catch (e) {
      throw new Error(e)
    }
  }

  /**
   * 退出
   */
  async logout () {
    try {
      this.localAudioTrack && this.localAudioTrack.stop() && this.localAudioTrack.close()
      this.localVideoTrack && this.localVideoTrack.stop() && this.localVideoTrack.close()
      this.romoteAudioTrack = []
      this.romoteVideoTrack = []
      await this.unpublishStream()
      await this.client.leave()
    } catch (e) {
      throw new Error(e)
    }
  }
}

export default webRTC
