import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { ArrowLeft, ArrowRight, ArrowUpRight, Lightbulb, RotateCcw, Volume2, VolumeX, X } from 'lucide-react'
import './checkmate-puzzle.css'

// Positions and main lines are from the CC0 Lichess puzzle database.
// Each line is the solver's move, the best defense, and so on through mate.
const puzzles = [
  { id: '3eKE8', rating: 2095, themes: ['queen endgame', 'mate in 3'], level: 'Advanced', solverColor: 'black', fen: 'Q7/p3qB2/2pk1p2/3p4/1Pp2nP1/P3PK2/3B3P/1R6 b - - 1 27', solution: ['e7e4','f3g3','e4g2','g3h4','g2h2'], hint: 'The queen has a forcing check. Keep the king exposed and finish with a capture on h2.' },
  { id: 'My2wA', rating: 1762, themes: ['fork', 'mate in 3'], level: 'Intermediate', solverColor: 'white', fen: '1r1r4/1p5k/2nq2p1/P4BR1/8/1Q2pp2/1PP5/1K6 w - - 0 43', solution: ['b3f7','h7h6','g5g6','d6g6','f7g6'], hint: 'Start with a queen check. The rook joins the attack with tempo.' },
  { id: 'Qirjd', rating: 1675, themes: ['queen endgame', 'mate in 3'], level: 'Intermediate', solverColor: 'white', fen: '8/6p1/3Q3p/5k2/4p3/4q2P/6PK/8 w - - 7 47', solution: ['g2g4','f5g5','d6e5','g5g6','e5f5'], hint: 'A quiet pawn is the key to opening the king’s path for a queen check.' },
  { id: 'ycc0e', rating: 1182, themes: ['fork', 'sacrifice', 'mate in 3'], level: 'Beginner', solverColor: 'white', fen: '2r3k1/p4ppp/4bn2/2Q5/8/2PR4/qP6/2K2R2 w - - 1 32', solution: ['c5c8','e6c8','d3d8','f6e8','d8e8'], hint: 'Trade the queen for the bishop, then use both rooks to force mate.' },
  { id: 'AAEY7', rating: 1005, themes: ['back rank mate', 'sacrifice'], level: 'Beginner', solverColor: 'black', fen: 'r3kr2/pp2b3/5qpp/8/1P2Q3/2P5/P4PPP/RN2R1K1 b q - 0 24', solution: ['f6f2','g1h1','f2f1','e1f1','f8f1'], hint: 'The queen invasion forces the king and rook into a mating net.' },
  { id: '2rLtJ', rating: 985, themes: ['back rank mate', 'sacrifice'], level: 'Beginner', solverColor: 'black', fen: '5r1k/6pp/1p1Q4/4pq2/1P6/4P3/P5PP/R5K1 b - - 0 28', solution: ['f5f2','g1h1','f2f1','a1f1','f8f1'], hint: 'Two forcing queen checks pull the rook away from its defense.' },
  { id: 'r00X0', rating: 1106, themes: ['back rank mate', 'sacrifice'], level: 'Intermediate', solverColor: 'white', fen: '1r1r3k/pb3Qpp/2q5/2p1p3/8/4P3/P5PP/3R1RK1 w - - 2 26', solution: ['d1d8','b8d8','f7f8','d8f8','f1f8'], hint: 'A rook sacrifice opens the back rank for a decisive queen check.' },
  { id: 'LBKkM', rating: 1341, themes: ['rook endgame', 'mate in 3'], level: 'Advanced', solverColor: 'white', fen: '7k/R5p1/p4p1p/1p3K2/r5P1/7P/6P1/8 w - - 2 37', solution: ['f5g6','a4d4','a7a8','d4d8','a8d8'], hint: 'Walk the king forward first. The rook promotion threat creates the final net.' },
]

