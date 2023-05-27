import redis from 'ioredis';
const express = require('express')

var bodyParser = require('body-parser')
const redisClient = new redis({
  host: 'localhost',
  password: 'chelsea24'
});

const BOARD_NAME = 'BOARD'

async function scorePlayerUpdate(userId: number, score: number) {
  await redisClient.zadd(BOARD_NAME, 'INCR', score, userId);
}

type GEO = {longitude: number, latitude: number, name: string};
async function getRange([point1, point2]: [GEO, GEO]) {
  await redisClient.geoadd('locations', point1.longitude, point1.latitude, point1.name);
  await redisClient.geoadd('locations', point2.longitude, point2.latitude, point2.name);

  return redisClient.geodist('locations', point1.name, point2.name, "km" as any)
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

// parse application/json
app.use(bodyParser.json())

app.get('/', async (req, res) => {
  const {userId, score} = req.query
  await scorePlayerUpdate(userId, score)
  res.send(await getBoard())
})

app.post('/range', async (req, res) => {
  console.log(req.body);
  const { point1, point2 } = req.body

  res.send(await getRange([point1, point2]))

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})