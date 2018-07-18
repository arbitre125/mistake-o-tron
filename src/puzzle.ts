import { Chess } from "chess.js"
import { Color } from "chessground/types"
import { toColor } from "./util"

export class Puzzle {
  readonly analysis
  private game

  constructor(analysis, game) {
    this.analysis = analysis
    this.game = game
  }
  render() {
    return this.url(this.analysis, this.game)
  }

  url(analysis, game) {
    const chess = new Chess(analysis.fen)
    let color: Color = toColor(chess)
    const turnNumber = parseInt(analysis.fen.match(/\d+$/)[0])
    let variation = analysis.variation.split(" ")
    variation.forEach(function (move) {
      chess.move(move)
    })
    chess.header('White', game.players.white.user.name)
    chess.header('Black', game.players.black.user.name)
    chess.header('WhiteElo', game.players.white.rating.toString())
    chess.header('BlackElo', game.players.black.rating.toString())
    chess.header('Event', `https://lichess.org/${analysis.id}/${color}#${analysis.halfMove - 1}`)
    let createdDate = new Date(game.createdAt)
    let createdDateString = `${createdDate.getFullYear()}.${createdDate.getMonth()+1}.${createdDate.getDate()}`
    chess.header('Date', createdDateString)

    let pgn = chess.pgn()
    const firstMove  = variation[0]
    const toReplace = `${turnNumber}. ${firstMove}`

    const blunder = `${turnNumber}. ${firstMove} { blunder: ${analysis.eval || analysis.mate }} (${turnNumber}. ${analysis.move.san}) ${turnNumber}... `
    pgn = pgn.replace(toReplace, blunder) + ' *'
    return pgn
  }

}
