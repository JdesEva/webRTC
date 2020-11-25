export declare type SDK_MODE = "live" | "rtc";

export declare type SDK_CODEC = "h264" | "vp8";

export interface RTCInstanceOptions {
    mode?: SDK_MODE;
    codec?: SDK_CODEC;
}

export interface Track { }

export interface userInstance { }

export interface RTCEvents { }


export interface RTCInstance {
    options: RTCInstanceOptions;
    client: RTCInstance;
    localAudioTrack: Track;
    localVideoTrack: Track;
    uid: string;
    romoteAudioTrack: Array<Track>;
    romoteVideoTrack: Array<Track>;
    login(APPID: string, channel: string, token?: string): Promise<string>;
    publishStream(): Promise<Track>;
    unpublishStream(): Promise<any>;
    subscribeRTCEvents(): Promise<RTCEvents>;
    unsubscribeStream(user: userInstance, type: string): Promise<void>;
    isVideo(enabled: boolean): Promise<void>;
    setLocalVolume(volume: number): Promise<void>;
    logout(): Promise<void>;
}


declare const RTC: RTCInstance;

export default RTC;
