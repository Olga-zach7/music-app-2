//Переменные
let container = document.querySelector(`.album`);
let playlist = document.querySelector(`.playlist`);
let search = new URLSearchParams(window.location.search);
let i = search.get(`i`);
let album = albums[i];


//Основной код

if(!album) {
    renderError();
} else {
    renderAlbumInfo();
    renderTracks();
    setupAudio()
}


//Функции

function renderError(){
    container.innerHTML = `Такого альбома нет.`;
}

function renderAlbumInfo() {
    container.innerHTML += `
        <div class="card mb-3">
            <div class="row">
                <div class="col-md-4">
                    <img src="${album.img}" alt="" class="img-fluid rounded-start">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${album.title}</h5>
                        <p class="card-text">${album.description}</p>
                        <p class="card-text"><small class="text-muted">Сборник выпущен в ${album.year} году</small></p>     
                    </div>
                </div>
            </div>
        </div>  
    `;
}

function renderTracks(){
    let tracks = album.tracks;

    for(let i = 0; i < tracks.length; i++){
        let track = tracks[i];
        playlist.innerHTML += `
            <li class="track list-group-item d-flex align-items-center">
                <img src="assets/off.png" alt="" height="30px" class="img-pause me-3">                
                <img src="assets/on.png" alt="" height="30px" class="img-playing me-3 d-none">

                <div>
                    <div>${track.title}</div>
                    <div class="text-secondary mb-2">${track.author}</div>
                </div>

                <div class="progress container p-0 me-2 ms-2">
                    <div class="progress-bar progress-bar-striped progress-bar-animated bg-warning" role="progressbar" aria-label="Animated striped example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 0%"></div>
                </div>

                <div class="ms-auto time">${track.time}</div>
                <audio class="audio" src="${track.src}"></audio>
            </li>
        `;
    }
}

function setupAudio() {
    // Найди коллекцию с треками
    let trackNodes = document.querySelectorAll(`.track`);
    let tracks = album.tracks;
    for (let i = 0; i < trackNodes.length; i++) { 
        // Один элемент
        let node = trackNodes[i];   
        // Тег аудио внутри этого элемента
        let audio = node.querySelector(`.audio`); 
        let track = tracks[i];
        let timeNode = node.querySelector(`.time`);
        let imgPlay = node.querySelector(`.img-playing`);
        let imgPause = node.querySelector(`.img-pause`);
        let progressNode = node.querySelector(`.progress-bar`);

        node.addEventListener(`click`, function () {
            // Если трек сейчас играет...
            if (track.isPlaying) {
                track.isPlaying = false;
                // Поставить на паузу
                audio.pause();
                imgPause.classList.remove(`d-none`);
                imgPlay.classList.add(`d-none`);

            // Если трек сейчас не играет...
            } else {
                track.isPlaying = true;
                // Включить проигрывание
                audio.play();
                imgPause.classList.add(`d-none`);
                imgPlay.classList.remove(`d-none`);
                updateProgress();

            }
        });
        function updateProgress() {

            // Нарисовать актуальное время
            let time = getTime(audio.currentTime);
            if(time != timeNode.innerHTML){
                timeNode.innerHTML = time;
                
            }
            let percent = (audio.currentTime/audio.duration*100) + `%`;
            progressNode.style.width = percent;
            // Нужно ли вызвать её ещё раз?
            if (track.isPlaying) {
                  requestAnimationFrame(updateProgress);
            }
        }
    }
}

function getTime(time) {
    let currentSeconds = Math.floor(time);
    let minutes = Math.floor(currentSeconds/60);
    let seconds = Math.floor(currentSeconds % 60);
    if(minutes < 10) {
        minutes = `0` + minutes;
    }
    if(seconds < 10) {
        seconds = `0` + seconds;
    }
    return `${minutes}:${seconds}`;
}