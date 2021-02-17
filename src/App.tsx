import React, {useState, useEffect} from 'react';
import './App.css';
import {StoryCard} from './components/StoryCard'
import {apiURL} from './common'

const newStoriesURL = `${apiURL}/newstories.json`

const App = () => {
  const [storyIds, setStoryIds] = useState<number[]>([]);

  useEffect(() => {    
    fetch(newStoriesURL).then(response => { 
            if (response.ok) {
                return response.json()
            } else {
                // TODO: gracefully handle when API is unreachable
                return []
            }
        })
        .then(data => {
          setStoryIds(data)
        })
  }, [])

    return (
      <div className="App">
        <h1><span className="hn-title">HN</span>Re</h1>
        <p>Hacker News Reader</p>
        <div className="story-container">
          {storyIds ? storyIds.map(id => <StoryCard key={id} storyId={id} />) : null}
        </div>
      </div>
    );
}

export default App;
