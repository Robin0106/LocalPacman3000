<script setup lang="ts">
  import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
  import PacmanObject from './PacmanObject.vue';
  import PacmanPoints from './PacmanPoints.vue';
  import PacmanPowerUp from './PacmanPowerUp.vue';
  import GameOver from '../pages/GameOver.vue';
  import PauseOverlay from '../pages/PauseOverlay.vue';
  import Ghost from './Ghosts.vue';
  import type { ComponentPublicInstance } from 'vue';
  import Blinky from '@/assets/Blinky.png'; //Error kann durch Entwicklungsumgebung kann angezeigt werden -> env.d.ts öffnen und er ist weg
  import Pinky from '@/assets/Pinky.png';  //Kann trotzdem gestartet werden und funktionieren
  import Inky from '@/assets/Inky.png';
  import Clyde from '@/assets/Clyde.png';
  import VulnerableGhostGIF from '@/assets/GIFs/VulnerableGhost.gif';
  import VulnerableGhost from '@/assets/Vulnerable.png';
  import { useUserStore } from '@/piniaStore';
  import { playSound, playChomp } from '@/components/sounds/sounds';
  import { useSoundStore } from '@/piniaStore';


  type GhostInstance = ComponentPublicInstance<{
    updateGhostPosition: () => void;
    position: { x: number, y: number };
    resetPosition: (startPosition: { x: number, y: number }) => void;
    setVulnerable: (state: boolean) => void;
    isVulnerable: () => boolean;
  }>;

  type Direction = 'up' | 'down' | 'left' | 'right';

  const userStore = useUserStore()
  const soundStore = useSoundStore();
  const playerId = userStore.userId;
  const isMuted = ref(false);
  const savedMute = localStorage.getItem('isMuted');
  if (savedMute !== null) {
    isMuted.value = savedMute === 'true';
  }

  const isGameStarted = ref(false);
  const areGhostsPaused = ref(false);

  const score = ref(0);
  const highscore = ref(0);
  const lives = ref(3);
  const invulnerable = ref(false);
  const gameOver = ref(false);
  const gamePaused = ref(false);
  const level = ref(0);
  const pointsEatenTotal = ref(0);
  const ghostsEatenTotal = ref(0);

  let startTime: number | null = null;
  let timePlayed: number = 0;

  let pointsEaten : number = 0;
  let numberOfPoints : number = 0;
  let powerUp: boolean = false;
  let ghostsEaten : number = 0;

  let timeoutId: number | undefined;
  let powerUpTimeoutStart: number;
  let powerUpTimeoutDuration: number = 10000;
  let powerUpTimeLeft: number = 0;

  let vulnerableTimeoutId: number | undefined;
  let vulnerableStartTime: number;
  let vulnerableDelay: number = 7000;
  let vulnerableTimeLeft: number = vulnerableDelay;

  let oldHighscore: number = 0;

  interface FloatingScore {
    x: number;
    y: number;
    value: number;
    id: number;
  }

  const floatingScores = ref<FloatingScore[]>([]);
  let floatingScoreId = 0;

  interface GhostData {
    id: number;
    startPosition: { x: number, y: number };
    image: any;
  }

  const ghosts = ref<GhostData[]>([
    { id: 1, startPosition: { x: 345, y: 310 }, image: Blinky },
    { id: 2, startPosition: { x: 345, y: 350 }, image: Pinky },
    { id: 3, startPosition: { x: 320, y: 310 }, image: Inky },
    { id: 4, startPosition: { x: 320, y: 350 }, image: Clyde }
  ]);

  const pacmanStartPosition = { x: 330, y: 570 };

  const pacmanRef = ref();
  const ghostRefs = ref<GhostInstance[]>([]);

  let lastMoveTime = 0;
  const moveInterval = 25;

  const grid = ref([ //0 = Wand, 2 = Geisterspawn, 3 = Punkt, 4 = gegessener Punkt, 5 = PowerUp, 6 = gegessener PowerUp, 9 = Weg(kein Punkt)
  // 1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //1
    [0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0], //2
    [0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0], //3
    [0, 5, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 5, 0], //4
    [0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0], //5
    [0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0], //6
    [0, 3, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 3, 0], //7
    [0, 3, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 3, 0], //8
    [0, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 0], //9
    [0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 9, 0, 0, 9, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0], //10
    [0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 9, 0, 0, 9, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0], //11
    [0, 0, 0, 0, 0, 0, 3, 0, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 0, 0, 3, 0, 0, 0, 0, 0, 0], //12
    [0, 0, 0, 0, 0, 0, 3, 0, 0, 9, 0, 0, 0, 2, 2, 0, 0, 0, 9, 0, 0, 3, 0, 0, 0, 0, 0, 0], //13
    [0, 0, 0, 0, 0, 0, 3, 0, 0, 9, 0, 2, 2, 2, 2, 2, 2, 0, 9, 0, 0, 3, 0, 0, 0, 0, 0, 0], //14
    [9, 9, 9, 9, 9, 9, 3, 9, 9, 9, 0, 2, 2, 2, 2, 2, 2, 0, 9, 9, 9, 3, 9, 9, 9, 9, 9, 9], //15
    [0, 0, 0, 0, 0, 0, 3, 0, 0, 9, 0, 2, 2, 2, 2, 2, 2, 0, 9, 0, 0, 3, 0, 0, 0, 0, 0, 0], //16
    [0, 0, 0, 0, 0, 0, 3, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 3, 0, 0, 0, 0, 0, 0], //17
    [0, 0, 0, 0, 0, 0, 3, 0, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 0, 0, 3, 0, 0, 0, 0, 0, 0], //18
    [0, 0, 0, 0, 0, 0, 3, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 3, 0, 0, 0, 0, 0, 0], //19
    [0, 0, 0, 0, 0, 0, 3, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 3, 0, 0, 0, 0, 0, 0], //20
    [0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0], //21
    [0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0], //22
    [0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0], //23
    [0, 5, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3, 5, 0], //24
    [0, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 0], //25
    [0, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 0], //26
    [0, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 0], //27
    [0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0], //28
    [0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0], //29
    [0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0], //30
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //31
  //[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //32
  ]);

  /*
  const highlightedCells = computed(() => {
    return grid.flatMap((row, rowIndex) =>
      row.map((cell, colIndex) => (cell === 3 ? { row: rowIndex, col: colIndex } : null))
    ).filter((cell): cell is { row: number, col: number } => cell !== null);
  });
  */
  const showPoints = computed(() => {
    return grid.value.flatMap((row, rowIndex) =>
      row.map((cell, colIndex) => (cell === 3 ? { row: rowIndex, col: colIndex } : null))
    ).filter((cell): cell is { row: number, col: number } => cell !== null);
  });

  const showPowerUp = computed(() => {
    return grid.value.flatMap((row, rowIndex) =>
      row.map((cell, colIndex) => (cell === 5 ? { row: rowIndex, col: colIndex } : null))
    ).filter((cell): cell is { row: number, col: number } => cell !== null);
  });

  function startGame() {
    isGameStarted.value = true;
    startTime = Date.now();
  }

  function gameLoop(timestamp: number) {
    if (gameOver.value) return;
    if (gamePaused.value) return;

    checkPoints();
    if (timestamp - lastMoveTime > moveInterval) {
      pacmanRef.value?.updatePacmanPosition();
      if(isGameStarted.value&& !areGhostsPaused.value){
        ghostRefs.value.forEach(ref => {
        ref?.updateGhostPosition();
        });
      }

    if (checkCollisionAndHandle()) {
      return;
    }

    lastMoveTime = timestamp;
    }
    requestAnimationFrame(gameLoop);
    } onMounted(() => {
      const waitForRefs = setInterval(() => {
    if (pacmanRef.value && ghostRefs.value) {
      clearInterval(waitForRefs);
      requestAnimationFrame(gameLoop);
      countPointsInGrid(grid.value);
      console.log("Game Start!");
    }
  }, 10);
  });

  function pacmanAndGhostCollide(pos1, pos2) {
    return (
    pos1.x + 3.75 < pos2.x + 31.25 &&
    pos1.x + 31.25 > pos2.x + 3.75 &&
    pos1.y + 3.75 < pos2.y + 31.25 &&
    pos1.y + 31.25 > pos2.y + 3.75
    );
  }

  function checkCollisionAndHandle(): boolean {
    const pacmanPos = pacmanRef.value?.position;
    for (let idx = 0; idx < ghostRefs.value.length; idx++) {
      const ref = ghostRefs.value[idx];
      if (ref && pacmanAndGhostCollide(pacmanPos, ref.position)) {
        if(powerUp  && ref.isVulnerable()){
          eatGhost(idx);
          ref.setVulnerable(false);
        } else{
          if (!invulnerable.value) {
            if (lives.value === 1) {
              gameOverHandler();
              return true; // Game Over, Gameloop soll abbrechen
            }
            eatPacman();
          }
        }
      }
    }
    return false;
  }

  function eatPacman() {
    if (!soundStore.isMuted) {
      playSound("death");
    }
    lives.value = lives.value - 1;
    invulnerable.value = true;
    areGhostsPaused.value = true;
    floatingScores.value = [];
    setTimeout(() => {
      areGhostsPaused.value = false;
      invulnerable.value = false;
    }, 3000);

    if(powerUp){
      resetPowerUp();
    }

    pacmanRef.value?.resetPosition(pacmanStartPosition);

    ghostRefs.value.forEach((ghostRef, idx) => {
      ghostRef?.resetPosition(ghosts.value[idx].startPosition);
    });
  }

  function gameOverHandler() {
    if(!isMuted.value) playSound('death');
    gameOver.value = true;
    lives.value = lives.value - 1;
    console.log('Game Over! Pacman wurde gefangen.');
    if (highscore.value < score.value) {
      highscore.value = score.value;
    }
    console.log("Highscore: " + highscore.value);
    if (!gamePaused.value && startTime !== null) {
      timePlayed += Date.now() - startTime;
      console.log("Time played in ms: " + timePlayed);
    }
    sendGameData();
  }

  function eatGhost(ghostIdx: number){
    if (!soundStore.isMuted) {
      playSound("eatGhost");
    }
    let scoreValue = 0;
    ghostsEatenTotal.value += 1;
    switch (ghostsEaten) {
      case 0:
        scoreValue = 200;
        score.value += 200;
        ghostsEaten++;
        console.log("Geist gegessen (0)");
        break;
      case 1:
        scoreValue = 400;
        score.value += 400;
        ghostsEaten++;
        console.log("Geist gegessen (1)");
        break;
      case 2:
        scoreValue = 800;
        score.value += 800;
        ghostsEaten++;
        console.log("Geist gegessen (2)");
        break;
      case 3:
        scoreValue = 1600;
        score.value += 1600;
        ghostsEaten = 0;
        console.log("Geist gegessen (3)");
        break;
      default:
        console.log("Unexpexted state of ghostsEaten:");
        console.log(ghostsEaten);
    }
    scorePopUp(ghostIdx,scoreValue);
    switch (ghostIdx){
      case 0:
        ghosts.value[ghostIdx].image = Blinky;
        break;
      case 1:
        ghosts.value[ghostIdx].image = Pinky;
        break;
      case 2:
        ghosts.value[ghostIdx].image = Inky;
        break;
      case 3:
        ghosts.value[ghostIdx].image = Clyde;
        break;
      default:
        console.log("Unexpexted state of ghostIndex:");
        console.log(ghostIdx);
    }
    console.log(ghostIdx);
    ghostRefs.value[ghostIdx]?.resetPosition(ghosts.value[ghostIdx].startPosition);
  }

  function scorePopUp(ghostIdx: number, scoreValue :number){
    floatingScores.value = [];
    const ghostPos = ghostRefs.value[ghostIdx]?.position;
    if (ghostPos) {
    floatingScores.value.push({
      x: ghostPos.x,
      y: ghostPos.y,
      value: scoreValue,
      id: floatingScoreId++
    });
    setTimeout(() => {
      floatingScores.value = floatingScores.value.filter(fs => fs.id !== floatingScoreId - 1);
    }, 1000);
  }
  }

  function updateGrid({ row, col, value }) {
    grid.value[row][col] = value;
    if(value == 4||value ==6){
      updatePoints(value);
    }
  }

  function updatePoints(value){
    if(value==4){
      if (!soundStore.isMuted) {
        playChomp();
      }
      score.value += 10;
      pointsEaten ++;
      pointsEatenTotal.value += 1;
    } else {
      if (!soundStore.isMuted) {
        playSound("eatPowerpill");
      }
      score.value += 50;
      pointsEaten ++;
      startPowerUp();
    }
  }

  function startPowerUp(){
    console.log("PowerUp gegessen");
    clearTimeout(timeoutId);
    clearTimeout(vulnerableTimeoutId);
    powerUp = true;
    ghostsEaten = 0;
    ghostRefs.value.forEach(ref => ref?.setVulnerable(true));

    ghosts.value[0].image = VulnerableGhost;
    ghosts.value[1].image = VulnerableGhost;
    ghosts.value[2].image = VulnerableGhost;
    ghosts.value[3].image = VulnerableGhost;

    vulnerableStartTime = Date.now();
    vulnerableDelay = 7000;
    vulnerableTimeoutId = window.setTimeout(() => {
      for (let i = 0; i < ghostRefs.value.length; i++) {
        if (ghostRefs.value[i]?.isVulnerable && ghostRefs.value[i].isVulnerable()) {
          ghosts.value[i].image = VulnerableGhostGIF;
        }
      }
    }, vulnerableDelay);

    powerUpTimeoutStart = Date.now();
    powerUpTimeoutDuration = 10000;
    timeoutId = window.setTimeout(() => {
      resetPowerUp();
    }, powerUpTimeoutDuration);
  }



  function resetPowerUp(){
    powerUp = false;
    ghostsEaten = 0;

    ghosts.value[0].image = Blinky;
    ghosts.value[1].image = Pinky;
    ghosts.value[2].image = Inky;
    ghosts.value[3].image = Clyde;

    console.log("PowerUp zu Ende");
    ghostRefs.value.forEach(ref => ref?.setVulnerable(false));

    powerUpTimeLeft = 0;
    powerUpTimeoutDuration = 10000;
    vulnerableDelay = 7000;
  }

  function checkPoints(){
    if(pointsEaten >= numberOfPoints){
      resetPoints(grid.value);
      resetPowerUp();
    }
  }

  function resetPoints(grid: number[][]){
    if (!soundStore.isMuted) {
      playSound("intermission");
    }
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col] === 4) {
         grid[row][col] = 3;
        } else if (grid[row][col] === 6) {
          grid[row][col] = 5;
        }
      }
    }
    pointsEaten = 0;
    level.value += 1;
    floatingScores.value = [];
    pacmanRef.value?.resetPosition(pacmanStartPosition);
    ghostRefs.value.forEach((ghostRef, idx) => {
      ghostRef?.resetPosition(ghosts.value[idx].startPosition);
    });
    areGhostsPaused.value = true;
      setTimeout(() => {
      areGhostsPaused.value = false;
    }, 1000);
  }

  function countPointsInGrid(grid: number[][]) {
    let count3 = 0;
    let count5 = 0;

    for (const row of grid) {
        for (const cell of row) {
            if (cell === 3) count3++;
            if (cell === 5) count5++;
        }
    }

    const total = count3 * 10 + count5 * 50;
    console.log(count3, count5, total);
    numberOfPoints = count3 + count5;
  }

  function restartGame(){
    if (!soundStore.isMuted) {
      playSound("intro");
    }
    resetPowerUp();
    resetPoints(grid.value);
    floatingScores.value = [];

    score.value = 0;
    lives.value = 3;
    level.value = 0;
    ghostsEatenTotal.value = 0;
    pointsEatenTotal.value = 0;
    invulnerable.value = false;
    isGameStarted.value = false;
    startTime = Date.now();
    timePlayed = 0;

    gameOver.value = false;
    requestAnimationFrame(gameLoop);
  }

  function pauseGame() {
    if (startTime !== null) {
      timePlayed += Date.now() - startTime;
      console.log("Time played in ms: " + timePlayed);
    }
    gamePaused.value = true;
    console.log("Game paused");
    pausePowerUp();
  }

  function resumeGame() {
    gamePaused.value = false;
    console.log("Game resumed");
    resumePowerUp();
    startTime = Date.now();
    requestAnimationFrame(gameLoop);
  }

  function pausePowerUp(){
    if (powerUp){
      clearTimeout(timeoutId);
      clearTimeout(vulnerableTimeoutId);
      let timePassed = Date.now() - powerUpTimeoutStart;
      powerUpTimeLeft = powerUpTimeoutDuration - timePassed;
      timePassed = Date.now() - vulnerableStartTime;
      vulnerableTimeLeft = vulnerableDelay - timePassed
      console.log("PowerUp paused, time left: " + powerUpTimeLeft);
      console.log("Vulnerable time left: " + vulnerableTimeLeft);
    }
  }

  function resumePowerUp(){
    if (powerUp && powerUpTimeLeft > 0){
      powerUpTimeoutStart = Date.now();
      powerUpTimeoutDuration = powerUpTimeLeft;
      timeoutId = window.setTimeout(() => {
        resetPowerUp();
      }, powerUpTimeoutDuration);
      powerUpTimeLeft = 0;
      if (vulnerableTimeLeft>0){
        vulnerableStartTime = Date.now();
        vulnerableDelay = vulnerableTimeLeft;
        vulnerableTimeoutId = window.setTimeout(() => {
          for (let i = 0; i < ghostRefs.value.length; i++) {
            if (ghostRefs.value[i]?.isVulnerable && ghostRefs.value[i].isVulnerable()) {
              ghosts.value[i].image = VulnerableGhostGIF;
            }
          }
        }, vulnerableDelay);
        vulnerableTimeLeft = 0;
      }
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    const key = e.key.toLowerCase();
    const startKeys = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'];
    if (!isGameStarted.value && startKeys.includes(key)) {
      startGame();
    }
    if (e.key === "Escape") {
      if (!gamePaused.value && !gameOver.value) {
        pauseGame();
      } else {
        if (!gameOver.value && gamePaused.value) {
          resumeGame();
        }
      }
    }
    if (pacmanRef.value && keyToDirection[key]) {
      pacmanRef.value.setNextDirection(keyToDirection[key]);
    }
  }

  const keyToDirection: Record<string, Direction> = {
    w: 'up',
    s: 'down',
    a: 'left',
    d: 'right',
    arrowup: 'up',
    arrowdown: 'down',
    arrowleft: 'left',
    arrowright: 'right',
  };

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
    fetchHighscore().then((backendhighscore) => {
      highscore.value = backendhighscore || 0;
    });
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
  });

  const sendGameData = async () => {
    if (!playerId){
      console.log("Player ID is not set or Player is not logged in. Cannot send game data.");
      return;
    }
    console.log("Sending game data...");
    try {
      const response = await fetch(import.meta.env.VITE_BASE_URL + `api/gameover`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerID: playerId,
          points: score.value,
          ghostsEaten: ghostsEatenTotal.value,
          levelsWon: level.value,
          pillsSwallowed: pointsEatenTotal.value,
          timePlayed: timePlayed
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      console.log('Game data sent successfully');
    } catch (error) {
      console.error('Error sending game data:', error);
    }
  };

  const fetchHighscore = async () => {
    if (!playerId) {
      console.log("Player ID fehlt. Highscore kann nicht abgefragt werden.");
      return;
    }
    try {
      const response = await fetch(import.meta.env.VITE_BASE_URL + `api/gameover?playerID=${playerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const highscore = await response.json();

      console.log('Highscore:', highscore);
      return highscore;
    } catch (error) {
      console.error('Fehler beim Abrufen des Highscores:', error);
    }
  };

  function mute() {
    isMuted.value = true;
    console.log(isMuted.value);
    console.log("Sound muted");
  }

  function unmute() {
    isMuted.value = false;
    console.log(isMuted.value);
    console.log("Sound unmuted");
  }

  watch(isMuted, (val) => {
    localStorage.setItem('isMuted', val ? 'true' : 'false');
  });
</script>

<template>
  <div v-bind="$attrs">

  <GameOver
    v-if="gameOver"
    :score="score"
    :highscore="highscore"
    :level="level"
    :ghosts-eaten-total="ghostsEatenTotal"
    :points-eaten-total="pointsEatenTotal"
    @restart="restartGame"
  />

  <PauseOverlay
    v-if="gamePaused"
    :score="score"
    :is-sound-muted="isMuted"
    @resume="resumeGame"
    @mute="mute"
    @unmute="unmute"
  />

  <div id="game-field" class="game-field">
    <div class="game-wrapper">
      <div class="score-display">
        <span>Points: {{ score }}</span>
        <div class="lives">
        <img
          v-for="n in [3,2,1]"
          :key="n"
          src = '@/assets/Herz.png'
          alt="Herz"
          class="heart"
          :class="{ lost: n > lives }"
        />
        </div>
      </div>

      <div class="pacman-container">
      <img class="pacman-maze" src="@/assets/PacManMaze.png">
      <PacmanObject ref="pacmanRef" class="pacman" :grid="grid" :start-position="pacmanStartPosition" @update-grid="updateGrid"></PacmanObject>
      <Ghost
        v-for="(ghost, index) in ghosts"
        :key="ghost.id"
        ref="ghostRefs"
        class="ghost"
        :ghost-index="index"
        :start-position="ghost.startPosition"
        :image="ghost.image"
        :grid="grid"
        @update-grid="updateGrid"
      />
      <div v-for="(cell, index) in showPoints" :key="`point-${index}`" class="showPoints" :style="{ gridRow: cell.row + 1, gridColumn: cell.col + 1 }">
        <PacmanPoints></PacmanPoints>
      </div>
      <div v-for="(cell, index) in showPowerUp" :key="`powerup-${index}`" class="showPowerUp" :style="{ gridRow: cell.row + 1, gridColumn: cell.col + 1 }">
        <PacmanPowerUp></PacmanPowerUp>
      </div>
      <div
        v-for="score in floatingScores"
        :key="score.id"
        class="floating-score"
        :style="{
        left: score.x + 'px',
        top: score.y + 'px'
        }"
      >
      {{ score.value }}
      </div>
    </div>
  </div>
</div>
</div>
</template>

<style scoped>
  .game-wrapper {
  display: grid;
  grid-template-rows: auto 1fr;
  justify-items: center; /* Zentriert Score und Grid */
  align-items: start;
  }

  .game-field {
    background-color: black;
  }

  .pacman-maze {
    width: 700px;
    height: 775px;
    margin: 0;
    padding: 0;
    image-rendering: auto;
    image-rendering: crisp-edges;
    image-rendering: pixelated;
    background-color: black;
    -webkit-user-drag: none;
  }

  .pacman-container {
    position: relative;
    display: grid;
    grid-template-columns: repeat(28, 25px);
    grid-template-rows: repeat(31, 25px);
   /* border: 1px solid red; */
  }

  .highlight {
    background-color: yellow;
    opacity: 0.2;
  }

  .pacman{
    position: absolute;
  }

  .ghost{
    position: absolute;
  }

  .showPoints {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .showPowerUp {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .score-display {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: 3rem;
    font-weight: bold;
    color: white;
    margin-bottom: 20px;
    letter-spacing: 2px;
    background-color: black;
  }

  .lives {
    display: flex;
    gap: 10px;
  }

  .heart {
    width: 40px;
    height: 40px;
    transition: opacity 0.3s;
    -webkit-user-drag: none;
  }

  .heart.lost {
    opacity: 0.2;
  }

  .floating-score {
    position: absolute;
    color: yellow;
    font-size: 24px;
    font-weight: bold;
    z-index: 100;
  }

</style>
