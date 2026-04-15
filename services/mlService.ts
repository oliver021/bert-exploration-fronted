import { pipeline, env } from '@xenova/transformers';

// Disable local models to force fetching from Hugging Face Hub
env.allowLocalModels = false;

export class MLService {
    static instance: any = null;
    static isLoaded = false;

    // Load the model (downloads the ~22MB weights to the browser cache)
    static async loadModel(onProgress?: (data: any) => void) {
        if (this.instance) return this.instance;

        // 'feature-extraction' is the pipeline used for getting embeddings
        this.instance = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
            progress_callback: onProgress
        });
        
        this.isLoaded = true;
        return this.instance;
    }

    // Convert a sentence into a real 384-dimensional dense vector
    static async getEmbedding(text: string): Promise<number[]> {
        const extractor = await this.loadModel();
        
        // pooling: 'mean' and normalize: true are standard for semantic similarity
        const output = await extractor(text, { pooling: 'mean', normalize: true });
        
        return Array.from(output.data);
    }
}
