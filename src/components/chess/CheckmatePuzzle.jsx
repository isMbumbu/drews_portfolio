import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowRight, ArrowUpRight, Lightbulb, RotateCcw, X } from 'lucide-react'
import './checkmate-puzzle.css'

const puzzles = [
  {
    id: 'corner-net',
    level: 'Beginner',
    pieces: { h8: 'bK', g6: 'wQ', g1: 'wR', h1: 'wK' },
    hint: 'Look for a queen move that leaves the king with no safe square. Your rook can protect the finish.',
  },
  {
    id: 'boxed-in',
    level: 'Intermediate',
    pieces: { a8: 'bK', c6: 'wK', b6: 'wQ' },
    hint: 'The black king is trapped in the corner. Find a checking move your king can support.',
  },
  {
    id: 'back-rank',
    level: 'Intermediate',
    pieces: { h8: 'bK', g6: 'wK', f7: 'wQ' },
    hint: 'A straight move can be stronger than a check from a distance. Watch the escape squares around the king.',
  },
  {
    id: 'bottom-corner',
    level: 'Beginner',
    pieces: { a1: 'bK', a8: 'wK', b8: 'wR', b3: 'wQ' },
    hint: 'The rook can protect your queen from across the board. Check every square around the cornered king.',
  },
  {
    id: 'short-net',
    level: 'Beginner',
    pieces: { h1: 'bK', f3: 'wK', g3: 'wQ' },
    hint: 'Bring the queen closer. Your king is already guarding part of the escape route.',
  },
  {
    id: 'diagonal-finish',
    level: 'Intermediate',
    pieces: { a1: 'bK', b3: 'wK', c2: 'wQ' },
    hint: 'Give check along the back rank. Your king covers two of the black king’s escape squares.',
  },
  {
    id: 'expert-corner',
    level: 'Advanced',
    pieces: { h8: 'bK', g6: 'wQ', g1: 'wR', h1: 'wK', c3: 'wR', b4: 'wR' },
    hint: 'Check the king’s escape squares and identify which of your pieces covers each one.',
  },
  {
    id: 'expert-file',
    level: 'Advanced',
    pieces: { a8: 'bK', c6: 'wK', b6: 'wQ', h1: 'wR', f2: 'wR', e4: 'wR' },
    hint: 'Several pieces are on the board. Find a forcing move that seals the corner.',
  },
  {
    id: 'expert-rank',
    level: 'Advanced',
    pieces: { h8: 'bK', g6: 'wK', f7: 'wQ', a1: 'wR', c3: 'wR', b4: 'wR' },
    hint: 'Look at the back rank. Your king and rooks restrict the king’s escape squares.',
  },
]

const files = 'abcdefgh'
const symbols = { wK: '♔', wQ: '♕', wR: '♖', bK: '♚' }
const labels = { wK: 'white king', wQ: 'white queen', wR: 'white rook', bK: 'black king' }
const sides = { wK: 'white', wQ: 'white', wR: 'white', bK: 'black' }
const squareIndex = (square) => ({ x: files.indexOf(square[0]), y: Number(square[1]) - 1 })
const squareName = (x, y) => `${files[x]}${y + 1}`

function legalDestinations(from, piece, pieces) {
  const { x, y } = squareIndex(from)
  const kind = piece[1]
  const directions = kind === 'K'
    ? [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]
    : kind === 'R'
      ? [[-1,0],[1,0],[0,-1],[0,1]]
      : [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]
  const destinations = []

  directions.forEach(([dx, dy]) => {
    let nx = x + dx
    let ny = y + dy
    while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
      const target = squareName(nx, ny)
      const occupant = pieces[target]
      if (occupant) {
        if (sides[occupant] !== sides[piece] && occupant !== 'bK') destinations.push(target)
        break
      }
      destinations.push(target)
      if (kind === 'K') break
      nx += dx
      ny += dy
    }
  })
  return destinations.filter((target) => {
    const next = { ...pieces }
    delete next[from]
    delete next[target]
    next[target] = piece
    const king = Object.keys(next).find((square) => next[square] === (sides[piece] === 'white' ? 'wK' : 'bK'))
    return king && !isSquareAttacked(king, sides[piece] === 'white' ? 'black' : 'white', next)
  })
}

