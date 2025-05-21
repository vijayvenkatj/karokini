import { Upload, Music, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { useState } from 'react';

interface FileUploadProps {
  onFileSelect: (files: { mp3?: File; lrc?: File }) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<{ mp3?: File; lrc?: File }>({});

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'mp3' | 'lrc') => {
    const file = event.target.files?.[0];
    if (file) {
      const newFiles = { ...selectedFiles, [type]: file };
      setSelectedFiles(newFiles);
    }
  };

  const handleProceed = () => {
    onFileSelect(selectedFiles);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white/10 dark:bg-zinc-900/40 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/10">
      <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-6">Upload your files</h3>
      <div className="space-y-6">
        <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl p-8 bg-white/5 dark:bg-zinc-800/20">
          <div className="text-center">
            <div className="p-3 bg-blue-600/20 dark:bg-blue-500/20 rounded-full inline-block">
              <Music className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full relative bg-white/50 dark:bg-zinc-800/50 hover:bg-white/70 dark:hover:bg-zinc-800/70 border-zinc-200 dark:border-zinc-700"
                onClick={() => document.getElementById('mp3-upload')?.click()}
              >
                <Upload className="h-5 w-5 mr-2 text-zinc-600 dark:text-zinc-300" />
                <span className="text-zinc-900 dark:text-zinc-100">
                  {selectedFiles.mp3 ? selectedFiles.mp3.name : 'Upload MP3 file'}
                </span>
                <input
                  id="mp3-upload"
                  type="file"
                  accept=".mp3"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => handleFileChange(e, 'mp3')}
                />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl p-8 bg-white/5 dark:bg-zinc-800/20">
          <div className="text-center">
            <div className="p-3 bg-blue-600/20 dark:bg-blue-500/20 rounded-full inline-block">
              <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full relative bg-white/50 dark:bg-zinc-800/50 hover:bg-white/70 dark:hover:bg-zinc-800/70 border-zinc-200 dark:border-zinc-700"
                onClick={() => document.getElementById('lrc-upload')?.click()}
              >
                <Upload className="h-5 w-5 mr-2 text-zinc-600 dark:text-zinc-300" />
                <span className="text-zinc-900 dark:text-zinc-100">
                  {selectedFiles.lrc ? selectedFiles.lrc.name : 'Upload LRC file'}
                </span>
                <input
                  id="lrc-upload"
                  type="file"
                  accept=".lrc"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => handleFileChange(e, 'lrc')}
                />
              </Button>
            </div>
          </div>
        </div>

        {selectedFiles.mp3 && (
          <div className="mt-6">
            <Button
              variant="primary"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleProceed}
            >
              Proceed to Player
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
