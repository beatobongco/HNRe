import React, { useState, useEffect, useRef } from "react";
import "./StoryCard.css";
import { fireWhenVisible } from "../Observer";
import { HNStoryItemResponse } from "../types";
import { apiURL, parseUnixTimestamp } from "../common";
import commentImg from "../images/comment.png";

interface StoryCardProps {
  storyId: number;
  isOnline: boolean;
}

export const StoryCard = ({ storyId, isOnline }: StoryCardProps) => {
  /** An element that shows information about a Hacker News story.
   *
   * It only fetches extra data when it is visible.
   */
  const [storyData, setStoryData] = useState<HNStoryItemResponse | undefined>();
  const refContainer = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (refContainer && refContainer.current) {
      fireWhenVisible(refContainer.current, storyId.toString(), () => {
        setIsVisible(true);
      });
    }
  }, [refContainer, storyId]);

  useEffect(() => {
    if (isOnline && isVisible && !isLoaded) {
      // re-fire fetch event if it failed
      fetch(`${apiURL}/item/${storyId}.json`)
        .then((response) => {
          if (response.ok) {
            setIsLoaded(true);
            return response.json();
          }
          // if fetch request fails, will try to load it later
        })
        .then((data) => {
          setStoryData(data);
        });
    }
  }, [storyId, isVisible, isLoaded, isOnline]);

  if (isVisible && storyData) {
    const { title, time, score, by } = storyData;
    let { url } = storyData;
    const domain = storyData.url ? `(${url.split("/").slice(1, 3)[1]})` : null;

    let parsedDate = "";
    if (time) {
      parsedDate = parseUnixTimestamp(time);
    }
    let commentURL = `https://news.ycombinator.com/item?id=${storyId}`;
    if (!url) {
      url = commentURL;
    }
    return (
      <article ref={refContainer} className="story-card">
        <header>
          <h1 className="story-link-wrapper">
            <a className="story-link" href={url}>
              <span className="title">{title}</span>
              {domain ? <small className="domain">&nbsp;{domain}</small> : null}
            </a>
          </h1>
        </header>
        <small className="story-info">
          <span>{score} points</span>
          &nbsp;
          <span>
            by{" "}
            <a
              className="author"
              href={`https://news.ycombinator.com/user?id=${by}`}
            >
              {by}
            </a>
          </span>
          &nbsp;
          <span>on {parsedDate}</span>
          <a href={commentURL}>
            <img
              className="comment-img"
              width="16"
              height="16"
              src={commentImg}
              alt="view comments"
            />
          </a>
        </small>
      </article>
    );
  }
  return (
    <div id={storyId.toString()} ref={refContainer} className="space-taker">
      Loading...
    </div>
  );
};
