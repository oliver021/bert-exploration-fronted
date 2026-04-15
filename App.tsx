import React, { useState } from 'react';
import { TabType } from './types';
import TabTraining from './components/TabTraining';
import TabFineTuning from './components/TabFineTuning';
import TabVectorization from './components/TabVectorization';
import TabSemanticSearch from './components/TabSemanticSearch';
import TabCodeSnippets from './components/TabCodeSnippets';
import { BrainCircuit, GitMerge, Binary, Search, Code } from 'lucide-react';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>(TabType.TRAINING);

    const tabs = [
        { id: TabType.TRAINING, label: '1. Pre-training', icon: <BrainCircuit className="w-4 h-4" /> },
        { id: TabType.FINE_TUNING, label: '2. Fine-tuning', icon: <GitMerge className="w-4 h-4" /> },
        { id: TabType.VECTORIZATION, label: '3. Vectorization', icon: <Binary className="w-4 h-4" /> },
        { id: TabType.SEMANTIC_SEARCH, label: '4. Semantic Search', icon: <Search className="w-4 h-4" /> },
        { id: TabType.CODE_SNIPPETS, label: '5. Implementation', icon: <Code className="w-4 h-4" /> },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case TabType.TRAINING: return <TabTraining />;
            case TabType.FINE_TUNING: return <TabFineTuning />;
            case TabType.VECTORIZATION: return <TabVectorization />;
            case TabType.SEMANTIC_SEARCH: return <TabSemanticSearch />;
            case TabType.CODE_SNIPPETS: return <TabCodeSnippets />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-bert-blue/30">
            {/* Header */}
            <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between shrink-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-bert-blue to-bert-purple rounded-lg flex items-center justify-center shadow-lg shadow-bert-blue/20">
                        <BrainCircuit className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-white tracking-tight">BERT <span className="text-slate-400 font-normal">Explorer</span></h1>
                </div>
                <div className="text-xs text-slate-500 hidden sm:block">Interactive Transformer Visualization</div>
            </header>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
                
                {/* Sidebar Navigation */}
                <nav className="w-full md:w-64 bg-slate-900/50 border-r border-slate-800 p-4 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible z-10">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap md:whitespace-normal text-left ${
                                activeTab === tab.id 
                                ? 'bg-bert-blue/10 text-bert-blue border border-bert-blue/20 shadow-inner' 
                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
                            }`}
                        >
                            <span className={`${activeTab === tab.id ? 'text-bert-blue' : 'text-slate-500'}`}>
                                {tab.icon}
                            </span>
                            <span className="font-medium text-sm">{tab.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Tab Content Container */}
                <main className="flex-1 relative overflow-hidden bg-slate-950">
                    {/* Subtle background glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-bert-blue/5 blur-[120px] rounded-full pointer-events-none"></div>
                    
                    <div className="h-full w-full relative z-10">
                        {renderTabContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;
