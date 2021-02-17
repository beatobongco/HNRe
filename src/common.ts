const apiURL = "https://hacker-news.firebaseio.com/v0"

const parseUnixTimestamp: (timestamp: number) => string = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getHours()}:${("0" + date.getMinutes()).substr(-2)}`;
}
export {apiURL, parseUnixTimestamp}