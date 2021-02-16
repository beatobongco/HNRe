import React, {useState, useEffect} from 'react';
import './App.css';
import {StoryCard} from './components/StoryCard'
import {apiURL} from './util/common'

const newStoriesURL = `${apiURL}/newstories.json`

const App = () => {
  const [storyIds, setStoryIds] = useState<number[] | undefined>();

  useEffect(() => {
    fetch(newStoriesURL).then(response => { 
            if (response.ok) {
                return response.json()
            } else {
                // handle some stuff here
                return []
            }
        })
        .then(data => {
          console.log("data", data)
          setStoryIds(data)
        })
  }, [])

  return (
    <div className="App">
      <h1><span className="hn-title">HN</span>Re</h1>
      <p>Hacker News Reader</p>
      <div className="story-container">
        {storyIds ? storyIds.slice(0, 5).map(id => <StoryCard key={id} storyId={id} />) : null}
      </div>
    </div>
  );
}

export default App;
