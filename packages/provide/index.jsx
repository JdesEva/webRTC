import AgoraRTC from 'web_rtc'
import EventEmitter from 'events'
import { clientEvents } from '../events'

class RTC {
  constructor (options = {}) {
    this.options = options
    this.client = AgoraRTC.createClient({ mode: options.mode || 'live', codec: options.codec || 'vp8' })
    this.devices = []
    this.localStream = null
    this.remoteStream = []
    this.published = false
    this.EventEmitter = new EventEmitter()
    this.eventsEmitter()
  }

  /**
   * 登录RTC
   * @param {String} APPID 声网APPID
   */
  login (APPID) {
    return new Promise((resolve, reject) => {
      this.client.init(APPID, () => {
        resolve()
      }, err => {
        reject(err)
      })
    })
  }

  /**
   * 加入频道
   * @param {String} channel 频道号
   * @param {String} uid uid int类型数字，范围为 0 至 2^32-1
   * @param {String} token token，默认为null
   */
  joinChannel (channel, uid = null, token = null) {
    return new Promise((resolve, reject) => {
      this.client.join(token, channel, uid, uid => {
        this.options = { ...this.options, uid: uid }
        resolve(uid)
      }, error => {
        reject(error)
      })
    })
  }

  /**
   * 离开频道
   */
  leave () {
    return new Promise((resolve, reject) => {
      this.client.leave(() => {
        if (this.localStream.isPlaying()) this.localStream.stop()
        this.localStream.close()
        this.remoteStream.map(stream => {
          if (stream.isPlaying()) stream.stop()
          return stream
        })
        this.localStream = null
        this.client = null
        this.published = false
        resolve(this.remoteStream)
      }, error => {
        reject(error)
      })
    })
  }

  /**
   * 枚举可用的媒体输入/输出设备
   */
  getDevices () {
    return new Promise((resolve, reject) => {
      AgoraRTC.getDevices(devices => {
        resolve(devices)
      }, error => {
        reject(error)
      })
    })
  }

  /**
   * 创建本地音视频流对象
   * @param {Object} options 入参
   *
   * options 参数列表
   *
   * @param {String} uid 本地音视频对象的uid
   * @param {String} microphoneId 麦克风ID
   * @param {String} cameraId 摄像头ID
   * @param {Boolean} audio 采集音频
   * @param {Boolean} video 采集视频
   */
  createStream (options = {}) {
    return new Promise((resolve, reject) => {
      this.localStream = AgoraRTC.createStream({
        streamID: this.options.uid,
        audio: options.audio || true,
        video: options.video || true,
        screen: false,
        microphoneId: options.microphoneId || null,
        cameraId: options.cameraId || null
      })
      resolve(this.localStream)
    })
  }

  /**
   * 播放本地音视频流
   * @param {String} ref DOM节点的ID
   */
  playLocalStream (ref, options = { fit: 'contain', muted: false }) {
    return new Promise((resolve, reject) => {
      this.localStream.init(() => {
        this.localStream.play(ref, { fit: options.fit || 'contain', muted: options.muted || false }, error => {
          if (error) reject(error)
          resolve()
        })
      }, error => {
        if (error) reject(error)
      })
    })
  }

  /**
   * 推送本地音视频流
   */
  publishStream () {
    return new Promise((resolve, reject) => {
      if (!this.published && this.localStream) {
        this.client.publish(this.localStream, error => {
          if (error) {
            this.published = false
            reject(error)
          }
        })
        this.published = true
        resolve()
      }
    })
  }

  /**
   * 停止推送本地音视频流
   */
  unPublishStream () {
    return new Promise((resolve, reject) => {
      this.localStream.unpublish(this.localStream, error => {
        if (error) {
          reject(error)
        } else {
          this.published = false
          resolve()
        }
      })
    })
  }

  /**
   * 订阅事件
   * @param {Object} romoteStream 远程音视频流
   * @param {Object} options 参数列表
   */
  subscribe (romoteStream, options = { video: true, audio: true }) {
    return new Promise((resolve, reject) => {
      this.client.subscribe(romoteStream, { video: options.video || true, audio: options.audio || true }, error => {
        if (error)reject(error)
        resolve(romoteStream)
      })
    })
  }

  /**
   * 取消订阅远端流
   * @param {Object} romoteStream 远程音视频流
   */
  unSubscribe (romoteStream) {
    return new Promise((resolve, reject) => {
      this.client.unsubscribe(romoteStream, error => {
        if (error) reject(error)
        resolve()
      })
    })
  }

  /**
   * 订阅事件
   */
  eventsEmitter () {
    /**
     * client事件集合
     */
    clientEvents.forEach(eventName => {
      this.client.on(eventName, event => {
        this.EventEmitter.emit(eventName, event)
      })
    })
  }

  /**
   * 事件监听
   * @param {String} eventName 事件名
   * @param {Function} callback 回调函数
   */
  on (eventName, callback) {
    this.EventEmitter.on(eventName, callback)
  }

  /**
   * 取消事件监听
   * @param {String} eventName 事件名
   */
  off (eventName) {
    this.client.off(eventName, event => {
      this.EventEmitter.off(eventName, event)
    })
  }
}

export default RTC
