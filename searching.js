// Search album on spotify
async function searchOnSptify(albumName){
    await fetch(`https://api.spotify.com/v1/search?q=album:${albumName}&type=album&include_external=audio`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            },                                      
        })
        .then((res) => res.json())
        .then(data => {
            console.log(data)}                    
        )}


// get album api url form item from discog
async function catchTheResource_url(element){
        let result =  await fetch(element.resource_url);
        result = result.json();
        console.log(result)
        
        
        // .then((res) => res.json())
        // .then( data => {
        //     console.log(data);
        //     return data;
        // })
}

// get related song in the album
async function inSongOf(element){
    
}

