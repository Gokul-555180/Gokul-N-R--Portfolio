'use client'

import { RotateCcw } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

type GameStatus = 'ready' | 'playing' | 'won' | 'lost'

type Brick = { id: number, x: number, y: number, width: number, height: number, color: string }
type Board = {
  width: number
  height: number
  paddle: { x: number, y: number, width: number, height: number }
  ball: { x: number, y: number, dx: number, dy: number, radius: number }
  bricks: Brick[]
  lives: number
  score: number
  status: GameStatus
  lastTime: number
}

const boardHeight = 388
const brickColors = ['#9bcbff', '#d8ccff', '#ffbfa8', '#b9dcad', '#f1d790']

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function roundedRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const safeRadius = Math.min(radius, width / 2, height / 2)
  context.beginPath()
  context.moveTo(x + safeRadius, y)
  context.arcTo(x + width, y, x + width, y + height, safeRadius)
  context.arcTo(x + width, y + height, x, y + height, safeRadius)
  context.arcTo(x, y + height, x, y, safeRadius)
  context.arcTo(x, y, x + width, y, safeRadius)
  context.closePath()
}

function createBricks(width: number) {
  const columns = Math.max(6, Math.min(9, Math.floor(width / 68)))
  const rows = 5
  const gap = 8
  const horizontalPadding = 28
  const brickWidth = (width - horizontalPadding * 2 - gap * (columns - 1)) / columns
  const brickHeight = 23

  return Array.from({ length: rows * columns }, (_, id) => {
    const row = Math.floor(id / columns)
    const column = id % columns
    return {
      id,
      x: horizontalPadding + column * (brickWidth + gap),
      y: 48 + row * (brickHeight + gap),
      width: brickWidth,
      height: brickHeight,
      color: brickColors[row % brickColors.length],
    }
  })
}

function createBoard(width: number, lives = 3, score = 0): Board {
  const paddleWidth = clamp(width * .22, 92, 124)
  const paddleY = boardHeight - 34
  return {
    width,
    height: boardHeight,
    paddle: { x: (width - paddleWidth) / 2, y: paddleY, width: paddleWidth, height: 11 },
    ball: { x: width / 2, y: paddleY - 10, dx: 0, dy: 0, radius: 7 },
    bricks: createBricks(width),
    lives,
    score,
    status: 'ready',
    lastTime: 0,
  }
}

function placeBallOnPaddle(board: Board) {
  board.ball.x = board.paddle.x + board.paddle.width / 2
  board.ball.y = board.paddle.y - board.ball.radius - 2
  board.ball.dx = 0
  board.ball.dy = 0
}

