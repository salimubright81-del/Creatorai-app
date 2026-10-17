import React, { useState, useRef, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Sparkles, 
  Download, 
  Palette, 
  Layers, 
  Eye, 
  Wand2, 
  Share2, 
  Check, 
  Smartphone, 
  Square, 
  Monitor,
  Tag,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const POSTER_THEMES = [
  { id: 'neon_dark', label: 'Neon Dark & Glow', bg: 'from-slate-950 via-purple-950 to-indigo-950', textColor: '#ffffff', accentColor: '#38bdf8' },
  { id: 'streetwear_bold', label: 'Streetwear & Sneakers', bg: 'from-zinc-900 via-neutral-900 to-black', textColor: '#ffffff', accentColor: '#f97316' },
  { id: 'sunset_gradient', label: 'Sunset Vibrant', bg: 'from-rose-600 via-pink-600 to-amber-500', textColor: '#ffffff', accentColor: '#fef08a' },
  { id: 'luxury_gold', label: 'Luxury & Gold', bg: 'from-slate-900 via-stone-900 to-black', textColor: '#ffffff', accentColor: '#facc15' },
  { id: 'emerald_growth', label: 'Fresh Emerald', bg: 'from-emerald-900 via-teal-900 to-slate-950', textColor: '#ffffff', accentColor: '#34d399' },
  { id: 'clean_light', label: 'Modern Minimal Light', bg: 'from-slate-50 via-slate-100 to-indigo-50', textColor: '#0f172a', accentColor: '#4f46e5' },
];

export const PosterStudio: React.FC = () => {
  const { refreshUser } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [prompt, setPrompt] = useState('Create a professional promotional poster for a shoe business selling sneakers');
  const [businessName, setBusinessName] = useState('SoleVibe Sneakers');
  const [headline, setHeadline] = useState('UNLEASH YOUR STRIDE');
  const [subheadline, setSubheadline] = useState('Premium breathable street kicks designed for all-day comfort & style.');
  const [badge, setBadge] = useState('FLASH SALE • 40% OFF');
  const [cta, setCta] = useState('Shop Now • Pay On Delivery');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '9:16' | '16:9'>('1:1');
  const [selectedTheme, setSelectedTheme] = useState('streetwear_bold');
  const [aiImageUrl, setAiImageUrl] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Redraw canvas whenever poster settings or AI image change
  const renderPosterOnCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 1080;
    let height = 1080;
    if (aspectRatio === '9:16') {
      width = 1080;
      height = 1920;
    } else if (aspectRatio === '16:9') {
      width = 1920;
      height = 1080;
    }

    canvas.width = width;
    canvas.height = height;

    const theme = POSTER_THEMES.find(t => t.id === selectedTheme) || POSTER_THEMES[0];

    // Background drawing
    if (aiImageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        // Add semi-transparent gradient overlay for text readability
        const overlay = ctx.createLinearGradient(0, height * 0.4, 0, height);
        overlay.addColorStop(0, 'rgba(0,0,0,0.2)');
        overlay.addColorStop(1, 'rgba(0,0,0,0.85)');
        ctx.fillStyle = overlay;
        ctx.fillRect(0, 0, width, height);
        drawTypography(ctx, width, height, theme);
      };
      img.src = aiImageUrl;
    } else {
      // High-end procedural gradient background
      const grad = ctx.createLinearGradient(0, 0, width, height);
      if (selectedTheme === 'neon_dark') {
        grad.addColorStop(0, '#090d16');
        grad.addColorStop(0.5, '#1e1035');
        grad.addColorStop(1, '#0b0f19');
      } else if (selectedTheme === 'streetwear_bold') {
        grad.addColorStop(0, '#18181b');
        grad.addColorStop(0.5, '#09090b');
        grad.addColorStop(1, '#18181b');
      } else if (selectedTheme === 'sunset_gradient') {
        grad.addColorStop(0, '#e11d48');
        grad.addColorStop(0.5, '#db2777');
        grad.addColorStop(1, '#d97706');
      } else if (selectedTheme === 'luxury_gold') {
        grad.addColorStop(0, '#1c1917');
        grad.addColorStop(0.5, '#0c0a09');
        grad.addColorStop(1, '#292524');
      } else if (selectedTheme === 'emerald_growth') {
        grad.addColorStop(0, '#064e3b');
        grad.addColorStop(0.5, '#022c22');
        grad.addColorStop(1, '#065f46');
      } else {
        grad.addColorStop(0, '#f8fafc');
        grad.addColorStop(0.5, '#f1f5f9');
        grad.addColorStop(1, '#e2e8f0');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Aesthetic background geometry / glow circle
      const glow = ctx.createRadialGradient(width * 0.5, height * 0.45, 50, width * 0.5, height * 0.45, width * 0.6);
      glow.addColorStop(0, `${theme.accentColor}25`);
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      // Grid accents
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 2;
      for (let x = 60; x < width; x += 120) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      drawTypography(ctx, width, height, theme);
    }
  };

  const drawTypography = (ctx: CanvasRenderingContext2D, width: number, height: number, theme: typeof POSTER_THEMES[0]) => {
    ctx.textAlign = 'center';

    // 1. Brand Name at top
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = theme.textColor;
    ctx.letterSpacing = '6px';
    ctx.fillText((businessName || 'BRAND').toUpperCase(), width / 2, height * 0.12);

    // Decorative line under brand
    ctx.fillStyle = theme.accentColor;
    ctx.fillRect(width / 2 - 40, height * 0.14, 80, 4);

    // 2. Promotional Badge Capsule
    if (badge) {
      const badgeY = height * 0.22;
      ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
      const badgeText = badge.toUpperCase();
      const badgeWidth = ctx.measureText(badgeText).width + 60;
      
      ctx.fillStyle = theme.accentColor;
      ctx.beginPath();
      ctx.roundRect(width / 2 - badgeWidth / 2, badgeY - 32, badgeWidth, 54, 27);
      ctx.fill();

      ctx.fillStyle = selectedTheme === 'clean_light' ? '#ffffff' : '#0f172a';
      ctx.fillText(badgeText, width / 2, badgeY + 6);
    }

    // 3. Central Headline
    const headlineY = height * 0.45;
    ctx.font = '900 78px "Space Grotesk", sans-serif';
    ctx.fillStyle = theme.textColor;
    
    // Word wrap headline
    const words = headline.split(' ');
    let line = '';
    let currentY = headlineY;
    const lineHeight = 90;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > width * 0.85 && n > 0) {
        ctx.fillText(line.trim(), width / 2, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), width / 2, currentY);

    // 4. Subheadline
    const subY = currentY + 70;
    ctx.font = '400 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = selectedTheme === 'clean_light' ? '#475569' : '#cbd5e1';

    const subWords = subheadline.split(' ');
    let subLine = '';
    let currentSubY = subY;
    for (let n = 0; n < subWords.length; n++) {
      const testLine = subLine + subWords[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > width * 0.75 && n > 0) {
        ctx.fillText(subLine.trim(), width / 2, currentSubY);
        subLine = subWords[n] + ' ';
        currentSubY += 46;
      } else {
        subLine = testLine;
      }
    }
    ctx.fillText(subLine.trim(), width / 2, currentSubY);

    // 5. Call to Action Button at Bottom
    const ctaY = height * 0.86;
    ctx.font = 'bold 34px "Plus Jakarta Sans", sans-serif';
    const ctaText = cta.toUpperCase();
    const ctaWidth = ctx.measureText(ctaText).width + 80;

    ctx.fillStyle = theme.accentColor;
    ctx.beginPath();
    ctx.roundRect(width / 2 - ctaWidth / 2, ctaY - 40, ctaWidth, 76, 38);
    ctx.fill();

    ctx.fillStyle = selectedTheme === 'clean_light' ? '#ffffff' : '#090d16';
    ctx.fillText(ctaText, width / 2, ctaY + 12);

    // Footer copyright / verified watermark
    ctx.font = '18px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = selectedTheme === 'clean_light' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.4)';
    ctx.fillText('CREATED WITH CREATORAI STUDIO • 100% COMMERCIAL READY', width / 2, height * 0.95);
  };

  useEffect(() => {
    renderPosterOnCanvas();
  }, [businessName, headline, subheadline, badge, cta, aspectRatio, selectedTheme, aiImageUrl]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setStatusMessage('Generating poster graphic with AI Studio...');

    try {
      const res = await api.generatePoster({
        prompt,
        businessName,
        headline,
        subheadline,
        badge,
        cta,
        theme: selectedTheme,
        aspectRatio
      });

      if (res.imageUrl) {
        setAiImageUrl(res.imageUrl);
        setStatusMessage('AI image generated and rendered on poster!');
      } else {
        setStatusMessage('Graphic poster created and ready to download!');
      }

      await refreshUser();
    } catch (err: any) {
      setError(err.message || 'Generation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${businessName.toLowerCase().replace(/\s+/g, '_')}_poster.png`;
    link.href = dataUrl;
    link.click();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
            <ImageIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
            Visual Studio
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Space_Grotesk']">
          AI Image & Poster Creator
        </h2>
        <p className="mt-2 text-purple-100 text-sm sm:text-base max-w-2xl">
          Design high-resolution marketing flyers, sneaker drop banners, event announcements, and social promotional graphics with live canvas export.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Image / Poster Description
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Create a professional promotional poster for a shoe business selling sneakers..."
              rows={2}
              className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Business / Brand Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Promotional Badge
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. 50% OFF, LIMITED DROP"
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Main Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full p-3 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Subheadline / Benefit
            </label>
            <input
              type="text"
              value={subheadline}
              onChange={(e) => setSubheadline(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Call to Action
              </label>
              <input
                type="text"
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setAspectRatio('1:1')}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold border flex flex-col items-center gap-0.5 ${
                    aspectRatio === '1:1'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>1:1 Post</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAspectRatio('9:16')}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold border flex flex-col items-center gap-0.5 ${
                    aspectRatio === '9:16'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>9:16 Story</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAspectRatio('16:9')}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold border flex flex-col items-center gap-0.5 ${
                    aspectRatio === '16:9'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>16:9 Banner</span>
                </button>
              </div>
            </div>
          </div>

          {/* Color Themes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Color Palette & Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              {POSTER_THEMES.map((thm) => (
                <button
                  key={thm.id}
                  type="button"
                  onClick={() => setSelectedTheme(thm.id)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    selectedTheme === thm.id
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${thm.bg} border border-white/20`} />
                  <span className="text-xs font-semibold truncate">{thm.label}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
              {error}
            </div>
          )}

          {statusMessage && (
            <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
              {statusMessage}
            </p>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="flex-1 py-3 px-4 rounded-2xl bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating AI Poster...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Generate with AI</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="py-3 px-4 rounded-2xl bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              title="Download full resolution poster"
            >
              {downloadSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
              <span>{downloadSuccess ? 'Downloaded!' : 'Download PNG'}</span>
            </button>
          </div>
        </div>

        {/* Live Canvas Preview */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full bg-slate-100 dark:bg-slate-950 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col items-center shadow-inner">
            <div className="flex items-center justify-between w-full mb-3 px-2">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-purple-500" />
                Live Studio Canvas Preview
              </span>
              <span className="text-[11px] text-slate-400 uppercase font-mono">
                {aspectRatio === '9:16' ? '1080 x 1920 px' : aspectRatio === '16:9' ? '1920 x 1080 px' : '1080 x 1080 px'}
              </span>
            </div>

            {/* Scaled Responsive Canvas Container */}
            <div className="relative max-w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-300 dark:border-slate-800">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto object-contain max-h-[480px] rounded-2xl"
              />
            </div>

            <p className="mt-3 text-[11px] text-slate-400 text-center">
              💡 Tip: Click "Download PNG" above to save the full 1080p commercial banner directly to your device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
