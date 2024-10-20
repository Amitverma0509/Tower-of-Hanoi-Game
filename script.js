let draggedDisk = null;
let turnCounter = 0;
let moveHistory = [];

const turnDisplay = document.getElementById('turnCounter');
const rods = document.querySelectorAll('.rod');
const messageDisplay = document.getElementById('message');
const combinationDisplay = document.getElementById('combination');

function initializeGame() {
    const diskCount = parseInt(document.getElementById('diskCount').value);
    resetGame();
    adjustRodHeight(diskCount);
    generateDisks(diskCount);
    updateCombinationDisplay(diskCount);
}

function resetGame() {
    rods.forEach(rod => (rod.innerHTML = ''));
    turnCounter = 0;
    moveHistory = [];
    turnDisplay.textContent = turnCounter;
    messageDisplay.textContent = '';
}

function updateCombinationDisplay(diskCount) {
    const combinations = Math.pow(2, diskCount) - 1;
    combinationDisplay.textContent = `(${"min "+combinations})`;
}

function adjustRodHeight(count) {
    const maxHeight = Math.max(150, count * 35);
    rods.forEach(rod => (rod.style.height = `${maxHeight}px`));
}

function generateDisks(count) {
    const rod1 = document.getElementById('rod1');
    const maxDiskWidth = 140;
    const minDiskWidth = 50;
    const widthStep = (maxDiskWidth - minDiskWidth) / (count - 1);
  
    for (let i = count; i >= 1; i--) {
      const disk = document.createElement('div');
      disk.classList.add('disk');
      disk.style.width = `${minDiskWidth + (i - 1) * widthStep}px`;
      disk.style.backgroundColor = `hsl(${(i * 40) % 360}, 70%, 70%)`;
      disk.setAttribute('id', `disk${i}`);
      disk.setAttribute('draggable', 'true');
  
      disk.addEventListener('dragstart', dragStart);
      disk.addEventListener('dragend', dragEnd);
  
      rod1.appendChild(disk);
    }
}

function dragStart(event) {
    const disk = event.target;
    const parentRod = disk.parentElement;
    const topDisk = parentRod.lastElementChild;

    if (disk === topDisk) {
      draggedDisk = disk;
      event.dataTransfer.setData('text/plain', disk.id);
    } else {
      event.preventDefault(); 
    }
}

function dragEnd() {
    draggedDisk = null;
}

function dragOver(event) {
    event.preventDefault();
    const topDisk = event.currentTarget.lastElementChild;
  
    if (!topDisk || draggedDisk.clientWidth < topDisk.clientWidth) {
      event.currentTarget.style.backgroundColor = "#a29bfe";
    }
}
  
function drop(event) {
    event.preventDefault();
    event.currentTarget.style.backgroundColor = "#dcdcdc";
    const topDisk = event.currentTarget.lastElementChild;
  
    if (!topDisk || draggedDisk.clientWidth < topDisk.clientWidth) {
      const previousRod = draggedDisk.parentElement;
      event.currentTarget.appendChild(draggedDisk);
  
      incrementTurn();
      moveHistory.push({
        disk: draggedDisk.id,
        from: previousRod.id,
        to: event.currentTarget.id,
      });
  
      checkWin();
    }
}

function incrementTurn() {
    turnCounter++;
    turnDisplay.textContent = turnCounter;
}

function checkWin() {
    const diskCount = parseInt(document.getElementById('diskCount').value);
    const rod2 = document.getElementById('rod2');
    const rod3 = document.getElementById('rod3');
  
    if (rod2.childElementCount === diskCount || rod3.childElementCount === diskCount) {
      messageDisplay.textContent = 'Wins! 🎉';
    }
}

function undoLastMove() {
    if (moveHistory.length > 0) {
      const lastMove = moveHistory.pop();
      const disk = document.getElementById(lastMove.disk);
      const fromRod = document.getElementById(lastMove.from);
  
      fromRod.appendChild(disk);
  
      disk.classList.add('animate-undo');
      disk.addEventListener('animationend', () => {
        disk.classList.remove('animate-undo');
      });
  
      turnCounter--;
      turnDisplay.textContent = turnCounter;
    }
}

rods.forEach(rod => {
    rod.addEventListener('dragover', dragOver);
    rod.addEventListener('drop', drop);
});