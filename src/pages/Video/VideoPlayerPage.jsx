// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import axios from 'axios';
// import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Download, RefreshCw } from 'lucide-react';
// import { base_url } from '../../../utils/base_url';

// const VideoPlayerPage = () => {
//     const { videoId } = useParams();
//     const [video, setVideo] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [progress, setProgress] = useState(0);
//     const [duration, setDuration] = useState(0);
//     const [volume, setVolume] = useState(1);
//     const [isMuted, setIsMuted] = useState(false);
//     const [isFullscreen, setIsFullscreen] = useState(false);
//     const [showControls, setShowControls] = useState(true);
//     const [bufferingState, setBufferingState] = useState(false);
//     const [quality, setQuality] = useState('auto');
//     const [debugMode, setDebugMode] = useState(false);
//     const [chunkStats, setChunkStats] = useState([]);

//     const videoRef = useRef(null);
//     const playerRef = useRef(null);
//     const controlsTimeoutRef = useRef(null);

//     // Fetch video data
//     useEffect(() => {
//         const fetchVideo = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(`${base_url}/api/videos/${videoId}`);
//                 setVideo(response.data);
//             } catch (err) {
//                 console.error('Error fetching video:', err);
//                 setError('Failed to load video');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchVideo();

//         // Set up event listener for fullscreen changes
//         document.addEventListener('fullscreenchange', handleFullscreenChange);

//         return () => {
//             document.removeEventListener('fullscreenchange', handleFullscreenChange);
//             if (controlsTimeoutRef.current) {
//                 clearTimeout(controlsTimeoutRef.current);
//             }
//         };
//     }, [videoId]);

//     // Set up video event listeners when video element is available
//     useEffect(() => {
//         const videoElement = videoRef.current;
//         if (!videoElement) return;

//         const onTimeUpdate = () => {
//             const currentProgress = (videoElement.currentTime / videoElement.duration) * 100;
//             setProgress(currentProgress);
//         };

//         const onDurationChange = () => {
//             setDuration(videoElement.duration);
//         };

//         const onPlay = () => {
//             setIsPlaying(true);
//         };

//         const onPause = () => {
//             setIsPlaying(false);
//         };

//         const onWaiting = () => {
//             setBufferingState(true);
//         };

//         const onPlaying = () => {
//             setBufferingState(false);
//         };

//         const onProgress = () => {
//             if (debugMode && videoElement.buffered.length > 0) {
//                 const bufferedRanges = [];
//                 for (let i = 0; i < videoElement.buffered.length; i++) {
//                     bufferedRanges.push({
//                         start: videoElement.buffered.start(i),
//                         end: videoElement.buffered.end(i),
//                     });
//                 }
//                 setChunkStats(bufferedRanges);
//             }
//         };

//         videoElement.addEventListener('timeupdate', onTimeUpdate);
//         videoElement.addEventListener('durationchange', onDurationChange);
//         videoElement.addEventListener('play', onPlay);
//         videoElement.addEventListener('pause', onPause);
//         videoElement.addEventListener('waiting', onWaiting);
//         videoElement.addEventListener('playing', onPlaying);
//         videoElement.addEventListener('progress', onProgress);

//         return () => {
//             videoElement.removeEventListener('timeupdate', onTimeUpdate);
//             videoElement.removeEventListener('durationchange', onDurationChange);
//             videoElement.removeEventListener('play', onPlay);
//             videoElement.removeEventListener('pause', onPause);
//             videoElement.removeEventListener('waiting', onWaiting);
//             videoElement.removeEventListener('playing', onPlaying);
//             videoElement.removeEventListener('progress', onProgress);
//         };
//     }, [videoRef.current, debugMode]);

//     // Track video progress and update server
//     useEffect(() => {
//         let progressInterval;

//         if (isPlaying && videoRef.current) {
//             progressInterval = setInterval(() => {
//                 // Update progress on server every 10 seconds
//                 if (videoRef.current.currentTime > 0 && videoRef.current.currentTime % 10 < 0.5) {
//                     updateVideoProgress();
//                 }
//             }, 500);
//         }

//         return () => {
//             if (progressInterval) {
//                 clearInterval(progressInterval);
//             }
//         };
//     }, [isPlaying, videoId]);

//     const updateVideoProgress = async () => {
//         try {
//             await axios.post(`${base_url}/api/videos/${videoId}/progress`, {
//                 progress: videoRef.current.currentTime,
//             });
//         } catch (err) {
//             console.error('Error updating video progress:', err);
//         }
//     };

