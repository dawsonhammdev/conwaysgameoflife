import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
import { GoMarkGithub } from "react-icons/go";

const numRows = 25;
const numCols = 25;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};

const App = () => {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid(g => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 100);
  }, []);

  return (
    <>
      <h1>The Game of Life</h1>
      <div className="page-container">
        <div className="main">
          <h2> Rules </h2>
          <ul>
            <li>
              Any live cell with fewer than two live neighbours dies, as if by
              underpopulation.
            </li>
            <li>
              Any live cell with two or three live neighbors lives on to the
              next generation
            </li>
            <li>
              Any live cell with more than three live neighbours dies, as if by
              overpopulation.
            </li>
            <li>
              Any dead cell with three live neighbours becomes a live cell, as
              if by reproduction
            </li>
          </ul>
          <h2> About this Algorithm</h2>
          <p>
            {" "}
            The Game of Life is a cellular automation devised by British
            mathmetician John Horton Conway in 1970. A cellular automaton
            consists of a regular grid of cells, whith each cell being in a
            certain state, such as "dead" or "alive". 
            <br/>
            <br/>
            In Conway's Game of Life,
            each cell looks at its eight neighbors to determine it's state. The
            grid is a two-dimensional array of rows and collumns. 
            <br/>
            <br/>
            To look at
            neighbors I've built a for loop that runs through each column of
            each row and looks at each neighbor using a helper function. Using
            the count of neighbors, a copy of the grid updates it cells
            accordingly. When the loop has ran through the whole grid, the
            original grid is replaced with the copy. This is a double buffer and
            was implemented using the React useState hook.
          </p>

          <a href="https://github.com/dawsonhammdev/conwaysgameoflife"> Check out the repo on GitHub <GoMarkGithub className="ghIcon"/></a> 
        </div>
      </div>

      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        {running ? "stop" : "start"}
      </button>
      <button
        onClick={() => {
          const rows = [];
          for (let i = 0; i < numRows; i++) {
            rows.push(
              Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0))
            );
          }

          setGrid(rows);
        }}
      >
        random
      </button>
      <button
        onClick={() => {
          setGrid(generateEmptyGrid());
        }}
      >
        clear
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "red" : undefined,
                border: "solid 1px blue"
              }}
            />
          ))
        )}
      </div>
    </>
  );
};

export default App;