function isSquareAttacked(target, bySide, pieces) {
  const to = squareIndex(target)
  return Object.entries(pieces).some(([from, piece]) => {
    if (sides[piece] !== bySide) return false
    const start = squareIndex(from)
    const dx = to.x - start.x
    const dy = to.y - start.y
    if (dx === 0 && dy === 0) return false
    const kind = piece[1]
    if (kind === 'K') return Math.max(Math.abs(dx), Math.abs(dy)) === 1
    if (kind === 'R' && dx !== 0 && dy !== 0) return false
    if (kind === 'Q' && dx !== 0 && dy !== 0 && Math.abs(dx) !== Math.abs(dy)) return false
    if (kind !== 'Q' && kind !== 'R') return false
    const stepX = Math.sign(dx)
    const stepY = Math.sign(dy)
    let x = start.x + stepX
    let y = start.y + stepY
    while (x !== to.x || y !== to.y) {
      if (pieces[squareName(x, y)]) return false
      x += stepX
      y += stepY
    }
    return true
  })
}

function isCheckmate(pieces) {
  const king = Object.keys(pieces).find((square) => pieces[square] === 'bK')
  if (!king || !isSquareAttacked(king, 'white', pieces)) return false
  const { x, y } = squareIndex(king)
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (!dx && !dy) continue
      const nx = x + dx
      const ny = y + dy
      if (nx < 0 || nx > 7 || ny < 0 || ny > 7) continue
      const target = squareName(nx, ny)
      if (pieces[target] === 'bK') continue
      const next = { ...pieces }
      delete next[king]
      delete next[target]
      next[target] = 'bK'
      if (!isSquareAttacked(target, 'white', next)) return false
    }
  }
  return true
}

const levels = ['Random', 'Beginner', 'Intermediate', 'Advanced']

function pickPuzzle(previousId, level = 'Random') {
  const pool = level === 'Random' ? puzzles : puzzles.filter((puzzle) => puzzle.level === level)
  const choices = pool.filter((puzzle) => puzzle.id !== previousId)
  const available = choices.length ? choices : pool
  return available[Math.floor(Math.random() * available.length)]
}

