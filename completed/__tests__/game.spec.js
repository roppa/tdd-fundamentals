require("../game");
const {
  isAlive,
  generate,
  regenerate,
  drawGrid,
  start,
  getCellsFromDom
} = window.game;

jest.useFakeTimers();

describe("game of life", () => {
  describe("algorithm", () => {
    it("should return 0 when dead cell with > 3 or < 3 neighbours", () => {
      expect(isAlive(0, 0)).toBe(0);
      expect(isAlive(0, 1)).toBe(0);
      expect(isAlive(0, 2)).toBe(0);
      expect(isAlive(0, 4)).toBe(0);
    });

    it("should return 1 when dead cell with exactly 3 neighbours", () => {
      expect(isAlive(0, 3)).toBe(1);
    });

    it("should return 0 when live cell with < 2 neighbours", () => {
      expect(isAlive(1, 0)).toBe(0);
    });

    it("should return 1 when live cell with 2 or 3 neighbours", () => {
      expect(isAlive(1, 2)).toBe(1);
      expect(isAlive(1, 3)).toBe(1);
    });

    it("should return 0 when live cell with > 3 neighbours", () => {
      expect(isAlive(1, 4)).toBe(0);
    });
  });

  describe("generate cells", () => {
    it("should return array of length * length", () => {
      const cells1 = generate(1);
      const cells2 = generate(2);
      expect(cells1).toEqual([0]);
      expect(cells2).toEqual([0, 0, 0, 0]);
    });
  });

  describe("regenerate cells", () => {
    it("single cell should stay the same", () => {
      const cells = [0];
      expect(regenerate(cells)).toEqual(cells);
    });

    it("block of 2 * 2 cells should stay the same", () => {
      const cells = [1, 1, 1, 1];
      expect(regenerate(cells)).toEqual(cells);
    });

    it("corner cells should mutate", () => {
      const cells = [1, 1, 0, 0, 0, 0, 1, 0, 0];
      const expected = [0, 0, 0, 1, 1, 0, 0, 0, 0];
      expect(regenerate(cells)).toEqual(expected);
    });

    it("should update cells based on result of neighbours", () => {
      const cells = [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ];
      const expected = [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ];
      const result = regenerate(cells);
      expect(result).toEqual(expected);
      expect(regenerate(result)).toEqual(cells);
    });

    it("should not change cells for stalemate", () => {
      const cells = [0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0];
      const result = regenerate(cells);
      expect(result).toEqual(cells);
    });
  });

  describe("creating dom cells", () => {
    test("draw a grid with square root of 3", () => {
      document.body.innerHTML = '<section id="grid"></section>';
      const cells = generate(3);
      cells[0] = 1;
      drawGrid(cells);
      expect(document.querySelectorAll(".container").length).toBe(1);
      expect(document.querySelectorAll(".cell").length).toBe(9);
      expect(document.querySelectorAll(".dead-0").length).toBe(0);
      expect(document.querySelectorAll(".alive-0").length).toBe(1);
      expect(document.querySelectorAll(".dead-9").length).toBe(0);
      expect(document.querySelectorAll(".row").length).toBe(3);
    });
  });

  describe("start game, iterate cycles of life", () => {
    test("should call regenerate", () => {
      const spy = jest.spyOn(game, "drawGrid");
      start([0]);
      jest.runOnlyPendingTimers();
      expect(setInterval).toHaveBeenCalled();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe("start button", () => {
    test("clicking start button should start game", () => {
      document.body.innerHTML =
        '<button id="start"></button><section id="grid"></section>';
      const spy = jest.spyOn(game, "start");
      const startButton = document.getElementById("start");
      startButton.onclick = game.start([1]);
      startButton.click();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe("stop button", () => {
    test("clicking stop button should stop game", () => {
      document.body.innerHTML =
        '<button id="start"></button><button id="stop" disabled></button><section id="grid"></section>';
      const spy = jest.spyOn(game, "stop");
      const startButton = document.getElementById("start");
      const stopButton = document.getElementById("stop");
      startButton.onclick = game.start([1]);
      stopButton.onclick = game.stop();
      startButton.click();
      stopButton.click();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe("get live cells from grid", () => {
    test("should return empty array for no cells", () => {
      document.body.innerHTML = '<section id="grid"></section>';
      expect(getCellsFromDom()).toEqual([]);
    });

    test("should return [0] for 1 cell", () => {
      document.body.innerHTML =
        '<section id="grid"><div class="cell"></section>';
      expect(getCellsFromDom()).toEqual([0]);
    });

    test("should return [1] for 1 alive cell", () => {
      document.body.innerHTML =
        '<section id="grid"><div class="cell alive"></section>';
      expect(getCellsFromDom()).toEqual([1]);
    });
  });

  describe("setup live cells", () => {
    test("clicking a cell should toggle alive/dead", () => {
      document.body.innerHTML = '<section id="grid"></section>';
      game.attachCellClickEvent();
      const cells = generate(3);
      game.drawGrid(cells);
      expect(document.querySelectorAll(".dead").length).toBe(9);
      expect(document.querySelectorAll(".alive").length).toBe(0);
      document.querySelectorAll(".dead")[0].click();
      expect(document.querySelectorAll(".dead").length).toBe(8);
      expect(document.querySelectorAll(".alive").length).toBe(1);
      document.querySelectorAll(".alive")[0].click();
      expect(document.querySelectorAll(".dead").length).toBe(9);
      expect(document.querySelectorAll(".alive").length).toBe(0);
    });
  });
});