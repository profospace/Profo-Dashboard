// HomeScreen.js or HomePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UnifiedListOption from '../../components/ListOptions/UnifiedListOption';
import { base_url } from "../../../utils/base_url";

const HomeScreen = () => {
    const [homeFeedSections, setHomeFeedSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userLocation, setUserLocation] = useState(null);
    const navigate = useNavigate();

    // Get user location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                () => {
                    console.log("Could not get location, using default");
                }
            );
        }
    }, []);

    // Fetch home feed
    useEffect(() => {
        const fetchHomeFeed = async () => {
            try {
                const queryParams = new URLSearchParams();
                if (userLocation) {
                    queryParams.append('latitude', userLocation.latitude);
                    queryParams.append('longitude', userLocation.longitude);
                }

                const response = await fetch(`${base_url}/api/home-feed?${queryParams.toString()}`);
                const data = await response.json();
                setHomeFeedSections(data);
            } catch (error) {
                console.error('Error fetching home feed:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeFeed();
    }, [userLocation]);

    const handleItemSelect = (type, item) => {
        if (type === 'property') {
            navigate(`/property/${item.post_id}`);
        } else if (type === 'project') {
            navigate(`/project/${item.id}`);
        } else if (type === 'custom') {
            if (item.link.startsWith('http')) {
                window.open(item.link, '_blank');
            } else {
                navigate(item.link);
            }
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4 space-y-8">
            {homeFeedSections?.map((section, index) => (
                <UnifiedListOption
                    key={index}
                    sectionConfig={section}
                    userLocation={userLocation}
                    onItemSelect={handleItemSelect}
                />
            ))}
        </div>
    );
};

export default HomeScreen;