function CheckmatePuzzle({ onClose }) {
  const [puzzle, setPuzzle] = useState(() => pickPuzzle())
  const [level, setLevel] = useState('Random')
  const [pieces, setPieces] = useState(() => ({ ...puzzle.pieces }))
  const [selected, setSelected] = useState(null)
  const [focusedSquare, setFocusedSquare] = useState('a8')
  const [status, setStatus] = useState('Select a white piece, then choose its destination.')
  const [solved, setSolved] = useState(false)
  const [hintOpen, setHintOpen] = useState(false)
  const screenRef = useRef(null)
  const squareRefs = useRef({})
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

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

  const destinations = selected ? legalDestinations(selected, pieces[selected], pieces) : []

  const newPuzzle = () => {
    const next = pickPuzzle(puzzle.id, level)
    setPuzzle(next)
    setPieces({ ...next.pieces })
    setSelected(null)
    setSolved(false)
    setHintOpen(false)
    setFocusedSquare('a8')
    setStatus('Select a white piece, then choose its destination.')
  }

  const resetPuzzle = () => {
    setPieces({ ...puzzle.pieces })
    setSelected(null)
    setSolved(false)
    setHintOpen(false)
    setStatus('Select a white piece, then choose its destination.')
  }

  const chooseLevel = (nextLevel) => {
    setLevel(nextLevel)
    const next = pickPuzzle(puzzle.id, nextLevel)
    setPuzzle(next)
    setPieces({ ...next.pieces })
    setSelected(null)
    setSolved(false)
    setHintOpen(false)
    setFocusedSquare('a8')
    setStatus('Select a white piece, then choose its destination.')
  }

  const moveBoardFocus = (event, square) => {
    const vectors = { ArrowUp: [0, 1], ArrowDown: [0, -1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }
    const vector = vectors[event.key]
    if (!vector) return
    event.preventDefault()
    const { x, y } = squareIndex(square)
    const nx = Math.max(0, Math.min(7, x + vector[0]))
    const ny = Math.max(0, Math.min(7, y + vector[1]))
    const next = squareName(nx, ny)
    setFocusedSquare(next)
    squareRefs.current[next]?.focus()
  }

  const chooseSquare = (square) => {
    if (solved) return
    const piece = pieces[square]
    if (piece && sides[piece] === 'white') {
      setSelected(square === selected ? null : square)
      setStatus(square === selected ? 'Piece deselected.' : `Selected ${labels[piece]}. Choose a destination.`)
      return
    }
    if (!selected || !destinations.includes(square)) return

    const movingPiece = pieces[selected]
    const nextPieces = { ...pieces }
    delete nextPieces[selected]
    nextPieces[square] = movingPiece
    setPieces(nextPieces)
    setSelected(null)

    if (isCheckmate(nextPieces)) {
      setSolved(true)
      setStatus('Checkmate! You found the winning move.')
    } else {
      const king = Object.keys(nextPieces).find((position) => nextPieces[position] === 'bK')
      setStatus(king && isSquareAttacked(king, 'white', nextPieces)
        ? 'Check! The king still has an escape. Look for a stronger move.'
        : 'That move does not give check. Find a forcing move.')
    }
  }

  return createPortal(
    <div className="checkmate-screen" ref={screenRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Find the checkmate chess puzzle">
      <header className="checkmate-topbar">
        <a className="checkmate-brand" href="#home" onClick={(event) => { event.preventDefault(); onClose() }}>AA<span>.</span></a>
        <div className="checkmate-top-title"><span className="checkmate-live-dot" /> CHESS PUZZLE <i>·</i> SELECT YOUR LEVEL</div>
        <button className="checkmate-icon-button" type="button" onClick={onClose} aria-label="Close chess puzzle"><X size={19} /></button>
      </header>

      <main className="checkmate-layout">
        <section className="checkmate-board-column" aria-label="Chessboard">
          <div className="checkmate-board" role="grid" aria-label="Chess board">
            {Array.from({ length: 64 }, (_, index) => {
              const fileIndex = index % 8
              const rank = 8 - Math.floor(index / 8)
              const square = `${files[fileIndex]}${rank}`
              const piece = pieces[square]
              const isHint = destinations.includes(square)
              const isLastMove = solved && square === puzzle.to
              const squareClass = [
                'chess-square',
                (fileIndex + rank) % 2 === 0 ? 'chess-light' : 'chess-dark',
                selected === square ? 'chess-selected' : '',
                isLastMove ? 'chess-mate-square' : '',
              ].filter(Boolean).join(' ')

              return (
                <button
                  key={square}
                  ref={(node) => { squareRefs.current[square] = node }}
                  type="button"
                  role="gridcell"
                  tabIndex={focusedSquare === square ? 0 : -1}
                  className={squareClass}
                  onFocus={() => setFocusedSquare(square)}
                  onKeyDown={(event) => moveBoardFocus(event, square)}
                  onClick={() => chooseSquare(square)}
                  aria-label={`${square}${piece ? `, ${labels[piece]}` : ''}${isHint ? ', legal move' : ''}`}
                >
                  {piece && <span className={`chess-piece ${sides[piece]}`}>{symbols[piece]}</span>}
                  {isHint && <span className="chess-move-hint" />}
                  {fileIndex === 0 && <span className="chess-coordinate rank-coordinate">{rank}</span>}
                  {rank === 1 && <span className="chess-coordinate file-coordinate">{files[fileIndex]}</span>}
                </button>
              )
            })}
          </div>
          <div className="checkmate-board-caption"><span>WHITE TO MOVE · MATE IN ONE</span><span>{puzzle.level.toUpperCase()}</span></div>
        </section>

        <aside className="checkmate-card">
          <span className="checkmate-kicker">{solved ? 'CHECKMATE FOUND' : `${puzzle.level.toUpperCase()} PUZZLE`}</span>
          <h1>Find the<br /><em>checkmate.</em></h1>
          <p className="checkmate-instruction">White to move. Find a legal move that forces checkmate.</p>
          <div className="checkmate-levels" aria-label="Puzzle difficulty">
            {levels.map((item) => <button key={item} type="button" className={level === item ? 'is-active' : ''} onClick={() => chooseLevel(item)} aria-pressed={level === item}>{item}</button>)}
          </div>
          <p className={`checkmate-status${solved ? ' is-solved' : ''}`} role="status">{status}</p>
          <div className={`checkmate-hint${hintOpen ? ' is-open' : ''}`}>
            <button className="checkmate-hint-toggle" type="button" onClick={() => setHintOpen((open) => !open)} aria-expanded={hintOpen}>
              <span><Lightbulb size={15} /> HINT</span><span>{hintOpen ? 'Hide' : 'Reveal'}</span>
            </button>
            {hintOpen && <p>{puzzle.hint}</p>}
          </div>
          <div className="checkmate-actions">
            <button className="checkmate-next" type="button" onClick={newPuzzle}>{solved ? 'Next puzzle' : 'Random puzzle'} <ArrowRight size={16} /></button>
            <button className="checkmate-reset" type="button" onClick={resetPuzzle}><RotateCcw size={14} /> Reset board</button>
          </div>
          {solved && <a className="checkmate-challenge" href="https://www.chess.com/member/mbumbu_a" target="_blank" rel="noopener noreferrer">Challenge me on Chess.com <ArrowUpRight size={16} /></a>}
          <p className="checkmate-help">Select a white piece, then choose a highlighted square. Use arrow keys to move around the board.</p>
        </aside>
      </main>
    </div>,
    document.body,
  )
}

export default CheckmatePuzzle
