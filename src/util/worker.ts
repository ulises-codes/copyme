let moves: number[] = []
let tapOrder: number[] = []

function resetGame(init?: boolean) {
  moves = init ? [generateMove()] : []
  tapOrder = []
}

function demonstrateMove(move?: number, delay: number = 0) {
  const timeout = setTimeout(() => {
    postMessage({
      action: 'demonstrate',
      payload: move,
    })
  }, delay + 1000)

  return timeout
}

function generateMove(): number {
  return Math.round(Math.random() * 3)
}

function startGame() {
  resetGame(true)

  demonstrateMove(moves[0])
  demonstrateMove(undefined, 1000)
}

function play(padPosition: number) {
  const tapOrderLength = tapOrder.push(padPosition)
  const index = tapOrderLength - 1

  if (tapOrder[index] !== moves[index]) {
    gameOver()
  } else {
    if (tapOrderLength === moves.length) {
      postMessage({ action: 'score' })

      tapOrder = []

      addMove()
    }
  }
}

function addMove(): void {
  const move = generateMove()

  moves.push(move)

  for (let i = 0; i <= moves.length; i++) {
    demonstrateMove(moves[i], i * (700 - moves.length * 20))
  }
}

function gameOver() {
  resetGame()
  postMessage({ action: 'game_over' })
}

onmessage = (
  e: MessageEvent<{
    action: 'start' | 'play' | 'get_moves'
    payload?: number
  }>
) => {
  switch (e.data.action) {
    case 'start':
      startGame()

      break

    case 'play':
      play(e.data.payload)

      break
  }
}
