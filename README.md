# Javascript Test Driven Development for the real world

Pre-requisites: working knowledge of javascript
Goal: to create a working example of 'The Game of Life' by using Test Driven Techniques
Purpose: to get a working understanding of tests, different types of tests, and test driven development
Tools: Node.js (> v8.4.0), an IDE such as VS Code, a Browser

## Definitions

<dl>
  <dt>Assertion</dt>
  <dd>to state something confidently and forcefully. This means stating an 'is-ness'; 'This is WRONG'. This then equates to a boolean, is it true or false? true would mean a passing test</dd>
  <dt>Interface</dt>
  <dd>a part of software or hardware that facilitates communication</dd>
  <dt>Unit test</dt>
  <dd>focus on one part of the software. A unit test can be run in isolation - it must not rely on the state of any previous tests</dd>
  <dt>Regression testing</dt>
  <dd>running existing tests to ensure that software is working after a change</dd>
  <dt>Integration test</dt>
  <dd>modules, functions etc tested as a group</dd>
  <dt>Stub</dt>
  <dd>a common test helper (could be a database connector, api endpoint) providing hard coded answers</dd>
  <dt>Spy</dt>
  <dd>similar to stub, they record information they were called with</dd>
  <dt>Mock</dt>
  <dd>mimic exactly the object they are replacing, returning specific responses. More than just a stub</dd>
  <dt>Performance test/Load test</dt>
  <dd>measuring how well code copes with stress</dd>
  <dt>Code coverage</dt>
  <dd>measures how many times a line, statement, branch (if/else) or function etc is executed</dd>
  <dt>e2e (end to end) testing</dt>
  <dd>testing a user journey through software from start to achieving the journeys goal</dd>
</dl>

Why Test Driven Development? Most companies seek people with TDD skills, why is this? TDD does not mean 'your code has tests'. It doesn't really mean you have 'experience of using X testing library'. It means you actually write your tests first and write code to pass those test systematically.

What teams actually want from a prospective engineer is:

- ability solve a problem in a systematic way
- produce clean code
- produce code which communicates to the next developer (which could also be you) exactly what the problem was

The TDD technique helps to achieve all of the above.

## Technique

Test Driven Development is a technique. A tool is something that makes your life easier. A technique is how to best use the tool. The tool is the assertion library and testing framework.

Rules for test driven development are:

- write a failing test
- write code to pass the test
- refactor (remove duplication)

This is the base for the three laws of TDD:

1. You are not allowed to write production code unless it is to make a failing unit test pass
2. You are not allowed to write any more of a unit test than is sufficient to fail; not compiling is failing
3. You are not allowed to write more production code than is sufficient to pass the one failing unit test

Why fail first?

