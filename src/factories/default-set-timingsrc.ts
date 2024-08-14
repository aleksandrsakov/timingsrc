import type { determineSupportedPlaybackRateValues as determineSupportedPlaybackRateValuesFunction } from '../functions/determine-supported-playback-rate-values';
import { TUpdateFunction, TUpdateVectorWithCustomState } from '../types';
import type { createComputeVelocity as createComputeVelocityFunction } from './compute-velocity';
import type { createSetTimingsrc as createSetTimingsrcFunction } from './set-timingsrc';
import type { createSetTimingsrcWithCustomUpdateFunction } from './set-timingsrc-with-custom-update-function';
import type { createUpdateGradually as createUpdateGraduallyFunction } from './update-gradually';
import type { createUpdateStepwiseFactory } from './update-stepwise-factory';

const DEFAULT_TOLERANCE = 0.025;

export const createDefaultSetTimingsrc = (
  createComputeVelocity: typeof createComputeVelocityFunction,
  createSetTimingsrc: typeof createSetTimingsrcFunction,
  createUpdateGradually: typeof createUpdateGraduallyFunction,
  createUpdateStepwise: ReturnType<typeof createUpdateStepwiseFactory>,
  determineSupportedPlaybackRateValues: typeof determineSupportedPlaybackRateValuesFunction,
  setTimingsrcWithCustomUpdateFunction: ReturnType<typeof createSetTimingsrcWithCustomUpdateFunction>,
) => {
    console.log(createComputeVelocity, createUpdateGradually, determineSupportedPlaybackRateValues, 'determineSupportedPlaybackRateValues');
    const update = createUpdateStepwise(DEFAULT_TOLERANCE);

    return createSetTimingsrc(setTimingsrcWithCustomUpdateFunction, <TUpdateFunction<TUpdateVectorWithCustomState<typeof update>>>update);
};