//     const handlePlayPause = () => {
//         if (!videoRef.current) return;

//         if (isPlaying) {
//             videoRef.current.pause();
//         } else {
//             videoRef.current.play();
//         }
//     };

//     const handleSeek = (e) => {
//         if (!videoRef.current || !duration) return;

//         const seekTime = (e.nativeEvent.offsetX / e.target.clientWidth) * duration;
//         videoRef.current.currentTime = seekTime;
//     };

//     const handleVolumeChange = (e) => {
//         if (!videoRef.current) return;

//         const newVolume = parseFloat(e.target.value);
//         setVolume(newVolume);
//         videoRef.current.volume = newVolume;
//         setIsMuted(newVolume === 0);
//     };

//     const toggleMute = () => {
//         if (!videoRef.current) return;

//         if (isMuted) {
//             videoRef.current.volume = volume > 0 ? volume : 1;
//             setIsMuted(false);
//         } else {
//             videoRef.current.volume = 0;
//             setIsMuted(true);
//         }
//     };

//     const toggleFullscreen = () => {
//         if (!playerRef.current) return;

//         if (!document.fullscreenElement) {
//             playerRef.current.requestFullscreen().catch(err => {
//                 console.error('Error attempting to enable fullscreen:', err);
//             });
//         } else {
//             document.exitFullscreen();
//         }
//     };

//     const handleFullscreenChange = () => {
//         setIsFullscreen(!!document.fullscreenElement);
//     };

//     const handleQualityChange = (e) => {
//         setQuality(e.target.value);
//         // In a real implementation, this would switch video sources
//         // For this demo, we'll just show a simulated quality change
//         if (videoRef.current) {
//             const currentTime = videoRef.current.currentTime;
//             const wasPlaying = !videoRef.current.paused;

//             // Simulate quality change
//             setTimeout(() => {
//                 if (videoRef.current) {
//                     videoRef.current.currentTime = currentTime;
//                     if (wasPlaying) {
//                         videoRef.current.play();
//                     }
//                 }
//             }, 500);
//         }
//     };

//     const toggleDebugMode = () => {
//         setDebugMode(!debugMode);
//     };

//     const showPlayerControls = () => {
//         setShowControls(true);

//         // Clear any existing timeout
//         if (controlsTimeoutRef.current) {
//             clearTimeout(controlsTimeoutRef.current);
//         }

//         // Hide controls after 3 seconds of inactivity
//         controlsTimeoutRef.current = setTimeout(() => {
//             if (isPlaying) {
//                 setShowControls(false);
//             }
//         }, 3000);
//     };

//     const formatTime = (timeInSeconds) => {
//         if (!timeInSeconds) return '00:00';

//         const minutes = Math.floor(timeInSeconds / 60);
//         const seconds = Math.floor(timeInSeconds % 60);

//         return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen flex justify-center items-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//         );
//     }

//     if (error || !video) {
//         return (
//             <div className="container mx-auto px-4 py-16">
//                 <div className="text-center">
//                     <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Video</h2>
//                     <p className="text-gray-600 mb-6">{error || 'Video not found'}</p>
//                     <Link
//                         to="/videos"
//                         className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
//                     >
//                         <ArrowLeft className="h-4 w-4 mr-2" />
//                         Back to Gallery
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <div className="mb-6">
//                 <Link
//                     to="/videos"
//                     className="inline-flex items-center text-blue-600 hover:text-blue-800 transition duration-150"
//                 >
//                     <ArrowLeft className="h-4 w-4 mr-1" />
//                     Back to Gallery
//                 </Link>
//             </div>

//             <div
//                 ref={playerRef}
//                 className="relative bg-black rounded-lg overflow-hidden"
//                 onMouseMove={showPlayerControls}
//                 onMouseLeave={() => isPlaying && setShowControls(false)}
//             >
//                 {/* Video Player */}
//                 <video
//                     ref={videoRef}
//                     src={`/api/videos/${videoId}/stream?quality=${quality}`}
//                     className="w-full aspect-video"
//                     poster={video.thumbnailUrl}
//                     onClick={handlePlayPause}
//                     playsInline
//                 />

//                 {/* Buffering Indicator */}
//                 {bufferingState && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
//                         <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent"></div>
//                     </div>
//                 )}

