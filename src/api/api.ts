// import { HNStory } from '../types/types'

const apiURL = "https://hacker-news.firebaseio.com/v0"
const newStoriesURL = `${apiURL}/newstories.json`

/**
 * TODO's
 * 1. Get the IDs
 * 2. Load the UI incrementally
 */
// async function getHNStories(): Promise<Array<number>> {
//     /** Gets the IDs of the 500 latest HN stories*/
//     let stories: number[] = [];
//     fetch(newStoriesURL).then(response => { 
//             console.log(response)
//             if (response.ok) {
//                 return response.json()
//             } else {
//                 // handle some stuff here
//                 return []
//             }
//         })
//         .then(data => {
//             console.log(data)
//             stories = data
//         })
//     return stories
// }

// export {getHNStories}
export {}