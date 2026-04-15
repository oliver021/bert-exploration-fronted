import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, FileText, Cpu, ArrowRight, EyeOff, Play, Pause, Lightbulb, Network, Layers } from 'lucide-react';

const TabTraining: React.FC = () => {
    const [step, setStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isPlaying) {
            timer = setInterval(() => {
                setStep((prev) => (prev + 1) % 4);
            }, 3000);
        }
        return () => clearInterval(timer);
    }, [isPlaying]);

    const handleStepClick = (index: number) => {
        setStep(index);
        setIsPlaying(false); // Pause auto-play when user manually interacts
    };

    const steps = [
        { title: "Raw Text Corpus", desc: "Massive amounts of unlabeled text data (e.g., Wikipedia)." },
        { title: "Masking (MLM)", desc: "15% of words are randomly hidden. The model must guess them." },
        { title: "Transformer Encoders", desc: "Deep bidirectional layers process context from both left and right." },
        { title: "Prediction & Loss", desc: "Model predicts the masked word. Error is used to update weights." }
    ];

    return (
        <div className="flex flex-col h-full p-6 overflow-y-auto">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Pre-training: Masked Language Modeling</h2>
                    <p className="text-slate-400">BERT learns language by reading vast amounts of text and trying to fill in blanks.</p>
                </div>
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 shrink-0 ${
                        isPlaying 
                        ? 'bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700' 
                        : 'bg-bert-blue/20 border-bert-blue/50 text-bert-blue hover:bg-bert-blue/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                    }`}
                >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span className="text-sm font-medium">{isPlaying ? 'Pause Flow' : 'Play Flow'}</span>
                </button>
            </div>

            {/* Interactive Visualization Section */}
            <div className="flex flex-col items-center justify-center relative min-h-[450px] shrink-0 mb-12">
                {/* Progress Indicator */}
                <div className="flex w-full max-w-3xl justify-between mb-12 relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-10 -translate-y-1/2 rounded-full"></div>
                    <motion.div 
                        className="absolute top-1/2 left-0 h-1 bg-bert-blue -z-10 -translate-y-1/2 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                    
                    {steps.map((s, i) => (
                        <div key={i} className="flex flex-col items-center relative group">
                            <button 
                                onClick={() => handleStepClick(i)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 cursor-pointer hover:scale-110 ${
                                    step >= i 
                                    ? 'bg-bert-blue border-bert-blue text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                                    : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300'
                                }`}
                                aria-label={`Go to step ${i + 1}: ${s.title}`}
                            >
                                {i + 1}
                            </button>
                            <div className="absolute top-14 w-32 text-center cursor-pointer" onClick={() => handleStepClick(i)}>
                                <p className={`text-sm font-medium transition-colors duration-300 ${
                                    step >= i ? 'text-slate-200' : 'text-slate-500 group-hover:text-slate-400'
                                }`}>
                                    {s.title}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Visualization Area */}
                <div className="w-full max-w-4xl bg-slate-800/50 border border-slate-700 rounded-2xl p-8 mt-8 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden">
                    
                    {/* Background Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20"></div>

                    <AnimatePresence mode="wait">
                        {step === 0 && (
                            <motion.div key="step0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center text-center z-10">
                                <Database className="w-16 h-16 text-slate-400 mb-4" />
                                <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg shadow-lg">
                                    <p className="text-lg font-mono text-slate-300">"The quick brown fox jumps over the lazy dog."</p>
                                </div>
                                <p className="mt-6 text-slate-400 max-w-md">{steps[0].desc}</p>
                            </motion.div>
                        )}

                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center text-center z-10">
                                <EyeOff className="w-16 h-16 text-bert-purple mb-4" />
                                <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg shadow-lg flex gap-2 text-lg font-mono">
                                    <span className="text-slate-300">"The quick</span>
                                    <span className="bg-bert-purple/20 text-bert-purple px-2 rounded border border-bert-purple/50">[MASK]</span>
                                    <span className="text-slate-300">fox jumps over the lazy dog."</span>
                                </div>
                                <p className="mt-6 text-slate-400 max-w-md">{steps[1].desc}</p>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center text-center z-10 w-full">
                                <Cpu className="w-16 h-16 text-bert-teal mb-4" />
                                <div className="flex items-center justify-center gap-4 w-full">
                                    <div className="flex flex-col gap-2">
                                        <div className="h-8 w-24 bg-slate-700 rounded animate-pulse"></div>
                                        <div className="h-8 w-24 bg-bert-purple/40 rounded border border-bert-purple/50 flex items-center justify-center text-xs text-bert-purple">[MASK]</div>
                                        <div className="h-8 w-24 bg-slate-700 rounded animate-pulse"></div>
                                    </div>
                                    
                                    <div className="flex flex-col gap-2">
                                        {[1,2,3].map(i => (
                                            <div key={i} className="flex items-center gap-2">
                                                <ArrowRight className="w-4 h-4 text-slate-500" />
                                                <div className="h-10 w-32 bg-bert-teal/20 border border-bert-teal/50 rounded flex items-center justify-center text-bert-teal text-sm font-medium">
                                                    Encoder L{i}
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-slate-500" />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <div className="h-8 w-24 bg-slate-700 rounded animate-pulse"></div>
                                        <div className="h-8 w-24 bg-bert-teal/40 rounded border border-bert-teal/50 flex items-center justify-center text-xs text-bert-teal">Vector</div>
                                        <div className="h-8 w-24 bg-slate-700 rounded animate-pulse"></div>
                                    </div>
                                </div>
                                <p className="mt-6 text-slate-400 max-w-md">{steps[2].desc}</p>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center text-center z-10">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-bert-pink/20 blur-xl rounded-full"></div>
                                    <FileText className="w-16 h-16 text-bert-pink mb-4 relative z-10" />
                                </div>
                                <div className="flex items-center gap-4 bg-slate-900 border border-slate-700 p-6 rounded-lg shadow-lg">
                                    <div className="text-center">
                                        <div className="text-xs text-slate-500 mb-1">Prediction</div>
                                        <div className="text-xl font-mono text-bert-pink">"brown"</div>
                                    </div>
                                    <div className="w-px h-12 bg-slate-700"></div>
                                    <div className="text-center">
                                        <div className="text-xs text-slate-500 mb-1">Actual</div>
                                        <div className="text-xl font-mono text-slate-300">"brown"</div>
                                    </div>
                                    <div className="w-px h-12 bg-slate-700"></div>
                                    <div className="text-center">
                                        <div className="text-xs text-slate-500 mb-1">Loss</div>
                                        <div className="text-xl font-mono text-green-400">0.01 ↓</div>
                                    </div>
                                </div>
                                <p className="mt-6 text-slate-400 max-w-md">{steps[3].desc}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Professional Explanation Section */}
            <div className="mt-auto shrink-0 bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-xl">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-400" />
                        The Architecture of Understanding
                    </h3>
                    <p className="text-slate-300 leading-relaxed">
                        BERT (<span className="font-semibold text-bert-blue">B</span>idirectional <span className="font-semibold text-bert-blue">E</span>ncoder <span className="font-semibold text-bert-blue">R</span>epresentations from <span className="font-semibold text-bert-blue">T</span>ransformers) revolutionized natural language processing by introducing true bidirectionality to language models. Unlike previous models that read text sequentially (left-to-right or right-to-left), BERT uses the Transformer encoder architecture to read the entire sequence of words at once. This allows the model to learn the deep context of a word based on all of its surroundings simultaneously.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-xl">
                        <div className="w-10 h-10 bg-bert-purple/20 rounded-lg flex items-center justify-center mb-4">
                            <Network className="w-5 h-5 text-bert-purple" />
                        </div>
                        <h4 className="text-white font-semibold mb-2">1. Self-Attention Mechanism</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            The core of the Transformer. It allows the model to weigh the importance of different words in a sentence relative to each other, regardless of their positional distance, capturing complex grammatical and semantic dependencies.
                        </p>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-xl">
                        <div className="w-10 h-10 bg-bert-teal/20 rounded-lg flex items-center justify-center mb-4">
                            <ArrowRight className="w-5 h-5 text-bert-teal" />
                        </div>
                        <h4 className="text-white font-semibold mb-2">2. True Bidirectionality</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Through Masked Language Modeling (MLM), BERT learns deep contextual representations by predicting hidden tokens based on both left and right context simultaneously, rather than predicting the next word in a sequence.
                        </p>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-xl">
                        <div className="w-10 h-10 bg-bert-pink/20 rounded-lg flex items-center justify-center mb-4">
                            <Layers className="w-5 h-5 text-bert-pink" />
                        </div>
                        <h4 className="text-white font-semibold mb-2">3. Transfer Learning Paradigm</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            BERT established the "pre-train then fine-tune" workflow. A single massive model learns universal language representations, which can then be cheaply adapted to specific downstream tasks with minimal architectural changes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Simple AnimatePresence mock since we are importing framer-motion directly
const AnimatePresence: React.FC<{children: React.ReactNode, mode?: string}> = ({ children }) => {
    return <>{children}</>;
};

export default TabTraining;
