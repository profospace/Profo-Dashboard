import React, { useState, useEffect } from 'react';
import { Play, Pause, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { base_url } from '../../../utils/base_url';

const PreviewAds = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedType, setSelectedType] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showPopup, setShowPopup] = useState(null);
    const [showInterstitial, setShowInterstitial] = useState(null);
    const [videoPlaying, setVideoPlaying] = useState({});
    const [carouselIndex, setCarouselIndex] = useState({});

    useEffect(() => {
        fetchAds();
    }, [currentPage, selectedType]);

    const fetchAds = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${base_url}/api/ads?page=${currentPage}&limit=10&type=${selectedType}`);
            const data = await response.json();

            if (data.success) {
                setAds(data.ads);
                setTotalPages(data.totalPages);
            } else {
                setError('Failed to fetch ads');
            }
        } catch (err) {
            setError('Error fetching ads');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleVideoToggle = (adId) => {
        setVideoPlaying(prev => ({
            ...prev,
            [adId]: !prev[adId]
        }));
    };

    const handleCarouselNext = (adId) => {
        setCarouselIndex(prev => ({
            ...prev,
            [adId]: (prev[adId] || 0) + 1
        }));
    };

    const handleCarouselPrev = (adId) => {
        setCarouselIndex(prev => ({
            ...prev,
            [adId]: Math.max((prev[adId] || 0) - 1, 0)
        }));
    };

    const renderBannerAd = (ad) => {
        const positionClass = {
            top: 'top-0',
            bottom: 'bottom-0',
            middle: 'top-1/2 transform -translate-y-1/2',
            floating: 'top-4 right-4'
        };

        return (
            <div className={`absolute ${positionClass[ad.position] || 'top-0'} left-0 right-0 z-10`}>
                <div className="bg-white shadow-lg">
                    {ad.header && (
                        <div className="text-center py-2 bg-blue-600 text-white text-sm font-medium">
                            {ad.header}
                        </div>
                    )}

                    {ad.middle && (
                        <div className="p-0">
                            {ad.middle.layout === 'single' && ad.middle.cards?.[0] && (
                                <img
                                    src={ad.middle.cards[0].imageUrl}
                                    alt="Ad"
                                    className="w-full h-auto"
                                />
                            )}

                            {ad.middle.layout === 'grid' && (
                                <div className={`grid gap-0 ${ad.middle.maxItemsPerRow ? `grid-cols-${ad.middle.maxItemsPerRow}` : 'grid-cols-2'}`}>
                                    {ad.middle.cards?.map((card, idx) => (
                                        <img key={idx} src={card.imageUrl} alt="Ad" className="w-full h-auto" />
                                    ))}
                                </div>
                            )}

                            {ad.middle.layout === 'carousel' && ad.middle.cards && (
                                <div className="relative overflow-hidden">
                                    <div
                                        className="flex transition-transform duration-300"
                                        style={{ transform: `translateX(-${(carouselIndex[ad._id] || 0) * 100}%)` }}
                                    >
                                        {ad.middle.cards.map((card, idx) => (
                                            <img key={idx} src={card.imageUrl} alt="Ad" className="w-full flex-shrink-0" />
                                        ))}
                                    </div>
                                    {ad.middle.cards.length > 1 && (
                                        <>
                                            <button
                                                onClick={() => handleCarouselPrev(ad._id)}
                                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded"
                                            >
                                                <ChevronLeft size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleCarouselNext(ad._id)}
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded"
                                            >
                                                <ChevronRight size={16} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {ad.bottomCta && (
                        <img src={ad.bottomCta.imageUrl} alt="CTA" className="w-full h-auto" />
                    )}
                </div>
            </div>
        );
    };

    const renderVideoAd = (ad) => {
        const isPlaying = videoPlaying[ad._id];

        return (
            <div className="relative bg-black">
                {ad.videoUrl ? (
                    <div className="relative">
                        <video
                            className="w-full h-48"
                            controls={false}
                            autoPlay={isPlaying}
                            muted
                        >
                            <source src={ad.videoUrl} type="video/mp4" />
                        </video>

                        <div className="absolute inset-0 flex items-center justify-center">
                            <button
                                onClick={() => handleVideoToggle(ad._id)}
                                className="bg-black bg-opacity-50 text-white p-3 rounded-full"
                            >
                                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                            </button>
                        </div>

                        {ad.skippable && (
                            <button className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 text-xs rounded">
                                Skip in {ad.skipAfter}s
                            </button>
                        )}

                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                            <div className="text-white text-sm">{ad.header}</div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-48 bg-gray-800 flex items-center justify-center text-white">
                        <div className="text-center">
                            <Play size={48} />
                            <div className="mt-2">{ad.header}</div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderNativeAd = (ad) => {
        return (
            <div className="bg-white border border-gray-200">
                {ad.header && (
                    <div className="p-3 border-b border-gray-100">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Sponsored</div>
                        <div className="font-semibold text-gray-900">{ad.header}</div>
                    </div>
                )}

                {ad.middle && ad.middle.cards?.[0] && (
                    <img
                        src={ad.middle.cards[0].imageUrl}
                        alt="Native Ad"
                        className="w-full h-auto"
                    />
                )}

                {ad.description && (
                    <div className="p-3 text-gray-700 text-sm">
                        {ad.description}
                    </div>
                )}

                {ad.bottomCta && (
                    <div className="p-3 border-t border-gray-100">
                        <img src={ad.bottomCta.imageUrl} alt="CTA" className="w-full h-auto" />
                    </div>
                )}
            </div>
        );
    };

    const renderPopupAd = (ad) => {
        if (showPopup !== ad._id) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-sm w-full relative">
                    <button
                        onClick={() => setShowPopup(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-10"
                    >
                        <X size={16} />
                    </button>

                    {ad.header && (
                        <div className="p-4 text-center font-semibold text-gray-900">
                            {ad.header}
                        </div>
                    )}

                    {ad.middle && ad.middle.cards?.[0] && (
                        <img
                            src={ad.middle.cards[0].imageUrl}
                            alt="Popup Ad"
                            className="w-full h-auto rounded-t-lg"
                        />
                    )}

                    {ad.description && (
                        <div className="p-4 text-gray-700 text-sm text-center">
                            {ad.description}
                        </div>
                    )}

                    {ad.bottomCta && (
                        <div className="p-4">
                            <img src={ad.bottomCta.imageUrl} alt="CTA" className="w-full h-auto rounded" />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderInterstitialAd = (ad) => {
        if (showInterstitial !== ad._id) return null;

        return (
            <div className="fixed inset-0 bg-white z-50 flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <div className="text-sm text-gray-500">Advertisement</div>
                    <button
                        onClick={() => setShowInterstitial(null)}
                        className="text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                    {ad.header && (
                        <div className="text-center text-xl font-bold mb-4 px-4">
                            {ad.header}
                        </div>
                    )}

                    {ad.middle && ad.middle.cards?.[0] && (
                        <div className="px-4 mb-4">
                            <img
                                src={ad.middle.cards[0].imageUrl}
                                alt="Interstitial Ad"
                                className="w-full h-auto"
                            />
                        </div>
                    )}

                    {ad.description && (
                        <div className="px-4 mb-4 text-center text-gray-700">
                            {ad.description}
                        </div>
                    )}
                </div>

                {ad.bottomCta && (
                    <div className="p-4">
                        <img src={ad.bottomCta.imageUrl} alt="CTA" className="w-full h-auto" />
                    </div>
                )}
            </div>
        );
    };

    const renderAdPreview = (ad) => {
        return (
            <div className="bg-gray-100 rounded-lg overflow-hidden">
                {/* Mobile Device Frame */}
                <div className="bg-black p-2 rounded-t-lg">
                    <div className="bg-gray-800 rounded-lg p-1">
                        <div className="bg-white rounded-lg h-96 relative overflow-hidden">
                            {/* Status Bar */}
                            <div className="bg-gray-900 text-white text-xs flex justify-between items-center px-2 py-1">
                                <span>9:41</span>
                                <div className="flex space-x-1">
                                    <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
                                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                                </div>
                            </div>

                            {/* App Content Mockup */}
                            <div className="p-4 h-full bg-gray-50 relative">
                                <div className="text-gray-400 text-sm mb-2">Sample App Content</div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                                </div>

                                {/* Render Ad Based on Type */}
                                {ad.type === 'BANNER' && renderBannerAd(ad)}
                                {ad.type === 'NATIVE' && (
                                    <div className="mt-4">
                                        {renderNativeAd(ad)}
                                    </div>
                                )}
                                {ad.type === 'VIDEO' && (
                                    <div className="mt-4">
                                        {renderVideoAd(ad)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ad Info */}
                <div className="p-4 bg-white">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="font-semibold text-gray-900">{ad.name}</h3>
                            <div className="text-sm text-gray-500">Type: {ad.type}</div>
                            <div className="text-sm text-gray-500">Priority: {ad.priority}</div>
                        </div>
                        <div className="flex space-x-2">
                            {ad.type === 'POPUP' && (
                                <button
                                    onClick={() => setShowPopup(ad._id)}
                                    className="px-3 py-1 bg-blue-500 text-white text-xs rounded"
                                >
                                    Show Popup
                                </button>
                            )}
                            {ad.type === 'INTERSTITIAL' && (
                                <button
                                    onClick={() => setShowInterstitial(ad._id)}
                                    className="px-3 py-1 bg-purple-500 text-white text-xs rounded"
                                >
                                    Show Full Screen
                                </button>
                            )}
                            <div className={`px-2 py-1 rounded text-xs ${ad.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {ad.isActive ? 'Active' : 'Inactive'}
                            </div>
                        </div>
                    </div>

                    {ad.description && (
                        <p className="text-sm text-gray-600 mb-2">{ad.description}</p>
                    )}

                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Impressions: {ad.analytics?.impressions || 0}</span>
                        <span>Clicks: {ad.analytics?.clicks || 0}</span>
                        <span>CTR: {ad.analytics?.ctr || 0}%</span>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <div className="text-gray-600">Loading ads preview...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center text-red-600">
                    <div className="text-xl mb-2">Error</div>
                    <div>{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-2xl font-bold text-gray-900">Ads Preview</h1>
                    <p className="text-gray-600 mt-1">Preview how your ads will look on mobile devices</p>
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
                    <div className="flex flex-wrap gap-2">
                        {['all', 'BANNER', 'POPUP', 'INTERSTITIAL', 'NATIVE', 'VIDEO'].map((type) => (
                            <button
                                key={type}
                                onClick={() => {
                                    setSelectedType(type);
                                    setCurrentPage(1);
                                }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedType === type
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 border hover:bg-gray-50'
                                    }`}
                            >
                                {type === 'all' ? 'All Types' : type}
                            </button>
                        ))}
                    </div>

                    <div className="text-sm text-gray-600">
                        Total: {ads.length} ads
                    </div>
                </div>

                {/* Ads Grid */}
                {ads.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-lg">No ads found</div>
                        <div className="text-gray-500 text-sm mt-1">Try changing the filter or create a new ad</div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {ads.map((ad) => (
                                <div key={ad._id}>
                                    {renderAdPreview(ad)}
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center space-x-4 mt-8">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Previous
                                </button>

                                <div className="flex space-x-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                                        if (page > totalPages) return null;

                                        return (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-8 h-8 rounded ${currentPage === page
                                                        ? 'bg-blue-600 text-white'
                                                        : 'border hover:bg-gray-50'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Render Popup/Interstitial Overlays */}
            {ads.map(ad => (
                <React.Fragment key={`overlay-${ad._id}`}>
                    {renderPopupAd(ad)}
                    {renderInterstitialAd(ad)}
                </React.Fragment>
            ))}
        </div>
    );
};

export default PreviewAds;