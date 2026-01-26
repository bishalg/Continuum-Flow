
export const PRICING = {
    infra: {
        source: {
            github: {
                label: 'GitHub',
                plans: {
                    free: { label: 'Free', price: 0, perSeat: false },
                    team: { label: 'Team', price: 4, perSeat: true },
                    enterprise: { label: 'Enterprise', price: 21, perSeat: true }
                },
                link: 'https://github.com/pricing'
            },
            gitlab: {
                label: 'GitLab',
                plans: {
                    free: { label: 'Free', price: 0, perSeat: false },
                    premium: { label: 'Premium', price: 29, perSeat: true }
                },
                link: 'https://about.gitlab.com/pricing/'
            }
        },
        hosting: {
            vercel: {
                label: 'Vercel',
                type: 'paas',
                plans: {
                    hobby: { label: 'Hobby', price: 0, perSeat: false },
                    pro: { label: 'Pro', price: 20, perSeat: true },
                    enterprise: { label: 'Enterprise', price: 100, perSeat: true } // Placeholder
                },
                link: 'https://vercel.com/pricing'
            },
            aws: {
                label: 'AWS',
                type: 'iaas',
                plans: {
                    t3micro: { label: 'EC2 t3.micro (Dev)', price: 10.50, perSeat: false },
                    t3medium: { label: 'EC2 t3.medium (Prod)', price: 38.00, perSeat: false },
                    cluster: { label: 'ECS Cluster (Small)', price: 85.00, perSeat: false }
                },
                link: 'https://aws.amazon.com/ec2/pricing/'
            },
            gcp: {
                label: 'GCP',
                type: 'iaas',
                plans: {
                    e2micro: { label: 'e2-micro (Free Tier)', price: 0, perSeat: false },
                    e2medium: { label: 'e2-medium', price: 25.00, perSeat: false },
                    autopilot: { label: 'GKE Autopilot', price: 74.00, perSeat: false }
                },
                link: 'https://cloud.google.com/compute/all-pricing'
            }
        },
        auth: {
            betterAuth: { label: 'Better Auth (Self-Hosted)', price: 0, link: 'https://www.better-auth.com/' },
            clerk: { label: 'Clerk (Growth)', price: 25, link: 'https://clerk.com/pricing' },
            workos: { label: 'WorkOS', price: 0, link: 'https://workos.com/pricing' },
            supabase: { label: 'Supabase Auth', price: 25, link: 'https://supabase.com/pricing' }
        },
        s3: { label: 'Cloudflare R2', pricePerGB: 0.015, link: 'https://www.cloudflare.com/developer-platform/r2/' }
    },
    ai: {
        llm: {
            claude40: { label: 'Claude 4.0 Sonnet', input: 3.50, output: 16.00, link: 'https://www.anthropic.com/pricing' },
            gpt5: { label: 'GPT-5 (Preview)', input: 4.50, output: 14.00, link: 'https://openai.com/api/pricing/' },
            gemini3pro: { label: 'Gemini 3 Pro', input: 1.50, output: 6.00, link: 'https://ai.google.dev/pricing' },
        },
        image: {
            fluxPro: { label: 'Flux 2 [Pro]', price: 0.05, link: 'https://replicate.com/' },
            dalle4: { label: 'DALL-E 4', price: 0.08, link: 'https://openai.com/api/pricing/' },
            midjourney6: { label: 'Midjourney v7', price: 0.12, link: '#' },
        },
        video: {
            luma2: { label: 'Luma Dream Machine v2', price: 0.45, unit: 'per 5s', link: 'https://lumalabs.ai/' },
            runway4: { label: 'Runway Gen-4', price: 1.40, unit: 'per 8s', link: 'https://runwayml.com/' },
        },
        audio: {
            elevenlabs: { label: 'ElevenLabs v3', pricePer1k: 0.18, link: 'https://elevenlabs.io/pricing' },
            openai: { label: 'OpenAI TTS HD', pricePer1k: 0.02, link: 'https://openai.com/api/pricing/' },
        },
        sync: {
            synclabs: { label: 'SyncLabs 2.0', pricePerMin: 2.50, link: 'https://synclabs.so/pricing' },
            wav2lip: { label: 'Wav2Lip+ (Self-Hosted)', pricePerMin: 0.08, link: 'https://replicate.com/' },
        }
    }
};
