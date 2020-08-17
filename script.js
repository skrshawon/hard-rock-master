const input = document.getElementById("input_data");
const btn_srch = document.getElementById("btn_search");
const all_results = document.getElementById("fancy_results");
const structure_result = document.getElementById("structure_of_a_result");
const single_lyrics = document.getElementById("single_lyrics");
const btn_close = document.getElementById("close-btn");

let btn_getLyrics;

function srchResults(json_data) {
  all_results.style.display = "block";

  all_results.innerHTML = "";

  let single_song = structure_result.cloneNode(true);
  structure_result.remove();

  const sz = json_data.data.length >= 10 ? 10 : json_data.data.length;
  //   console.log("sz:", sz);
  //   console.log();

  for (let index = 0; index < sz; index++) {
    const element = single_song.cloneNode(true);

    // console.log(json_data);

    const title = json_data.data[index].title;
    const album = json_data.data[index].album.title;
    const singer = json_data.data[index].artist.name;

    const html_song = element.querySelector("h3");
    const html_album_singer = element.querySelector("p");

    const html_lyricsBtn = element.querySelector(".btn_getLyrics");

    html_song.textContent = title;
    html_album_singer.textContent = `${album} by ${singer}`;

    html_lyricsBtn.setAttribute("data-title", title);
    html_lyricsBtn.setAttribute("data-singer", singer);
    // console.log(html_lyricsBtn);

    all_results.appendChild(element);

    // console.log(index);
  }

  //   btn_getLyrics = document.getElementsByClassName("btn_getLyrics");
}

// --------------------------------------------------

// srch btn clicked
btn_srch.addEventListener("click", function () {
  const srch_song = input.value.trim();

  if (srch_song === "") {
    console.log("empty");
    return;
  }

  //   console.log(srch_song);
  input.value = "";

  const url = `https://api.lyrics.ovh/suggest/${srch_song}`;

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error();
      }
    })
    .then((data) => srchResults(data))
    .catch(function () {
      console.log("No Song Found");
      alert("Sorry!! No Song Found");
    });
});

// get lyrics btn clicked
all_results.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn_getLyrics")) {

    const title = e.target.getAttribute("data-title");
    const singer = e.target.getAttribute("data-singer");

    const url = `https://api.lyrics.ovh/v1/${singer}/${title}`;

    single_lyrics.querySelector("h2").innerText = title;

    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error();
        }
      })
      .then(
        (data) => (single_lyrics.querySelector("pre").innerText = data.lyrics)
      )
      .catch(function () {
        console.log("something got messy");
        // alert("Sorry!! No Lyrics Found");
      });

    e.target.parentElement.parentElement.appendChild(single_lyrics);

    single_lyrics.style.display = "block";
  }
});

// close lyrics
btn_close.addEventListener("click", function (e) {
  e.target.parentElement.style.display = "none";
});
