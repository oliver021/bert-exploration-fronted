import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Database, Activity, Loader2, Settings2, X, Check } from 'lucide-react';
import { DATASETS } from '../constants';
import { cosineSimilarity, valueToColor } from '../utils';
import { SearchResult, SentenceData } from '../types';
import { MLService } from '../services/mlService';

const TabSemanticSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    
    // ML & Data State
    const [isReady, setIsReady] = useState(false);
    const [progressInfo, setProgressInfo] = useState<any>(null);
    const [db, setDb] = useState<SentenceData[]>([]);
    const [queryVector, setQueryVector] = useState<number[]>([]);
    
    // Dataset Selection State
    const [selectedDatasetId, setSelectedDatasetId] = useState<string>(DATASETS[0].id);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSwitchingDb, setIsSwitchingDb] = useState(false);

    const activeDataset = useMemo(() => DATASETS.find(d => d.id === selectedDatasetId) || DATASETS[0], [selectedDatasetId]);

    // 1. Load Model (Only once)
    useEffect(() => {
        let mounted = true;
        const initModel = async () => {
            try {
                await MLService.loadModel((p) => {
                    if (mounted) setProgressInfo(p);
                });
                if (mounted) setIsReady(true);
            } catch (e) {
                console.error("Error loading model:", e);
            }
        };
        initModel();
        return () => { mounted = false; };
    }, []);

    // 2. Compute Database Vectors (Runs on init and when dataset changes)
    useEffect(() => {
        let mounted = true;
        const computeDb = async () => {
            if (!isReady) return;
            
            setIsSwitchingDb(true);
            try {
                const computedDb = await Promise.all(activeDataset.sentences.map(async (item, idx) => {
                    const vec = await MLService.getEmbedding(item.text);
                    return { id: `sent-${idx}`, text: item.text, category: item.category, vector: vec };
                }));
                
                if (mounted) {
                    setDb(computedDb);
                    setIsSwitchingDb(false);
                }
            } catch (e) {
                console.error("Error computing DB:", e);
                if (mounted) setIsSwitchingDb(false);
            }
        };
        computeDb();
        return () => { mounted = false; };
    }, [isReady, activeDataset]);

    // 3. Debounce Query Input
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query), 500);
        return () => clearTimeout(timer);
    }, [query]);

    // 4. Compute Query Vector
    useEffect(() => {
        let mounted = true;
        const computeQuery = async () => {
            if (!debouncedQuery.trim()) {
                if (mounted) setQueryVector([]);
                return;
            }
            const vec = await MLService.getEmbedding(debouncedQuery);
            if (mounted) setQueryVector(vec);
        };
        if (isReady) computeQuery();
        return () => { mounted = false; };
    }, [debouncedQuery, isReady]);

    // 5. Calculate Results dynamically
    const results: SearchResult[] = useMemo(() => {
        if (!queryVector.length || !debouncedQuery.trim()) {
            return db.map(s => ({ ...s, similarity: 0 }));
        }

        const scored = db.map(sentence => ({
            ...sentence,
            similarity: cosineSimilarity(queryVector, sentence.vector)
        }));

        // Sort descending by similarity
        return scored.sort((a, b) => b.similarity - a.similarity);
    }, [queryVector, db, debouncedQuery]);

    // Render Loading Screen (Initial Model Download)
    if (!isReady) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/80 border border-slate-700 p-8 rounded-2xl flex flex-col items-center max-w-md w-full shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-bert-blue/10 blur-3xl rounded-full pointer-events-none"></div>
                    
                    <Loader2 className="w-12 h-12 text-bert-blue animate-spin mb-6 relative z-10" />
                    <h2 className="text-xl font-bold text-white mb-2 text-center relative z-10">Loading AI Model</h2>
                    <p className="text-slate-400 text-center text-sm mb-8 relative z-10">
                        Downloading a real Transformer model (<span className="text-slate-300 font-mono">all-MiniLM-L6-v2</span>) directly into your browser. This happens only once and runs entirely locally!
                    </p>
                    
                    <div className="w-full bg-slate-800 rounded-full h-2 mb-3 overflow-hidden relative z-10">
                        <div 
                            className="bg-bert-blue h-2 rounded-full transition-all duration-300 ease-out" 
                            style={{ width: `${progressInfo?.progress || 0}%` }}
                        ></div>
                    </div>
                    
                    <div className="text-xs text-slate-500 font-mono w-full flex justify-between relative z-10">
                        <span className="truncate mr-4">{progressInfo?.file || 'Initializing engine...'}</span>
                        <span>{progressInfo?.progress ? `${Math.round(progressInfo.progress)}%` : ''}</span>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Render Main UI
    return (
        <div className="flex flex-col h-full p-6 overflow-hidden relative">
            <div className="mb-6 shrink-0">
                <h2 className="text-2xl font-bold text-white mb-2">Semantic Search</h2>
                <p className="text-slate-400">Type a query to see how BERT finds similar sentences based on meaning (vector distance), not just exact keyword matches.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                
                {/* Left Panel: Query Input & Vector */}
                <div className="w-full lg:w-1/3 flex flex-col gap-4 shrink-0">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                            <Search className="w-4 h-4 text-bert-blue" />
                            Search Query
                        </label>
                        <input 
                            type="text" 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-bert-blue focus:ring-1 focus:ring-bert-blue transition-colors"
                            placeholder="e.g., 'tell me about space'"
                        />
                        
                        {/* Query Vector Visualization */}
                        <div className="mt-6">
                            <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider flex justify-between">
                                <span>Query Vector (384D)</span>
                                {query && <span className="text-bert-blue animate-pulse">Live</span>}
                            </div>
                            <div className="flex flex-wrap gap-1 p-2 bg-slate-900 rounded border border-slate-800">
                                {(queryVector.length ? queryVector : new Array(128).fill(0)).slice(0, 128).map((val, i) => (
                                    <div
                                        key={`q-${i}`}
                                        className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm transition-colors duration-300"
                                        style={{ backgroundColor: queryVector.length ? valueToColor(val) : '#1e293b' }}
                                        title={`Dim ${i}: ${val.toFixed(3)}`}
                                    />
                                ))}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1 text-right">Showing first 128 dimensions</div>
                        </div>
                    </div>

                    <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 flex-1">
                        <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-bert-teal" />
                            How it works
                        </h3>
                        <ul className="text-sm text-slate-400 space-y-3">
                            <li>1. Your query is converted into a dense 384-dimensional vector.</li>
                            <li>2. We calculate the <strong>Cosine Similarity</strong> between your query vector and all stored sentence vectors.</li>
                            <li>3. Results are sorted by highest similarity score (closer to 1.0 is better).</li>
                            <li>4. The top results are displayed based on their similarity scores.</li>
                            <li>Notes: The semantic search enabled a more intuitive way to find relevant information and
                            demonstrates the power of BERT embeddings in understanding language meaning beyond just keyword matching.
                            It also unlocks the potential for more advanced features like clustering, topic modeling, and even generative applications in the future!
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right Panel: Database & Results */}
                <div className="w-full lg:w-2/3 bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col min-h-0 relative">
                    <div className="flex items-center justify-between mb-4 shrink-0">
                        <div className="flex items-center gap-3">
                            <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <Database className="w-4 h-4 text-bert-purple" />
                                Vector Database ({db.length} items)
                            </h3>
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-md text-slate-400 hover:text-white transition-colors"
                                title="Change Dataset"
                            >
                                <Settings2 className="w-4 h-4" />
                            </button>
                        </div>
                        {query && <span className="text-xs bg-bert-blue/20 text-bert-blue px-2 py-1 rounded border border-bert-blue/30">Sorted by relevance</span>}
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 relative">
                        {isSwitchingDb ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm z-10 rounded-lg border border-slate-800">
                                <Loader2 className="w-8 h-8 text-bert-purple animate-spin mb-4" />
                                <p className="text-slate-300 font-medium">Computing embeddings for new dataset...</p>
                            </div>
                        ) : (
                            <AnimatePresence>
                                {results.map((result, index) => (
                                    <motion.div
                                        key={result.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ 
                                            layout: { type: "spring", stiffness: 300, damping: 30 },
                                            opacity: { duration: 0.2 }
                                        }}
                                        className={`p-4 rounded-lg border flex flex-col gap-3 ${
                                            query && index === 0 && result.similarity > 0.1
                                            ? 'bg-bert-blue/10 border-bert-blue/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                                            : 'bg-slate-800/40 border-slate-700/50'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            <p className={`text-sm ${query && index === 0 && result.similarity > 0.1 ? 'text-white font-medium' : 'text-slate-300'}`}>
                                                {result.text}
                                            </p>
                                            
                                            {/* Similarity Score Badge */}
                                            {query && (
                                                <div className={`shrink-0 text-xs font-mono px-2 py-1 rounded flex items-center gap-1 ${
                                                    result.similarity > 0.5 ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                                    result.similarity > 0.2 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                                    'bg-slate-700 text-slate-400'
                                                }`}>
                                                    {(result.similarity * 100).toFixed(1)}%
                                                </div>
                                            )}
                                        </div>

                                        {/* Mini Vector Visualization */}
                                        <div className="flex items-center gap-3">
                                            <div className="text-[10px] text-slate-500 uppercase w-12">Vector</div>
                                            <div className="flex-1 flex gap-[1px] h-2 opacity-70 overflow-hidden rounded-sm">
                                                {result.vector.slice(0, 64).map((val, i) => (
                                                    <div 
                                                        key={i} 
                                                        className="flex-1" 
                                                        style={{ backgroundColor: valueToColor(val) }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </div>

            {/* Dataset Selection Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-full"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-slate-800">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Select Dataset</h3>
                                    <p className="text-sm text-slate-400 mt-1">Choose a topic to populate the vector database.</p>
                                </div>
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="p-6 overflow-y-auto flex-1 space-y-3">
                                {DATASETS.map((dataset) => (
                                    <button
                                        key={dataset.id}
                                        onClick={() => {
                                            setSelectedDatasetId(dataset.id);
                                            setIsModalOpen(false);
                                        }}
                                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                                            selectedDatasetId === dataset.id 
                                            ? 'bg-bert-blue/10 border-bert-blue/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                                            : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-500'
                                        }`}
                                    >
                                        <div>
                                            <h4 className={`font-semibold ${selectedDatasetId === dataset.id ? 'text-bert-blue' : 'text-slate-200 group-hover:text-white'}`}>
                                                {dataset.name}
                                            </h4>
                                            <p className="text-sm text-slate-400 mt-1">{dataset.description}</p>
                                            <p className="text-xs text-slate-500 mt-2 font-mono">{dataset.sentences.length} sentences</p>
                                        </div>
                                        {selectedDatasetId === dataset.id && (
                                            <div className="w-8 h-8 rounded-full bg-bert-blue/20 flex items-center justify-center shrink-0">
                                                <Check className="w-5 h-5 text-bert-blue" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TabSemanticSearch;
