import { Chess } from "chess.js"
import { Chessground } from "chessground"
import { Color } from "chessground/types"
import { toDests, toColor } from "./util"
import { VNode } from "snabbdom/vnode"
import { h } from "snabbdom"

export class Puzzle {
  readonly analysis
  private readonly chess
  private readonly config
  private status
  private game
  
  constructor(analysis, game) {
    this.analysis = analysis
    this.chess = new Chess(this.analysis.fen)
    this.config = this.initialiseConfig()
    this.status = ''
    this.game = game
  }

  initialiseConfig() {
    let color: Color = toColor(this.chess)
    return {
      orientation: color,
      turnColor: color,
      fen: this.analysis.fen,
      movable: {
        color: color,
        free: false,
        dests: toDests(this.chess)
      }
    }
  }

  pathFromStatus(path) {
    return (this.status == '') ? path : path + "." +this.status
  }
  
  render() {
    
    return h(this.pathFromStatus("section.blue.merida"), [
      h("div.cg-board-wrap", {
        hook: {
          insert: this.runUnit,
          postpatch: this.runUnit
        }
      }),
      h(
        "p",
        h(
          "a",
          {
            props: {
              href: this.url(this.analysis),
              target: "_blank"
            }
          },
          this.analysis.judgment.name + ' ' +this.analysis.eval
        )
      )
    ])
  }

  url(analysis) {
    const chess = new Chess(analysis.fen)
    let color: Color = toColor(chess)
    return `https://lichess.org/${analysis.id}/${color}#${analysis.halfMove - 1}`
  }

  run(el) {
    const cg = Chessground(el, this.config)
    this.originalMove(cg)
    cg.set({
      movable: {
        events: {
          after: (orig, dest) => {
            this.moveAndResult(cg, orig, dest)
          }
        }
      },
      events: {
        select: ({}) => {
          this.originalMove(cg)
        }
      }
    })

    return cg
  }

  originalMove(cg) {
    cg.set({
      drawable: {
        shapes: [this.arrow(this.analysis.move, "red")]
      }
    })
  }

  moveAndResult(cg, orig, dest) {
    this.chess.move({ from: orig, to: dest })
    cg.set({
      turnColor: toColor(this.chess),
      movable: {
        color: toColor(this.chess),
        dests: toDests(this.chess)
      },
      drawable: {
        shapes: [
          { orig: orig, dest: dest, brush: "yellow" },
          this.arrow(this.analysis.move, "red"),
          this.arrow(this.analysis.best, "green")
        ]
      }
    })
  }

  runUnit = (vnode: VNode) => {
    const el = vnode.elm as HTMLElement
    el.className = "cg-board-wrap"
    this.run(el)
  }

  arrow(move, colour) {
    return { orig: move.from, dest: move.to, brush: colour }
  }
  
  pgn() {
    let analysis = this.analysis
    console.log("analysis________",analysis)
    let game = this.game
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

    //This lines are to generate the correct move and the blunder in a variation. (for use in tactics android app)
    //Comment the lines to get the blunder variation (for then using pgn-tactics-generator)
    // const blunder = `${turnNumber}. ${firstMove} { blunder: ${analysis.eval || analysis.mate }} (${turnNumber}. ${analysis.move.san}) ${turnNumber}... `
    // pgn = pgn.replace(toReplace, blunder)

    pgn = pgn +' *'
    return pgn
  }
}
