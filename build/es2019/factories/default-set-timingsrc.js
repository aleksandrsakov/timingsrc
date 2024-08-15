const DEFAULT_TOLERANCE = 0.025;
export const createDefaultSetTimingsrc = (createComputeVelocity, createSetTimingsrc, createUpdateGradually, createUpdateStepwise, determineSupportedPlaybackRateValues, setTimingsrcWithCustomUpdateFunction) => {
    console.log(createComputeVelocity, createUpdateGradually, determineSupportedPlaybackRateValues, 'determineSupportedPlaybackRateValues');
    const update = createUpdateStepwise(DEFAULT_TOLERANCE);
    return createSetTimingsrc(setTimingsrcWithCustomUpdateFunction, update);
};
//# sourceMappingURL=default-set-timingsrc.js.map