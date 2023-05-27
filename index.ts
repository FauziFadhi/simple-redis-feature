import redis from 'ioredis';
const express = require('express')
const redisClient = new redis({
  host: 'localhost',
  password: 'chelsea24'
});

const BOARD_NAME = 'BOARD'

async function scorePlayerUpdate(userId: number, score: number) {
  await redisClient.zadd(BOARD_NAME, 'INCR', score, userId);
}

async function getBoard() {
  const cachedLeaderboard = await redisClient.zrevrange(BOARD_NAME, 0, -1, 'WITHSCORES');

  if (cachedLeaderboard.length <= 0) {
    return []
  }
    // Convert the Redis result to an array of objects
    const leaderboard: any[] = [];
    for (let i = 0; i < cachedLeaderboard.length; i += 2) {
      leaderboard.push({ playerId: cachedLeaderboard[i], score: parseInt(cachedLeaderboard[i + 1]) });
    }
    return leaderboard;
}

const app = express()
const port = 3000

app.get('/', async (req, res) => {
  const {userId, score} = req.query
  await scorePlayerUpdate(userId, score)
  res.send(await getBoard())
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})