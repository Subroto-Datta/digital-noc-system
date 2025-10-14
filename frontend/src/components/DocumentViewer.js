import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import LoadingSpinner from './LoadingSpinner';
import { 
  X, 
  Download, 
  Eye, 
  AlertCircle,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize
} from 'lucide-react';

const DocumentViewer = ({ 
  isOpen, 
  filename, 
  onClose, 
  onDownload,
  viewUrl 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isOpen && viewUrl) {
      setLoading(true);
      setError('');
      
      // If it's a blob URL, it should work immediately
      if (viewUrl.startsWith('blob:')) {
        setLoading(false);
        return;
      }
      
      // For regular URLs, test if accessible
      fetch(viewUrl, { method: 'HEAD' })
        .then(response => {
          if (!response.ok) {
            throw new Error('File not accessible');
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('URL test failed:', err);
          setError('Failed to load document. Please try downloading instead.');
          setLoading(false);
        });
    }
  }, [isOpen, viewUrl]);

  if (!isOpen) return null;

  const isPDF = filename.toLowerCase().endsWith('.pdf');
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleFullscreen = () => window.open(viewUrl, '_blank');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl h-full max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {filename}
            </h2>
            <span className="text-sm text-gray-500">
              {isPDF ? 'PDF Document' : isImage ? 'Image' : 'Document'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Zoom Controls for Images */}
            {isImage && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoom <= 50}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600 min-w-[60px] text-center">
                  {zoom}%
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoom >= 200}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRotate}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleFullscreen}
            >
              <Maximize className="h-4 w-4 mr-1" />
              Fullscreen
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-gray-100">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <LoadingSpinner size="large" />
                <p className="mt-4 text-gray-600">Loading document...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Unable to preview document
                </h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={onDownload} className="mr-2">
                  <Download className="h-4 w-4 mr-1" />
                  Download Instead
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          ) : isPDF ? (
            <iframe
              src={viewUrl}
              className="w-full h-full border-0"
              title={filename}
              onLoad={() => setLoading(false)}
              onError={() => {
                setError('Failed to load PDF. Please try downloading.');
                setLoading(false);
              }}
            />
          ) : isImage ? (
            <div className="flex items-center justify-center h-full p-4 overflow-auto">
              <img
                src={viewUrl}
                alt={filename}
                className="max-w-none transition-transform duration-200"
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  maxHeight: zoom <= 100 ? '100%' : 'none',
                  maxWidth: zoom <= 100 ? '100%' : 'none'
                }}
                onLoad={() => setLoading(false)}
                onError={(e) => {
                  console.error('Image load error:', e);
                  setError('Failed to load image. Please try downloading.');
                  setLoading(false);
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Preview not available
                </h3>
                <p className="text-gray-600 mb-4">
                  This file type cannot be previewed in the browser.
                </p>
                <Button onClick={onDownload}>
                  <Download className="h-4 w-4 mr-1" />
                  Download to View
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;