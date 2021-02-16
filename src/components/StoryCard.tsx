import React, {useState, useEffect} from 'react';
import './StoryCard.css';
import {HNStoryItemResponse} from '../types/types'
import {apiURL, parseUnixTimestamp} from '../util/common'
import commentImg from '../images/comment.png'

interface StoryCardProps {
  storyId: number 
}

export const StoryCard: React.FC<StoryCardProps> = ({storyId}) => {
  const [storyData, setStoryData] = useState<HNStoryItemResponse | undefined>()
  
  useEffect(() => {
    fetch(`${apiURL}/item/${storyId}.json`).then(response => {
      if (response.ok) {
        return response.json()
      } else {
        // handle bad response gracefully here
      }
    }).then(data => {
      setStoryData(data)
    })
  }, [storyId])

  if (storyData) {
    const {title, time, score, by} = storyData
    let {url} = storyData
    const domain = storyData.url ? `(${url.split("/").slice(1,3)[1]})` : null
    
    let parsedDate = ""
    if (time) {
        parsedDate = parseUnixTimestamp(time)
    }
    let commentURL = `https://news.ycombinator.com/item?id=${storyId}`
    if (!url) {
        url = commentURL
    }
    return (
      <div className="story-card">
        <p className="story-link-wrapper">
          <a className="story-link" href={url}>
            <span className="title">{title}</span> 
            {domain ? (<small className="domain">&nbsp;{domain}</small>) : null}            
          </a>
        </p>
        <small className="story-info">
            <span>
                {score} points
            </span>
            &nbsp;
            <span>
                by <a className="author" href={`https://news.ycombinator.com/user?id=${by}`}>{by}</a>
            </span>
            &nbsp;
            <span>
                on {parsedDate}
            </span>
            <a href={commentURL}>
                <img className="comment-img" 
                    width="16"
                    height="16"
                    src={commentImg} 
                    alt="view comments"/>
            </a>         
        </small>
      </div>
    )
  }
  return <div></div>
}