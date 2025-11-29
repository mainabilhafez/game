// server.js

const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

// ---------- SETUP ----------
//app.use(express.static(path.join(__dirname, "public"))); // serves index.html

app.use(express.static(path.join(__dirname, 'www')));

const RIOT_API_KEY = "RGAPI-beed8a47-b20d-41a1-8b49-f34b2cb638d0";

// Riot regional routing (NA, EUW, etc.)
const regionRoutes = {
  na1: "americas",
  euw1: "europe",
  eun1: "europe",
  kr: "asia",
  jp1: "asia",
  br1: "americas",
  la1: "americas",
  la2: "americas",
  oce: "sea"
};

console.log("API KEY LOADED:", process.env.RIOT_API_KEY);

// ---------- API ENDPOINT ----------
app.get("/match/:matchId/player", async (req, res) => {
  const {  matchId } = req.params;

  if (!regionRoutes[region]) {
    return res.status(400).json({ error: "Invalid region code." });
  }

  const matchURL = `https://na1.api.riotgames.com/lol/match/v5/matches/${matchId}`;

  try {
    const response = await axios.get(matchURL, {
      headers: { "X-Riot-Token": RIOT_API_KEY }
    });

    const match = response.data;
    const players = match.info.participants;

    // Find the player
    const player = players.find(
      (p) => p.summonerName.toLowerCase() === playerName.toLowerCase()
    );

    if (!player) {
      return res.status(404).json({ error: "Player not found in match." });
    }

    // Return the required fields
    const stats = {
      summonerName: player.summonerName,
      championName: player.championName,
      gold: player.goldEarned,
      kills: player.kills,
      deaths: player.deaths,
      assists: player.assists,
      cs: player.totalMinionsKilled + player.neutralMinionsKilled,
      damageDealtToChampions: player.totalDamageDealtToChampions,
      damageTaken: player.totalDamageTaken
    };

    res.json(stats);
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: "Failed to fetch match data." });
  }
});

// ---------- START SERVER ----------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


/// the Match ID retrieve data on CMD
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const API_KEY = "RGAPI-beed8a47-b20d-41a1-8b49-f34b2cb638d0"; // replace this
const REGION = "americas";            // use americas/europe/asia/sea
const MATCH_ID = "NA1_4993415931";    // put any match id here


async function getMatchDetails(matchId) {
  const url = `https://${REGION}.api.riotgames.com/lol/match/v5/matches/${matchId}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "X-Riot-Token": API_KEY,
      },
    });

    console.log("Match Found!\n");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
}

// Run test
getMatchDetails(MATCH_ID);