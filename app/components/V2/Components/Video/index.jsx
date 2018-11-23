import React from 'react'
import { Link } from 'react-router'
import quote from '../../../assets/V2/quote.png'
import star from '../../../assets/V2/star.png'
import verified from '../../../assets/V2/verified.png'

const SingleVideo = ({ video }) => (
  <div className="single-video">
    <Link to={`/video/${video.id}`}>
      <div className="video-prev">
        <img src={video.image_url} alt="" />
      </div>
    </Link>

    <div className="details">
      <div className="left-col">
        <div className="title">
          <Link to={`/video/${video.id}`}>{video.title}</Link>
        </div>
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
        <div className="icon starred tooltip">
          <img
            src={star}
            alt=""
            style={{ opacity: video.starred ? '1' : '0.2' }}
          />
          <span className="tooltiptext">Favoris</span>
        </div>

        <div className="icon commentsnb tooltip">
          {video.comments_number}
          <span className="tooltiptext">Commentaires</span>
        </div>

        {video.verified && (
          <div className="icon verified tooltip">
            <img src={verified} alt="" />
            <span className="tooltiptext">Vérifiée</span>
          </div>
        )}
      </div>
    </div>
  </div>
)

export default SingleVideo