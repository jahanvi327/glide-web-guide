import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';

export type InsightItem = {
  title: string;
  description: string;
  weight: number;
  color: 'red' | 'orange' | 'amber' | 'blue' | 'slate';
};

export type GeneratorAttribution = {
  label: string;
  probability: number;
  barClass: string;
};

export type MetadataEntry = {
  label: string;
  value: string;
  tone: string;
};

export type ScanResult = {
  verdict: 'AI Generated' | 'Real' | 'Unknown AI Generator';
  aiProbability: number;
  realProbability: number;
  confidence: number;
  confidenceLabel: 'High' | 'Medium' | 'Low';
  riskLevel: 'High' | 'Medium' | 'Low';
  generator: string;
  trustScore: number;
  scanId: string;
  insights: InsightItem[];
  attributions: GeneratorAttribution[];
  metadata: MetadataEntry[];
  quickInsights: string[];
  heatmapPoints: { x: number; y: number; color: string }[];
};

export type ScanHistoryEntry = {
  id: string;
  image: string;
  result: 'AI Generated' | 'Real' | 'Unknown AI Generator';
  confidence: string;
  generator: string;
  date: string;
  trustScore: number;
};

const SAMPLE_IMAGES = [
  'https://images.pexels.com/photos/12365967/pexels-photo-12365967.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/617278/pexels-photo-617278.jpeg?auto=compress&cs=tinysrgb&w=940',
  'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=940',
  'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=940',
  'https://images.pexels.com/photos/1287142/pexels-photo-1287142.jpeg?auto=compress&cs=tinysrgb&w=940',
  'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=940',
];

const GENERATORS = ['Stable Diffusion', 'Midjourney', 'DALL·E', 'Flux', 'GAN', 'Unknown AI Generator'];

const INSIGHT_TEMPLATES: Omit<InsightItem, 'weight'>[] = [
  { title: 'Unnatural texture in the water reflection', description: 'Reflection shows impossible details and smoothness.', color: 'red' },
  { title: 'Inconsistent lighting & shadows', description: 'Lighting direction is inconsistent across objects.', color: 'orange' },
  { title: 'Irregular mountain structure', description: 'Mountain edges and patterns look artificial.', color: 'amber' },
  { title: 'Synthetic looking trees', description: 'Tree texture lacks natural variation.', color: 'blue' },
  { title: 'Unrealistic cabin details', description: 'Edges and textures appear too smooth and uniform.', color: 'slate' },
  { title: 'Frequency-domain artifacts detected', description: 'DCT analysis reveals periodic patterns typical of GAN models.', color: 'red' },
  { title: 'Compression traces inconsistent', description: 'JPEG quantization artifacts do not match expected camera output.', color: 'orange' },
  { title: 'Object geometry distortion', description: 'Object proportions deviate from expected real-world geometry.', color: 'amber' },
  { title: 'Reflection patterns unrealistic', description: 'Specular reflections do not align with the light source.', color: 'blue' },
  { title: 'Skin texture too smooth', description: 'Facial region lacks natural pore-level detail.', color: 'slate' },
];

const QUICK_INSIGHTS_AI = [
  'The image shows patterns commonly found in AI-generated images.',
  'The reflection in the water appears unnatural and too perfect.',
  'The cabin structure has irregular edges and textures.',
  'Frequency analysis reveals periodic artifacts not found in camera captures.',
  'Overall, the image is highly likely to be AI-generated.',
];

const QUICK_INSIGHTS_REAL = [
  'EXIF metadata is consistent with a real camera capture.',
  'Texture and lighting patterns match natural photography.',
  'No synthetic artifacts detected in frequency-domain analysis.',
  'C2PA content credentials verified successfully.',
  'Overall, the image is highly likely to be authentic.',
];

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function generateAttributions(verdict: ScanResult['verdict'], generator: string): GeneratorAttribution[] {
  if (verdict === 'Real') {
    return [
      { label: 'Stable Diffusion', probability: 2, barClass: 'bg-blue-500' },
      { label: 'Midjourney', probability: 1, barClass: 'bg-cyan-400' },
      { label: 'DALL·E', probability: 1, barClass: 'bg-amber-400' },
      { label: 'Unknown', probability: 1, barClass: 'bg-slate-300' },
    ];
  }
  const remaining = 100 - randomBetween(55, 75);
  const others = GENERATORS.filter((g) => g !== generator).slice(0, 3);
  const dist = others.map((g, i) => ({
    label: g,
    probability: i === others.length - 1 ? remaining - Math.floor(remaining * 0.6) : Math.floor(remaining * 0.3),
    barClass: g === 'Midjourney' ? 'bg-cyan-400' : g === 'DALL·E' ? 'bg-amber-400' : g === 'Flux' ? 'bg-violet-400' : g === 'GAN' ? 'bg-emerald-400' : 'bg-slate-300',
  }));
  const main = 100 - others.reduce((s, _g, i) => s + dist[i].probability, 0);
  return [
    { label: generator, probability: main, barClass: 'bg-blue-500' },
    ...dist,
  ];
}

