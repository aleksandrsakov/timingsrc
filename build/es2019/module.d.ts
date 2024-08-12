import { createSetTimingsrc } from './factories/set-timingsrc';
import { createUpdateGradually } from './factories/update-gradually';
export { createSetTimingsrc };
export { createUpdateGradually };
export declare const createUpdateStepwise: (tolerance: number) => import("./types").TUpdateFunction<import("./interfaces").IUpdateVector & {
    lastAppliedPostion: number;
    lastAppliedTimestamp: number;
    lastAppliedVelocity: number;
    lastPlayheadDifference: number;
    mediaElementDelay: number;
    numberOfDetectedResets: number;
    numberOfExpectedResets: number;
}>;
export declare const setTimingsrcWithCustomUpdateFunction: <UpdateVectorWithCustomState extends import("./interfaces").IUpdateVector>(mediaElement: HTMLMediaElement, timingObject: import("timing-object").ITimingObject, updateFunction: import("./types").TUpdateFunction<UpdateVectorWithCustomState>, prepareTimingStateVector?: import("./types").TPrepareTimingStateVectorFunction | null, prepareUpdateVector?: import("./types").TPrepareUpdateVectorFunction | null) => () => void;
export declare const setTimingsrc: (mediaElement: HTMLMediaElement, timingObject: import("timing-object").ITimingObject, prepareTimingStateVector?: import("./types").TPrepareTimingStateVectorFunction | null, prepareUpdateVector?: import("./types").TPrepareUpdateVectorFunction | null) => () => void;
//# sourceMappingURL=module.d.ts.map