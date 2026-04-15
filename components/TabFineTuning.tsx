import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, MessageSquare, Search, Tag } from 'lucide-react';

type TaskType = 'classification' | 'qa' | 'ner';

const TabFineTuning: React.FC = () => {
    const [activeTask, setActiveTask] = useState<TaskType>('classification');

    const tasks = {
        classification: {
            id: 'classification',
            icon: <MessageSquare className="w-5 h-5" />,
            title: 'Text Classification',
            desc: 'Predicting a label for the whole sentence (e.g., Sentiment Analysis).',
            headColor: 'bg-blue-500',
            headBorder: 'border-blue-400',
            input: '"This movie was absolutely fantastic!"',
            output: 'Positive (98%)'
        },
        qa: {
            id: 'qa',
            icon: <Search className="w-5 h-5" />,
            title: 'Question Answering',
            desc: 'Finding the start and end span of an answer in a context.',
            headColor: 'bg-purple-500',
            headBorder: 'border-purple-400',
            input: 'Q: "Who wrote Hamlet?" C: "Hamlet was written by Shakespeare."',
            output: 'Span: "Shakespeare"'
        },
        ner: {
            id: 'ner',
            icon: <Tag className="w-5 h-5" />,
            title: 'Named Entity Recognition',
            desc: 'Tagging individual tokens (e.g., Person, Location, Org).',
            headColor: 'bg-teal-500',
            headBorder: 'border-teal-400',
            input: '"Apple is looking at buying U.K. startup for $1 billion"',
            output: '[ORG] Apple, [LOC] U.K.'
        }
    };

    const currentTask = tasks[activeTask];

    return (
        <div className="flex flex-col h-full p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Fine-Tuning: Adapting to Tasks</h2>
                <p className="text-slate-400">The pre-trained BERT model acts as a powerful foundation. We add a small "head" layer on top and train it briefly on a specific task.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 flex-1">
                {/* Task Selector */}
                <div className="w-full lg:w-1/3 flex flex-col gap-4">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Select Task</h3>
                    {(Object.keys(tasks) as TaskType[]).map((key) => (
                        <button
                            key={key}
                            onClick={() => setActiveTask(key)}
                            className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-300 ${
                                activeTask === key 
                                ? 'bg-slate-800 border-slate-500 shadow-lg' 
                                : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                            }`}
                        >
                            <div className={`p-2 rounded-lg ${activeTask === key ? tasks[key].headColor : 'bg-slate-800'} text-white`}>
                                {tasks[key].icon}
                            </div>
                            <div>
                                <h4 className={`font-medium ${activeTask === key ? 'text-white' : 'text-slate-300'}`}>{tasks[key].title}</h4>
                                <p className="text-xs text-slate-500 mt-1">{tasks[key].desc}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Visualization */}
                <div className="w-full lg:w-2/3 bg-slate-900/50 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
                    
                    {/* Input */}
                    <div className="mb-8 text-center z-10">
                        <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Input</div>
                        <div className="bg-slate-800 border border-slate-700 px-6 py-3 rounded-lg text-slate-300 font-mono text-sm shadow-inner">
                            {currentTask.input}
                        </div>
                    </div>

                    {/* Model Stack */}
                    <div className="flex flex-col items-center relative z-10">
                        {/* Task Specific Head */}
                        <motion.div 
                            key={currentTask.id}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className={`w-48 h-16 ${currentTask.headColor} border-2 ${currentTask.headBorder} rounded-t-xl flex items-center justify-center shadow-[0_-10px_30px_rgba(0,0,0,0.3)] relative z-20`}
                        >
                            <span className="text-white font-bold text-sm drop-shadow-md">{currentTask.title} Head</span>
                            {/* Connection pins */}
                            <div className="absolute -bottom-2 left-1/4 w-2 h-4 bg-slate-400 rounded-sm"></div>
                            <div className="absolute -bottom-2 right-1/4 w-2 h-4 bg-slate-400 rounded-sm"></div>
                        </motion.div>

                        {/* Pre-trained Base */}
                        <div className="w-64 h-32 bg-slate-800 border-2 border-slate-600 rounded-b-xl flex flex-col items-center justify-center relative z-10 shadow-xl">
                            <Layers className="w-8 h-8 text-slate-500 mb-2" />
                            <span className="text-slate-300 font-bold">Pre-trained BERT</span>
                            <span className="text-xs text-slate-500 mt-1">12 Layers, 110M Params</span>
                            
                            {/* Animated data flow inside base */}
                            <div className="absolute inset-0 overflow-hidden rounded-b-xl opacity-20 pointer-events-none">
                                <div className="w-full h-full bg-[linear-gradient(0deg,transparent,rgba(255,255,255,0.2),transparent)] animate-[flow_2s_linear_infinite] bg-[length:100%_200%]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Output */}
                    <div className="mt-8 text-center z-10">
                        <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Output</div>
                        <motion.div 
                            key={`out-${currentTask.id}`}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className={`px-6 py-3 rounded-lg font-mono text-sm font-bold border ${currentTask.headBorder} bg-slate-900 text-white shadow-[0_0_15px_rgba(0,0,0,0.2)]`}
                        >
                            {currentTask.output}
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TabFineTuning;
