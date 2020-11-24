/**
 * webSDK事件合集
 */

/**
 * 客户端事件
 */
const clientEvents = [
  'first-audio-frame-decode',
  'first-video-frame-decode',
  'stream-published',
  'stream-unpublished',
  'stream-added',
  'stream-removed',
  'stream-subscribed',
  'peer-online',
  'peer-leave',
  'mute-audio',
  'unmute-audio',
  'mute-video',
  'unmute-video',
  'crypt-error',
  'client-banned',
  'volume-indicator',
  'liveStreamingStarted',
  'liveStreamingFailed',
  'liveStreamingStopped',
  'liveTranscodingUpdated',
  'streamInjectedStatus',
  'onTokenPrivilegeWillExpire',
  'onTokenPrivilegeDidExpire',
  'error',
  'network-type-changed',
  'recording-device-changed',
  'playout-device-changed',
  'camera-changed',
  'stream-type-changed',
  'connection-state-change',
  'stream-reconnect-start',
  'stream-reconnect-end',
  'client-role-changed',
  'reconnect',
  'rejoin',
  'connected',
  'network-quality',
  'stream-fallback',
  'stream-updated',
  'exception',
  'enable-local-video',
  'disable-local-video',
  'channel-media-relay-event',
  'channel-media-relay-state'
]

/**
 * 流事件
 */
const streamEvents = [
  'accessAllowed',
  'accessDenied',
  'stopScreenSharing',
  'videoTrackEnded',
  'audioTrackEnded',
  'audioMixingPlayed',
  'audioMixingFinished',
  'player-status-change'
]

export {
  clientEvents,
  streamEvents
}
