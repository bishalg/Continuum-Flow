
import { useState } from 'react';
import { PRICING } from '../../../data/pricing-models';

// Default Constants
const SCENE_LENGTH_SEC = 8;
const CHARS_PER_SEC = 18;
const TOKENS_PER_SCENE_IN = 8000;
const TOKENS_PER_SCENE_OUT = 1000;

export function useCostCalculator() {
    // --- State ---

    // 1. Team & Project Defaults
    const [teamSize, setTeamSize] = useState(5);
    const [projectDurationMin, setProjectDurationMin] = useState(60);
    const [showProjectCost, setShowProjectCost] = useState(false);

    // 2. Infrastructure State
    const [sourceProvider, setSourceProvider] = useState<'github' | 'gitlab'>('github');
    const [sourcePlan, setSourcePlan] = useState('team');

    const [hostingProvider, setHostingProvider] = useState<'vercel' | 'aws' | 'gcp'>('vercel');
    const [hostingPlan, setHostingPlan] = useState('pro');

    const [authProvider, setAuthProvider] = useState<string>('betterAuth');

    // 3. AI State
    const [llmModel, setLlmModel] = useState<string>('claude40');
    const [imageModel, setImageModel] = useState<string>('fluxPro');
    const [imageCount, setImageCount] = useState<number>(3);
    const [videoModel, setVideoModel] = useState<string>('luma2');
    const [audioModel, setAudioModel] = useState<string>('elevenlabs');
    const [syncModel, setSyncModel] = useState<string>('synclabs');


    // --- Logic & Math ---

    // Helper to safely get plan details with type assertions
    const getSourcePlan = () => {
        const plans = PRICING.infra.source[sourceProvider].plans as Record<string, { price: number, perSeat: boolean }>;
        return plans[sourcePlan] || { price: 0, perSeat: false };
    };

    const getHostingPlan = () => {
        const plans = PRICING.infra.hosting[hostingProvider].plans as Record<string, { price: number, perSeat: boolean }>;
        return plans[hostingPlan] || { price: 0, perSeat: false };
    };

    // Calculate Infra Cost
    const sourceCost = getSourcePlan().perSeat ? getSourcePlan().price * teamSize : getSourcePlan().price;
    const hostingCost = getHostingPlan().perSeat ? getHostingPlan().price * teamSize : getHostingPlan().price;
    const authCost = PRICING.infra.auth[authProvider as keyof typeof PRICING.infra.auth]?.price || 0;

    const monthlyInfraCost = sourceCost + hostingCost + authCost;

    // Calculate AI Unit Cost
    const selectedLLM = PRICING.ai.llm[llmModel as keyof typeof PRICING.ai.llm];
    const llmCost = ((TOKENS_PER_SCENE_IN / 1_000_000 * selectedLLM.input) + (TOKENS_PER_SCENE_OUT / 1_000_000 * selectedLLM.output));

    const selectedImage = PRICING.ai.image[imageModel as keyof typeof PRICING.ai.image];
    const imageCostTotal = selectedImage.price * imageCount;

    const selectedVideo = PRICING.ai.video[videoModel as keyof typeof PRICING.ai.video];
    let videoCost = 0;
    if (videoModel === 'runway') videoCost = selectedVideo.price;
    else videoCost = (selectedVideo.price / 5) * SCENE_LENGTH_SEC;

    const selectedAudio = PRICING.ai.audio[audioModel as keyof typeof PRICING.ai.audio];
    const audioCost = ((SCENE_LENGTH_SEC * CHARS_PER_SEC) / 1000) * selectedAudio.pricePer1k;

    const selectedSync = PRICING.ai.sync[syncModel as keyof typeof PRICING.ai.sync];
    const syncCost = (SCENE_LENGTH_SEC / 60) * selectedSync.pricePerMin;

    const unitCost8s = llmCost + imageCostTotal + videoCost + audioCost + syncCost;

    // Project Totals
    const numScenes = Math.ceil((projectDurationMin * 60) / SCENE_LENGTH_SEC);
    const projectAICost = unitCost8s * numScenes;
    const storageGB = numScenes * 0.05;
    const storageCost = storageGB * PRICING.infra.s3.pricePerGB;

    return {
        state: {
            teamSize,
            projectDurationMin,
            showProjectCost,
            sourceProvider,
            sourcePlan,
            hostingProvider,
            hostingPlan,
            authProvider,
            llmModel,
            imageModel,
            imageCount,
            videoModel,
            audioModel,
            syncModel,
            numScenes,
            storageGB
        },
        setters: {
            setTeamSize,
            setProjectDurationMin,
            setShowProjectCost,
            setSourceProvider,
            setSourcePlan,
            setHostingProvider,
            setHostingPlan,
            setAuthProvider,
            setLlmModel,
            setImageModel,
            setImageCount,
            setVideoModel,
            setAudioModel,
            setSyncModel
        },
        costs: {
            monthlyInfraCost,
            unitCost8s,
            projectAICost,
            llmCost,
            imageCostTotal,
            videoCost,
            audioCost,
            syncCost,
            storageCost
        },
        helpers: {
            getSourcePlan,
            getHostingPlan,
            selectedLLM,
            selectedImage,
            selectedVideo,
            selectedAudio
        }
    };
}
