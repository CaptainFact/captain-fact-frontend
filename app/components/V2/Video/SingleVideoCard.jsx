import React from 'react'
import { Link } from 'react-router'
import quote from '../../../assets/V2/quote.png'

const SingleVideo = ({ video }) => (
  <Link to={`/video/${video.id}`}>
    <div className="single-video">
      <div className="video-prev">
        <img src={video.image_url} alt="" />
      </div>
      <div className="details">
        <div className="left-col">
          <div className="title">{video.title}</div>
          <div className="quote-container">
            <div className="quote">
              <img src={quote} className="quote-img" alt="" />
              {video.quote}
              <img src={quote} className="quote-img right" alt="" />
            </div>
            <div className="quote-author">
              <img src={video.author_avatar_url} alt="" />
              {video.author_name} - {video.quote_time}
            </div>
          </div>
          <div className="featuring">
            <div> Avec : </div>
            {video.featuring.map((person, index) => {
              return <div key={`personne-${index}`}>{person}</div>
            })}
          </div>
        </div>
        <div className="right-col">
          <div className="icon starred">{video.starred}</div>
          <div className="icon commentsnb">{video.comments_number}</div>
          <div className="icon verified">{video.verified}</div>
        </div>
      </div>
    </div>
  </Link>
)

export default SingleVideo