//                 {/* Debug Overlay */}
//                 {debugMode && (
//                     <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-2 rounded text-xs max-w-xs">
//                         <h4 className="font-bold mb-1">Debug Info</h4>
//                         <p>Quality: {quality}</p>
//                         <p>Current Time: {formatTime(videoRef.current?.currentTime)}</p>
//                         <p>Buffered Chunks:</p>
//                         <div className="mt-1 w-full h-4 bg-gray-700 relative">
//                             {chunkStats.map((range, index) => {
//                                 const startPercent = (range.start / duration) * 100;
//                                 const widthPercent = ((range.end - range.start) / duration) * 100;
//                                 return (
//                                     <div
//                                         key={index}
//                                         className="absolute h-full bg-green-500 opacity-70"
//                                         style={{
//                                             left: `${startPercent}%`,
//                                             width: `${widthPercent}%`
//                                         }}
//                                     ></div>
//                                 );
//                             })}
//                         </div>
//                     </div>
//                 )}

//                 {/* Video Controls */}
//                 <div
//                     className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
//                 >
//                     {/* Progress Bar */}
//                     <div
//                         className="w-full h-2 bg-gray-600 rounded-full cursor-pointer mb-3"
//                         onClick={handleSeek}
//                     >
//                         <div
//                             className="h-full bg-blue-500 rounded-full"
//                             style={{ width: `${progress}%` }}
//                         ></div>
//                     </div>

//                     <div className="flex justify-between items-center">
//                         <div className="flex items-center space-x-4">
//                             {/* Play/Pause */}
//                             <button onClick={handlePlayPause} className="text-white hover:text-blue-400 transition">
//                                 {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
//                             </button>

//                             {/* Time Display */}
//                             <div className="text-white text-sm">
//                                 {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
//                             </div>

//                             {/* Volume Control */}
//                             <div className="flex items-center space-x-2">
//                                 <button onClick={toggleMute} className="text-white hover:text-blue-400 transition">
//                                     {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
//                                 </button>
//                                 <input
//                                     type="range"
//                                     min="0"
//                                     max="1"
//                                     step="0.1"
//                                     value={isMuted ? 0 : volume}
//                                     onChange={handleVolumeChange}
//                                     className="w-20 accent-blue-500"
//                                 />
//                             </div>
//                         </div>

//                         <div className="flex items-center space-x-4">
//                             {/* Quality Selector */}
//                             <select
//                                 value={quality}
//                                 onChange={handleQualityChange}
//                                 className="bg-transparent text-white text-sm border border-gray-600 rounded px-2 py-1"
//                             >
//                                 <option value="auto">Auto</option>
//                                 <option value="1080p">1080p</option>
//                                 <option value="720p">720p</option>
//                                 <option value="480p">480p</option>
//                                 <option value="360p">360p</option>
//                             </select>

//                             {/* Debug Mode Toggle */}
//                             <button
//                                 onClick={toggleDebugMode}
//                                 className={`text-white hover:text-blue-400 transition ${debugMode ? 'text-blue-400' : ''}`}
//                                 title="Debug Mode"
//                             >
//                                 <RefreshCw className="h-5 w-5" />
//                             </button>

//                             {/* Download Button */}
//                             <a
//                                 href={`/api/videos/${videoId}/download`}
//                                 download
//                                 className="text-white hover:text-blue-400 transition"
//                                 title="Download Video"
//                             >
//                                 <Download className="h-5 w-5" />
//                             </a>

//                             {/* Fullscreen Toggle */}
//                             <button
//                                 onClick={toggleFullscreen}
//                                 className="text-white hover:text-blue-400 transition"
//                                 title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
//                             >
//                                 <Maximize className="h-5 w-5" />
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Video Info */}
//             <div className="mt-6">
//                 <h1 className="text-3xl font-bold text-gray-900 mb-2">{video.title}</h1>

//                 <div className="flex items-center text-sm text-gray-600 mb-4">
//                     <span>
//                         {video.entityType}{video.entityName ? `: ${video.entityName}` : ''}
//                     </span>
//                     <span className="mx-2">•</span>
//                     <span>{new Date(video.createdAt).toLocaleDateString()}</span>
//                     {video.views > 0 && (
//                         <>
//                             <span className="mx-2">•</span>
//                             <span>{video.views} views</span>
//                         </>
//                     )}
//                 </div>

//                 <div className="bg-gray-50 p-4 rounded-lg">
//                     <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
//                     <p className="text-gray-700 whitespace-pre-line">
//                         {video.description || 'No description provided.'}
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default VideoPlayerPage;


import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Download, RefreshCw } from 'lucide-react';
import { base_url } from '../../../utils/base_url';

