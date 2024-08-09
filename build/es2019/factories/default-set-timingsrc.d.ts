import type { determineSupportedPlaybackRateValues as determineSupportedPlaybackRateValuesFunction } from '../functions/determine-supported-playback-rate-values';
import type { createComputeVelocity as createComputeVelocityFunction } from './compute-velocity';
import type { createSetTimingsrc as createSetTimingsrcFunction } from './set-timingsrc';
import type { createSetTimingsrcWithCustomUpdateFunction } from './set-timingsrc-with-custom-update-function';
import type { createUpdateGradually as createUpdateGraduallyFunction } from './update-gradually';
import type { createUpdateStepwiseFactory } from './update-stepwise-factory';
import type { createWindow } from './window';
export declare const createDefaultSetTimingsrc: (
    createComputeVelocity: typeof createComputeVelocityFunction,
    createSetTimingsrc: typeof createSetTimingsrcFunction,
    createUpdateGradually: typeof createUpdateGraduallyFunction,
    createUpdateStepwise: ReturnType<typeof createUpdateStepwiseFactory>,
    determineSupportedPlaybackRateValues: typeof determineSupportedPlaybackRateValuesFunction,
    setTimingsrcWithCustomUpdateFunction: ReturnType<typeof createSetTimingsrcWithCustomUpdateFunction>,
    window: ReturnType<typeof createWindow>
) => (
    mediaElement: HTMLMediaElement,
    timingObject: import('timing-object').ITimingObject,
    prepareTimingStateVector?: import('../types').TPrepareTimingStateVectorFunction | null,
    prepareUpdateVector?: import('../types').TPrepareUpdateVectorFunction | null
) => () => void;
//# sourceMappingURL=default-set-timingsrc.d.ts.map
