const isAlive = (alive, neighbours) =>
  (Boolean(alive) && neighbours === 2) || neighbours === 3 ? 1 : 0;

const generate = width => new Array(width * width).fill(0);

const add = (...args) =>
  args.reduce((accumulator, next) => accumulator + (next || 0), 0);

const leftColumnSum = (index, width, cells) =>
  index % width ? [cells[index - 1 - width], cells[index - 1], cells[index - 1 + width]] : [];
const rightColumnSum = (index, width, cells) =>
  (index + 1) % width ? [cells[index + 1 - width], cells[index + 1], cells[index + 1 + width]] : [];

const countLiveNeighbours = (cells, index) => {
  const width = Math.sqrt(cells.length);
  return add(
    cells[index - width],
    cells[index + width],
    ...leftColumnSum(index, width, cells),
    ...rightColumnSum(index, width, cells)
  );
};

const regenerate = cells =>
  cells.map((cell, index) => isAlive(cell, countLiveNeighbours(cells, index)));

const createElement = className => {
  const element = document.createElement("div");
  element.className = className;
  return element;
};

const drawGrid = cells => {
  const width = Math.sqrt(cells.length);
  const container = createElement("container");
  const grid = document.querySelector("#grid");
  let row;
  cells.forEach((cell, index) => {
    if (index % width === 0) {
      row = createElement("row");
      container.appendChild(row);
    }
    row.appendChild(
      createElement(
        `cell ${cell ? "alive alive" : "dead dead"}-${index}`,
        index
      )
    );
  });
  grid.innerHTML = "";
  grid.appendChild(container);
};

let gameLoop;

const getCellsFromDom = () => {
  const genesis = [];
  document
    .querySelectorAll(".cell")
    .forEach(cell => genesis.push(cell.className.includes("alive") ? 1 : 0));
  return genesis;
};

const start = () => {
  let generation = getCellsFromDom();
  gameLoop = setInterval(() => {
    generation = regenerate(generation);
    game.drawGrid(generation);
  }, 500);
};

const stop = () => clearInterval(gameLoop);

const attachCellClickEvent = () => {
  document.querySelector("#grid").addEventListener("click", event => {
    event.target.className = event.target.className.includes("alive") ?
      event.target.className.replace(/alive/g, "dead") :
      event.target.className.replace(/dead/g, "alive");
  });
};

const game = {
  isAlive,
  generate,
  regenerate,
  getCellsFromDom,
  drawGrid,
  start,
  stop,
  attachCellClickEvent
};

window.game = game;