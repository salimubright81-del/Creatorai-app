import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || '';

// Shared Gemini client configured according to guidelines
export const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export const HAS_API_KEY = Boolean(apiKey && apiKey.length > 5);

export interface GenerateOptions {
  type: string;
  topic: string;
  platform?: string;
  style?: string;
  tone?: string;
  targetAudience?: string;
  businessName?: string;
  product?: string;
  price?: string;
  targetCustomers?: string;
  niche?: string;
  framework?: string; // AIDA, PAS, Story, Hook
  language?: string;
  countryOrRegion?: string;
  callToAction?: string;
  extraDetails?: string;
}

export async function generateContentWithGemini(options: GenerateOptions) {
  if (!HAS_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please verify environment settings.');
  }

  const {
    type,
    topic,
    platform = 'all',
    style = 'engaging',
    tone = 'enthusiastic and professional',
    targetAudience = 'general audience and buyers',
    businessName,
    product,
    price,
    targetCustomers,
    niche,
    framework = 'AIDA',
    countryOrRegion = 'global',
    callToAction = '',
    extraDetails = ''
  } = options;

  let systemInstruction = `You are CreatorAI, a world-class AI content strategist and viral copywriter trusted by top digital creators, entrepreneurs, and fast-growing small businesses across Africa, the US, UK, and worldwide. 
Your goal is to write captivating, high-converting, natural-sounding content that drives views, shares, comments, clicks, and sales.
Format responses cleanly using Markdown, with bold headings, clear bullet points, and appropriate emojis. 
Never produce bland, robotic AI copy. Use human rhythm, conversational phrasing, powerful hooks, and clear calls to action.`;

  let prompt = '';

  switch (type) {
    case 'tiktok_script':
    case 'video_script': {
      prompt = `Write a viral short-form video script (TikTok / Instagram Reels / YouTube Shorts).
Topic / Idea: "${topic}"
Video Style: ${style} (e.g. Emotional storytelling, Educational, Motivational, Funny, Business advertisement, Faceless video, or Anime storytelling).
Platform: ${platform || 'TikTok'}
Tone: ${tone}
Target Audience: ${targetAudience}
${countryOrRegion && countryOrRegion !== 'global' ? `Regional Context: Tailor cultural relevance or local business vibe for ${countryOrRegion}.` : ''}

Provide a structured, ready-to-record production script with:
1. 💥 3 DIFFERENT VIRAL HOOK OPTIONS (0 to 3 seconds) - Choose from Curiosity Gap, Contrarian Statement, or Problem-Agitate.
2. 🎬 SCENE-BY-SCENE BREAKDOWN (Timing, Visual Action / B-roll instructions, On-screen Text overlays, and Spoken Audio).
3. 🧠 PSYCHOLOGICAL RETENTION TRIGGER (Mid-video reset to stop swiping).
4. 🎯 COMPELLING CALL TO ACTION (CTA) tailored to boost comments, saves, or bio link clicks.
5. 🎵 RECOMMENDED BACKGROUND SOUND / MUSIC MOOD.
6. 🏷️ 8-12 OPTIMAL VIRAL HASHTAGS.`;
      break;
    }

    case 'caption': {
      prompt = `Create 3 distinct, high-engagement social media captions for ${platform || 'Instagram'}.
Topic / Post Concept: "${topic}"
Tone: ${tone}
Target Audience: ${targetAudience}
${callToAction ? `Specific CTA: ${callToAction}` : ''}
${extraDetails ? `Additional Context: ${extraDetails}` : ''}

For each caption variation provide:
- Option 1: Story-driven & Relatable (personal hook, relatable pain point, takeaway)
- Option 2: Punchy & High-Energy (short, bold, aesthetic, direct)
- Option 3: Value-packed & Educational (bulleted tips or breakdown, save-worthy)

Include:
- Eye-catching first line before the "more" cut.
- Clean spacing, aesthetic emojis.
- Strong closing question or call-to-action.
- A curated block of 20 relevant hashtags grouped into Broad, Niche, and High-Intent tags.`;
      break;
    }

    case 'business_ad': {
      prompt = `Write high-converting business advertisement copy tailored for ${platform || 'Facebook & Instagram'}.
Business Name: "${businessName || 'My Business'}"
Product / Service: "${product || topic}"
Price / Special Offer: "${price || 'Competitive price / Special offer'}"
Target Customers: "${targetCustomers || targetAudience || 'Potential buyers'}"
Marketing Framework: ${framework} (e.g. AIDA: Attention, Interest, Desire, Action OR PAS: Problem, Agitate, Solution)
Tone: ${tone}
${countryOrRegion ? `Market Context: ${countryOrRegion} (Support local customer trust triggers, e.g., Pay on Delivery, WhatsApp ordering, fast delivery, warranties if relevant)` : ''}

Deliver:
1. 3 High-CTR Ad Headlines (Short, benefit-driven).
2. Primary Ad Body Copy using the ${framework} framework:
   - The Hook (stopping the scroll)
   - The Relatable Frustration / Problem
   - The Solution & Key Benefits (emotional + practical)
   - The Irresistible Offer & Price Highlight
   - Risk Reversal (Guarantee, Reviews, or Delivery reassurance)
   - Clear Next Step (WhatsApp link / Website / DM to order)
3. Direct WhatsApp / Messenger Quick-Reply script for closing customers who reach out.`;
      break;
    }

    case 'social_post': {
      prompt = `Generate a high-impact social media post for ${platform || 'Social Media'}.
Topic: "${topic}"
Tone: ${tone}
Goal: Spark conversations, shares, and engagement.
Target Audience: ${targetAudience}

Include:
- Scroll-stopping opening line.
- Engaging body with clear formatting, line breaks, and emojis.
- Key takeaway or question to stimulate comments.
- 5-10 relevant hashtags.`;
      break;
    }

    case 'youtube_script': {
      prompt = `Create a complete YouTube video outline and script outline.
Video Title / Topic: "${topic}"
Duration Goal: 5-8 minutes
Style: ${style || 'Educational & Engaging'}
Target Audience: ${targetAudience}

Structure:
1. 🎣 THE FIRST 30 SECONDS: Killer Hook + Teaser + What they will discover + Quick Channel Intro.
2. 📌 CHAPTER BREAKDOWN (Timestamps, Core Talking Points, On-screen Visuals & B-roll ideas).
3. 🔁 MID-VIDEO ENGAGEMENT LOOP (Asking for likes, subscription at the peak value moment).
4. 🏁 OUTRO & END SCREEN RECOMMENDATION (Next video to watch + CTA).
5. 📝 BONUS: High-CTR YouTube Video Title ideas (5 options) & Search-Optimized Description with timestamps.`;
      break;
    }

    case 'motivational_quote': {
      prompt = `Create a set of 5 inspiring, viral motivational quotes and micro-stories on the theme of "${topic}".
Tone: ${tone || 'Inspiring, resilient, uplifting'}
Style: Suitable for aesthetic Instagram carousel cards, TikTok quote slides, or Twitter/X threads.

For each quote:
- The Core Punchy Quote (1-2 sentences that hit deep).
- A 2-sentence micro-reflection explaining the deeper truth.
- Recommended visual aesthetic / photo background idea.`;
      break;
    }

    case 'storytelling': {
      prompt = `Write an emotionally resonant storytelling piece based on "${topic}".
Style: ${style || 'Personal narrative with transformative lesson'}
Target Audience: ${targetAudience}

Structure:
- The Inciting Incident / Struggle (vulnerable, relatable opening).
- The Turning Point (the insight or shift that changed everything).
- The Climax & Breakthrough (the triumph or wisdom gained).
- The Universal Lesson for the reader.
- Engagement question at the end to invite readers to share their own stories.`;
      break;
    }

    case 'product_description': {
      prompt = `Write an irresistible, e-commerce product description for:
Product Name: "${businessName ? `${businessName} - ` : ''}${product || topic}"
Key Features & Details: "${extraDetails || topic}"
Price Point: "${price || 'Affordable luxury'}"
Target Customer: "${targetCustomers || targetAudience}"
Tone: ${tone || 'Persuasive, sensory, benefit-focused'}

Include:
1. Catchy Tagline / One-liner.
2. Sensory & Benefit-Driven Overview (focusing on how the buyer feels using it).
3. Bulleted Key Features translated into customer benefits.
4. "Why You'll Love It" highlight box.
5. Frequently Asked Questions (FAQ) with 2 quick answers (e.g. shipping, sizing, durability).
6. Urgent Call to Action.`;
      break;
    }

    case 'video_hook': {
      prompt = `Generate 10 viral video hooks for the topic: "${topic}".
Platform: ${platform || 'TikTok / Reels'}
Niche: ${niche || 'Content Creation & Business'}

Categorize into:
- 2 Curiosity Gap Hooks ("The real reason nobody talks about...")
- 2 Negative / Warning Hooks ("Stop doing this if you want...")
- 2 Contrarian / Hot Take Hooks ("Why everyone is completely wrong about...")
- 2 Story Hooks ("In 2024 I had $0, now...")
- 2 Fast-Result / Secret Hack Hooks ("This 30-second trick...")

Each hook must be punchy, under 15 words, and designed to maximize 3-second viewer retention.`;
      break;
    }

    case 'content_ideas': {
      prompt = `Generate a 7-day viral content calendar with 10 high-performing content ideas for the niche: "${niche || topic}".
Target Audience: ${targetAudience}
Tone: ${tone}

For each content idea, provide:
1. Catchy Content Title & Format (e.g., POV video, Step-by-step carousel, Storytime, Controversial debate, Quick tutorial).
2. The Hook / Opening Line.
3. The Core Value / Angle (Why viewers will save or share it).
4. Best Platform for this format (TikTok, Instagram, LinkedIn, YouTube).`;
      break;
    }

    default: {
      prompt = `Generate creative, high-performing content for:
Topic: "${topic}"
Type: ${type}
Tone: ${tone}
Platform: ${platform}
${extraDetails ? `Extra instructions: ${extraDetails}` : ''}

Deliver formatted, engaging, ready-to-publish content with strong hooks and calls to action.`;
    }
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.85,
    },
  });

  const rawText = response.text || '';

  // Extract metadata if applicable
  const wordCount = rawText.trim().split(/\s+/).filter(Boolean).length;
  
  // Try to extract hooks and hashtags for quick cards
  const hookMatch = rawText.match(/HOOK.*?:?\s*["“]?([^"”\n\r]+)["”]?/i);
  const hook = hookMatch ? hookMatch[1].trim() : undefined;

  const hashtagMatches = rawText.match(/#[a-zA-Z0-9_]+/g) || [];
  const uniqueHashtags = Array.from(new Set(hashtagMatches)).slice(0, 15);

  let title = `${type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}: ${topic.slice(0, 40)}`;
  if (topic.length > 40) title += '...';

  return {
    rawText,
    title,
    structured: {
      hook,
      hashtags: uniqueHashtags,
      wordCount,
      estimatedDuration: type.includes('script') ? `${Math.ceil(wordCount / 2.5)} seconds` : undefined
    }
  };
}

export async function generatePosterGraphic(params: {
  prompt: string;
  businessName?: string;
  headline?: string;
  subheadline?: string;
  badge?: string;
  cta?: string;
  theme?: string;
  aspectRatio?: '1:1' | '9:16' | '16:9';
}) {
  const {
    prompt,
    businessName = 'CreatorAI Studio',
    headline = 'Special Offer',
    subheadline = 'Quality Products & Services You Can Trust',
    badge = 'LIMITED TIME OFFER',
    cta = 'Order Now / Send DM',
    theme = 'modern_dark',
    aspectRatio = '1:1'
  } = params;

  let generatedImageUrl: string | undefined = undefined;

  // Attempt real AI image generation using Gemini flash lite image model
  if (HAS_API_KEY) {
    try {
      const imgResponse = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [
            {
              text: `High quality commercial product advertising photography, promotional poster design for: ${prompt}. Professional studio lighting, sleek commercial composition, vibrant colors, advertising masterpiece, 8k resolution, suitable for ${businessName}.`
            }
          ]
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio === '9:16' ? '9:16' : aspectRatio === '16:9' ? '16:9' : '1:1',
          }
        }
      });

      if (imgResponse.candidates?.[0]?.content?.parts) {
        for (const part of imgResponse.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
            break;
          }
        }
      }
    } catch (err: any) {
      console.warn('AI image model fallback to graphic poster engine:', err?.message || err);
      // We will provide graphic poster layout data
    }
  }

  return {
    imageUrl: generatedImageUrl,
    posterData: {
      headline,
      subheadline,
      badge,
      cta,
      brandName: businessName,
      theme,
      aspectRatio,
      prompt
    }
  };
}
