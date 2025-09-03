import React from 'react';
import { MapPin, Ruler, User, DollarSign, Calendar, Building } from 'lucide-react';

const HoverPanel = ({ plot, position }) => {
  if (!plot) return null;

  const getTypeIcon = (type) => {
    const icons = {
      residential: Building,
      commercial: Building,
      agricultural: MapPin,
      industrial: Building
    };
    const Icon = icons[type] || Building;
    return <Icon className="w-4 h-4" />;
  };

  const getTypeColor = (type) => {
    const colors = {
      residential: 'text-primary-400',
      commercial: 'text-secondary-400', 
      agricultural: 'text-yellow-400',
      industrial: 'text-red-400'
    };
    return colors[type] || 'text-gray-400';
  };

  return (
    <div 
      className="fixed z-50 pointer-events-none animate-slide-up"
      style={{
        left: `${Math.min(position.x + 20, window.innerWidth - 320)}px`,
        top: `${Math.max(position.y - 100, 20)}px`,
      }}
    >
      <div className="glass rounded-xl border border-white/20 p-4 w-72 shadow-2xl">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-3 pb-3 border-b border-white/10">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${
            plot.type === 'residential' ? 'from-primary-500/20 to-primary-600/20' :
            plot.type === 'commercial' ? 'from-secondary-500/20 to-secondary-600/20' :
            plot.type === 'agricultural' ? 'from-yellow-500/20 to-yellow-600/20' :
            'from-red-500/20 to-red-600/20'
          }`}>
            <div className={getTypeColor(plot.type)}>
              {getTypeIcon(plot.type)}
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Plot Details</h3>
            <p className={`text-sm font-medium capitalize ${getTypeColor(plot.type)}`}>
              {plot.type}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-300">
              <Ruler className="w-4 h-4" />
              <span className="text-sm">Area</span>
            </div>
            <span className="text-white font-medium">{plot.area}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-300">
              <User className="w-4 h-4" />
              <span className="text-sm">Owner</span>
            </div>
            <span className="text-white font-medium">{plot.owner}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-300">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">Value</span>
            </div>
            <span className="text-white font-medium">{plot.value}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-300">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Coordinates</span>
            </div>
            <span className="text-white font-medium">{plot.coordinates}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-300">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Updated</span>
            </div>
            <span className="text-white font-medium">{plot.lastUpdated}</span>
          </div>
        </div>

        {/* Zoning Badge */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-white/10 to-white/5 text-white">
            Zoning: {plot.zoning}
          </div>
        </div>
      </div>

      {/* Arrow pointer */}
      <div className="absolute top-4 -left-2 w-4 h-4 glass border-l border-t border-white/20 rotate-45 transform -translate-y-2"></div>
    </div>
  );
};

export default HoverPanel;