export declare const createSetPlaybackRate: (
    negativeMaximum: number,
    playbackRateAssignments: WeakMap<HTMLMediaElement, [number, number]>,
    positiveMinimum: number
) => (mediaElement: HTMLMediaElement, previousValue: number, nextValue: number) => void;
//# sourceMappingURL=set-playback-rate.d.ts.map
