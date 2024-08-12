import { IUpdateVector } from '../interfaces';
import { TUpdateFunction } from '../types';
import type { createComputeVelocity } from './compute-velocity';
export declare const createUpdateGradually: (computeVelocity: ReturnType<typeof createComputeVelocity>, [minValue, maxValue]: readonly [number, number], threshold: number, tolerance: number) => TUpdateFunction<IUpdateVector & {
    mediaElementDelay: number;
}>;
//# sourceMappingURL=update-gradually.d.ts.map