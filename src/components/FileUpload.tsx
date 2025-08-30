/**
 * Advanced File Upload Component
 * Drag-and-drop interface with real-time processing
 */

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, CheckCircle, AlertCircle, X, FileText, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileProcessingService, ProcessedFile } from '../services/FileProcessingService';
import { LlamaIndexService } from '../services/LlamaIndexService';

interface FileUploadProps {
  fileService: FileProcessingService;
  indexService: LlamaIndexService;
  onFileProcessed: (file: ProcessedFile) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  fileService, 
  indexService, 
  onFileProcessed 
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<ProcessedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingFile, setProcessingFile] = useState<string>('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsProcessing(true);
    
    for (const file of acceptedFiles) {
      try {
        setProcessingFile(file.name);
        
        // Process file
        const processedFile = await fileService.processFile(file);
        
        // Index for retrieval
        await indexService.indexDocument(processedFile.content, {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size
        });
        
        setUploadedFiles(prev => [...prev, processedFile]);
        onFileProcessed(processedFile);
        
      } catch (error) {
        console.error('File processing error:', error);
      }
    }
    
    setIsProcessing(false);
    setProcessingFile('');
  }, [fileService, indexService, onFileProcessed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/*': ['.txt', '.md', '.csv'],
      'application/json': ['.json']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const indexStats = indexService.getIndexStats();

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <motion.div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input {...getInputProps()} />
        
        <motion.div
          animate={{ 
            y: isDragActive ? -5 : 0,
            scale: isDragActive ? 1.1 : 1
          }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Upload className={`h-12 w-12 mx-auto mb-4 ${
            isDragActive ? 'text-blue-500' : 'text-gray-400'
          }`} />
        </motion.div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {isDragActive ? 'Drop files here!' : 'Upload Documents'}
        </h3>
        <p className="text-gray-600 text-sm">
          Drag & drop files or click to browse
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Supports: TXT, MD, JSON, CSV (max 10MB)
        </p>
      </motion.div>

      {/* Processing Indicator */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-blue-800 font-medium">
                Processing {processingFile}...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Index Stats */}
      {indexStats.totalDocuments > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-800">Knowledge Base</span>
          </div>
          <div className="text-sm text-green-700">
            {indexStats.totalDocuments} documents indexed • {indexStats.totalChunks} searchable chunks
          </div>
        </div>
      )}

      {/* Uploaded Files */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <h4 className="font-medium text-gray-700 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Processed Files ({uploadedFiles.length})
            </h4>
            
            {uploadedFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium text-gray-800">{file.name}</div>
                    <div className="text-xs text-gray-500">
                      {file.metadata.wordCount} words • {(file.size / 1024).toFixed(1)}KB
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => removeFile(file.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};