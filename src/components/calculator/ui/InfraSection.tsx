
import React from 'react';
import { PRICING } from '../../../data/pricing-models';
import { AnimatedCurrency } from './AnimatedCurrency';

// UI Helpers
const ExternalLink = ({ href }: { href: string }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="ml-2 text-cyan-600 hover:text-cyan-400 opacity-50 hover:opacity-100 transition-all flex h-full items-center">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
    </a>
);

const SectionTitle = ({ title, icon, color = "cyan" }: any) => (
    <div className={`flex items-center gap-3 mb-6 mt-8 pb-3 border-b border-white/10 text-${color}-400`}>
        <div className="flex-none flex items-center justify-center w-6 h-6">{icon}</div>
        {/* Removed manual pt-0.5 to rely on pure flex centering */}
        <h3 className="text-xl font-bold text-white tracking-wide">{title}</h3>
    </div>
);

const ProviderSelector = ({ options, selected, onChange }: any) => (
    <div className="flex gap-2 mb-3 bg-black/40 p-1 rounded-lg w-full">
        {options.map((opt: any) => (
            <button
                key={opt.value}
                onClick={() => onChange(opt.value)}
                className={`flex-1 py-1.5 px-2 text-[10px] sm:text-xs font-bold uppercase rounded-md transition-all ${selected === opt.value
                    ? 'bg-slate-700 text-white shadow-sm border border-slate-500'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                    }`}
            >
                {opt.label}
            </button>
        ))}
    </div>
);

// Reusable Select Wrapper with Custom Chevron
const CustomSelect = ({ value, onChange, options, suffix = "" }: any) => (
    <div className="relative w-full group">
        <select
            value={value}
            onChange={onChange}
            className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-3 pr-10 text-slate-200 focus:border-cyan-500 outline-none appearance-none transition-colors hover:bg-black/60"
        >
            {options.map(([key, val]: any) => (
                <option key={key} value={key}>
                    {val.label} {suffix && `(${suffix.replace('{price}', val.price).replace('{per}', val.perSeat ? 'user' : 'mo')})`}
                </option>
            ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500 group-hover:text-cyan-400 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
    </div>
);


export function InfraSection({ state, setters, helpers }: any) {
    const { teamSize, sourceProvider, sourcePlan, hostingProvider, hostingPlan, authProvider } = state;
    const { setSourceProvider, setSourcePlan, setHostingProvider, setHostingPlan, setAuthProvider } = setters;
    const { getSourcePlan, getHostingPlan } = helpers;

    return (
        <div>
            <SectionTitle title="Monthly Fixed Stack"
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
            />

            <div className="flex flex-col gap-8">

                {/* 1. Hosting Provider */}
                <div className="relative border-l-2 border-slate-700 pl-4">
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-bold text-white">Compute & Hosting</label>
                        <div className="flex items-center">
                            <ExternalLink href={PRICING.infra.hosting[hostingProvider as keyof typeof PRICING.infra.hosting].link} />
                        </div>
                    </div>

                    <ProviderSelector
                        options={[
                            { value: 'vercel', label: 'Vercel (PaaS)' },
                            { value: 'aws', label: 'AWS (IaaS)' },
                            { value: 'gcp', label: 'GCP' }
                        ]}
                        selected={hostingProvider}
                        onChange={(val: any) => {
                            setHostingProvider(val);
                            // Default to mid-tier (index 1) instead of free tier (index 0)
                            const plans = Object.keys(PRICING.infra.hosting[val as keyof typeof PRICING.infra.hosting].plans);
                            setHostingPlan(plans[1] || plans[0]);
                        }}
                    />

                    <CustomSelect
                        value={hostingPlan}
                        onChange={(e: any) => setHostingPlan(e.target.value)}
                        options={Object.entries(PRICING.infra.hosting[hostingProvider as keyof typeof PRICING.infra.hosting].plans)}
                        suffix="${price}/{per}"
                    />

                    <div className="flex justify-end mt-2 text-xs items-center gap-1">
                        <span className="text-slate-500 mr-1">Est. Cost:</span>
                        <span className="text-cyan-400 font-mono flex items-center">
                            <AnimatedCurrency value={getHostingPlan().price * (getHostingPlan().perSeat ? teamSize : 1)} />
                            <span className="text-slate-500 ml-1">/mo</span>
                        </span>
                    </div>
                </div>

                {/* 2. Source Control */}
                <div className="relative border-l-2 border-slate-700 pl-4">
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-bold text-white">Source Control</label>
                        <div className="flex items-center">
                            <ExternalLink href={PRICING.infra.source[sourceProvider as keyof typeof PRICING.infra.source].link} />
                        </div>
                    </div>

                    <ProviderSelector
                        options={[{ value: 'github', label: 'GitHub' }, { value: 'gitlab', label: 'GitLab' }]}
                        selected={sourceProvider}
                        onChange={(val: any) => {
                            setSourceProvider(val);
                            // Default to mid-tier (index 1) which is usually the paid team plan
                            const plans = Object.keys(PRICING.infra.source[val as keyof typeof PRICING.infra.source].plans);
                            setSourcePlan(plans[1] || plans[0]);
                        }}
                    />

                    <CustomSelect
                        value={sourcePlan}
                        onChange={(e: any) => setSourcePlan(e.target.value)}
                        options={Object.entries(PRICING.infra.source[sourceProvider as keyof typeof PRICING.infra.source].plans)}
                        suffix="${price}/{per}"
                    />

                    <div className="flex justify-end mt-2 text-xs items-center gap-1">
                        <span className="text-slate-500 mr-1">Est. Cost:</span>
                        <span className="text-cyan-400 font-mono flex items-center">
                            <AnimatedCurrency value={getSourcePlan().price * (getSourcePlan().perSeat ? teamSize : 1)} />
                            <span className="text-slate-500 ml-1">/mo</span>
                        </span>
                    </div>
                </div>

                {/* 3. Auth */}
                <div className="relative border-l-2 border-slate-700 pl-4">
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-bold text-white">Authentication</label>
                        <div className="flex items-center">
                            <ExternalLink href={PRICING.infra.auth[authProvider as keyof typeof PRICING.infra.auth]?.link || '#'} />
                        </div>
                    </div>

                    <CustomSelect
                        value={authProvider}
                        onChange={(e: any) => setAuthProvider(e.target.value)}
                        options={Object.entries(PRICING.infra.auth)}
                        suffix="${price}/mo"
                    />

                    <div className="flex justify-end mt-2 text-xs items-center gap-1">
                        <span className="text-cyan-400 font-mono flex items-center">
                            <AnimatedCurrency value={PRICING.infra.auth[authProvider as keyof typeof PRICING.infra.auth]?.price || 0} />
                            <span className="text-slate-500 ml-1">/mo</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
