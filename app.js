const redirctUrl = 'http://127.0.0.1:5500/index.html';
const clientId = '';
const clientSecret = '';

const authorize = 'https://accounts.spotify.com/authorize';
const token = 'https://accounts.spotify.com/api/token';



function requestAuthoatization(){
    //var state = generateRandomString(16);
    var scope = 'user-modify-playback-state user-read-playback-state user-read-currently-playing user-follow-modify user-follow-read user-read-recently-played user-read-playback-position user-top-read playlist-read-collaborative playlist-modify-public playlist-read-private playlist-modify-private app-remote-control user-read-email user-read-private user-library-modify user-library-read'
    let url = authorize;
    localStorage.setItem("clientId", clientId);
    localStorage.setItem("clientSecret",clientSecret);

    url += `?client_id=${clientId}`;
    url += `&response_type=code` ;
    url += `&scope:${scope}`;
    url += `&redirect_uri=${encodeURI('http://127.0.0.1:5500/index.html')}`
    console.log(url)

    window.location.href = url;
        
}

function onPageLoad(){
    if( window.location.search.length > 0 ){
        handleRedirect();
    }
}

function handleRedirect(){
    let code = getCode();
    fetchAccessToken(code);
}

function getCode(){
    let code = null;
    const queryString = window.location.search;
    if( queryString.length > 0 ){
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code')
    }
    return code;
}

function fetchAccessToken(code){
    let body = 'grant_type=authorization_code';
    body += '&code=' + code;
    body += '&redirect_uri=' + encodeURI(redirctUrl);
    body += '&client_id=' + clientId;
    body += '&client_secret=' + clientSecret;
    //console.log(body);
    callAuthorizationApi(body);
}

function callAuthorizationApi(body){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', token, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(clientId + ':' + clientSecret));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}

function handleAuthorizationResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        //console.log(data);
        var data = JSON.parse(this.responseText);
        if ( data.access_token != undefined ){
            access_token = data.access_token;
            localStorage.setItem("access_token", access_token);
        }
        if ( data.refresh_token  != undefined ){
            refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token);
        }
        //onPageLoad();
    }
    else {
        console.log(this.responseText);
        //alert(this.responseText);
    }
}




function searchArtist(){
    // init the div
    document.getElementById('release').innerHTML = '';
    // init the var
    let role = document.getElementById('role').value;
    let i = 0


    let artist = document.getElementById('artistname').value
    //console.log(artist);
    fetch(`https://api.discogs.com/database/search?q=${artist}&key=cTQeAwaSrNlcvAhAnpNd&secret=OGKqDOjvYzeviOdBWIdDLIHaMzxowjUY`)
        .then((res) => res.json())

        
        .then((data) => {     
            document.getElementById('artistName').innerHTML = data.results[0].title;
            document.getElementById('artistPicture').src = data.results[0].cover_image;
            console.log(data.results[0].resource_url)
            return fetch(data.results[0].resource_url + '/releases?page=1&per_page=100000').then((res) => res.json())
        })

        // search for releases
        .then( (data) => {
            
            
            data.releases.forEach((e) => {
                if(e.role == role){
                    e.year.sort(function(a, b) {
                        return a - b;
                    });
                      
                    console.log(e.artist +  '-' + e.title + '/' + e.year)
                }
            })

            data.releases.slice(-5).forEach( async (element) => {
                if(element.role == role){
                    //console.log(element);
                    // Insert the name of the release
                    const album = document.createElement('div');
                    const albumName = element.title + ' - ' +element.artist;
                    album.innerHTML = albumName;
                    document.getElementById('release').appendChild(album);

                    // Get all the song related by him/her
                    let result =  await fetch(element.resource_url);
                    result = await result.json();
                    //console.log(result)
            
                    
                    //let albumInfo =  await catchTheResource_url(element);
                    //console.log(albumInfo);


                    
                    //search on spotify
                    //await searchOnSptify(albumName);
                    }})
            });
}
        


//
// <iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/2Kp3IIDOY0LgATlHaXoO4O?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
// function callapitest(){
//     callApi( "GET", "https://api.spotify.com/v1/me/player/devices", null );}


function callApi(method, url, body, callback){
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.send(body);
    xhr.onload = callback;
}


