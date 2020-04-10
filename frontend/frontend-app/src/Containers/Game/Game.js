import React, { Component } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import "./Game.css";

/**
 * Tile that displays a clue word. If previously clicked, will be styled to
 * indicate the tile type (blue, red, death, or neutral).
 */
class Tile extends Component {
  render() {
    const { tile, idx, isSpymasterView, handleTileClick } = this.props;
    const { clue, type, revealed } = tile;

    let className = "";
    if (revealed) {
      className = type;
    } else if (isSpymasterView) {
      className = `${type}-bold`;
    }

    return (
      <Col>
        <Card
          className={`tile ${className}`}
          onClick={() => handleTileClick(revealed, isSpymasterView, idx)}
        >
          <Card.Body>{clue}</Card.Body>
        </Card>
      </Col>
    );
  }
}

/**
 * Overall game board. Displays tiles with clues and control buttons.
 */
class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSpymasterView: false,
    };
  }

  endCurrentTurn() {
    // TODO(regina): Send request to server to switch turns.
    console.log("end current turn");
  }

  renderGameInfo(tiles, currentTurn) {
    const numRemainingBlue = tiles.filter(
      (tile) => !tile.revealed && tile.type === "blue"
    ).length;
    const numRemainingRed = tiles.filter(
      (tile) => !tile.revealed && tile.type === "red"
    ).length;

    return (
      <Row>
        <Col>
          <div>
            <span className="blue-bold">{numRemainingBlue}</span> -
{" "}
            <span className="red-bold">{numRemainingRed}</span>
          </div>
        </Col>

        <Col>
          <div
            className={`${currentTurn}-bold`}
            style={{ textAlign: "center" }}
          >
            {`${currentTurn}'s turn`}
          </div>
        </Col>

        <Col>
          <div style={{ textAlign: "right" }}>
            <Button variant="light" onClick={() => this.endCurrentTurn()}>
              End
              {` ${currentTurn}'s `}
{' '}
turn
</Button>
          </div>
        </Col>
      </Row>
    );
  }

  // Changes between player view (all plain tiles) and spymaster view (different
  // tile types are shown).
  toggleSpymasterView() {
    this.setState((state) => {
      return { ...state, isSpymasterView: !state.isSpymasterView };
    });
  }

  // When an eligible tile is clicked, sends a request to the server to get an
  // updated board.
  handleTileClick(revealed, isSpymasterView, idx) {
    if (revealed || isSpymasterView) return;

    // TODO(regina): Send move to server and retrieve updated board.
    console.log(idx);
  }

  renderTile(tile, idx) {
    return (
      <Tile
        tile={tile}
        idx={idx}
        isSpymasterView={this.state.isSpymasterView}
        handleTileClick={this.handleTileClick}
        key={idx}
      />
    );
  }

  renderTiles(tiles) {
    const MAX_TILES_PER_ROW = 5;

    return (
      <div>
        <Container>
          <Row md={MAX_TILES_PER_ROW} lg={MAX_TILES_PER_ROW}>
            {tiles.map((tile, idx) => this.renderTile(tile, idx))}
          </Row>
        </Container>
      </div>
    );
  }

  render() {
    const { tiles, currentTurn } = this.props.game;

    return (
      <Container>
        {this.renderGameInfo(tiles, currentTurn)}
        {this.renderTiles(tiles)}

        <div className="custom-control custom-switch">
          <input
            type="checkbox"
            className="custom-control-input"
            id="spymasterViewSwitch"
            checked={this.state.isSpymasterView}
            onChange={() => this.toggleSpymasterView()}
          />
          <label className="custom-control-label" htmlFor="spymasterViewSwitch">
            Spymaster View
          </label>
        </div>
      </Container>
    );
  }
}

export default Board;
