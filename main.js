// Create an empty array on startup
let animeHistory = []
const API_BASE = "https://api.jikan.moe/v3/"
const API_ANIME = API_BASE + "anime/"
const HISTORY_STORAGE_KEY = 'HISTORY_KEY'

/**
 * generate anime tag from a Javascript Object that containt the anime information
 */
function buildAnimeMarkup(anime) {
    return `<div class="card anime_item">
        <img class='card-img-top anime_image' src=${anime.image_url} />
        <h5 class='card-title anime_name'>${anime.title}</h2>
        <p class='card-text anime_premiered'>${anime.premiered}</p></div>`
}

/**
 * add an anime to the history and updates display
 */
function updateHistory(anime) {
    animeHistory.push(anime)
    //Save the array in the local storage
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(animeHistory))
    //update display
    addAnimeToHistoryTag(anime)
}

/**
 * Update the DOM
 */
function addAnimeToHistoryTag(anime) {
    let history = document.querySelector('#history')
    if (history === null) {
        return
    }

    history.innerHTML = buildAnimeMarkup(anime) + history.innerHTML
}

/**
 * loadAnAnime from the internet and place it on a target element
 */
function onOkButtonClickAsync() {
    let targetElementClass = '.main_anime'
    let animeId = document.querySelector("#input_animeId").value

    fetch(API_ANIME + animeId)
        .then(response => response.json())
        .then(anime => {
            document.querySelector(targetElementClass).innerHTML = buildAnimeMarkup(anime)

            updateHistory(anime)
        })
        .catch(err => console.error(`error ${err}`));
}

/**
 * Install the service worker
 */
async function installServiceWorkerAsync() {
    if ('serviceWorker' in navigator) {
        try {
            let serviceWorker = await navigator.serviceWorker.register('/sw.js')
            console.log(`Service worker registered ${serviceWorker}`)
        } catch (err) {
            console.error(`Failed to register service worker: ${err}`)
        }
    }
}

/**
 * The history is serrialized as a JSON array. We use JSON.parse to convert is to a Javascript array
 */
function getLocalHistory() {
    return JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY))
}

async function onLoadAsync() {
    //load the history from cache
    let history = getLocalHistory()
    if (history !== null) {
        //set the animeHistory array and update the display
        animeHistory = history
        animeHistory.forEach(anime => addAnimeToHistoryTag(anime))
    }

    installServiceWorkerAsync()
}

window.document.onload = onLoadAsync()