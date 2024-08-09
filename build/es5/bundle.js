(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? factory(
              exports,
              require('subscribable-things'),
              require('timing-object'),
              require('@babel/runtime/helpers/defineProperty'),
              require('@babel/runtime/helpers/slicedToArray')
          )
        : typeof define === 'function' && define.amd
          ? define(
                [
                    'exports',
                    'subscribable-things',
                    'timing-object',
                    '@babel/runtime/helpers/defineProperty',
                    '@babel/runtime/helpers/slicedToArray'
                ],
                factory
            )
          : ((global = typeof globalThis !== 'undefined' ? globalThis : global || self),
            factory(
                (global.timingsrc = {}),
                global.subscribableThings,
                global.timingObject,
                global._defineProperty,
                global._slicedToArray
            ));
})(this, function (exports, subscribableThings, timingObject, _defineProperty, _slicedToArray) {
    'use strict';

    var createComputeVelocity = function createComputeVelocity(timeConstant) {
        return function (delta, minValue, maxValue, velocity) {
            var factor = (Math.abs(delta) + timeConstant) / timeConstant;
            return Math.max(minValue, Math.min(maxValue, delta > 0 ? velocity / factor : factor * velocity));
        };
    };

    var DEFAULT_TOLERANCE = 0.025;
    var createDefaultSetTimingsrc = function createDefaultSetTimingsrc(
        createComputeVelocity,
        createSetTimingsrc,
        createUpdateGradually,
        createUpdateStepwise,
        determineSupportedPlaybackRateValues,
        setTimingsrcWithCustomUpdateFunction,
        window
    ) {
        console.log(createComputeVelocity, window, createUpdateGradually, determineSupportedPlaybackRateValues);
        var update = createUpdateStepwise(DEFAULT_TOLERANCE);
        return createSetTimingsrc(setTimingsrcWithCustomUpdateFunction, update);
    };

    var createSetCurrentTime = function createSetCurrentTime(currentTimeAssignments) {
        return function (mediaElement, previousValue, nextValue) {
            var currentTimeAssignment = currentTimeAssignments.get(mediaElement);
            if (
                currentTimeAssignment === undefined ||
                // Bug #5: Safari limits the precision of the value after a while.
                Math.abs(currentTimeAssignment[0] - previousValue) > 0.0001 ||
                currentTimeAssignment[1] !== nextValue
            ) {
                mediaElement.currentTime = nextValue;
                currentTimeAssignments.set(mediaElement, [mediaElement.currentTime, nextValue]);
            }
        };
    };

    var createSetPlaybackRate = function createSetPlaybackRate(negativeMaximum, playbackRateAssignments, positiveMinimum) {
        return function (mediaElement, previousValue, nextValue) {
            var playbackRateAssignment = playbackRateAssignments.get(mediaElement);
            if (
                playbackRateAssignment === undefined ||
                playbackRateAssignment[0] !== previousValue ||
                playbackRateAssignment[1] !== nextValue
            ) {
                // Bug #6: Chrome does not adjust the tempo when the playbackRate is very close to 1.
                mediaElement.playbackRate = nextValue > 1 ? Math.max(positiveMinimum, nextValue) : Math.min(negativeMaximum, nextValue);
                playbackRateAssignments.set(mediaElement, [mediaElement.playbackRate, nextValue]);
            }
        };
    };

    var createSetTimingsrc = function createSetTimingsrc(setTimingsrcWithCustomUpdateFunction, update) {
        return function (mediaElement, timingObject) {
            var prepareTimingStateVector = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
            var prepareUpdateVector = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
            return setTimingsrcWithCustomUpdateFunction(mediaElement, timingObject, update, prepareTimingStateVector, prepareUpdateVector);
        };
    };

    function ownKeys(e, r) {
        var t = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
            var o = Object.getOwnPropertySymbols(e);
            r &&
                (o = o.filter(function (r) {
                    return Object.getOwnPropertyDescriptor(e, r).enumerable;
                })),
                t.push.apply(t, o);
        }
        return t;
    }
    function _objectSpread(e) {
        for (var r = 1; r < arguments.length; r++) {
            var t = null != arguments[r] ? arguments[r] : {};
            r % 2
                ? ownKeys(Object(t), !0).forEach(function (r) {
                      _defineProperty(e, r, t[r]);
                  })
                : Object.getOwnPropertyDescriptors
                  ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t))
                  : ownKeys(Object(t)).forEach(function (r) {
                        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
                    });
        }
        return e;
    }
    var createSetTimingsrcWithCustomUpdateFunction = function createSetTimingsrcWithCustomUpdateFunction(
        animationFrame,
        clearInterval,
        document,
        on,
        setInterval,
        updateMediaElement
    ) {
        return function (mediaElement, timingObject, updateFunction) {
            var prepareTimingStateVector = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
            var prepareUpdateVector = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
            var previousUpdateVectorWithCustomState = null;
            var update = function update() {
                var currentTime = mediaElement.currentTime,
                    duration = mediaElement.duration,
                    playbackRate = mediaElement.playbackRate;
                var timingStateVector = timingObject.query();
                previousUpdateVectorWithCustomState = updateFunction(
                    prepareTimingStateVector === null ? timingStateVector : prepareTimingStateVector(timingStateVector),
                    currentTime,
                    previousUpdateVectorWithCustomState
                );
                var sanitizedDuration = typeof duration === 'number' && !isNaN(duration) ? duration : 0;
                var _ref =
                        prepareUpdateVector === null
                            ? previousUpdateVectorWithCustomState
                            : prepareUpdateVector(previousUpdateVectorWithCustomState),
                    position = _ref.position,
                    velocity = _ref.velocity;
                previousUpdateVectorWithCustomState = _objectSpread(
                    _objectSpread({}, previousUpdateVectorWithCustomState),
                    {},
                    {
                        position: position,
                        velocity: velocity
                    }
                );
                updateMediaElement(currentTime, sanitizedDuration, mediaElement, playbackRate, position, velocity);
                return velocity !== 0;
            };
            var unsubscribe;
            var updateOnce = function updateOnce() {
                if (!update()) {
                    unsubscribe();
                    unsubscribe = updateReactively();
                }
            };
            var updateConsistently = function updateConsistently() {
                var intervalId = setInterval(function () {
                    return updateOnce();
                }, 100);
                var restartInterval = function restartInterval() {
                    clearInterval(intervalId);
                    intervalId = setInterval(function () {
                        return updateOnce();
                    }, 100);
                };
                var unsubscribeFunctions = [
                    function () {
                        return clearInterval(intervalId);
                    },
                    animationFrame()(function () {
                        restartInterval();
                        updateOnce();
                    }),
                    on(
                        timingObject,
                        'change'
                    )(function () {
                        if (document.visibilityState === 'hidden') {
                            restartInterval();
                            updateOnce();
                        }
                    })
                ];
                return function () {
                    return unsubscribeFunctions.forEach(function (unsubscribeFunction) {
                        return unsubscribeFunction();
                    });
                };
            };
            var updateReactively = function updateReactively() {
                return on(
                    timingObject,
                    'change'
                )(function () {
                    if (update()) {
                        unsubscribe();
                        unsubscribe = updateConsistently();
                    }
                });
            };
            unsubscribe = update() ? updateConsistently() : updateReactively();
            return function () {
                return unsubscribe();
            };
        };
    };

    var createUpdateGradually = function createUpdateGradually(computeVelocity, _ref, threshold, tolerance) {
        var _ref2 = _slicedToArray(_ref, 2),
            minValue = _ref2[0],
            maxValue = _ref2[1];
        return function (_ref3, currentTime, previousUpdateVectorWithCustomState) {
            var position = _ref3.position,
                velocity = _ref3.velocity;
            var _ref4 =
                    previousUpdateVectorWithCustomState !== null && previousUpdateVectorWithCustomState !== void 0
                        ? previousUpdateVectorWithCustomState
                        : {
                              mediaElementDelay: 0
                          },
                mediaElementDelay = _ref4.mediaElementDelay;
            if (velocity < minValue || velocity > maxValue) {
                return {
                    mediaElementDelay: mediaElementDelay,
                    position: position,
                    velocity: 0
                };
            }
            if (position < 0 || velocity === 0) {
                return {
                    mediaElementDelay: mediaElementDelay,
                    position: position,
                    velocity: velocity
                };
            }
            var positionDifference = currentTime - position;
            var absolutePositionDifference = Math.abs(positionDifference);
            if (absolutePositionDifference > threshold) {
                var _ref5 =
                        previousUpdateVectorWithCustomState !== null && previousUpdateVectorWithCustomState !== void 0
                            ? previousUpdateVectorWithCustomState
                            : {
                                  position: null
                              },
                    lastPosition = _ref5.position;
                if (positionDifference < 0 || positionDifference > mediaElementDelay) {
                    if (lastPosition === currentTime) {
                        mediaElementDelay += absolutePositionDifference;
                    }
                    return {
                        mediaElementDelay: mediaElementDelay,
                        position: position + mediaElementDelay,
                        velocity: velocity
                    };
                }
                if (lastPosition !== currentTime) {
                    mediaElementDelay -= absolutePositionDifference;
                    return {
                        mediaElementDelay: mediaElementDelay,
                        position: position + mediaElementDelay,
                        velocity: velocity
                    };
                }
            }
            if (absolutePositionDifference > tolerance) {
                return {
                    mediaElementDelay: mediaElementDelay,
                    position: currentTime,
                    velocity: computeVelocity(positionDifference, minValue, maxValue, velocity)
                };
            }
            return {
                mediaElementDelay: mediaElementDelay,
                position: currentTime,
                velocity: velocity
            };
        };
    };

    var createUpdateMediaElement = function createUpdateMediaElement(pause, play, setCurrentTime, setPlaybackRate) {
        return function (currentTime, duration, mediaElement, playbackRate, position, velocity) {
            if (position < 0) {
                if (currentTime > 0) {
                    setCurrentTime(mediaElement, currentTime, 0);
                }
                pause(mediaElement);
            } else if (position >= duration) {
                if (currentTime !== duration) {
                    setCurrentTime(mediaElement, currentTime, duration);
                }
                pause(mediaElement);
            } else if (currentTime !== position) {
                setCurrentTime(mediaElement, currentTime, position);
                if (velocity !== 0) {
                    if (playbackRate !== velocity) {
                        setPlaybackRate(mediaElement, playbackRate, velocity);
                    }
                    play(mediaElement);
                } else {
                    pause(mediaElement);
                }
            } else if (playbackRate !== velocity) {
                if (velocity !== 0) {
                    setPlaybackRate(mediaElement, playbackRate, velocity);
                    play(mediaElement);
                } else {
                    pause(mediaElement);
                }
            }
        };
    };

    var MAXIMUM_PLAYHEAD_DIFFERENCE = 0.5;
    var createUpdateStepwiseFactory = function createUpdateStepwiseFactory(translateTimingStateVector) {
        return function (tolerance) {
            return function (timingStateVector, currentTime, previousUpdateVectorWithCustomState) {
                var _ref =
                        previousUpdateVectorWithCustomState !== null && previousUpdateVectorWithCustomState !== void 0
                            ? previousUpdateVectorWithCustomState
                            : {
                                  lastAppliedPostion: 0,
                                  lastAppliedTimestamp: 0,
                                  lastAppliedVelocity: 0,
                                  lastPlayheadDifference: 0,
                                  mediaElementDelay: 0,
                                  numberOfDetectedResets: 0,
                                  numberOfExpectedResets: 1
                              },
                    lastAppliedPostion = _ref.lastAppliedPostion,
                    lastAppliedTimestamp = _ref.lastAppliedTimestamp,
                    lastAppliedVelocity = _ref.lastAppliedVelocity,
                    lastPlayheadDifference = _ref.lastPlayheadDifference,
                    mediaElementDelay = _ref.mediaElementDelay,
                    numberOfDetectedResets = _ref.numberOfDetectedResets,
                    numberOfExpectedResets = _ref.numberOfExpectedResets;
                if (timingStateVector.position < 0 || timingStateVector.velocity === 0) {
                    lastAppliedPostion = timingStateVector.position;
                    lastAppliedVelocity = timingStateVector.velocity;
                    return {
                        lastAppliedPostion: lastAppliedPostion,
                        lastAppliedTimestamp: 0,
                        lastAppliedVelocity: lastAppliedVelocity,
                        lastPlayheadDifference: lastPlayheadDifference,
                        mediaElementDelay: mediaElementDelay,
                        numberOfDetectedResets: numberOfDetectedResets,
                        numberOfExpectedResets: numberOfExpectedResets,
                        position: lastAppliedPostion,
                        velocity: lastAppliedVelocity
                    };
                }
                // Bug #4: Safari decreases currentTime after playing for about 200 milliseconds.
                if (lastAppliedVelocity === timingStateVector.velocity && lastPlayheadDifference < MAXIMUM_PLAYHEAD_DIFFERENCE) {
                    var playheadDifference = Math.abs(currentTime - lastAppliedPostion) * lastAppliedVelocity;
                    if (playheadDifference < MAXIMUM_PLAYHEAD_DIFFERENCE) {
                        if (playheadDifference + 0.001 > lastPlayheadDifference) {
                            lastPlayheadDifference = playheadDifference;
                            if (numberOfDetectedResets < numberOfExpectedResets) {
                                return {
                                    lastAppliedPostion: lastAppliedPostion,
                                    lastAppliedTimestamp: lastAppliedTimestamp,
                                    lastAppliedVelocity: lastAppliedVelocity,
                                    lastPlayheadDifference: lastPlayheadDifference,
                                    mediaElementDelay: mediaElementDelay,
                                    numberOfDetectedResets: numberOfDetectedResets,
                                    numberOfExpectedResets: numberOfExpectedResets,
                                    position: currentTime,
                                    velocity: lastAppliedVelocity
                                };
                            }
                        } else {
                            lastPlayheadDifference = playheadDifference;
                            numberOfDetectedResets += 1;
                            if (numberOfDetectedResets <= numberOfExpectedResets) {
                                return {
                                    lastAppliedPostion: lastAppliedPostion,
                                    lastAppliedTimestamp: lastAppliedTimestamp,
                                    lastAppliedVelocity: lastAppliedVelocity,
                                    lastPlayheadDifference: lastPlayheadDifference,
                                    mediaElementDelay: mediaElementDelay,
                                    numberOfDetectedResets: numberOfDetectedResets,
                                    numberOfExpectedResets: numberOfExpectedResets,
                                    position: currentTime,
                                    velocity: lastAppliedVelocity
                                };
                            }
                            numberOfExpectedResets += 1;
                        }
                    } else {
                        lastPlayheadDifference = playheadDifference;
                        numberOfExpectedResets = Math.max(numberOfDetectedResets, 1);
                    }
                } else {
                    lastAppliedTimestamp = 0;
                }
                var positionDifference = Math.abs(currentTime - timingStateVector.position);
                var velocityHasChanged =
                    lastAppliedVelocity === 0 ||
                    (lastAppliedVelocity < 0 && timingStateVector.velocity > 0) ||
                    (lastAppliedVelocity > 0 && timingStateVector.velocity < 0);
                if (positionDifference > tolerance || velocityHasChanged) {
                    if (lastAppliedTimestamp > 0) {
                        var elapsedTime = timingStateVector.timestamp - lastAppliedTimestamp;
                        var _translateTimingState = translateTimingStateVector(
                                {
                                    acceleration: 0,
                                    position: lastAppliedPostion,
                                    timestamp: lastAppliedTimestamp,
                                    velocity: lastAppliedVelocity
                                },
                                elapsedTime
                            ),
                            position = _translateTimingState.position;
                        mediaElementDelay = position - currentTime;
                    }
                    lastAppliedPostion = timingStateVector.position + mediaElementDelay;
                    lastAppliedVelocity = timingStateVector.velocity;
                    return {
                        lastAppliedPostion: lastAppliedPostion,
                        lastAppliedTimestamp: timingStateVector.timestamp,
                        lastAppliedVelocity: lastAppliedVelocity,
                        lastPlayheadDifference: 0,
                        mediaElementDelay: mediaElementDelay,
                        numberOfDetectedResets: 0,
                        numberOfExpectedResets: numberOfExpectedResets,
                        position: lastAppliedPostion,
                        velocity: lastAppliedVelocity
                    };
                }
                return {
                    lastAppliedPostion: lastAppliedPostion,
                    lastAppliedTimestamp: lastAppliedTimestamp,
                    lastAppliedVelocity: lastAppliedVelocity,
                    lastPlayheadDifference: lastPlayheadDifference,
                    mediaElementDelay: mediaElementDelay,
                    numberOfDetectedResets: numberOfDetectedResets,
                    numberOfExpectedResets: numberOfExpectedResets,
                    position: currentTime,
                    velocity: timingStateVector.velocity
                };
            };
        };
    };

    var createWindow = function createWindow() {
        return typeof window === 'undefined' ? null : window;
    };

    var DEFAULT_VALUES = [Number.MIN_VALUE, Number.MAX_VALUE];
    var determineSupportedPlaybackRateValues = function determineSupportedPlaybackRateValues(window) {
        if (window === null) {
            return DEFAULT_VALUES;
        }
        var audio = new window.Audio();
        try {
            // Bug #2: Chrome does not support values above 16.
            audio.playbackRate = 17;
        } catch (_unused) {
            // Bug #1: Chrome does not support values below 0.0625.
            return [0.0625, 16];
        }
        try {
            // Bug #3: Firefox does not support negative values.
            audio.playbackRate = -1;
        } catch (_unused2) {
            return [0, DEFAULT_VALUES[1]];
        }
        return DEFAULT_VALUES;
    };

    var pause = function pause(mediaElement) {
        if (!mediaElement.paused) {
            mediaElement.pause();
        }
    };

    var play = function play(mediaElement) {
        if (mediaElement.paused) {
            mediaElement.play()['catch'](function (err) {
                return console.error(err);
            }); // tslint:disable-line no-console
        }
    };

    var createUpdateStepwise = createUpdateStepwiseFactory(timingObject.translateTimingStateVector);
    var updateMediaElement = createUpdateMediaElement(
        pause,
        play,
        createSetCurrentTime(new WeakMap()),
        createSetPlaybackRate(881 / 882, new WeakMap(), 882 / 881)
    );
    var setTimingsrcWithCustomUpdateFunction = createSetTimingsrcWithCustomUpdateFunction(
        subscribableThings.animationFrame,
        clearInterval,
        document,
        subscribableThings.on,
        setInterval,
        updateMediaElement
    );
    var setTimingsrc = createDefaultSetTimingsrc(
        createComputeVelocity,
        createSetTimingsrc,
        createUpdateGradually,
        createUpdateStepwise,
        determineSupportedPlaybackRateValues,
        setTimingsrcWithCustomUpdateFunction,
        createWindow()
    );

    exports.createSetTimingsrc = createSetTimingsrc;
    exports.createUpdateGradually = createUpdateGradually;
    exports.createUpdateStepwise = createUpdateStepwise;
    exports.setTimingsrc = setTimingsrc;
    exports.setTimingsrcWithCustomUpdateFunction = setTimingsrcWithCustomUpdateFunction;
});