const pieceNames = { k: 'king', q: 'queen', r: 'rook', b: 'bishop', n: 'knight', p: 'pawn' }
const levels = ['Random', 'Beginner', 'Intermediate', 'Advanced']
const colorName = (color) => color === 'w' ? 'white' : 'black'
const asChessColor = (side) => side === 'white' || side === 'w' ? 'w' : 'b'
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
  const [status, setStatus] = useState('Find the forcing line. Black will defend after each move.')
  const [solved, setSolved] = useState(false)
  const [failed, setFailed] = useState(false)
  const [mistakes, setMistakes] = useState(0)
  const [solvedCount, setSolvedCount] = useState(() => {
    try { return Number(window.localStorage.getItem('aa-chess-solved') || 0) } catch { return 0 }
  })
  const [thinking, setThinking] = useState(false)
  const [movesLeft, setMovesLeft] = useState(3)
  const [hintOpen, setHintOpen] = useState(false)
  const [reviewMode, setReviewMode] = useState(false)
  const [reviewIndex, setReviewIndex] = useState(0)
  const reviewLineRef = useRef([])
  const [soundOn, setSoundOn] = useState(true)
  const screenRef = useRef(null)
  const audioContextRef = useRef(null)
  const replyTimerRef = useRef(null)
  const turnSnapshotsRef = useRef([])
  const completedPuzzleRef = useRef(false)
  const lastDropAtRef = useRef(0)
  const [lastMove, setLastMove] = useState(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  const solverColor = asChessColor(puzzle.solverColor)
  const isSolverTurn = gameRef.current.turn() === solverColor
  const destinations = selected ? gameRef.current.moves({ square: selected, verbose: true }).map((move) => move.to) : []
  const moveHistory = gameRef.current.history({ verbose: true })
  const firstMoveNumber = Number(puzzle.fen.split(' ')[5])
  const historyRows = moveHistory.reduce((rows, move, index) => {
    const number = firstMoveNumber + Math.floor(index / 2)
    const row = rows.find((item) => item.number === number) || { number, white: '', black: '' }
    if (move.color === 'w') row.white = move.san
    else row.black = move.san
    if (!rows.includes(row)) rows.push(row)
    return rows
  }, [])

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
    setMistakes(0)
    setThinking(false)
    setMovesLeft(3)
    setReviewMode(false)
    setReviewIndex(0)
    reviewLineRef.current = []
    setLastMove(null)
    setHintOpen(false)
    turnSnapshotsRef.current = []
    completedPuzzleRef.current = false
    setStatus('Find the forcing line. The opponent will defend after each move.')
  }
  const newPuzzle = () => loadPuzzle(choosePuzzle(puzzle.id, level))
  const resetPuzzle = () => loadPuzzle(puzzle)
  const retryPuzzle = () => { loadPuzzle(puzzle); setStarted(true) }
  const startPuzzle = () => setStarted(true)
  const undoTurn = () => {
    const previous = turnSnapshotsRef.current.pop()
    if (!previous) return
    if (replyTimerRef.current) window.clearTimeout(replyTimerRef.current)
    gameRef.current = new Chess(previous.fen)
    setPieces(displayPieces(gameRef.current))
    setPly(previous.ply)
    setMovesLeft(previous.movesLeft)
    setLastMove(previous.lastMove)
    setSelected(null)
    setThinking(false)
    setStatus('Move undone. Try a different line.')
  }
  const chooseLevel = (nextLevel) => {
    setLevel(nextLevel)
    loadPuzzle(choosePuzzle(puzzle.id, nextLevel))
  }

  const beginReview = () => {
    reviewLineRef.current = gameRef.current.history({ verbose: true }).map(({ from, to, promotion }) => ({ from, to, ...(promotion ? { promotion } : {}) }))
    gameRef.current = new Chess(puzzle.fen)
    setPieces(displayPieces(gameRef.current))
    setLastMove(null)
    setReviewIndex(0)
    setReviewMode(true)
    setSolved(false)
    setFailed(false)
    setStatus('Review the line from the starting position.')
  }

  const stepReview = (direction) => {
    const nextIndex = Math.max(0, Math.min(reviewLineRef.current.length, reviewIndex + direction))
    const game = new Chess(puzzle.fen)
    let last = null
    for (const move of reviewLineRef.current.slice(0, nextIndex)) last = game.move(move)
    gameRef.current = game
    setPieces(displayPieces(game))
    setLastMove(last ? { from: last.from, to: last.to } : null)
    setReviewIndex(nextIndex)
  }

  const exitReview = () => {
    setReviewMode(false)
    setSolved(true)
    gameRef.current = new Chess(puzzle.fen)
    for (const move of reviewLineRef.current) gameRef.current.move(move)
    setPieces(displayPieces(gameRef.current))
    setLastMove(reviewLineRef.current.length ? { from: reviewLineRef.current.at(-1).from, to: reviewLineRef.current.at(-1).to } : null)
  }

  const attemptMove = (fromSquare, square) => {
    if (!started || solved || failed || thinking || reviewMode || !isSolverTurn) return false
    const movingPiece = pieces[fromSquare]
    if (!movingPiece || movingPiece[0] !== solverColor) return false
    if (!gameRef.current.moves({ square: fromSquare, verbose: true }).some((move) => move.to === square)) return false
    const expected = moveFromUci(puzzle.solution[ply])
    const chosen = { from: fromSquare, to: square }
    if (chosen.from !== expected.from || chosen.to !== expected.to) {
      setSelected(null)
      setMistakes((count) => count + 1)
      setStatus('That move misses the forced line. Try another move.')
      playSound('miss')
      return false
    }
    const game = gameRef.current
    turnSnapshotsRef.current.push({ fen: game.fen(), ply, movesLeft, lastMove })
    const played = game.move({ ...chosen, ...(expected.promotion ? { promotion: expected.promotion } : {}) })
    setPieces(displayPieces(game))
    setSelected(null)
    setLastMove({ from: played.from, to: played.to })
    setPly((current) => current + 1)
    setMovesLeft((current) => Math.max(0, current - 1))
    if (game.isCheckmate()) {
      setSolved(true)
      setStatus('Checkmate! You found the full line.')
      if (!completedPuzzleRef.current) {
        completedPuzzleRef.current = true
        setSolvedCount((count) => {
          const nextCount = count + 1
          try { window.localStorage.setItem('aa-chess-solved', String(nextCount)) } catch { /* Continue without persistence if storage is unavailable. */ }
          return nextCount
        })
      }
      playSound('mate')
      return true
    }
    playSound(game.isCheck() ? 'check' : 'move')
    const replyUci = puzzle.solution[ply + 1]
    if (!replyUci) {
      setFailed(true)
      setStatus('The puzzle line ended before checkmate. Try another position.')
      return true
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
    return true
  }

  const chooseSquare = (square) => {
    if (!started || solved || failed || thinking || reviewMode || !isSolverTurn) return
    const piece = pieces[square]
    if (piece && piece[0] === solverColor && isSolverTurn) {
      setSelected(square === selected ? null : square)
      setStatus(square === selected ? 'Piece deselected.' : `Selected ${pieceNames[piece[1].toLowerCase()]}. Choose a legal destination.`)
      playSound('select')
      return
    }
  }

  const handleBoardSquareClick = (square) => {
    if (Date.now() - lastDropAtRef.current < 250) return
    if (selected) {
      const moved = attemptMove(selected, square)
      if (moved) return
    }
    chooseSquare(square)
  }
  const handlePieceDrop = (from, to) => {
    lastDropAtRef.current = Date.now()
    return attemptMove(from, to)
  }
  const moveHighlights = {}
  if (lastMove) {
    moveHighlights[lastMove.from] = { backgroundColor: 'rgba(184,220,118,.28)' }
    moveHighlights[lastMove.to] = { backgroundColor: 'rgba(184,220,118,.42)' }
  }
  if (selected) {
    moveHighlights[selected] = { boxShadow: 'inset 0 0 0 4px #b8dc76' }
    destinations.forEach((square) => { moveHighlights[square] = { boxShadow: `inset 0 0 0 3px ${pieces[square] ? '#f2cf69' : '#87aa60'}` } })
  }

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

      <main className={`checkmate-layout${started && (!solved || reviewMode) && !failed ? ' is-playing' : ' has-popup'}`}>
        <section className="checkmate-board-column" aria-label="Chessboard">
          <div className="checkmate-player-strip" aria-label={`You are playing as ${colorName(solverColor)}`}>
            <span className={`checkmate-side-badge ${colorName(solverColor)}`}><i /> YOU PLAY {solverColor === 'w' ? 'WHITE' : 'BLACK'}</span>
            <span className="checkmate-opponent-label">{solverColor === 'w' ? 'BLACK' : 'WHITE'} DEFENDS</span>
          </div>
          <div className={`checkmate-board${solved ? ' is-solved' : ''}`} aria-label={`Chess board, viewed from ${colorName(solverColor)}’s side`}>
            <Chessboard
              position={gameRef.current.fen()}
              boardOrientation={colorName(solverColor)}
              animationDuration={280}
              arePiecesDraggable={started && !solved && !failed && !thinking && !reviewMode && isSolverTurn}
              isDraggablePiece={(piece) => started && !solved && !failed && !thinking && !reviewMode && isSolverTurn && piece[0] === solverColor}
              onPieceDrop={handlePieceDrop}
              onSquareClick={handleBoardSquareClick}
              autoPromoteToQueen
              showBoardNotation
              customBoardStyle={{ borderRadius: '2px', boxShadow: 'none' }}
              customLightSquareStyle={{ backgroundColor: '#eeeed2' }}
              customDarkSquareStyle={{ backgroundColor: '#779556' }}
              customNotationStyle={{ color: '#586f42', fontWeight: 700, textShadow: '0 1px rgba(255,255,255,.45)' }}
              customSquareStyles={moveHighlights}
            />
          </div>
          <div className="checkmate-board-caption"><span>{reviewMode ? `REVIEWING LINE · ${reviewIndex}/${reviewLineRef.current.length} PLIES` : thinking ? `${solverColor === 'w' ? 'BLACK' : 'WHITE'} DEFENDS` : solved ? 'CHECKMATE' : failed ? 'TRY AGAIN' : `${isSolverTurn ? (solverColor === 'w' ? 'WHITE' : 'BLACK') : (solverColor === 'w' ? 'BLACK' : 'WHITE')} TO MOVE`}</span><span>{reviewMode ? 'REVIEW' : `MATE IN 3 · ${movesLeft} LEFT`}</span></div>
          <div className="checkmate-board-quickbar" role="status"><span className="checkmate-turn-indicator"><i className={thinking ? 'is-opponent' : ''} />{reviewMode ? 'Line review' : thinking ? `${solverColor === 'w' ? 'Black' : 'White'} is defending` : `${isSolverTurn ? 'Your' : 'Opponent’s'} turn · ${colorName(isSolverTurn ? solverColor : (solverColor === 'w' ? 'b' : 'w'))}`}</span><span className="checkmate-move-meter" aria-label={`${3 - movesLeft} of 3 moves played`}><b>{reviewMode ? 'REVIEW' : `${3 - movesLeft}/3`}</b><span>{[0, 1, 2].map((step) => <i key={step} className={!reviewMode && step < 3 - movesLeft ? 'is-active' : ''} />)}</span></span></div>
        </section>

        {reviewMode ? <aside className="checkmate-game-panel checkmate-review-panel" aria-label="Review puzzle line">
          <span className="checkmate-panel-kicker">LINE REVIEW</span><h2>Replay <em>the solution</em></h2>
          <p className="checkmate-panel-prompt">Step through each move and the defense.</p>
          <div className="checkmate-review-moves" aria-live="polite">{reviewLineRef.current.slice(0, reviewIndex).map((move, index) => <span key={`${move.from}-${move.to}-${index}`}>{index % 2 === 0 ? `${Math.floor(index / 2) + 1}.` : ''} {move.from}–{move.to}</span>)}{reviewIndex === 0 && <span>Starting position</span>}</div>
          <div className="checkmate-panel-actions"><button type="button" className="checkmate-panel-button" onClick={() => stepReview(-1)} disabled={reviewIndex === 0}><ArrowLeft size={15} /> Previous</button><button type="button" className="checkmate-panel-button" onClick={() => stepReview(1)} disabled={reviewIndex >= reviewLineRef.current.length}>Next move <ArrowRight size={15} /></button></div>
          <button type="button" className="checkmate-review-exit" onClick={exitReview}>Back to result</button>
        </aside> : started && !solved && !failed && <aside className="checkmate-game-panel" aria-label="Puzzle information and controls">
          <span className="checkmate-panel-kicker">AA. · TACTICAL TRAINING</span>
          <h2>Puzzle <em>#{puzzle.id}</em></h2>
          <div className="checkmate-puzzle-meta"><span>{puzzle.level.toUpperCase()}</span><span>{puzzle.rating} ELO</span></div>
          <p className="checkmate-panel-prompt">Find the best move for <strong>{solverColor === 'w' ? 'White' : 'Black'}</strong>.</p>
          <div className="checkmate-progress"><div><span>Progress</span><strong>{3 - movesLeft} / 3 moves</strong></div><span className="checkmate-progress-steps" aria-label={`${3 - movesLeft} of 3 moves played`}>{[0, 1, 2].map((step) => <i key={step} className={step < 3 - movesLeft ? 'is-active' : ''} />)}</span></div>
          <p className="checkmate-status checkmate-panel-status" role="status">{status}</p>
          <div className="checkmate-panel-actions">
            <button type="button" className={`checkmate-panel-button${hintOpen ? ' is-active' : ''}`} onClick={() => setHintOpen((open) => !open)} aria-expanded={hintOpen}><Lightbulb size={15} /> {hintOpen ? 'Hide hint' : 'Hint'}</button>
            <button type="button" className="checkmate-panel-button" onClick={undoTurn} disabled={!turnSnapshotsRef.current.length}><RotateCcw size={14} /> Undo</button>
          </div>
          {hintOpen && <p className="checkmate-panel-hint">{puzzle.hint}</p>}
          <div className="checkmate-panel-stats"><span>Theme</span><strong>{puzzle.themes.join(' · ')}</strong><span>Mistakes</span><strong>{mistakes}</strong><span>Solved</span><strong>{solvedCount}</strong></div>
          <div className="checkmate-history"><div className="checkmate-history-head"><h3>Move history</h3><span>{historyRows.length} full moves</span></div>
            {historyRows.length ? <ol>{historyRows.map((row, index) => <li key={`${row.number}-${index}`}><span>{row.number}.</span><b>{row.white || '…'}</b><b>{row.black || '…'}</b></li>)}</ol> : <p>Your moves will appear here.</p>}
          </div>
        </aside>}

        {(!started || solved || failed) && !reviewMode && <div className="checkmate-popup-backdrop">
          <aside className="checkmate-card checkmate-popup" aria-labelledby="checkmate-popup-title">
            <button className="checkmate-popup-close" type="button" onClick={onClose} aria-label="Close chess popup"><X size={18} /></button>
            <span className="checkmate-kicker">{solved ? 'CHECKMATE FOUND' : failed ? 'PUZZLE OVER' : `${puzzle.level.toUpperCase()} · 3-MOVE CHALLENGE`}</span>
            <h1 id="checkmate-popup-title">{solved ? <>You found<br /><em>the mate.</em></> : failed ? <>Try another<br /><em>line.</em></> : <>Find the<br /><em>checkmate.</em></>}</h1>
            <p className="checkmate-instruction">{solved ? 'Beautiful finish. Ready for another position?' : failed ? 'Look for forcing moves that keep the king under pressure.' : `You’re playing as ${solverColor === 'w' ? 'White' : 'Black'}. The board is turned to your side. Find mate in three.`}</p>
            {!started && <div className="checkmate-levels" aria-label="Puzzle difficulty">{levels.map((item) => <button key={item} type="button" className={level === item ? 'is-active' : ''} onClick={() => chooseLevel(item)} aria-pressed={level === item}>{item}</button>)}</div>}
            {(solved || failed) && <div className={`checkmate-hint${hintOpen ? ' is-open' : ''}`}><button className="checkmate-hint-toggle" type="button" onClick={() => setHintOpen((open) => !open)} aria-expanded={hintOpen}><span><Lightbulb size={15} /> HINT</span><span>{hintOpen ? 'Hide' : 'Reveal'}</span></button>{hintOpen && <p>{puzzle.hint}</p>}</div>}
            {solved && <button type="button" className="checkmate-review-link" onClick={beginReview}>Review line <ArrowRight size={15} /></button>}
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