const VideoPlayerPage = () => {
    const { videoId } = useParams();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [bufferingState, setBufferingState] = useState(false);
    const [quality, setQuality] = useState('auto');
    const [debugMode, setDebugMode] = useState(false);
    const [chunkStats, setChunkStats] = useState([]);

    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const controlsTimeoutRef = useRef(null);

    // Fetch video data
    useEffect(() => {
        const fetchVideo = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${base_url}/api/videos/${videoId}`);
                setVideo(response.data);
            } catch (err) {
                console.error('Error fetching video:', err);
                setError('Failed to load video');
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();

        // Set up event listener for fullscreen changes
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, [videoId]);

    // Set up video event listeners when video element is available
    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        const onTimeUpdate = () => {
            const currentProgress = (videoElement.currentTime / videoElement.duration) * 100;
            setProgress(currentProgress);
        };

        const onDurationChange = () => {
            setDuration(videoElement.duration);
        };

        const onPlay = () => {
            setIsPlaying(true);
        };

        const onPause = () => {
            setIsPlaying(false);
        };

        const onWaiting = () => {
            setBufferingState(true);
        };

        const onPlaying = () => {
            setBufferingState(false);
        };

        const onProgress = () => {
            if (debugMode && videoElement.buffered.length > 0) {
                const bufferedRanges = [];
                for (let i = 0; i < videoElement.buffered.length; i++) {
                    bufferedRanges.push({
                        start: videoElement.buffered.start(i),
                        end: videoElement.buffered.end(i),
                    });
                }
                setChunkStats(bufferedRanges);
            }
        };

        videoElement.addEventListener('timeupdate', onTimeUpdate);
        videoElement.addEventListener('durationchange', onDurationChange);
        videoElement.addEventListener('play', onPlay);
        videoElement.addEventListener('pause', onPause);
        videoElement.addEventListener('waiting', onWaiting);
        videoElement.addEventListener('playing', onPlaying);
        videoElement.addEventListener('progress', onProgress);

        return () => {
            videoElement.removeEventListener('timeupdate', onTimeUpdate);
            videoElement.removeEventListener('durationchange', onDurationChange);
            videoElement.removeEventListener('play', onPlay);
            videoElement.removeEventListener('pause', onPause);
            videoElement.removeEventListener('waiting', onWaiting);
            videoElement.removeEventListener('playing', onPlaying);
            videoElement.removeEventListener('progress', onProgress);
        };
    }, [videoRef.current, debugMode]);

    // Track video progress and update server
    useEffect(() => {
        let progressInterval;

        if (isPlaying && videoRef.current) {
            progressInterval = setInterval(() => {
                // Update progress on server every 10 seconds
                if (videoRef.current.currentTime > 0 && videoRef.current.currentTime % 10 < 0.5) {
                    updateVideoProgress();
                }
            }, 500);
        }

        return () => {
            if (progressInterval) {
                clearInterval(progressInterval);
            }
        };
    }, [isPlaying, videoId]);

    const updateVideoProgress = async () => {
        try {
            await axios.post(`${ base_url } /api/videos/${videoId}/progress`, {
                progress: videoRef.current.currentTime,
            });
        } catch (err) {
            console.error('Error updating video progress:', err);
        }
    };

    const handlePlayPause = () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
    };

    const handleSeek = (e) => {
        if (!videoRef.current || !duration) return;

        const seekTime = (e.nativeEvent.offsetX / e.target.clientWidth) * duration;
        videoRef.current.currentTime = seekTime;
    };

    const handleVolumeChange = (e) => {
        if (!videoRef.current) return;

        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        videoRef.current.volume = newVolume;
        setIsMuted(newVolume === 0);
    };

    const toggleMute = () => {
        if (!videoRef.current) return;

        if (isMuted) {
            videoRef.current.volume = volume > 0 ? volume : 1;
            setIsMuted(false);
        } else {
            videoRef.current.volume = 0;
            setIsMuted(true);
        }
    };

    const toggleFullscreen = () => {
        if (!playerRef.current) return;

        if (!document.fullscreenElement) {
            playerRef.current.requestFullscreen().catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    };

    const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
    };

    const handleQualityChange = (e) => {
        setQuality(e.target.value);
        // In a real implementation, this would switch video sources
        // For this demo, we'll just show a simulated quality change
        if (videoRef.current) {
            const currentTime = videoRef.current.currentTime;
            const wasPlaying = !videoRef.current.paused;

            // Simulate quality change
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.currentTime = currentTime;
                    if (wasPlaying) {
                        videoRef.current.play();
                    }
                }
            }, 500);
        }
    };

    const toggleDebugMode = () => {
        setDebugMode(!debugMode);
    };

    const showPlayerControls = () => {
        setShowControls(true);

        // Clear any existing timeout
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }

        // Hide controls after 3 seconds of inactivity
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) {
                setShowControls(false);
            }
        }, 3000);
    };

    const formatTime = (timeInSeconds) => {
        if (!timeInSeconds) return '00:00';

        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !video) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Video</h2>
                    <p className="text-gray-600 mb-6">{error || 'Video not found'}</p>
                    <Link
                        to="/videos"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Gallery
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link
                    to="/videos"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition duration-150"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Gallery
                </Link>
            </div>

            <div
                ref={playerRef}
                className="relative bg-black rounded-lg overflow-hidden"
                onMouseMove={showPlayerControls}
                onMouseLeave={() => isPlaying && setShowControls(false)}
            >
                {/* Video Player */}
                <video
                    ref={videoRef}
                    className="w-full aspect-video"
                    poster={video.thumbnailUrl}
                    onClick={handlePlayPause}
                    playsInline
                    controls={false}
                    src={video.videoUrl}
                />

                {/* Buffering Indicator */}
                {bufferingState && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent"></div>
                    </div>
                )}

                {/* Debug Overlay */}
                {debugMode && (
                    <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-2 rounded text-xs max-w-xs">
                        <h4 className="font-bold mb-1">Debug Info</h4>
                        <p>Quality: {quality}</p>
                        <p>Current Time: {formatTime(videoRef.current?.currentTime)}</p>
                        <p>Buffered Chunks:</p>
                        <div className="mt-1 w-full h-4 bg-gray-700 relative">
                            {chunkStats.map((range, index) => {
                                const startPercent = (range.start / duration) * 100;
                                const widthPercent = ((range.end - range.start) / duration) * 100;
                                return (
                                    <div
                                        key={index}
                                        className="absolute h-full bg-green-500 opacity-70"
                                        style={{
                                            left: `${startPercent}%`,
                                            width: `${widthPercent}%`
                                        }}
                                    ></div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Video Controls */}
                <div
                    className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
                >
                    {/* Progress Bar */}
                    <div
                        className="w-full h-2 bg-gray-600 rounded-full cursor-pointer mb-3"
                        onClick={handleSeek}
                    >
                        <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            {/* Play/Pause */}
                            <button onClick={handlePlayPause} className="text-white hover:text-blue-400 transition">
                                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                            </button>

                            {/* Time Display */}
                            <div className="text-white text-sm">
                                {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
                            </div>

                            {/* Volume Control */}
                            <div className="flex items-center space-x-2">
                                <button onClick={toggleMute} className="text-white hover:text-blue-400 transition">
                                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    className="w-20 accent-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Quality Selector */}
                            <select
                                value={quality}
                                onChange={handleQualityChange}
                                className="bg-transparent text-white text-sm border border-gray-600 rounded px-2 py-1"
                            >
                                <option value="auto">Auto</option>
                                <option value="1080p">1080p</option>
                                <option value="720p">720p</option>
                                <option value="480p">480p</option>
                                <option value="360p">360p</option>
                            </select>

                            {/* Debug Mode Toggle */}
                            <button
                                onClick={toggleDebugMode}
                                className={`text-white hover:text-blue-400 transition ${debugMode ? 'text-blue-400' : ''}`}
                                title="Debug Mode"
                            >
                                <RefreshCw className="h-5 w-5" />
                            </button>

                            {/* Download Button */}
                            <a
                                href={`/api/videos/${videoId}/download`}
                                download
                                className="text-white hover:text-blue-400 transition"
                                title="Download Video"
                            >
                                <Download className="h-5 w-5" />
                            </a>

                            {/* Fullscreen Toggle */}
                            <button
                                onClick={toggleFullscreen}
                                className="text-white hover:text-blue-400 transition"
                                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                            >
                                <Maximize className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Info */}
            <div className="mt-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{video.title}</h1>

                <div className="flex items-center text-sm text-gray-600 mb-4">
                    <span>
                        {video.entityType}{video.entityName ? `: ${video.entityName}` : ''}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                    {video.views > 0 && (
                        <>
                            <span className="mx-2">•</span>
                            <span>{video.views} views</span>
                        </>
                    )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                    <p className="text-gray-700 whitespace-pre-line">
                        {video.description || 'No description provided.'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayerPage;