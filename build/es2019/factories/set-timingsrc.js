export const createSetTimingsrc =
    (setTimingsrcWithCustomUpdateFunction, update) =>
    (mediaElement, timingObject, prepareTimingStateVector = null, prepareUpdateVector = null) =>
        setTimingsrcWithCustomUpdateFunction(mediaElement, timingObject, update, prepareTimingStateVector, prepareUpdateVector);
//# sourceMappingURL=set-timingsrc.js.map
