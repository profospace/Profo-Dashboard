// Utility functions for path simplification and optimization
export const simplifyPath = (path, tolerance = 0.01) => {
    if (path.length <= 2) return path;
    
    const simplified = [path[0]];
    
    for (let i = 1; i < path.length - 1; i++) {
        const prev = path[i - 1];
        const curr = path[i];
        const next = path[i + 1];
        
        const distance = Math.sqrt(
            Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2)
        );
        
        if (distance > tolerance) {
            simplified.push(curr);
        }
    }
    
    simplified.push(path[path.length - 1]);
    return simplified;
};

export const optimizePathData = (buildings) => {
    return buildings.map(building => ({
        ...building,
        path: simplifyPath(building.path, 0.005)
    }));
};

// Convert 2D path to 3D vertices
export const pathTo3D = (path, height = 0.1) => {
    if (!path || path.length < 3) return [];
    
    // Create base vertices
    const vertices = path.map(point => [
        (point.x - 0.5) * 10, // Scale and center
        height,
        (point.y - 0.5) * 10
    ]);
    
    return vertices;
};

// Create triangulated faces from path
export const triangulatePolygon = (vertices) => {
    if (vertices.length < 3) return [];
    
    const indices = [];
    const n = vertices.length;
    
    // Simple fan triangulation
    for (let i = 1; i < n - 1; i++) {
        indices.push(0, i, i + 1);
    }
    
    return indices;
};

// Calculate building dimensions
export const calculateDimensions = (path) => {
    if (!path || path.length < 2) return { width: 0, height: 0, area: 0 };
    
    const xs = path.map(p => p.x);
    const ys = path.map(p => p.y);
    
    const width = (Math.max(...xs) - Math.min(...xs)) * 100; // Convert to meters
    const height = (Math.max(...ys) - Math.min(...ys)) * 100;
    
    // Calculate area using shoelace formula
    let area = 0;
    for (let i = 0; i < path.length; i++) {
        const j = (i + 1) % path.length;
        area += path[i].x * path[j].y;
        area -= path[j].x * path[i].y;
    }
    area = Math.abs(area) / 2 * 10000; // Convert to square meters
    
    return { width: width.toFixed(1), height: height.toFixed(1), area: area.toFixed(1) };
};

export const batchProcessPaths = (paths, batchSize = 10) => {
    const batches = [];
    for (let i = 0; i < paths.length; i += batchSize) {
        batches.push(paths.slice(i, i + batchSize));
    }
    
    return batches.map(batch =>
        batch.map(path => simplifyPath(path))
    ).flat();
};