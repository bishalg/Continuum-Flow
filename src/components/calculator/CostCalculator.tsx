
import React from 'react';
import { useCostCalculator } from './hooks/useCostCalculator';
import { InfraSection } from './ui/InfraSection';
import { AiProductionSection } from './ui/AiProductionSection';
import { CostSummary } from './ui/CostSummary';

export default function CostCalculator() {
    const { state, setters, costs, helpers } = useCostCalculator();

    return (
        <div className="flex flex-col xl:flex-row gap-8 text-sm text-slate-300 font-sans">

            {/* --- LEFT PANEL: CONFIGURATION --- */}
            <div className="flex-1 bg-slate-900/50 p-4 sm:p-6 md:p-8 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-sm">

                {/* GLOBAL TEAM SETTINGS */}
                <div className="mb-8 p-4 bg-cyan-950/20 rounded-xl border border-cyan-500/10">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Development Team Size</label>
                        </div>
                        <span className="text-white font-mono font-bold text-lg">{state.teamSize}</span>
                    </div>
                    <input
                        type="range" min="1" max="50" value={state.teamSize}
                        onChange={(e) => setters.setTeamSize(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                    <p className="text-[10px] text-cyan-600 mt-2 text-right">Updates per-seat infrastructure costs automatically</p>
                </div>

                {/* MODULAR SECTIONS */}
                <InfraSection state={state} setters={setters} helpers={helpers} />
                <AiProductionSection state={state} setters={setters} helpers={helpers} />

            </div>

            {/* --- RIGHT PANEL: SUMMARY --- */}
            <CostSummary state={state} setters={setters} costs={costs} />

        </div>
    );
}
