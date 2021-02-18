import React, { useState, useEffect } from "react";
import "./App.css";
import { StoryCard } from "./components/StoryCard";
import { apiURL } from "./common";

const newStoriesURL = `${apiURL}/newstories.json`;

const App = () => {
  const [storyIds, setStoryIds] = useState<number[]>([]);

  useEffect(() => {
    fetch(newStoriesURL)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          // TODO: gracefully handle when API is unreachable
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
          ? storyIds.map((id) => <StoryCard key={id} storyId={id} />)
          : null}
      </section>
    </div>
  );
};

export default App;
