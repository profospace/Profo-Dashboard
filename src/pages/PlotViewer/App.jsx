import React, { useState } from 'react';
import ImageUploader from '../../components/PlotViewer/ImageUploader';
import PlotViewer3D from '../../components/PlotViewer/PlotViewer3D';
import PlotControls from '../../components/PlotViewer/PlotControls';
import { Upload } from 'lucide-react';

function PlotViewer() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [plotData, setPlotData] = useState(null);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [viewMode, setViewMode] = useState('3d');

  const handleImageUpload = (imageData) => {
    setUploadedImage(imageData);
    // Generate sample plot data for demonstration
    generateSamplePlotData(imageData);
  };

  const generateSamplePlotData = (imageData) => {
    // Generate sample segmented plots for demonstration
    const samplePlots = [];
    const gridSize = 8;
    
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const plotId = `plot_${x}_${z}`;
        const height = Math.random() * 0.5 + 0.2;
        const plotType = ['residential', 'commercial', 'agricultural', 'industrial'][Math.floor(Math.random() * 4)];
        
        samplePlots.push({
          id: plotId,
          position: [x - gridSize/2, 0, z - gridSize/2],
          dimensions: [0.9, height, 0.9],
          metadata: {
            area: `${(Math.random() * 500 + 200).toFixed(0)} sq ft`,
            owner: `Owner ${x}${z}`,
            type: plotType,
            value: `$${(Math.random() * 100000 + 50000).toFixed(0)}`,
            lastUpdated: new Date().toLocaleDateString(),
            zoning: plotType.toUpperCase(),
            coordinates: `${x}, ${z}`,
          },
          color: getPlotColor(plotType)
        });
      }
    }
    
    setPlotData(samplePlots);
  };

  const getPlotColor = (type) => {
    const colors = {
      residential: '#22c55e',
      commercial: '#3b82f6', 
      agricultural: '#f59e0b',
      industrial: '#ef4444'
    };
    return colors[type] || '#6b7280';
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="relative z-50 glass-dark border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                PlotVision 3D
              </h1>
            </div>
            
            {plotData && (
              <PlotControls 
                viewMode={viewMode}
                setViewMode={setViewMode}
                plotCount={plotData.length}
              />
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative">
        {!uploadedImage ? (
          <div className="h-screen flex items-center justify-center p-6">
            <ImageUploader onImageUpload={handleImageUpload} />
          </div>
        ) : (
          <div className="h-screen relative">
            <PlotViewer3D 
              plotData={plotData}
              selectedPlot={selectedPlot}
              setSelectedPlot={setSelectedPlot}
              backgroundImage={uploadedImage}
            />
            
            {/* Reset Button */}
            <button
              onClick={() => {
                setUploadedImage(null);
                setPlotData(null);
                setSelectedPlot(null);
              }}
              className="absolute top-6 right-6 z-50 glass px-4 py-2 rounded-lg text-white hover:bg-white/20 transition-all duration-300 flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload New</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default PlotViewer;