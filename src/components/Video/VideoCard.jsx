import React from 'react'
import { useNavigate } from 'react-router-dom'

function VideoCard({ playlist }) {
  console.log("playlist", playlist)
const navigate = useNavigate()

  const handleVideoNavigation = (id)=>{
    navigate(`/videos/${id}`)

  }
  return (
    <div className='flex items-center gap-1 my-2'>
      {
        playlist?.map((video, index) => <div key={index} className=''>
          <img src={video?.thumbnailUrl} className='w-10 h-auto' onClick={() => handleVideoNavigation(video?._id)}/>
        </div>)
      }
    </div>
  )
}

export default VideoCard