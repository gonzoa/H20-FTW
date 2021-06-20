const MOVE_SPEED = 200
layer(['obj', 'ui',], 'obj')

addLevel([
  '!^^^^^^^^^^^^    &',
  '!^^^^^^^^^^^^    &',
  '!^^^^^^^^^^^^    &', 
  '!                &',
  '!                &',
  '!                &',
  '!                &',
  '!                &',
  '!                &',
  '!                &',
  '!                &',
  '!                &',
  '!                &',
  '!                &',
  '!                &',
], {
  width: 30,
  height: 22,
  '^' : [ sprite('plant'), scale(0.1), 'plant'],
  '!' : [ sprite('wall'), 'left-wall'],
  '&' : [ sprite('wall'), 'right-wall'],
})

const player = add([
  sprite('hose'),
  pos(width() / 2, height() / 2),
  origin('center')
])

keyDown('left', () => {
  player.move(-MOVE_SPEED, 0)
})

keyDown('right', () => {
  player.move(MOVE_SPEED, 0)
})

const Water_SPEED = 150
function spawnWater(w) {
  add([
    rect(6,18), 
    pos(w), 
    origin('center'), 
    color(0.5, 0.5, 1),
    'water'
    ])
}

keyPress('space', () => {
spawnWater(player.pos.add(0, -25))
})

action('water', (w) => {
  w.move(0, -Water_SPEED)
  if (w.pos.y < 0) {
    destroy(w)
  }
})

collides('water', 'plant', (w,p) => {
  camShake(4)
  destroy(w)
  destroy(p)
  score.value++
  score.text = score.value
})

const score = add([
  text('0'),
  pos(50, 50),
  layer('ui'),
  scale(3),
  {
    value: 0,
  }
])

const TIME_LEFT = 15

const timer = add([
  text('0'),
  pos(100,50),
  scale(2),
  layer('ui'),
  {
    time: TIME_LEFT,
  },
])


timer.action(() =>  {
  timer.time -= dt()
  timer.text = timer.time.toFixed(2)
  if (timer.time <= 0 ) {
    go('lose', { score: score.value })
  }
})

const PLANT_SPEED= 50
let CURRENT_SPEED= PLANT_SPEED


action('plant', (p) => {
  p.move(PLANT_SPEED, 0)
})

const LEVEL_DOWN= 100

collides('plant', 'right-wall', () => {
  CURRENT_SPEED = -PLANT_SPEED
  every('plant', (p) => {
    p.move(0, LEVEL_DOWN)
  })
})

collides('plant', 'left-wall', () => {
  CURRENT_SPEED =  PLANT_SPEED
  every('plant', (p) => {
    p.move(0, LEVEL_DOWN)
  })
})

player.overlaps('plant', (p) => {
  go('lose', { score: score.value })
})

action('plant', (p) => {
  if (p.pos.y >= (12 * 22)) {
      go('lose', { score: score.value })
  }
})