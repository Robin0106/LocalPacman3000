<script setup lang="ts">
    import { ref , computed, watch  } from "vue";

  type Direction = 'up' | 'down' | 'left' | 'right';

  const props = defineProps<{ grid: number[][] ,
    ghostIndex: number,
    startPosition: { x: number, y: number },
    image: string
  }>();
  const position = ref({ ... props.startPosition });
  const vulnerable = ref(false);
  const isFlipped = ref(false);
  const ghostImageStyle = computed(() => ({
  transform: isFlipped.value ? 'scaleX(-1)' : 'scaleX(1)'
  }));

  const hitboxOffsetUp = -8;
  const hitboxOffsetLeft = -8;

  const currentDirection = ref<Direction|null>('up');

  let currentCollisions :Direction[] = [];
  let prevCollisions :Direction[] = [];
  let isAllowedToMoveOver :number = 2;

  const canMoveToDirections: Record<Direction, { x1: number; y1: number; x2: number; y2: number }> = {
    up:     { x1: -2.5,  y1: -5,    x2:  20,   y2: -5},
    down:   { x1: -2.5,  y1:  22.5, x2:  20,   y2:  22.5},
    left:   { x1: -5,    y1: -2.5,  x2: -5,    y2:  20},
    right:  { x1:  22.5, y1: -2.5,  x2:  22.5, y2:  20},
  };

  const moveToDirection: Record<Direction, { x: number; y: number }> = {
    up: { x: 0, y: -2.5 },
    down: { x: 0, y: 2.5 },
    left: { x: -2.5, y: 0 },
    right: { x: 2.5, y: 0 },
  };

  const canMoveTo = (x: number, y: number) => {
    const col = Math.floor((x - hitboxOffsetLeft) / 25);
    const row = Math.floor((y - hitboxOffsetUp) / 25);
    return props.grid[row] && props.grid[row][col] >= isAllowedToMoveOver;
  };

  function getCollisions(pos: {x:number,y:number}):Direction[]{
    const directions: Direction[] = ['up','down','left','right'];
    const collisions: Direction[] = [];

    for(const dir of directions){
      if(!canMoveInDirection(dir,pos)){
        collisions.push(dir)
      }
    }
    return collisions;
  }

  function canMoveInDirection(dir: Direction, pos: { x: number, y: number }) {
    const vec = canMoveToDirections[dir];
    return canMoveTo(pos.x + vec.x1, pos.y + vec.y1) && canMoveTo(pos.x + vec.x2, pos.y + vec.y2);
  }

  function getNextDirection(){
    currentCollisions = getCollisions(position.value);
    if(currentCollisions.length>prevCollisions.length){
      prevCollisions = currentCollisions;
    }
    if(JSON.stringify(currentCollisions) !== JSON.stringify(prevCollisions)){
      if(currentDirection.value === 'right'&&!prevCollisions.includes('right')){
        prevCollisions.push('right');
      }
      if(currentDirection.value === 'down' && !prevCollisions.includes('down')){
        prevCollisions.push('down');
      }
      if(currentDirection.value === 'left'&&!prevCollisions.includes('left')){
        prevCollisions.push('left');
      }
      if(currentDirection.value === 'up'&&!prevCollisions.includes('up')){
        prevCollisions.push('up');
      }
      const ways = prevCollisions.filter(dir =>{
        return !currentCollisions.includes(dir)
      })
      currentDirection.value = ways[Math.floor(Math.random()*ways.length)];
      prevCollisions = [];
      if(isAllowedToMoveOver === 2){
        isAllowedToMoveOver = 3; //Der Geist hat mit der ersten Richtungsänderung sein Zuhause verlassen und soll nicht mehr zurück können
      }
    }
  }

  function updateGhostPosition() {
    getNextDirection();
    if (currentDirection.value) {
      if(position.value.x===5&&position.value.y===345){
        position.value.x=670;
      } else {
        if(position.value.x===670&&position.value.y===345){
          position.value.x=10;
        }
      }
      const vec = moveToDirection[currentDirection.value];
      const newX1 = position.value.x + (2 * vec.x);
      const newY1 = position.value.y + (2 * vec.y);
      const newX2 = position.value.x + (2 * vec.x) + 20;
      const newY2 = position.value.y + (2 * vec.y) + 20;

      if (canMoveTo(newX1, newY1) && canMoveTo(newX2, newY2)) {
        position.value.x = newX1;
        position.value.y = newY1;
        } else {
          currentDirection.value = null;
        }
    }
  }

  watch(
  () => currentDirection.value,
  (newDir) => {
    if (newDir === 'left') {
      isFlipped.value = false;
    } else if (newDir === 'right') {
      isFlipped.value = true;
    }
    // Für up/down bleibt der aktuelle Zustand erhalten
  }
);

  function resetPosition(startPosition: { x: number, y: number }) {
    isAllowedToMoveOver = 2;
    position.value.x = startPosition.x;
    position.value.y = startPosition.y;
    currentDirection.value = 'up';
    prevCollisions = [];
    isFlipped.value = false;
  }

  function setVulnerable(state: boolean) {
    vulnerable.value = state;
  }

  function isVulnerable() {
    return vulnerable.value;
  }

  defineExpose({
    updateGhostPosition,
    position,
    resetPosition,
    setVulnerable,
    isVulnerable
  });
</script>

<template>
  <div :style="{ left: position.x + 'px', top: position.y + 'px' }">
  <img class="ghost" :src="props.image" :alt="`Ghost ${props.ghostIndex}`" :style="ghostImageStyle" />
  </div>
</template>

<style scoped>
    .ghost {
        position:absolute;
        top: 0px;
        left: 0px;
        width: 35px;
        height: 35px;
      -webkit-user-drag: none;
    }
</style>
