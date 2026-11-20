import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Volume2, VolumeX } from 'lucide-react'
import { FootballGame, WIN_SCORE, emptyControls } from './engine'
import { sound } from './Sound'
import './pixel-football.css'

const STEP_MS = 1000 / 60

function PixelFootball() {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const gameRef = useRef(null)
  const controls = useRef(emptyControls())
  const lastUi = useRef('')
  const [ui, setUi] = useState({ phase: 'ready', left: 0, right: 0, winner: null })
  const [muted, setMuted] = useState(sound.muted)

  const start = useCallback(() => {
    sound.unlock()
    gameRef.current?.start()
  }, [])

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!wrap || !canvas || !ctx) return

    let raf = 0
    let last = 0
    let acc = 0
    let visible = false
    let currentGame = null
    const none = emptyControls()

    const build = () => {
      const rect = wrap.getBoundingClientRect()
      if (rect.width < 120 || rect.height < 60) return
      const width = Math.max(240, Math.min(460, Math.round(rect.width / 2.1)))
      const height = Math.round(width / 2.45)
      if (currentGame && Math.abs(currentGame.W - width) < 10) return
      currentGame = new FootballGame(width, height)
      currentGame.sfx = (name, volume) => sound.play(name, volume)
      gameRef.current = currentGame
      canvas.width = width
      canvas.height = height
      ctx.imageSmoothingEnabled = false
      lastUi.current = ''
      currentGame.render(ctx)
    }

    const frame = (time) => {
      raf = requestAnimationFrame(frame)
      if (!currentGame || !visible || document.hidden) { last = 0; return }
      if (!last) last = time
      acc += Math.min(100, time - last)
      last = time
      let steps = 0
      while (acc >= STEP_MS && steps < 5) {
        currentGame.setControls(controls.current)
        currentGame.step()
        acc -= STEP_MS
        steps += 1
      }
      if (steps === 5) acc = 0
      currentGame.render(ctx)
      const next = currentGame.ui()
      const key = `${next.phase}|${next.left}|${next.right}|${next.winner}`
      if (key !== lastUi.current) {
        lastUi.current = key
        setUi(next)
      }
    }

    build()
    raf = requestAnimationFrame(frame)
    const resize = new ResizeObserver(build)
    resize.observe(wrap)
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting }, { threshold: 0.05 })
    observer.observe(wrap)
    return () => {
      cancelAnimationFrame(raf)
      resize.disconnect()
      observer.disconnect()
      gameRef.current = null
    }
  }, [])

  useEffect(() => {
    sound.ambience(ui.phase === 'countdown' || ui.phase === 'play' || ui.phase === 'goal')
    return () => sound.ambience(false)
  }, [ui.phase])

  useEffect(() => {
    const keyMap = { ArrowLeft: 'left', a: 'left', ArrowRight: 'right', d: 'right', ArrowUp: 'jump', w: 'jump', ' ': 'kick', x: 'kick', k: 'kick' }
    const down = (event) => {
      if (!wrapRef.current?.contains(document.activeElement)) return
      if (event.key === 'Enter' && (ui.phase === 'ready' || ui.phase === 'over')) { start(); return }
      const key = keyMap[event.key] || keyMap[event.key.toLowerCase()]
      if (!key) return
      event.preventDefault()
      controls.current[key] = true
    }
    const up = (event) => {
      const key = keyMap[event.key] || keyMap[event.key.toLowerCase()]
      if (key) controls.current[key] = false
    }
    const clear = () => { controls.current = emptyControls() }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', clear)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', clear)
      clear()
    }
  }, [start, ui.phase])

  const toggleSound = () => {
    sound.unlock()
    const next = !muted
    sound.setMuted(next)
    setMuted(next)
  }

  const press = (key) => (event) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    controls.current[key] = true
    if (key === 'kick' || key === 'jump') sound.unlock()
  }
  const release = (key) => () => { controls.current[key] = false }
  const over = ui.phase === 'over'

  return (
    <section className="football-section" id="football">
      <div className="section-wrap">
        <div className="football-heading">
          <div>
            <span className="section-kicker">A LITTLE FRIENDLY COMPETITION</span>
            <h2>Pixel <em>Football.</em></h2>
          </div>
          <button className="football-sound" type="button" onClick={toggleSound} aria-label={muted ? 'Turn game sound on' : 'Turn game sound off'}>
            {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}{muted ? 'SOUND OFF' : 'SOUND ON'}
          </button>
        </div>

        <div className="football-game" ref={wrapRef} tabIndex={0} aria-label="Pixel football game" onPointerDown={(event) => { if (event.target === event.currentTarget || event.target === canvasRef.current) event.currentTarget.focus() }}>
          <div className="football-scorebar">
            <span><i className="football-dot player-dot" /> YOU <b>{ui.left}</b></span>
            <span className="football-match-state">{ui.phase === 'play' || ui.phase === 'goal' ? 'MATCH IN PROGRESS' : `FIRST TO ${WIN_SCORE}`}</span>
            <span><b>{ui.right}</b> CPU <i className="football-dot cpu-dot" /></span>
          </div>
          <div className="football-pitch-wrap">
            <canvas ref={canvasRef} className="football-canvas" role="img" aria-label="Pixel football match. Use arrow keys or A and D to move, up or W to jump, and space or X to kick." />
            {(ui.phase === 'ready' || over) && (
              <div className="football-overlay" key={ui.phase}>
                {over ? <>
                  <span className="football-eyebrow">FULL TIME · {ui.left} — {ui.right}</span>
                  <h3>{ui.winner === 'left' ? 'You win!' : 'CPU wins!'}</h3>
                  <button className="football-start" onClick={start}>Play again <ArrowRight size={15} /></button>
                </> : <>
                  <span className="football-eyebrow">YOU VS CPU</span>
                  <h3>First to {WIN_SCORE} goals wins</h3>
                  <button className="football-start" onClick={start}>Kick off <ArrowRight size={15} /></button>
                  <span className="football-help">Move with ← → or A D · Jump with ↑ or W · Kick with Space</span>
                </>}
              </div>
            )}
          </div>
          <div className="football-controls" aria-label="Touch controls">
            <div className="football-pad">
              <button aria-label="Move left" onPointerDown={press('left')} onPointerUp={release('left')} onPointerCancel={release('left')} onLostPointerCapture={release('left')}><ArrowLeft size={18} /></button>
              <button aria-label="Move right" onPointerDown={press('right')} onPointerUp={release('right')} onPointerCancel={release('right')} onLostPointerCapture={release('right')}><ArrowRight size={18} /></button>
              <button aria-label="Jump" onPointerDown={press('jump')} onPointerUp={release('jump')} onPointerCancel={release('jump')} onLostPointerCapture={release('jump')}><ArrowUp size={18} /></button>
            </div>
            <button className="football-kick" onPointerDown={press('kick')} onPointerUp={release('kick')} onPointerCancel={release('kick')} onLostPointerCapture={release('kick')}>KICK</button>
          </div>
          <div className="football-footnote">Use ← → or A D to move · ↑ or W to jump · Space or X to kick</div>
        </div>
      </div>
    </section>
  )
}

export default PixelFootball
