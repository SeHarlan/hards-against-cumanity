const roomNames = ['community']

export default function handler(req, res) {
  if (req.method === 'POST') {
    roomNames.push(req.body)
    console.log('Room Names API(post): ', roomNames)
    res.send(JSON.stringify(roomNames))
  } else {
    console.log('Room Names API(get): ', roomNames)
    res.send(JSON.stringify(roomNames))
  }
}