import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function Symbol(props) {
  if (props.value === 'X') {
    return <i className="fas fa-times"> </i>
  }
  else if (props.value === 'O') {
    return <i className="far fa-circle"> </i>
  }
  return null
}

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      <Symbol value={props.value}></Symbol>
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      currentStep: 0,
    };

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.currentStep + 1);
    const current = history[this.state.currentStep];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
      currentStep: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      currentStep: step,
      xIsNext: (step % 2) === 0,
    });
  }


  render() {
    const history = this.state.history;
    const current = history[this.state.currentStep];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
          <div
            key={move}
            className="history-entry"
            onClick={() => this.jumpTo(move)}>{desc}
          </div>

      );
    });

    let status;
    if (winner) {
      status =
      <div className="status">
        <Symbol value={winner}> </Symbol> won !
      </div>;
    } else {
      status =
      <div className="status">
        {"It's "}<Symbol value={this.state.xIsNext ? 'X' : 'O'}> </Symbol>{"'s turn to play"}
      </div>;
    }
    return (
      <div className="game-wrapper">
        <div className="game">
          <div className="game-info">
            <div>{status}</div>
          </div>
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
        </div>
        <div className="history">
          {moves}
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
