// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const electron = require('electron')
const { ipcRenderer } = electron;
const fs = require('fs');
console.log(__dirname);
var index = 0;
ipcRenderer.send('getfiles');
htmlout = '';
musicdiv = document.querySelector('.musiccom');
ipcRenderer.on('asynchronous-reply', (event, element) =>
{
    htmlout = `
        <div id="musiccontainerno${index}" class="musiccontainer">
        
        <div class="imagecontainer">
        
        <img id="trackimgno${index}" src="data:image/png;base64,${element.common.picture[ 0 ].data}"
        alt="Cover art">
        
        </div>
        <div class="track-info">
        <p>${element.common.title}</p>
        <h5>${element.common.artist}</h5>
        <button class="trackcontrol" id="${index}" onclick="startsong(this.id)">play</button>
        <button class="trackcontrol" id="stop${index}" onclick="stopsong(this.id)">stop</button>
        </div>
        <div>
        
        </div>
        </div>
        `
    var g = document.createElement('div');
    g.id = `musiccontainerno${index}`
    g.setAttribute("class", "musiccontainer")

    g.innerHTML = htmlout
    musicdiv.appendChild(g);
    index++;
    // console.log(arg) // prints "pong"
})
ipcRenderer.send('asynchronous-message', 'ping')


ipcRenderer.on('secretmessage', function (e, data)
{
    // console.log(data);
    data.forEach((element, index) =>
    {
        // console.log(element);
        htmlout = `
        <div id="musiccontainerno${index}" class="musiccontainer">
        
        <div class="imagecontainer">
        
        <img id="trackimgno${index}" src="data:image/png;base64,${element.common.picture[ 0 ].data}"
        alt="Cover art">
        
        </div>
        <div class="track-info">
        <p>${element.common.title}</p>
        <h5>${element.common.artist}</h5>
        <button class="trackcontrol" id="${index}" onclick="startsong(this.id)">play</button>
        <button class="trackcontrol" id="stop${index}" onclick="stopsong(this.id)">stop</button>
        </div>
        <div>
        
        </div>
        </div>
        `
        var g = document.createElement('div');
        g.id = `musiccontainerno${index}`
        g.setAttribute("class", "musiccontainer")

        g.innerHTML = htmlout
        musicdiv.appendChild(g);
    });

});



function startsong (clicked)
{
    try
    {

        let mucref = document.getElementById(`musiccontainerno${clicked}`);
        var player = document.getElementById(`musicaudio`);
        document.getElementById('idtrack').innerText = clicked;



        imgref = mucref.querySelector('img');
        npimg = document.getElementById('nowplaying-img');
        npimg.src = imgref.src;

        titleref = mucref.querySelector('p');
        artistref = mucref.querySelector('h5');

        npinforef = document.getElementById('nowplayinginfo');
        npinforef.querySelector('p').innerText = titleref.innerText;
        npinforef.querySelector('h5').innerText = artistref.innerText;

        musicid = `music_playerid${clicked}`;
        document.getElementById('play-pause').innerText = "pause_circle_outline";
        player.querySelector('source').src = `/media/knnan/F/Music/${titleref.innerText}.mp3`;
        player.load();
        player.play();
    }
    catch (err)
    {
        console.log(err);
    }
}

function stopsong (clicked)
{
    document.getElementById('play-pause').innerText = "play_circle_outline";
    var player = document.getElementById(`musicaudio`);
    player.pause();

}
function changplayicon ()
{
    console.log(document.getElementById('play-pause').innerText);
    if (document.getElementById('play-pause').innerText == "play_circle_outline")
    {

        document.getElementById('play-pause').innerText = "pause_circle_outline";
        var player = document.getElementById(`musicaudio`);
        player.play();
    }
    else
    {

        document.getElementById('play-pause').innerText = "play_circle_outline";
        var player = document.getElementById(`musicaudio`);
        player.pause();
    }
}

function nextsong ()
{
    let trackid = Number(document.getElementById('idtrack').innerText);
    trackid += 1;
    trackid = String(trackid);
    document.getElementById('idtrack').innerText = trackid;
    startsong(trackid);
}
function prevsong ()
{
    trackid2 = Number(document.getElementById('idtrack').innerText);
    trackid2 -= 1;
    trackid2 = String(trackid2);
    document.getElementById('idtrack').innerText = trackid2;
    startsong(trackid2);
}


