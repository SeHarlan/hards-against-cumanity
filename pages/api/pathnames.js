const roomNames = ['init']

export default function handler(req, res) {
  if (req.method === 'POST') {
    roomNames.push(req.body)
    console.log('Room Names API: ', roomNames)
    res.send(JSON.stringify(roomNames))
  } else {
    res.send(JSON.stringify(roomNames))
  }
}