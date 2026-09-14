import { ChangeEvent, useState } from 'react';
import { Camera, CircleHelp, CloudUpload, Link2, ScanSearch, Upload, X } from 'lucide-react';
import { useAnalysis, SAMPLE_IMAGES } from '@/lib/analysis-context';
import { supabase } from '@/lib/supabase';

export function UploadPanel() {
  const { imageUrl, setImageUrl, setNotice, runAnalysis } = useAnalysis();
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');

  const saveScan = async (url: string) => {
    if (!supabase) return;
    const { error } = await supabase
      .from('images')
      .insert({ source_url: url, file_name: fileName || 'dashboard-upload.jpg', mime_type: 'image/jpeg', status: 'analyzed' });
    if (error) setNotice('Upload ready locally. Connect your workspace to sync scans.');
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setImageUrl(localUrl);
    setFileName(file.name);
    setNotice(`${file.name} is ready for authenticity analysis.`);
    void saveScan(localUrl);
  };

  const loadSample = () => {
    const random = SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)]!;
    setImageUrl(random);
    setFileName('sample-image.jpg');
    setNotice('Sample image loaded. Click "Analyze now" to scan it.');
  };

  const clearImage = () => {
    setImageUrl(SAMPLE_IMAGES[0]!);
    setFileName('');
    setNotice('Image cleared. Upload a new one to analyze.');
  };

  return (
    <section className="card-shadow rounded-xl border border-slate-200/80 bg-white p-4 dark:bg-slate-900 dark:border-slate-700">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[14px] font-extrabold text-slate-800 dark:text-slate-200">Upload Image</h2>
        <CircleHelp size={15} className="text-slate-400" />
      </div>

      {/* Selected image preview */}
      <div className="relative mb-3 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 animate-scale-in">
        <img src={imageUrl} alt="Selected for analysis" className="h-[140px] w-full object-cover" />
        <button
          onClick={clearImage}
          className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-slate-900/70 text-white transition-all duration-200 hover:bg-rose-500 hover:scale-110"
        >
          <X size={14} />
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent px-3 py-2">
          <p className="truncate text-[10px] font-bold text-white">{fileName || 'Current image'}</p>
          <p className="text-[8px] text-slate-300">Ready for analysis</p>
        </div>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) {
            const localUrl = URL.createObjectURL(file);
            setImageUrl(localUrl);
            setFileName(file.name);
            setNotice(`${file.name} is ready for authenticity analysis.`);
            void saveScan(localUrl);
          }
        }}
        className={`flex h-[100px] flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all duration-200 ${
          isDragging ? 'border-blue-500 bg-blue-50 scale-[1.02]' : 'border-blue-200 bg-[#fbfdff] dark:bg-slate-800 dark:border-slate-700'
        }`}
      >
        <CloudUpload size={24} className={`mb-1 text-blue-600 transition-transform duration-200 ${isDragging ? 'scale-125' : ''}`} />
        <p className="text-center text-[10px] font-bold text-slate-700 dark:text-slate-300">
          Drag &amp; drop or <span className="font-medium text-slate-500">browse</span>
        </p>
        <p className="mt-1 text-[8px] text-slate-400">JPG, PNG, WEBP · Max 10MB</p>
        <input id="file-upload" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFile} className="hidden" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <label
          htmlFor="file-upload"
          className="flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-blue-600 text-[10px] font-bold text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-lg"
        >
          <Upload size={13} />Choose Image
        </label>
        <button
          onClick={loadSample}
          className="flex h-8 items-center justify-center gap-1.5 rounded-md border border-blue-200 text-[10px] font-bold text-blue-600 transition-all duration-200 hover:bg-blue-50 hover:shadow-md dark:border-slate-600 dark:hover:bg-slate-800"
        >
          <Link2 size={13} />Sample Image
        </button>
      </div>
      <button
        onClick={() => setNotice('Camera capture is available on mobile devices.')}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-md py-2 text-[10px] font-semibold text-slate-500 transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-800"
      >
        <Camera size={14} />Use camera capture
      </button>
      <button
        onClick={runAnalysis}
        className="group mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-slate-900 py-2.5 text-[10px] font-bold text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-lg dark:bg-blue-600"
      >
        <ScanSearch size={14} className="transition-transform duration-200 group-hover:rotate-180" />Analyze now
      </button>
    </section>
  );
}