export function BlockBlaster() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const boardRef = useRef<Board | null>(null)
  const animationRef = useRef<number | null>(null)
  const [status, setStatus] = useState<GameStatus>('ready')
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [blocksLeft, setBlocksLeft] = useState(0)
  const [message, setMessage] = useState('Launch the ball, then keep the paddle beneath it. Arrow keys, A/D, or your pointer all work.')

  const syncHud = useCallback((board: Board, nextMessage?: string) => {
    setStatus(board.status)
    setScore(board.score)
    setLives(board.lives)
    setBlocksLeft(board.bricks.length)
    if (nextMessage) setMessage(nextMessage)
  }, [])

  const draw = useCallback((context: CanvasRenderingContext2D, board: Board) => {
    const backdrop = context.createLinearGradient(0, 0, board.width, board.height)
    backdrop.addColorStop(0, '#1b2038')
    backdrop.addColorStop(.62, '#242447')
    backdrop.addColorStop(1, '#12182b')
    context.fillStyle = backdrop
    context.fillRect(0, 0, board.width, board.height)

    const horizon = context.createRadialGradient(board.width * .5, board.height * .18, 5, board.width * .5, board.height * .18, board.width * .74)
    horizon.addColorStop(0, 'rgba(154, 184, 235, .16)')
    horizon.addColorStop(1, 'rgba(154, 184, 235, 0)')
    context.fillStyle = horizon
    context.fillRect(0, 0, board.width, board.height)

    context.strokeStyle = 'rgba(216, 204, 255, .07)'
    context.lineWidth = 1
    for (let y = 23; y < board.height; y += 30) {
      context.beginPath()
      context.moveTo(0, y)
      context.lineTo(board.width, y)
      context.stroke()
    }

    board.bricks.forEach((brick) => {
      context.save()
      context.shadowColor = brick.color
      context.shadowBlur = 14
      roundedRect(context, brick.x, brick.y, brick.width, brick.height, 5)
      context.fillStyle = brick.color
      context.fill()
      context.shadowBlur = 0
      roundedRect(context, brick.x + 2, brick.y + 2, brick.width - 4, 5, 3)
      context.fillStyle = 'rgba(255, 255, 255, .34)'
      context.fill()
      context.restore()
    })

    const paddleGlow = context.createLinearGradient(board.paddle.x, board.paddle.y, board.paddle.x + board.paddle.width, board.paddle.y)
    paddleGlow.addColorStop(0, '#c3eff2')
    paddleGlow.addColorStop(.5, '#f4f0e5')
    paddleGlow.addColorStop(1, '#c3eff2')
    context.save()
    context.shadowColor = '#9bcbff'
    context.shadowBlur = 20
    roundedRect(context, board.paddle.x, board.paddle.y, board.paddle.width, board.paddle.height, 6)
    context.fillStyle = paddleGlow
    context.fill()
    context.restore()

    context.save()
    context.shadowColor = '#fff2cf'
    context.shadowBlur = 20
    context.beginPath()
    context.arc(board.ball.x, board.ball.y, board.ball.radius, 0, Math.PI * 2)
    context.fillStyle = '#fff4d5'
    context.fill()
    context.restore()
  }, [])

  const getContext = useCallback(() => canvasRef.current?.getContext('2d') ?? null, [])

  const resizeBoard = useCallback(() => {
    const canvas = canvasRef.current
    const context = getContext()
    if (!canvas || !context) return
    const width = Math.max(280, Math.floor(canvas.getBoundingClientRect().width))
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.floor(width * ratio)
    canvas.height = Math.floor(boardHeight * ratio)
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    const previous = boardRef.current
    const next = createBoard(width, previous?.lives ?? 3, previous?.score ?? 0)
    boardRef.current = next
    draw(context, next)
    syncHud(next, 'Launch the ball, then keep the paddle beneath it. Arrow keys, A/D, or your pointer all work.')
  }, [draw, getContext, syncHud])

  useEffect(() => {
    resizeBoard()
    const observer = new ResizeObserver(resizeBoard)
    if (canvasRef.current) observer.observe(canvasRef.current)
    return () => observer.disconnect()
  }, [resizeBoard])

  const reset = useCallback(() => {
    const current = boardRef.current
    if (!current) return
    const next = createBoard(current.width)
    boardRef.current = next
    const context = getContext()
    if (context) draw(context, next)
    syncHud(next, 'Fresh grid loaded. Launch when you are ready.')
  }, [draw, getContext, syncHud])

  const launch = useCallback(() => {
    const board = boardRef.current
    if (!board || board.status === 'playing') return
    if (board.status === 'won' || board.status === 'lost') {
      const next = createBoard(board.width)
      boardRef.current = next
    }
    const active = boardRef.current
    if (!active) return
    active.status = 'playing'
    active.ball.dx = active.width * .29
    active.ball.dy = -active.width * .43
    active.lastTime = 0
    syncHud(active, 'Ball in play. Keep the return line alive.')
  }, [syncHud])

  const movePaddle = useCallback((clientX: number) => {
    const canvas = canvasRef.current
    const board = boardRef.current
    if (!canvas || !board) return
    const rect = canvas.getBoundingClientRect()
    const ratio = (clientX - rect.left) / rect.width
    board.paddle.x = clamp(ratio * board.width - board.paddle.width / 2, 12, board.width - board.paddle.width - 12)
    if (board.status === 'ready') placeBallOnPaddle(board)
  }, [])

  const nudgePaddle = useCallback((direction: -1 | 1) => {
    const board = boardRef.current
    if (!board) return
    board.paddle.x = clamp(board.paddle.x + direction * 42, 12, board.width - board.paddle.width - 12)
    if (board.status === 'ready') placeBallOnPaddle(board)
  }, [])

  useEffect(() => {
    const frame = (time: number) => {
      const board = boardRef.current
      const context = getContext()
      if (!board || !context) { animationRef.current = requestAnimationFrame(frame); return }

      if (board.status === 'playing') {
        const delta = Math.min((time - board.lastTime || 0) / 1000, .024)
        board.lastTime = time
        board.ball.x += board.ball.dx * delta
        board.ball.y += board.ball.dy * delta

        if (board.ball.x - board.ball.radius <= 0 || board.ball.x + board.ball.radius >= board.width) {
          board.ball.dx *= -1
          board.ball.x = clamp(board.ball.x, board.ball.radius, board.width - board.ball.radius)
        }
        if (board.ball.y - board.ball.radius <= 0) {
          board.ball.dy = Math.abs(board.ball.dy)
          board.ball.y = board.ball.radius
        }

        const paddle = board.paddle
        const ball = board.ball
        if (ball.dy > 0 && ball.y + ball.radius >= paddle.y && ball.y - ball.radius <= paddle.y + paddle.height && ball.x >= paddle.x - ball.radius && ball.x <= paddle.x + paddle.width + ball.radius) {
          const hit = clamp((ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2), -1, 1)
          const speed = Math.min(Math.hypot(ball.dx, ball.dy) * 1.025, board.width * .64)
          ball.dx = speed * hit * 1.08
          ball.dy = -Math.max(speed * .72, board.width * .34)
          ball.y = paddle.y - ball.radius - 1
        }

        const hitIndex = board.bricks.findIndex((brick) => ball.x + ball.radius >= brick.x && ball.x - ball.radius <= brick.x + brick.width && ball.y + ball.radius >= brick.y && ball.y - ball.radius <= brick.y + brick.height)
        if (hitIndex >= 0) {
          const brick = board.bricks[hitIndex]
          const overlapX = Math.min(ball.x + ball.radius - brick.x, brick.x + brick.width - (ball.x - ball.radius))
          const overlapY = Math.min(ball.y + ball.radius - brick.y, brick.y + brick.height - (ball.y - ball.radius))
          if (overlapX < overlapY) ball.dx *= -1
          else ball.dy *= -1
          board.bricks.splice(hitIndex, 1)
          board.score += 100
          if (board.bricks.length === 0) {
            board.status = 'won'
            syncHud(board, 'Grid cleared. That was a clean run.')
          } else {
            setScore(board.score)
            setBlocksLeft(board.bricks.length)
          }
        }

        if (ball.y - ball.radius > board.height) {
          board.lives -= 1
          if (board.lives <= 0) {
            board.status = 'lost'
            syncHud(board, 'Out of returns. Reset the grid for another run.')
          } else {
            board.status = 'ready'
            placeBallOnPaddle(board)
            syncHud(board, 'Ball returned. Launch again and keep the line alive.')
          }
        }
      }

      draw(context, board)
      animationRef.current = requestAnimationFrame(frame)
    }
    animationRef.current = requestAnimationFrame(frame)
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current) }
  }, [draw, getContext, syncHud])

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') { event.preventDefault(); nudgePaddle(-1) }
    if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') { event.preventDefault(); nudgePaddle(1) }
    if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); launch() }
  }

  const actionLabel = status === 'ready' ? 'Launch ball' : status === 'playing' ? 'Ball in play' : status === 'won' ? 'Play again' : 'Reload grid'

  return <section className="block-blaster" aria-labelledby="blaster-heading">
    <div className="site-container block-blaster__layout">
      <div className="blaster-copy">
        <p className="section-kicker">BONUS LEVEL / PLAYABLE DETAIL</p>
        <h2 id="blaster-heading">Block blaster:<br /><em>keep it in play.</em></h2>
        <p>Launch the ball, clear the full grid, and guide the return with the paddle. It is a tiny arcade break built into the portfolio.</p>
        <div className="blaster-actions">
          <button className="primary-button" onClick={launch} disabled={status === 'playing'}>{actionLabel}</button>
          <button className="blaster-reset" onClick={reset}><RotateCcw size={15} /> Reset grid</button>
        </div>
        <p className="blaster-status" aria-live="polite">{message}</p>
      </div>
      <div className="blaster-console">
        <div className="blaster-console__bar"><span>ARCADE BAY / 01</span><span>{status === 'playing' ? 'LIVE' : status === 'won' ? 'CLEARED' : status === 'lost' ? 'GAME OVER' : 'STANDBY'}</span></div>
        <div className="blaster-hud" aria-label="Game score"><span>SCORE <b>{String(score).padStart(4, '0')}</b></span><span>BLOCKS <b>{String(blocksLeft).padStart(2, '0')}</b></span><span>RETURNS <b>{lives}</b></span></div>
        <div className="blaster-board" tabIndex={0} role="application" aria-label="Block Blaster. Move the paddle with left and right arrow keys or A and D. Press space to launch the ball." onKeyDown={onKeyDown}>
          <canvas ref={canvasRef} className="block-blaster__canvas" onPointerMove={(event) => movePaddle(event.clientX)} onPointerDown={(event) => { movePaddle(event.clientX); launch() }} />
          {status !== 'playing' && <div className="blaster-overlay" aria-hidden="true"><strong>{status === 'won' ? 'Grid cleared' : status === 'lost' ? 'Return lost' : 'Ready to launch'}</strong><span>{status === 'won' ? 'Start another run whenever you like.' : status === 'lost' ? 'Reset the grid or launch a new run.' : 'Move with A/D, arrows, or your pointer.'}</span></div>}
        </div>
        <div className="blaster-controls" aria-label="Block Blaster controls"><button onClick={() => nudgePaddle(-1)} aria-label="Move paddle left">←</button><button onClick={launch}>{status === 'playing' ? 'LIVE' : 'LAUNCH'}</button><button onClick={() => nudgePaddle(1)} aria-label="Move paddle right">→</button></div>
      </div>
    </div>
  </section>
}
