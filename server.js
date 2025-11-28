const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Use CORS for handling cross-origin requests from the frontend
app.use(cors());

// TODO: Add your Riot API key here
const RIOT_API_KEY = "RGAPI-7ddf0f24-e6af-4e9b-bdfe-ccf85c2c8c74";

// Helper function to fetch raw match data from Riot's API
async function getMatchData(matchId) {
  try {
    const response = await axios.get('https://api.riotgames.com/lol/match/v5/matches/${matchId}', {
      headers: { "X-Riot-Token": RIOT_API_KEY }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching match data:", error);
    throw new Error("Failed to fetch match data");
  }
}

// Parse raw data and extract relevant player stats
function parseMatchData(rawData, playerName) {
  const playerData = rawData.info.participants.find(player => player.summonerName === playerName);

  if (!playerData) {
    throw new Error('Player with summoner name "${playerName}" not found in this match');
  }

  return {
    summonerName: playerData.summonerName,
    championName: playerData.championName,
    gold: playerData.goldEarned,
    kills: playerData.kills,
    deaths: playerData.deaths,
    assists: playerData.assists,
    cs: playerData.totalMinionsKilled + playerData.neutralMinionsKilled,
    damageDealtToChampions: playerData.totalDamageDealtToChampions,
    damageTaken: playerData.totalDamageTaken
  };
}

// Endpoint to fetch and parse match data for a specific player
app.get("/match/:matchId/:playerName", async (req, res) => {
  try {
    const { matchId, playerName } = req.params;

    // Fetch and parse match data
    const rawData = await getMatchData(matchId);
    const playerStats = parseMatchData(rawData, playerName);

    res.json(playerStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log('Server is running on http://localhost:${PORT}');
});
