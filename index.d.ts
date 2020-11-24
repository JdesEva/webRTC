export interface RTCInstanceOptions {
    mode?: string;
    codec?: string;
}

export interface streamInstance { }


export interface RTCInstance {
    options: RTCInstanceOptions;
    client: RTCInstance;
    login(APPID: string): Promise<R>;
    joinChannel(channel: string, uid?: string, token?: string): Promise<R>;
    leave(): Promise<R>;
    getDevices(): Promise<R>;
    createStream(options?: object): Promise<R>;
    playLocalStream(): Promise<R>;
    publishStream(): Promise<R>;
    unPublishStream(): Promise<R>;
    subscribe(romoteStream: streamInstance, options?: object): Promise<R>;
    unSubscribe(romoteStream: streamInstance): Promise<R>;
    eventsEmitter(): void;
    on(eventName: string, callback: Function): void;
    off(eventName: string, callback: Function): void;
}


declare const RTC: RTCInstance;

export default RTC;
