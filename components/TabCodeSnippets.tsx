import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Terminal, Copy, Check } from 'lucide-react';

type Language = 'python' | 'javascript' | 'csharp';

const TabCodeSnippets: React.FC = () => {
    const [activeLang, setActiveLang] = useState<Language>('python');
    const [copied, setCopied] = useState(false);

    const snippets = {
        python: {
            name: 'Python',
            desc: 'Using the popular sentence-transformers library.',
            code: `from sentence_transformers import SentenceTransformer, util

# 1. Load a pre-trained BERT model
model = SentenceTransformer('all-MiniLM-L6-v2')

# 2. Define your database and query
sentences = [
    "The cat sits outside",
    "A man is playing guitar",
    "The new movie is awesome"
]
query = "Someone is strumming an instrument"

# 3. Compute embeddings (dense vectors)
sentence_embeddings = model.encode(sentences)
query_embedding = model.encode(query)

# 4. Calculate cosine similarity
cosine_scores = util.cos_sim(query_embedding, sentence_embeddings)

# 5. Output results sorted by similarity
for i, score in enumerate(cosine_scores[0]):
    print(f"Score: {score:.4f} | {sentences[i]}")`
        },
        javascript: {
            name: 'JavaScript / Node.js',
            desc: 'Using Transformers.js for in-browser or Node.js execution.',
            code: `import { pipeline } from '@xenova/transformers';

async function runSemanticSearch() {
    // 1. Load the model (runs locally via ONNX Runtime Web)
    const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

    const sentences = ["The cat sits outside", "A man is playing guitar"];
    const query = "Someone is strumming an instrument";

    // 2. Compute embeddings (pooling: 'mean', normalize: true for cosine similarity)
    const queryOutput = await extractor(query, { pooling: 'mean', normalize: true });
    const queryVector = Array.from(queryOutput.data);

    // 3. Compare against database
    for (const text of sentences) {
        const docOutput = await extractor(text, { pooling: 'mean', normalize: true });
        const docVector = Array.from(docOutput.data);

        // 4. Calculate dot product (equivalent to cosine similarity for normalized vectors)
        const similarity = queryVector.reduce((sum, val, i) => sum + val * docVector[i], 0);
        console.log(\`Score: \${similarity.toFixed(4)} | \${text}\`);
    }
}

runSemanticSearch();`
        },
        csharp: {
            name: 'C# / .NET',
            desc: 'Using Microsoft.ML.OnnxRuntime for high-performance inference.',
            code: `using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.OnnxRuntime.Tensors;
using System;
using System.Linq;

public class SemanticSearch
{
    public static void Run()
    {
        // 1. Load ONNX model
        string modelPath = "all-MiniLM-L6-v2.onnx";
        using var session = new InferenceSession(modelPath);

        // Note: Tokenization step is required here before inference
        // (Converting strings to input_ids, attention_mask)
        // var inputs = Tokenize("Someone is strumming an instrument");

        // 2. Run inference to get embeddings
        // using IDisposableReadOnlyCollection<DisposableNamedOnnxValue> results = session.Run(inputs);
        // var embeddings = results.First().AsEnumerable<float>().ToArray();

        // 3. Calculate Cosine Similarity
        // float similarity = CosineSimilarity(queryEmbedding, docEmbedding);
        // Console.WriteLine($"Similarity Score: {similarity}");

        Console.WriteLine("Note: C# requires manual tokenization and ONNX runtime setup.");
        Console.WriteLine("Libraries like BERTTokenizers and MathNet.Numerics are commonly used.");
    }

    private static float CosineSimilarity(float[] v1, float[] v2) {
        float dot = v1.Zip(v2, (a, b) => a * b).Sum();
        float mag1 = (float)Math.Sqrt(v1.Sum(a => a * a));
        float mag2 = (float)Math.Sqrt(v2.Sum(b => b * b));
        return dot / (mag1 * mag2);
    }
}`
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(snippets[activeLang].code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col h-full p-6 overflow-y-auto">
            <div className="mb-8 shrink-0">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                    <Code2 className="w-6 h-6 text-bert-blue" />
                    Implementation Guide
                </h2>
                <p className="text-slate-400">
                    Ready to build your own semantic search? Here is how you can implement the concepts from the previous tabs using real code in different programming languages.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                {/* Language Selector */}
                <div className="w-full lg:w-1/4 flex flex-col gap-3 shrink-0">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Select Language</h3>
                    {(Object.keys(snippets) as Language[]).map((lang) => (
                        <button
                            key={lang}
                            onClick={() => setActiveLang(lang)}
                            className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-300 ${
                                activeLang === lang 
                                ? 'bg-slate-800 border-bert-blue/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                                : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                            }`}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <Terminal className={`w-4 h-4 ${activeLang === lang ? 'text-bert-blue' : 'text-slate-500'}`} />
                                <span className={`font-semibold ${activeLang === lang ? 'text-white' : 'text-slate-300'}`}>
                                    {snippets[lang].name}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                {snippets[lang].desc}
                            </p>
                        </button>
                    ))}
                </div>

                {/* Code Editor View */}
                <div className="w-full lg:w-3/4 flex flex-col bg-[#0d1117] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                    {/* Editor Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                            </div>
                            <span className="ml-4 text-xs font-mono text-slate-500">
                                semantic_search.{activeLang === 'python' ? 'py' : activeLang === 'javascript' ? 'js' : 'cs'}
                            </span>
                        </div>
                        <button 
                            onClick={handleCopy}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors border border-slate-700"
                        >
                            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? 'Copied!' : 'Copy Code'}
                        </button>
                    </div>

                    {/* Code Content */}
                    <div className="flex-1 p-6 overflow-y-auto relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeLang}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <pre className="text-sm font-mono leading-relaxed text-slate-300 whitespace-pre-wrap break-words">
                                    <code>{snippets[activeLang].code}</code>
                                </pre>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TabCodeSnippets;
