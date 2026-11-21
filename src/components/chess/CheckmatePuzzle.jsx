import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Chess } from 'chess.js'
import { ArrowRight, ArrowUpRight, Lightbulb, RotateCcw, Volume2, VolumeX, X } from 'lucide-react'
import './checkmate-puzzle.css'

// Positions and main lines are from the CC0 Lichess puzzle database.
// Each line is the solver's move, the best defense, and so on through mate.
const puzzles = [
  { id: '3eKE8', level: 'Advanced', solverColor: 'black', fen: 'Q7/p3qB2/2pk1p2/3p4/1Pp2nP1/P3PK2/3B3P/1R6 b - - 1 27', solution: ['e7e4','f3g3','e4g2','g3h4','g2h2'], hint: 'The queen has a forcing check. Keep the king exposed and finish with a capture on h2.' },
  { id: 'My2wA', level: 'Intermediate', solverColor: 'white', fen: '1r1r4/1p5k/2nq2p1/P4BR1/8/1Q2pp2/1PP5/1K6 w - - 0 43', solution: ['b3f7','h7h6','g5g6','d6g6','f7g6'], hint: 'Start with a queen check. The rook joins the attack with tempo.' },
  { id: 'Qirjd', level: 'Intermediate', solverColor: 'white', fen: '8/6p1/3Q3p/5k2/4p3/4q2P/6PK/8 w - - 7 47', solution: ['g2g4','f5g5','d6e5','g5g6','e5f5'], hint: 'A quiet pawn is the key to opening the king’s path for a queen check.' },
  { id: 'ycc0e', level: 'Beginner', solverColor: 'white', fen: '2r3k1/p4ppp/4bn2/2Q5/8/2PR4/qP6/2K2R2 w - - 1 32', solution: ['c5c8','e6c8','d3d8','f6e8','d8e8'], hint: 'Trade the queen for the bishop, then use both rooks to force mate.' },
  { id: 'AAEY7', level: 'Beginner', solverColor: 'black', fen: 'r3kr2/pp2b3/5qpp/8/1P2Q3/2P5/P4PPP/RN2R1K1 b q - 0 24', solution: ['f6f2','g1h1','f2f1','e1f1','f8f1'], hint: 'The queen invasion forces the king and rook into a mating net.' },
  { id: '2rLtJ', level: 'Beginner', solverColor: 'black', fen: '5r1k/6pp/1p1Q4/4pq2/1P6/4P3/P5PP/R5K1 b - - 0 28', solution: ['f5f2','g1h1','f2f1','a1f1','f8f1'], hint: 'Two forcing queen checks pull the rook away from its defense.' },
  { id: 'r00X0', level: 'Intermediate', solverColor: 'white', fen: '1r1r3k/pb3Qpp/2q5/2p1p3/8/4P3/P5PP/3R1RK1 w - - 2 26', solution: ['d1d8','b8d8','f7f8','d8f8','f1f8'], hint: 'A rook sacrifice opens the back rank for a decisive queen check.' },
  { id: 'LBKkM', level: 'Advanced', solverColor: 'white', fen: '7k/R5p1/p4p1p/1p3K2/r5P1/7P/6P1/8 w - - 2 37', solution: ['f5g6','a4d4','a7a8','d4d8','a8d8'], hint: 'Walk the king forward first. The rook promotion threat creates the final net.' },
]

const files = 'abcdefgh'
const pieceSymbols = {
  w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
  b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' },
}
const pieceNames = { k: 'king', q: 'queen', r: 'rook', b: 'bishop', n: 'knight', p: 'pawn' }
const levels = ['Random', 'Beginner', 'Intermediate', 'Advanced']
const colorName = (color) => color === 'w' ? 'white' : 'black'
const displayPieces = (game) => Object.fromEntries(game.board().flatMap((row) => row.filter(Boolean).map((piece) => [piece.square, `${piece.color}${piece.type.toUpperCase()}`])))
const choosePuzzle = (previousId, level) => {
  const pool = level === 'Random' ? puzzles : puzzles.filter((puzzle) => puzzle.level === level)
  const choices = pool.filter((puzzle) => puzzle.id !== previousId)
  const available = choices.length ? choices : pool
  return available[Math.floor(Math.random() * available.length)]
}
const moveFromUci = (uci) => ({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] })

