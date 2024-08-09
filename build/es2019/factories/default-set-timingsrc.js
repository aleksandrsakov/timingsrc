const DEFAULT_TOLERANCE = 0.025;
export const createDefaultSetTimingsrc = (
    createComputeVelocity,
    createSetTimingsrc,
    createUpdateGradually,
    createUpdateStepwise,
    determineSupportedPlaybackRateValues,
    setTimingsrcWithCustomUpdateFunction,
    window
) => {
    console.log(createComputeVelocity, window, createUpdateGradually, determineSupportedPlaybackRateValues);
    const update = createUpdateStepwise(DEFAULT_TOLERANCE);
    return createSetTimingsrc(setTimingsrcWithCustomUpdateFunction, update);
};
//# sourceMappingURL=default-set-timingsrc.js.map
