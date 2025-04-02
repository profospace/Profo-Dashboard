import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapSelector = ({ onLocationSelect, initialPosition }) => {
    const [markerPosition, setMarkerPosition] = useState(initialPosition);

    // Update marker when initialPosition changes
    useEffect(() => {
        setMarkerPosition(initialPosition);
    }, [initialPosition]);

    const mapContainerStyle = {
        width: '100%',
        height: '400px'
    };

    const handleMapClick = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        const newPosition = { lat, lng };
        setMarkerPosition(newPosition);
        onLocationSelect(newPosition);
    };

    return (
            <div className="w-full h-[400px] border rounded-md overflow-hidden">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={markerPosition}
                    zoom={14}
                    onClick={handleMapClick}
                >
                    <Marker
                        position={markerPosition}
                        draggable={true}
                        onDragEnd={(e) => {
                            const lat = e.latLng.lat();
                            const lng = e.latLng.lng();
                            const newPosition = { lat, lng };
                            setMarkerPosition(newPosition);
                            onLocationSelect(newPosition);
                        }}
                    />
                </GoogleMap>
            </div>
    );
};

export default MapSelector;