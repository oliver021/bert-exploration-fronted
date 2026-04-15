import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateMockVector, valueToColor } from '../utils';
import { ArrowDown } from 'lucide-react';

const TabVectorization: React.FC = () => {
    const [inputText, setInputText] = useState("BERT is amazing");
    const [debouncedText, setDebouncedText] = useState(inputText);
    const [vector, setVector] = useState<number[]>([]);

    // Debounce input to avoid excessive recalculation/animation
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedText(inputText || " ");
        }, 500);
        return () => clearTimeout(handler);
    }, [inputText]);

    useEffect(() => {
        setVector(generateMockVector(debouncedText));
    }, [debouncedText]);

    const tokens = ['[CLS]', ...debouncedText.trim().split(/\s+/).filter(w => w), '[SEP]'];

    return (
        <div className="flex flex-col h-full p-6 overflow-y-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Sentence to Vector</h2>
                <p className="text-slate-400">See how BERT tokenizes text, adds special tokens, and generates a dense numerical representation (embedding).</p>
            </div>

            <div className="mb-8">
                <label className="block text-sm font-medium text-slate-400 mb-2">Try your own sentence:</label>
                <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-bert-blue focus:ring-1 focus:ring-bert-blue transition-colors"
                    placeholder="Type a sentence here..."
                />
            </div>

            <div className="flex-1 flex flex-col items-center gap-6">
                
                {/* Tokenization Step */}
                <div className="w-full bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 text-center">1. Tokenization & Special Tokens</h3>
                    <div className="flex flex-wrap justify-center gap-2">
                        {tokens.map((token, i) => (
                            <motion.div 
                                key={`${token}-${i}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className={`px-3 py-2 rounded border font-mono text-sm ${
                                    token === '[CLS]' || token === '[SEP]' 
                                    ? 'bg-bert-purple/20 border-bert-purple/50 text-bert-purple' 
                                    : 'bg-slate-800 border-slate-600 text-slate-200'
                                }`}
                            >
                                {token}
                            </motion.div>
                        ))}
                    </div>
                </div>

                <ArrowDown className="text-slate-600 w-6 h-6" />

                {/* Embedding Layers Step */}
                <div className="w-full bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 relative overflow-hidden">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6 text-center">2. Input Embeddings</h3>
                    
                    <div className="flex flex-col gap-4 items-center relative z-10">
                        <div className="flex items-center gap-4 w-full max-w-2xl">
                            <div className="w-32 text-right text-xs text-slate-400 font-medium">Token Embeddings</div>
                            <div className="flex-1 h-8 bg-gradient-to-r from-blue-900/50 to-blue-600/50 rounded border border-blue-500/30 flex items-center px-4">
                                <div className="w-full h-1 bg-blue-400/30 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-400 w-full animate-[flow_2s_linear_infinite] origin-left" style={{ transform: 'scaleX(0.5)' }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="text-slate-500 font-bold">+</div>
                        <div className="flex items-center gap-4 w-full max-w-2xl">
                            <div className="w-32 text-right text-xs text-slate-400 font-medium">Segment Embeddings</div>
                            <div className="flex-1 h-8 bg-gradient-to-r from-purple-900/50 to-purple-600/50 rounded border border-purple-500/30 flex items-center px-4">
                                <div className="w-full h-1 bg-purple-400/30 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-400 w-full animate-[flow_2s_linear_infinite] origin-left" style={{ transform: 'scaleX(0.7)' }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="text-slate-500 font-bold">+</div>
                        <div className="flex items-center gap-4 w-full max-w-2xl">
                            <div className="w-32 text-right text-xs text-slate-400 font-medium">Position Embeddings</div>
                            <div className="flex-1 h-8 bg-gradient-to-r from-teal-900/50 to-teal-600/50 rounded border border-teal-500/30 flex items-center px-4">
                                <div className="w-full h-1 bg-teal-400/30 rounded-full overflow-hidden">
                                    <div className="h-full bg-teal-400 w-full animate-[flow_2s_linear_infinite] origin-left" style={{ transform: 'scaleX(0.9)' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ArrowDown className="text-slate-600 w-6 h-6" />

                {/* Final Vector Output */}
                <div className="w-full bg-slate-800/50 border border-slate-600 rounded-xl p-6 shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">3. Final [CLS] Embedding Vector</h3>
                        <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">Dim: {vector.length} (Mocked)</span>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-1.5 p-4 bg-slate-900 rounded-lg border border-slate-800">
                        {vector.map((val, i) => (
                            <motion.div
                                key={`${debouncedText}-${i}`}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.01, duration: 0.2 }}
                                className="w-6 h-6 sm:w-8 sm:h-8 rounded-sm relative group cursor-crosshair"
                                style={{ backgroundColor: valueToColor(val) }}
                            >
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-50">
                                    <div className="bg-black text-white text-[10px] py-1 px-2 rounded whitespace-nowrap">
                                        Idx: {i} | Val: {val.toFixed(3)}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-4 text-center">
                        This dense vector captures the semantic meaning of the entire sentence. In real BERT, this is typically 768 dimensions.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default TabVectorization;