function CheckmatePuzzle({ onClose }) {
  const [level, setLevel] = useState('Random')
  const [puzzle, setPuzzle] = useState(() => choosePuzzle(null, 'Random'))
  const gameRef = useRef(null)
  if (!gameRef.current) gameRef.current = new Chess(puzzle.fen)
  const [pieces, setPieces] = useState(() => displayPieces(gameRef.current))
  const [started, setStarted] = useState(false)
  const [ply, setPly] = useState(0)
  const [selected, setSelected] = useState(null)
  const [focusedSquare, setFocusedSquare] = useState('a8')
  const [status, setStatus] = useState('Find the forcing line. Black will defend after each move.')
  const [solved, setSolved] = useState(false)
  const [failed, setFailed] = useState(false)
  const [thinking, setThinking] = useState(false)
  const [movesLeft, setMovesLeft] = useState(3)
  const [hintOpen, setHintOpen] = useState(false)
  const [soundOn, setSoundOn] = useState(true)
  const screenRef = useRef(null)
  const squareRefs = useRef({})
  const audioContextRef = useRef(null)
  const replyTimerRef = useRef(null)
  const [lastMove, setLastMove] = useState(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  const solverColor = puzzle.solverColor
  const isSolverTurn = gameRef.current.turn() === solverColor
  const destinations = selected ? gameRef.current.moves({ square: selected, verbose: true }).map((move) => move.to) : []

  useEffect(() => {
    const oldBodyOverflow = document.body.style.overflow
    const oldHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    screenRef.current?.focus()
    const onEscape = (event) => { if (event.key === 'Escape') onCloseRef.current() }
    window.addEventListener('keydown', onEscape)
    return () => {
      document.body.style.overflow = oldBodyOverflow
      document.documentElement.style.overflow = oldHtmlOverflow
      window.removeEventListener('keydown', onEscape)
    }
  }, [])

  useEffect(() => () => {
    if (replyTimerRef.current) window.clearTimeout(replyTimerRef.current)
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') void audioContextRef.current.close()
  }, [])

  const playSound = (kind) => {
    if (!soundOn || typeof window === 'undefined') return
    const AudioContextType = window.AudioContext || window.webkitAudioContext
    if (!AudioContextType) return
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') audioContextRef.current = new AudioContextType()
    const context = audioContextRef.current
    if (context.state === 'suspended') void context.resume()
    const notes = { select: [520], move: [390, 520], reply: [330, 440], check: [660, 880], mate: [523, 659, 784, 1047], miss: [240, 185] }[kind] || [440]
    const duration = kind === 'mate' ? 0.12 : 0.075
    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      const startAt = context.currentTime + index * (kind === 'mate' ? 0.1 : 0.035)
      oscillator.type = kind === 'miss' ? 'triangle' : 'sine'
      oscillator.frequency.setValueAtTime(frequency, startAt)
      gain.gain.setValueAtTime(0.0001, startAt)
      gain.gain.exponentialRampToValueAtTime(kind === 'mate' ? 0.12 : 0.07, startAt + 0.012)
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration)
      oscillator.connect(gain).connect(context.destination)
      oscillator.start(startAt)
      oscillator.stop(startAt + duration + 0.02)
    })
  }

  const loadPuzzle = (next) => {
    if (replyTimerRef.current) window.clearTimeout(replyTimerRef.current)
    gameRef.current = new Chess(next.fen)
    setPuzzle(next)
    setStarted(false)
    setPieces(displayPieces(gameRef.current))
    setPly(0)
    setSelected(null)
    setSolved(false)
    setFailed(false)
    setThinking(false)
    setMovesLeft(3)
    setLastMove(null)
    setHintOpen(false)
    setFocusedSquare(next.solverColor === 'w' ? 'a8' : 'h1')
    setStatus('Find the forcing line. The opponent will defend after each move.')
  }
  const newPuzzle = () => loadPuzzle(choosePuzzle(puzzle.id, level))
  const resetPuzzle = () => loadPuzzle(puzzle)
  const retryPuzzle = () => { loadPuzzle(puzzle); setStarted(true) }
  const startPuzzle = () => setStarted(true)
  const chooseLevel = (nextLevel) => {
    setLevel(nextLevel)
    loadPuzzle(choosePuzzle(puzzle.id, nextLevel))
  }

  const moveBoardFocus = (event, square) => {
    const vectors = { ArrowUp: [0, 1], ArrowDown: [0, -1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }
    const vector = vectors[event.key]
    if (!vector) return
    event.preventDefault()
    const { x, y } = { x: files.indexOf(square[0]), y: Number(square[1]) - 1 }
    const nx = Math.max(0, Math.min(7, x + vector[0]))
    const ny = Math.max(0, Math.min(7, y + vector[1]))
    const next = `${files[nx]}${ny + 1}`
    setFocusedSquare(next)
    squareRefs.current[next]?.focus()
  }

  const chooseSquare = (square) => {
    if (solved || failed || thinking) return
    const piece = pieces[square]
    if (piece && piece[0] === solverColor && isSolverTurn) {
      setSelected(square === selected ? null : square)
      setStatus(square === selected ? 'Piece deselected.' : `Selected ${pieceNames[piece[1].toLowerCase()]}. Choose a legal destination.`)
      playSound('select')
      return
    }
    if (!selected || !destinations.includes(square)) return
    const expected = moveFromUci(puzzle.solution[ply])
    const chosen = { from: selected, to: square }
    if (chosen.from !== expected.from || chosen.to !== expected.to) {
      setSelected(null)
      setFailed(true)
      setStatus('That move misses the forced mate. Reset and look for a stronger move.')
      playSound('miss')
      return
    }
    const game = gameRef.current
    const played = game.move({ ...chosen, ...(expected.promotion ? { promotion: expected.promotion } : {}) })
    setPieces(displayPieces(game))
    setSelected(null)
    setLastMove({ from: played.from, to: played.to })
    setPly((current) => current + 1)
    setMovesLeft((current) => Math.max(0, current - 1))
    if (game.isCheckmate()) {
      setSolved(true)
      setStatus('Checkmate! You found the full line.')
      playSound('mate')
      return
    }
    playSound(game.isCheck() ? 'check' : 'move')
    const replyUci = puzzle.solution[ply + 1]
    if (!replyUci) {
      setFailed(true)
      setStatus('The puzzle line ended before checkmate. Try another position.')
      return
    }
    setThinking(true)
    setStatus(game.isCheck() ? 'Check. The opponent is calculating a defense…' : 'The opponent is calculating…')
    replyTimerRef.current = window.setTimeout(() => {
      const replyMove = moveFromUci(replyUci)
      const reply = game.move({ from: replyMove.from, to: replyMove.to, ...(replyMove.promotion ? { promotion: replyMove.promotion } : {}) })
      setPieces(displayPieces(game))
      setLastMove({ from: reply.from, to: reply.to })
      setPly((current) => current + 1)
      setThinking(false)
      playSound('reply')
      setStatus('Defense played. Find the next move in the combination.')
    }, 520)
  }

  const boardRanks = solverColor === 'w' ? [8,7,6,5,4,3,2,1] : [1,2,3,4,5,6,7,8]
  const boardFiles = solverColor === 'w' ? files.split('') : files.split('').reverse()

  return createPortal(
    <div className="checkmate-screen" ref={screenRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Find the checkmate chess puzzle">
      <header className="checkmate-topbar">
        <a className="checkmate-brand" href="#home" onClick={(event) => { event.preventDefault(); onClose() }}>AA<span>.</span></a>
        <div className="checkmate-top-title"><span className="checkmate-live-dot" /> CHESS PUZZLE <i>·</i> MATE IN THREE</div>
        <div className="checkmate-top-actions">
          <button className="checkmate-icon-button" type="button" onClick={() => setSoundOn((enabled) => !enabled)} aria-label={soundOn ? 'Mute puzzle sounds' : 'Enable puzzle sounds'} aria-pressed={soundOn}>{soundOn ? <Volume2 size={17} /> : <VolumeX size={17} />}</button>
          {started && !solved && !failed && <button className="checkmate-icon-button" type="button" onClick={resetPuzzle} aria-label="Restart puzzle"><RotateCcw size={16} /></button>}
          <button className="checkmate-icon-button" type="button" onClick={onClose} aria-label="Close chess puzzle"><X size={19} /></button>
        </div>
      </header>

      <main className={`checkmate-layout${started && !solved && !failed ? ' is-playing' : ' has-popup'}`}>
        <section className="checkmate-board-column" aria-label="Chessboard">
          <div className={`checkmate-board${solved ? ' is-solved' : ''}`} role="grid" aria-label="Chess board">
            {boardRanks.flatMap((rank) => boardFiles.map((file) => {
              const square = `${file}${rank}`
              const piece = pieces[square]
              const pieceColor = piece?.[0]
              const isHint = destinations.includes(square)
              const isLastMove = solved && square === lastMove?.to
              const light = (files.indexOf(file) + rank) % 2 === 0
              const squareClass = ['chess-square', light ? 'chess-light' : 'chess-dark', selected === square ? 'chess-selected' : '', lastMove?.from === square ? 'chess-last-from' : '', lastMove?.to === square ? 'chess-last-to' : '', isLastMove ? 'chess-mate-square' : ''].filter(Boolean).join(' ')
              return (
                <button key={square} ref={(node) => { squareRefs.current[square] = node }} type="button" role="gridcell" tabIndex={focusedSquare === square ? 0 : -1} className={squareClass} disabled={thinking || solved || failed} onFocus={() => setFocusedSquare(square)} onKeyDown={(event) => moveBoardFocus(event, square)} onClick={() => chooseSquare(square)} aria-label={`${square}${piece ? `, ${colorName(pieceColor)} ${pieceNames[piece[1].toLowerCase()]}` : ''}${isHint ? ', legal move' : ''}`}>
                  {piece && <span className={`chess-piece ${colorName(pieceColor)}${lastMove?.to === square ? ' just-moved' : ''}`}>{pieceSymbols[pieceColor][piece[1].toLowerCase()]}</span>}
                  {isHint && <span className="chess-move-hint" />}
                  {file === boardFiles[0] && <span className="chess-coordinate rank-coordinate">{rank}</span>}
                  {rank === (solverColor === 'w' ? 1 : 8) && <span className="chess-coordinate file-coordinate">{file}</span>}
                </button>
              )
            }))}
          </div>
          <div className="checkmate-board-caption"><span>{thinking ? 'OPPONENT IS THINKING' : solved ? 'CHECKMATE' : failed ? 'TRY AGAIN' : `${solverColor === 'w' ? 'WHITE' : 'BLACK'} TO MOVE · MATE IN 3`}</span><span>{movesLeft} {movesLeft === 1 ? 'MOVE' : 'MOVES'} LEFT</span></div>
          {started && !solved && !failed && <p className="checkmate-play-status" role="status">{status}</p>}
        </section>

        {(!started || solved || failed) && <div className="checkmate-popup-backdrop">
          <aside className="checkmate-card checkmate-popup" aria-labelledby="checkmate-popup-title">
            <span className="checkmate-kicker">{solved ? 'CHECKMATE FOUND' : failed ? 'PUZZLE OVER' : `${puzzle.level.toUpperCase()} · 3-MOVE CHALLENGE`}</span>
            <h1 id="checkmate-popup-title">{solved ? <>You found<br /><em>the mate.</em></> : failed ? <>Try another<br /><em>line.</em></> : <>Find the<br /><em>checkmate.</em></>}</h1>
            <p className="checkmate-instruction">{solved ? 'Beautiful finish. Ready for another position?' : failed ? 'Look for forcing moves that keep the king under pressure.' : 'You have three moves. The opponent will defend after each one.'}</p>
            {!started && <div className="checkmate-levels" aria-label="Puzzle difficulty">{levels.map((item) => <button key={item} type="button" className={level === item ? 'is-active' : ''} onClick={() => chooseLevel(item)} aria-pressed={level === item}>{item}</button>)}</div>}
            {(solved || failed) && <div className={`checkmate-hint${hintOpen ? ' is-open' : ''}`}><button className="checkmate-hint-toggle" type="button" onClick={() => setHintOpen((open) => !open)} aria-expanded={hintOpen}><span><Lightbulb size={15} /> HINT</span><span>{hintOpen ? 'Hide' : 'Reveal'}</span></button>{hintOpen && <p>{puzzle.hint}</p>}</div>}
            <div className="checkmate-actions">
              <button className="checkmate-next" type="button" onClick={solved ? newPuzzle : failed ? retryPuzzle : startPuzzle}>{solved ? 'Next puzzle' : failed ? 'Try again' : 'Start puzzle'} <ArrowRight size={16} /></button>
              {solved && <button className="checkmate-reset" type="button" onClick={newPuzzle}>Choose another challenge</button>}
            </div>
            {solved && <a className="checkmate-challenge" href="https://www.chess.com/member/mbumbu_a" target="_blank" rel="noopener noreferrer">Challenge me on Chess.com <ArrowUpRight size={16} /></a>}
          </aside>
        </div>}
      </main>
    </div>,
    document.body,
  )
}

export default CheckmatePuzzle