function generateMetadata(verdict: ScanResult['verdict'], trustScore: number): MetadataEntry[] {
  if (verdict === 'Real') {
    return [
      { label: 'C2PA credentials', value: 'Verified', tone: 'text-emerald-600' },
      { label: 'EXIF metadata', value: 'Present · complete', tone: 'text-emerald-600' },
      { label: 'Creation date', value: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), tone: 'text-slate-700' },
      { label: 'Device information', value: 'Canon EOS R5 · 24mm', tone: 'text-slate-700' },
      { label: 'Metadata trust score', value: `${trustScore} / 100`, tone: 'text-emerald-600' },
    ];
  }
  return [
    { label: 'C2PA credentials', value: 'Not found', tone: 'text-orange-500' },
    { label: 'EXIF metadata', value: 'Present · partial', tone: 'text-amber-600' },
    { label: 'Creation date', value: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), tone: 'text-slate-700' },
    { label: 'Device information', value: 'Unavailable', tone: 'text-slate-500' },
    { label: 'Metadata trust score', value: `${trustScore} / 100`, tone: 'text-orange-500' },
  ];
}

function generateHeatmap(): { x: number; y: number; color: string }[] {
  return [
    { x: randomBetween(30, 70), y: randomBetween(25, 60), color: 'rgba(255,231,72,.9)' },
    { x: randomBetween(20, 50), y: randomBetween(60, 85), color: 'rgba(239,68,68,.8)' },
  ];
}

function generateScan(imageUrl: string, scanId: string): ScanResult {
  const isReal = Math.random() < 0.35;
  const isUnknown = !isReal && Math.random() < 0.15;
  const verdict: ScanResult['verdict'] = isReal ? 'Real' : isUnknown ? 'Unknown AI Generator' : 'AI Generated';
  const aiProbability = isReal ? randomBetween(2, 15) : randomBetween(72, 96);
  const realProbability = 100 - aiProbability;
  const confidence = isReal ? randomBetween(88, 97) : randomBetween(75, 94);
  const confidenceLabel: ScanResult['confidenceLabel'] = confidence >= 85 ? 'High' : confidence >= 70 ? 'Medium' : 'Low';
  const riskLevel: ScanResult['riskLevel'] = isReal ? 'Low' : aiProbability >= 85 ? 'High' : 'Medium';
  const generator = isReal ? '—' : isUnknown ? 'Unknown AI Generator' : GENERATORS[randomBetween(0, 4)];
  const trustScore = isReal ? randomBetween(80, 98) : randomBetween(15, 45);
  const insightCount = randomBetween(3, 5);
  const pickedInsights = pickN(INSIGHT_TEMPLATES, insightCount);
  const totalWeight = 100;
  const weights = pickedInsights.map((_, i) => i === 0 ? randomBetween(20, 30) : Math.floor((totalWeight - 30) / (insightCount - 1)) + randomBetween(-3, 3));
  const insights: InsightItem[] = pickedInsights.map((tpl, i) => ({ ...tpl, weight: Math.abs(weights[i] || 5) }));
  const attributions = generateAttributions(verdict, generator);
  const metadata = generateMetadata(verdict, trustScore);
  const quickInsights = isReal ? QUICK_INSIGHTS_REAL : QUICK_INSIGHTS_AI;
  const heatmapPoints = generateHeatmap();
  return { verdict, aiProbability, realProbability, confidence, confidenceLabel, riskLevel, generator, trustScore, scanId, insights, attributions, metadata, quickInsights, heatmapPoints };
}

const INITIAL_SCAN: ScanResult = {
  verdict: 'AI Generated',
  aiProbability: 87,
  realProbability: 13,
  confidence: 87,
  confidenceLabel: 'High',
  riskLevel: 'High',
  generator: 'Stable Diffusion',
  trustScore: 28,
  scanId: 'SIG-01248',
  insights: [
    { title: 'Unnatural texture in the water reflection', description: 'Reflection shows impossible details and smoothness.', weight: 28, color: 'red' },
    { title: 'Inconsistent lighting & shadows', description: 'Lighting direction is inconsistent across objects.', weight: 22, color: 'orange' },
    { title: 'Irregular mountain structure', description: 'Mountain edges and patterns look artificial.', weight: 18, color: 'amber' },
    { title: 'Synthetic looking trees', description: 'Tree texture lacks natural variation.', weight: 15, color: 'blue' },
    { title: 'Unrealistic cabin details', description: 'Edges and textures appear too smooth and uniform.', weight: 10, color: 'slate' },
  ],
  attributions: [
    { label: 'Stable Diffusion', probability: 72, barClass: 'bg-blue-500' },
    { label: 'Midjourney', probability: 16, barClass: 'bg-cyan-400' },
    { label: 'DALL·E', probability: 7, barClass: 'bg-amber-400' },
    { label: 'Unknown', probability: 5, barClass: 'bg-slate-300' },
  ],
  metadata: [
    { label: 'C2PA credentials', value: 'Not found', tone: 'text-orange-500' },
    { label: 'EXIF metadata', value: 'Present · partial', tone: 'text-emerald-600' },
    { label: 'Creation date', value: '10 Sep 2025, 14:32', tone: 'text-slate-700' },
    { label: 'Device information', value: 'Unavailable', tone: 'text-slate-500' },
    { label: 'Metadata trust score', value: '28 / 100', tone: 'text-orange-500' },
  ],
  quickInsights: QUICK_INSIGHTS_AI,
  heatmapPoints: [{ x: 58, y: 42, color: 'rgba(255,231,72,.9)' }, { x: 35, y: 78, color: 'rgba(239,68,68,.8)' }],
};

