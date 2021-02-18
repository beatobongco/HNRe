import React, { useState, useEffect } from "react";
import "./App.css";
import { StoryCard } from "./components/StoryCard";
import {
  apiURL,
  storiesCacheKey,
  getCachedObject,
  setCachedObject,
  handleFetchErrors,
} from "./common";

const newStoriesURL = `${apiURL}/newstories.json`;

const App = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [storyIds, setStoryIds] = useState<number[]>([]);

  useEffect(() => {
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

    fetch(newStoriesURL)
      .then(handleFetchErrors)
      .then((data) => {
        setCachedObject(storiesCacheKey, data);
        setStoryIds(data as number[]);
      })
      .catch((err) => {
        console.log("Fetching data from cache...");
        const data = getCachedObject(storiesCacheKey);
        if (data) {
          setStoryIds(data as number[]);
        }
      });
  }, []);

  return (
    <div className="App">
      <header>
        <h1>
          <span className="hn-title">HN</span>Re
        </h1>
        <p className="tagline">Hacker News Reader</p>
      </header>

      <section className="stories-container">
        {storyIds
          ? storyIds.map((id) => (
              <StoryCard key={id} storyId={id} isOnline={isOnline} />
            ))
          : null}
      </section>
    </div>
  );
};

export default App;
