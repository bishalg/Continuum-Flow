
import React from 'react';
import { PRICING } from '../../../data/pricing-models';

// UI Helpers
const ExternalLink = ({ href }: { href: string }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="ml-2 text-purple-400 hover:text-purple-300 opacity-50 hover:opacity-100 transition-all flex h-full items-center">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
    </a>
);

const SectionTitle = ({ title, icon, color = "cyan" }: any) => (
    <div className={`flex items-center gap-3 mb-6 mt-8 pb-3 border-b border-white/10 text-${color}-400`}>
        <div className="flex-none flex items-center justify-center w-6 h-6">{icon}</div>
        {/* Removed manual pt-0.5 */}
        <h3 className="text-xl font-bold text-white tracking-wide">{title}</h3>
    </div>
);

// Reusable Select Wrapper with Custom Chevron (Purple Variant)
const CustomSelect = ({ value, onChange, options, suffix = "" }: any) => (
    <div className="relative w-full group">
        <select
            value={value}
            onChange={onChange}
            className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-3 pr-10 text-slate-200 focus:border-purple-500 outline-none appearance-none transition-colors hover:bg-black/60"
        >
            {options.map(([key, val]: any) => (
                <option key={key} value={key}>
                    {val.label} {suffix && `(${suffix.replace('{price}', val.price).replace('{unit}', val.unit).replace('{output}', val.output).replace('{pricePer1k}', val.pricePer1k)})`}
                </option>
            ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500 group-hover:text-purple-400 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
    </div>
);

export function AiProductionSection({ state, setters, helpers }: any) {
    const { llmModel, imageModel, imageCount, videoModel, audioModel } = state;
    const { setLlmModel, setImageModel, setImageCount, setVideoModel, setAudioModel } = setters;
    const { selectedLLM, selectedImage, selectedVideo, selectedAudio } = helpers;

    return (
        <div>
            <SectionTitle title="Production AI Pipeline" color="purple"
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>}
            />

            <div className="flex flex-col gap-6">

                {/* 1. LLM */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs uppercase tracking-wider font-bold text-slate-500">
                        <span>Screenplay Logic (LLM)</span>
                        <ExternalLink href={PRICING.ai.llm[llmModel as keyof typeof PRICING.ai.llm].link} />
                    </div>
                    <CustomSelect
                        value={llmModel}
                        onChange={(e: any) => setLlmModel(e.target.value)}
                        options={Object.entries(PRICING.ai.llm)}
                        suffix="${output}/M tok"
                    />
                </div>

                {/* 2. Image Gen */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs uppercase tracking-wider font-bold text-slate-500">
                        <span>Visuals (Image Gen)</span>
                        <ExternalLink href={PRICING.ai.image[imageModel as keyof typeof PRICING.ai.image].link} />
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <CustomSelect
                                value={imageModel}
                                onChange={(e: any) => setImageModel(e.target.value)}
                                options={Object.entries(PRICING.ai.image)}
                                // Dynamic suffix logic handled inline in map previously, simplified here, 
                                // but generic suffix won't handle the 'mo' vs 'img' conditional perfectly without more logic.
                                // For consistnecy let's pass a generic string and accept minor label diff or duplicate logic.
                                suffix="${price}/img"
                            />
                        </div>

                        <div className="relative w-24">
                            <select
                                value={imageCount} onChange={(e) => setImageCount(parseInt(e.target.value))}
                                className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-3 pr-2 text-center text-slate-200 outline-none focus:border-purple-500 appearance-none hover:bg-black/60 transition-colors"
                            >
                                <option value={1}>1x</option>
                                <option value={3}>3x</option>
                                <option value={5}>5x</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500 text-[10px] uppercase font-bold">
                                Batch
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Video */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs uppercase tracking-wider font-bold text-slate-500">
                        <span>Video Render</span>
                        <ExternalLink href={PRICING.ai.video[videoModel as keyof typeof PRICING.ai.video].link} />
                    </div>
                    <CustomSelect
                        value={videoModel}
                        onChange={(e: any) => setVideoModel(e.target.value)}
                        options={Object.entries(PRICING.ai.video)}
                        suffix="${price} / {unit}"
                    />
                </div>

                {/* 4. Audio */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs uppercase tracking-wider font-bold text-slate-500">
                        <span>Voice (TTS)</span>
                        <ExternalLink href={PRICING.ai.audio[audioModel as keyof typeof PRICING.ai.audio].link} />
                    </div>
                    <CustomSelect
                        value={audioModel}
                        onChange={(e: any) => setAudioModel(e.target.value)}
                        options={Object.entries(PRICING.ai.audio)}
                        suffix="${pricePer1k}/1k char"
                    />
                </div>
            </div>
        </div>
    );
}
