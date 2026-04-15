import { VECTOR_DIMENSIONS } from './constants';

// Generates a deterministic pseudo-random vector based on text content
// This simulates how similar texts might have similar vectors in a very basic way
export function generateMockVector(text: string): number[] {
    const vec = new Array(VECTOR_DIMENSIONS).fill(0);
    const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 0);

    // Base vector from string hash
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = ((hash << 5) - hash) + text.charCodeAt(i);
        hash |= 0;
    }

    // Seed random with hash
    const random = (seed: number) => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };

    for (let i = 0; i < VECTOR_DIMENSIONS; i++) {
        vec[i] = random(hash + i) * 2 - 1; // -1 to 1
    }

    // Boost based on keywords to make the mock search actually work somewhat logically
    const topics = {
        tech: ['ai', 'technology', 'machine', 'learning', 'quantum', 'computing', 'data', 'intelligence'],
        space: ['space', 'exploration', 'telescope', 'galaxies', 'stars', 'webb'],
        health: ['health', 'diet', 'exercise', 'cardiovascular', 'vegetables', 'fruits'],
        animals: ['fox', 'dog', 'cats', 'animal', 'agility'],
        environment: ['renewable', 'energy', 'sustainable', 'future']
    };

    words.forEach(word => {
        if (topics.tech.includes(word)) { vec[0] += 2; vec[1] += 2; vec[2] -= 1; }
        if (topics.space.includes(word)) { vec[3] += 2; vec[4] += 2; vec[5] -= 1; }
        if (topics.health.includes(word)) { vec[6] += 2; vec[7] += 2; vec[8] -= 1; }
        if (topics.animals.includes(word)) { vec[9] += 2; vec[10] += 2; vec[11] -= 1; }
        if (topics.environment.includes(word)) { vec[12] += 2; vec[13] += 2; vec[14] -= 1; }
    });

    // Normalize vector (L2 norm)
    const mag = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
    return vec.map(v => mag === 0 ? 0 : v / mag);
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Helper to map a value from [-1, 1] to a color for heatmap
export function valueToColor(value: number): string {
    // Map -1 to red, 0 to dark, 1 to blue
    if (value < 0) {
        const intensity = Math.floor(Math.abs(value) * 255);
        return `rgb(${intensity}, 0, ${Math.floor(intensity/2)})`;
    } else {
        const intensity = Math.floor(value * 255);
        return `rgb(0, ${Math.floor(intensity/2)}, ${intensity})`;
    }
}
