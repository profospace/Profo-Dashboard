import React from 'react';
import { Box, RotateCcw, Maximize, Info, BarChart3 } from 'lucide-react';

const PlotControls = ({ viewMode, setViewMode, plotCount }) => {
  return (
    <div className="flex items-center space-x-3">
      {/* View Mode Toggle */}
      <div className="flex items-center space-x-1 glass rounded-lg p-1">
        <button
          onClick={() => setViewMode('3d')}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            viewMode === '3d' 
              ? 'bg-primary-500 text-white shadow-lg' 
              : 'text-gray-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Box className="w-4 h-4 mr-1 inline" />
          3D
        </button>
        <button
          onClick={() => setViewMode('analysis')}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            viewMode === 'analysis' 
              ? 'bg-secondary-500 text-white shadow-lg' 
              : 'text-gray-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <BarChart3 className="w-4 h-4 mr-1 inline" />
          Analysis
        </button>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center space-x-2">
        <button className="glass p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 group">
          <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
        </button>
        
        <button className="glass p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200">
          <Maximize className="w-4 h-4" />
        </button>
        
        <button className="glass p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200">
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Plot Count Badge */}
      <div className="glass rounded-lg px-3 py-2">
        <span className="text-sm text-gray-300">
          <span className="font-medium text-white">{plotCount}</span> plots
        </span>
      </div>
    </div>
  );
};

export default PlotControls;