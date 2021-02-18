import React, { useState, useEffect, useRef, useCallback } from "react";
import "./StoryCard.css";
import { fireWhenVisible } from "../Observer";
import { HNStoryItemResponse } from "../types";
import {
  parseUnixTimestamp,
  cachePrefix,
  setCachedObject,
  getCachedObject,
  handleFetchErrors,
} from "../common";
import commentImg from "../images/comment.png";

interface StoryCardProps {
  apiURL: string;
  storyId: number;
  isOnline: boolean;
  isLastItem: boolean;
  updateMaxStory: Function;
}

const StoryCard = ({
  apiURL,
  storyId,
  isOnline,
  isLastItem,
  updateMaxStory,
}: StoryCardProps) => {
  /** An element that shows information about a Hacker News story.
   *
   * It only fetches extra data when it is visible.
   */
  const [storyData, setStoryData] = useState<HNStoryItemResponse | undefined>();
  const refContainer = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadCachedData = useCallback(() => {
    const cachedData = getCachedObject(`${cachePrefix}-${storyId}`);
    if (cachedData) {
      setStoryData(cachedData as HNStoryItemResponse);
      if (isLastItem) {
        updateMaxStory();
      }
    }
  }, [storyId, isLastItem, updateMaxStory]);

  useEffect(() => {
    if (refContainer && refContainer.current) {
      fireWhenVisible(refContainer.current, storyId.toString(), () => {
        setIsVisible(true);
      });
    }
  }, [refContainer, storyId]);

  // TODO: break this Effect into smaller pieces
  useEffect(() => {
    let isMounted = true;
    if (isVisible && !isLoaded) {
      if (isOnline) {
        // if isOnline, always try to load the story so we can get updates on story data (like score)
        fetch(`${apiURL}/item/${storyId}.json`)
          .then(handleFetchErrors)
          .then((data) => {
            setCachedObject(`${cachePrefix}-${storyId}`, data);
            if (isMounted) {
              setStoryData(data);
              setIsLoaded(true);
              if (isLastItem) {
                updateMaxStory();
              }
            }
          })
          .catch((err) => {
            // if the fetch request fails, try loading cached data but DON'T set isLoaded to true,
            // since we want to update story data when are next online
            loadCachedData();
          });
      } else {
        loadCachedData();
      }
    }
    return () => {
      isMounted = false;
    };
  }, [
    apiURL,
    storyId,
    isVisible,
    isLoaded,
    isOnline,
    loadCachedData,
    isLastItem,
    updateMaxStory,
  ]);

  if (isVisible && storyData) {
    const { title, time, score, by, descendants } = storyData;
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
          <span>{score} points | </span>
          <a className="comment-url" href={commentURL}>
            {descendants}
            <img
              className="comment-img"
              width="18"
              height="18"
              src={commentImg}
              alt="view comments"
            />
          </a>{" "}
          <span>
            by{" "}
            <a
              className="author"
              href={`https://news.ycombinator.com/user?id=${by}`}
            >
              {by}
            </a>
          </span>{" "}
          <span>on {parsedDate}</span>
        </small>
      </article>
    );
  }
  return (
    <div
      id={storyId.toString()}
      ref={refContainer}
      className="space-taker"
    ></div>
  );
};

export default StoryCard;
