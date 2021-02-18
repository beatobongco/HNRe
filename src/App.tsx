import React, { useState, useEffect } from "react";
import "./App.css";
import { StoryCard } from "./components/StoryCard";
import { apiURL } from "./common";

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
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          // TODO: if offline, show localstorage cached results?
          return [];
        }
      })
      .then((data) => {
        setStoryIds(data);
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
