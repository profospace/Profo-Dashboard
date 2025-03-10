// pathUtils.js
import _ from 'lodash';

export const simplifyPath = (path, tolerance = 0.1) => {
    if (!path || path.length < 3) return path;

    const result = [path[0]];

    for (let i = 1; i < path.length - 1; i++) {
        const prev = path[i - 1];
        const curr = path[i];
        const next = path[i + 1];

        // Calculate if point is significant enough to keep
        const dx1 = curr.x - prev.x;
        const dy1 = curr.y - prev.y;
        const dx2 = next.x - curr.x;
        const dy2 = next.y - curr.y;

        // Calculate angle change
        const angle = Math.abs(Math.atan2(dy2, dx2) - Math.atan2(dy1, dx1));

        if (angle > tolerance) {
            result.push(curr);
        }
    }

    result.push(path[path.length - 1]);
    return result;
};

export const optimizePathData = (buildings) => {
    return buildings.map(building => ({
        ...building,
        path: simplifyPath(building.path)
    }));
};

export const batchProcessPaths = (paths, batchSize = 10) => {
    return _.chunk(paths, batchSize).map(batch =>
        batch.map(path => simplifyPath(path))
    ).flat();
};