- to see regression tests fail (no 0 positives)
- it makes you think about your code
- your code will be testable (you don't want to write code then have to refactor in order to be able to test)

There is another part to this technique. Uncle Bob put it best 'as the tests get more specific, the production code gets more generic'. This ties in with the refactoring part of TDD as we'll see later.

## Application of TDD

First we have a goal 'build an x' - in our case 'build a game of life'. The goal is the end result; the product. This would then be broken down into individual tasks (usually when you work for a company you may only get individual tasks such as 'As an x I want to y so that I can z'). After selecting a task to work on you ask yourself what set of tests would confidently demonstrate that this task is complete and works as expected. This process could be:

- break down the task and list the tests we need for it to be considered 'done'
- 'start small or not at all' as Kent Beck says - so write the simplest test and code to pass
- stub any dependencies
- incrementally change constants to variables (from specific to generic)

## Testing frameworks

There are many testing frameworks out there but they all consist of some or all of these tools:

- testing harness
- assertion library
- reporting
- code coverage

We will use [Jest](https://jestjs.io/en/) as our library because it covers everything above and more including: mocks, spies, good documentation - and we can test both front and back end code.

## Our task

Our task is to implement the [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway's_Game_of_Life) using TDD. First we will build the engine, and then we will build a front end solution. We're not going to get into functional programming, Object Oriented programming etc, for this we'll just be concentrating on writing tests and breaking a problem down into component parts.

Check out the [completed version](./completed) of the project to get an idea what it is. The game is grid based consisting of cells that are either alive or dead. Through each cycle of life this algorithm applies:

- any live cell with fewer than two live neigbours dies, as if by under-population
- any live cell with two or three live neighbours lives on to the next generation
- any live cell with more than three live neighbours dies, as if by overpopulation
- any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction

For our example we want to see the game in a browser. This is one of the great things about Jest - browser objects such as `window` and `document` are already stubbed for us.

We have a basic bootstrap for our project, an html page (includes styles and basic controls), empty test, and the main game file in the [game-of-life folder](./game-of-life). A convention for Jest is to put test files in a `__tests__` folder, so a starting test file exists there.

## Running tests

Once we have run `npm install` we can being testing using `jest` from the command line. Running this command after each change is quite tedious, so jest has a `--watch` flag to make tests run when it detects any change to the code.

We can also use Jest to check our code coverage using the `coverage` flag: `jest --coverage`. Looking good! Lets now start working on implementing a grid for the game.

### Game algorithm

So, starting small or not at all, lets start with our algorithm. We see that we need 2 parameters, whether a cell is alive or dead, and a number of neighbours.

There is one condition that isn't explicitly declared - a dead cell with no neighbours. Lets create our first test:

```js
describe("game of life", () => {
  describe("isAlive algorithm", () => {
    it("should return 0 when dead cell (0) with 0 neighbours", () => {
      expect(isAlive(0, 0)).toBe(0);
    });
  });
});
```

Then run with `jest`. You should see a failure. Now we can write just enough code to pass the test:

```js
function isAlive() {
  return 0;
}

window.game = {
  isAlive
};
```

What? I just returned 0! What is the point of that? Well, baby steps. We want to go red to green, red to green in fast short iterations.

Next test, sticking with dead cells, the next test could be for exactly 3 neighbours.

```js
it("should return 1 when dead cell with exactly 3 neighbours", () => {
  expect(isAlive(0, 3)).toBe(1);
});
```

```js
function isAlive(cell, neighbours) {
  if (neighbours === 3) {
    return 1;
  }
  return 0;
}
```

Pass! Great! Next tests: live cells.

```js
it("should return 0 when live cell with < 2 neighbours", () => {
  expect(isAlive(1, 0)).toBe(0);
});
```

Wait, our test passes? We should write a breaking test first? Well, actually looking at the algorithm, it says a live or dead cell with exactly 3 neighbours.

Now to test a live cell with 2 or 3 neighbours:

```js
it("should return 1 when live cell with 2 or 3 neighbours", () => {
  expect(isAlive(1, 2)).toBe(1);
});
```

```js
function isAlive(cell, neighbours) {
  if (Boolean(cell) && neighbours === 2) {
    return 1;
  }
  if (neighbours === 3) {
    return 1;
  }
  return 0;
}
```

Now our tests pass. Our code is pretty messy though! This is where we refactor, and we are safe to do so because we have our tests to ensure things are correct.

```js
function isAlive(cell, neighbours) {
  if ((Boolean(cell) && neighbours === 2) || neighbours === 3) {
    return 1;
  }
  return 0;
}
```

Great! A lot cleaner! In fact we can further optimise this code, even using arrow function to remove the `return` statement:

```js
const isAlive = (cell, neighbours) =>
  (Boolean(cell) && neighbours === 2) || neighbours === 3 ? 1 : 0;
```

Remember, as the tests get more specific the code becomes more generic.

We could even update our first test to add further test cases:

```js
describe("algorithm", () => {
  it("should return 0 when dead cell with > 3 or < 3 neighbours", () => {
    expect(isAlive(0, 0)).toBe(0);
    expect(isAlive(0, 1)).toBe(0);
    expect(isAlive(0, 2)).toBe(0);
    expect(isAlive(0, 4)).toBe(0);
  });
});
```

The solution looks so simple compared to my initial apprehension of complexity of the game. Confidence comes from the tests.

### Cells

For us to apply the algorithm we need a cell with neighbours, so lets work on that next. Lets call the function `generate`, and taking a square root.

```js
describe("generate cells", () => {
  it("should return array of length * length", () => {
    const cells = generate(1);
    expect(cells).toEqual([0]);
  });
});
```

## References

- [Conway's game of life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)
- [Kent Beck - Test Driven Development](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530)
- [Uncle Bob](https://blog.cleancoder.com/)
- [Martin Fowler](https://martinfowler.com/)
- [Jest](https://jestjs.io/)
