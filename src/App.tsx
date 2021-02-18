import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import StoryCard from "./components/StoryCard";
import ConnectionNotifier from "./components/ConnectionNotifier";
import {
  storiesCacheKey,
  getCachedObject,
  setCachedObject,
  handleFetchErrors,
} from "./common";

const storyIncrements = 20;

interface AppProps {
  apiURL: string;
}

enum DisplayMode {
  TOP = "topstories",
  NEW = "newstories",
}

const App = ({ apiURL }: AppProps) => {
  const [isOnline, setIsOnline] = useState(true);
  const [storyIds, setStoryIds] = useState<number[]>([]);
  const [maxStory, setMaxStory] = useState(20);
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.NEW);

  const updateMaxStory = useCallback(() => {
    setMaxStory(maxStory + storyIncrements);
  }, [maxStory]);

  useEffect(() => {
    let isMounted = true;
    // When the app is offline, it will attempt to load visible stories when it is online
    // through the passing of isOnline as a prop to StoryCard.
    window.addEventListener("offline", () => {
      console.log("HNRe is offline.");
      setIsOnline(false);
    });
    window.addEventListener("online", () => {
      console.log("HNRe is online.");
      setIsOnline(true);
    });
    const cacheKey = `${storiesCacheKey}-${displayMode}`;
    fetch(`${apiURL}/${displayMode}.json`)
      .then(handleFetchErrors)
      .then((data) => {
        setCachedObject(cacheKey, data);
        if (isMounted) setStoryIds(data as number[]);
      })
      .catch((err) => {
        console.log("Fetching data from cache...");
        const data = getCachedObject(cacheKey);
        if (data && isMounted) {
          setStoryIds(data as number[]);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [apiURL, displayMode]);
  return (
    <div className="App">
      <header>
        <h1>
          <span className="hn-title">HN</span>Re{" "}
        </h1>
        <div className="tagline">Hacker News Reader</div>
      </header>

      <nav>
        <a
          href="#"
          className={displayMode === DisplayMode.TOP ? "selected" : ""}
          onClick={() => setDisplayMode(DisplayMode.TOP)}
        >
          Top
        </a>
        {"  "}|{"  "}
        <a
          href="#"
          className={displayMode === DisplayMode.NEW ? "selected" : ""}
          onClick={() => setDisplayMode(DisplayMode.NEW)}
        >
          New
        </a>
      </nav>

      <section className="stories-container">
        {storyIds
          ? storyIds
              .slice(0, maxStory)
              .map((id, idx) => (
                <StoryCard
                  key={id}
                  apiURL={apiURL}
                  storyId={id}
                  isOnline={isOnline}
                  isLastItem={idx + 1 === maxStory}
                  updateMaxStory={updateMaxStory}
                />
              ))
          : null}
      </section>
      {storyIds.length > 0 && maxStory >= storyIds.length ? (
        <div className="the-end fadeIn">
          <a href="https://www.youtube.com/watch?v=36reZ9-3VK0">
            <small>~~~~ You've reached the end ~~~~</small>
          </a>
        </div>
      ) : null}
      <ConnectionNotifier isOnline={isOnline} />
    </div>
  );
};

export default App;
