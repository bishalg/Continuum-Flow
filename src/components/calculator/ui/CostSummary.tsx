
import React from 'react';
import { AnimatedCurrency } from './AnimatedCurrency';

export function CostSummary({ state, setters, costs }: any) {
    const { showProjectCost, projectDurationMin, numScenes } = state;
    const { setShowProjectCost, setProjectDurationMin } = setters;
    const { monthlyInfraCost, unitCost8s, projectAICost, llmCost, imageCostTotal, videoCost, audioCost, syncCost } = costs;

    return (
        <div className="w-full xl:w-96 shrink-0">
            <div className="sticky top-8 space-y-6">

                {/* TOTAL COST CARD */}
                <div className="bg-gradient-to-br from-cyan-950 to-slate-900 border border-cyan-500/30 p-8 rounded-3xl shadow-[0_0_40px_rgba(8,145,178,0.15)] text-center relative overflow-hidden group">
                    <h2 className="text-4xl font-black text-white mb-2 relative z-10 tracking-tight flex items-center justify-center">
                        <AnimatedCurrency value={showProjectCost ? projectAICost : unitCost8s} />
                    </h2>
                    <div className="text-cyan-400 font-bold uppercase tracking-widest text-xs relative z-10">
                        {showProjectCost ? 'Total AI Production Cost' : 'Cost Per 8s Scene'}
                    </div>

                    {/* Unit Badge (Bottom Right) */}
                    <div className="absolute bottom-2 right-3 text-[10px] font-mono text-cyan-500/50 uppercase tracking-widest">
                        {showProjectCost ? '/ project' : '/ 8s unit'}
                    </div>
                </div>

                {/* TOGGLE: UNIT vs PROJECT */}
                <div className="flex bg-black/40 p-1.5 rounded-xl border border-white/10">
                    <button
                        onClick={() => setShowProjectCost(false)}
                        className={`flex-1 py-3 text-xs font-bold uppercase rounded-lg transition-all ${!showProjectCost ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Unit (8s)
                    </button>
                    <button
                        onClick={() => setShowProjectCost(true)}
                        className={`flex-1 py-3 text-xs font-bold uppercase rounded-lg transition-all ${showProjectCost ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Full Movie
                    </button>
                </div>

                {/* PROJECT SLIDER (CONDITIONAL) */}
                {showProjectCost && (
                    <div className="bg-white/5 rounded-xl p-5 border border-white/5 animate-in fade-in">
                        <div className="flex justify-between mb-3 text-xs font-bold uppercase">
                            <span className="text-slate-400">Duration</span>
                            <span className="text-white">{projectDurationMin} mins</span>
                        </div>
                        <input
                            type="range" min="1" max="120" value={projectDurationMin}
                            onChange={(e) => setProjectDurationMin(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 mb-2"
                        />
                        <div className="text-center text-[10px] text-slate-500 mt-2">{numScenes} Scenes Generated</div>
                    </div>
                )}

                {/* BREAKDOWN TABLE */}
                <div className="bg-slate-900/80 p-6 rounded-3xl border border-white/10 space-y-5 shadow-xl">
                    {/* Infra Total */}
                    <div className="flex justify-between items-center text-xs pb-4 border-b border-white/5">
                        <span className="text-slate-400 font-bold uppercase">Monthly Infra</span>
                        <span className="font-mono text-cyan-300 text-sm font-bold flex items-center">
                            <AnimatedCurrency value={monthlyInfraCost} />
                            <span className="ml-1 text-slate-500">/mo</span>
                        </span>
                    </div>

                    {/* AI Breakdown */}
                    <div className="space-y-3 text-xs text-slate-300">
                        <div className="flex justify-between">
                            <span className="text-slate-400">LLM Logic</span>
                            <span className="font-mono flex"><AnimatedCurrency value={showProjectCost ? llmCost * numScenes : llmCost} prefix="$" /></span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Imagery</span>
                            <span className="font-mono flex"><AnimatedCurrency value={showProjectCost ? imageCostTotal * numScenes : imageCostTotal} prefix="$" /></span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Video</span>
                            <span className="font-mono flex"><AnimatedCurrency value={showProjectCost ? videoCost * numScenes : videoCost} prefix="$" /></span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Voice</span>
                            <span className="font-mono flex"><AnimatedCurrency value={showProjectCost ? audioCost * numScenes : audioCost} prefix="$" /></span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Sync</span>
                            <span className="font-mono flex"><AnimatedCurrency value={showProjectCost ? syncCost * numScenes : syncCost} prefix="$" /></span>
                        </div>
                    </div>
                </div>

                <div className="text-[10px] text-slate-600 text-center px-4">
                    Prices are estimates based on Early 2026 data. Actual costs may vary by usage and provider.
                </div>
            </div>
        </div>
    );
}