const INITIAL_HISTORY: ScanHistoryEntry[] = [
  { id: 'SIG-01248', image: SAMPLE_IMAGES[0], result: 'AI Generated', confidence: '87%', generator: 'Stable Diffusion', date: '14 Sep 2026, 14:32', trustScore: 28 },
  { id: 'SIG-01247', image: SAMPLE_IMAGES[1], result: 'Real', confidence: '92%', generator: '—', date: '14 Sep 2026, 13:18', trustScore: 94 },
  { id: 'SIG-01246', image: SAMPLE_IMAGES[0], result: 'AI Generated', confidence: '78%', generator: 'Midjourney', date: '14 Sep 2026, 11:47', trustScore: 35 },
  { id: 'SIG-01245', image: SAMPLE_IMAGES[2], result: 'Real', confidence: '94%', generator: '—', date: '14 Sep 2026, 10:21', trustScore: 91 },
  { id: 'SIG-01244', image: SAMPLE_IMAGES[3], result: 'AI Generated', confidence: '81%', generator: 'DALL·E', date: '13 Sep 2026, 19:05', trustScore: 22 },
  { id: 'SIG-01243', image: SAMPLE_IMAGES[4], result: 'Unknown AI Generator', confidence: '65%', generator: 'Unknown AI Generator', date: '13 Sep 2026, 16:12', trustScore: 40 },
];

type AnalysisContextType = {
  imageUrl: string;
  setImageUrl: (url: string) => void;
  scan: ScanResult;
  history: ScanHistoryEntry[];
  totalScans: number;
  realCount: number;
  aiCount: number;
  unknownCount: number;
  reviewQueueCount: number;
  runAnalysis: () => void;
  setNotice: (msg: string) => void;
  notice: string;
  clearNotice: () => void;
};

const AnalysisContext = createContext<AnalysisContextType | null>(null);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [imageUrl, setImageUrl] = useState(SAMPLE_IMAGES[0]);
  const [scan, setScan] = useState<ScanResult>(INITIAL_SCAN);
  const [history, setHistory] = useState<ScanHistoryEntry[]>(INITIAL_HISTORY);
  const [notice, setNotice] = useState('');

  const runAnalysis = useCallback(() => {
    const scanId = `SIG-${String(1249 + Math.floor(Math.random() * 100)).padStart(5, '0')}`;
    const newScan = generateScan(imageUrl, scanId);
    setScan(newScan);
    const newEntry: ScanHistoryEntry = {
      id: scanId,
      image: imageUrl,
      result: newScan.verdict,
      confidence: `${newScan.confidence}%`,
      generator: newScan.generator,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      trustScore: newScan.trustScore,
    };
    setHistory((prev) => [newEntry, ...prev].slice(0, 20));
    setNotice(`Analysis complete: ${newScan.verdict} (${newScan.confidence}% confidence).`);
  }, [imageUrl]);

  const clearNotice = useCallback(() => setNotice(''), []);

  const { totalScans, realCount, aiCount, unknownCount } = useMemo(() => {
    const total = history.length;
    const real = history.filter((h) => h.result === 'Real').length;
    const ai = history.filter((h) => h.result === 'AI Generated').length;
    const unknown = history.filter((h) => h.result === 'Unknown AI Generator').length;
    return { totalScans: total, realCount: real, aiCount: ai, unknownCount: unknown };
  }, [history]);

  const reviewQueueCount = useMemo(() => history.filter((h) => {
    const conf = parseInt(h.confidence);
    return conf < 80;
  }).length, [history]);

  const value: AnalysisContextType = {
    imageUrl,
    setImageUrl,
    scan,
    history,
    totalScans,
    realCount,
    aiCount,
    unknownCount,
    reviewQueueCount,
    runAnalysis,
    setNotice,
    notice,
    clearNotice,
  };

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
}

export function useAnalysis(): AnalysisContextType {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error('useAnalysis must be used within AnalysisProvider');
  return ctx;
}

export { SAMPLE_IMAGES };
