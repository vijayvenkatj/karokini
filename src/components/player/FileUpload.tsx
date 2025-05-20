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
    <div className="w-full max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload your files</h3>
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <Music className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full relative"
                onClick={() => document.getElementById('mp3-upload')?.click()}
              >
                <Upload className="h-5 w-5 mr-2" />
                {selectedFiles.mp3 ? selectedFiles.mp3.name : 'Upload MP3 file'}
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

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full relative"
                onClick={() => document.getElementById('lrc-upload')?.click()}
              >
                <Upload className="h-5 w-5 mr-2" />
                {selectedFiles.lrc ? selectedFiles.lrc.name : 'Upload LRC file'}
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

        {selectedFiles.mp3 && selectedFiles.lrc && (
          <div className="mt-6 text-zinc-900">
            <Button
              variant="primary"
              className="w-full"
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
