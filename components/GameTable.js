import Layout from './Layout';
import WhiteCardHand from './WhiteCardHand';
import { useState, useEffect } from 'react';
import ChosenCards from './ChosenCards';
import useSocket from '../lib/useSocket';
import withList from '../lib/withList'
import Player from './Player';
import DangerZone from './DangerZone';
import WinningModal from './WinningModal';
import CopyButton from './CopyButton';
import JoinForm from './JoinForm';

import styles from '../styles/GameTable.module.css'
import utilStyles from '../styles/utils.module.css'
import { BCArea } from './BCArea';

const Players = withList(Player)

const winningScore = 7

export default function GameTable({ paramsName = 'community' }) {
  const [chosenCards, setChosenCards] = useState([])
  const [players, setPlayers] = useState([])
  const [winner, setWinner] = useState(null)
  const [cardCzar, setCardCzar] = useState('Nobody')
  const [roomURL, setRoomURL] = useState(null)
  const [overrideDisableBool, setOverrideDisableBool] = useState(false)

  const socket = useSocket()

  useSocket('CHOSEN_WHITE_CARDS', (cards) => setChosenCards(cards))
  useSocket('PLAYERS', (players) => setPlayers(players))
  useSocket('NEW_ROUND', () => {
    setChosenCards([])
    setWinner(null)
  })

  useEffect(() => {
    players.forEach(player => {
      if (player.score >= winningScore) setWinner(player.name)
      if (player.czar) setCardCzar(player.name)
    })
  }, [players])

  useEffect(() => {
    setRoomURL(`${process.env.NEXT_PUBLIC_URL_BASE}tables/${paramsName}`)
  }, [paramsName])

  const currentPlayer = players.find(player => player.id === socket.id)

  return (
    <Layout>
      <section >
        <section className={utilStyles.buttonContainer}>
          <div />
          <h1 className={styles.tableName}>{paramsName === 'community' ? 'Community Game Table' : paramsName}</h1>
          <CopyButton textToCopy={roomURL} />
        </section>

        {!currentPlayer && <JoinForm paramsName={paramsName} />}

        <Players className={`${utilStyles.list} ${styles.players}`} list={players} />

        <ChosenCards chosenCards={chosenCards} czarBool={currentPlayer?.czar} players={players} />

        <BCArea cardCzarName={cardCzar} czarBool={currentPlayer?.czar} chosenCardsBool={chosenCards.length} />

        <hr className={utilStyles.line} />

        <WhiteCardHand currentPlayer={currentPlayer} overrideDisableBool={overrideDisableBool} />

        {currentPlayer && <DangerZone overrideDisableBool={overrideDisableBool} setOverrideDisableBool={setOverrideDisableBool} />}

        {winner && <WinningModal winnerName={winner} winner={currentPlayer?.name === winner} />}
      </section>
    </Layout>
  )
}

