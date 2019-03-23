(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.bundle = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*
 * Copyright (c) 2016, Jeff Hlywa (jhlywa@gmail.com)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 *----------------------------------------------------------------------------*/

/* minified license below  */

/* @license
 * Copyright (c) 2016, Jeff Hlywa (jhlywa@gmail.com)
 * Released under the BSD license
 * https://github.com/jhlywa/chess.js/blob/master/LICENSE
 */

var Chess = function(fen) {

  /* jshint indent: false */

  var BLACK = 'b';
  var WHITE = 'w';

  var EMPTY = -1;

  var PAWN = 'p';
  var KNIGHT = 'n';
  var BISHOP = 'b';
  var ROOK = 'r';
  var QUEEN = 'q';
  var KING = 'k';

  var SYMBOLS = 'pnbrqkPNBRQK';

  var DEFAULT_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  var POSSIBLE_RESULTS = ['1-0', '0-1', '1/2-1/2', '*'];

  var PAWN_OFFSETS = {
    b: [16, 32, 17, 15],
    w: [-16, -32, -17, -15]
  };

  var PIECE_OFFSETS = {
    n: [-18, -33, -31, -14,  18, 33, 31,  14],
    b: [-17, -15,  17,  15],
    r: [-16,   1,  16,  -1],
    q: [-17, -16, -15,   1,  17, 16, 15,  -1],
    k: [-17, -16, -15,   1,  17, 16, 15,  -1]
  };

  var ATTACKS = [
    20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20, 0,
     0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
     0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
     0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
     0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
    24,24,24,24,24,24,56,  0, 56,24,24,24,24,24,24, 0,
     0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
     0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
     0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
     0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
    20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20
  ];

  var RAYS = [
     17,  0,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0,  0, 15, 0,
      0, 17,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0, 15,  0, 0,
      0,  0, 17,  0,  0,  0,  0, 16,  0,  0,  0,  0, 15,  0,  0, 0,
      0,  0,  0, 17,  0,  0,  0, 16,  0,  0,  0, 15,  0,  0,  0, 0,
      0,  0,  0,  0, 17,  0,  0, 16,  0,  0, 15,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0, 17,  0, 16,  0, 15,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0,  0, 17, 16, 15,  0,  0,  0,  0,  0,  0, 0,
      1,  1,  1,  1,  1,  1,  1,  0, -1, -1,  -1,-1, -1, -1, -1, 0,
      0,  0,  0,  0,  0,  0,-15,-16,-17,  0,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0,-15,  0,-16,  0,-17,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,-15,  0,  0,-16,  0,  0,-17,  0,  0,  0,  0, 0,
      0,  0,  0,-15,  0,  0,  0,-16,  0,  0,  0,-17,  0,  0,  0, 0,
      0,  0,-15,  0,  0,  0,  0,-16,  0,  0,  0,  0,-17,  0,  0, 0,
      0,-15,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,-17,  0, 0,
    -15,  0,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,  0,-17
  ];

  var SHIFTS = { p: 0, n: 1, b: 2, r: 3, q: 4, k: 5 };

  var FLAGS = {
    NORMAL: 'n',
    CAPTURE: 'c',
    BIG_PAWN: 'b',
    EP_CAPTURE: 'e',
    PROMOTION: 'p',
    KSIDE_CASTLE: 'k',
    QSIDE_CASTLE: 'q'
  };

  var BITS = {
    NORMAL: 1,
    CAPTURE: 2,
    BIG_PAWN: 4,
    EP_CAPTURE: 8,
    PROMOTION: 16,
    KSIDE_CASTLE: 32,
    QSIDE_CASTLE: 64
  };

  var RANK_1 = 7;
  var RANK_2 = 6;
  var RANK_3 = 5;
  var RANK_4 = 4;
  var RANK_5 = 3;
  var RANK_6 = 2;
  var RANK_7 = 1;
  var RANK_8 = 0;

  var SQUARES = {
    a8:   0, b8:   1, c8:   2, d8:   3, e8:   4, f8:   5, g8:   6, h8:   7,
    a7:  16, b7:  17, c7:  18, d7:  19, e7:  20, f7:  21, g7:  22, h7:  23,
    a6:  32, b6:  33, c6:  34, d6:  35, e6:  36, f6:  37, g6:  38, h6:  39,
    a5:  48, b5:  49, c5:  50, d5:  51, e5:  52, f5:  53, g5:  54, h5:  55,
    a4:  64, b4:  65, c4:  66, d4:  67, e4:  68, f4:  69, g4:  70, h4:  71,
    a3:  80, b3:  81, c3:  82, d3:  83, e3:  84, f3:  85, g3:  86, h3:  87,
    a2:  96, b2:  97, c2:  98, d2:  99, e2: 100, f2: 101, g2: 102, h2: 103,
    a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
  };

  var ROOKS = {
    w: [{square: SQUARES.a1, flag: BITS.QSIDE_CASTLE},
        {square: SQUARES.h1, flag: BITS.KSIDE_CASTLE}],
    b: [{square: SQUARES.a8, flag: BITS.QSIDE_CASTLE},
        {square: SQUARES.h8, flag: BITS.KSIDE_CASTLE}]
  };

  var board = new Array(128);
  var kings = {w: EMPTY, b: EMPTY};
  var turn = WHITE;
  var castling = {w: 0, b: 0};
  var ep_square = EMPTY;
  var half_moves = 0;
  var move_number = 1;
  var history = [];
  var header = {};

  /* if the user passes in a fen string, load it, else default to
   * starting position
   */
  if (typeof fen === 'undefined') {
    load(DEFAULT_POSITION);
  } else {
    load(fen);
  }

  function clear() {
    board = new Array(128);
    kings = {w: EMPTY, b: EMPTY};
    turn = WHITE;
    castling = {w: 0, b: 0};
    ep_square = EMPTY;
    half_moves = 0;
    move_number = 1;
    history = [];
    header = {};
    update_setup(generate_fen());
  }

  function reset() {
    load(DEFAULT_POSITION);
  }

  function load(fen) {
    var tokens = fen.split(/\s+/);
    var position = tokens[0];
    var square = 0;

    if (!validate_fen(fen).valid) {
      return false;
    }

    clear();

    for (var i = 0; i < position.length; i++) {
      var piece = position.charAt(i);

      if (piece === '/') {
        square += 8;
      } else if (is_digit(piece)) {
        square += parseInt(piece, 10);
      } else {
        var color = (piece < 'a') ? WHITE : BLACK;
        put({type: piece.toLowerCase(), color: color}, algebraic(square));
        square++;
      }
    }

    turn = tokens[1];

    if (tokens[2].indexOf('K') > -1) {
      castling.w |= BITS.KSIDE_CASTLE;
    }
    if (tokens[2].indexOf('Q') > -1) {
      castling.w |= BITS.QSIDE_CASTLE;
    }
    if (tokens[2].indexOf('k') > -1) {
      castling.b |= BITS.KSIDE_CASTLE;
    }
    if (tokens[2].indexOf('q') > -1) {
      castling.b |= BITS.QSIDE_CASTLE;
    }

    ep_square = (tokens[3] === '-') ? EMPTY : SQUARES[tokens[3]];
    half_moves = parseInt(tokens[4], 10);
    move_number = parseInt(tokens[5], 10);

    update_setup(generate_fen());

    return true;
  }

  /* TODO: this function is pretty much crap - it validates structure but
   * completely ignores content (e.g. doesn't verify that each side has a king)
   * ... we should rewrite this, and ditch the silly error_number field while
   * we're at it
   */
  function validate_fen(fen) {
    var errors = {
       0: 'No errors.',
       1: 'FEN string must contain six space-delimited fields.',
       2: '6th field (move number) must be a positive integer.',
       3: '5th field (half move counter) must be a non-negative integer.',
       4: '4th field (en-passant square) is invalid.',
       5: '3rd field (castling availability) is invalid.',
       6: '2nd field (side to move) is invalid.',
       7: '1st field (piece positions) does not contain 8 \'/\'-delimited rows.',
       8: '1st field (piece positions) is invalid [consecutive numbers].',
       9: '1st field (piece positions) is invalid [invalid piece].',
      10: '1st field (piece positions) is invalid [row too large].',
      11: 'Illegal en-passant square',
    };

    /* 1st criterion: 6 space-seperated fields? */
    var tokens = fen.split(/\s+/);
    if (tokens.length !== 6) {
      return {valid: false, error_number: 1, error: errors[1]};
    }

    /* 2nd criterion: move number field is a integer value > 0? */
    if (isNaN(tokens[5]) || (parseInt(tokens[5], 10) <= 0)) {
      return {valid: false, error_number: 2, error: errors[2]};
    }

    /* 3rd criterion: half move counter is an integer >= 0? */
    if (isNaN(tokens[4]) || (parseInt(tokens[4], 10) < 0)) {
      return {valid: false, error_number: 3, error: errors[3]};
    }

    /* 4th criterion: 4th field is a valid e.p.-string? */
    if (!/^(-|[abcdefgh][36])$/.test(tokens[3])) {
      return {valid: false, error_number: 4, error: errors[4]};
    }

    /* 5th criterion: 3th field is a valid castle-string? */
    if( !/^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(tokens[2])) {
      return {valid: false, error_number: 5, error: errors[5]};
    }

    /* 6th criterion: 2nd field is "w" (white) or "b" (black)? */
    if (!/^(w|b)$/.test(tokens[1])) {
      return {valid: false, error_number: 6, error: errors[6]};
    }

    /* 7th criterion: 1st field contains 8 rows? */
    var rows = tokens[0].split('/');
    if (rows.length !== 8) {
      return {valid: false, error_number: 7, error: errors[7]};
    }

    /* 8th criterion: every row is valid? */
    for (var i = 0; i < rows.length; i++) {
      /* check for right sum of fields AND not two numbers in succession */
      var sum_fields = 0;
      var previous_was_number = false;

      for (var k = 0; k < rows[i].length; k++) {
        if (!isNaN(rows[i][k])) {
          if (previous_was_number) {
            return {valid: false, error_number: 8, error: errors[8]};
          }
          sum_fields += parseInt(rows[i][k], 10);
          previous_was_number = true;
        } else {
          if (!/^[prnbqkPRNBQK]$/.test(rows[i][k])) {
            return {valid: false, error_number: 9, error: errors[9]};
          }
          sum_fields += 1;
          previous_was_number = false;
        }
      }
      if (sum_fields !== 8) {
        return {valid: false, error_number: 10, error: errors[10]};
      }
    }

    if ((tokens[3][1] == '3' && tokens[1] == 'w') ||
        (tokens[3][1] == '6' && tokens[1] == 'b')) {
          return {valid: false, error_number: 11, error: errors[11]};
    }

    /* everything's okay! */
    return {valid: true, error_number: 0, error: errors[0]};
  }

  function generate_fen() {
    var empty = 0;
    var fen = '';

    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      if (board[i] == null) {
        empty++;
      } else {
        if (empty > 0) {
          fen += empty;
          empty = 0;
        }
        var color = board[i].color;
        var piece = board[i].type;

        fen += (color === WHITE) ?
                 piece.toUpperCase() : piece.toLowerCase();
      }

      if ((i + 1) & 0x88) {
        if (empty > 0) {
          fen += empty;
        }

        if (i !== SQUARES.h1) {
          fen += '/';
        }

        empty = 0;
        i += 8;
      }
    }

    var cflags = '';
    if (castling[WHITE] & BITS.KSIDE_CASTLE) { cflags += 'K'; }
    if (castling[WHITE] & BITS.QSIDE_CASTLE) { cflags += 'Q'; }
    if (castling[BLACK] & BITS.KSIDE_CASTLE) { cflags += 'k'; }
    if (castling[BLACK] & BITS.QSIDE_CASTLE) { cflags += 'q'; }

    /* do we have an empty castling flag? */
    cflags = cflags || '-';
    var epflags = (ep_square === EMPTY) ? '-' : algebraic(ep_square);

    return [fen, turn, cflags, epflags, half_moves, move_number].join(' ');
  }

  function set_header(args) {
    for (var i = 0; i < args.length; i += 2) {
      if (typeof args[i] === 'string' &&
          typeof args[i + 1] === 'string') {
        header[args[i]] = args[i + 1];
      }
    }
    return header;
  }

  /* called when the initial board setup is changed with put() or remove().
   * modifies the SetUp and FEN properties of the header object.  if the FEN is
   * equal to the default position, the SetUp and FEN are deleted
   * the setup is only updated if history.length is zero, ie moves haven't been
   * made.
   */
  function update_setup(fen) {
    if (history.length > 0) return;

    if (fen !== DEFAULT_POSITION) {
      header['SetUp'] = '1';
      header['FEN'] = fen;
    } else {
      delete header['SetUp'];
      delete header['FEN'];
    }
  }

  function get(square) {
    var piece = board[SQUARES[square]];
    return (piece) ? {type: piece.type, color: piece.color} : null;
  }

  function put(piece, square) {
    /* check for valid piece object */
    if (!('type' in piece && 'color' in piece)) {
      return false;
    }

    /* check for piece */
    if (SYMBOLS.indexOf(piece.type.toLowerCase()) === -1) {
      return false;
    }

    /* check for valid square */
    if (!(square in SQUARES)) {
      return false;
    }

    var sq = SQUARES[square];

    /* don't let the user place more than one king */
    if (piece.type == KING &&
        !(kings[piece.color] == EMPTY || kings[piece.color] == sq)) {
      return false;
    }

    board[sq] = {type: piece.type, color: piece.color};
    if (piece.type === KING) {
      kings[piece.color] = sq;
    }

    update_setup(generate_fen());

    return true;
  }

  function remove(square) {
    var piece = get(square);
    board[SQUARES[square]] = null;
    if (piece && piece.type === KING) {
      kings[piece.color] = EMPTY;
    }

    update_setup(generate_fen());

    return piece;
  }

  function build_move(board, from, to, flags, promotion) {
    var move = {
      color: turn,
      from: from,
      to: to,
      flags: flags,
      piece: board[from].type
    };

    if (promotion) {
      move.flags |= BITS.PROMOTION;
      move.promotion = promotion;
    }

    if (board[to]) {
      move.captured = board[to].type;
    } else if (flags & BITS.EP_CAPTURE) {
        move.captured = PAWN;
    }
    return move;
  }

  function generate_moves(options) {
    function add_move(board, moves, from, to, flags) {
      /* if pawn promotion */
      if (board[from].type === PAWN &&
         (rank(to) === RANK_8 || rank(to) === RANK_1)) {
          var pieces = [QUEEN, ROOK, BISHOP, KNIGHT];
          for (var i = 0, len = pieces.length; i < len; i++) {
            moves.push(build_move(board, from, to, flags, pieces[i]));
          }
      } else {
       moves.push(build_move(board, from, to, flags));
      }
    }

    var moves = [];
    var us = turn;
    var them = swap_color(us);
    var second_rank = {b: RANK_7, w: RANK_2};

    var first_sq = SQUARES.a8;
    var last_sq = SQUARES.h1;
    var single_square = false;

    /* do we want legal moves? */
    var legal = (typeof options !== 'undefined' && 'legal' in options) ?
                options.legal : true;

    /* are we generating moves for a single square? */
    if (typeof options !== 'undefined' && 'square' in options) {
      if (options.square in SQUARES) {
        first_sq = last_sq = SQUARES[options.square];
        single_square = true;
      } else {
        /* invalid square */
        return [];
      }
    }

    for (var i = first_sq; i <= last_sq; i++) {
      /* did we run off the end of the board */
      if (i & 0x88) { i += 7; continue; }

      var piece = board[i];
      if (piece == null || piece.color !== us) {
        continue;
      }

      if (piece.type === PAWN) {
        /* single square, non-capturing */
        var square = i + PAWN_OFFSETS[us][0];
        if (board[square] == null) {
            add_move(board, moves, i, square, BITS.NORMAL);

          /* double square */
          var square = i + PAWN_OFFSETS[us][1];
          if (second_rank[us] === rank(i) && board[square] == null) {
            add_move(board, moves, i, square, BITS.BIG_PAWN);
          }
        }

        /* pawn captures */
        for (j = 2; j < 4; j++) {
          var square = i + PAWN_OFFSETS[us][j];
          if (square & 0x88) continue;

          if (board[square] != null &&
              board[square].color === them) {
              add_move(board, moves, i, square, BITS.CAPTURE);
          } else if (square === ep_square) {
              add_move(board, moves, i, ep_square, BITS.EP_CAPTURE);
          }
        }
      } else {
        for (var j = 0, len = PIECE_OFFSETS[piece.type].length; j < len; j++) {
          var offset = PIECE_OFFSETS[piece.type][j];
          var square = i;

          while (true) {
            square += offset;
            if (square & 0x88) break;

            if (board[square] == null) {
              add_move(board, moves, i, square, BITS.NORMAL);
            } else {
              if (board[square].color === us) break;
              add_move(board, moves, i, square, BITS.CAPTURE);
              break;
            }

            /* break, if knight or king */
            if (piece.type === 'n' || piece.type === 'k') break;
          }
        }
      }
    }

    /* check for castling if: a) we're generating all moves, or b) we're doing
     * single square move generation on the king's square
     */
    if ((!single_square) || last_sq === kings[us]) {
      /* king-side castling */
      if (castling[us] & BITS.KSIDE_CASTLE) {
        var castling_from = kings[us];
        var castling_to = castling_from + 2;

        if (board[castling_from + 1] == null &&
            board[castling_to]       == null &&
            !attacked(them, kings[us]) &&
            !attacked(them, castling_from + 1) &&
            !attacked(them, castling_to)) {
          add_move(board, moves, kings[us] , castling_to,
                   BITS.KSIDE_CASTLE);
        }
      }

      /* queen-side castling */
      if (castling[us] & BITS.QSIDE_CASTLE) {
        var castling_from = kings[us];
        var castling_to = castling_from - 2;

        if (board[castling_from - 1] == null &&
            board[castling_from - 2] == null &&
            board[castling_from - 3] == null &&
            !attacked(them, kings[us]) &&
            !attacked(them, castling_from - 1) &&
            !attacked(them, castling_to)) {
          add_move(board, moves, kings[us], castling_to,
                   BITS.QSIDE_CASTLE);
        }
      }
    }

    /* return all pseudo-legal moves (this includes moves that allow the king
     * to be captured)
     */
    if (!legal) {
      return moves;
    }

    /* filter out illegal moves */
    var legal_moves = [];
    for (var i = 0, len = moves.length; i < len; i++) {
      make_move(moves[i]);
      if (!king_attacked(us)) {
        legal_moves.push(moves[i]);
      }
      undo_move();
    }

    return legal_moves;
  }

  /* convert a move from 0x88 coordinates to Standard Algebraic Notation
   * (SAN)
   *
   * @param {boolean} sloppy Use the sloppy SAN generator to work around over
   * disambiguation bugs in Fritz and Chessbase.  See below:
   *
   * r1bqkbnr/ppp2ppp/2n5/1B1pP3/4P3/8/PPPP2PP/RNBQK1NR b KQkq - 2 4
   * 4. ... Nge7 is overly disambiguated because the knight on c6 is pinned
   * 4. ... Ne7 is technically the valid SAN
   */
  function move_to_san(move, sloppy) {

    var output = '';

    if (move.flags & BITS.KSIDE_CASTLE) {
      output = 'O-O';
    } else if (move.flags & BITS.QSIDE_CASTLE) {
      output = 'O-O-O';
    } else {
      var disambiguator = get_disambiguator(move, sloppy);

      if (move.piece !== PAWN) {
        output += move.piece.toUpperCase() + disambiguator;
      }

      if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
        if (move.piece === PAWN) {
          output += algebraic(move.from)[0];
        }
        output += 'x';
      }

      output += algebraic(move.to);

      if (move.flags & BITS.PROMOTION) {
        output += '=' + move.promotion.toUpperCase();
      }
    }

    make_move(move);
    if (in_check()) {
      if (in_checkmate()) {
        output += '#';
      } else {
        output += '+';
      }
    }
    undo_move();

    return output;
  }

  // parses all of the decorators out of a SAN string
  function stripped_san(move) {
    return move.replace(/=/,'').replace(/[+#]?[?!]*$/,'');
  }

  function attacked(color, square) {
    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      /* did we run off the end of the board */
      if (i & 0x88) { i += 7; continue; }

      /* if empty square or wrong color */
      if (board[i] == null || board[i].color !== color) continue;

      var piece = board[i];
      var difference = i - square;
      var index = difference + 119;

      if (ATTACKS[index] & (1 << SHIFTS[piece.type])) {
        if (piece.type === PAWN) {
          if (difference > 0) {
            if (piece.color === WHITE) return true;
          } else {
            if (piece.color === BLACK) return true;
          }
          continue;
        }

        /* if the piece is a knight or a king */
        if (piece.type === 'n' || piece.type === 'k') return true;

        var offset = RAYS[index];
        var j = i + offset;

        var blocked = false;
        while (j !== square) {
          if (board[j] != null) { blocked = true; break; }
          j += offset;
        }

        if (!blocked) return true;
      }
    }

    return false;
  }

  function king_attacked(color) {
    return attacked(swap_color(color), kings[color]);
  }

  function in_check() {
    return king_attacked(turn);
  }

  function in_checkmate() {
    return in_check() && generate_moves().length === 0;
  }

  function in_stalemate() {
    return !in_check() && generate_moves().length === 0;
  }

  function insufficient_material() {
    var pieces = {};
    var bishops = [];
    var num_pieces = 0;
    var sq_color = 0;

    for (var i = SQUARES.a8; i<= SQUARES.h1; i++) {
      sq_color = (sq_color + 1) % 2;
      if (i & 0x88) { i += 7; continue; }

      var piece = board[i];
      if (piece) {
        pieces[piece.type] = (piece.type in pieces) ?
                              pieces[piece.type] + 1 : 1;
        if (piece.type === BISHOP) {
          bishops.push(sq_color);
        }
        num_pieces++;
      }
    }

    /* k vs. k */
    if (num_pieces === 2) { return true; }

    /* k vs. kn .... or .... k vs. kb */
    else if (num_pieces === 3 && (pieces[BISHOP] === 1 ||
                                 pieces[KNIGHT] === 1)) { return true; }

    /* kb vs. kb where any number of bishops are all on the same color */
    else if (num_pieces === pieces[BISHOP] + 2) {
      var sum = 0;
      var len = bishops.length;
      for (var i = 0; i < len; i++) {
        sum += bishops[i];
      }
      if (sum === 0 || sum === len) { return true; }
    }

    return false;
  }

  function in_threefold_repetition() {
    /* TODO: while this function is fine for casual use, a better
     * implementation would use a Zobrist key (instead of FEN). the
     * Zobrist key would be maintained in the make_move/undo_move functions,
     * avoiding the costly that we do below.
     */
    var moves = [];
    var positions = {};
    var repetition = false;

    while (true) {
      var move = undo_move();
      if (!move) break;
      moves.push(move);
    }

    while (true) {
      /* remove the last two fields in the FEN string, they're not needed
       * when checking for draw by rep */
      var fen = generate_fen().split(' ').slice(0,4).join(' ');

      /* has the position occurred three or move times */
      positions[fen] = (fen in positions) ? positions[fen] + 1 : 1;
      if (positions[fen] >= 3) {
        repetition = true;
      }

      if (!moves.length) {
        break;
      }
      make_move(moves.pop());
    }

    return repetition;
  }

  function push(move) {
    history.push({
      move: move,
      kings: {b: kings.b, w: kings.w},
      turn: turn,
      castling: {b: castling.b, w: castling.w},
      ep_square: ep_square,
      half_moves: half_moves,
      move_number: move_number
    });
  }

  function make_move(move) {
    var us = turn;
    var them = swap_color(us);
    push(move);

    board[move.to] = board[move.from];
    board[move.from] = null;

    /* if ep capture, remove the captured pawn */
    if (move.flags & BITS.EP_CAPTURE) {
      if (turn === BLACK) {
        board[move.to - 16] = null;
      } else {
        board[move.to + 16] = null;
      }
    }

    /* if pawn promotion, replace with new piece */
    if (move.flags & BITS.PROMOTION) {
      board[move.to] = {type: move.promotion, color: us};
    }

    /* if we moved the king */
    if (board[move.to].type === KING) {
      kings[board[move.to].color] = move.to;

      /* if we castled, move the rook next to the king */
      if (move.flags & BITS.KSIDE_CASTLE) {
        var castling_to = move.to - 1;
        var castling_from = move.to + 1;
        board[castling_to] = board[castling_from];
        board[castling_from] = null;
      } else if (move.flags & BITS.QSIDE_CASTLE) {
        var castling_to = move.to + 1;
        var castling_from = move.to - 2;
        board[castling_to] = board[castling_from];
        board[castling_from] = null;
      }

      /* turn off castling */
      castling[us] = '';
    }

    /* turn off castling if we move a rook */
    if (castling[us]) {
      for (var i = 0, len = ROOKS[us].length; i < len; i++) {
        if (move.from === ROOKS[us][i].square &&
            castling[us] & ROOKS[us][i].flag) {
          castling[us] ^= ROOKS[us][i].flag;
          break;
        }
      }
    }

    /* turn off castling if we capture a rook */
    if (castling[them]) {
      for (var i = 0, len = ROOKS[them].length; i < len; i++) {
        if (move.to === ROOKS[them][i].square &&
            castling[them] & ROOKS[them][i].flag) {
          castling[them] ^= ROOKS[them][i].flag;
          break;
        }
      }
    }

    /* if big pawn move, update the en passant square */
    if (move.flags & BITS.BIG_PAWN) {
      if (turn === 'b') {
        ep_square = move.to - 16;
      } else {
        ep_square = move.to + 16;
      }
    } else {
      ep_square = EMPTY;
    }

    /* reset the 50 move counter if a pawn is moved or a piece is captured */
    if (move.piece === PAWN) {
      half_moves = 0;
    } else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
      half_moves = 0;
    } else {
      half_moves++;
    }

    if (turn === BLACK) {
      move_number++;
    }
    turn = swap_color(turn);
  }

  function undo_move() {
    var old = history.pop();
    if (old == null) { return null; }

    var move = old.move;
    kings = old.kings;
    turn = old.turn;
    castling = old.castling;
    ep_square = old.ep_square;
    half_moves = old.half_moves;
    move_number = old.move_number;

    var us = turn;
    var them = swap_color(turn);

    board[move.from] = board[move.to];
    board[move.from].type = move.piece;  // to undo any promotions
    board[move.to] = null;

    if (move.flags & BITS.CAPTURE) {
      board[move.to] = {type: move.captured, color: them};
    } else if (move.flags & BITS.EP_CAPTURE) {
      var index;
      if (us === BLACK) {
        index = move.to - 16;
      } else {
        index = move.to + 16;
      }
      board[index] = {type: PAWN, color: them};
    }


    if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
      var castling_to, castling_from;
      if (move.flags & BITS.KSIDE_CASTLE) {
        castling_to = move.to + 1;
        castling_from = move.to - 1;
      } else if (move.flags & BITS.QSIDE_CASTLE) {
        castling_to = move.to - 2;
        castling_from = move.to + 1;
      }

      board[castling_to] = board[castling_from];
      board[castling_from] = null;
    }

    return move;
  }

  /* this function is used to uniquely identify ambiguous moves */
  function get_disambiguator(move, sloppy) {
    var moves = generate_moves({legal: !sloppy});

    var from = move.from;
    var to = move.to;
    var piece = move.piece;

    var ambiguities = 0;
    var same_rank = 0;
    var same_file = 0;

    for (var i = 0, len = moves.length; i < len; i++) {
      var ambig_from = moves[i].from;
      var ambig_to = moves[i].to;
      var ambig_piece = moves[i].piece;

      /* if a move of the same piece type ends on the same to square, we'll
       * need to add a disambiguator to the algebraic notation
       */
      if (piece === ambig_piece && from !== ambig_from && to === ambig_to) {
        ambiguities++;

        if (rank(from) === rank(ambig_from)) {
          same_rank++;
        }

        if (file(from) === file(ambig_from)) {
          same_file++;
        }
      }
    }

    if (ambiguities > 0) {
      /* if there exists a similar moving piece on the same rank and file as
       * the move in question, use the square as the disambiguator
       */
      if (same_rank > 0 && same_file > 0) {
        return algebraic(from);
      }
      /* if the moving piece rests on the same file, use the rank symbol as the
       * disambiguator
       */
      else if (same_file > 0) {
        return algebraic(from).charAt(1);
      }
      /* else use the file symbol */
      else {
        return algebraic(from).charAt(0);
      }
    }

    return '';
  }

  function ascii() {
    var s = '   +------------------------+\n';
    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      /* display the rank */
      if (file(i) === 0) {
        s += ' ' + '87654321'[rank(i)] + ' |';
      }

      /* empty piece */
      if (board[i] == null) {
        s += ' . ';
      } else {
        var piece = board[i].type;
        var color = board[i].color;
        var symbol = (color === WHITE) ?
                     piece.toUpperCase() : piece.toLowerCase();
        s += ' ' + symbol + ' ';
      }

      if ((i + 1) & 0x88) {
        s += '|\n';
        i += 8;
      }
    }
    s += '   +------------------------+\n';
    s += '     a  b  c  d  e  f  g  h\n';

    return s;
  }

  // convert a move from Standard Algebraic Notation (SAN) to 0x88 coordinates
  function move_from_san(move, sloppy) {
    // strip off any move decorations: e.g Nf3+?!
    var clean_move = stripped_san(move);

    // if we're using the sloppy parser run a regex to grab piece, to, and from
    // this should parse invalid SAN like: Pe2-e4, Rc1c4, Qf3xf7
    if (sloppy) {
      var matches = clean_move.match(/([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/);
      if (matches) {
        var piece = matches[1];
        var from = matches[2];
        var to = matches[3];
        var promotion = matches[4];
      }
    }

    var moves = generate_moves();
    for (var i = 0, len = moves.length; i < len; i++) {
      // try the strict parser first, then the sloppy parser if requested
      // by the user
      if ((clean_move === stripped_san(move_to_san(moves[i]))) ||
          (sloppy && clean_move === stripped_san(move_to_san(moves[i], true)))) {
        return moves[i];
      } else {
        if (matches &&
            (!piece || piece.toLowerCase() == moves[i].piece) &&
            SQUARES[from] == moves[i].from &&
            SQUARES[to] == moves[i].to &&
            (!promotion || promotion.toLowerCase() == moves[i].promotion)) {
          return moves[i];
        }
      }
    }

    return null;
  }


  /*****************************************************************************
   * UTILITY FUNCTIONS
   ****************************************************************************/
  function rank(i) {
    return i >> 4;
  }

  function file(i) {
    return i & 15;
  }

  function algebraic(i){
    var f = file(i), r = rank(i);
    return 'abcdefgh'.substring(f,f+1) + '87654321'.substring(r,r+1);
  }

  function swap_color(c) {
    return c === WHITE ? BLACK : WHITE;
  }

  function is_digit(c) {
    return '0123456789'.indexOf(c) !== -1;
  }

  /* pretty = external move object */
  function make_pretty(ugly_move) {
    var move = clone(ugly_move);
    move.san = move_to_san(move, false);
    move.to = algebraic(move.to);
    move.from = algebraic(move.from);

    var flags = '';

    for (var flag in BITS) {
      if (BITS[flag] & move.flags) {
        flags += FLAGS[flag];
      }
    }
    move.flags = flags;

    return move;
  }

  function clone(obj) {
    var dupe = (obj instanceof Array) ? [] : {};

    for (var property in obj) {
      if (typeof property === 'object') {
        dupe[property] = clone(obj[property]);
      } else {
        dupe[property] = obj[property];
      }
    }

    return dupe;
  }

  function trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
  }

  /*****************************************************************************
   * DEBUGGING UTILITIES
   ****************************************************************************/
  function perft(depth) {
    var moves = generate_moves({legal: false});
    var nodes = 0;
    var color = turn;

    for (var i = 0, len = moves.length; i < len; i++) {
      make_move(moves[i]);
      if (!king_attacked(color)) {
        if (depth - 1 > 0) {
          var child_nodes = perft(depth - 1);
          nodes += child_nodes;
        } else {
          nodes++;
        }
      }
      undo_move();
    }

    return nodes;
  }

  return {
    /***************************************************************************
     * PUBLIC CONSTANTS (is there a better way to do this?)
     **************************************************************************/
    WHITE: WHITE,
    BLACK: BLACK,
    PAWN: PAWN,
    KNIGHT: KNIGHT,
    BISHOP: BISHOP,
    ROOK: ROOK,
    QUEEN: QUEEN,
    KING: KING,
    SQUARES: (function() {
                /* from the ECMA-262 spec (section 12.6.4):
                 * "The mechanics of enumerating the properties ... is
                 * implementation dependent"
                 * so: for (var sq in SQUARES) { keys.push(sq); } might not be
                 * ordered correctly
                 */
                var keys = [];
                for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
                  if (i & 0x88) { i += 7; continue; }
                  keys.push(algebraic(i));
                }
                return keys;
              })(),
    FLAGS: FLAGS,

    /***************************************************************************
     * PUBLIC API
     **************************************************************************/
    load: function(fen) {
      return load(fen);
    },

    reset: function() {
      return reset();
    },

    moves: function(options) {
      /* The internal representation of a chess move is in 0x88 format, and
       * not meant to be human-readable.  The code below converts the 0x88
       * square coordinates to algebraic coordinates.  It also prunes an
       * unnecessary move keys resulting from a verbose call.
       */

      var ugly_moves = generate_moves(options);
      var moves = [];

      for (var i = 0, len = ugly_moves.length; i < len; i++) {

        /* does the user want a full move object (most likely not), or just
         * SAN
         */
        if (typeof options !== 'undefined' && 'verbose' in options &&
            options.verbose) {
          moves.push(make_pretty(ugly_moves[i]));
        } else {
          moves.push(move_to_san(ugly_moves[i], false));
        }
      }

      return moves;
    },

    in_check: function() {
      return in_check();
    },

    in_checkmate: function() {
      return in_checkmate();
    },

    in_stalemate: function() {
      return in_stalemate();
    },

    in_draw: function() {
      return half_moves >= 100 ||
             in_stalemate() ||
             insufficient_material() ||
             in_threefold_repetition();
    },

    insufficient_material: function() {
      return insufficient_material();
    },

    in_threefold_repetition: function() {
      return in_threefold_repetition();
    },

    game_over: function() {
      return half_moves >= 100 ||
             in_checkmate() ||
             in_stalemate() ||
             insufficient_material() ||
             in_threefold_repetition();
    },

    validate_fen: function(fen) {
      return validate_fen(fen);
    },

    fen: function() {
      return generate_fen();
    },

    pgn: function(options) {
      /* using the specification from http://www.chessclub.com/help/PGN-spec
       * example for html usage: .pgn({ max_width: 72, newline_char: "<br />" })
       */
      var newline = (typeof options === 'object' &&
                     typeof options.newline_char === 'string') ?
                     options.newline_char : '\n';
      var max_width = (typeof options === 'object' &&
                       typeof options.max_width === 'number') ?
                       options.max_width : 0;
      var result = [];
      var header_exists = false;

      /* add the PGN header headerrmation */
      for (var i in header) {
        /* TODO: order of enumerated properties in header object is not
         * guaranteed, see ECMA-262 spec (section 12.6.4)
         */
        result.push('[' + i + ' \"' + header[i] + '\"]' + newline);
        header_exists = true;
      }

      if (header_exists && history.length) {
        result.push(newline);
      }

      /* pop all of history onto reversed_history */
      var reversed_history = [];
      while (history.length > 0) {
        reversed_history.push(undo_move());
      }

      var moves = [];
      var move_string = '';

      /* build the list of moves.  a move_string looks like: "3. e3 e6" */
      while (reversed_history.length > 0) {
        var move = reversed_history.pop();

        /* if the position started with black to move, start PGN with 1. ... */
        if (!history.length && move.color === 'b') {
          move_string = move_number + '. ...';
        } else if (move.color === 'w') {
          /* store the previous generated move_string if we have one */
          if (move_string.length) {
            moves.push(move_string);
          }
          move_string = move_number + '.';
        }

        move_string = move_string + ' ' + move_to_san(move, false);
        make_move(move);
      }

      /* are there any other leftover moves? */
      if (move_string.length) {
        moves.push(move_string);
      }

      /* is there a result? */
      if (typeof header.Result !== 'undefined') {
        moves.push(header.Result);
      }

      /* history should be back to what is was before we started generating PGN,
       * so join together moves
       */
      if (max_width === 0) {
        return result.join('') + moves.join(' ');
      }

      /* wrap the PGN output at max_width */
      var current_width = 0;
      for (var i = 0; i < moves.length; i++) {
        /* if the current move will push past max_width */
        if (current_width + moves[i].length > max_width && i !== 0) {

          /* don't end the line with whitespace */
          if (result[result.length - 1] === ' ') {
            result.pop();
          }

          result.push(newline);
          current_width = 0;
        } else if (i !== 0) {
          result.push(' ');
          current_width++;
        }
        result.push(moves[i]);
        current_width += moves[i].length;
      }

      return result.join('');
    },

    load_pgn: function(pgn, options) {
      // allow the user to specify the sloppy move parser to work around over
      // disambiguation bugs in Fritz and Chessbase
      var sloppy = (typeof options !== 'undefined' && 'sloppy' in options) ?
                    options.sloppy : false;

      function mask(str) {
        return str.replace(/\\/g, '\\');
      }

      function has_keys(object) {
        for (var key in object) {
          return true;
        }
        return false;
      }

      function parse_pgn_header(header, options) {
        var newline_char = (typeof options === 'object' &&
                            typeof options.newline_char === 'string') ?
                            options.newline_char : '\r?\n';
        var header_obj = {};
        var headers = header.split(new RegExp(mask(newline_char)));
        var key = '';
        var value = '';

        for (var i = 0; i < headers.length; i++) {
          key = headers[i].replace(/^\[([A-Z][A-Za-z]*)\s.*\]$/, '$1');
          value = headers[i].replace(/^\[[A-Za-z]+\s"(.*)"\]$/, '$1');
          if (trim(key).length > 0) {
            header_obj[key] = value;
          }
        }

        return header_obj;
      }

      var newline_char = (typeof options === 'object' &&
                          typeof options.newline_char === 'string') ?
                          options.newline_char : '\r?\n';
      var regex = new RegExp('^(\\[(.|' + mask(newline_char) + ')*\\])' +
                             '(' + mask(newline_char) + ')*' +
                             '1.(' + mask(newline_char) + '|.)*$', 'g');

      /* get header part of the PGN file */
      var header_string = pgn.replace(regex, '$1');

      /* no info part given, begins with moves */
      if (header_string[0] !== '[') {
        header_string = '';
      }

      reset();

      /* parse PGN header */
      var headers = parse_pgn_header(header_string, options);
      for (var key in headers) {
        set_header([key, headers[key]]);
      }

      /* load the starting position indicated by [Setup '1'] and
      * [FEN position] */
      if (headers['SetUp'] === '1') {
          if (!(('FEN' in headers) && load(headers['FEN']))) {
            return false;
          }
      }

      /* delete header to get the moves */
      var ms = pgn.replace(header_string, '').replace(new RegExp(mask(newline_char), 'g'), ' ');

      /* delete comments */
      ms = ms.replace(/(\{[^}]+\})+?/g, '');

      /* delete recursive annotation variations */
      var rav_regex = /(\([^\(\)]+\))+?/g
      while (rav_regex.test(ms)) {
        ms = ms.replace(rav_regex, '');
      }

      /* delete move numbers */
      ms = ms.replace(/\d+\.(\.\.)?/g, '');

      /* delete ... indicating black to move */
      ms = ms.replace(/\.\.\./g, '');

      /* delete numeric annotation glyphs */
      ms = ms.replace(/\$\d+/g, '');

      /* trim and get array of moves */
      var moves = trim(ms).split(new RegExp(/\s+/));

      /* delete empty entries */
      moves = moves.join(',').replace(/,,+/g, ',').split(',');
      var move = '';

      for (var half_move = 0; half_move < moves.length - 1; half_move++) {
        move = move_from_san(moves[half_move], sloppy);

        /* move not possible! (don't clear the board to examine to show the
         * latest valid position)
         */
        if (move == null) {
          return false;
        } else {
          make_move(move);
        }
      }

      /* examine last move */
      move = moves[moves.length - 1];
      if (POSSIBLE_RESULTS.indexOf(move) > -1) {
        if (has_keys(header) && typeof header.Result === 'undefined') {
          set_header(['Result', move]);
        }
      }
      else {
        move = move_from_san(move, sloppy);
        if (move == null) {
          return false;
        } else {
          make_move(move);
        }
      }
      return true;
    },

    header: function() {
      return set_header(arguments);
    },

    ascii: function() {
      return ascii();
    },

    turn: function() {
      return turn;
    },

    move: function(move, options) {
      /* The move function can be called with in the following parameters:
       *
       * .move('Nxb7')      <- where 'move' is a case-sensitive SAN string
       *
       * .move({ from: 'h7', <- where the 'move' is a move object (additional
       *         to :'h8',      fields are ignored)
       *         promotion: 'q',
       *      })
       */

      // allow the user to specify the sloppy move parser to work around over
      // disambiguation bugs in Fritz and Chessbase
      var sloppy = (typeof options !== 'undefined' && 'sloppy' in options) ?
                    options.sloppy : false;

      var move_obj = null;

      if (typeof move === 'string') {
        move_obj = move_from_san(move, sloppy);
      } else if (typeof move === 'object') {
        var moves = generate_moves();

        /* convert the pretty move object to an ugly move object */
        for (var i = 0, len = moves.length; i < len; i++) {
          if (move.from === algebraic(moves[i].from) &&
              move.to === algebraic(moves[i].to) &&
              (!('promotion' in moves[i]) ||
              move.promotion === moves[i].promotion)) {
            move_obj = moves[i];
            break;
          }
        }
      }

      /* failed to find move */
      if (!move_obj) {
        return null;
      }

      /* need to make a copy of move because we can't generate SAN after the
       * move is made
       */
      var pretty_move = make_pretty(move_obj);

      make_move(move_obj);

      return pretty_move;
    },

    undo: function() {
      var move = undo_move();
      return (move) ? make_pretty(move) : null;
    },

    clear: function() {
      return clear();
    },

    put: function(piece, square) {
      return put(piece, square);
    },

    get: function(square) {
      return get(square);
    },

    remove: function(square) {
      return remove(square);
    },

    perft: function(depth) {
      return perft(depth);
    },

    square_color: function(square) {
      if (square in SQUARES) {
        var sq_0x88 = SQUARES[square];
        return ((rank(sq_0x88) + file(sq_0x88)) % 2 === 0) ? 'light' : 'dark';
      }

      return null;
    },

    history: function(options) {
      var reversed_history = [];
      var move_history = [];
      var verbose = (typeof options !== 'undefined' && 'verbose' in options &&
                     options.verbose);

      while (history.length > 0) {
        reversed_history.push(undo_move());
      }

      while (reversed_history.length > 0) {
        var move = reversed_history.pop();
        if (verbose) {
          move_history.push(make_pretty(move));
        } else {
          move_history.push(move_to_san(move));
        }
        make_move(move);
      }

      return move_history;
    }

  };
};

/* export Chess object if using node or any other CommonJS compatible
 * environment */
if (typeof exports !== 'undefined') exports.Chess = Chess;
/* export Chess object for any RequireJS compatible environment */
if (typeof define !== 'undefined') define( function () { return Chess;  });

},{}],2:[function(require,module,exports){
// This file is the concatenation of many js files.
// See http://github.com/jimhigson/oboe.js for the raw source

// having a local undefined, window, Object etc allows slightly better minification:
(function  (window, Object, Array, Error, JSON, undefined ) {

   // v2.1.3-15-g7432b49

/*

Copyright (c) 2013, Jim Higson

All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

1.  Redistributions of source code must retain the above copyright
    notice, this list of conditions and the following disclaimer.

2.  Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/** 
 * Partially complete a function.
 * 
 *  var add3 = partialComplete( function add(a,b){return a+b}, 3 );
 *  
 *  add3(4) // gives 7
 *  
 *  function wrap(left, right, cen){return left + " " + cen + " " + right;}
 *  
 *  var pirateGreeting = partialComplete( wrap , "I'm", ", a mighty pirate!" );
 *  
 *  pirateGreeting("Guybrush Threepwood"); 
 *  // gives "I'm Guybrush Threepwood, a mighty pirate!"
 */
var partialComplete = varArgs(function( fn, args ) {

      // this isn't the shortest way to write this but it does
      // avoid creating a new array each time to pass to fn.apply,
      // otherwise could just call boundArgs.concat(callArgs)       

      var numBoundArgs = args.length;

      return varArgs(function( callArgs ) {
         
         for (var i = 0; i < callArgs.length; i++) {
            args[numBoundArgs + i] = callArgs[i];
         }
         
         args.length = numBoundArgs + callArgs.length;         
                     
         return fn.apply(this, args);
      }); 
   }),

/**
 * Compose zero or more functions:
 * 
 *    compose(f1, f2, f3)(x) = f1(f2(f3(x))))
 * 
 * The last (inner-most) function may take more than one parameter:
 * 
 *    compose(f1, f2, f3)(x,y) = f1(f2(f3(x,y))))
 */
   compose = varArgs(function(fns) {

      var fnsList = arrayAsList(fns);
   
      function next(params, curFn) {  
         return [apply(params, curFn)];   
      }
            
      return varArgs(function(startParams){
        
         return foldR(next, startParams, fnsList)[0];
      });
   });

/**
 * A more optimised version of compose that takes exactly two functions
 * @param f1
 * @param f2
 */
function compose2(f1, f2){
   return function(){
      return f1.call(this,f2.apply(this,arguments));
   }
}

/**
 * Generic form for a function to get a property from an object
 * 
 *    var o = {
 *       foo:'bar'
 *    }
 *    
 *    var getFoo = attr('foo')
 *    
 *    fetFoo(o) // returns 'bar'
 * 
 * @param {String} key the property name
 */
function attr(key) {
   return function(o) { return o[key]; };
}
        
/**
 * Call a list of functions with the same args until one returns a 
 * truthy result. Similar to the || operator.
 * 
 * So:
 *      lazyUnion([f1,f2,f3 ... fn])( p1, p2 ... pn )
 *      
 * Is equivalent to: 
 *      apply([p1, p2 ... pn], f1) || 
 *      apply([p1, p2 ... pn], f2) || 
 *      apply([p1, p2 ... pn], f3) ... apply(fn, [p1, p2 ... pn])  
 *  
 * @returns the first return value that is given that is truthy.
 */
   var lazyUnion = varArgs(function(fns) {

      return varArgs(function(params){
   
         var maybeValue;
   
         for (var i = 0; i < len(fns); i++) {
   
            maybeValue = apply(params, fns[i]);
   
            if( maybeValue ) {
               return maybeValue;
            }
         }
      });
   });   

/**
 * This file declares various pieces of functional programming.
 * 
 * This isn't a general purpose functional library, to keep things small it
 * has just the parts useful for Oboe.js.
 */


/**
 * Call a single function with the given arguments array.
 * Basically, a functional-style version of the OO-style Function#apply for 
 * when we don't care about the context ('this') of the call.
 * 
 * The order of arguments allows partial completion of the arguments array
 */
function apply(args, fn) {
   return fn.apply(undefined, args);
}

/**
 * Define variable argument functions but cut out all that tedious messing about 
 * with the arguments object. Delivers the variable-length part of the arguments
 * list as an array.
 * 
 * Eg:
 * 
 * var myFunction = varArgs(
 *    function( fixedArgument, otherFixedArgument, variableNumberOfArguments ){
 *       console.log( variableNumberOfArguments );
 *    }
 * )
 * 
 * myFunction('a', 'b', 1, 2, 3); // logs [1,2,3]
 * 
 * var myOtherFunction = varArgs(function( variableNumberOfArguments ){
 *    console.log( variableNumberOfArguments );
 * })
 * 
 * myFunction(1, 2, 3); // logs [1,2,3]
 * 
 */
function varArgs(fn){

   var numberOfFixedArguments = fn.length -1,
       slice = Array.prototype.slice;          
         
                   
   if( numberOfFixedArguments == 0 ) {
      // an optimised case for when there are no fixed args:   
   
      return function(){
         return fn.call(this, slice.call(arguments));
      }
      
   } else if( numberOfFixedArguments == 1 ) {
      // an optimised case for when there are is one fixed args:
   
      return function(){
         return fn.call(this, arguments[0], slice.call(arguments, 1));
      }
   }
   
   // general case   

   // we know how many arguments fn will always take. Create a
   // fixed-size array to hold that many, to be re-used on
   // every call to the returned function
   var argsHolder = Array(fn.length);   
                             
   return function(){
                            
      for (var i = 0; i < numberOfFixedArguments; i++) {
         argsHolder[i] = arguments[i];         
      }

      argsHolder[numberOfFixedArguments] = 
         slice.call(arguments, numberOfFixedArguments);
                                
      return fn.apply( this, argsHolder);      
   }       
}


/**
 * Swap the order of parameters to a binary function
 * 
 * A bit like this flip: http://zvon.org/other/haskell/Outputprelude/flip_f.html
 */
function flip(fn){
   return function(a, b){
      return fn(b,a);
   }
}


/**
 * Create a function which is the intersection of two other functions.
 * 
 * Like the && operator, if the first is truthy, the second is never called,
 * otherwise the return value from the second is returned.
 */
function lazyIntersection(fn1, fn2) {

   return function (param) {
                                                              
      return fn1(param) && fn2(param);
   };   
}

/**
 * A function which does nothing
 */
function noop(){}

/**
 * A function which is always happy
 */
function always(){return true}

/**
 * Create a function which always returns the same
 * value
 * 
 * var return3 = functor(3);
 * 
 * return3() // gives 3
 * return3() // still gives 3
 * return3() // will always give 3
 */
function functor(val){
   return function(){
      return val;
   }
}

/**
 * This file defines some loosely associated syntactic sugar for 
 * Javascript programming 
 */


/**
 * Returns true if the given candidate is of type T
 */
function isOfType(T, maybeSomething){
   return maybeSomething && maybeSomething.constructor === T;
}

var len = attr('length'),    
    isString = partialComplete(isOfType, String);

/** 
 * I don't like saying this:
 * 
 *    foo !=== undefined
 *    
 * because of the double-negative. I find this:
 * 
 *    defined(foo)
 *    
 * easier to read.
 */ 
function defined( value ) {
   return value !== undefined;
}

/**
 * Returns true if object o has a key named like every property in 
 * the properties array. Will give false if any are missing, or if o 
 * is not an object.
 */
function hasAllProperties(fieldList, o) {

   return      (o instanceof Object) 
            &&
               all(function (field) {         
                  return (field in o);         
               }, fieldList);
}
/**
 * Like cons in Lisp
 */
function cons(x, xs) {
   
   /* Internally lists are linked 2-element Javascript arrays.
          
      Ideally the return here would be Object.freeze([x,xs])
      so that bugs related to mutation are found fast.
      However, cons is right on the critical path for
      performance and this slows oboe-mark down by
      ~25%. Under theoretical future JS engines that freeze more
      efficiently (possibly even use immutability to
      run faster) this should be considered for
      restoration.
   */
   
   return [x,xs];
}

/**
 * The empty list
 */
var emptyList = null,

/**
 * Get the head of a list.
 * 
 * Ie, head(cons(a,b)) = a
 */
    head = attr(0),

/**
 * Get the tail of a list.
 * 
 * Ie, tail(cons(a,b)) = b
 */
    tail = attr(1);


/** 
 * Converts an array to a list 
 * 
 *    asList([a,b,c])
 * 
 * is equivalent to:
 *    
 *    cons(a, cons(b, cons(c, emptyList))) 
 **/
function arrayAsList(inputArray){

   return reverseList( 
      inputArray.reduce(
         flip(cons),
         emptyList 
      )
   );
}

/**
 * A varargs version of arrayAsList. Works a bit like list
 * in LISP.
 * 
 *    list(a,b,c) 
 *    
 * is equivalent to:
 * 
 *    cons(a, cons(b, cons(c, emptyList)))
 */
var list = varArgs(arrayAsList);

/**
 * Convert a list back to a js native array
 */
function listAsArray(list){

   return foldR( function(arraySoFar, listItem){
      
      arraySoFar.unshift(listItem);
      return arraySoFar;
           
   }, [], list );
   
}

/**
 * Map a function over a list 
 */
function map(fn, list) {

   return list
            ? cons(fn(head(list)), map(fn,tail(list)))
            : emptyList
            ;
}

/**
 * foldR implementation. Reduce a list down to a single value.
 * 
 * @pram {Function} fn     (rightEval, curVal) -> result 
 */
function foldR(fn, startValue, list) {
      
   return list 
            ? fn(foldR(fn, startValue, tail(list)), head(list))
            : startValue
            ;
}

/**
 * foldR implementation. Reduce a list down to a single value.
 * 
 * @pram {Function} fn     (rightEval, curVal) -> result 
 */
function foldR1(fn, list) {
      
   return tail(list) 
            ? fn(foldR1(fn, tail(list)), head(list))
            : head(list)
            ;
}


/**
 * Return a list like the one given but with the first instance equal 
 * to item removed 
 */
function without(list, test, removedFn) {
 
   return withoutInner(list, removedFn || noop);
 
   function withoutInner(subList, removedFn) {
      return subList  
         ?  ( test(head(subList)) 
                  ? (removedFn(head(subList)), tail(subList)) 
                  : cons(head(subList), withoutInner(tail(subList), removedFn))
            )
         : emptyList
         ;
   }               
}

/** 
 * Returns true if the given function holds for every item in 
 * the list, false otherwise 
 */
function all(fn, list) {
   
   return !list || 
          ( fn(head(list)) && all(fn, tail(list)) );
}

/**
 * Call every function in a list of functions with the same arguments
 * 
 * This doesn't make any sense if we're doing pure functional because 
 * it doesn't return anything. Hence, this is only really useful if the
 * functions being called have side-effects. 
 */
function applyEach(fnList, args) {

   if( fnList ) {  
      head(fnList).apply(null, args);
      
      applyEach(tail(fnList), args);
   }
}

/**
 * Reverse the order of a list
 */
function reverseList(list){ 

   // js re-implementation of 3rd solution from:
   //    http://www.haskell.org/haskellwiki/99_questions/Solutions/5
   function reverseInner( list, reversedAlready ) {
      if( !list ) {
         return reversedAlready;
      }
      
      return reverseInner(tail(list), cons(head(list), reversedAlready))
   }

   return reverseInner(list, emptyList);
}

function first(test, list) {
   return   list &&
               (test(head(list)) 
                  ? head(list) 
                  : first(test,tail(list))); 
}

/* 
   This is a slightly hacked-up browser only version of clarinet 
   
      *  some features removed to help keep browser Oboe under 
         the 5k micro-library limit
      *  plug directly into event bus
   
   For the original go here:
      https://github.com/dscape/clarinet

   We receive the events:
      STREAM_DATA
      STREAM_END
      
   We emit the events:
      SAX_KEY
      SAX_VALUE_OPEN
      SAX_VALUE_CLOSE      
      FAIL_EVENT      
 */

function clarinet(eventBus) {
  "use strict";
   
  var 
      // shortcut some events on the bus
      emitSaxKey           = eventBus(SAX_KEY).emit,
      emitValueOpen        = eventBus(SAX_VALUE_OPEN).emit,
      emitValueClose       = eventBus(SAX_VALUE_CLOSE).emit,
      emitFail             = eventBus(FAIL_EVENT).emit,
              
      MAX_BUFFER_LENGTH = 64 * 1024
  ,   stringTokenPattern = /[\\"\n]/g
  ,   _n = 0
  
      // states
  ,   BEGIN                = _n++
  ,   VALUE                = _n++ // general stuff
  ,   OPEN_OBJECT          = _n++ // {
  ,   CLOSE_OBJECT         = _n++ // }
  ,   OPEN_ARRAY           = _n++ // [
  ,   CLOSE_ARRAY          = _n++ // ]
  ,   STRING               = _n++ // ""
  ,   OPEN_KEY             = _n++ // , "a"
  ,   CLOSE_KEY            = _n++ // :
  ,   TRUE                 = _n++ // r
  ,   TRUE2                = _n++ // u
  ,   TRUE3                = _n++ // e
  ,   FALSE                = _n++ // a
  ,   FALSE2               = _n++ // l
  ,   FALSE3               = _n++ // s
  ,   FALSE4               = _n++ // e
  ,   NULL                 = _n++ // u
  ,   NULL2                = _n++ // l
  ,   NULL3                = _n++ // l
  ,   NUMBER_DECIMAL_POINT = _n++ // .
  ,   NUMBER_DIGIT         = _n   // [0-9]

      // setup initial parser values
  ,   bufferCheckPosition  = MAX_BUFFER_LENGTH
  ,   latestError                
  ,   c                    
  ,   p                    
  ,   textNode             = undefined
  ,   numberNode           = ""     
  ,   slashed              = false
  ,   closed               = false
  ,   state                = BEGIN
  ,   stack                = []
  ,   unicodeS             = null
  ,   unicodeI             = 0
  ,   depth                = 0
  ,   position             = 0
  ,   column               = 0  //mostly for error reporting
  ,   line                 = 1
  ;

  function checkBufferLength () {
     
    var maxActual = 0;
     
    if (textNode !== undefined && textNode.length > MAX_BUFFER_LENGTH) {
      emitError("Max buffer length exceeded: textNode");
      maxActual = Math.max(maxActual, textNode.length);
    }
    if (numberNode.length > MAX_BUFFER_LENGTH) {
      emitError("Max buffer length exceeded: numberNode");
      maxActual = Math.max(maxActual, numberNode.length);
    }
     
    bufferCheckPosition = (MAX_BUFFER_LENGTH - maxActual)
                               + position;
  }

  eventBus(STREAM_DATA).on(handleData);

   /* At the end of the http content close the clarinet 
    This will provide an error if the total content provided was not 
    valid json, ie if not all arrays, objects and Strings closed properly */
  eventBus(STREAM_END).on(handleStreamEnd);   

  function emitError (errorString) {
     if (textNode !== undefined) {
        emitValueOpen(textNode);
        emitValueClose();
        textNode = undefined;
     }

     latestError = Error(errorString + "\nLn: "+line+
                                       "\nCol: "+column+
                                       "\nChr: "+c);
     
     emitFail(errorReport(undefined, undefined, latestError));
  }

  function handleStreamEnd() {
    if( state == BEGIN ) {
      // Handle the case where the stream closes without ever receiving
      // any input. This isn't an error - response bodies can be blank,
      // particularly for 204 http responses
      
      // Because of how Oboe is currently implemented, we parse a
      // completely empty stream as containing an empty object.
      // This is because Oboe's done event is only fired when the
      // root object of the JSON stream closes.
      
      // This should be decoupled and attached instead to the input stream
      // from the http (or whatever) resource ending.
      // If this decoupling could happen the SAX parser could simply emit
      // zero events on a completely empty input.
      emitValueOpen({});
      emitValueClose();

      closed = true;
      return;
    }
  
    if (state !== VALUE || depth !== 0)
      emitError("Unexpected end");
 
    if (textNode !== undefined) {
      emitValueOpen(textNode);
      emitValueClose();
      textNode = undefined;
    }
     
    closed = true;
  }

  function whitespace(c){
     return c == '\r' || c == '\n' || c == ' ' || c == '\t';
  }
   
  function handleData (chunk) {
         
    // this used to throw the error but inside Oboe we will have already
    // gotten the error when it was emitted. The important thing is to
    // not continue with the parse.
    if (latestError)
      return;
      
    if (closed) {
       return emitError("Cannot write after close");
    }

    var i = 0;
    c = chunk[0]; 

    while (c) {
      if (i > 0) {
        p = c;
      }
      c = chunk[i++];
      if(!c) break;

      position ++;
      if (c == "\n") {
        line ++;
        column = 0;
      } else column ++;
      switch (state) {

        case BEGIN:
          if (c === "{") state = OPEN_OBJECT;
          else if (c === "[") state = OPEN_ARRAY;
          else if (!whitespace(c))
            return emitError("Non-whitespace before {[.");
        continue;

        case OPEN_KEY:
        case OPEN_OBJECT:
          if (whitespace(c)) continue;
          if(state === OPEN_KEY) stack.push(CLOSE_KEY);
          else {
            if(c === '}') {
              emitValueOpen({});
              emitValueClose();
              state = stack.pop() || VALUE;
              continue;
            } else  stack.push(CLOSE_OBJECT);
          }
          if(c === '"')
             state = STRING;
          else
             return emitError("Malformed object key should start with \" ");
        continue;

        case CLOSE_KEY:
        case CLOSE_OBJECT:
          if (whitespace(c)) continue;

          if(c===':') {
            if(state === CLOSE_OBJECT) {
              stack.push(CLOSE_OBJECT);

               if (textNode !== undefined) {
                  // was previously (in upstream Clarinet) one event
                  //  - object open came with the text of the first
                  emitValueOpen({});
                  emitSaxKey(textNode);
                  textNode = undefined;
               }
               depth++;
            } else {
               if (textNode !== undefined) {
                  emitSaxKey(textNode);
                  textNode = undefined;
               }
            }
             state  = VALUE;
          } else if (c==='}') {
             if (textNode !== undefined) {
                emitValueOpen(textNode);
                emitValueClose();
                textNode = undefined;
             }
             emitValueClose();
            depth--;
            state = stack.pop() || VALUE;
          } else if(c===',') {
            if(state === CLOSE_OBJECT)
              stack.push(CLOSE_OBJECT);
             if (textNode !== undefined) {
                emitValueOpen(textNode);
                emitValueClose();
                textNode = undefined;
             }
             state  = OPEN_KEY;
          } else 
             return emitError('Bad object');
        continue;

        case OPEN_ARRAY: // after an array there always a value
        case VALUE:
          if (whitespace(c)) continue;
          if(state===OPEN_ARRAY) {
            emitValueOpen([]);
            depth++;             
            state = VALUE;
            if(c === ']') {
              emitValueClose();
              depth--;
              state = stack.pop() || VALUE;
              continue;
            } else {
              stack.push(CLOSE_ARRAY);
            }
          }
               if(c === '"') state = STRING;
          else if(c === '{') state = OPEN_OBJECT;
          else if(c === '[') state = OPEN_ARRAY;
          else if(c === 't') state = TRUE;
          else if(c === 'f') state = FALSE;
          else if(c === 'n') state = NULL;
          else if(c === '-') { // keep and continue
            numberNode += c;
          } else if(c==='0') {
            numberNode += c;
            state = NUMBER_DIGIT;
          } else if('123456789'.indexOf(c) !== -1) {
            numberNode += c;
            state = NUMBER_DIGIT;
          } else               
            return emitError("Bad value");
        continue;

        case CLOSE_ARRAY:
          if(c===',') {
            stack.push(CLOSE_ARRAY);
             if (textNode !== undefined) {
                emitValueOpen(textNode);
                emitValueClose();
                textNode = undefined;
             }
             state  = VALUE;
          } else if (c===']') {
             if (textNode !== undefined) {
                emitValueOpen(textNode);
                emitValueClose();
                textNode = undefined;
             }
             emitValueClose();
            depth--;
            state = stack.pop() || VALUE;
          } else if (whitespace(c))
              continue;
          else 
             return emitError('Bad array');
        continue;

        case STRING:
          if (textNode === undefined) {
              textNode = "";
          }

          // thanks thejh, this is an about 50% performance improvement.
          var starti              = i-1;
           
          STRING_BIGLOOP: while (true) {

            // zero means "no unicode active". 1-4 mean "parse some more". end after 4.
            while (unicodeI > 0) {
              unicodeS += c;
              c = chunk.charAt(i++);
              if (unicodeI === 4) {
                // TODO this might be slow? well, probably not used too often anyway
                textNode += String.fromCharCode(parseInt(unicodeS, 16));
                unicodeI = 0;
                starti = i-1;
              } else {
                unicodeI++;
              }
              // we can just break here: no stuff we skipped that still has to be sliced out or so
              if (!c) break STRING_BIGLOOP;
            }
            if (c === '"' && !slashed) {
              state = stack.pop() || VALUE;
              textNode += chunk.substring(starti, i-1);
              break;
            }
            if (c === '\\' && !slashed) {
              slashed = true;
              textNode += chunk.substring(starti, i-1);
               c = chunk.charAt(i++);
              if (!c) break;
            }
            if (slashed) {
              slashed = false;
                   if (c === 'n') { textNode += '\n'; }
              else if (c === 'r') { textNode += '\r'; }
              else if (c === 't') { textNode += '\t'; }
              else if (c === 'f') { textNode += '\f'; }
              else if (c === 'b') { textNode += '\b'; }
              else if (c === 'u') {
                // \uxxxx. meh!
                unicodeI = 1;
                unicodeS = '';
              } else {
                textNode += c;
              }
              c = chunk.charAt(i++);
              starti = i-1;
              if (!c) break;
              else continue;
            }

            stringTokenPattern.lastIndex = i;
            var reResult = stringTokenPattern.exec(chunk);
            if (!reResult) {
              i = chunk.length+1;
              textNode += chunk.substring(starti, i-1);
              break;
            }
            i = reResult.index+1;
            c = chunk.charAt(reResult.index);
            if (!c) {
              textNode += chunk.substring(starti, i-1);
              break;
            }
          }
        continue;

        case TRUE:
          if (!c)  continue; // strange buffers
          if (c==='r') state = TRUE2;
          else
             return emitError( 'Invalid true started with t'+ c);
        continue;

        case TRUE2:
          if (!c)  continue;
          if (c==='u') state = TRUE3;
          else
             return emitError('Invalid true started with tr'+ c);
        continue;

        case TRUE3:
          if (!c) continue;
          if(c==='e') {
            emitValueOpen(true);
            emitValueClose();
            state = stack.pop() || VALUE;
          } else
             return emitError('Invalid true started with tru'+ c);
        continue;

        case FALSE:
          if (!c)  continue;
          if (c==='a') state = FALSE2;
          else
             return emitError('Invalid false started with f'+ c);
        continue;

        case FALSE2:
          if (!c)  continue;
          if (c==='l') state = FALSE3;
          else
             return emitError('Invalid false started with fa'+ c);
        continue;

        case FALSE3:
          if (!c)  continue;
          if (c==='s') state = FALSE4;
          else
             return emitError('Invalid false started with fal'+ c);
        continue;

        case FALSE4:
          if (!c)  continue;
          if (c==='e') {
            emitValueOpen(false);
            emitValueClose();
            state = stack.pop() || VALUE;
          } else
             return emitError('Invalid false started with fals'+ c);
        continue;

        case NULL:
          if (!c)  continue;
          if (c==='u') state = NULL2;
          else
             return emitError('Invalid null started with n'+ c);
        continue;

        case NULL2:
          if (!c)  continue;
          if (c==='l') state = NULL3;
          else
             return emitError('Invalid null started with nu'+ c);
        continue;

        case NULL3:
          if (!c) continue;
          if(c==='l') {
            emitValueOpen(null);
            emitValueClose();
            state = stack.pop() || VALUE;
          } else 
             return emitError('Invalid null started with nul'+ c);
        continue;

        case NUMBER_DECIMAL_POINT:
          if(c==='.') {
            numberNode += c;
            state       = NUMBER_DIGIT;
          } else 
             return emitError('Leading zero not followed by .');
        continue;

        case NUMBER_DIGIT:
          if('0123456789'.indexOf(c) !== -1) numberNode += c;
          else if (c==='.') {
            if(numberNode.indexOf('.')!==-1)
               return emitError('Invalid number has two dots');
            numberNode += c;
          } else if (c==='e' || c==='E') {
            if(numberNode.indexOf('e')!==-1 ||
               numberNode.indexOf('E')!==-1 )
               return emitError('Invalid number has two exponential');
            numberNode += c;
          } else if (c==="+" || c==="-") {
            if(!(p==='e' || p==='E'))
               return emitError('Invalid symbol in number');
            numberNode += c;
          } else {
            if (numberNode) {
              emitValueOpen(parseFloat(numberNode));
              emitValueClose();
              numberNode = "";
            }
            i--; // go back one
            state = stack.pop() || VALUE;
          }
        continue;

        default:
          return emitError("Unknown state: " + state);
      }
    }
    if (position >= bufferCheckPosition)
      checkBufferLength();
  }
}


/** 
 * A bridge used to assign stateless functions to listen to clarinet.
 * 
 * As well as the parameter from clarinet, each callback will also be passed
 * the result of the last callback.
 * 
 * This may also be used to clear all listeners by assigning zero handlers:
 * 
 *    ascentManager( clarinet, {} )
 */
function ascentManager(oboeBus, handlers){
   "use strict";
   
   var listenerId = {},
       ascent;

   function stateAfter(handler) {
      return function(param){
         ascent = handler( ascent, param);
      }
   }
   
   for( var eventName in handlers ) {

      oboeBus(eventName).on(stateAfter(handlers[eventName]), listenerId);
   }
   
   oboeBus(NODE_SWAP).on(function(newNode) {
      
      var oldHead = head(ascent),
          key = keyOf(oldHead),
          ancestors = tail(ascent),
          parentNode;

      if( ancestors ) {
         parentNode = nodeOf(head(ancestors));
         parentNode[key] = newNode;
      }
   });

   oboeBus(NODE_DROP).on(function() {

      var oldHead = head(ascent),
          key = keyOf(oldHead),
          ancestors = tail(ascent),
          parentNode;

      if( ancestors ) {
         parentNode = nodeOf(head(ancestors));
 
         delete parentNode[key];
      }
   });

   oboeBus(ABORTING).on(function(){
      
      for( var eventName in handlers ) {
         oboeBus(eventName).un(listenerId);
      }
   });   
}

// based on gist https://gist.github.com/monsur/706839

/**
 * XmlHttpRequest's getAllResponseHeaders() method returns a string of response
 * headers according to the format described here:
 * http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders-method
 * This method parses that string into a user-friendly key/value pair object.
 */
function parseResponseHeaders(headerStr) {
   var headers = {};
   
   headerStr && headerStr.split('\u000d\u000a')
      .forEach(function(headerPair){
   
         // Can't use split() here because it does the wrong thing
         // if the header value has the string ": " in it.
         var index = headerPair.indexOf('\u003a\u0020');
         
         headers[headerPair.substring(0, index)] 
                     = headerPair.substring(index + 2);
      });
   
   return headers;
}

/**
 * Detect if a given URL is cross-origin in the scope of the
 * current page.
 * 
 * Browser only (since cross-origin has no meaning in Node.js)
 *
 * @param {Object} pageLocation - as in window.location
 * @param {Object} ajaxHost - an object like window.location describing the 
 *    origin of the url that we want to ajax in
 */
function isCrossOrigin(pageLocation, ajaxHost) {

   /*
    * NB: defaultPort only knows http and https.
    * Returns undefined otherwise.
    */
   function defaultPort(protocol) {
      return {'http:':80, 'https:':443}[protocol];
   }
   
   function portOf(location) {
      // pageLocation should always have a protocol. ajaxHost if no port or
      // protocol is specified, should use the port of the containing page
      
      return location.port || defaultPort(location.protocol||pageLocation.protocol);
   }

   // if ajaxHost doesn't give a domain, port is the same as pageLocation
   // it can't give a protocol but not a domain
   // it can't give a port but not a domain
   
   return !!(  (ajaxHost.protocol  && (ajaxHost.protocol  != pageLocation.protocol)) ||
               (ajaxHost.host      && (ajaxHost.host      != pageLocation.host))     ||
               (ajaxHost.host      && (portOf(ajaxHost) != portOf(pageLocation)))
          );
}

/* turn any url into an object like window.location */
function parseUrlOrigin(url) {
   // url could be domain-relative
   // url could give a domain

   // cross origin means:
   //    same domain
   //    same port
   //    some protocol
   // so, same everything up to the first (single) slash 
   // if such is given
   //
   // can ignore everything after that   
   
   var URL_HOST_PATTERN = /(\w+:)?(?:\/\/)([\w.-]+)?(?::(\d+))?\/?/,

         // if no match, use an empty array so that
         // subexpressions 1,2,3 are all undefined
         // and will ultimately return all empty
         // strings as the parse result:
       urlHostMatch = URL_HOST_PATTERN.exec(url) || [];
   
   return {
      protocol:   urlHostMatch[1] || '',
      host:       urlHostMatch[2] || '',
      port:       urlHostMatch[3] || ''
   };
}

function httpTransport(){
   return new XMLHttpRequest();
}

/**
 * A wrapper around the browser XmlHttpRequest object that raises an 
 * event whenever a new part of the response is available.
 * 
 * In older browsers progressive reading is impossible so all the 
 * content is given in a single call. For newer ones several events
 * should be raised, allowing progressive interpretation of the response.
 *      
 * @param {Function} oboeBus an event bus local to this Oboe instance
 * @param {XMLHttpRequest} xhr the xhr to use as the transport. Under normal
 *          operation, will have been created using httpTransport() above
 *          but for tests a stub can be provided instead.
 * @param {String} method one of 'GET' 'POST' 'PUT' 'PATCH' 'DELETE'
 * @param {String} url the url to make a request to
 * @param {String|Null} data some content to be sent with the request.
 *                      Only valid if method is POST or PUT.
 * @param {Object} [headers] the http request headers to send
 * @param {boolean} withCredentials the XHR withCredentials property will be
 *    set to this value
 */  
function streamingHttp(oboeBus, xhr, method, url, data, headers, withCredentials) {
           
   "use strict";
   
   var emitStreamData = oboeBus(STREAM_DATA).emit,
       emitFail       = oboeBus(FAIL_EVENT).emit,
       numberOfCharsAlreadyGivenToCallback = 0,
       stillToSendStartEvent = true;

   // When an ABORTING message is put on the event bus abort 
   // the ajax request         
   oboeBus( ABORTING ).on( function(){
  
      // if we keep the onreadystatechange while aborting the XHR gives 
      // a callback like a successful call so first remove this listener
      // by assigning null:
      xhr.onreadystatechange = null;
            
      xhr.abort();
   });

   /** 
    * Handle input from the underlying xhr: either a state change,
    * the progress event or the request being complete.
    */
   function handleProgress() {
                        
      var textSoFar = xhr.responseText,
          newText = textSoFar.substr(numberOfCharsAlreadyGivenToCallback);
      
      
      /* Raise the event for new text.
      
         On older browsers, the new text is the whole response. 
         On newer/better ones, the fragment part that we got since 
         last progress. */
         
      if( newText ) {
         emitStreamData( newText );
      } 

      numberOfCharsAlreadyGivenToCallback = len(textSoFar);
   }
   
   
   if('onprogress' in xhr){  // detect browser support for progressive delivery
      xhr.onprogress = handleProgress;
   }
      
   xhr.onreadystatechange = function() {

      function sendStartIfNotAlready() {
         // Internet Explorer is very unreliable as to when xhr.status etc can
         // be read so has to be protected with try/catch and tried again on 
         // the next readyState if it fails
         try{
            stillToSendStartEvent && oboeBus( HTTP_START ).emit(
               xhr.status,
               parseResponseHeaders(xhr.getAllResponseHeaders()) );
            stillToSendStartEvent = false;
         } catch(e){/* do nothing, will try again on next readyState*/}
      }
      
      switch( xhr.readyState ) {
               
         case 2: // HEADERS_RECEIVED
         case 3: // LOADING
            return sendStartIfNotAlready();
            
         case 4: // DONE
            sendStartIfNotAlready(); // if xhr.status hasn't been available yet, it must be NOW, huh IE?
            
            // is this a 2xx http code?
            var successful = String(xhr.status)[0] == 2;
            
            if( successful ) {
               // In Chrome 29 (not 28) no onprogress is emitted when a response
               // is complete before the onload. We need to always do handleInput
               // in case we get the load but have not had a final progress event.
               // This looks like a bug and may change in future but let's take
               // the safest approach and assume we might not have received a 
               // progress event for each part of the response
               handleProgress();
               
               oboeBus(STREAM_END).emit();
            } else {

               emitFail( errorReport(
                  xhr.status, 
                  xhr.responseText
               ));
            }
      }
   };
   
   try{
   
      xhr.open(method, url, true);
   
      for( var headerName in headers ){
         xhr.setRequestHeader(headerName, headers[headerName]);
      }
      
      if( !isCrossOrigin(window.location, parseUrlOrigin(url)) ) {
         xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      }

      xhr.withCredentials = withCredentials;
      
      xhr.send(data);
      
   } catch( e ) {
      
      // To keep a consistent interface with Node, we can't emit an event here.
      // Node's streaming http adaptor receives the error as an asynchronous
      // event rather than as an exception. If we emitted now, the Oboe user
      // has had no chance to add a .fail listener so there is no way
      // the event could be useful. For both these reasons defer the
      // firing to the next JS frame.  
      window.setTimeout(
         partialComplete(emitFail, errorReport(undefined, undefined, e))
      ,  0
      );
   }            
}

var jsonPathSyntax = (function() {
 
   var
   
   /** 
    * Export a regular expression as a simple function by exposing just 
    * the Regex#exec. This allows regex tests to be used under the same 
    * interface as differently implemented tests, or for a user of the
    * tests to not concern themselves with their implementation as regular
    * expressions.
    * 
    * This could also be expressed point-free as:
    *   Function.prototype.bind.bind(RegExp.prototype.exec),
    *   
    * But that's far too confusing! (and not even smaller once minified 
    * and gzipped)
    */
       regexDescriptor = function regexDescriptor(regex) {
            return regex.exec.bind(regex);
       }
       
   /**
    * Join several regular expressions and express as a function.
    * This allows the token patterns to reuse component regular expressions
    * instead of being expressed in full using huge and confusing regular
    * expressions.
    */       
   ,   jsonPathClause = varArgs(function( componentRegexes ) {

            // The regular expressions all start with ^ because we 
            // only want to find matches at the start of the 
            // JSONPath fragment we are inspecting           
            componentRegexes.unshift(/^/);
            
            return   regexDescriptor(
                        RegExp(
                           componentRegexes.map(attr('source')).join('')
                        )
                     );
       })
       
   ,   possiblyCapturing =           /(\$?)/
   ,   namedNode =                   /([\w-_]+|\*)/
   ,   namePlaceholder =             /()/
   ,   nodeInArrayNotation =         /\["([^"]+)"\]/
   ,   numberedNodeInArrayNotation = /\[(\d+|\*)\]/
   ,   fieldList =                      /{([\w ]*?)}/
   ,   optionalFieldList =           /(?:{([\w ]*?)})?/
    

       //   foo or *                  
   ,   jsonPathNamedNodeInObjectNotation   = jsonPathClause( 
                                                possiblyCapturing, 
                                                namedNode, 
                                                optionalFieldList
                                             )
                                             
       //   ["foo"]   
   ,   jsonPathNamedNodeInArrayNotation    = jsonPathClause( 
                                                possiblyCapturing, 
                                                nodeInArrayNotation, 
                                                optionalFieldList
                                             )  

       //   [2] or [*]       
   ,   jsonPathNumberedNodeInArrayNotation = jsonPathClause( 
                                                possiblyCapturing, 
                                                numberedNodeInArrayNotation, 
                                                optionalFieldList
                                             )

       //   {a b c}      
   ,   jsonPathPureDuckTyping              = jsonPathClause( 
                                                possiblyCapturing, 
                                                namePlaceholder, 
                                                fieldList
                                             )
   
       //   ..
   ,   jsonPathDoubleDot                   = jsonPathClause(/\.\./)                  
   
       //   .
   ,   jsonPathDot                         = jsonPathClause(/\./)                    
   
       //   !
   ,   jsonPathBang                        = jsonPathClause(
                                                possiblyCapturing, 
                                                /!/
                                             )  
   
       //   nada!
   ,   emptyString                         = jsonPathClause(/$/)                     
   
   ;
   
  
   /* We export only a single function. When called, this function injects 
      into another function the descriptors from above.             
    */
   return function (fn){      
      return fn(      
         lazyUnion(
            jsonPathNamedNodeInObjectNotation
         ,  jsonPathNamedNodeInArrayNotation
         ,  jsonPathNumberedNodeInArrayNotation
         ,  jsonPathPureDuckTyping 
         )
      ,  jsonPathDoubleDot
      ,  jsonPathDot
      ,  jsonPathBang
      ,  emptyString 
      );
   }; 

}());
/**
 * Get a new key->node mapping
 * 
 * @param {String|Number} key
 * @param {Object|Array|String|Number|null} node a value found in the json
 */
function namedNode(key, node) {
   return {key:key, node:node};
}

/** get the key of a namedNode */
var keyOf = attr('key');

/** get the node from a namedNode */
var nodeOf = attr('node');
/** 
 * This file provides various listeners which can be used to build up
 * a changing ascent based on the callbacks provided by Clarinet. It listens
 * to the low-level events from Clarinet and emits higher-level ones.
 *  
 * The building up is stateless so to track a JSON file
 * ascentManager.js is required to store the ascent state
 * between calls.
 */



/** 
 * A special value to use in the path list to represent the path 'to' a root 
 * object (which doesn't really have any path). This prevents the need for 
 * special-casing detection of the root object and allows it to be treated 
 * like any other object. We might think of this as being similar to the 
 * 'unnamed root' domain ".", eg if I go to 
 * http://en.wikipedia.org./wiki/En/Main_page the dot after 'org' deliminates 
 * the unnamed root of the DNS.
 * 
 * This is kept as an object to take advantage that in Javascript's OO objects 
 * are guaranteed to be distinct, therefore no other object can possibly clash 
 * with this one. Strings, numbers etc provide no such guarantee. 
 **/
var ROOT_PATH = {};


/**
 * Create a new set of handlers for clarinet's events, bound to the emit 
 * function given.  
 */ 
function incrementalContentBuilder( oboeBus ) {

   var emitNodeOpened = oboeBus(NODE_OPENED).emit,
       emitNodeClosed = oboeBus(NODE_CLOSED).emit,
       emitRootOpened = oboeBus(ROOT_PATH_FOUND).emit,
       emitRootClosed = oboeBus(ROOT_NODE_FOUND).emit;

   function arrayIndicesAreKeys( possiblyInconsistentAscent, newDeepestNode) {
   
      /* for values in arrays we aren't pre-warned of the coming paths 
         (Clarinet gives no call to onkey like it does for values in objects) 
         so if we are in an array we need to create this path ourselves. The 
         key will be len(parentNode) because array keys are always sequential 
         numbers. */

      var parentNode = nodeOf( head( possiblyInconsistentAscent));
      
      return      isOfType( Array, parentNode)
               ?
                  keyFound(  possiblyInconsistentAscent, 
                              len(parentNode), 
                              newDeepestNode
                  )
               :  
                  // nothing needed, return unchanged
                  possiblyInconsistentAscent 
               ;
   }
                 
   function nodeOpened( ascent, newDeepestNode ) {
      
      if( !ascent ) {
         // we discovered the root node,         
         emitRootOpened( newDeepestNode);
                    
         return keyFound( ascent, ROOT_PATH, newDeepestNode);         
      }

      // we discovered a non-root node
                 
      var arrayConsistentAscent  = arrayIndicesAreKeys( ascent, newDeepestNode),      
          ancestorBranches       = tail( arrayConsistentAscent),
          previouslyUnmappedName = keyOf( head( arrayConsistentAscent));
          
      appendBuiltContent( 
         ancestorBranches, 
         previouslyUnmappedName, 
         newDeepestNode 
      );
                                                                                                         
      return cons( 
               namedNode( previouslyUnmappedName, newDeepestNode ), 
               ancestorBranches
      );                                                                          
   }


   /**
    * Add a new value to the object we are building up to represent the
    * parsed JSON
    */
   function appendBuiltContent( ancestorBranches, key, node ){
     
      nodeOf( head( ancestorBranches))[key] = node;
   }

     
   /**
    * For when we find a new key in the json.
    * 
    * @param {String|Number|Object} newDeepestName the key. If we are in an 
    *    array will be a number, otherwise a string. May take the special 
    *    value ROOT_PATH if the root node has just been found
    *    
    * @param {String|Number|Object|Array|Null|undefined} [maybeNewDeepestNode] 
    *    usually this won't be known so can be undefined. Can't use null 
    *    to represent unknown because null is a valid value in JSON
    **/  
   function keyFound(ascent, newDeepestName, maybeNewDeepestNode) {

      if( ascent ) { // if not root
      
         // If we have the key but (unless adding to an array) no known value
         // yet. Put that key in the output but against no defined value:      
         appendBuiltContent( ascent, newDeepestName, maybeNewDeepestNode );
      }
   
      var ascentWithNewPath = cons( 
                                 namedNode( newDeepestName, 
                                            maybeNewDeepestNode), 
                                 ascent
                              );

      emitNodeOpened( ascentWithNewPath);
 
      return ascentWithNewPath;
   }


   /**
    * For when the current node ends.
    */
   function nodeClosed( ascent ) {

      emitNodeClosed( ascent);
       
      return tail( ascent) ||
             // If there are no nodes left in the ascent the root node
             // just closed. Emit a special event for this: 
             emitRootClosed(nodeOf(head(ascent)));
   }      

   var contentBuilderHandlers = {};
   contentBuilderHandlers[SAX_VALUE_OPEN] = nodeOpened;
   contentBuilderHandlers[SAX_VALUE_CLOSE] = nodeClosed;
   contentBuilderHandlers[SAX_KEY] = keyFound;
   return contentBuilderHandlers;
}

/**
 * The jsonPath evaluator compiler used for Oboe.js. 
 * 
 * One function is exposed. This function takes a String JSONPath spec and 
 * returns a function to test candidate ascents for matches.
 * 
 *  String jsonPath -> (List ascent) -> Boolean|Object
 *
 * This file is coded in a pure functional style. That is, no function has 
 * side effects, every function evaluates to the same value for the same 
 * arguments and no variables are reassigned.
 */  
// the call to jsonPathSyntax injects the token syntaxes that are needed 
// inside the compiler
var jsonPathCompiler = jsonPathSyntax(function (pathNodeSyntax, 
                                                doubleDotSyntax, 
                                                dotSyntax,
                                                bangSyntax,
                                                emptySyntax ) {

   var CAPTURING_INDEX = 1;
   var NAME_INDEX = 2;
   var FIELD_LIST_INDEX = 3;

   var headKey  = compose2(keyOf, head),
       headNode = compose2(nodeOf, head);
                   
   /**
    * Create an evaluator function for a named path node, expressed in the
    * JSONPath like:
    *    foo
    *    ["bar"]
    *    [2]   
    */
   function nameClause(previousExpr, detection ) {
     
      var name = detection[NAME_INDEX],
            
          matchesName = ( !name || name == '*' ) 
                           ?  always
                           :  function(ascent){return headKey(ascent) == name};
     

      return lazyIntersection(matchesName, previousExpr);
   }

   /**
    * Create an evaluator function for a a duck-typed node, expressed like:
    * 
    *    {spin, taste, colour}
    *    .particle{spin, taste, colour}
    *    *{spin, taste, colour}
    */
   function duckTypeClause(previousExpr, detection) {

      var fieldListStr = detection[FIELD_LIST_INDEX];

      if (!fieldListStr) 
         return previousExpr; // don't wrap at all, return given expr as-is      

      var hasAllrequiredFields = partialComplete(
                                    hasAllProperties, 
                                    arrayAsList(fieldListStr.split(/\W+/))
                                 ),
                                 
          isMatch =  compose2( 
                        hasAllrequiredFields, 
                        headNode
                     );

      return lazyIntersection(isMatch, previousExpr);
   }

   /**
    * Expression for $, returns the evaluator function
    */
   function capture( previousExpr, detection ) {

      // extract meaning from the detection      
      var capturing = !!detection[CAPTURING_INDEX];

      if (!capturing)          
         return previousExpr; // don't wrap at all, return given expr as-is      
      
      return lazyIntersection(previousExpr, head);
            
   }            
      
   /**
    * Create an evaluator function that moves onto the next item on the 
    * lists. This function is the place where the logic to move up a 
    * level in the ascent exists. 
    * 
    * Eg, for JSONPath ".foo" we need skip1(nameClause(always, [,'foo']))
    */
   function skip1(previousExpr) {
   
   
      if( previousExpr == always ) {
         /* If there is no previous expression this consume command 
            is at the start of the jsonPath.
            Since JSONPath specifies what we'd like to find but not 
            necessarily everything leading down to it, when running
            out of JSONPath to check against we default to true */
         return always;
      }

      /** return true if the ascent we have contains only the JSON root,
       *  false otherwise
       */
      function notAtRoot(ascent){
         return headKey(ascent) != ROOT_PATH;
      }
      
      return lazyIntersection(
               /* If we're already at the root but there are more 
                  expressions to satisfy, can't consume any more. No match.

                  This check is why none of the other exprs have to be able 
                  to handle empty lists; skip1 is the only evaluator that 
                  moves onto the next token and it refuses to do so once it 
                  reaches the last item in the list. */
               notAtRoot,
               
               /* We are not at the root of the ascent yet.
                  Move to the next level of the ascent by handing only 
                  the tail to the previous expression */ 
               compose2(previousExpr, tail) 
      );
                                                                                                               
   }   
   
   /**
    * Create an evaluator function for the .. (double dot) token. Consumes
    * zero or more levels of the ascent, the fewest that are required to find
    * a match when given to previousExpr.
    */   
   function skipMany(previousExpr) {

      if( previousExpr == always ) {
         /* If there is no previous expression this consume command 
            is at the start of the jsonPath.
            Since JSONPath specifies what we'd like to find but not 
            necessarily everything leading down to it, when running
            out of JSONPath to check against we default to true */            
         return always;
      }
          
      var 
          // In JSONPath .. is equivalent to !.. so if .. reaches the root
          // the match has succeeded. Ie, we might write ..foo or !..foo
          // and both should match identically.
          terminalCaseWhenArrivingAtRoot = rootExpr(),
          terminalCaseWhenPreviousExpressionIsSatisfied = previousExpr,
          recursiveCase = skip1(function(ascent) {
             return cases(ascent);
          }),

          cases = lazyUnion(
                     terminalCaseWhenArrivingAtRoot
                  ,  terminalCaseWhenPreviousExpressionIsSatisfied
                  ,  recursiveCase  
                  );
      
      return cases;
   }      
   
   /**
    * Generate an evaluator for ! - matches only the root element of the json
    * and ignores any previous expressions since nothing may precede !. 
    */   
   function rootExpr() {
      
      return function(ascent){
         return headKey(ascent) == ROOT_PATH;
      };
   }   
         
   /**
    * Generate a statement wrapper to sit around the outermost 
    * clause evaluator.
    * 
    * Handles the case where the capturing is implicit because the JSONPath
    * did not contain a '$' by returning the last node.
    */   
   function statementExpr(lastClause) {
      
      return function(ascent) {
   
         // kick off the evaluation by passing through to the last clause
         var exprMatch = lastClause(ascent);
                                                     
         return exprMatch === true ? head(ascent) : exprMatch;
      };
   }      
                          
   /**
    * For when a token has been found in the JSONPath input.
    * Compiles the parser for that token and returns in combination with the
    * parser already generated.
    * 
    * @param {Function} exprs  a list of the clause evaluator generators for
    *                          the token that was found
    * @param {Function} parserGeneratedSoFar the parser already found
    * @param {Array} detection the match given by the regex engine when 
    *                          the feature was found
    */
   function expressionsReader( exprs, parserGeneratedSoFar, detection ) {
                     
      // if exprs is zero-length foldR will pass back the 
      // parserGeneratedSoFar as-is so we don't need to treat 
      // this as a special case
      
      return   foldR( 
                  function( parserGeneratedSoFar, expr ){
         
                     return expr(parserGeneratedSoFar, detection);
                  }, 
                  parserGeneratedSoFar, 
                  exprs
               );                     

   }

   /** 
    *  If jsonPath matches the given detector function, creates a function which
    *  evaluates against every clause in the clauseEvaluatorGenerators. The
    *  created function is propagated to the onSuccess function, along with
    *  the remaining unparsed JSONPath substring.
    *  
    *  The intended use is to create a clauseMatcher by filling in
    *  the first two arguments, thus providing a function that knows
    *  some syntax to match and what kind of generator to create if it
    *  finds it. The parameter list once completed is:
    *  
    *    (jsonPath, parserGeneratedSoFar, onSuccess)
    *  
    *  onSuccess may be compileJsonPathToFunction, to recursively continue 
    *  parsing after finding a match or returnFoundParser to stop here.
    */
   function generateClauseReaderIfTokenFound (
     
                        tokenDetector, clauseEvaluatorGenerators,
                         
                        jsonPath, parserGeneratedSoFar, onSuccess) {
                        
      var detected = tokenDetector(jsonPath);

      if(detected) {
         var compiledParser = expressionsReader(
                                 clauseEvaluatorGenerators, 
                                 parserGeneratedSoFar, 
                                 detected
                              ),
         
             remainingUnparsedJsonPath = jsonPath.substr(len(detected[0]));                
                               
         return onSuccess(remainingUnparsedJsonPath, compiledParser);
      }         
   }
                 
   /**
    * Partially completes generateClauseReaderIfTokenFound above. 
    */
   function clauseMatcher(tokenDetector, exprs) {
        
      return   partialComplete( 
                  generateClauseReaderIfTokenFound, 
                  tokenDetector, 
                  exprs 
               );
   }

   /**
    * clauseForJsonPath is a function which attempts to match against 
    * several clause matchers in order until one matches. If non match the
    * jsonPath expression is invalid and an error is thrown.
    * 
    * The parameter list is the same as a single clauseMatcher:
    * 
    *    (jsonPath, parserGeneratedSoFar, onSuccess)
    */     
   var clauseForJsonPath = lazyUnion(

      clauseMatcher(pathNodeSyntax   , list( capture, 
                                             duckTypeClause, 
                                             nameClause, 
                                             skip1 ))
                                                     
   ,  clauseMatcher(doubleDotSyntax  , list( skipMany))
       
       // dot is a separator only (like whitespace in other languages) but 
       // rather than make it a special case, use an empty list of 
       // expressions when this token is found
   ,  clauseMatcher(dotSyntax        , list() )  
                                                                                      
   ,  clauseMatcher(bangSyntax       , list( capture,
                                             rootExpr))
                                                          
   ,  clauseMatcher(emptySyntax      , list( statementExpr))
   
   ,  function (jsonPath) {
         throw Error('"' + jsonPath + '" could not be tokenised')      
      }
   );


   /**
    * One of two possible values for the onSuccess argument of 
    * generateClauseReaderIfTokenFound.
    * 
    * When this function is used, generateClauseReaderIfTokenFound simply 
    * returns the compiledParser that it made, regardless of if there is 
    * any remaining jsonPath to be compiled.
    */
   function returnFoundParser(_remainingJsonPath, compiledParser){ 
      return compiledParser 
   }     
              
   /**
    * Recursively compile a JSONPath expression.
    * 
    * This function serves as one of two possible values for the onSuccess 
    * argument of generateClauseReaderIfTokenFound, meaning continue to
    * recursively compile. Otherwise, returnFoundParser is given and
    * compilation terminates.
    */
   function compileJsonPathToFunction( uncompiledJsonPath, 
                                       parserGeneratedSoFar ) {

      /**
       * On finding a match, if there is remaining text to be compiled
       * we want to either continue parsing using a recursive call to 
       * compileJsonPathToFunction. Otherwise, we want to stop and return 
       * the parser that we have found so far.
       */
      var onFind =      uncompiledJsonPath
                     ?  compileJsonPathToFunction 
                     :  returnFoundParser;
                   
      return   clauseForJsonPath( 
                  uncompiledJsonPath, 
                  parserGeneratedSoFar, 
                  onFind
               );                              
   }

   /**
    * This is the function that we expose to the rest of the library.
    */
   return function(jsonPath){
        
      try {
         // Kick off the recursive parsing of the jsonPath 
         return compileJsonPathToFunction(jsonPath, always);
         
      } catch( e ) {
         throw Error( 'Could not compile "' + jsonPath + 
                      '" because ' + e.message
         );
      }
   }

});

/**
 * A pub/sub which is responsible for a single event type. A
 * multi-event type event bus is created by pubSub by collecting
 * several of these.
 *
 * @param {String} eventType
 *    the name of the events managed by this singleEventPubSub
 * @param {singleEventPubSub} [newListener]
 *    place to notify of new listeners
 * @param {singleEventPubSub} [removeListener]
 *    place to notify of when listeners are removed
 */
function singleEventPubSub(eventType, newListener, removeListener){

  /** we are optimised for emitting events over firing them.
   *  As well as the tuple list which stores event ids and
   *  listeners there is a list with just the listeners which
   *  can be iterated more quickly when we are emitting
   */
  var listenerTupleList,
      listenerList;

  function hasId(id){
    return function(tuple) {
      return tuple.id == id;
    };
  }

  return {

    /**
     * @param {Function} listener
     * @param {*} listenerId
     *    an id that this listener can later by removed by.
     *    Can be of any type, to be compared to other ids using ==
     */
    on:function( listener, listenerId ) {

      var tuple = {
        listener: listener
        ,  id:       listenerId || listener // when no id is given use the
        // listener function as the id
      };

      if( newListener ) {
        newListener.emit(eventType, listener, tuple.id);
      }

      listenerTupleList = cons( tuple,    listenerTupleList );
      listenerList      = cons( listener, listenerList      );

      return this; // chaining
    },

    emit:function () {
      applyEach( listenerList, arguments );
    },

    un: function( listenerId ) {

      var removed;

      listenerTupleList = without(
        listenerTupleList,
        hasId(listenerId),
        function(tuple){
          removed = tuple;
        }
      );

      if( removed ) {
        listenerList = without( listenerList, function(listener){
          return listener == removed.listener;
        });

        if( removeListener ) {
          removeListener.emit(eventType, removed.listener, removed.id);
        }
      }
    },

    listeners: function(){
      // differs from Node EventEmitter: returns list, not array
      return listenerList;
    },

    hasListener: function(listenerId){
      var test = listenerId? hasId(listenerId) : always;

      return defined(first( test, listenerTupleList));
    }
  };
}

/**
 * pubSub is a curried interface for listening to and emitting
 * events.
 *
 * If we get a bus:
 *
 *    var bus = pubSub();
 *
 * We can listen to event 'foo' like:
 *
 *    bus('foo').on(myCallback)
 *
 * And emit event foo like:
 *
 *    bus('foo').emit()
 *
 * or, with a parameter:
 *
 *    bus('foo').emit('bar')
 *
 * All functions can be cached and don't need to be
 * bound. Ie:
 *
 *    var fooEmitter = bus('foo').emit
 *    fooEmitter('bar');  // emit an event
 *    fooEmitter('baz');  // emit another
 *
 * There's also an uncurried[1] shortcut for .emit and .on:
 *
 *    bus.on('foo', callback)
 *    bus.emit('foo', 'bar')
 *
 * [1]: http://zvon.org/other/haskell/Outputprelude/uncurry_f.html
 */
function pubSub(){

   var singles = {},
       newListener = newSingle('newListener'),
       removeListener = newSingle('removeListener');

   function newSingle(eventName) {
      return singles[eventName] = singleEventPubSub(
         eventName,
         newListener,
         removeListener
      );
   }

   /** pubSub instances are functions */
   function pubSubInstance( eventName ){

      return singles[eventName] || newSingle( eventName );
   }

   // add convenience EventEmitter-style uncurried form of 'emit' and 'on'
   ['emit', 'on', 'un'].forEach(function(methodName){

      pubSubInstance[methodName] = varArgs(function(eventName, parameters){
         apply( parameters, pubSubInstance( eventName )[methodName]);
      });
   });

   return pubSubInstance;
}

/**
 * This file declares some constants to use as names for event types.
 */

var // the events which are never exported are kept as 
    // the smallest possible representation, in numbers:
    _S = 1,

    // fired whenever a new node starts in the JSON stream:
    NODE_OPENED     = _S++,

    // fired whenever a node closes in the JSON stream:
    NODE_CLOSED     = _S++,

    // called if a .node callback returns a value - 
    NODE_SWAP       = _S++,
    NODE_DROP       = _S++,

    FAIL_EVENT      = 'fail',
   
    ROOT_NODE_FOUND = _S++,
    ROOT_PATH_FOUND = _S++,
   
    HTTP_START      = 'start',
    STREAM_DATA     = 'data',
    STREAM_END      = 'end',
    ABORTING        = _S++,

    // SAX events butchered from Clarinet
    SAX_KEY          = _S++,
    SAX_VALUE_OPEN   = _S++,
    SAX_VALUE_CLOSE  = _S++;
    
function errorReport(statusCode, body, error) {
   try{
      var jsonBody = JSON.parse(body);
   }catch(e){}

   return {
      statusCode:statusCode,
      body:body,
      jsonBody:jsonBody,
      thrown:error
   };
}    

/** 
 *  The pattern adaptor listens for newListener and removeListener
 *  events. When patterns are added or removed it compiles the JSONPath
 *  and wires them up.
 *  
 *  When nodes and paths are found it emits the fully-qualified match 
 *  events with parameters ready to ship to the outside world
 */

function patternAdapter(oboeBus, jsonPathCompiler) {

   var predicateEventMap = {
      node:oboeBus(NODE_CLOSED)
   ,  path:oboeBus(NODE_OPENED)
   };
     
   function emitMatchingNode(emitMatch, node, ascent) {
         
      /* 
         We're now calling to the outside world where Lisp-style 
         lists will not be familiar. Convert to standard arrays. 
   
         Also, reverse the order because it is more common to 
         list paths "root to leaf" than "leaf to root"  */
      var descent     = reverseList(ascent);
                
      emitMatch(
         node,
         
         // To make a path, strip off the last item which is the special
         // ROOT_PATH token for the 'path' to the root node          
         listAsArray(tail(map(keyOf,descent))),  // path
         listAsArray(map(nodeOf, descent))       // ancestors    
      );         
   }

   /* 
    * Set up the catching of events such as NODE_CLOSED and NODE_OPENED and, if 
    * matching the specified pattern, propagate to pattern-match events such as 
    * oboeBus('node:!')
    * 
    * 
    * 
    * @param {Function} predicateEvent 
    *          either oboeBus(NODE_CLOSED) or oboeBus(NODE_OPENED).
    * @param {Function} compiledJsonPath          
    */
   function addUnderlyingListener( fullEventName, predicateEvent, compiledJsonPath ){
   
      var emitMatch = oboeBus(fullEventName).emit;
   
      predicateEvent.on( function (ascent) {

         var maybeMatchingMapping = compiledJsonPath(ascent);

         /* Possible values for maybeMatchingMapping are now:

          false: 
          we did not match 

          an object/array/string/number/null: 
          we matched and have the node that matched.
          Because nulls are valid json values this can be null.

          undefined:
          we matched but don't have the matching node yet.
          ie, we know there is an upcoming node that matches but we 
          can't say anything else about it. 
          */
         if (maybeMatchingMapping !== false) {

            emitMatchingNode(
               emitMatch, 
               nodeOf(maybeMatchingMapping), 
               ascent
            );
         }
      }, fullEventName);
     
      oboeBus('removeListener').on( function(removedEventName){

         // if the fully qualified match event listener is later removed, clean up 
         // by removing the underlying listener if it was the last using that pattern:
      
         if( removedEventName == fullEventName ) {
         
            if( !oboeBus(removedEventName).listeners(  )) {
               predicateEvent.un( fullEventName );
            }
         }
      });   
   }

   oboeBus('newListener').on( function(fullEventName){

      var match = /(node|path):(.*)/.exec(fullEventName);
      
      if( match ) {
         var predicateEvent = predicateEventMap[match[1]];
                    
         if( !predicateEvent.hasListener( fullEventName) ) {  
                  
            addUnderlyingListener(
               fullEventName,
               predicateEvent, 
               jsonPathCompiler( match[2] )
            );
         }
      }    
   })

}

/**
 * The instance API is the thing that is returned when oboe() is called.
 * it allows:
 *
 *    - listeners for various events to be added and removed
 *    - the http response header/headers to be read
 */
function instanceApi(oboeBus, contentSource){

  var oboeApi,
      fullyQualifiedNamePattern = /^(node|path):./,
      rootNodeFinishedEvent = oboeBus(ROOT_NODE_FOUND),
      emitNodeDrop = oboeBus(NODE_DROP).emit,
      emitNodeSwap = oboeBus(NODE_SWAP).emit,

      /**
       * Add any kind of listener that the instance api exposes
       */
      addListener = varArgs(function( eventId, parameters ){

        if( oboeApi[eventId] ) {

          // for events added as .on(event, callback), if there is a
          // .event() equivalent with special behaviour , pass through
          // to that:
          apply(parameters, oboeApi[eventId]);
        } else {

          // we have a standard Node.js EventEmitter 2-argument call.
          // The first parameter is the listener.
          var event = oboeBus(eventId),
              listener = parameters[0];

          if( fullyQualifiedNamePattern.test(eventId) ) {

            // allow fully-qualified node/path listeners
            // to be added
            addForgettableCallback(event, listener);
          } else  {

            // the event has no special handling, pass through
            // directly onto the event bus:
            event.on( listener);
          }
        }

        return oboeApi; // chaining
      }),

      /**
       * Remove any kind of listener that the instance api exposes
       */
      removeListener = function( eventId, p2, p3 ){

        if( eventId == 'done' ) {

          rootNodeFinishedEvent.un(p2);

        } else if( eventId == 'node' || eventId == 'path' ) {

          // allow removal of node and path
          oboeBus.un(eventId + ':' + p2, p3);
        } else {

          // we have a standard Node.js EventEmitter 2-argument call.
          // The second parameter is the listener. This may be a call
          // to remove a fully-qualified node/path listener but requires
          // no special handling
          var listener = p2;

          oboeBus(eventId).un(listener);
        }

        return oboeApi; // chaining
      };

  /**
   * Add a callback, wrapped in a try/catch so as to not break the
   * execution of Oboe if an exception is thrown (fail events are
   * fired instead)
   *
   * The callback is used as the listener id so that it can later be
   * removed using .un(callback)
   */
  function addProtectedCallback(eventName, callback) {
    oboeBus(eventName).on(protectedCallback(callback), callback);
    return oboeApi; // chaining
  }

  /**
   * Add a callback where, if .forget() is called during the callback's
   * execution, the callback will be de-registered
   */
  function addForgettableCallback(event, callback, listenerId) {

    // listenerId is optional and if not given, the original
    // callback will be used
    listenerId = listenerId || callback;

    var safeCallback = protectedCallback(callback);

    event.on( function() {

      var discard = false;

      oboeApi.forget = function(){
        discard = true;
      };

      apply( arguments, safeCallback );

      delete oboeApi.forget;

      if( discard ) {
        event.un(listenerId);
      }
    }, listenerId);

    return oboeApi; // chaining
  }

  /**
   *  wrap a callback so that if it throws, Oboe.js doesn't crash but instead
   *  throw the error in another event loop
   */
  function protectedCallback( callback ) {
    return function() {
      try{
        return callback.apply(oboeApi, arguments);
      }catch(e)  {
        setTimeout(function() {
          throw new Error(e.message);
        });
      }
    }
  }

  /**
   * Return the fully qualified event for when a pattern matches
   * either a node or a path
   *
   * @param type {String} either 'node' or 'path'
   */
  function fullyQualifiedPatternMatchEvent(type, pattern) {
    return oboeBus(type + ':' + pattern);
  }

  function wrapCallbackToSwapNodeIfSomethingReturned( callback ) {
    return function() {
      var returnValueFromCallback = callback.apply(this, arguments);

      if( defined(returnValueFromCallback) ) {

        if( returnValueFromCallback == oboe.drop ) {
          emitNodeDrop();
        } else {
          emitNodeSwap(returnValueFromCallback);
        }
      }
    }
  }

  function addSingleNodeOrPathListener(eventId, pattern, callback) {

    var effectiveCallback;

    if( eventId == 'node' ) {
      effectiveCallback = wrapCallbackToSwapNodeIfSomethingReturned(callback);
    } else {
      effectiveCallback = callback;
    }

    addForgettableCallback(
      fullyQualifiedPatternMatchEvent(eventId, pattern),
      effectiveCallback,
      callback
    );
  }

  /**
   * Add several listeners at a time, from a map
   */
  function addMultipleNodeOrPathListeners(eventId, listenerMap) {

    for( var pattern in listenerMap ) {
      addSingleNodeOrPathListener(eventId, pattern, listenerMap[pattern]);
    }
  }

  /**
   * implementation behind .onPath() and .onNode()
   */
  function addNodeOrPathListenerApi( eventId, jsonPathOrListenerMap, callback ){

    if( isString(jsonPathOrListenerMap) ) {
      addSingleNodeOrPathListener(eventId, jsonPathOrListenerMap, callback);

    } else {
      addMultipleNodeOrPathListeners(eventId, jsonPathOrListenerMap);
    }

    return oboeApi; // chaining
  }


  // some interface methods are only filled in after we receive
  // values and are noops before that:
  oboeBus(ROOT_PATH_FOUND).on( function(rootNode) {
    oboeApi.root = functor(rootNode);
  });

  /**
   * When content starts make the headers readable through the
   * instance API
   */
  oboeBus(HTTP_START).on( function(_statusCode, headers) {

    oboeApi.header =  function(name) {
      return name ? headers[name]
        : headers
      ;
    }
  });

  /**
   * Construct and return the public API of the Oboe instance to be
   * returned to the calling application
   */
  return oboeApi = {
    on             : addListener,
    addListener    : addListener,
    removeListener : removeListener,
    emit           : oboeBus.emit,

    node           : partialComplete(addNodeOrPathListenerApi, 'node'),
    path           : partialComplete(addNodeOrPathListenerApi, 'path'),

    done           : partialComplete(addForgettableCallback, rootNodeFinishedEvent),
    start          : partialComplete(addProtectedCallback, HTTP_START ),

    // fail doesn't use protectedCallback because
    // could lead to non-terminating loops
    fail           : oboeBus(FAIL_EVENT).on,

    // public api calling abort fires the ABORTING event
    abort          : oboeBus(ABORTING).emit,

    // initially return nothing for header and root
    header         : noop,
    root           : noop,

    source         : contentSource
  };
}

/**
 * This file sits just behind the API which is used to attain a new
 * Oboe instance. It creates the new components that are required
 * and introduces them to each other.
 */

function wire (httpMethodName, contentSource, body, headers, withCredentials){

   var oboeBus = pubSub();
   
   // Wire the input stream in if we are given a content source.
   // This will usually be the case. If not, the instance created
   // will have to be passed content from an external source.
  
   if( contentSource ) {

      streamingHttp( oboeBus,
                     httpTransport(), 
                     httpMethodName,
                     contentSource,
                     body,
                     headers,
                     withCredentials
      );
   }

   clarinet(oboeBus);

   ascentManager(oboeBus, incrementalContentBuilder(oboeBus));
      
   patternAdapter(oboeBus, jsonPathCompiler);      
      
   return instanceApi(oboeBus, contentSource);
}

function applyDefaults( passthrough, url, httpMethodName, body, headers, withCredentials, cached ){

   headers = headers ?
      // Shallow-clone the headers array. This allows it to be
      // modified without side effects to the caller. We don't
      // want to change objects that the user passes in.
      JSON.parse(JSON.stringify(headers))
      : {};

   if( body ) {
      if( !isString(body) ) {

         // If the body is not a string, stringify it. This allows objects to
         // be given which will be sent as JSON.
         body = JSON.stringify(body);

         // Default Content-Type to JSON unless given otherwise.
         headers['Content-Type'] = headers['Content-Type'] || 'application/json';
      }
      headers['Content-Length'] = headers['Content-Length'] || body.length;
   } else {
      body = null;
   }

   // support cache busting like jQuery.ajax({cache:false})
   function modifiedUrl(baseUrl, cached) {

      if( cached === false ) {

         if( baseUrl.indexOf('?') == -1 ) {
            baseUrl += '?';
         } else {
            baseUrl += '&';
         }

         baseUrl += '_=' + new Date().getTime();
      }
      return baseUrl;
   }

   return passthrough( httpMethodName || 'GET', modifiedUrl(url, cached), body, headers, withCredentials || false );
}

// export public API
function oboe(arg1) {

   // We use duck-typing to detect if the parameter given is a stream, with the
   // below list of parameters.
   // Unpipe and unshift would normally be present on a stream but this breaks
   // compatibility with Request streams.
   // See https://github.com/jimhigson/oboe.js/issues/65
   
   var nodeStreamMethodNames = list('resume', 'pause', 'pipe'),
       isStream = partialComplete(
                     hasAllProperties
                  ,  nodeStreamMethodNames
                  );
   
   if( arg1 ) {
      if (isStream(arg1) || isString(arg1)) {

         //  simple version for GETs. Signature is:
         //    oboe( url )
         //  or, under node:
         //    oboe( readableStream )
         return applyDefaults(
            wire,
            arg1 // url
         );

      } else {

         // method signature is:
         //    oboe({method:m, url:u, body:b, headers:{...}})

         return applyDefaults(
            wire,
            arg1.url,
            arg1.method,
            arg1.body,
            arg1.headers,
            arg1.withCredentials,
            arg1.cached
         );
         
      }
   } else {
      // wire up a no-AJAX, no-stream Oboe. Will have to have content 
      // fed in externally and using .emit.
      return wire();
   }
}

/* oboe.drop is a special value. If a node callback returns this value the
   parsed node is deleted from the JSON
 */
oboe.drop = function() {
   return oboe.drop;
};


   if ( typeof define === "function" && define.amd ) {
      define( "oboe", [], function () { return oboe; } );
   } else if (typeof exports === 'object') {
      module.exports = oboe;
   } else {
      window.oboe = oboe;
   }
})((function(){
   // Access to the window object throws an exception in HTML5 web workers so
   // point it to "self" if it runs in a web worker
      try {
         return window;
      } catch (e) {
         return self;
      }
   }()), Object, Array, Error, JSON);

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chess_js_1 = require("chess.js");
var puzzle_1 = require("./puzzle");
var Analysis = /** @class */ (function () {
    function Analysis(gameAnalysis) {
        this.gameAnalysis = gameAnalysis;
    }
    Analysis.prototype.puzzles = function (player) {
        var _this = this;
        var chess = new chess_js_1.Chess();
        var fens = [];
        this.gameAnalysis.moves.split(' ').forEach(function (x) {
            fens.push(chess.fen());
            chess.move(x);
        });
        var moves = chess.history({ verbose: true });
        moves.forEach(function (move, i) {
            if ((_this.gameAnalysis.analysis[i]) && (_this.gameAnalysis.analysis[i].judgment)) {
                var best = _this.gameAnalysis.analysis[i].best;
                _this.gameAnalysis.analysis[i].move = move;
                _this.gameAnalysis.analysis[i].halfMove = i + 1;
                _this.gameAnalysis.analysis[i].fen = fens[i];
                _this.gameAnalysis.analysis[i].best = { from: best.substring(0, 2), to: best.substring(2, 4) };
                _this.gameAnalysis.analysis[i].speed = _this.gameAnalysis.speed;
                _this.gameAnalysis.analysis[i].id = _this.gameAnalysis.id;
            }
        });
        var whiteUser = this.gameAnalysis.players.white.user;
        var playerColour = (whiteUser && (whiteUser.id == player)) ? 'w' : 'b';
        return this.gameAnalysis.analysis = this.gameAnalysis.analysis
            .filter(function (x, i) { return i > 0 && _this.gameAnalysis.analysis[i - 1].eval < 300 && _this.gameAnalysis.analysis[i - 1].eval > -300; })
            .filter(function (x) { return x.judgment && x.judgment.name == "Blunder"; })
            .filter(function (x) { return x.move.color == playerColour; })
            .map(function (x) { return new puzzle_1.Puzzle(x, _this.gameAnalysis); });
    };
    return Analysis;
}());
exports.Analysis = Analysis;

},{"./puzzle":7,"chess.js":1}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chess_js_1 = require("chess.js");
var util_1 = require("./util");
function colour(x) {
    return function (p) {
        var chess = new chess_js_1.Chess(p.analysis.fen);
        if (x === '')
            return true;
        return util_1.toColor(chess) === x;
    };
}
exports.colour = colour;
function severity(x) {
    return function (p) {
        if (x === '')
            return true;
        return p.analysis.judgment.name === 'Blunder';
    };
}
exports.severity = severity;
function phase(x) {
    return function (p) {
        if (x === '')
            return true;
        if (x == 'Opening') {
            return p.analysis.halfMove < 20;
        }
        if (x === 'Endgame') {
            var fen = p.analysis.fen;
            var pieces = fen.replace(/ .*$/, '').replace(/[0-9 pP-]/g, '');
            return pieces.length <= 7 + 6;
        }
        return !phase('Opening')(p) && !(phase('Endgame')(p));
    };
}
exports.phase = phase;
function timecontrol(x) {
    return function (p) {
        if (x === '')
            return true;
        return p.analysis.speed === x;
    };
}
exports.timecontrol = timecontrol;

},{"./util":8,"chess.js":1}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var oboe = require("oboe");
var LichessApi = /** @class */ (function () {
    function LichessApi(url) {
        this.url = url;
    }
    LichessApi.prototype.games = function (user, items, itemCallback, completeCallback) {
        var all = [];
        var fixedQueryParams = "&perfType=rapid,classical" +
            "&analysed=true&evals=true&moves=true&rated=true";
        oboe({
            method: "GET",
            url: this.url + "/games/export/" + user + "?max=" + items + fixedQueryParams,
            headers: { Accept: "application/x-ndjson" },
        }).node("!", function (data) {
            all.push(data);
            itemCallback(data);
        }).on("end", function (_a) {
            completeCallback();
        }).fail(function (errorReport) {
            console.error(JSON.stringify(errorReport));
        });
    };
    return LichessApi;
}());
exports.LichessApi = LichessApi;

},{"oboe":2}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lichessApi_1 = require("./lichessApi");
exports.LichessApi = lichessApi_1.LichessApi;
var analysis_1 = require("./analysis");
exports.Analysis = analysis_1.Analysis;
var filters_1 = require("./filters");
exports.colour = filters_1.colour;
exports.severity = filters_1.severity;
exports.phase = filters_1.phase;
exports.timecontrol = filters_1.timecontrol;

},{"./analysis":3,"./filters":4,"./lichessApi":5}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chess_js_1 = require("chess.js");
var util_1 = require("./util");
var Puzzle = /** @class */ (function () {
    function Puzzle(analysis, game) {
        this.analysis = analysis;
        this.game = game;
    }
    Puzzle.prototype.render = function () {
        return this.url(this.analysis, this.game);
    };
    Puzzle.prototype.url = function (analysis, game) {
        var chess = new chess_js_1.Chess(analysis.fen);
        var color = util_1.toColor(chess);
        var turnNumber = parseInt(analysis.fen.match(/\d+$/)[0]);
        var variation = analysis.variation.split(" ");
        variation.forEach(function (move) {
            chess.move(move);
        });
        chess.header('White', game.players.white.user.name);
        chess.header('Black', game.players.black.user.name);
        chess.header('WhiteElo', game.players.white.rating.toString());
        chess.header('BlackElo', game.players.black.rating.toString());
        chess.header('Event', "https://lichess.org/" + analysis.id + "/" + color + "#" + (analysis.halfMove - 1));
        var createdDate = new Date(game.createdAt);
        var createdDateString = createdDate.getFullYear() + "." + (createdDate.getMonth() + 1) + "." + createdDate.getDate();
        chess.header('Date', createdDateString);
        var pgn = chess.pgn();
        var firstMove = variation[0];
        var toReplace = turnNumber + ". " + firstMove;
        var blunder = turnNumber + ". " + firstMove + " { blunder: " + (analysis.eval || analysis.mate) + "} (" + turnNumber + ". " + analysis.move.san + ") " + turnNumber + "... ";
        if (color == 'black') {
            console.log("pgn", pgn);
            toReplace = turnNumber + ". ... " + firstMove;
            console.log("toReplace", toReplace);
            blunder = turnNumber + ". ... " + firstMove + " { blunder: " + (analysis.eval || analysis.mate) + "} (" + turnNumber + ". ... " + analysis.move.san + ") ";
            console.log("blunder", blunder);
            pgn = pgn.replace(toReplace, blunder) + ' 1-0';
            console.log("pgn2", pgn);
        }
        else {
            pgn = pgn.replace(toReplace, blunder) + ' 0-1';
        }
        return pgn;
    };
    return Puzzle;
}());
exports.Puzzle = Puzzle;

},{"./util":8,"chess.js":1}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toDests(chess) {
    var dests = {};
    chess.SQUARES.forEach(function (s) {
        var ms = chess.moves({ square: s, verbose: true });
        if (ms.length)
            dests[s] = ms.map(function (m) { return m.to; });
    });
    return dests;
}
exports.toDests = toDests;
function toColor(chess) {
    return (chess.turn() === 'w') ? 'white' : 'black';
}
exports.toColor = toColor;

},{}]},{},[6])(6)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY2hlc3MuanMvY2hlc3MuanMiLCJub2RlX21vZHVsZXMvb2JvZS9kaXN0L29ib2UtYnJvd3Nlci5qcyIsInNyYy9hbmFseXNpcy50cyIsInNyYy9maWx0ZXJzLnRzIiwic3JjL2xpY2hlc3NBcGkudHMiLCJzcmMvbWFpbi50cyIsInNyYy9wdXp6bGUudHMiLCJzcmMvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ptREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNscEZBLHFDQUFpQztBQUNqQyxtQ0FBa0M7QUFFbEM7SUFJRSxrQkFBWSxZQUFZO1FBQ3RCLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO0lBQ25DLENBQUM7SUFFRCwwQkFBTyxHQUFQLFVBQVEsTUFBYztRQUF0QixpQkEwQkM7UUF6QkMsSUFBTSxLQUFLLEdBQUcsSUFBSSxnQkFBSyxFQUFFLENBQUE7UUFDekIsSUFBSSxJQUFJLEdBQVcsRUFBRSxDQUFBO1FBQ3JCLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDO1lBQzNDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUE7WUFDdEIsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNkLENBQUMsQ0FBQyxDQUFBO1FBQ0YsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFBO1FBQzFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUMsQ0FBQztZQUNuQixJQUFJLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUNoRixJQUFNLElBQUksR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ2hELEtBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7Z0JBQ3pDLEtBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLEdBQUMsQ0FBQyxDQUFBO2dCQUM1QyxLQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUMzQyxLQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsRUFBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUE7Z0JBQ3pGLEtBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQTtnQkFDN0QsS0FBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEtBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFBO2FBQ3ZEO1FBQ0gsQ0FBQyxDQUFDLENBQUE7UUFDRixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFBO1FBQ3BELElBQUksWUFBWSxHQUFXLENBQUMsU0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUEsQ0FBQyxDQUFBLEdBQUcsQ0FBQTtRQUM1RSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUTthQUMzRCxNQUFNLENBQUMsVUFBQyxDQUFDLEVBQUMsQ0FBQyxJQUFNLE9BQUEsQ0FBQyxHQUFDLENBQUMsSUFBSSxLQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsSUFBSSxLQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFoRyxDQUFnRyxDQUFDO2FBQ2xILE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksU0FBUyxFQUExQyxDQUEwQyxDQUFDO2FBQ3ZELE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLFlBQVksRUFBNUIsQ0FBNEIsQ0FBQzthQUN6QyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxJQUFJLGVBQU0sQ0FBQyxDQUFDLEVBQUUsS0FBSSxDQUFDLFlBQVksQ0FBQyxFQUFoQyxDQUFnQyxDQUFDLENBQUE7SUFDL0MsQ0FBQztJQUNILGVBQUM7QUFBRCxDQW5DQSxBQW1DQyxJQUFBO0FBbkNZLDRCQUFROzs7OztBQ0hyQixxQ0FBaUM7QUFFakMsK0JBQWdDO0FBRWhDLGdCQUF1QixDQUFRO0lBQzdCLE9BQU8sVUFBQyxDQUFTO1FBQ2YsSUFBTSxLQUFLLEdBQUcsSUFBSSxnQkFBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDdkMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUFFLE9BQU8sSUFBSSxDQUFBO1FBQ3pCLE9BQU8sY0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUM3QixDQUFDLENBQUE7QUFDSCxDQUFDO0FBTkQsd0JBTUM7QUFFRCxrQkFBeUIsQ0FBUTtJQUMvQixPQUFPLFVBQUMsQ0FBUztRQUNmLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFBRSxPQUFPLElBQUksQ0FBQTtRQUN6QixPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUE7SUFDL0MsQ0FBQyxDQUFBO0FBQ0gsQ0FBQztBQUxELDRCQUtDO0FBRUQsZUFBc0IsQ0FBUTtJQUM1QixPQUFPLFVBQUMsQ0FBUztRQUNmLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFBRSxPQUFPLElBQUksQ0FBQTtRQUN6QixJQUFJLENBQUMsSUFBSSxTQUFTLEVBQUU7WUFDbEIsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUE7U0FDaEM7UUFDRCxJQUFJLENBQUMsS0FBSyxTQUFTLEVBQUU7WUFDbkIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUE7WUFDMUIsSUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBQyxFQUFFLENBQUMsQ0FBQTtZQUM5RCxPQUFPLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtTQUM5QjtRQUNELE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3ZELENBQUMsQ0FBQTtBQUNILENBQUM7QUFiRCxzQkFhQztBQUVELHFCQUE0QixDQUFRO0lBQ2xDLE9BQU8sVUFBQyxDQUFTO1FBQ2YsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUFFLE9BQU8sSUFBSSxDQUFBO1FBQ3pCLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFBO0lBQy9CLENBQUMsQ0FBQTtBQUNILENBQUM7QUFMRCxrQ0FLQzs7Ozs7QUN2Q0QsMkJBQTZCO0FBRTdCO0lBSUUsb0JBQVksR0FBRztRQUNiLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFBO0lBQ2hCLENBQUM7SUFFRCwwQkFBSyxHQUFMLFVBQU0sSUFBSSxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsZ0JBQWdCO1FBQ2pELElBQUksR0FBRyxHQUFVLEVBQUUsQ0FBQztRQUNwQixJQUFNLGdCQUFnQixHQUFHLDJCQUEyQjtZQUNyQyxpREFBaUQsQ0FBQTtRQUNoRSxJQUFJLENBQUM7WUFDSixNQUFNLEVBQUUsS0FBSztZQUNiLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLGdCQUFnQixHQUFHLElBQUksR0FBRyxPQUFPLEdBQUcsS0FBSyxHQUFHLGdCQUFnQjtZQUM1RSxPQUFPLEVBQUUsRUFBRSxNQUFNLEVBQUUsc0JBQXNCLEVBQUU7U0FDM0MsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBUyxJQUFJO1lBQ3pCLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDZixZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxVQUFTLEVBQUU7WUFDdkIsZ0JBQWdCLEVBQUUsQ0FBQztRQUNwQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBUyxXQUFXO1lBQzNCLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQzVDLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUNGLGlCQUFDO0FBQUQsQ0F6QkEsQUF5QkMsSUFBQTtBQXpCWSxnQ0FBVTs7Ozs7QUNGdkIsMkNBQXlDO0FBQWhDLGtDQUFBLFVBQVUsQ0FBQTtBQUNuQix1Q0FBcUM7QUFBNUIsOEJBQUEsUUFBUSxDQUFBO0FBQ2pCLHFDQUFpRTtBQUF4RCwyQkFBQSxNQUFNLENBQUE7QUFBRSw2QkFBQSxRQUFRLENBQUE7QUFBRSwwQkFBQSxLQUFLLENBQUE7QUFBRSxnQ0FBQSxXQUFXLENBQUE7Ozs7O0FDRjdDLHFDQUFnQztBQUVoQywrQkFBZ0M7QUFFaEM7SUFJRSxnQkFBWSxRQUFRLEVBQUUsSUFBSTtRQUN4QixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTtRQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtJQUNsQixDQUFDO0lBQ0QsdUJBQU0sR0FBTjtRQUNFLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUMzQyxDQUFDO0lBRUQsb0JBQUcsR0FBSCxVQUFJLFFBQVEsRUFBRSxJQUFJO1FBQ2hCLElBQU0sS0FBSyxHQUFHLElBQUksZ0JBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDckMsSUFBSSxLQUFLLEdBQVUsY0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ2pDLElBQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzFELElBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQzdDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJO1lBQzlCLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDbEIsQ0FBQyxDQUFDLENBQUE7UUFDRixLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDbkQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ25ELEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1FBQzlELEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1FBQzlELEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLHlCQUF1QixRQUFRLENBQUMsRUFBRSxTQUFJLEtBQUssVUFBSSxRQUFRLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBRSxDQUFDLENBQUE7UUFDN0YsSUFBSSxXQUFXLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQzFDLElBQUksaUJBQWlCLEdBQU0sV0FBVyxDQUFDLFdBQVcsRUFBRSxVQUFJLFdBQVcsQ0FBQyxRQUFRLEVBQUUsR0FBQyxDQUFDLFVBQUksV0FBVyxDQUFDLE9BQU8sRUFBSSxDQUFBO1FBQzNHLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLGlCQUFpQixDQUFDLENBQUE7UUFFdkMsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBQ3JCLElBQU0sU0FBUyxHQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUMvQixJQUFJLFNBQVMsR0FBTSxVQUFVLFVBQUssU0FBVyxDQUFBO1FBQzdDLElBQUksT0FBTyxHQUFNLFVBQVUsVUFBSyxTQUFTLHFCQUFlLFFBQVEsQ0FBQyxJQUFJLElBQUksUUFBUSxDQUFDLElBQUksWUFBTyxVQUFVLFVBQUssUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLFVBQUssVUFBVSxTQUFNLENBQUE7UUFFbEosSUFBSSxLQUFLLElBQUksT0FBTyxFQUFFO1lBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQ3RCLFNBQVMsR0FBTSxVQUFVLGNBQVMsU0FBVyxDQUFBO1lBQzdDLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFDLFNBQVMsQ0FBQyxDQUFBO1lBQ2xDLE9BQU8sR0FBTSxVQUFVLGNBQVMsU0FBUyxxQkFBZSxRQUFRLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxJQUFJLFlBQU8sVUFBVSxjQUFTLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFJLENBQUE7WUFDckksT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUMsT0FBTyxDQUFDLENBQUE7WUFDOUIsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxHQUFHLE1BQU0sQ0FBQTtZQUM5QyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBQyxHQUFHLENBQUMsQ0FBQTtTQUN4QjthQUFNO1lBQ0wsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxHQUFHLE1BQU0sQ0FBQTtTQUUvQztRQUdELE9BQU8sR0FBRyxDQUFBO0lBQ1osQ0FBQztJQUVILGFBQUM7QUFBRCxDQW5EQSxBQW1EQyxJQUFBO0FBbkRZLHdCQUFNOzs7OztBQ0huQixpQkFBd0IsS0FBVTtJQUNoQyxJQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7SUFDakIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDO1FBQ3JCLElBQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBQ25ELElBQUksRUFBRSxDQUFDLE1BQU07WUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxFQUFFLEVBQUosQ0FBSSxDQUFDLENBQUM7SUFDOUMsQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFQRCwwQkFPQztBQUVELGlCQUF3QixLQUFVO0lBQ2hDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO0FBQ3BELENBQUM7QUFGRCwwQkFFQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYsIEplZmYgSGx5d2EgKGpobHl3YUBnbWFpbC5jb20pXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxuICogbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG4gKlxuICogMS4gUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLFxuICogICAgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbiAqIDIuIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSxcbiAqICAgIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlIGRvY3VtZW50YXRpb25cbiAqICAgIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuICpcbiAqIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiXG4gKiBBTkQgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFXG4gKiBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRVxuICogQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgT1dORVIgT1IgQ09OVFJJQlVUT1JTIEJFXG4gKiBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SXG4gKiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRlxuICogU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTXG4gKiBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTlxuICogQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlQgKElOQ0xVRElORyBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSlcbiAqIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFXG4gKiBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbiAqXG4gKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vKiBtaW5pZmllZCBsaWNlbnNlIGJlbG93ICAqL1xuXG4vKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IChjKSAyMDE2LCBKZWZmIEhseXdhIChqaGx5d2FAZ21haWwuY29tKVxuICogUmVsZWFzZWQgdW5kZXIgdGhlIEJTRCBsaWNlbnNlXG4gKiBodHRwczovL2dpdGh1Yi5jb20vamhseXdhL2NoZXNzLmpzL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqL1xuXG52YXIgQ2hlc3MgPSBmdW5jdGlvbihmZW4pIHtcblxuICAvKiBqc2hpbnQgaW5kZW50OiBmYWxzZSAqL1xuXG4gIHZhciBCTEFDSyA9ICdiJztcbiAgdmFyIFdISVRFID0gJ3cnO1xuXG4gIHZhciBFTVBUWSA9IC0xO1xuXG4gIHZhciBQQVdOID0gJ3AnO1xuICB2YXIgS05JR0hUID0gJ24nO1xuICB2YXIgQklTSE9QID0gJ2InO1xuICB2YXIgUk9PSyA9ICdyJztcbiAgdmFyIFFVRUVOID0gJ3EnO1xuICB2YXIgS0lORyA9ICdrJztcblxuICB2YXIgU1lNQk9MUyA9ICdwbmJycWtQTkJSUUsnO1xuXG4gIHZhciBERUZBVUxUX1BPU0lUSU9OID0gJ3JuYnFrYm5yL3BwcHBwcHBwLzgvOC84LzgvUFBQUFBQUFAvUk5CUUtCTlIgdyBLUWtxIC0gMCAxJztcblxuICB2YXIgUE9TU0lCTEVfUkVTVUxUUyA9IFsnMS0wJywgJzAtMScsICcxLzItMS8yJywgJyonXTtcblxuICB2YXIgUEFXTl9PRkZTRVRTID0ge1xuICAgIGI6IFsxNiwgMzIsIDE3LCAxNV0sXG4gICAgdzogWy0xNiwgLTMyLCAtMTcsIC0xNV1cbiAgfTtcblxuICB2YXIgUElFQ0VfT0ZGU0VUUyA9IHtcbiAgICBuOiBbLTE4LCAtMzMsIC0zMSwgLTE0LCAgMTgsIDMzLCAzMSwgIDE0XSxcbiAgICBiOiBbLTE3LCAtMTUsICAxNywgIDE1XSxcbiAgICByOiBbLTE2LCAgIDEsICAxNiwgIC0xXSxcbiAgICBxOiBbLTE3LCAtMTYsIC0xNSwgICAxLCAgMTcsIDE2LCAxNSwgIC0xXSxcbiAgICBrOiBbLTE3LCAtMTYsIC0xNSwgICAxLCAgMTcsIDE2LCAxNSwgIC0xXVxuICB9O1xuXG4gIHZhciBBVFRBQ0tTID0gW1xuICAgIDIwLCAwLCAwLCAwLCAwLCAwLCAwLCAyNCwgIDAsIDAsIDAsIDAsIDAsIDAsMjAsIDAsXG4gICAgIDAsMjAsIDAsIDAsIDAsIDAsIDAsIDI0LCAgMCwgMCwgMCwgMCwgMCwyMCwgMCwgMCxcbiAgICAgMCwgMCwyMCwgMCwgMCwgMCwgMCwgMjQsICAwLCAwLCAwLCAwLDIwLCAwLCAwLCAwLFxuICAgICAwLCAwLCAwLDIwLCAwLCAwLCAwLCAyNCwgIDAsIDAsIDAsMjAsIDAsIDAsIDAsIDAsXG4gICAgIDAsIDAsIDAsIDAsMjAsIDAsIDAsIDI0LCAgMCwgMCwyMCwgMCwgMCwgMCwgMCwgMCxcbiAgICAgMCwgMCwgMCwgMCwgMCwyMCwgMiwgMjQsICAyLDIwLCAwLCAwLCAwLCAwLCAwLCAwLFxuICAgICAwLCAwLCAwLCAwLCAwLCAyLDUzLCA1NiwgNTMsIDIsIDAsIDAsIDAsIDAsIDAsIDAsXG4gICAgMjQsMjQsMjQsMjQsMjQsMjQsNTYsICAwLCA1NiwyNCwyNCwyNCwyNCwyNCwyNCwgMCxcbiAgICAgMCwgMCwgMCwgMCwgMCwgMiw1MywgNTYsIDUzLCAyLCAwLCAwLCAwLCAwLCAwLCAwLFxuICAgICAwLCAwLCAwLCAwLCAwLDIwLCAyLCAyNCwgIDIsMjAsIDAsIDAsIDAsIDAsIDAsIDAsXG4gICAgIDAsIDAsIDAsIDAsMjAsIDAsIDAsIDI0LCAgMCwgMCwyMCwgMCwgMCwgMCwgMCwgMCxcbiAgICAgMCwgMCwgMCwyMCwgMCwgMCwgMCwgMjQsICAwLCAwLCAwLDIwLCAwLCAwLCAwLCAwLFxuICAgICAwLCAwLDIwLCAwLCAwLCAwLCAwLCAyNCwgIDAsIDAsIDAsIDAsMjAsIDAsIDAsIDAsXG4gICAgIDAsMjAsIDAsIDAsIDAsIDAsIDAsIDI0LCAgMCwgMCwgMCwgMCwgMCwyMCwgMCwgMCxcbiAgICAyMCwgMCwgMCwgMCwgMCwgMCwgMCwgMjQsICAwLCAwLCAwLCAwLCAwLCAwLDIwXG4gIF07XG5cbiAgdmFyIFJBWVMgPSBbXG4gICAgIDE3LCAgMCwgIDAsICAwLCAgMCwgIDAsICAwLCAxNiwgIDAsICAwLCAgMCwgIDAsICAwLCAgMCwgMTUsIDAsXG4gICAgICAwLCAxNywgIDAsICAwLCAgMCwgIDAsICAwLCAxNiwgIDAsICAwLCAgMCwgIDAsICAwLCAxNSwgIDAsIDAsXG4gICAgICAwLCAgMCwgMTcsICAwLCAgMCwgIDAsICAwLCAxNiwgIDAsICAwLCAgMCwgIDAsIDE1LCAgMCwgIDAsIDAsXG4gICAgICAwLCAgMCwgIDAsIDE3LCAgMCwgIDAsICAwLCAxNiwgIDAsICAwLCAgMCwgMTUsICAwLCAgMCwgIDAsIDAsXG4gICAgICAwLCAgMCwgIDAsICAwLCAxNywgIDAsICAwLCAxNiwgIDAsICAwLCAxNSwgIDAsICAwLCAgMCwgIDAsIDAsXG4gICAgICAwLCAgMCwgIDAsICAwLCAgMCwgMTcsICAwLCAxNiwgIDAsIDE1LCAgMCwgIDAsICAwLCAgMCwgIDAsIDAsXG4gICAgICAwLCAgMCwgIDAsICAwLCAgMCwgIDAsIDE3LCAxNiwgMTUsICAwLCAgMCwgIDAsICAwLCAgMCwgIDAsIDAsXG4gICAgICAxLCAgMSwgIDEsICAxLCAgMSwgIDEsICAxLCAgMCwgLTEsIC0xLCAgLTEsLTEsIC0xLCAtMSwgLTEsIDAsXG4gICAgICAwLCAgMCwgIDAsICAwLCAgMCwgIDAsLTE1LC0xNiwtMTcsICAwLCAgMCwgIDAsICAwLCAgMCwgIDAsIDAsXG4gICAgICAwLCAgMCwgIDAsICAwLCAgMCwtMTUsICAwLC0xNiwgIDAsLTE3LCAgMCwgIDAsICAwLCAgMCwgIDAsIDAsXG4gICAgICAwLCAgMCwgIDAsICAwLC0xNSwgIDAsICAwLC0xNiwgIDAsICAwLC0xNywgIDAsICAwLCAgMCwgIDAsIDAsXG4gICAgICAwLCAgMCwgIDAsLTE1LCAgMCwgIDAsICAwLC0xNiwgIDAsICAwLCAgMCwtMTcsICAwLCAgMCwgIDAsIDAsXG4gICAgICAwLCAgMCwtMTUsICAwLCAgMCwgIDAsICAwLC0xNiwgIDAsICAwLCAgMCwgIDAsLTE3LCAgMCwgIDAsIDAsXG4gICAgICAwLC0xNSwgIDAsICAwLCAgMCwgIDAsICAwLC0xNiwgIDAsICAwLCAgMCwgIDAsICAwLC0xNywgIDAsIDAsXG4gICAgLTE1LCAgMCwgIDAsICAwLCAgMCwgIDAsICAwLC0xNiwgIDAsICAwLCAgMCwgIDAsICAwLCAgMCwtMTdcbiAgXTtcblxuICB2YXIgU0hJRlRTID0geyBwOiAwLCBuOiAxLCBiOiAyLCByOiAzLCBxOiA0LCBrOiA1IH07XG5cbiAgdmFyIEZMQUdTID0ge1xuICAgIE5PUk1BTDogJ24nLFxuICAgIENBUFRVUkU6ICdjJyxcbiAgICBCSUdfUEFXTjogJ2InLFxuICAgIEVQX0NBUFRVUkU6ICdlJyxcbiAgICBQUk9NT1RJT046ICdwJyxcbiAgICBLU0lERV9DQVNUTEU6ICdrJyxcbiAgICBRU0lERV9DQVNUTEU6ICdxJ1xuICB9O1xuXG4gIHZhciBCSVRTID0ge1xuICAgIE5PUk1BTDogMSxcbiAgICBDQVBUVVJFOiAyLFxuICAgIEJJR19QQVdOOiA0LFxuICAgIEVQX0NBUFRVUkU6IDgsXG4gICAgUFJPTU9USU9OOiAxNixcbiAgICBLU0lERV9DQVNUTEU6IDMyLFxuICAgIFFTSURFX0NBU1RMRTogNjRcbiAgfTtcblxuICB2YXIgUkFOS18xID0gNztcbiAgdmFyIFJBTktfMiA9IDY7XG4gIHZhciBSQU5LXzMgPSA1O1xuICB2YXIgUkFOS180ID0gNDtcbiAgdmFyIFJBTktfNSA9IDM7XG4gIHZhciBSQU5LXzYgPSAyO1xuICB2YXIgUkFOS183ID0gMTtcbiAgdmFyIFJBTktfOCA9IDA7XG5cbiAgdmFyIFNRVUFSRVMgPSB7XG4gICAgYTg6ICAgMCwgYjg6ICAgMSwgYzg6ICAgMiwgZDg6ICAgMywgZTg6ICAgNCwgZjg6ICAgNSwgZzg6ICAgNiwgaDg6ICAgNyxcbiAgICBhNzogIDE2LCBiNzogIDE3LCBjNzogIDE4LCBkNzogIDE5LCBlNzogIDIwLCBmNzogIDIxLCBnNzogIDIyLCBoNzogIDIzLFxuICAgIGE2OiAgMzIsIGI2OiAgMzMsIGM2OiAgMzQsIGQ2OiAgMzUsIGU2OiAgMzYsIGY2OiAgMzcsIGc2OiAgMzgsIGg2OiAgMzksXG4gICAgYTU6ICA0OCwgYjU6ICA0OSwgYzU6ICA1MCwgZDU6ICA1MSwgZTU6ICA1MiwgZjU6ICA1MywgZzU6ICA1NCwgaDU6ICA1NSxcbiAgICBhNDogIDY0LCBiNDogIDY1LCBjNDogIDY2LCBkNDogIDY3LCBlNDogIDY4LCBmNDogIDY5LCBnNDogIDcwLCBoNDogIDcxLFxuICAgIGEzOiAgODAsIGIzOiAgODEsIGMzOiAgODIsIGQzOiAgODMsIGUzOiAgODQsIGYzOiAgODUsIGczOiAgODYsIGgzOiAgODcsXG4gICAgYTI6ICA5NiwgYjI6ICA5NywgYzI6ICA5OCwgZDI6ICA5OSwgZTI6IDEwMCwgZjI6IDEwMSwgZzI6IDEwMiwgaDI6IDEwMyxcbiAgICBhMTogMTEyLCBiMTogMTEzLCBjMTogMTE0LCBkMTogMTE1LCBlMTogMTE2LCBmMTogMTE3LCBnMTogMTE4LCBoMTogMTE5XG4gIH07XG5cbiAgdmFyIFJPT0tTID0ge1xuICAgIHc6IFt7c3F1YXJlOiBTUVVBUkVTLmExLCBmbGFnOiBCSVRTLlFTSURFX0NBU1RMRX0sXG4gICAgICAgIHtzcXVhcmU6IFNRVUFSRVMuaDEsIGZsYWc6IEJJVFMuS1NJREVfQ0FTVExFfV0sXG4gICAgYjogW3tzcXVhcmU6IFNRVUFSRVMuYTgsIGZsYWc6IEJJVFMuUVNJREVfQ0FTVExFfSxcbiAgICAgICAge3NxdWFyZTogU1FVQVJFUy5oOCwgZmxhZzogQklUUy5LU0lERV9DQVNUTEV9XVxuICB9O1xuXG4gIHZhciBib2FyZCA9IG5ldyBBcnJheSgxMjgpO1xuICB2YXIga2luZ3MgPSB7dzogRU1QVFksIGI6IEVNUFRZfTtcbiAgdmFyIHR1cm4gPSBXSElURTtcbiAgdmFyIGNhc3RsaW5nID0ge3c6IDAsIGI6IDB9O1xuICB2YXIgZXBfc3F1YXJlID0gRU1QVFk7XG4gIHZhciBoYWxmX21vdmVzID0gMDtcbiAgdmFyIG1vdmVfbnVtYmVyID0gMTtcbiAgdmFyIGhpc3RvcnkgPSBbXTtcbiAgdmFyIGhlYWRlciA9IHt9O1xuXG4gIC8qIGlmIHRoZSB1c2VyIHBhc3NlcyBpbiBhIGZlbiBzdHJpbmcsIGxvYWQgaXQsIGVsc2UgZGVmYXVsdCB0b1xuICAgKiBzdGFydGluZyBwb3NpdGlvblxuICAgKi9cbiAgaWYgKHR5cGVvZiBmZW4gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgbG9hZChERUZBVUxUX1BPU0lUSU9OKTtcbiAgfSBlbHNlIHtcbiAgICBsb2FkKGZlbik7XG4gIH1cblxuICBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICBib2FyZCA9IG5ldyBBcnJheSgxMjgpO1xuICAgIGtpbmdzID0ge3c6IEVNUFRZLCBiOiBFTVBUWX07XG4gICAgdHVybiA9IFdISVRFO1xuICAgIGNhc3RsaW5nID0ge3c6IDAsIGI6IDB9O1xuICAgIGVwX3NxdWFyZSA9IEVNUFRZO1xuICAgIGhhbGZfbW92ZXMgPSAwO1xuICAgIG1vdmVfbnVtYmVyID0gMTtcbiAgICBoaXN0b3J5ID0gW107XG4gICAgaGVhZGVyID0ge307XG4gICAgdXBkYXRlX3NldHVwKGdlbmVyYXRlX2ZlbigpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgIGxvYWQoREVGQVVMVF9QT1NJVElPTik7XG4gIH1cblxuICBmdW5jdGlvbiBsb2FkKGZlbikge1xuICAgIHZhciB0b2tlbnMgPSBmZW4uc3BsaXQoL1xccysvKTtcbiAgICB2YXIgcG9zaXRpb24gPSB0b2tlbnNbMF07XG4gICAgdmFyIHNxdWFyZSA9IDA7XG5cbiAgICBpZiAoIXZhbGlkYXRlX2ZlbihmZW4pLnZhbGlkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY2xlYXIoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcG9zaXRpb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBwaWVjZSA9IHBvc2l0aW9uLmNoYXJBdChpKTtcblxuICAgICAgaWYgKHBpZWNlID09PSAnLycpIHtcbiAgICAgICAgc3F1YXJlICs9IDg7XG4gICAgICB9IGVsc2UgaWYgKGlzX2RpZ2l0KHBpZWNlKSkge1xuICAgICAgICBzcXVhcmUgKz0gcGFyc2VJbnQocGllY2UsIDEwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBjb2xvciA9IChwaWVjZSA8ICdhJykgPyBXSElURSA6IEJMQUNLO1xuICAgICAgICBwdXQoe3R5cGU6IHBpZWNlLnRvTG93ZXJDYXNlKCksIGNvbG9yOiBjb2xvcn0sIGFsZ2VicmFpYyhzcXVhcmUpKTtcbiAgICAgICAgc3F1YXJlKys7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdHVybiA9IHRva2Vuc1sxXTtcblxuICAgIGlmICh0b2tlbnNbMl0uaW5kZXhPZignSycpID4gLTEpIHtcbiAgICAgIGNhc3RsaW5nLncgfD0gQklUUy5LU0lERV9DQVNUTEU7XG4gICAgfVxuICAgIGlmICh0b2tlbnNbMl0uaW5kZXhPZignUScpID4gLTEpIHtcbiAgICAgIGNhc3RsaW5nLncgfD0gQklUUy5RU0lERV9DQVNUTEU7XG4gICAgfVxuICAgIGlmICh0b2tlbnNbMl0uaW5kZXhPZignaycpID4gLTEpIHtcbiAgICAgIGNhc3RsaW5nLmIgfD0gQklUUy5LU0lERV9DQVNUTEU7XG4gICAgfVxuICAgIGlmICh0b2tlbnNbMl0uaW5kZXhPZigncScpID4gLTEpIHtcbiAgICAgIGNhc3RsaW5nLmIgfD0gQklUUy5RU0lERV9DQVNUTEU7XG4gICAgfVxuXG4gICAgZXBfc3F1YXJlID0gKHRva2Vuc1szXSA9PT0gJy0nKSA/IEVNUFRZIDogU1FVQVJFU1t0b2tlbnNbM11dO1xuICAgIGhhbGZfbW92ZXMgPSBwYXJzZUludCh0b2tlbnNbNF0sIDEwKTtcbiAgICBtb3ZlX251bWJlciA9IHBhcnNlSW50KHRva2Vuc1s1XSwgMTApO1xuXG4gICAgdXBkYXRlX3NldHVwKGdlbmVyYXRlX2ZlbigpKTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyogVE9ETzogdGhpcyBmdW5jdGlvbiBpcyBwcmV0dHkgbXVjaCBjcmFwIC0gaXQgdmFsaWRhdGVzIHN0cnVjdHVyZSBidXRcbiAgICogY29tcGxldGVseSBpZ25vcmVzIGNvbnRlbnQgKGUuZy4gZG9lc24ndCB2ZXJpZnkgdGhhdCBlYWNoIHNpZGUgaGFzIGEga2luZylcbiAgICogLi4uIHdlIHNob3VsZCByZXdyaXRlIHRoaXMsIGFuZCBkaXRjaCB0aGUgc2lsbHkgZXJyb3JfbnVtYmVyIGZpZWxkIHdoaWxlXG4gICAqIHdlJ3JlIGF0IGl0XG4gICAqL1xuICBmdW5jdGlvbiB2YWxpZGF0ZV9mZW4oZmVuKSB7XG4gICAgdmFyIGVycm9ycyA9IHtcbiAgICAgICAwOiAnTm8gZXJyb3JzLicsXG4gICAgICAgMTogJ0ZFTiBzdHJpbmcgbXVzdCBjb250YWluIHNpeCBzcGFjZS1kZWxpbWl0ZWQgZmllbGRzLicsXG4gICAgICAgMjogJzZ0aCBmaWVsZCAobW92ZSBudW1iZXIpIG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyLicsXG4gICAgICAgMzogJzV0aCBmaWVsZCAoaGFsZiBtb3ZlIGNvdW50ZXIpIG11c3QgYmUgYSBub24tbmVnYXRpdmUgaW50ZWdlci4nLFxuICAgICAgIDQ6ICc0dGggZmllbGQgKGVuLXBhc3NhbnQgc3F1YXJlKSBpcyBpbnZhbGlkLicsXG4gICAgICAgNTogJzNyZCBmaWVsZCAoY2FzdGxpbmcgYXZhaWxhYmlsaXR5KSBpcyBpbnZhbGlkLicsXG4gICAgICAgNjogJzJuZCBmaWVsZCAoc2lkZSB0byBtb3ZlKSBpcyBpbnZhbGlkLicsXG4gICAgICAgNzogJzFzdCBmaWVsZCAocGllY2UgcG9zaXRpb25zKSBkb2VzIG5vdCBjb250YWluIDggXFwnL1xcJy1kZWxpbWl0ZWQgcm93cy4nLFxuICAgICAgIDg6ICcxc3QgZmllbGQgKHBpZWNlIHBvc2l0aW9ucykgaXMgaW52YWxpZCBbY29uc2VjdXRpdmUgbnVtYmVyc10uJyxcbiAgICAgICA5OiAnMXN0IGZpZWxkIChwaWVjZSBwb3NpdGlvbnMpIGlzIGludmFsaWQgW2ludmFsaWQgcGllY2VdLicsXG4gICAgICAxMDogJzFzdCBmaWVsZCAocGllY2UgcG9zaXRpb25zKSBpcyBpbnZhbGlkIFtyb3cgdG9vIGxhcmdlXS4nLFxuICAgICAgMTE6ICdJbGxlZ2FsIGVuLXBhc3NhbnQgc3F1YXJlJyxcbiAgICB9O1xuXG4gICAgLyogMXN0IGNyaXRlcmlvbjogNiBzcGFjZS1zZXBlcmF0ZWQgZmllbGRzPyAqL1xuICAgIHZhciB0b2tlbnMgPSBmZW4uc3BsaXQoL1xccysvKTtcbiAgICBpZiAodG9rZW5zLmxlbmd0aCAhPT0gNikge1xuICAgICAgcmV0dXJuIHt2YWxpZDogZmFsc2UsIGVycm9yX251bWJlcjogMSwgZXJyb3I6IGVycm9yc1sxXX07XG4gICAgfVxuXG4gICAgLyogMm5kIGNyaXRlcmlvbjogbW92ZSBudW1iZXIgZmllbGQgaXMgYSBpbnRlZ2VyIHZhbHVlID4gMD8gKi9cbiAgICBpZiAoaXNOYU4odG9rZW5zWzVdKSB8fCAocGFyc2VJbnQodG9rZW5zWzVdLCAxMCkgPD0gMCkpIHtcbiAgICAgIHJldHVybiB7dmFsaWQ6IGZhbHNlLCBlcnJvcl9udW1iZXI6IDIsIGVycm9yOiBlcnJvcnNbMl19O1xuICAgIH1cblxuICAgIC8qIDNyZCBjcml0ZXJpb246IGhhbGYgbW92ZSBjb3VudGVyIGlzIGFuIGludGVnZXIgPj0gMD8gKi9cbiAgICBpZiAoaXNOYU4odG9rZW5zWzRdKSB8fCAocGFyc2VJbnQodG9rZW5zWzRdLCAxMCkgPCAwKSkge1xuICAgICAgcmV0dXJuIHt2YWxpZDogZmFsc2UsIGVycm9yX251bWJlcjogMywgZXJyb3I6IGVycm9yc1szXX07XG4gICAgfVxuXG4gICAgLyogNHRoIGNyaXRlcmlvbjogNHRoIGZpZWxkIGlzIGEgdmFsaWQgZS5wLi1zdHJpbmc/ICovXG4gICAgaWYgKCEvXigtfFthYmNkZWZnaF1bMzZdKSQvLnRlc3QodG9rZW5zWzNdKSkge1xuICAgICAgcmV0dXJuIHt2YWxpZDogZmFsc2UsIGVycm9yX251bWJlcjogNCwgZXJyb3I6IGVycm9yc1s0XX07XG4gICAgfVxuXG4gICAgLyogNXRoIGNyaXRlcmlvbjogM3RoIGZpZWxkIGlzIGEgdmFsaWQgY2FzdGxlLXN0cmluZz8gKi9cbiAgICBpZiggIS9eKEtRP2s/cT98UWs/cT98a3E/fHF8LSkkLy50ZXN0KHRva2Vuc1syXSkpIHtcbiAgICAgIHJldHVybiB7dmFsaWQ6IGZhbHNlLCBlcnJvcl9udW1iZXI6IDUsIGVycm9yOiBlcnJvcnNbNV19O1xuICAgIH1cblxuICAgIC8qIDZ0aCBjcml0ZXJpb246IDJuZCBmaWVsZCBpcyBcIndcIiAod2hpdGUpIG9yIFwiYlwiIChibGFjayk/ICovXG4gICAgaWYgKCEvXih3fGIpJC8udGVzdCh0b2tlbnNbMV0pKSB7XG4gICAgICByZXR1cm4ge3ZhbGlkOiBmYWxzZSwgZXJyb3JfbnVtYmVyOiA2LCBlcnJvcjogZXJyb3JzWzZdfTtcbiAgICB9XG5cbiAgICAvKiA3dGggY3JpdGVyaW9uOiAxc3QgZmllbGQgY29udGFpbnMgOCByb3dzPyAqL1xuICAgIHZhciByb3dzID0gdG9rZW5zWzBdLnNwbGl0KCcvJyk7XG4gICAgaWYgKHJvd3MubGVuZ3RoICE9PSA4KSB7XG4gICAgICByZXR1cm4ge3ZhbGlkOiBmYWxzZSwgZXJyb3JfbnVtYmVyOiA3LCBlcnJvcjogZXJyb3JzWzddfTtcbiAgICB9XG5cbiAgICAvKiA4dGggY3JpdGVyaW9uOiBldmVyeSByb3cgaXMgdmFsaWQ/ICovXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByb3dzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvKiBjaGVjayBmb3IgcmlnaHQgc3VtIG9mIGZpZWxkcyBBTkQgbm90IHR3byBudW1iZXJzIGluIHN1Y2Nlc3Npb24gKi9cbiAgICAgIHZhciBzdW1fZmllbGRzID0gMDtcbiAgICAgIHZhciBwcmV2aW91c193YXNfbnVtYmVyID0gZmFsc2U7XG5cbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgcm93c1tpXS5sZW5ndGg7IGsrKykge1xuICAgICAgICBpZiAoIWlzTmFOKHJvd3NbaV1ba10pKSB7XG4gICAgICAgICAgaWYgKHByZXZpb3VzX3dhc19udW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB7dmFsaWQ6IGZhbHNlLCBlcnJvcl9udW1iZXI6IDgsIGVycm9yOiBlcnJvcnNbOF19O1xuICAgICAgICAgIH1cbiAgICAgICAgICBzdW1fZmllbGRzICs9IHBhcnNlSW50KHJvd3NbaV1ba10sIDEwKTtcbiAgICAgICAgICBwcmV2aW91c193YXNfbnVtYmVyID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoIS9eW3BybmJxa1BSTkJRS10kLy50ZXN0KHJvd3NbaV1ba10pKSB7XG4gICAgICAgICAgICByZXR1cm4ge3ZhbGlkOiBmYWxzZSwgZXJyb3JfbnVtYmVyOiA5LCBlcnJvcjogZXJyb3JzWzldfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3VtX2ZpZWxkcyArPSAxO1xuICAgICAgICAgIHByZXZpb3VzX3dhc19udW1iZXIgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1bV9maWVsZHMgIT09IDgpIHtcbiAgICAgICAgcmV0dXJuIHt2YWxpZDogZmFsc2UsIGVycm9yX251bWJlcjogMTAsIGVycm9yOiBlcnJvcnNbMTBdfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoKHRva2Vuc1szXVsxXSA9PSAnMycgJiYgdG9rZW5zWzFdID09ICd3JykgfHxcbiAgICAgICAgKHRva2Vuc1szXVsxXSA9PSAnNicgJiYgdG9rZW5zWzFdID09ICdiJykpIHtcbiAgICAgICAgICByZXR1cm4ge3ZhbGlkOiBmYWxzZSwgZXJyb3JfbnVtYmVyOiAxMSwgZXJyb3I6IGVycm9yc1sxMV19O1xuICAgIH1cblxuICAgIC8qIGV2ZXJ5dGhpbmcncyBva2F5ISAqL1xuICAgIHJldHVybiB7dmFsaWQ6IHRydWUsIGVycm9yX251bWJlcjogMCwgZXJyb3I6IGVycm9yc1swXX07XG4gIH1cblxuICBmdW5jdGlvbiBnZW5lcmF0ZV9mZW4oKSB7XG4gICAgdmFyIGVtcHR5ID0gMDtcbiAgICB2YXIgZmVuID0gJyc7XG5cbiAgICBmb3IgKHZhciBpID0gU1FVQVJFUy5hODsgaSA8PSBTUVVBUkVTLmgxOyBpKyspIHtcbiAgICAgIGlmIChib2FyZFtpXSA9PSBudWxsKSB7XG4gICAgICAgIGVtcHR5Kys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZW1wdHkgPiAwKSB7XG4gICAgICAgICAgZmVuICs9IGVtcHR5O1xuICAgICAgICAgIGVtcHR5ID0gMDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY29sb3IgPSBib2FyZFtpXS5jb2xvcjtcbiAgICAgICAgdmFyIHBpZWNlID0gYm9hcmRbaV0udHlwZTtcblxuICAgICAgICBmZW4gKz0gKGNvbG9yID09PSBXSElURSkgP1xuICAgICAgICAgICAgICAgICBwaWVjZS50b1VwcGVyQ2FzZSgpIDogcGllY2UudG9Mb3dlckNhc2UoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKChpICsgMSkgJiAweDg4KSB7XG4gICAgICAgIGlmIChlbXB0eSA+IDApIHtcbiAgICAgICAgICBmZW4gKz0gZW1wdHk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaSAhPT0gU1FVQVJFUy5oMSkge1xuICAgICAgICAgIGZlbiArPSAnLyc7XG4gICAgICAgIH1cblxuICAgICAgICBlbXB0eSA9IDA7XG4gICAgICAgIGkgKz0gODtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgY2ZsYWdzID0gJyc7XG4gICAgaWYgKGNhc3RsaW5nW1dISVRFXSAmIEJJVFMuS1NJREVfQ0FTVExFKSB7IGNmbGFncyArPSAnSyc7IH1cbiAgICBpZiAoY2FzdGxpbmdbV0hJVEVdICYgQklUUy5RU0lERV9DQVNUTEUpIHsgY2ZsYWdzICs9ICdRJzsgfVxuICAgIGlmIChjYXN0bGluZ1tCTEFDS10gJiBCSVRTLktTSURFX0NBU1RMRSkgeyBjZmxhZ3MgKz0gJ2snOyB9XG4gICAgaWYgKGNhc3RsaW5nW0JMQUNLXSAmIEJJVFMuUVNJREVfQ0FTVExFKSB7IGNmbGFncyArPSAncSc7IH1cblxuICAgIC8qIGRvIHdlIGhhdmUgYW4gZW1wdHkgY2FzdGxpbmcgZmxhZz8gKi9cbiAgICBjZmxhZ3MgPSBjZmxhZ3MgfHwgJy0nO1xuICAgIHZhciBlcGZsYWdzID0gKGVwX3NxdWFyZSA9PT0gRU1QVFkpID8gJy0nIDogYWxnZWJyYWljKGVwX3NxdWFyZSk7XG5cbiAgICByZXR1cm4gW2ZlbiwgdHVybiwgY2ZsYWdzLCBlcGZsYWdzLCBoYWxmX21vdmVzLCBtb3ZlX251bWJlcl0uam9pbignICcpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0X2hlYWRlcihhcmdzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICBpZiAodHlwZW9mIGFyZ3NbaV0gPT09ICdzdHJpbmcnICYmXG4gICAgICAgICAgdHlwZW9mIGFyZ3NbaSArIDFdID09PSAnc3RyaW5nJykge1xuICAgICAgICBoZWFkZXJbYXJnc1tpXV0gPSBhcmdzW2kgKyAxXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhlYWRlcjtcbiAgfVxuXG4gIC8qIGNhbGxlZCB3aGVuIHRoZSBpbml0aWFsIGJvYXJkIHNldHVwIGlzIGNoYW5nZWQgd2l0aCBwdXQoKSBvciByZW1vdmUoKS5cbiAgICogbW9kaWZpZXMgdGhlIFNldFVwIGFuZCBGRU4gcHJvcGVydGllcyBvZiB0aGUgaGVhZGVyIG9iamVjdC4gIGlmIHRoZSBGRU4gaXNcbiAgICogZXF1YWwgdG8gdGhlIGRlZmF1bHQgcG9zaXRpb24sIHRoZSBTZXRVcCBhbmQgRkVOIGFyZSBkZWxldGVkXG4gICAqIHRoZSBzZXR1cCBpcyBvbmx5IHVwZGF0ZWQgaWYgaGlzdG9yeS5sZW5ndGggaXMgemVybywgaWUgbW92ZXMgaGF2ZW4ndCBiZWVuXG4gICAqIG1hZGUuXG4gICAqL1xuICBmdW5jdGlvbiB1cGRhdGVfc2V0dXAoZmVuKSB7XG4gICAgaWYgKGhpc3RvcnkubGVuZ3RoID4gMCkgcmV0dXJuO1xuXG4gICAgaWYgKGZlbiAhPT0gREVGQVVMVF9QT1NJVElPTikge1xuICAgICAgaGVhZGVyWydTZXRVcCddID0gJzEnO1xuICAgICAgaGVhZGVyWydGRU4nXSA9IGZlbjtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIGhlYWRlclsnU2V0VXAnXTtcbiAgICAgIGRlbGV0ZSBoZWFkZXJbJ0ZFTiddO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldChzcXVhcmUpIHtcbiAgICB2YXIgcGllY2UgPSBib2FyZFtTUVVBUkVTW3NxdWFyZV1dO1xuICAgIHJldHVybiAocGllY2UpID8ge3R5cGU6IHBpZWNlLnR5cGUsIGNvbG9yOiBwaWVjZS5jb2xvcn0gOiBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gcHV0KHBpZWNlLCBzcXVhcmUpIHtcbiAgICAvKiBjaGVjayBmb3IgdmFsaWQgcGllY2Ugb2JqZWN0ICovXG4gICAgaWYgKCEoJ3R5cGUnIGluIHBpZWNlICYmICdjb2xvcicgaW4gcGllY2UpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyogY2hlY2sgZm9yIHBpZWNlICovXG4gICAgaWYgKFNZTUJPTFMuaW5kZXhPZihwaWVjZS50eXBlLnRvTG93ZXJDYXNlKCkpID09PSAtMSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qIGNoZWNrIGZvciB2YWxpZCBzcXVhcmUgKi9cbiAgICBpZiAoIShzcXVhcmUgaW4gU1FVQVJFUykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgc3EgPSBTUVVBUkVTW3NxdWFyZV07XG5cbiAgICAvKiBkb24ndCBsZXQgdGhlIHVzZXIgcGxhY2UgbW9yZSB0aGFuIG9uZSBraW5nICovXG4gICAgaWYgKHBpZWNlLnR5cGUgPT0gS0lORyAmJlxuICAgICAgICAhKGtpbmdzW3BpZWNlLmNvbG9yXSA9PSBFTVBUWSB8fCBraW5nc1twaWVjZS5jb2xvcl0gPT0gc3EpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgYm9hcmRbc3FdID0ge3R5cGU6IHBpZWNlLnR5cGUsIGNvbG9yOiBwaWVjZS5jb2xvcn07XG4gICAgaWYgKHBpZWNlLnR5cGUgPT09IEtJTkcpIHtcbiAgICAgIGtpbmdzW3BpZWNlLmNvbG9yXSA9IHNxO1xuICAgIH1cblxuICAgIHVwZGF0ZV9zZXR1cChnZW5lcmF0ZV9mZW4oKSk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZShzcXVhcmUpIHtcbiAgICB2YXIgcGllY2UgPSBnZXQoc3F1YXJlKTtcbiAgICBib2FyZFtTUVVBUkVTW3NxdWFyZV1dID0gbnVsbDtcbiAgICBpZiAocGllY2UgJiYgcGllY2UudHlwZSA9PT0gS0lORykge1xuICAgICAga2luZ3NbcGllY2UuY29sb3JdID0gRU1QVFk7XG4gICAgfVxuXG4gICAgdXBkYXRlX3NldHVwKGdlbmVyYXRlX2ZlbigpKTtcblxuICAgIHJldHVybiBwaWVjZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1aWxkX21vdmUoYm9hcmQsIGZyb20sIHRvLCBmbGFncywgcHJvbW90aW9uKSB7XG4gICAgdmFyIG1vdmUgPSB7XG4gICAgICBjb2xvcjogdHVybixcbiAgICAgIGZyb206IGZyb20sXG4gICAgICB0bzogdG8sXG4gICAgICBmbGFnczogZmxhZ3MsXG4gICAgICBwaWVjZTogYm9hcmRbZnJvbV0udHlwZVxuICAgIH07XG5cbiAgICBpZiAocHJvbW90aW9uKSB7XG4gICAgICBtb3ZlLmZsYWdzIHw9IEJJVFMuUFJPTU9USU9OO1xuICAgICAgbW92ZS5wcm9tb3Rpb24gPSBwcm9tb3Rpb247XG4gICAgfVxuXG4gICAgaWYgKGJvYXJkW3RvXSkge1xuICAgICAgbW92ZS5jYXB0dXJlZCA9IGJvYXJkW3RvXS50eXBlO1xuICAgIH0gZWxzZSBpZiAoZmxhZ3MgJiBCSVRTLkVQX0NBUFRVUkUpIHtcbiAgICAgICAgbW92ZS5jYXB0dXJlZCA9IFBBV047XG4gICAgfVxuICAgIHJldHVybiBtb3ZlO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2VuZXJhdGVfbW92ZXMob3B0aW9ucykge1xuICAgIGZ1bmN0aW9uIGFkZF9tb3ZlKGJvYXJkLCBtb3ZlcywgZnJvbSwgdG8sIGZsYWdzKSB7XG4gICAgICAvKiBpZiBwYXduIHByb21vdGlvbiAqL1xuICAgICAgaWYgKGJvYXJkW2Zyb21dLnR5cGUgPT09IFBBV04gJiZcbiAgICAgICAgIChyYW5rKHRvKSA9PT0gUkFOS184IHx8IHJhbmsodG8pID09PSBSQU5LXzEpKSB7XG4gICAgICAgICAgdmFyIHBpZWNlcyA9IFtRVUVFTiwgUk9PSywgQklTSE9QLCBLTklHSFRdO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBwaWVjZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIG1vdmVzLnB1c2goYnVpbGRfbW92ZShib2FyZCwgZnJvbSwgdG8sIGZsYWdzLCBwaWVjZXNbaV0pKTtcbiAgICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgIG1vdmVzLnB1c2goYnVpbGRfbW92ZShib2FyZCwgZnJvbSwgdG8sIGZsYWdzKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIG1vdmVzID0gW107XG4gICAgdmFyIHVzID0gdHVybjtcbiAgICB2YXIgdGhlbSA9IHN3YXBfY29sb3IodXMpO1xuICAgIHZhciBzZWNvbmRfcmFuayA9IHtiOiBSQU5LXzcsIHc6IFJBTktfMn07XG5cbiAgICB2YXIgZmlyc3Rfc3EgPSBTUVVBUkVTLmE4O1xuICAgIHZhciBsYXN0X3NxID0gU1FVQVJFUy5oMTtcbiAgICB2YXIgc2luZ2xlX3NxdWFyZSA9IGZhbHNlO1xuXG4gICAgLyogZG8gd2Ugd2FudCBsZWdhbCBtb3Zlcz8gKi9cbiAgICB2YXIgbGVnYWwgPSAodHlwZW9mIG9wdGlvbnMgIT09ICd1bmRlZmluZWQnICYmICdsZWdhbCcgaW4gb3B0aW9ucykgP1xuICAgICAgICAgICAgICAgIG9wdGlvbnMubGVnYWwgOiB0cnVlO1xuXG4gICAgLyogYXJlIHdlIGdlbmVyYXRpbmcgbW92ZXMgZm9yIGEgc2luZ2xlIHNxdWFyZT8gKi9cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgIT09ICd1bmRlZmluZWQnICYmICdzcXVhcmUnIGluIG9wdGlvbnMpIHtcbiAgICAgIGlmIChvcHRpb25zLnNxdWFyZSBpbiBTUVVBUkVTKSB7XG4gICAgICAgIGZpcnN0X3NxID0gbGFzdF9zcSA9IFNRVUFSRVNbb3B0aW9ucy5zcXVhcmVdO1xuICAgICAgICBzaW5nbGVfc3F1YXJlID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8qIGludmFsaWQgc3F1YXJlICovXG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gZmlyc3Rfc3E7IGkgPD0gbGFzdF9zcTsgaSsrKSB7XG4gICAgICAvKiBkaWQgd2UgcnVuIG9mZiB0aGUgZW5kIG9mIHRoZSBib2FyZCAqL1xuICAgICAgaWYgKGkgJiAweDg4KSB7IGkgKz0gNzsgY29udGludWU7IH1cblxuICAgICAgdmFyIHBpZWNlID0gYm9hcmRbaV07XG4gICAgICBpZiAocGllY2UgPT0gbnVsbCB8fCBwaWVjZS5jb2xvciAhPT0gdXMpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChwaWVjZS50eXBlID09PSBQQVdOKSB7XG4gICAgICAgIC8qIHNpbmdsZSBzcXVhcmUsIG5vbi1jYXB0dXJpbmcgKi9cbiAgICAgICAgdmFyIHNxdWFyZSA9IGkgKyBQQVdOX09GRlNFVFNbdXNdWzBdO1xuICAgICAgICBpZiAoYm9hcmRbc3F1YXJlXSA9PSBudWxsKSB7XG4gICAgICAgICAgICBhZGRfbW92ZShib2FyZCwgbW92ZXMsIGksIHNxdWFyZSwgQklUUy5OT1JNQUwpO1xuXG4gICAgICAgICAgLyogZG91YmxlIHNxdWFyZSAqL1xuICAgICAgICAgIHZhciBzcXVhcmUgPSBpICsgUEFXTl9PRkZTRVRTW3VzXVsxXTtcbiAgICAgICAgICBpZiAoc2Vjb25kX3JhbmtbdXNdID09PSByYW5rKGkpICYmIGJvYXJkW3NxdWFyZV0gPT0gbnVsbCkge1xuICAgICAgICAgICAgYWRkX21vdmUoYm9hcmQsIG1vdmVzLCBpLCBzcXVhcmUsIEJJVFMuQklHX1BBV04pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qIHBhd24gY2FwdHVyZXMgKi9cbiAgICAgICAgZm9yIChqID0gMjsgaiA8IDQ7IGorKykge1xuICAgICAgICAgIHZhciBzcXVhcmUgPSBpICsgUEFXTl9PRkZTRVRTW3VzXVtqXTtcbiAgICAgICAgICBpZiAoc3F1YXJlICYgMHg4OCkgY29udGludWU7XG5cbiAgICAgICAgICBpZiAoYm9hcmRbc3F1YXJlXSAhPSBudWxsICYmXG4gICAgICAgICAgICAgIGJvYXJkW3NxdWFyZV0uY29sb3IgPT09IHRoZW0pIHtcbiAgICAgICAgICAgICAgYWRkX21vdmUoYm9hcmQsIG1vdmVzLCBpLCBzcXVhcmUsIEJJVFMuQ0FQVFVSRSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChzcXVhcmUgPT09IGVwX3NxdWFyZSkge1xuICAgICAgICAgICAgICBhZGRfbW92ZShib2FyZCwgbW92ZXMsIGksIGVwX3NxdWFyZSwgQklUUy5FUF9DQVBUVVJFKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwLCBsZW4gPSBQSUVDRV9PRkZTRVRTW3BpZWNlLnR5cGVdLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgdmFyIG9mZnNldCA9IFBJRUNFX09GRlNFVFNbcGllY2UudHlwZV1bal07XG4gICAgICAgICAgdmFyIHNxdWFyZSA9IGk7XG5cbiAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgc3F1YXJlICs9IG9mZnNldDtcbiAgICAgICAgICAgIGlmIChzcXVhcmUgJiAweDg4KSBicmVhaztcblxuICAgICAgICAgICAgaWYgKGJvYXJkW3NxdWFyZV0gPT0gbnVsbCkge1xuICAgICAgICAgICAgICBhZGRfbW92ZShib2FyZCwgbW92ZXMsIGksIHNxdWFyZSwgQklUUy5OT1JNQUwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKGJvYXJkW3NxdWFyZV0uY29sb3IgPT09IHVzKSBicmVhaztcbiAgICAgICAgICAgICAgYWRkX21vdmUoYm9hcmQsIG1vdmVzLCBpLCBzcXVhcmUsIEJJVFMuQ0FQVFVSRSk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiBicmVhaywgaWYga25pZ2h0IG9yIGtpbmcgKi9cbiAgICAgICAgICAgIGlmIChwaWVjZS50eXBlID09PSAnbicgfHwgcGllY2UudHlwZSA9PT0gJ2snKSBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiBjaGVjayBmb3IgY2FzdGxpbmcgaWY6IGEpIHdlJ3JlIGdlbmVyYXRpbmcgYWxsIG1vdmVzLCBvciBiKSB3ZSdyZSBkb2luZ1xuICAgICAqIHNpbmdsZSBzcXVhcmUgbW92ZSBnZW5lcmF0aW9uIG9uIHRoZSBraW5nJ3Mgc3F1YXJlXG4gICAgICovXG4gICAgaWYgKCghc2luZ2xlX3NxdWFyZSkgfHwgbGFzdF9zcSA9PT0ga2luZ3NbdXNdKSB7XG4gICAgICAvKiBraW5nLXNpZGUgY2FzdGxpbmcgKi9cbiAgICAgIGlmIChjYXN0bGluZ1t1c10gJiBCSVRTLktTSURFX0NBU1RMRSkge1xuICAgICAgICB2YXIgY2FzdGxpbmdfZnJvbSA9IGtpbmdzW3VzXTtcbiAgICAgICAgdmFyIGNhc3RsaW5nX3RvID0gY2FzdGxpbmdfZnJvbSArIDI7XG5cbiAgICAgICAgaWYgKGJvYXJkW2Nhc3RsaW5nX2Zyb20gKyAxXSA9PSBudWxsICYmXG4gICAgICAgICAgICBib2FyZFtjYXN0bGluZ190b10gICAgICAgPT0gbnVsbCAmJlxuICAgICAgICAgICAgIWF0dGFja2VkKHRoZW0sIGtpbmdzW3VzXSkgJiZcbiAgICAgICAgICAgICFhdHRhY2tlZCh0aGVtLCBjYXN0bGluZ19mcm9tICsgMSkgJiZcbiAgICAgICAgICAgICFhdHRhY2tlZCh0aGVtLCBjYXN0bGluZ190bykpIHtcbiAgICAgICAgICBhZGRfbW92ZShib2FyZCwgbW92ZXMsIGtpbmdzW3VzXSAsIGNhc3RsaW5nX3RvLFxuICAgICAgICAgICAgICAgICAgIEJJVFMuS1NJREVfQ0FTVExFKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvKiBxdWVlbi1zaWRlIGNhc3RsaW5nICovXG4gICAgICBpZiAoY2FzdGxpbmdbdXNdICYgQklUUy5RU0lERV9DQVNUTEUpIHtcbiAgICAgICAgdmFyIGNhc3RsaW5nX2Zyb20gPSBraW5nc1t1c107XG4gICAgICAgIHZhciBjYXN0bGluZ190byA9IGNhc3RsaW5nX2Zyb20gLSAyO1xuXG4gICAgICAgIGlmIChib2FyZFtjYXN0bGluZ19mcm9tIC0gMV0gPT0gbnVsbCAmJlxuICAgICAgICAgICAgYm9hcmRbY2FzdGxpbmdfZnJvbSAtIDJdID09IG51bGwgJiZcbiAgICAgICAgICAgIGJvYXJkW2Nhc3RsaW5nX2Zyb20gLSAzXSA9PSBudWxsICYmXG4gICAgICAgICAgICAhYXR0YWNrZWQodGhlbSwga2luZ3NbdXNdKSAmJlxuICAgICAgICAgICAgIWF0dGFja2VkKHRoZW0sIGNhc3RsaW5nX2Zyb20gLSAxKSAmJlxuICAgICAgICAgICAgIWF0dGFja2VkKHRoZW0sIGNhc3RsaW5nX3RvKSkge1xuICAgICAgICAgIGFkZF9tb3ZlKGJvYXJkLCBtb3Zlcywga2luZ3NbdXNdLCBjYXN0bGluZ190byxcbiAgICAgICAgICAgICAgICAgICBCSVRTLlFTSURFX0NBU1RMRSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiByZXR1cm4gYWxsIHBzZXVkby1sZWdhbCBtb3ZlcyAodGhpcyBpbmNsdWRlcyBtb3ZlcyB0aGF0IGFsbG93IHRoZSBraW5nXG4gICAgICogdG8gYmUgY2FwdHVyZWQpXG4gICAgICovXG4gICAgaWYgKCFsZWdhbCkge1xuICAgICAgcmV0dXJuIG1vdmVzO1xuICAgIH1cblxuICAgIC8qIGZpbHRlciBvdXQgaWxsZWdhbCBtb3ZlcyAqL1xuICAgIHZhciBsZWdhbF9tb3ZlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBtb3Zlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbWFrZV9tb3ZlKG1vdmVzW2ldKTtcbiAgICAgIGlmICgha2luZ19hdHRhY2tlZCh1cykpIHtcbiAgICAgICAgbGVnYWxfbW92ZXMucHVzaChtb3Zlc1tpXSk7XG4gICAgICB9XG4gICAgICB1bmRvX21vdmUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbGVnYWxfbW92ZXM7XG4gIH1cblxuICAvKiBjb252ZXJ0IGEgbW92ZSBmcm9tIDB4ODggY29vcmRpbmF0ZXMgdG8gU3RhbmRhcmQgQWxnZWJyYWljIE5vdGF0aW9uXG4gICAqIChTQU4pXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gc2xvcHB5IFVzZSB0aGUgc2xvcHB5IFNBTiBnZW5lcmF0b3IgdG8gd29yayBhcm91bmQgb3ZlclxuICAgKiBkaXNhbWJpZ3VhdGlvbiBidWdzIGluIEZyaXR6IGFuZCBDaGVzc2Jhc2UuICBTZWUgYmVsb3c6XG4gICAqXG4gICAqIHIxYnFrYm5yL3BwcDJwcHAvMm41LzFCMXBQMy80UDMvOC9QUFBQMlBQL1JOQlFLMU5SIGIgS1FrcSAtIDIgNFxuICAgKiA0LiAuLi4gTmdlNyBpcyBvdmVybHkgZGlzYW1iaWd1YXRlZCBiZWNhdXNlIHRoZSBrbmlnaHQgb24gYzYgaXMgcGlubmVkXG4gICAqIDQuIC4uLiBOZTcgaXMgdGVjaG5pY2FsbHkgdGhlIHZhbGlkIFNBTlxuICAgKi9cbiAgZnVuY3Rpb24gbW92ZV90b19zYW4obW92ZSwgc2xvcHB5KSB7XG5cbiAgICB2YXIgb3V0cHV0ID0gJyc7XG5cbiAgICBpZiAobW92ZS5mbGFncyAmIEJJVFMuS1NJREVfQ0FTVExFKSB7XG4gICAgICBvdXRwdXQgPSAnTy1PJztcbiAgICB9IGVsc2UgaWYgKG1vdmUuZmxhZ3MgJiBCSVRTLlFTSURFX0NBU1RMRSkge1xuICAgICAgb3V0cHV0ID0gJ08tTy1PJztcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGRpc2FtYmlndWF0b3IgPSBnZXRfZGlzYW1iaWd1YXRvcihtb3ZlLCBzbG9wcHkpO1xuXG4gICAgICBpZiAobW92ZS5waWVjZSAhPT0gUEFXTikge1xuICAgICAgICBvdXRwdXQgKz0gbW92ZS5waWVjZS50b1VwcGVyQ2FzZSgpICsgZGlzYW1iaWd1YXRvcjtcbiAgICAgIH1cblxuICAgICAgaWYgKG1vdmUuZmxhZ3MgJiAoQklUUy5DQVBUVVJFIHwgQklUUy5FUF9DQVBUVVJFKSkge1xuICAgICAgICBpZiAobW92ZS5waWVjZSA9PT0gUEFXTikge1xuICAgICAgICAgIG91dHB1dCArPSBhbGdlYnJhaWMobW92ZS5mcm9tKVswXTtcbiAgICAgICAgfVxuICAgICAgICBvdXRwdXQgKz0gJ3gnO1xuICAgICAgfVxuXG4gICAgICBvdXRwdXQgKz0gYWxnZWJyYWljKG1vdmUudG8pO1xuXG4gICAgICBpZiAobW92ZS5mbGFncyAmIEJJVFMuUFJPTU9USU9OKSB7XG4gICAgICAgIG91dHB1dCArPSAnPScgKyBtb3ZlLnByb21vdGlvbi50b1VwcGVyQ2FzZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIG1ha2VfbW92ZShtb3ZlKTtcbiAgICBpZiAoaW5fY2hlY2soKSkge1xuICAgICAgaWYgKGluX2NoZWNrbWF0ZSgpKSB7XG4gICAgICAgIG91dHB1dCArPSAnIyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRwdXQgKz0gJysnO1xuICAgICAgfVxuICAgIH1cbiAgICB1bmRvX21vdmUoKTtcblxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cblxuICAvLyBwYXJzZXMgYWxsIG9mIHRoZSBkZWNvcmF0b3JzIG91dCBvZiBhIFNBTiBzdHJpbmdcbiAgZnVuY3Rpb24gc3RyaXBwZWRfc2FuKG1vdmUpIHtcbiAgICByZXR1cm4gbW92ZS5yZXBsYWNlKC89LywnJykucmVwbGFjZSgvWysjXT9bPyFdKiQvLCcnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGF0dGFja2VkKGNvbG9yLCBzcXVhcmUpIHtcbiAgICBmb3IgKHZhciBpID0gU1FVQVJFUy5hODsgaSA8PSBTUVVBUkVTLmgxOyBpKyspIHtcbiAgICAgIC8qIGRpZCB3ZSBydW4gb2ZmIHRoZSBlbmQgb2YgdGhlIGJvYXJkICovXG4gICAgICBpZiAoaSAmIDB4ODgpIHsgaSArPSA3OyBjb250aW51ZTsgfVxuXG4gICAgICAvKiBpZiBlbXB0eSBzcXVhcmUgb3Igd3JvbmcgY29sb3IgKi9cbiAgICAgIGlmIChib2FyZFtpXSA9PSBudWxsIHx8IGJvYXJkW2ldLmNvbG9yICE9PSBjb2xvcikgY29udGludWU7XG5cbiAgICAgIHZhciBwaWVjZSA9IGJvYXJkW2ldO1xuICAgICAgdmFyIGRpZmZlcmVuY2UgPSBpIC0gc3F1YXJlO1xuICAgICAgdmFyIGluZGV4ID0gZGlmZmVyZW5jZSArIDExOTtcblxuICAgICAgaWYgKEFUVEFDS1NbaW5kZXhdICYgKDEgPDwgU0hJRlRTW3BpZWNlLnR5cGVdKSkge1xuICAgICAgICBpZiAocGllY2UudHlwZSA9PT0gUEFXTikge1xuICAgICAgICAgIGlmIChkaWZmZXJlbmNlID4gMCkge1xuICAgICAgICAgICAgaWYgKHBpZWNlLmNvbG9yID09PSBXSElURSkgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChwaWVjZS5jb2xvciA9PT0gQkxBQ0spIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIGlmIHRoZSBwaWVjZSBpcyBhIGtuaWdodCBvciBhIGtpbmcgKi9cbiAgICAgICAgaWYgKHBpZWNlLnR5cGUgPT09ICduJyB8fCBwaWVjZS50eXBlID09PSAnaycpIHJldHVybiB0cnVlO1xuXG4gICAgICAgIHZhciBvZmZzZXQgPSBSQVlTW2luZGV4XTtcbiAgICAgICAgdmFyIGogPSBpICsgb2Zmc2V0O1xuXG4gICAgICAgIHZhciBibG9ja2VkID0gZmFsc2U7XG4gICAgICAgIHdoaWxlIChqICE9PSBzcXVhcmUpIHtcbiAgICAgICAgICBpZiAoYm9hcmRbal0gIT0gbnVsbCkgeyBibG9ja2VkID0gdHJ1ZTsgYnJlYWs7IH1cbiAgICAgICAgICBqICs9IG9mZnNldDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghYmxvY2tlZCkgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24ga2luZ19hdHRhY2tlZChjb2xvcikge1xuICAgIHJldHVybiBhdHRhY2tlZChzd2FwX2NvbG9yKGNvbG9yKSwga2luZ3NbY29sb3JdKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluX2NoZWNrKCkge1xuICAgIHJldHVybiBraW5nX2F0dGFja2VkKHR1cm4pO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5fY2hlY2ttYXRlKCkge1xuICAgIHJldHVybiBpbl9jaGVjaygpICYmIGdlbmVyYXRlX21vdmVzKCkubGVuZ3RoID09PSAwO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5fc3RhbGVtYXRlKCkge1xuICAgIHJldHVybiAhaW5fY2hlY2soKSAmJiBnZW5lcmF0ZV9tb3ZlcygpLmxlbmd0aCA9PT0gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluc3VmZmljaWVudF9tYXRlcmlhbCgpIHtcbiAgICB2YXIgcGllY2VzID0ge307XG4gICAgdmFyIGJpc2hvcHMgPSBbXTtcbiAgICB2YXIgbnVtX3BpZWNlcyA9IDA7XG4gICAgdmFyIHNxX2NvbG9yID0gMDtcblxuICAgIGZvciAodmFyIGkgPSBTUVVBUkVTLmE4OyBpPD0gU1FVQVJFUy5oMTsgaSsrKSB7XG4gICAgICBzcV9jb2xvciA9IChzcV9jb2xvciArIDEpICUgMjtcbiAgICAgIGlmIChpICYgMHg4OCkgeyBpICs9IDc7IGNvbnRpbnVlOyB9XG5cbiAgICAgIHZhciBwaWVjZSA9IGJvYXJkW2ldO1xuICAgICAgaWYgKHBpZWNlKSB7XG4gICAgICAgIHBpZWNlc1twaWVjZS50eXBlXSA9IChwaWVjZS50eXBlIGluIHBpZWNlcykgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGllY2VzW3BpZWNlLnR5cGVdICsgMSA6IDE7XG4gICAgICAgIGlmIChwaWVjZS50eXBlID09PSBCSVNIT1ApIHtcbiAgICAgICAgICBiaXNob3BzLnB1c2goc3FfY29sb3IpO1xuICAgICAgICB9XG4gICAgICAgIG51bV9waWVjZXMrKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiBrIHZzLiBrICovXG4gICAgaWYgKG51bV9waWVjZXMgPT09IDIpIHsgcmV0dXJuIHRydWU7IH1cblxuICAgIC8qIGsgdnMuIGtuIC4uLi4gb3IgLi4uLiBrIHZzLiBrYiAqL1xuICAgIGVsc2UgaWYgKG51bV9waWVjZXMgPT09IDMgJiYgKHBpZWNlc1tCSVNIT1BdID09PSAxIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWVjZXNbS05JR0hUXSA9PT0gMSkpIHsgcmV0dXJuIHRydWU7IH1cblxuICAgIC8qIGtiIHZzLiBrYiB3aGVyZSBhbnkgbnVtYmVyIG9mIGJpc2hvcHMgYXJlIGFsbCBvbiB0aGUgc2FtZSBjb2xvciAqL1xuICAgIGVsc2UgaWYgKG51bV9waWVjZXMgPT09IHBpZWNlc1tCSVNIT1BdICsgMikge1xuICAgICAgdmFyIHN1bSA9IDA7XG4gICAgICB2YXIgbGVuID0gYmlzaG9wcy5sZW5ndGg7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHN1bSArPSBiaXNob3BzW2ldO1xuICAgICAgfVxuICAgICAgaWYgKHN1bSA9PT0gMCB8fCBzdW0gPT09IGxlbikgeyByZXR1cm4gdHJ1ZTsgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluX3RocmVlZm9sZF9yZXBldGl0aW9uKCkge1xuICAgIC8qIFRPRE86IHdoaWxlIHRoaXMgZnVuY3Rpb24gaXMgZmluZSBmb3IgY2FzdWFsIHVzZSwgYSBiZXR0ZXJcbiAgICAgKiBpbXBsZW1lbnRhdGlvbiB3b3VsZCB1c2UgYSBab2JyaXN0IGtleSAoaW5zdGVhZCBvZiBGRU4pLiB0aGVcbiAgICAgKiBab2JyaXN0IGtleSB3b3VsZCBiZSBtYWludGFpbmVkIGluIHRoZSBtYWtlX21vdmUvdW5kb19tb3ZlIGZ1bmN0aW9ucyxcbiAgICAgKiBhdm9pZGluZyB0aGUgY29zdGx5IHRoYXQgd2UgZG8gYmVsb3cuXG4gICAgICovXG4gICAgdmFyIG1vdmVzID0gW107XG4gICAgdmFyIHBvc2l0aW9ucyA9IHt9O1xuICAgIHZhciByZXBldGl0aW9uID0gZmFsc2U7XG5cbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgdmFyIG1vdmUgPSB1bmRvX21vdmUoKTtcbiAgICAgIGlmICghbW92ZSkgYnJlYWs7XG4gICAgICBtb3Zlcy5wdXNoKG1vdmUpO1xuICAgIH1cblxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAvKiByZW1vdmUgdGhlIGxhc3QgdHdvIGZpZWxkcyBpbiB0aGUgRkVOIHN0cmluZywgdGhleSdyZSBub3QgbmVlZGVkXG4gICAgICAgKiB3aGVuIGNoZWNraW5nIGZvciBkcmF3IGJ5IHJlcCAqL1xuICAgICAgdmFyIGZlbiA9IGdlbmVyYXRlX2ZlbigpLnNwbGl0KCcgJykuc2xpY2UoMCw0KS5qb2luKCcgJyk7XG5cbiAgICAgIC8qIGhhcyB0aGUgcG9zaXRpb24gb2NjdXJyZWQgdGhyZWUgb3IgbW92ZSB0aW1lcyAqL1xuICAgICAgcG9zaXRpb25zW2Zlbl0gPSAoZmVuIGluIHBvc2l0aW9ucykgPyBwb3NpdGlvbnNbZmVuXSArIDEgOiAxO1xuICAgICAgaWYgKHBvc2l0aW9uc1tmZW5dID49IDMpIHtcbiAgICAgICAgcmVwZXRpdGlvbiA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmICghbW92ZXMubGVuZ3RoKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgbWFrZV9tb3ZlKG1vdmVzLnBvcCgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVwZXRpdGlvbjtcbiAgfVxuXG4gIGZ1bmN0aW9uIHB1c2gobW92ZSkge1xuICAgIGhpc3RvcnkucHVzaCh7XG4gICAgICBtb3ZlOiBtb3ZlLFxuICAgICAga2luZ3M6IHtiOiBraW5ncy5iLCB3OiBraW5ncy53fSxcbiAgICAgIHR1cm46IHR1cm4sXG4gICAgICBjYXN0bGluZzoge2I6IGNhc3RsaW5nLmIsIHc6IGNhc3RsaW5nLnd9LFxuICAgICAgZXBfc3F1YXJlOiBlcF9zcXVhcmUsXG4gICAgICBoYWxmX21vdmVzOiBoYWxmX21vdmVzLFxuICAgICAgbW92ZV9udW1iZXI6IG1vdmVfbnVtYmVyXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlX21vdmUobW92ZSkge1xuICAgIHZhciB1cyA9IHR1cm47XG4gICAgdmFyIHRoZW0gPSBzd2FwX2NvbG9yKHVzKTtcbiAgICBwdXNoKG1vdmUpO1xuXG4gICAgYm9hcmRbbW92ZS50b10gPSBib2FyZFttb3ZlLmZyb21dO1xuICAgIGJvYXJkW21vdmUuZnJvbV0gPSBudWxsO1xuXG4gICAgLyogaWYgZXAgY2FwdHVyZSwgcmVtb3ZlIHRoZSBjYXB0dXJlZCBwYXduICovXG4gICAgaWYgKG1vdmUuZmxhZ3MgJiBCSVRTLkVQX0NBUFRVUkUpIHtcbiAgICAgIGlmICh0dXJuID09PSBCTEFDSykge1xuICAgICAgICBib2FyZFttb3ZlLnRvIC0gMTZdID0gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJvYXJkW21vdmUudG8gKyAxNl0gPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qIGlmIHBhd24gcHJvbW90aW9uLCByZXBsYWNlIHdpdGggbmV3IHBpZWNlICovXG4gICAgaWYgKG1vdmUuZmxhZ3MgJiBCSVRTLlBST01PVElPTikge1xuICAgICAgYm9hcmRbbW92ZS50b10gPSB7dHlwZTogbW92ZS5wcm9tb3Rpb24sIGNvbG9yOiB1c307XG4gICAgfVxuXG4gICAgLyogaWYgd2UgbW92ZWQgdGhlIGtpbmcgKi9cbiAgICBpZiAoYm9hcmRbbW92ZS50b10udHlwZSA9PT0gS0lORykge1xuICAgICAga2luZ3NbYm9hcmRbbW92ZS50b10uY29sb3JdID0gbW92ZS50bztcblxuICAgICAgLyogaWYgd2UgY2FzdGxlZCwgbW92ZSB0aGUgcm9vayBuZXh0IHRvIHRoZSBraW5nICovXG4gICAgICBpZiAobW92ZS5mbGFncyAmIEJJVFMuS1NJREVfQ0FTVExFKSB7XG4gICAgICAgIHZhciBjYXN0bGluZ190byA9IG1vdmUudG8gLSAxO1xuICAgICAgICB2YXIgY2FzdGxpbmdfZnJvbSA9IG1vdmUudG8gKyAxO1xuICAgICAgICBib2FyZFtjYXN0bGluZ190b10gPSBib2FyZFtjYXN0bGluZ19mcm9tXTtcbiAgICAgICAgYm9hcmRbY2FzdGxpbmdfZnJvbV0gPSBudWxsO1xuICAgICAgfSBlbHNlIGlmIChtb3ZlLmZsYWdzICYgQklUUy5RU0lERV9DQVNUTEUpIHtcbiAgICAgICAgdmFyIGNhc3RsaW5nX3RvID0gbW92ZS50byArIDE7XG4gICAgICAgIHZhciBjYXN0bGluZ19mcm9tID0gbW92ZS50byAtIDI7XG4gICAgICAgIGJvYXJkW2Nhc3RsaW5nX3RvXSA9IGJvYXJkW2Nhc3RsaW5nX2Zyb21dO1xuICAgICAgICBib2FyZFtjYXN0bGluZ19mcm9tXSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIC8qIHR1cm4gb2ZmIGNhc3RsaW5nICovXG4gICAgICBjYXN0bGluZ1t1c10gPSAnJztcbiAgICB9XG5cbiAgICAvKiB0dXJuIG9mZiBjYXN0bGluZyBpZiB3ZSBtb3ZlIGEgcm9vayAqL1xuICAgIGlmIChjYXN0bGluZ1t1c10pIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBST09LU1t1c10ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKG1vdmUuZnJvbSA9PT0gUk9PS1NbdXNdW2ldLnNxdWFyZSAmJlxuICAgICAgICAgICAgY2FzdGxpbmdbdXNdICYgUk9PS1NbdXNdW2ldLmZsYWcpIHtcbiAgICAgICAgICBjYXN0bGluZ1t1c10gXj0gUk9PS1NbdXNdW2ldLmZsYWc7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiB0dXJuIG9mZiBjYXN0bGluZyBpZiB3ZSBjYXB0dXJlIGEgcm9vayAqL1xuICAgIGlmIChjYXN0bGluZ1t0aGVtXSkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IFJPT0tTW3RoZW1dLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChtb3ZlLnRvID09PSBST09LU1t0aGVtXVtpXS5zcXVhcmUgJiZcbiAgICAgICAgICAgIGNhc3RsaW5nW3RoZW1dICYgUk9PS1NbdGhlbV1baV0uZmxhZykge1xuICAgICAgICAgIGNhc3RsaW5nW3RoZW1dIF49IFJPT0tTW3RoZW1dW2ldLmZsYWc7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiBpZiBiaWcgcGF3biBtb3ZlLCB1cGRhdGUgdGhlIGVuIHBhc3NhbnQgc3F1YXJlICovXG4gICAgaWYgKG1vdmUuZmxhZ3MgJiBCSVRTLkJJR19QQVdOKSB7XG4gICAgICBpZiAodHVybiA9PT0gJ2InKSB7XG4gICAgICAgIGVwX3NxdWFyZSA9IG1vdmUudG8gLSAxNjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVwX3NxdWFyZSA9IG1vdmUudG8gKyAxNjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZXBfc3F1YXJlID0gRU1QVFk7XG4gICAgfVxuXG4gICAgLyogcmVzZXQgdGhlIDUwIG1vdmUgY291bnRlciBpZiBhIHBhd24gaXMgbW92ZWQgb3IgYSBwaWVjZSBpcyBjYXB0dXJlZCAqL1xuICAgIGlmIChtb3ZlLnBpZWNlID09PSBQQVdOKSB7XG4gICAgICBoYWxmX21vdmVzID0gMDtcbiAgICB9IGVsc2UgaWYgKG1vdmUuZmxhZ3MgJiAoQklUUy5DQVBUVVJFIHwgQklUUy5FUF9DQVBUVVJFKSkge1xuICAgICAgaGFsZl9tb3ZlcyA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhhbGZfbW92ZXMrKztcbiAgICB9XG5cbiAgICBpZiAodHVybiA9PT0gQkxBQ0spIHtcbiAgICAgIG1vdmVfbnVtYmVyKys7XG4gICAgfVxuICAgIHR1cm4gPSBzd2FwX2NvbG9yKHR1cm4pO1xuICB9XG5cbiAgZnVuY3Rpb24gdW5kb19tb3ZlKCkge1xuICAgIHZhciBvbGQgPSBoaXN0b3J5LnBvcCgpO1xuICAgIGlmIChvbGQgPT0gbnVsbCkgeyByZXR1cm4gbnVsbDsgfVxuXG4gICAgdmFyIG1vdmUgPSBvbGQubW92ZTtcbiAgICBraW5ncyA9IG9sZC5raW5ncztcbiAgICB0dXJuID0gb2xkLnR1cm47XG4gICAgY2FzdGxpbmcgPSBvbGQuY2FzdGxpbmc7XG4gICAgZXBfc3F1YXJlID0gb2xkLmVwX3NxdWFyZTtcbiAgICBoYWxmX21vdmVzID0gb2xkLmhhbGZfbW92ZXM7XG4gICAgbW92ZV9udW1iZXIgPSBvbGQubW92ZV9udW1iZXI7XG5cbiAgICB2YXIgdXMgPSB0dXJuO1xuICAgIHZhciB0aGVtID0gc3dhcF9jb2xvcih0dXJuKTtcblxuICAgIGJvYXJkW21vdmUuZnJvbV0gPSBib2FyZFttb3ZlLnRvXTtcbiAgICBib2FyZFttb3ZlLmZyb21dLnR5cGUgPSBtb3ZlLnBpZWNlOyAgLy8gdG8gdW5kbyBhbnkgcHJvbW90aW9uc1xuICAgIGJvYXJkW21vdmUudG9dID0gbnVsbDtcblxuICAgIGlmIChtb3ZlLmZsYWdzICYgQklUUy5DQVBUVVJFKSB7XG4gICAgICBib2FyZFttb3ZlLnRvXSA9IHt0eXBlOiBtb3ZlLmNhcHR1cmVkLCBjb2xvcjogdGhlbX07XG4gICAgfSBlbHNlIGlmIChtb3ZlLmZsYWdzICYgQklUUy5FUF9DQVBUVVJFKSB7XG4gICAgICB2YXIgaW5kZXg7XG4gICAgICBpZiAodXMgPT09IEJMQUNLKSB7XG4gICAgICAgIGluZGV4ID0gbW92ZS50byAtIDE2O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5kZXggPSBtb3ZlLnRvICsgMTY7XG4gICAgICB9XG4gICAgICBib2FyZFtpbmRleF0gPSB7dHlwZTogUEFXTiwgY29sb3I6IHRoZW19O1xuICAgIH1cblxuXG4gICAgaWYgKG1vdmUuZmxhZ3MgJiAoQklUUy5LU0lERV9DQVNUTEUgfCBCSVRTLlFTSURFX0NBU1RMRSkpIHtcbiAgICAgIHZhciBjYXN0bGluZ190bywgY2FzdGxpbmdfZnJvbTtcbiAgICAgIGlmIChtb3ZlLmZsYWdzICYgQklUUy5LU0lERV9DQVNUTEUpIHtcbiAgICAgICAgY2FzdGxpbmdfdG8gPSBtb3ZlLnRvICsgMTtcbiAgICAgICAgY2FzdGxpbmdfZnJvbSA9IG1vdmUudG8gLSAxO1xuICAgICAgfSBlbHNlIGlmIChtb3ZlLmZsYWdzICYgQklUUy5RU0lERV9DQVNUTEUpIHtcbiAgICAgICAgY2FzdGxpbmdfdG8gPSBtb3ZlLnRvIC0gMjtcbiAgICAgICAgY2FzdGxpbmdfZnJvbSA9IG1vdmUudG8gKyAxO1xuICAgICAgfVxuXG4gICAgICBib2FyZFtjYXN0bGluZ190b10gPSBib2FyZFtjYXN0bGluZ19mcm9tXTtcbiAgICAgIGJvYXJkW2Nhc3RsaW5nX2Zyb21dID0gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gbW92ZTtcbiAgfVxuXG4gIC8qIHRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byB1bmlxdWVseSBpZGVudGlmeSBhbWJpZ3VvdXMgbW92ZXMgKi9cbiAgZnVuY3Rpb24gZ2V0X2Rpc2FtYmlndWF0b3IobW92ZSwgc2xvcHB5KSB7XG4gICAgdmFyIG1vdmVzID0gZ2VuZXJhdGVfbW92ZXMoe2xlZ2FsOiAhc2xvcHB5fSk7XG5cbiAgICB2YXIgZnJvbSA9IG1vdmUuZnJvbTtcbiAgICB2YXIgdG8gPSBtb3ZlLnRvO1xuICAgIHZhciBwaWVjZSA9IG1vdmUucGllY2U7XG5cbiAgICB2YXIgYW1iaWd1aXRpZXMgPSAwO1xuICAgIHZhciBzYW1lX3JhbmsgPSAwO1xuICAgIHZhciBzYW1lX2ZpbGUgPSAwO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IG1vdmVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB2YXIgYW1iaWdfZnJvbSA9IG1vdmVzW2ldLmZyb207XG4gICAgICB2YXIgYW1iaWdfdG8gPSBtb3Zlc1tpXS50bztcbiAgICAgIHZhciBhbWJpZ19waWVjZSA9IG1vdmVzW2ldLnBpZWNlO1xuXG4gICAgICAvKiBpZiBhIG1vdmUgb2YgdGhlIHNhbWUgcGllY2UgdHlwZSBlbmRzIG9uIHRoZSBzYW1lIHRvIHNxdWFyZSwgd2UnbGxcbiAgICAgICAqIG5lZWQgdG8gYWRkIGEgZGlzYW1iaWd1YXRvciB0byB0aGUgYWxnZWJyYWljIG5vdGF0aW9uXG4gICAgICAgKi9cbiAgICAgIGlmIChwaWVjZSA9PT0gYW1iaWdfcGllY2UgJiYgZnJvbSAhPT0gYW1iaWdfZnJvbSAmJiB0byA9PT0gYW1iaWdfdG8pIHtcbiAgICAgICAgYW1iaWd1aXRpZXMrKztcblxuICAgICAgICBpZiAocmFuayhmcm9tKSA9PT0gcmFuayhhbWJpZ19mcm9tKSkge1xuICAgICAgICAgIHNhbWVfcmFuaysrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZpbGUoZnJvbSkgPT09IGZpbGUoYW1iaWdfZnJvbSkpIHtcbiAgICAgICAgICBzYW1lX2ZpbGUrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChhbWJpZ3VpdGllcyA+IDApIHtcbiAgICAgIC8qIGlmIHRoZXJlIGV4aXN0cyBhIHNpbWlsYXIgbW92aW5nIHBpZWNlIG9uIHRoZSBzYW1lIHJhbmsgYW5kIGZpbGUgYXNcbiAgICAgICAqIHRoZSBtb3ZlIGluIHF1ZXN0aW9uLCB1c2UgdGhlIHNxdWFyZSBhcyB0aGUgZGlzYW1iaWd1YXRvclxuICAgICAgICovXG4gICAgICBpZiAoc2FtZV9yYW5rID4gMCAmJiBzYW1lX2ZpbGUgPiAwKSB7XG4gICAgICAgIHJldHVybiBhbGdlYnJhaWMoZnJvbSk7XG4gICAgICB9XG4gICAgICAvKiBpZiB0aGUgbW92aW5nIHBpZWNlIHJlc3RzIG9uIHRoZSBzYW1lIGZpbGUsIHVzZSB0aGUgcmFuayBzeW1ib2wgYXMgdGhlXG4gICAgICAgKiBkaXNhbWJpZ3VhdG9yXG4gICAgICAgKi9cbiAgICAgIGVsc2UgaWYgKHNhbWVfZmlsZSA+IDApIHtcbiAgICAgICAgcmV0dXJuIGFsZ2VicmFpYyhmcm9tKS5jaGFyQXQoMSk7XG4gICAgICB9XG4gICAgICAvKiBlbHNlIHVzZSB0aGUgZmlsZSBzeW1ib2wgKi9cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gYWxnZWJyYWljKGZyb20pLmNoYXJBdCgwKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICBmdW5jdGlvbiBhc2NpaSgpIHtcbiAgICB2YXIgcyA9ICcgICArLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xcbic7XG4gICAgZm9yICh2YXIgaSA9IFNRVUFSRVMuYTg7IGkgPD0gU1FVQVJFUy5oMTsgaSsrKSB7XG4gICAgICAvKiBkaXNwbGF5IHRoZSByYW5rICovXG4gICAgICBpZiAoZmlsZShpKSA9PT0gMCkge1xuICAgICAgICBzICs9ICcgJyArICc4NzY1NDMyMSdbcmFuayhpKV0gKyAnIHwnO1xuICAgICAgfVxuXG4gICAgICAvKiBlbXB0eSBwaWVjZSAqL1xuICAgICAgaWYgKGJvYXJkW2ldID09IG51bGwpIHtcbiAgICAgICAgcyArPSAnIC4gJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBwaWVjZSA9IGJvYXJkW2ldLnR5cGU7XG4gICAgICAgIHZhciBjb2xvciA9IGJvYXJkW2ldLmNvbG9yO1xuICAgICAgICB2YXIgc3ltYm9sID0gKGNvbG9yID09PSBXSElURSkgP1xuICAgICAgICAgICAgICAgICAgICAgcGllY2UudG9VcHBlckNhc2UoKSA6IHBpZWNlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIHMgKz0gJyAnICsgc3ltYm9sICsgJyAnO1xuICAgICAgfVxuXG4gICAgICBpZiAoKGkgKyAxKSAmIDB4ODgpIHtcbiAgICAgICAgcyArPSAnfFxcbic7XG4gICAgICAgIGkgKz0gODtcbiAgICAgIH1cbiAgICB9XG4gICAgcyArPSAnICAgKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcXG4nO1xuICAgIHMgKz0gJyAgICAgYSAgYiAgYyAgZCAgZSAgZiAgZyAgaFxcbic7XG5cbiAgICByZXR1cm4gcztcbiAgfVxuXG4gIC8vIGNvbnZlcnQgYSBtb3ZlIGZyb20gU3RhbmRhcmQgQWxnZWJyYWljIE5vdGF0aW9uIChTQU4pIHRvIDB4ODggY29vcmRpbmF0ZXNcbiAgZnVuY3Rpb24gbW92ZV9mcm9tX3Nhbihtb3ZlLCBzbG9wcHkpIHtcbiAgICAvLyBzdHJpcCBvZmYgYW55IG1vdmUgZGVjb3JhdGlvbnM6IGUuZyBOZjMrPyFcbiAgICB2YXIgY2xlYW5fbW92ZSA9IHN0cmlwcGVkX3Nhbihtb3ZlKTtcblxuICAgIC8vIGlmIHdlJ3JlIHVzaW5nIHRoZSBzbG9wcHkgcGFyc2VyIHJ1biBhIHJlZ2V4IHRvIGdyYWIgcGllY2UsIHRvLCBhbmQgZnJvbVxuICAgIC8vIHRoaXMgc2hvdWxkIHBhcnNlIGludmFsaWQgU0FOIGxpa2U6IFBlMi1lNCwgUmMxYzQsIFFmM3hmN1xuICAgIGlmIChzbG9wcHkpIHtcbiAgICAgIHZhciBtYXRjaGVzID0gY2xlYW5fbW92ZS5tYXRjaCgvKFtwbmJycWtQTkJSUUtdKT8oW2EtaF1bMS04XSl4Py0/KFthLWhdWzEtOF0pKFtxcmJuUVJCTl0pPy8pO1xuICAgICAgaWYgKG1hdGNoZXMpIHtcbiAgICAgICAgdmFyIHBpZWNlID0gbWF0Y2hlc1sxXTtcbiAgICAgICAgdmFyIGZyb20gPSBtYXRjaGVzWzJdO1xuICAgICAgICB2YXIgdG8gPSBtYXRjaGVzWzNdO1xuICAgICAgICB2YXIgcHJvbW90aW9uID0gbWF0Y2hlc1s0XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbW92ZXMgPSBnZW5lcmF0ZV9tb3ZlcygpO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBtb3Zlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgLy8gdHJ5IHRoZSBzdHJpY3QgcGFyc2VyIGZpcnN0LCB0aGVuIHRoZSBzbG9wcHkgcGFyc2VyIGlmIHJlcXVlc3RlZFxuICAgICAgLy8gYnkgdGhlIHVzZXJcbiAgICAgIGlmICgoY2xlYW5fbW92ZSA9PT0gc3RyaXBwZWRfc2FuKG1vdmVfdG9fc2FuKG1vdmVzW2ldKSkpIHx8XG4gICAgICAgICAgKHNsb3BweSAmJiBjbGVhbl9tb3ZlID09PSBzdHJpcHBlZF9zYW4obW92ZV90b19zYW4obW92ZXNbaV0sIHRydWUpKSkpIHtcbiAgICAgICAgcmV0dXJuIG1vdmVzW2ldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKG1hdGNoZXMgJiZcbiAgICAgICAgICAgICghcGllY2UgfHwgcGllY2UudG9Mb3dlckNhc2UoKSA9PSBtb3Zlc1tpXS5waWVjZSkgJiZcbiAgICAgICAgICAgIFNRVUFSRVNbZnJvbV0gPT0gbW92ZXNbaV0uZnJvbSAmJlxuICAgICAgICAgICAgU1FVQVJFU1t0b10gPT0gbW92ZXNbaV0udG8gJiZcbiAgICAgICAgICAgICghcHJvbW90aW9uIHx8IHByb21vdGlvbi50b0xvd2VyQ2FzZSgpID09IG1vdmVzW2ldLnByb21vdGlvbikpIHtcbiAgICAgICAgICByZXR1cm4gbW92ZXNbaV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG5cbiAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqIFVUSUxJVFkgRlVOQ1RJT05TXG4gICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICBmdW5jdGlvbiByYW5rKGkpIHtcbiAgICByZXR1cm4gaSA+PiA0O1xuICB9XG5cbiAgZnVuY3Rpb24gZmlsZShpKSB7XG4gICAgcmV0dXJuIGkgJiAxNTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFsZ2VicmFpYyhpKXtcbiAgICB2YXIgZiA9IGZpbGUoaSksIHIgPSByYW5rKGkpO1xuICAgIHJldHVybiAnYWJjZGVmZ2gnLnN1YnN0cmluZyhmLGYrMSkgKyAnODc2NTQzMjEnLnN1YnN0cmluZyhyLHIrMSk7XG4gIH1cblxuICBmdW5jdGlvbiBzd2FwX2NvbG9yKGMpIHtcbiAgICByZXR1cm4gYyA9PT0gV0hJVEUgPyBCTEFDSyA6IFdISVRFO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNfZGlnaXQoYykge1xuICAgIHJldHVybiAnMDEyMzQ1Njc4OScuaW5kZXhPZihjKSAhPT0gLTE7XG4gIH1cblxuICAvKiBwcmV0dHkgPSBleHRlcm5hbCBtb3ZlIG9iamVjdCAqL1xuICBmdW5jdGlvbiBtYWtlX3ByZXR0eSh1Z2x5X21vdmUpIHtcbiAgICB2YXIgbW92ZSA9IGNsb25lKHVnbHlfbW92ZSk7XG4gICAgbW92ZS5zYW4gPSBtb3ZlX3RvX3Nhbihtb3ZlLCBmYWxzZSk7XG4gICAgbW92ZS50byA9IGFsZ2VicmFpYyhtb3ZlLnRvKTtcbiAgICBtb3ZlLmZyb20gPSBhbGdlYnJhaWMobW92ZS5mcm9tKTtcblxuICAgIHZhciBmbGFncyA9ICcnO1xuXG4gICAgZm9yICh2YXIgZmxhZyBpbiBCSVRTKSB7XG4gICAgICBpZiAoQklUU1tmbGFnXSAmIG1vdmUuZmxhZ3MpIHtcbiAgICAgICAgZmxhZ3MgKz0gRkxBR1NbZmxhZ107XG4gICAgICB9XG4gICAgfVxuICAgIG1vdmUuZmxhZ3MgPSBmbGFncztcblxuICAgIHJldHVybiBtb3ZlO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xvbmUob2JqKSB7XG4gICAgdmFyIGR1cGUgPSAob2JqIGluc3RhbmNlb2YgQXJyYXkpID8gW10gOiB7fTtcblxuICAgIGZvciAodmFyIHByb3BlcnR5IGluIG9iaikge1xuICAgICAgaWYgKHR5cGVvZiBwcm9wZXJ0eSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgZHVwZVtwcm9wZXJ0eV0gPSBjbG9uZShvYmpbcHJvcGVydHldKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGR1cGVbcHJvcGVydHldID0gb2JqW3Byb3BlcnR5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZHVwZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRyaW0oc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XG4gIH1cblxuICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICogREVCVUdHSU5HIFVUSUxJVElFU1xuICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgZnVuY3Rpb24gcGVyZnQoZGVwdGgpIHtcbiAgICB2YXIgbW92ZXMgPSBnZW5lcmF0ZV9tb3Zlcyh7bGVnYWw6IGZhbHNlfSk7XG4gICAgdmFyIG5vZGVzID0gMDtcbiAgICB2YXIgY29sb3IgPSB0dXJuO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IG1vdmVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBtYWtlX21vdmUobW92ZXNbaV0pO1xuICAgICAgaWYgKCFraW5nX2F0dGFja2VkKGNvbG9yKSkge1xuICAgICAgICBpZiAoZGVwdGggLSAxID4gMCkge1xuICAgICAgICAgIHZhciBjaGlsZF9ub2RlcyA9IHBlcmZ0KGRlcHRoIC0gMSk7XG4gICAgICAgICAgbm9kZXMgKz0gY2hpbGRfbm9kZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbm9kZXMrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdW5kb19tb3ZlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vZGVzO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICogUFVCTElDIENPTlNUQU5UUyAoaXMgdGhlcmUgYSBiZXR0ZXIgd2F5IHRvIGRvIHRoaXM/KVxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICBXSElURTogV0hJVEUsXG4gICAgQkxBQ0s6IEJMQUNLLFxuICAgIFBBV046IFBBV04sXG4gICAgS05JR0hUOiBLTklHSFQsXG4gICAgQklTSE9QOiBCSVNIT1AsXG4gICAgUk9PSzogUk9PSyxcbiAgICBRVUVFTjogUVVFRU4sXG4gICAgS0lORzogS0lORyxcbiAgICBTUVVBUkVTOiAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgLyogZnJvbSB0aGUgRUNNQS0yNjIgc3BlYyAoc2VjdGlvbiAxMi42LjQpOlxuICAgICAgICAgICAgICAgICAqIFwiVGhlIG1lY2hhbmljcyBvZiBlbnVtZXJhdGluZyB0aGUgcHJvcGVydGllcyAuLi4gaXNcbiAgICAgICAgICAgICAgICAgKiBpbXBsZW1lbnRhdGlvbiBkZXBlbmRlbnRcIlxuICAgICAgICAgICAgICAgICAqIHNvOiBmb3IgKHZhciBzcSBpbiBTUVVBUkVTKSB7IGtleXMucHVzaChzcSk7IH0gbWlnaHQgbm90IGJlXG4gICAgICAgICAgICAgICAgICogb3JkZXJlZCBjb3JyZWN0bHlcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB2YXIga2V5cyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSBTUVVBUkVTLmE4OyBpIDw9IFNRVUFSRVMuaDE7IGkrKykge1xuICAgICAgICAgICAgICAgICAgaWYgKGkgJiAweDg4KSB7IGkgKz0gNzsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgIGtleXMucHVzaChhbGdlYnJhaWMoaSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4ga2V5cztcbiAgICAgICAgICAgICAgfSkoKSxcbiAgICBGTEFHUzogRkxBR1MsXG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICogUFVCTElDIEFQSVxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICBsb2FkOiBmdW5jdGlvbihmZW4pIHtcbiAgICAgIHJldHVybiBsb2FkKGZlbik7XG4gICAgfSxcblxuICAgIHJlc2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiByZXNldCgpO1xuICAgIH0sXG5cbiAgICBtb3ZlczogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgLyogVGhlIGludGVybmFsIHJlcHJlc2VudGF0aW9uIG9mIGEgY2hlc3MgbW92ZSBpcyBpbiAweDg4IGZvcm1hdCwgYW5kXG4gICAgICAgKiBub3QgbWVhbnQgdG8gYmUgaHVtYW4tcmVhZGFibGUuICBUaGUgY29kZSBiZWxvdyBjb252ZXJ0cyB0aGUgMHg4OFxuICAgICAgICogc3F1YXJlIGNvb3JkaW5hdGVzIHRvIGFsZ2VicmFpYyBjb29yZGluYXRlcy4gIEl0IGFsc28gcHJ1bmVzIGFuXG4gICAgICAgKiB1bm5lY2Vzc2FyeSBtb3ZlIGtleXMgcmVzdWx0aW5nIGZyb20gYSB2ZXJib3NlIGNhbGwuXG4gICAgICAgKi9cblxuICAgICAgdmFyIHVnbHlfbW92ZXMgPSBnZW5lcmF0ZV9tb3ZlcyhvcHRpb25zKTtcbiAgICAgIHZhciBtb3ZlcyA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdWdseV9tb3Zlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXG4gICAgICAgIC8qIGRvZXMgdGhlIHVzZXIgd2FudCBhIGZ1bGwgbW92ZSBvYmplY3QgKG1vc3QgbGlrZWx5IG5vdCksIG9yIGp1c3RcbiAgICAgICAgICogU0FOXG4gICAgICAgICAqL1xuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgIT09ICd1bmRlZmluZWQnICYmICd2ZXJib3NlJyBpbiBvcHRpb25zICYmXG4gICAgICAgICAgICBvcHRpb25zLnZlcmJvc2UpIHtcbiAgICAgICAgICBtb3Zlcy5wdXNoKG1ha2VfcHJldHR5KHVnbHlfbW92ZXNbaV0pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtb3Zlcy5wdXNoKG1vdmVfdG9fc2FuKHVnbHlfbW92ZXNbaV0sIGZhbHNlKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG1vdmVzO1xuICAgIH0sXG5cbiAgICBpbl9jaGVjazogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gaW5fY2hlY2soKTtcbiAgICB9LFxuXG4gICAgaW5fY2hlY2ttYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBpbl9jaGVja21hdGUoKTtcbiAgICB9LFxuXG4gICAgaW5fc3RhbGVtYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBpbl9zdGFsZW1hdGUoKTtcbiAgICB9LFxuXG4gICAgaW5fZHJhdzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gaGFsZl9tb3ZlcyA+PSAxMDAgfHxcbiAgICAgICAgICAgICBpbl9zdGFsZW1hdGUoKSB8fFxuICAgICAgICAgICAgIGluc3VmZmljaWVudF9tYXRlcmlhbCgpIHx8XG4gICAgICAgICAgICAgaW5fdGhyZWVmb2xkX3JlcGV0aXRpb24oKTtcbiAgICB9LFxuXG4gICAgaW5zdWZmaWNpZW50X21hdGVyaWFsOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBpbnN1ZmZpY2llbnRfbWF0ZXJpYWwoKTtcbiAgICB9LFxuXG4gICAgaW5fdGhyZWVmb2xkX3JlcGV0aXRpb246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGluX3RocmVlZm9sZF9yZXBldGl0aW9uKCk7XG4gICAgfSxcblxuICAgIGdhbWVfb3ZlcjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gaGFsZl9tb3ZlcyA+PSAxMDAgfHxcbiAgICAgICAgICAgICBpbl9jaGVja21hdGUoKSB8fFxuICAgICAgICAgICAgIGluX3N0YWxlbWF0ZSgpIHx8XG4gICAgICAgICAgICAgaW5zdWZmaWNpZW50X21hdGVyaWFsKCkgfHxcbiAgICAgICAgICAgICBpbl90aHJlZWZvbGRfcmVwZXRpdGlvbigpO1xuICAgIH0sXG5cbiAgICB2YWxpZGF0ZV9mZW46IGZ1bmN0aW9uKGZlbikge1xuICAgICAgcmV0dXJuIHZhbGlkYXRlX2ZlbihmZW4pO1xuICAgIH0sXG5cbiAgICBmZW46IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGdlbmVyYXRlX2ZlbigpO1xuICAgIH0sXG5cbiAgICBwZ246IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIC8qIHVzaW5nIHRoZSBzcGVjaWZpY2F0aW9uIGZyb20gaHR0cDovL3d3dy5jaGVzc2NsdWIuY29tL2hlbHAvUEdOLXNwZWNcbiAgICAgICAqIGV4YW1wbGUgZm9yIGh0bWwgdXNhZ2U6IC5wZ24oeyBtYXhfd2lkdGg6IDcyLCBuZXdsaW5lX2NoYXI6IFwiPGJyIC8+XCIgfSlcbiAgICAgICAqL1xuICAgICAgdmFyIG5ld2xpbmUgPSAodHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgICAgICAgICAgICB0eXBlb2Ygb3B0aW9ucy5uZXdsaW5lX2NoYXIgPT09ICdzdHJpbmcnKSA/XG4gICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm5ld2xpbmVfY2hhciA6ICdcXG4nO1xuICAgICAgdmFyIG1heF93aWR0aCA9ICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIG9wdGlvbnMubWF4X3dpZHRoID09PSAnbnVtYmVyJykgP1xuICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm1heF93aWR0aCA6IDA7XG4gICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICB2YXIgaGVhZGVyX2V4aXN0cyA9IGZhbHNlO1xuXG4gICAgICAvKiBhZGQgdGhlIFBHTiBoZWFkZXIgaGVhZGVycm1hdGlvbiAqL1xuICAgICAgZm9yICh2YXIgaSBpbiBoZWFkZXIpIHtcbiAgICAgICAgLyogVE9ETzogb3JkZXIgb2YgZW51bWVyYXRlZCBwcm9wZXJ0aWVzIGluIGhlYWRlciBvYmplY3QgaXMgbm90XG4gICAgICAgICAqIGd1YXJhbnRlZWQsIHNlZSBFQ01BLTI2MiBzcGVjIChzZWN0aW9uIDEyLjYuNClcbiAgICAgICAgICovXG4gICAgICAgIHJlc3VsdC5wdXNoKCdbJyArIGkgKyAnIFxcXCInICsgaGVhZGVyW2ldICsgJ1xcXCJdJyArIG5ld2xpbmUpO1xuICAgICAgICBoZWFkZXJfZXhpc3RzID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGhlYWRlcl9leGlzdHMgJiYgaGlzdG9yeS5sZW5ndGgpIHtcbiAgICAgICAgcmVzdWx0LnB1c2gobmV3bGluZSk7XG4gICAgICB9XG5cbiAgICAgIC8qIHBvcCBhbGwgb2YgaGlzdG9yeSBvbnRvIHJldmVyc2VkX2hpc3RvcnkgKi9cbiAgICAgIHZhciByZXZlcnNlZF9oaXN0b3J5ID0gW107XG4gICAgICB3aGlsZSAoaGlzdG9yeS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldmVyc2VkX2hpc3RvcnkucHVzaCh1bmRvX21vdmUoKSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBtb3ZlcyA9IFtdO1xuICAgICAgdmFyIG1vdmVfc3RyaW5nID0gJyc7XG5cbiAgICAgIC8qIGJ1aWxkIHRoZSBsaXN0IG9mIG1vdmVzLiAgYSBtb3ZlX3N0cmluZyBsb29rcyBsaWtlOiBcIjMuIGUzIGU2XCIgKi9cbiAgICAgIHdoaWxlIChyZXZlcnNlZF9oaXN0b3J5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIG1vdmUgPSByZXZlcnNlZF9oaXN0b3J5LnBvcCgpO1xuXG4gICAgICAgIC8qIGlmIHRoZSBwb3NpdGlvbiBzdGFydGVkIHdpdGggYmxhY2sgdG8gbW92ZSwgc3RhcnQgUEdOIHdpdGggMS4gLi4uICovXG4gICAgICAgIGlmICghaGlzdG9yeS5sZW5ndGggJiYgbW92ZS5jb2xvciA9PT0gJ2InKSB7XG4gICAgICAgICAgbW92ZV9zdHJpbmcgPSBtb3ZlX251bWJlciArICcuIC4uLic7XG4gICAgICAgIH0gZWxzZSBpZiAobW92ZS5jb2xvciA9PT0gJ3cnKSB7XG4gICAgICAgICAgLyogc3RvcmUgdGhlIHByZXZpb3VzIGdlbmVyYXRlZCBtb3ZlX3N0cmluZyBpZiB3ZSBoYXZlIG9uZSAqL1xuICAgICAgICAgIGlmIChtb3ZlX3N0cmluZy5sZW5ndGgpIHtcbiAgICAgICAgICAgIG1vdmVzLnB1c2gobW92ZV9zdHJpbmcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtb3ZlX3N0cmluZyA9IG1vdmVfbnVtYmVyICsgJy4nO1xuICAgICAgICB9XG5cbiAgICAgICAgbW92ZV9zdHJpbmcgPSBtb3ZlX3N0cmluZyArICcgJyArIG1vdmVfdG9fc2FuKG1vdmUsIGZhbHNlKTtcbiAgICAgICAgbWFrZV9tb3ZlKG1vdmUpO1xuICAgICAgfVxuXG4gICAgICAvKiBhcmUgdGhlcmUgYW55IG90aGVyIGxlZnRvdmVyIG1vdmVzPyAqL1xuICAgICAgaWYgKG1vdmVfc3RyaW5nLmxlbmd0aCkge1xuICAgICAgICBtb3Zlcy5wdXNoKG1vdmVfc3RyaW5nKTtcbiAgICAgIH1cblxuICAgICAgLyogaXMgdGhlcmUgYSByZXN1bHQ/ICovXG4gICAgICBpZiAodHlwZW9mIGhlYWRlci5SZXN1bHQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG1vdmVzLnB1c2goaGVhZGVyLlJlc3VsdCk7XG4gICAgICB9XG5cbiAgICAgIC8qIGhpc3Rvcnkgc2hvdWxkIGJlIGJhY2sgdG8gd2hhdCBpcyB3YXMgYmVmb3JlIHdlIHN0YXJ0ZWQgZ2VuZXJhdGluZyBQR04sXG4gICAgICAgKiBzbyBqb2luIHRvZ2V0aGVyIG1vdmVzXG4gICAgICAgKi9cbiAgICAgIGlmIChtYXhfd2lkdGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5qb2luKCcnKSArIG1vdmVzLmpvaW4oJyAnKTtcbiAgICAgIH1cblxuICAgICAgLyogd3JhcCB0aGUgUEdOIG91dHB1dCBhdCBtYXhfd2lkdGggKi9cbiAgICAgIHZhciBjdXJyZW50X3dpZHRoID0gMDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbW92ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLyogaWYgdGhlIGN1cnJlbnQgbW92ZSB3aWxsIHB1c2ggcGFzdCBtYXhfd2lkdGggKi9cbiAgICAgICAgaWYgKGN1cnJlbnRfd2lkdGggKyBtb3Zlc1tpXS5sZW5ndGggPiBtYXhfd2lkdGggJiYgaSAhPT0gMCkge1xuXG4gICAgICAgICAgLyogZG9uJ3QgZW5kIHRoZSBsaW5lIHdpdGggd2hpdGVzcGFjZSAqL1xuICAgICAgICAgIGlmIChyZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdID09PSAnICcpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wb3AoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXN1bHQucHVzaChuZXdsaW5lKTtcbiAgICAgICAgICBjdXJyZW50X3dpZHRoID0gMDtcbiAgICAgICAgfSBlbHNlIGlmIChpICE9PSAwKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2goJyAnKTtcbiAgICAgICAgICBjdXJyZW50X3dpZHRoKys7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0LnB1c2gobW92ZXNbaV0pO1xuICAgICAgICBjdXJyZW50X3dpZHRoICs9IG1vdmVzW2ldLmxlbmd0aDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdC5qb2luKCcnKTtcbiAgICB9LFxuXG4gICAgbG9hZF9wZ246IGZ1bmN0aW9uKHBnbiwgb3B0aW9ucykge1xuICAgICAgLy8gYWxsb3cgdGhlIHVzZXIgdG8gc3BlY2lmeSB0aGUgc2xvcHB5IG1vdmUgcGFyc2VyIHRvIHdvcmsgYXJvdW5kIG92ZXJcbiAgICAgIC8vIGRpc2FtYmlndWF0aW9uIGJ1Z3MgaW4gRnJpdHogYW5kIENoZXNzYmFzZVxuICAgICAgdmFyIHNsb3BweSA9ICh0eXBlb2Ygb3B0aW9ucyAhPT0gJ3VuZGVmaW5lZCcgJiYgJ3Nsb3BweScgaW4gb3B0aW9ucykgP1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnNsb3BweSA6IGZhbHNlO1xuXG4gICAgICBmdW5jdGlvbiBtYXNrKHN0cikge1xuICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFwnKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaGFzX2tleXMob2JqZWN0KSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHBhcnNlX3Bnbl9oZWFkZXIoaGVhZGVyLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBuZXdsaW5lX2NoYXIgPSAodHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIG9wdGlvbnMubmV3bGluZV9jaGFyID09PSAnc3RyaW5nJykgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMubmV3bGluZV9jaGFyIDogJ1xccj9cXG4nO1xuICAgICAgICB2YXIgaGVhZGVyX29iaiA9IHt9O1xuICAgICAgICB2YXIgaGVhZGVycyA9IGhlYWRlci5zcGxpdChuZXcgUmVnRXhwKG1hc2sobmV3bGluZV9jaGFyKSkpO1xuICAgICAgICB2YXIga2V5ID0gJyc7XG4gICAgICAgIHZhciB2YWx1ZSA9ICcnO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaGVhZGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGtleSA9IGhlYWRlcnNbaV0ucmVwbGFjZSgvXlxcWyhbQS1aXVtBLVphLXpdKilcXHMuKlxcXSQvLCAnJDEnKTtcbiAgICAgICAgICB2YWx1ZSA9IGhlYWRlcnNbaV0ucmVwbGFjZSgvXlxcW1tBLVphLXpdK1xcc1wiKC4qKVwiXFxdJC8sICckMScpO1xuICAgICAgICAgIGlmICh0cmltKGtleSkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaGVhZGVyX29ialtrZXldID0gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGhlYWRlcl9vYmo7XG4gICAgICB9XG5cbiAgICAgIHZhciBuZXdsaW5lX2NoYXIgPSAodHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBvcHRpb25zLm5ld2xpbmVfY2hhciA9PT0gJ3N0cmluZycpID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5uZXdsaW5lX2NoYXIgOiAnXFxyP1xcbic7XG4gICAgICB2YXIgcmVnZXggPSBuZXcgUmVnRXhwKCdeKFxcXFxbKC58JyArIG1hc2sobmV3bGluZV9jaGFyKSArICcpKlxcXFxdKScgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnKCcgKyBtYXNrKG5ld2xpbmVfY2hhcikgKyAnKSonICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzEuKCcgKyBtYXNrKG5ld2xpbmVfY2hhcikgKyAnfC4pKiQnLCAnZycpO1xuXG4gICAgICAvKiBnZXQgaGVhZGVyIHBhcnQgb2YgdGhlIFBHTiBmaWxlICovXG4gICAgICB2YXIgaGVhZGVyX3N0cmluZyA9IHBnbi5yZXBsYWNlKHJlZ2V4LCAnJDEnKTtcblxuICAgICAgLyogbm8gaW5mbyBwYXJ0IGdpdmVuLCBiZWdpbnMgd2l0aCBtb3ZlcyAqL1xuICAgICAgaWYgKGhlYWRlcl9zdHJpbmdbMF0gIT09ICdbJykge1xuICAgICAgICBoZWFkZXJfc3RyaW5nID0gJyc7XG4gICAgICB9XG5cbiAgICAgIHJlc2V0KCk7XG5cbiAgICAgIC8qIHBhcnNlIFBHTiBoZWFkZXIgKi9cbiAgICAgIHZhciBoZWFkZXJzID0gcGFyc2VfcGduX2hlYWRlcihoZWFkZXJfc3RyaW5nLCBvcHRpb25zKTtcbiAgICAgIGZvciAodmFyIGtleSBpbiBoZWFkZXJzKSB7XG4gICAgICAgIHNldF9oZWFkZXIoW2tleSwgaGVhZGVyc1trZXldXSk7XG4gICAgICB9XG5cbiAgICAgIC8qIGxvYWQgdGhlIHN0YXJ0aW5nIHBvc2l0aW9uIGluZGljYXRlZCBieSBbU2V0dXAgJzEnXSBhbmRcbiAgICAgICogW0ZFTiBwb3NpdGlvbl0gKi9cbiAgICAgIGlmIChoZWFkZXJzWydTZXRVcCddID09PSAnMScpIHtcbiAgICAgICAgICBpZiAoISgoJ0ZFTicgaW4gaGVhZGVycykgJiYgbG9hZChoZWFkZXJzWydGRU4nXSkpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvKiBkZWxldGUgaGVhZGVyIHRvIGdldCB0aGUgbW92ZXMgKi9cbiAgICAgIHZhciBtcyA9IHBnbi5yZXBsYWNlKGhlYWRlcl9zdHJpbmcsICcnKS5yZXBsYWNlKG5ldyBSZWdFeHAobWFzayhuZXdsaW5lX2NoYXIpLCAnZycpLCAnICcpO1xuXG4gICAgICAvKiBkZWxldGUgY29tbWVudHMgKi9cbiAgICAgIG1zID0gbXMucmVwbGFjZSgvKFxce1tefV0rXFx9KSs/L2csICcnKTtcblxuICAgICAgLyogZGVsZXRlIHJlY3Vyc2l2ZSBhbm5vdGF0aW9uIHZhcmlhdGlvbnMgKi9cbiAgICAgIHZhciByYXZfcmVnZXggPSAvKFxcKFteXFwoXFwpXStcXCkpKz8vZ1xuICAgICAgd2hpbGUgKHJhdl9yZWdleC50ZXN0KG1zKSkge1xuICAgICAgICBtcyA9IG1zLnJlcGxhY2UocmF2X3JlZ2V4LCAnJyk7XG4gICAgICB9XG5cbiAgICAgIC8qIGRlbGV0ZSBtb3ZlIG51bWJlcnMgKi9cbiAgICAgIG1zID0gbXMucmVwbGFjZSgvXFxkK1xcLihcXC5cXC4pPy9nLCAnJyk7XG5cbiAgICAgIC8qIGRlbGV0ZSAuLi4gaW5kaWNhdGluZyBibGFjayB0byBtb3ZlICovXG4gICAgICBtcyA9IG1zLnJlcGxhY2UoL1xcLlxcLlxcLi9nLCAnJyk7XG5cbiAgICAgIC8qIGRlbGV0ZSBudW1lcmljIGFubm90YXRpb24gZ2x5cGhzICovXG4gICAgICBtcyA9IG1zLnJlcGxhY2UoL1xcJFxcZCsvZywgJycpO1xuXG4gICAgICAvKiB0cmltIGFuZCBnZXQgYXJyYXkgb2YgbW92ZXMgKi9cbiAgICAgIHZhciBtb3ZlcyA9IHRyaW0obXMpLnNwbGl0KG5ldyBSZWdFeHAoL1xccysvKSk7XG5cbiAgICAgIC8qIGRlbGV0ZSBlbXB0eSBlbnRyaWVzICovXG4gICAgICBtb3ZlcyA9IG1vdmVzLmpvaW4oJywnKS5yZXBsYWNlKC8sLCsvZywgJywnKS5zcGxpdCgnLCcpO1xuICAgICAgdmFyIG1vdmUgPSAnJztcblxuICAgICAgZm9yICh2YXIgaGFsZl9tb3ZlID0gMDsgaGFsZl9tb3ZlIDwgbW92ZXMubGVuZ3RoIC0gMTsgaGFsZl9tb3ZlKyspIHtcbiAgICAgICAgbW92ZSA9IG1vdmVfZnJvbV9zYW4obW92ZXNbaGFsZl9tb3ZlXSwgc2xvcHB5KTtcblxuICAgICAgICAvKiBtb3ZlIG5vdCBwb3NzaWJsZSEgKGRvbid0IGNsZWFyIHRoZSBib2FyZCB0byBleGFtaW5lIHRvIHNob3cgdGhlXG4gICAgICAgICAqIGxhdGVzdCB2YWxpZCBwb3NpdGlvbilcbiAgICAgICAgICovXG4gICAgICAgIGlmIChtb3ZlID09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWFrZV9tb3ZlKG1vdmUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8qIGV4YW1pbmUgbGFzdCBtb3ZlICovXG4gICAgICBtb3ZlID0gbW92ZXNbbW92ZXMubGVuZ3RoIC0gMV07XG4gICAgICBpZiAoUE9TU0lCTEVfUkVTVUxUUy5pbmRleE9mKG1vdmUpID4gLTEpIHtcbiAgICAgICAgaWYgKGhhc19rZXlzKGhlYWRlcikgJiYgdHlwZW9mIGhlYWRlci5SZXN1bHQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgc2V0X2hlYWRlcihbJ1Jlc3VsdCcsIG1vdmVdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIG1vdmUgPSBtb3ZlX2Zyb21fc2FuKG1vdmUsIHNsb3BweSk7XG4gICAgICAgIGlmIChtb3ZlID09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWFrZV9tb3ZlKG1vdmUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgaGVhZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBzZXRfaGVhZGVyKGFyZ3VtZW50cyk7XG4gICAgfSxcblxuICAgIGFzY2lpOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBhc2NpaSgpO1xuICAgIH0sXG5cbiAgICB0dXJuOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0dXJuO1xuICAgIH0sXG5cbiAgICBtb3ZlOiBmdW5jdGlvbihtb3ZlLCBvcHRpb25zKSB7XG4gICAgICAvKiBUaGUgbW92ZSBmdW5jdGlvbiBjYW4gYmUgY2FsbGVkIHdpdGggaW4gdGhlIGZvbGxvd2luZyBwYXJhbWV0ZXJzOlxuICAgICAgICpcbiAgICAgICAqIC5tb3ZlKCdOeGI3JykgICAgICA8LSB3aGVyZSAnbW92ZScgaXMgYSBjYXNlLXNlbnNpdGl2ZSBTQU4gc3RyaW5nXG4gICAgICAgKlxuICAgICAgICogLm1vdmUoeyBmcm9tOiAnaDcnLCA8LSB3aGVyZSB0aGUgJ21vdmUnIGlzIGEgbW92ZSBvYmplY3QgKGFkZGl0aW9uYWxcbiAgICAgICAqICAgICAgICAgdG8gOidoOCcsICAgICAgZmllbGRzIGFyZSBpZ25vcmVkKVxuICAgICAgICogICAgICAgICBwcm9tb3Rpb246ICdxJyxcbiAgICAgICAqICAgICAgfSlcbiAgICAgICAqL1xuXG4gICAgICAvLyBhbGxvdyB0aGUgdXNlciB0byBzcGVjaWZ5IHRoZSBzbG9wcHkgbW92ZSBwYXJzZXIgdG8gd29yayBhcm91bmQgb3ZlclxuICAgICAgLy8gZGlzYW1iaWd1YXRpb24gYnVncyBpbiBGcml0eiBhbmQgQ2hlc3NiYXNlXG4gICAgICB2YXIgc2xvcHB5ID0gKHR5cGVvZiBvcHRpb25zICE9PSAndW5kZWZpbmVkJyAmJiAnc2xvcHB5JyBpbiBvcHRpb25zKSA/XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2xvcHB5IDogZmFsc2U7XG5cbiAgICAgIHZhciBtb3ZlX29iaiA9IG51bGw7XG5cbiAgICAgIGlmICh0eXBlb2YgbW92ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgbW92ZV9vYmogPSBtb3ZlX2Zyb21fc2FuKG1vdmUsIHNsb3BweSk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb3ZlID09PSAnb2JqZWN0Jykge1xuICAgICAgICB2YXIgbW92ZXMgPSBnZW5lcmF0ZV9tb3ZlcygpO1xuXG4gICAgICAgIC8qIGNvbnZlcnQgdGhlIHByZXR0eSBtb3ZlIG9iamVjdCB0byBhbiB1Z2x5IG1vdmUgb2JqZWN0ICovXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBtb3Zlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIGlmIChtb3ZlLmZyb20gPT09IGFsZ2VicmFpYyhtb3Zlc1tpXS5mcm9tKSAmJlxuICAgICAgICAgICAgICBtb3ZlLnRvID09PSBhbGdlYnJhaWMobW92ZXNbaV0udG8pICYmXG4gICAgICAgICAgICAgICghKCdwcm9tb3Rpb24nIGluIG1vdmVzW2ldKSB8fFxuICAgICAgICAgICAgICBtb3ZlLnByb21vdGlvbiA9PT0gbW92ZXNbaV0ucHJvbW90aW9uKSkge1xuICAgICAgICAgICAgbW92ZV9vYmogPSBtb3Zlc1tpXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvKiBmYWlsZWQgdG8gZmluZCBtb3ZlICovXG4gICAgICBpZiAoIW1vdmVfb2JqKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICAvKiBuZWVkIHRvIG1ha2UgYSBjb3B5IG9mIG1vdmUgYmVjYXVzZSB3ZSBjYW4ndCBnZW5lcmF0ZSBTQU4gYWZ0ZXIgdGhlXG4gICAgICAgKiBtb3ZlIGlzIG1hZGVcbiAgICAgICAqL1xuICAgICAgdmFyIHByZXR0eV9tb3ZlID0gbWFrZV9wcmV0dHkobW92ZV9vYmopO1xuXG4gICAgICBtYWtlX21vdmUobW92ZV9vYmopO1xuXG4gICAgICByZXR1cm4gcHJldHR5X21vdmU7XG4gICAgfSxcblxuICAgIHVuZG86IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG1vdmUgPSB1bmRvX21vdmUoKTtcbiAgICAgIHJldHVybiAobW92ZSkgPyBtYWtlX3ByZXR0eShtb3ZlKSA6IG51bGw7XG4gICAgfSxcblxuICAgIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjbGVhcigpO1xuICAgIH0sXG5cbiAgICBwdXQ6IGZ1bmN0aW9uKHBpZWNlLCBzcXVhcmUpIHtcbiAgICAgIHJldHVybiBwdXQocGllY2UsIHNxdWFyZSk7XG4gICAgfSxcblxuICAgIGdldDogZnVuY3Rpb24oc3F1YXJlKSB7XG4gICAgICByZXR1cm4gZ2V0KHNxdWFyZSk7XG4gICAgfSxcblxuICAgIHJlbW92ZTogZnVuY3Rpb24oc3F1YXJlKSB7XG4gICAgICByZXR1cm4gcmVtb3ZlKHNxdWFyZSk7XG4gICAgfSxcblxuICAgIHBlcmZ0OiBmdW5jdGlvbihkZXB0aCkge1xuICAgICAgcmV0dXJuIHBlcmZ0KGRlcHRoKTtcbiAgICB9LFxuXG4gICAgc3F1YXJlX2NvbG9yOiBmdW5jdGlvbihzcXVhcmUpIHtcbiAgICAgIGlmIChzcXVhcmUgaW4gU1FVQVJFUykge1xuICAgICAgICB2YXIgc3FfMHg4OCA9IFNRVUFSRVNbc3F1YXJlXTtcbiAgICAgICAgcmV0dXJuICgocmFuayhzcV8weDg4KSArIGZpbGUoc3FfMHg4OCkpICUgMiA9PT0gMCkgPyAnbGlnaHQnIDogJ2RhcmsnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgaGlzdG9yeTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgdmFyIHJldmVyc2VkX2hpc3RvcnkgPSBbXTtcbiAgICAgIHZhciBtb3ZlX2hpc3RvcnkgPSBbXTtcbiAgICAgIHZhciB2ZXJib3NlID0gKHR5cGVvZiBvcHRpb25zICE9PSAndW5kZWZpbmVkJyAmJiAndmVyYm9zZScgaW4gb3B0aW9ucyAmJlxuICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy52ZXJib3NlKTtcblxuICAgICAgd2hpbGUgKGhpc3RvcnkubGVuZ3RoID4gMCkge1xuICAgICAgICByZXZlcnNlZF9oaXN0b3J5LnB1c2godW5kb19tb3ZlKCkpO1xuICAgICAgfVxuXG4gICAgICB3aGlsZSAocmV2ZXJzZWRfaGlzdG9yeS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBtb3ZlID0gcmV2ZXJzZWRfaGlzdG9yeS5wb3AoKTtcbiAgICAgICAgaWYgKHZlcmJvc2UpIHtcbiAgICAgICAgICBtb3ZlX2hpc3RvcnkucHVzaChtYWtlX3ByZXR0eShtb3ZlKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbW92ZV9oaXN0b3J5LnB1c2gobW92ZV90b19zYW4obW92ZSkpO1xuICAgICAgICB9XG4gICAgICAgIG1ha2VfbW92ZShtb3ZlKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG1vdmVfaGlzdG9yeTtcbiAgICB9XG5cbiAgfTtcbn07XG5cbi8qIGV4cG9ydCBDaGVzcyBvYmplY3QgaWYgdXNpbmcgbm9kZSBvciBhbnkgb3RoZXIgQ29tbW9uSlMgY29tcGF0aWJsZVxuICogZW52aXJvbm1lbnQgKi9cbmlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIGV4cG9ydHMuQ2hlc3MgPSBDaGVzcztcbi8qIGV4cG9ydCBDaGVzcyBvYmplY3QgZm9yIGFueSBSZXF1aXJlSlMgY29tcGF0aWJsZSBlbnZpcm9ubWVudCAqL1xuaWYgKHR5cGVvZiBkZWZpbmUgIT09ICd1bmRlZmluZWQnKSBkZWZpbmUoIGZ1bmN0aW9uICgpIHsgcmV0dXJuIENoZXNzOyAgfSk7XG4iLCIvLyBUaGlzIGZpbGUgaXMgdGhlIGNvbmNhdGVuYXRpb24gb2YgbWFueSBqcyBmaWxlcy5cbi8vIFNlZSBodHRwOi8vZ2l0aHViLmNvbS9qaW1oaWdzb24vb2JvZS5qcyBmb3IgdGhlIHJhdyBzb3VyY2VcblxuLy8gaGF2aW5nIGEgbG9jYWwgdW5kZWZpbmVkLCB3aW5kb3csIE9iamVjdCBldGMgYWxsb3dzIHNsaWdodGx5IGJldHRlciBtaW5pZmljYXRpb246XG4oZnVuY3Rpb24gICh3aW5kb3csIE9iamVjdCwgQXJyYXksIEVycm9yLCBKU09OLCB1bmRlZmluZWQgKSB7XG5cbiAgIC8vIHYyLjEuMy0xNS1nNzQzMmI0OVxuXG4vKlxuXG5Db3B5cmlnaHQgKGMpIDIwMTMsIEppbSBIaWdzb25cblxuQWxsIHJpZ2h0cyByZXNlcnZlZC5cblxuUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XG5tb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlXG5tZXQ6XG5cbjEuICBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodFxuICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cblxuMi4gIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0XG4gICAgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZVxuICAgIGRvY3VtZW50YXRpb24gYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG5cblRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBU1xuSVNcIiBBTkQgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRFxuVE8sIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBXG5QQVJUSUNVTEFSIFBVUlBPU0UgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFRcbkhPTERFUiBPUiBDT05UUklCVVRPUlMgQkUgTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCxcblNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRFxuVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLCBPUlxuUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT04gQU5ZIFRIRU9SWSBPRlxuTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkdcbk5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJU1xuU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG5cbiovXG5cbi8qKiBcbiAqIFBhcnRpYWxseSBjb21wbGV0ZSBhIGZ1bmN0aW9uLlxuICogXG4gKiAgdmFyIGFkZDMgPSBwYXJ0aWFsQ29tcGxldGUoIGZ1bmN0aW9uIGFkZChhLGIpe3JldHVybiBhK2J9LCAzICk7XG4gKiAgXG4gKiAgYWRkMyg0KSAvLyBnaXZlcyA3XG4gKiAgXG4gKiAgZnVuY3Rpb24gd3JhcChsZWZ0LCByaWdodCwgY2VuKXtyZXR1cm4gbGVmdCArIFwiIFwiICsgY2VuICsgXCIgXCIgKyByaWdodDt9XG4gKiAgXG4gKiAgdmFyIHBpcmF0ZUdyZWV0aW5nID0gcGFydGlhbENvbXBsZXRlKCB3cmFwICwgXCJJJ21cIiwgXCIsIGEgbWlnaHR5IHBpcmF0ZSFcIiApO1xuICogIFxuICogIHBpcmF0ZUdyZWV0aW5nKFwiR3V5YnJ1c2ggVGhyZWVwd29vZFwiKTsgXG4gKiAgLy8gZ2l2ZXMgXCJJJ20gR3V5YnJ1c2ggVGhyZWVwd29vZCwgYSBtaWdodHkgcGlyYXRlIVwiXG4gKi9cbnZhciBwYXJ0aWFsQ29tcGxldGUgPSB2YXJBcmdzKGZ1bmN0aW9uKCBmbiwgYXJncyApIHtcblxuICAgICAgLy8gdGhpcyBpc24ndCB0aGUgc2hvcnRlc3Qgd2F5IHRvIHdyaXRlIHRoaXMgYnV0IGl0IGRvZXNcbiAgICAgIC8vIGF2b2lkIGNyZWF0aW5nIGEgbmV3IGFycmF5IGVhY2ggdGltZSB0byBwYXNzIHRvIGZuLmFwcGx5LFxuICAgICAgLy8gb3RoZXJ3aXNlIGNvdWxkIGp1c3QgY2FsbCBib3VuZEFyZ3MuY29uY2F0KGNhbGxBcmdzKSAgICAgICBcblxuICAgICAgdmFyIG51bUJvdW5kQXJncyA9IGFyZ3MubGVuZ3RoO1xuXG4gICAgICByZXR1cm4gdmFyQXJncyhmdW5jdGlvbiggY2FsbEFyZ3MgKSB7XG4gICAgICAgICBcbiAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbEFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbbnVtQm91bmRBcmdzICsgaV0gPSBjYWxsQXJnc1tpXTtcbiAgICAgICAgIH1cbiAgICAgICAgIFxuICAgICAgICAgYXJncy5sZW5ndGggPSBudW1Cb3VuZEFyZ3MgKyBjYWxsQXJncy5sZW5ndGg7ICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgIH0pOyBcbiAgIH0pLFxuXG4vKipcbiAqIENvbXBvc2UgemVybyBvciBtb3JlIGZ1bmN0aW9uczpcbiAqIFxuICogICAgY29tcG9zZShmMSwgZjIsIGYzKSh4KSA9IGYxKGYyKGYzKHgpKSkpXG4gKiBcbiAqIFRoZSBsYXN0IChpbm5lci1tb3N0KSBmdW5jdGlvbiBtYXkgdGFrZSBtb3JlIHRoYW4gb25lIHBhcmFtZXRlcjpcbiAqIFxuICogICAgY29tcG9zZShmMSwgZjIsIGYzKSh4LHkpID0gZjEoZjIoZjMoeCx5KSkpKVxuICovXG4gICBjb21wb3NlID0gdmFyQXJncyhmdW5jdGlvbihmbnMpIHtcblxuICAgICAgdmFyIGZuc0xpc3QgPSBhcnJheUFzTGlzdChmbnMpO1xuICAgXG4gICAgICBmdW5jdGlvbiBuZXh0KHBhcmFtcywgY3VyRm4pIHsgIFxuICAgICAgICAgcmV0dXJuIFthcHBseShwYXJhbXMsIGN1ckZuKV07ICAgXG4gICAgICB9XG4gICAgICAgICAgICBcbiAgICAgIHJldHVybiB2YXJBcmdzKGZ1bmN0aW9uKHN0YXJ0UGFyYW1zKXtcbiAgICAgICAgXG4gICAgICAgICByZXR1cm4gZm9sZFIobmV4dCwgc3RhcnRQYXJhbXMsIGZuc0xpc3QpWzBdO1xuICAgICAgfSk7XG4gICB9KTtcblxuLyoqXG4gKiBBIG1vcmUgb3B0aW1pc2VkIHZlcnNpb24gb2YgY29tcG9zZSB0aGF0IHRha2VzIGV4YWN0bHkgdHdvIGZ1bmN0aW9uc1xuICogQHBhcmFtIGYxXG4gKiBAcGFyYW0gZjJcbiAqL1xuZnVuY3Rpb24gY29tcG9zZTIoZjEsIGYyKXtcbiAgIHJldHVybiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIGYxLmNhbGwodGhpcyxmMi5hcHBseSh0aGlzLGFyZ3VtZW50cykpO1xuICAgfVxufVxuXG4vKipcbiAqIEdlbmVyaWMgZm9ybSBmb3IgYSBmdW5jdGlvbiB0byBnZXQgYSBwcm9wZXJ0eSBmcm9tIGFuIG9iamVjdFxuICogXG4gKiAgICB2YXIgbyA9IHtcbiAqICAgICAgIGZvbzonYmFyJ1xuICogICAgfVxuICogICAgXG4gKiAgICB2YXIgZ2V0Rm9vID0gYXR0cignZm9vJylcbiAqICAgIFxuICogICAgZmV0Rm9vKG8pIC8vIHJldHVybnMgJ2JhcidcbiAqIFxuICogQHBhcmFtIHtTdHJpbmd9IGtleSB0aGUgcHJvcGVydHkgbmFtZVxuICovXG5mdW5jdGlvbiBhdHRyKGtleSkge1xuICAgcmV0dXJuIGZ1bmN0aW9uKG8pIHsgcmV0dXJuIG9ba2V5XTsgfTtcbn1cbiAgICAgICAgXG4vKipcbiAqIENhbGwgYSBsaXN0IG9mIGZ1bmN0aW9ucyB3aXRoIHRoZSBzYW1lIGFyZ3MgdW50aWwgb25lIHJldHVybnMgYSBcbiAqIHRydXRoeSByZXN1bHQuIFNpbWlsYXIgdG8gdGhlIHx8IG9wZXJhdG9yLlxuICogXG4gKiBTbzpcbiAqICAgICAgbGF6eVVuaW9uKFtmMSxmMixmMyAuLi4gZm5dKSggcDEsIHAyIC4uLiBwbiApXG4gKiAgICAgIFxuICogSXMgZXF1aXZhbGVudCB0bzogXG4gKiAgICAgIGFwcGx5KFtwMSwgcDIgLi4uIHBuXSwgZjEpIHx8IFxuICogICAgICBhcHBseShbcDEsIHAyIC4uLiBwbl0sIGYyKSB8fCBcbiAqICAgICAgYXBwbHkoW3AxLCBwMiAuLi4gcG5dLCBmMykgLi4uIGFwcGx5KGZuLCBbcDEsIHAyIC4uLiBwbl0pICBcbiAqICBcbiAqIEByZXR1cm5zIHRoZSBmaXJzdCByZXR1cm4gdmFsdWUgdGhhdCBpcyBnaXZlbiB0aGF0IGlzIHRydXRoeS5cbiAqL1xuICAgdmFyIGxhenlVbmlvbiA9IHZhckFyZ3MoZnVuY3Rpb24oZm5zKSB7XG5cbiAgICAgIHJldHVybiB2YXJBcmdzKGZ1bmN0aW9uKHBhcmFtcyl7XG4gICBcbiAgICAgICAgIHZhciBtYXliZVZhbHVlO1xuICAgXG4gICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbihmbnMpOyBpKyspIHtcbiAgIFxuICAgICAgICAgICAgbWF5YmVWYWx1ZSA9IGFwcGx5KHBhcmFtcywgZm5zW2ldKTtcbiAgIFxuICAgICAgICAgICAgaWYoIG1heWJlVmFsdWUgKSB7XG4gICAgICAgICAgICAgICByZXR1cm4gbWF5YmVWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cbiAgICAgIH0pO1xuICAgfSk7ICAgXG5cbi8qKlxuICogVGhpcyBmaWxlIGRlY2xhcmVzIHZhcmlvdXMgcGllY2VzIG9mIGZ1bmN0aW9uYWwgcHJvZ3JhbW1pbmcuXG4gKiBcbiAqIFRoaXMgaXNuJ3QgYSBnZW5lcmFsIHB1cnBvc2UgZnVuY3Rpb25hbCBsaWJyYXJ5LCB0byBrZWVwIHRoaW5ncyBzbWFsbCBpdFxuICogaGFzIGp1c3QgdGhlIHBhcnRzIHVzZWZ1bCBmb3IgT2JvZS5qcy5cbiAqL1xuXG5cbi8qKlxuICogQ2FsbCBhIHNpbmdsZSBmdW5jdGlvbiB3aXRoIHRoZSBnaXZlbiBhcmd1bWVudHMgYXJyYXkuXG4gKiBCYXNpY2FsbHksIGEgZnVuY3Rpb25hbC1zdHlsZSB2ZXJzaW9uIG9mIHRoZSBPTy1zdHlsZSBGdW5jdGlvbiNhcHBseSBmb3IgXG4gKiB3aGVuIHdlIGRvbid0IGNhcmUgYWJvdXQgdGhlIGNvbnRleHQgKCd0aGlzJykgb2YgdGhlIGNhbGwuXG4gKiBcbiAqIFRoZSBvcmRlciBvZiBhcmd1bWVudHMgYWxsb3dzIHBhcnRpYWwgY29tcGxldGlvbiBvZiB0aGUgYXJndW1lbnRzIGFycmF5XG4gKi9cbmZ1bmN0aW9uIGFwcGx5KGFyZ3MsIGZuKSB7XG4gICByZXR1cm4gZm4uYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbn1cblxuLyoqXG4gKiBEZWZpbmUgdmFyaWFibGUgYXJndW1lbnQgZnVuY3Rpb25zIGJ1dCBjdXQgb3V0IGFsbCB0aGF0IHRlZGlvdXMgbWVzc2luZyBhYm91dCBcbiAqIHdpdGggdGhlIGFyZ3VtZW50cyBvYmplY3QuIERlbGl2ZXJzIHRoZSB2YXJpYWJsZS1sZW5ndGggcGFydCBvZiB0aGUgYXJndW1lbnRzXG4gKiBsaXN0IGFzIGFuIGFycmF5LlxuICogXG4gKiBFZzpcbiAqIFxuICogdmFyIG15RnVuY3Rpb24gPSB2YXJBcmdzKFxuICogICAgZnVuY3Rpb24oIGZpeGVkQXJndW1lbnQsIG90aGVyRml4ZWRBcmd1bWVudCwgdmFyaWFibGVOdW1iZXJPZkFyZ3VtZW50cyApe1xuICogICAgICAgY29uc29sZS5sb2coIHZhcmlhYmxlTnVtYmVyT2ZBcmd1bWVudHMgKTtcbiAqICAgIH1cbiAqIClcbiAqIFxuICogbXlGdW5jdGlvbignYScsICdiJywgMSwgMiwgMyk7IC8vIGxvZ3MgWzEsMiwzXVxuICogXG4gKiB2YXIgbXlPdGhlckZ1bmN0aW9uID0gdmFyQXJncyhmdW5jdGlvbiggdmFyaWFibGVOdW1iZXJPZkFyZ3VtZW50cyApe1xuICogICAgY29uc29sZS5sb2coIHZhcmlhYmxlTnVtYmVyT2ZBcmd1bWVudHMgKTtcbiAqIH0pXG4gKiBcbiAqIG15RnVuY3Rpb24oMSwgMiwgMyk7IC8vIGxvZ3MgWzEsMiwzXVxuICogXG4gKi9cbmZ1bmN0aW9uIHZhckFyZ3MoZm4pe1xuXG4gICB2YXIgbnVtYmVyT2ZGaXhlZEFyZ3VtZW50cyA9IGZuLmxlbmd0aCAtMSxcbiAgICAgICBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTsgICAgICAgICAgXG4gICAgICAgICBcbiAgICAgICAgICAgICAgICAgICBcbiAgIGlmKCBudW1iZXJPZkZpeGVkQXJndW1lbnRzID09IDAgKSB7XG4gICAgICAvLyBhbiBvcHRpbWlzZWQgY2FzZSBmb3Igd2hlbiB0aGVyZSBhcmUgbm8gZml4ZWQgYXJnczogICBcbiAgIFxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCl7XG4gICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBzbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuICAgICAgfVxuICAgICAgXG4gICB9IGVsc2UgaWYoIG51bWJlck9mRml4ZWRBcmd1bWVudHMgPT0gMSApIHtcbiAgICAgIC8vIGFuIG9wdGltaXNlZCBjYXNlIGZvciB3aGVuIHRoZXJlIGFyZSBpcyBvbmUgZml4ZWQgYXJnczpcbiAgIFxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCl7XG4gICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBhcmd1bWVudHNbMF0sIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgICB9XG4gICB9XG4gICBcbiAgIC8vIGdlbmVyYWwgY2FzZSAgIFxuXG4gICAvLyB3ZSBrbm93IGhvdyBtYW55IGFyZ3VtZW50cyBmbiB3aWxsIGFsd2F5cyB0YWtlLiBDcmVhdGUgYVxuICAgLy8gZml4ZWQtc2l6ZSBhcnJheSB0byBob2xkIHRoYXQgbWFueSwgdG8gYmUgcmUtdXNlZCBvblxuICAgLy8gZXZlcnkgY2FsbCB0byB0aGUgcmV0dXJuZWQgZnVuY3Rpb25cbiAgIHZhciBhcmdzSG9sZGVyID0gQXJyYXkoZm4ubGVuZ3RoKTsgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICByZXR1cm4gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtYmVyT2ZGaXhlZEFyZ3VtZW50czsgaSsrKSB7XG4gICAgICAgICBhcmdzSG9sZGVyW2ldID0gYXJndW1lbnRzW2ldOyAgICAgICAgIFxuICAgICAgfVxuXG4gICAgICBhcmdzSG9sZGVyW251bWJlck9mRml4ZWRBcmd1bWVudHNdID0gXG4gICAgICAgICBzbGljZS5jYWxsKGFyZ3VtZW50cywgbnVtYmVyT2ZGaXhlZEFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgcmV0dXJuIGZuLmFwcGx5KCB0aGlzLCBhcmdzSG9sZGVyKTsgICAgICBcbiAgIH0gICAgICAgXG59XG5cblxuLyoqXG4gKiBTd2FwIHRoZSBvcmRlciBvZiBwYXJhbWV0ZXJzIHRvIGEgYmluYXJ5IGZ1bmN0aW9uXG4gKiBcbiAqIEEgYml0IGxpa2UgdGhpcyBmbGlwOiBodHRwOi8venZvbi5vcmcvb3RoZXIvaGFza2VsbC9PdXRwdXRwcmVsdWRlL2ZsaXBfZi5odG1sXG4gKi9cbmZ1bmN0aW9uIGZsaXAoZm4pe1xuICAgcmV0dXJuIGZ1bmN0aW9uKGEsIGIpe1xuICAgICAgcmV0dXJuIGZuKGIsYSk7XG4gICB9XG59XG5cblxuLyoqXG4gKiBDcmVhdGUgYSBmdW5jdGlvbiB3aGljaCBpcyB0aGUgaW50ZXJzZWN0aW9uIG9mIHR3byBvdGhlciBmdW5jdGlvbnMuXG4gKiBcbiAqIExpa2UgdGhlICYmIG9wZXJhdG9yLCBpZiB0aGUgZmlyc3QgaXMgdHJ1dGh5LCB0aGUgc2Vjb25kIGlzIG5ldmVyIGNhbGxlZCxcbiAqIG90aGVyd2lzZSB0aGUgcmV0dXJuIHZhbHVlIGZyb20gdGhlIHNlY29uZCBpcyByZXR1cm5lZC5cbiAqL1xuZnVuY3Rpb24gbGF6eUludGVyc2VjdGlvbihmbjEsIGZuMikge1xuXG4gICByZXR1cm4gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgcmV0dXJuIGZuMShwYXJhbSkgJiYgZm4yKHBhcmFtKTtcbiAgIH07ICAgXG59XG5cbi8qKlxuICogQSBmdW5jdGlvbiB3aGljaCBkb2VzIG5vdGhpbmdcbiAqL1xuZnVuY3Rpb24gbm9vcCgpe31cblxuLyoqXG4gKiBBIGZ1bmN0aW9uIHdoaWNoIGlzIGFsd2F5cyBoYXBweVxuICovXG5mdW5jdGlvbiBhbHdheXMoKXtyZXR1cm4gdHJ1ZX1cblxuLyoqXG4gKiBDcmVhdGUgYSBmdW5jdGlvbiB3aGljaCBhbHdheXMgcmV0dXJucyB0aGUgc2FtZVxuICogdmFsdWVcbiAqIFxuICogdmFyIHJldHVybjMgPSBmdW5jdG9yKDMpO1xuICogXG4gKiByZXR1cm4zKCkgLy8gZ2l2ZXMgM1xuICogcmV0dXJuMygpIC8vIHN0aWxsIGdpdmVzIDNcbiAqIHJldHVybjMoKSAvLyB3aWxsIGFsd2F5cyBnaXZlIDNcbiAqL1xuZnVuY3Rpb24gZnVuY3Rvcih2YWwpe1xuICAgcmV0dXJuIGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gdmFsO1xuICAgfVxufVxuXG4vKipcbiAqIFRoaXMgZmlsZSBkZWZpbmVzIHNvbWUgbG9vc2VseSBhc3NvY2lhdGVkIHN5bnRhY3RpYyBzdWdhciBmb3IgXG4gKiBKYXZhc2NyaXB0IHByb2dyYW1taW5nIFxuICovXG5cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIGNhbmRpZGF0ZSBpcyBvZiB0eXBlIFRcbiAqL1xuZnVuY3Rpb24gaXNPZlR5cGUoVCwgbWF5YmVTb21ldGhpbmcpe1xuICAgcmV0dXJuIG1heWJlU29tZXRoaW5nICYmIG1heWJlU29tZXRoaW5nLmNvbnN0cnVjdG9yID09PSBUO1xufVxuXG52YXIgbGVuID0gYXR0cignbGVuZ3RoJyksICAgIFxuICAgIGlzU3RyaW5nID0gcGFydGlhbENvbXBsZXRlKGlzT2ZUeXBlLCBTdHJpbmcpO1xuXG4vKiogXG4gKiBJIGRvbid0IGxpa2Ugc2F5aW5nIHRoaXM6XG4gKiBcbiAqICAgIGZvbyAhPT09IHVuZGVmaW5lZFxuICogICAgXG4gKiBiZWNhdXNlIG9mIHRoZSBkb3VibGUtbmVnYXRpdmUuIEkgZmluZCB0aGlzOlxuICogXG4gKiAgICBkZWZpbmVkKGZvbylcbiAqICAgIFxuICogZWFzaWVyIHRvIHJlYWQuXG4gKi8gXG5mdW5jdGlvbiBkZWZpbmVkKCB2YWx1ZSApIHtcbiAgIHJldHVybiB2YWx1ZSAhPT0gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiBvYmplY3QgbyBoYXMgYSBrZXkgbmFtZWQgbGlrZSBldmVyeSBwcm9wZXJ0eSBpbiBcbiAqIHRoZSBwcm9wZXJ0aWVzIGFycmF5LiBXaWxsIGdpdmUgZmFsc2UgaWYgYW55IGFyZSBtaXNzaW5nLCBvciBpZiBvIFxuICogaXMgbm90IGFuIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gaGFzQWxsUHJvcGVydGllcyhmaWVsZExpc3QsIG8pIHtcblxuICAgcmV0dXJuICAgICAgKG8gaW5zdGFuY2VvZiBPYmplY3QpIFxuICAgICAgICAgICAgJiZcbiAgICAgICAgICAgICAgIGFsbChmdW5jdGlvbiAoZmllbGQpIHsgICAgICAgICBcbiAgICAgICAgICAgICAgICAgIHJldHVybiAoZmllbGQgaW4gbyk7ICAgICAgICAgXG4gICAgICAgICAgICAgICB9LCBmaWVsZExpc3QpO1xufVxuLyoqXG4gKiBMaWtlIGNvbnMgaW4gTGlzcFxuICovXG5mdW5jdGlvbiBjb25zKHgsIHhzKSB7XG4gICBcbiAgIC8qIEludGVybmFsbHkgbGlzdHMgYXJlIGxpbmtlZCAyLWVsZW1lbnQgSmF2YXNjcmlwdCBhcnJheXMuXG4gICAgICAgICAgXG4gICAgICBJZGVhbGx5IHRoZSByZXR1cm4gaGVyZSB3b3VsZCBiZSBPYmplY3QuZnJlZXplKFt4LHhzXSlcbiAgICAgIHNvIHRoYXQgYnVncyByZWxhdGVkIHRvIG11dGF0aW9uIGFyZSBmb3VuZCBmYXN0LlxuICAgICAgSG93ZXZlciwgY29ucyBpcyByaWdodCBvbiB0aGUgY3JpdGljYWwgcGF0aCBmb3JcbiAgICAgIHBlcmZvcm1hbmNlIGFuZCB0aGlzIHNsb3dzIG9ib2UtbWFyayBkb3duIGJ5XG4gICAgICB+MjUlLiBVbmRlciB0aGVvcmV0aWNhbCBmdXR1cmUgSlMgZW5naW5lcyB0aGF0IGZyZWV6ZSBtb3JlXG4gICAgICBlZmZpY2llbnRseSAocG9zc2libHkgZXZlbiB1c2UgaW1tdXRhYmlsaXR5IHRvXG4gICAgICBydW4gZmFzdGVyKSB0aGlzIHNob3VsZCBiZSBjb25zaWRlcmVkIGZvclxuICAgICAgcmVzdG9yYXRpb24uXG4gICAqL1xuICAgXG4gICByZXR1cm4gW3gseHNdO1xufVxuXG4vKipcbiAqIFRoZSBlbXB0eSBsaXN0XG4gKi9cbnZhciBlbXB0eUxpc3QgPSBudWxsLFxuXG4vKipcbiAqIEdldCB0aGUgaGVhZCBvZiBhIGxpc3QuXG4gKiBcbiAqIEllLCBoZWFkKGNvbnMoYSxiKSkgPSBhXG4gKi9cbiAgICBoZWFkID0gYXR0cigwKSxcblxuLyoqXG4gKiBHZXQgdGhlIHRhaWwgb2YgYSBsaXN0LlxuICogXG4gKiBJZSwgdGFpbChjb25zKGEsYikpID0gYlxuICovXG4gICAgdGFpbCA9IGF0dHIoMSk7XG5cblxuLyoqIFxuICogQ29udmVydHMgYW4gYXJyYXkgdG8gYSBsaXN0IFxuICogXG4gKiAgICBhc0xpc3QoW2EsYixjXSlcbiAqIFxuICogaXMgZXF1aXZhbGVudCB0bzpcbiAqICAgIFxuICogICAgY29ucyhhLCBjb25zKGIsIGNvbnMoYywgZW1wdHlMaXN0KSkpIFxuICoqL1xuZnVuY3Rpb24gYXJyYXlBc0xpc3QoaW5wdXRBcnJheSl7XG5cbiAgIHJldHVybiByZXZlcnNlTGlzdCggXG4gICAgICBpbnB1dEFycmF5LnJlZHVjZShcbiAgICAgICAgIGZsaXAoY29ucyksXG4gICAgICAgICBlbXB0eUxpc3QgXG4gICAgICApXG4gICApO1xufVxuXG4vKipcbiAqIEEgdmFyYXJncyB2ZXJzaW9uIG9mIGFycmF5QXNMaXN0LiBXb3JrcyBhIGJpdCBsaWtlIGxpc3RcbiAqIGluIExJU1AuXG4gKiBcbiAqICAgIGxpc3QoYSxiLGMpIFxuICogICAgXG4gKiBpcyBlcXVpdmFsZW50IHRvOlxuICogXG4gKiAgICBjb25zKGEsIGNvbnMoYiwgY29ucyhjLCBlbXB0eUxpc3QpKSlcbiAqL1xudmFyIGxpc3QgPSB2YXJBcmdzKGFycmF5QXNMaXN0KTtcblxuLyoqXG4gKiBDb252ZXJ0IGEgbGlzdCBiYWNrIHRvIGEganMgbmF0aXZlIGFycmF5XG4gKi9cbmZ1bmN0aW9uIGxpc3RBc0FycmF5KGxpc3Qpe1xuXG4gICByZXR1cm4gZm9sZFIoIGZ1bmN0aW9uKGFycmF5U29GYXIsIGxpc3RJdGVtKXtcbiAgICAgIFxuICAgICAgYXJyYXlTb0Zhci51bnNoaWZ0KGxpc3RJdGVtKTtcbiAgICAgIHJldHVybiBhcnJheVNvRmFyO1xuICAgICAgICAgICBcbiAgIH0sIFtdLCBsaXN0ICk7XG4gICBcbn1cblxuLyoqXG4gKiBNYXAgYSBmdW5jdGlvbiBvdmVyIGEgbGlzdCBcbiAqL1xuZnVuY3Rpb24gbWFwKGZuLCBsaXN0KSB7XG5cbiAgIHJldHVybiBsaXN0XG4gICAgICAgICAgICA/IGNvbnMoZm4oaGVhZChsaXN0KSksIG1hcChmbix0YWlsKGxpc3QpKSlcbiAgICAgICAgICAgIDogZW1wdHlMaXN0XG4gICAgICAgICAgICA7XG59XG5cbi8qKlxuICogZm9sZFIgaW1wbGVtZW50YXRpb24uIFJlZHVjZSBhIGxpc3QgZG93biB0byBhIHNpbmdsZSB2YWx1ZS5cbiAqIFxuICogQHByYW0ge0Z1bmN0aW9ufSBmbiAgICAgKHJpZ2h0RXZhbCwgY3VyVmFsKSAtPiByZXN1bHQgXG4gKi9cbmZ1bmN0aW9uIGZvbGRSKGZuLCBzdGFydFZhbHVlLCBsaXN0KSB7XG4gICAgICBcbiAgIHJldHVybiBsaXN0IFxuICAgICAgICAgICAgPyBmbihmb2xkUihmbiwgc3RhcnRWYWx1ZSwgdGFpbChsaXN0KSksIGhlYWQobGlzdCkpXG4gICAgICAgICAgICA6IHN0YXJ0VmFsdWVcbiAgICAgICAgICAgIDtcbn1cblxuLyoqXG4gKiBmb2xkUiBpbXBsZW1lbnRhdGlvbi4gUmVkdWNlIGEgbGlzdCBkb3duIHRvIGEgc2luZ2xlIHZhbHVlLlxuICogXG4gKiBAcHJhbSB7RnVuY3Rpb259IGZuICAgICAocmlnaHRFdmFsLCBjdXJWYWwpIC0+IHJlc3VsdCBcbiAqL1xuZnVuY3Rpb24gZm9sZFIxKGZuLCBsaXN0KSB7XG4gICAgICBcbiAgIHJldHVybiB0YWlsKGxpc3QpIFxuICAgICAgICAgICAgPyBmbihmb2xkUjEoZm4sIHRhaWwobGlzdCkpLCBoZWFkKGxpc3QpKVxuICAgICAgICAgICAgOiBoZWFkKGxpc3QpXG4gICAgICAgICAgICA7XG59XG5cblxuLyoqXG4gKiBSZXR1cm4gYSBsaXN0IGxpa2UgdGhlIG9uZSBnaXZlbiBidXQgd2l0aCB0aGUgZmlyc3QgaW5zdGFuY2UgZXF1YWwgXG4gKiB0byBpdGVtIHJlbW92ZWQgXG4gKi9cbmZ1bmN0aW9uIHdpdGhvdXQobGlzdCwgdGVzdCwgcmVtb3ZlZEZuKSB7XG4gXG4gICByZXR1cm4gd2l0aG91dElubmVyKGxpc3QsIHJlbW92ZWRGbiB8fCBub29wKTtcbiBcbiAgIGZ1bmN0aW9uIHdpdGhvdXRJbm5lcihzdWJMaXN0LCByZW1vdmVkRm4pIHtcbiAgICAgIHJldHVybiBzdWJMaXN0ICBcbiAgICAgICAgID8gICggdGVzdChoZWFkKHN1Ykxpc3QpKSBcbiAgICAgICAgICAgICAgICAgID8gKHJlbW92ZWRGbihoZWFkKHN1Ykxpc3QpKSwgdGFpbChzdWJMaXN0KSkgXG4gICAgICAgICAgICAgICAgICA6IGNvbnMoaGVhZChzdWJMaXN0KSwgd2l0aG91dElubmVyKHRhaWwoc3ViTGlzdCksIHJlbW92ZWRGbikpXG4gICAgICAgICAgICApXG4gICAgICAgICA6IGVtcHR5TGlzdFxuICAgICAgICAgO1xuICAgfSAgICAgICAgICAgICAgIFxufVxuXG4vKiogXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIGZ1bmN0aW9uIGhvbGRzIGZvciBldmVyeSBpdGVtIGluIFxuICogdGhlIGxpc3QsIGZhbHNlIG90aGVyd2lzZSBcbiAqL1xuZnVuY3Rpb24gYWxsKGZuLCBsaXN0KSB7XG4gICBcbiAgIHJldHVybiAhbGlzdCB8fCBcbiAgICAgICAgICAoIGZuKGhlYWQobGlzdCkpICYmIGFsbChmbiwgdGFpbChsaXN0KSkgKTtcbn1cblxuLyoqXG4gKiBDYWxsIGV2ZXJ5IGZ1bmN0aW9uIGluIGEgbGlzdCBvZiBmdW5jdGlvbnMgd2l0aCB0aGUgc2FtZSBhcmd1bWVudHNcbiAqIFxuICogVGhpcyBkb2Vzbid0IG1ha2UgYW55IHNlbnNlIGlmIHdlJ3JlIGRvaW5nIHB1cmUgZnVuY3Rpb25hbCBiZWNhdXNlIFxuICogaXQgZG9lc24ndCByZXR1cm4gYW55dGhpbmcuIEhlbmNlLCB0aGlzIGlzIG9ubHkgcmVhbGx5IHVzZWZ1bCBpZiB0aGVcbiAqIGZ1bmN0aW9ucyBiZWluZyBjYWxsZWQgaGF2ZSBzaWRlLWVmZmVjdHMuIFxuICovXG5mdW5jdGlvbiBhcHBseUVhY2goZm5MaXN0LCBhcmdzKSB7XG5cbiAgIGlmKCBmbkxpc3QgKSB7ICBcbiAgICAgIGhlYWQoZm5MaXN0KS5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgIFxuICAgICAgYXBwbHlFYWNoKHRhaWwoZm5MaXN0KSwgYXJncyk7XG4gICB9XG59XG5cbi8qKlxuICogUmV2ZXJzZSB0aGUgb3JkZXIgb2YgYSBsaXN0XG4gKi9cbmZ1bmN0aW9uIHJldmVyc2VMaXN0KGxpc3QpeyBcblxuICAgLy8ganMgcmUtaW1wbGVtZW50YXRpb24gb2YgM3JkIHNvbHV0aW9uIGZyb206XG4gICAvLyAgICBodHRwOi8vd3d3Lmhhc2tlbGwub3JnL2hhc2tlbGx3aWtpLzk5X3F1ZXN0aW9ucy9Tb2x1dGlvbnMvNVxuICAgZnVuY3Rpb24gcmV2ZXJzZUlubmVyKCBsaXN0LCByZXZlcnNlZEFscmVhZHkgKSB7XG4gICAgICBpZiggIWxpc3QgKSB7XG4gICAgICAgICByZXR1cm4gcmV2ZXJzZWRBbHJlYWR5O1xuICAgICAgfVxuICAgICAgXG4gICAgICByZXR1cm4gcmV2ZXJzZUlubmVyKHRhaWwobGlzdCksIGNvbnMoaGVhZChsaXN0KSwgcmV2ZXJzZWRBbHJlYWR5KSlcbiAgIH1cblxuICAgcmV0dXJuIHJldmVyc2VJbm5lcihsaXN0LCBlbXB0eUxpc3QpO1xufVxuXG5mdW5jdGlvbiBmaXJzdCh0ZXN0LCBsaXN0KSB7XG4gICByZXR1cm4gICBsaXN0ICYmXG4gICAgICAgICAgICAgICAodGVzdChoZWFkKGxpc3QpKSBcbiAgICAgICAgICAgICAgICAgID8gaGVhZChsaXN0KSBcbiAgICAgICAgICAgICAgICAgIDogZmlyc3QodGVzdCx0YWlsKGxpc3QpKSk7IFxufVxuXG4vKiBcbiAgIFRoaXMgaXMgYSBzbGlnaHRseSBoYWNrZWQtdXAgYnJvd3NlciBvbmx5IHZlcnNpb24gb2YgY2xhcmluZXQgXG4gICBcbiAgICAgICogIHNvbWUgZmVhdHVyZXMgcmVtb3ZlZCB0byBoZWxwIGtlZXAgYnJvd3NlciBPYm9lIHVuZGVyIFxuICAgICAgICAgdGhlIDVrIG1pY3JvLWxpYnJhcnkgbGltaXRcbiAgICAgICogIHBsdWcgZGlyZWN0bHkgaW50byBldmVudCBidXNcbiAgIFxuICAgRm9yIHRoZSBvcmlnaW5hbCBnbyBoZXJlOlxuICAgICAgaHR0cHM6Ly9naXRodWIuY29tL2RzY2FwZS9jbGFyaW5ldFxuXG4gICBXZSByZWNlaXZlIHRoZSBldmVudHM6XG4gICAgICBTVFJFQU1fREFUQVxuICAgICAgU1RSRUFNX0VORFxuICAgICAgXG4gICBXZSBlbWl0IHRoZSBldmVudHM6XG4gICAgICBTQVhfS0VZXG4gICAgICBTQVhfVkFMVUVfT1BFTlxuICAgICAgU0FYX1ZBTFVFX0NMT1NFICAgICAgXG4gICAgICBGQUlMX0VWRU5UICAgICAgXG4gKi9cblxuZnVuY3Rpb24gY2xhcmluZXQoZXZlbnRCdXMpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gICBcbiAgdmFyIFxuICAgICAgLy8gc2hvcnRjdXQgc29tZSBldmVudHMgb24gdGhlIGJ1c1xuICAgICAgZW1pdFNheEtleSAgICAgICAgICAgPSBldmVudEJ1cyhTQVhfS0VZKS5lbWl0LFxuICAgICAgZW1pdFZhbHVlT3BlbiAgICAgICAgPSBldmVudEJ1cyhTQVhfVkFMVUVfT1BFTikuZW1pdCxcbiAgICAgIGVtaXRWYWx1ZUNsb3NlICAgICAgID0gZXZlbnRCdXMoU0FYX1ZBTFVFX0NMT1NFKS5lbWl0LFxuICAgICAgZW1pdEZhaWwgICAgICAgICAgICAgPSBldmVudEJ1cyhGQUlMX0VWRU5UKS5lbWl0LFxuICAgICAgICAgICAgICBcbiAgICAgIE1BWF9CVUZGRVJfTEVOR1RIID0gNjQgKiAxMDI0XG4gICwgICBzdHJpbmdUb2tlblBhdHRlcm4gPSAvW1xcXFxcIlxcbl0vZ1xuICAsICAgX24gPSAwXG4gIFxuICAgICAgLy8gc3RhdGVzXG4gICwgICBCRUdJTiAgICAgICAgICAgICAgICA9IF9uKytcbiAgLCAgIFZBTFVFICAgICAgICAgICAgICAgID0gX24rKyAvLyBnZW5lcmFsIHN0dWZmXG4gICwgICBPUEVOX09CSkVDVCAgICAgICAgICA9IF9uKysgLy8ge1xuICAsICAgQ0xPU0VfT0JKRUNUICAgICAgICAgPSBfbisrIC8vIH1cbiAgLCAgIE9QRU5fQVJSQVkgICAgICAgICAgID0gX24rKyAvLyBbXG4gICwgICBDTE9TRV9BUlJBWSAgICAgICAgICA9IF9uKysgLy8gXVxuICAsICAgU1RSSU5HICAgICAgICAgICAgICAgPSBfbisrIC8vIFwiXCJcbiAgLCAgIE9QRU5fS0VZICAgICAgICAgICAgID0gX24rKyAvLyAsIFwiYVwiXG4gICwgICBDTE9TRV9LRVkgICAgICAgICAgICA9IF9uKysgLy8gOlxuICAsICAgVFJVRSAgICAgICAgICAgICAgICAgPSBfbisrIC8vIHJcbiAgLCAgIFRSVUUyICAgICAgICAgICAgICAgID0gX24rKyAvLyB1XG4gICwgICBUUlVFMyAgICAgICAgICAgICAgICA9IF9uKysgLy8gZVxuICAsICAgRkFMU0UgICAgICAgICAgICAgICAgPSBfbisrIC8vIGFcbiAgLCAgIEZBTFNFMiAgICAgICAgICAgICAgID0gX24rKyAvLyBsXG4gICwgICBGQUxTRTMgICAgICAgICAgICAgICA9IF9uKysgLy8gc1xuICAsICAgRkFMU0U0ICAgICAgICAgICAgICAgPSBfbisrIC8vIGVcbiAgLCAgIE5VTEwgICAgICAgICAgICAgICAgID0gX24rKyAvLyB1XG4gICwgICBOVUxMMiAgICAgICAgICAgICAgICA9IF9uKysgLy8gbFxuICAsICAgTlVMTDMgICAgICAgICAgICAgICAgPSBfbisrIC8vIGxcbiAgLCAgIE5VTUJFUl9ERUNJTUFMX1BPSU5UID0gX24rKyAvLyAuXG4gICwgICBOVU1CRVJfRElHSVQgICAgICAgICA9IF9uICAgLy8gWzAtOV1cblxuICAgICAgLy8gc2V0dXAgaW5pdGlhbCBwYXJzZXIgdmFsdWVzXG4gICwgICBidWZmZXJDaGVja1Bvc2l0aW9uICA9IE1BWF9CVUZGRVJfTEVOR1RIXG4gICwgICBsYXRlc3RFcnJvciAgICAgICAgICAgICAgICBcbiAgLCAgIGMgICAgICAgICAgICAgICAgICAgIFxuICAsICAgcCAgICAgICAgICAgICAgICAgICAgXG4gICwgICB0ZXh0Tm9kZSAgICAgICAgICAgICA9IHVuZGVmaW5lZFxuICAsICAgbnVtYmVyTm9kZSAgICAgICAgICAgPSBcIlwiICAgICBcbiAgLCAgIHNsYXNoZWQgICAgICAgICAgICAgID0gZmFsc2VcbiAgLCAgIGNsb3NlZCAgICAgICAgICAgICAgID0gZmFsc2VcbiAgLCAgIHN0YXRlICAgICAgICAgICAgICAgID0gQkVHSU5cbiAgLCAgIHN0YWNrICAgICAgICAgICAgICAgID0gW11cbiAgLCAgIHVuaWNvZGVTICAgICAgICAgICAgID0gbnVsbFxuICAsICAgdW5pY29kZUkgICAgICAgICAgICAgPSAwXG4gICwgICBkZXB0aCAgICAgICAgICAgICAgICA9IDBcbiAgLCAgIHBvc2l0aW9uICAgICAgICAgICAgID0gMFxuICAsICAgY29sdW1uICAgICAgICAgICAgICAgPSAwICAvL21vc3RseSBmb3IgZXJyb3IgcmVwb3J0aW5nXG4gICwgICBsaW5lICAgICAgICAgICAgICAgICA9IDFcbiAgO1xuXG4gIGZ1bmN0aW9uIGNoZWNrQnVmZmVyTGVuZ3RoICgpIHtcbiAgICAgXG4gICAgdmFyIG1heEFjdHVhbCA9IDA7XG4gICAgIFxuICAgIGlmICh0ZXh0Tm9kZSAhPT0gdW5kZWZpbmVkICYmIHRleHROb2RlLmxlbmd0aCA+IE1BWF9CVUZGRVJfTEVOR1RIKSB7XG4gICAgICBlbWl0RXJyb3IoXCJNYXggYnVmZmVyIGxlbmd0aCBleGNlZWRlZDogdGV4dE5vZGVcIik7XG4gICAgICBtYXhBY3R1YWwgPSBNYXRoLm1heChtYXhBY3R1YWwsIHRleHROb2RlLmxlbmd0aCk7XG4gICAgfVxuICAgIGlmIChudW1iZXJOb2RlLmxlbmd0aCA+IE1BWF9CVUZGRVJfTEVOR1RIKSB7XG4gICAgICBlbWl0RXJyb3IoXCJNYXggYnVmZmVyIGxlbmd0aCBleGNlZWRlZDogbnVtYmVyTm9kZVwiKTtcbiAgICAgIG1heEFjdHVhbCA9IE1hdGgubWF4KG1heEFjdHVhbCwgbnVtYmVyTm9kZS5sZW5ndGgpO1xuICAgIH1cbiAgICAgXG4gICAgYnVmZmVyQ2hlY2tQb3NpdGlvbiA9IChNQVhfQlVGRkVSX0xFTkdUSCAtIG1heEFjdHVhbClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIHBvc2l0aW9uO1xuICB9XG5cbiAgZXZlbnRCdXMoU1RSRUFNX0RBVEEpLm9uKGhhbmRsZURhdGEpO1xuXG4gICAvKiBBdCB0aGUgZW5kIG9mIHRoZSBodHRwIGNvbnRlbnQgY2xvc2UgdGhlIGNsYXJpbmV0IFxuICAgIFRoaXMgd2lsbCBwcm92aWRlIGFuIGVycm9yIGlmIHRoZSB0b3RhbCBjb250ZW50IHByb3ZpZGVkIHdhcyBub3QgXG4gICAgdmFsaWQganNvbiwgaWUgaWYgbm90IGFsbCBhcnJheXMsIG9iamVjdHMgYW5kIFN0cmluZ3MgY2xvc2VkIHByb3Blcmx5ICovXG4gIGV2ZW50QnVzKFNUUkVBTV9FTkQpLm9uKGhhbmRsZVN0cmVhbUVuZCk7ICAgXG5cbiAgZnVuY3Rpb24gZW1pdEVycm9yIChlcnJvclN0cmluZykge1xuICAgICBpZiAodGV4dE5vZGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBlbWl0VmFsdWVPcGVuKHRleHROb2RlKTtcbiAgICAgICAgZW1pdFZhbHVlQ2xvc2UoKTtcbiAgICAgICAgdGV4dE5vZGUgPSB1bmRlZmluZWQ7XG4gICAgIH1cblxuICAgICBsYXRlc3RFcnJvciA9IEVycm9yKGVycm9yU3RyaW5nICsgXCJcXG5MbjogXCIrbGluZStcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiXFxuQ29sOiBcIitjb2x1bW4rXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlxcbkNocjogXCIrYyk7XG4gICAgIFxuICAgICBlbWl0RmFpbChlcnJvclJlcG9ydCh1bmRlZmluZWQsIHVuZGVmaW5lZCwgbGF0ZXN0RXJyb3IpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZVN0cmVhbUVuZCgpIHtcbiAgICBpZiggc3RhdGUgPT0gQkVHSU4gKSB7XG4gICAgICAvLyBIYW5kbGUgdGhlIGNhc2Ugd2hlcmUgdGhlIHN0cmVhbSBjbG9zZXMgd2l0aG91dCBldmVyIHJlY2VpdmluZ1xuICAgICAgLy8gYW55IGlucHV0LiBUaGlzIGlzbid0IGFuIGVycm9yIC0gcmVzcG9uc2UgYm9kaWVzIGNhbiBiZSBibGFuayxcbiAgICAgIC8vIHBhcnRpY3VsYXJseSBmb3IgMjA0IGh0dHAgcmVzcG9uc2VzXG4gICAgICBcbiAgICAgIC8vIEJlY2F1c2Ugb2YgaG93IE9ib2UgaXMgY3VycmVudGx5IGltcGxlbWVudGVkLCB3ZSBwYXJzZSBhXG4gICAgICAvLyBjb21wbGV0ZWx5IGVtcHR5IHN0cmVhbSBhcyBjb250YWluaW5nIGFuIGVtcHR5IG9iamVjdC5cbiAgICAgIC8vIFRoaXMgaXMgYmVjYXVzZSBPYm9lJ3MgZG9uZSBldmVudCBpcyBvbmx5IGZpcmVkIHdoZW4gdGhlXG4gICAgICAvLyByb290IG9iamVjdCBvZiB0aGUgSlNPTiBzdHJlYW0gY2xvc2VzLlxuICAgICAgXG4gICAgICAvLyBUaGlzIHNob3VsZCBiZSBkZWNvdXBsZWQgYW5kIGF0dGFjaGVkIGluc3RlYWQgdG8gdGhlIGlucHV0IHN0cmVhbVxuICAgICAgLy8gZnJvbSB0aGUgaHR0cCAob3Igd2hhdGV2ZXIpIHJlc291cmNlIGVuZGluZy5cbiAgICAgIC8vIElmIHRoaXMgZGVjb3VwbGluZyBjb3VsZCBoYXBwZW4gdGhlIFNBWCBwYXJzZXIgY291bGQgc2ltcGx5IGVtaXRcbiAgICAgIC8vIHplcm8gZXZlbnRzIG9uIGEgY29tcGxldGVseSBlbXB0eSBpbnB1dC5cbiAgICAgIGVtaXRWYWx1ZU9wZW4oe30pO1xuICAgICAgZW1pdFZhbHVlQ2xvc2UoKTtcblxuICAgICAgY2xvc2VkID0gdHJ1ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIFxuICAgIGlmIChzdGF0ZSAhPT0gVkFMVUUgfHwgZGVwdGggIT09IDApXG4gICAgICBlbWl0RXJyb3IoXCJVbmV4cGVjdGVkIGVuZFwiKTtcbiBcbiAgICBpZiAodGV4dE5vZGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZW1pdFZhbHVlT3Blbih0ZXh0Tm9kZSk7XG4gICAgICBlbWl0VmFsdWVDbG9zZSgpO1xuICAgICAgdGV4dE5vZGUgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgICBcbiAgICBjbG9zZWQgPSB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gd2hpdGVzcGFjZShjKXtcbiAgICAgcmV0dXJuIGMgPT0gJ1xccicgfHwgYyA9PSAnXFxuJyB8fCBjID09ICcgJyB8fCBjID09ICdcXHQnO1xuICB9XG4gICBcbiAgZnVuY3Rpb24gaGFuZGxlRGF0YSAoY2h1bmspIHtcbiAgICAgICAgIFxuICAgIC8vIHRoaXMgdXNlZCB0byB0aHJvdyB0aGUgZXJyb3IgYnV0IGluc2lkZSBPYm9lIHdlIHdpbGwgaGF2ZSBhbHJlYWR5XG4gICAgLy8gZ290dGVuIHRoZSBlcnJvciB3aGVuIGl0IHdhcyBlbWl0dGVkLiBUaGUgaW1wb3J0YW50IHRoaW5nIGlzIHRvXG4gICAgLy8gbm90IGNvbnRpbnVlIHdpdGggdGhlIHBhcnNlLlxuICAgIGlmIChsYXRlc3RFcnJvcilcbiAgICAgIHJldHVybjtcbiAgICAgIFxuICAgIGlmIChjbG9zZWQpIHtcbiAgICAgICByZXR1cm4gZW1pdEVycm9yKFwiQ2Fubm90IHdyaXRlIGFmdGVyIGNsb3NlXCIpO1xuICAgIH1cblxuICAgIHZhciBpID0gMDtcbiAgICBjID0gY2h1bmtbMF07IFxuXG4gICAgd2hpbGUgKGMpIHtcbiAgICAgIGlmIChpID4gMCkge1xuICAgICAgICBwID0gYztcbiAgICAgIH1cbiAgICAgIGMgPSBjaHVua1tpKytdO1xuICAgICAgaWYoIWMpIGJyZWFrO1xuXG4gICAgICBwb3NpdGlvbiArKztcbiAgICAgIGlmIChjID09IFwiXFxuXCIpIHtcbiAgICAgICAgbGluZSArKztcbiAgICAgICAgY29sdW1uID0gMDtcbiAgICAgIH0gZWxzZSBjb2x1bW4gKys7XG4gICAgICBzd2l0Y2ggKHN0YXRlKSB7XG5cbiAgICAgICAgY2FzZSBCRUdJTjpcbiAgICAgICAgICBpZiAoYyA9PT0gXCJ7XCIpIHN0YXRlID0gT1BFTl9PQkpFQ1Q7XG4gICAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCJbXCIpIHN0YXRlID0gT1BFTl9BUlJBWTtcbiAgICAgICAgICBlbHNlIGlmICghd2hpdGVzcGFjZShjKSlcbiAgICAgICAgICAgIHJldHVybiBlbWl0RXJyb3IoXCJOb24td2hpdGVzcGFjZSBiZWZvcmUge1suXCIpO1xuICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBjYXNlIE9QRU5fS0VZOlxuICAgICAgICBjYXNlIE9QRU5fT0JKRUNUOlxuICAgICAgICAgIGlmICh3aGl0ZXNwYWNlKGMpKSBjb250aW51ZTtcbiAgICAgICAgICBpZihzdGF0ZSA9PT0gT1BFTl9LRVkpIHN0YWNrLnB1c2goQ0xPU0VfS0VZKTtcbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmKGMgPT09ICd9Jykge1xuICAgICAgICAgICAgICBlbWl0VmFsdWVPcGVuKHt9KTtcbiAgICAgICAgICAgICAgZW1pdFZhbHVlQ2xvc2UoKTtcbiAgICAgICAgICAgICAgc3RhdGUgPSBzdGFjay5wb3AoKSB8fCBWQUxVRTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9IGVsc2UgIHN0YWNrLnB1c2goQ0xPU0VfT0JKRUNUKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoYyA9PT0gJ1wiJylcbiAgICAgICAgICAgICBzdGF0ZSA9IFNUUklORztcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgcmV0dXJuIGVtaXRFcnJvcihcIk1hbGZvcm1lZCBvYmplY3Qga2V5IHNob3VsZCBzdGFydCB3aXRoIFxcXCIgXCIpO1xuICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBjYXNlIENMT1NFX0tFWTpcbiAgICAgICAgY2FzZSBDTE9TRV9PQkpFQ1Q6XG4gICAgICAgICAgaWYgKHdoaXRlc3BhY2UoYykpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgaWYoYz09PSc6Jykge1xuICAgICAgICAgICAgaWYoc3RhdGUgPT09IENMT1NFX09CSkVDVCkge1xuICAgICAgICAgICAgICBzdGFjay5wdXNoKENMT1NFX09CSkVDVCk7XG5cbiAgICAgICAgICAgICAgIGlmICh0ZXh0Tm9kZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAvLyB3YXMgcHJldmlvdXNseSAoaW4gdXBzdHJlYW0gQ2xhcmluZXQpIG9uZSBldmVudFxuICAgICAgICAgICAgICAgICAgLy8gIC0gb2JqZWN0IG9wZW4gY2FtZSB3aXRoIHRoZSB0ZXh0IG9mIHRoZSBmaXJzdFxuICAgICAgICAgICAgICAgICAgZW1pdFZhbHVlT3Blbih7fSk7XG4gICAgICAgICAgICAgICAgICBlbWl0U2F4S2V5KHRleHROb2RlKTtcbiAgICAgICAgICAgICAgICAgIHRleHROb2RlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgZGVwdGgrKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICBpZiAodGV4dE5vZGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgZW1pdFNheEtleSh0ZXh0Tm9kZSk7XG4gICAgICAgICAgICAgICAgICB0ZXh0Tm9kZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICBzdGF0ZSAgPSBWQUxVRTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGM9PT0nfScpIHtcbiAgICAgICAgICAgICBpZiAodGV4dE5vZGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGVtaXRWYWx1ZU9wZW4odGV4dE5vZGUpO1xuICAgICAgICAgICAgICAgIGVtaXRWYWx1ZUNsb3NlKCk7XG4gICAgICAgICAgICAgICAgdGV4dE5vZGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgfVxuICAgICAgICAgICAgIGVtaXRWYWx1ZUNsb3NlKCk7XG4gICAgICAgICAgICBkZXB0aC0tO1xuICAgICAgICAgICAgc3RhdGUgPSBzdGFjay5wb3AoKSB8fCBWQUxVRTtcbiAgICAgICAgICB9IGVsc2UgaWYoYz09PScsJykge1xuICAgICAgICAgICAgaWYoc3RhdGUgPT09IENMT1NFX09CSkVDVClcbiAgICAgICAgICAgICAgc3RhY2sucHVzaChDTE9TRV9PQkpFQ1QpO1xuICAgICAgICAgICAgIGlmICh0ZXh0Tm9kZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgZW1pdFZhbHVlT3Blbih0ZXh0Tm9kZSk7XG4gICAgICAgICAgICAgICAgZW1pdFZhbHVlQ2xvc2UoKTtcbiAgICAgICAgICAgICAgICB0ZXh0Tm9kZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgc3RhdGUgID0gT1BFTl9LRVk7XG4gICAgICAgICAgfSBlbHNlIFxuICAgICAgICAgICAgIHJldHVybiBlbWl0RXJyb3IoJ0JhZCBvYmplY3QnKTtcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgY2FzZSBPUEVOX0FSUkFZOiAvLyBhZnRlciBhbiBhcnJheSB0aGVyZSBhbHdheXMgYSB2YWx1ZVxuICAgICAgICBjYXNlIFZBTFVFOlxuICAgICAgICAgIGlmICh3aGl0ZXNwYWNlKGMpKSBjb250aW51ZTtcbiAgICAgICAgICBpZihzdGF0ZT09PU9QRU5fQVJSQVkpIHtcbiAgICAgICAgICAgIGVtaXRWYWx1ZU9wZW4oW10pO1xuICAgICAgICAgICAgZGVwdGgrKzsgICAgICAgICAgICAgXG4gICAgICAgICAgICBzdGF0ZSA9IFZBTFVFO1xuICAgICAgICAgICAgaWYoYyA9PT0gJ10nKSB7XG4gICAgICAgICAgICAgIGVtaXRWYWx1ZUNsb3NlKCk7XG4gICAgICAgICAgICAgIGRlcHRoLS07XG4gICAgICAgICAgICAgIHN0YXRlID0gc3RhY2sucG9wKCkgfHwgVkFMVUU7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc3RhY2sucHVzaChDTE9TRV9BUlJBWSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgICAgICAgaWYoYyA9PT0gJ1wiJykgc3RhdGUgPSBTVFJJTkc7XG4gICAgICAgICAgZWxzZSBpZihjID09PSAneycpIHN0YXRlID0gT1BFTl9PQkpFQ1Q7XG4gICAgICAgICAgZWxzZSBpZihjID09PSAnWycpIHN0YXRlID0gT1BFTl9BUlJBWTtcbiAgICAgICAgICBlbHNlIGlmKGMgPT09ICd0Jykgc3RhdGUgPSBUUlVFO1xuICAgICAgICAgIGVsc2UgaWYoYyA9PT0gJ2YnKSBzdGF0ZSA9IEZBTFNFO1xuICAgICAgICAgIGVsc2UgaWYoYyA9PT0gJ24nKSBzdGF0ZSA9IE5VTEw7XG4gICAgICAgICAgZWxzZSBpZihjID09PSAnLScpIHsgLy8ga2VlcCBhbmQgY29udGludWVcbiAgICAgICAgICAgIG51bWJlck5vZGUgKz0gYztcbiAgICAgICAgICB9IGVsc2UgaWYoYz09PScwJykge1xuICAgICAgICAgICAgbnVtYmVyTm9kZSArPSBjO1xuICAgICAgICAgICAgc3RhdGUgPSBOVU1CRVJfRElHSVQ7XG4gICAgICAgICAgfSBlbHNlIGlmKCcxMjM0NTY3ODknLmluZGV4T2YoYykgIT09IC0xKSB7XG4gICAgICAgICAgICBudW1iZXJOb2RlICs9IGM7XG4gICAgICAgICAgICBzdGF0ZSA9IE5VTUJFUl9ESUdJVDtcbiAgICAgICAgICB9IGVsc2UgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBlbWl0RXJyb3IoXCJCYWQgdmFsdWVcIik7XG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGNhc2UgQ0xPU0VfQVJSQVk6XG4gICAgICAgICAgaWYoYz09PScsJykge1xuICAgICAgICAgICAgc3RhY2sucHVzaChDTE9TRV9BUlJBWSk7XG4gICAgICAgICAgICAgaWYgKHRleHROb2RlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBlbWl0VmFsdWVPcGVuKHRleHROb2RlKTtcbiAgICAgICAgICAgICAgICBlbWl0VmFsdWVDbG9zZSgpO1xuICAgICAgICAgICAgICAgIHRleHROb2RlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICBzdGF0ZSAgPSBWQUxVRTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGM9PT0nXScpIHtcbiAgICAgICAgICAgICBpZiAodGV4dE5vZGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGVtaXRWYWx1ZU9wZW4odGV4dE5vZGUpO1xuICAgICAgICAgICAgICAgIGVtaXRWYWx1ZUNsb3NlKCk7XG4gICAgICAgICAgICAgICAgdGV4dE5vZGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgfVxuICAgICAgICAgICAgIGVtaXRWYWx1ZUNsb3NlKCk7XG4gICAgICAgICAgICBkZXB0aC0tO1xuICAgICAgICAgICAgc3RhdGUgPSBzdGFjay5wb3AoKSB8fCBWQUxVRTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHdoaXRlc3BhY2UoYykpXG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIGVsc2UgXG4gICAgICAgICAgICAgcmV0dXJuIGVtaXRFcnJvcignQmFkIGFycmF5Jyk7XG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGNhc2UgU1RSSU5HOlxuICAgICAgICAgIGlmICh0ZXh0Tm9kZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHRleHROb2RlID0gXCJcIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyB0aGFua3MgdGhlamgsIHRoaXMgaXMgYW4gYWJvdXQgNTAlIHBlcmZvcm1hbmNlIGltcHJvdmVtZW50LlxuICAgICAgICAgIHZhciBzdGFydGkgICAgICAgICAgICAgID0gaS0xO1xuICAgICAgICAgICBcbiAgICAgICAgICBTVFJJTkdfQklHTE9PUDogd2hpbGUgKHRydWUpIHtcblxuICAgICAgICAgICAgLy8gemVybyBtZWFucyBcIm5vIHVuaWNvZGUgYWN0aXZlXCIuIDEtNCBtZWFuIFwicGFyc2Ugc29tZSBtb3JlXCIuIGVuZCBhZnRlciA0LlxuICAgICAgICAgICAgd2hpbGUgKHVuaWNvZGVJID4gMCkge1xuICAgICAgICAgICAgICB1bmljb2RlUyArPSBjO1xuICAgICAgICAgICAgICBjID0gY2h1bmsuY2hhckF0KGkrKyk7XG4gICAgICAgICAgICAgIGlmICh1bmljb2RlSSA9PT0gNCkge1xuICAgICAgICAgICAgICAgIC8vIFRPRE8gdGhpcyBtaWdodCBiZSBzbG93PyB3ZWxsLCBwcm9iYWJseSBub3QgdXNlZCB0b28gb2Z0ZW4gYW55d2F5XG4gICAgICAgICAgICAgICAgdGV4dE5vZGUgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludCh1bmljb2RlUywgMTYpKTtcbiAgICAgICAgICAgICAgICB1bmljb2RlSSA9IDA7XG4gICAgICAgICAgICAgICAgc3RhcnRpID0gaS0xO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHVuaWNvZGVJKys7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy8gd2UgY2FuIGp1c3QgYnJlYWsgaGVyZTogbm8gc3R1ZmYgd2Ugc2tpcHBlZCB0aGF0IHN0aWxsIGhhcyB0byBiZSBzbGljZWQgb3V0IG9yIHNvXG4gICAgICAgICAgICAgIGlmICghYykgYnJlYWsgU1RSSU5HX0JJR0xPT1A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYyA9PT0gJ1wiJyAmJiAhc2xhc2hlZCkge1xuICAgICAgICAgICAgICBzdGF0ZSA9IHN0YWNrLnBvcCgpIHx8IFZBTFVFO1xuICAgICAgICAgICAgICB0ZXh0Tm9kZSArPSBjaHVuay5zdWJzdHJpbmcoc3RhcnRpLCBpLTEpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjID09PSAnXFxcXCcgJiYgIXNsYXNoZWQpIHtcbiAgICAgICAgICAgICAgc2xhc2hlZCA9IHRydWU7XG4gICAgICAgICAgICAgIHRleHROb2RlICs9IGNodW5rLnN1YnN0cmluZyhzdGFydGksIGktMSk7XG4gICAgICAgICAgICAgICBjID0gY2h1bmsuY2hhckF0KGkrKyk7XG4gICAgICAgICAgICAgIGlmICghYykgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2xhc2hlZCkge1xuICAgICAgICAgICAgICBzbGFzaGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgaWYgKGMgPT09ICduJykgeyB0ZXh0Tm9kZSArPSAnXFxuJzsgfVxuICAgICAgICAgICAgICBlbHNlIGlmIChjID09PSAncicpIHsgdGV4dE5vZGUgKz0gJ1xccic7IH1cbiAgICAgICAgICAgICAgZWxzZSBpZiAoYyA9PT0gJ3QnKSB7IHRleHROb2RlICs9ICdcXHQnOyB9XG4gICAgICAgICAgICAgIGVsc2UgaWYgKGMgPT09ICdmJykgeyB0ZXh0Tm9kZSArPSAnXFxmJzsgfVxuICAgICAgICAgICAgICBlbHNlIGlmIChjID09PSAnYicpIHsgdGV4dE5vZGUgKz0gJ1xcYic7IH1cbiAgICAgICAgICAgICAgZWxzZSBpZiAoYyA9PT0gJ3UnKSB7XG4gICAgICAgICAgICAgICAgLy8gXFx1eHh4eC4gbWVoIVxuICAgICAgICAgICAgICAgIHVuaWNvZGVJID0gMTtcbiAgICAgICAgICAgICAgICB1bmljb2RlUyA9ICcnO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRleHROb2RlICs9IGM7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYyA9IGNodW5rLmNoYXJBdChpKyspO1xuICAgICAgICAgICAgICBzdGFydGkgPSBpLTE7XG4gICAgICAgICAgICAgIGlmICghYykgYnJlYWs7XG4gICAgICAgICAgICAgIGVsc2UgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN0cmluZ1Rva2VuUGF0dGVybi5sYXN0SW5kZXggPSBpO1xuICAgICAgICAgICAgdmFyIHJlUmVzdWx0ID0gc3RyaW5nVG9rZW5QYXR0ZXJuLmV4ZWMoY2h1bmspO1xuICAgICAgICAgICAgaWYgKCFyZVJlc3VsdCkge1xuICAgICAgICAgICAgICBpID0gY2h1bmsubGVuZ3RoKzE7XG4gICAgICAgICAgICAgIHRleHROb2RlICs9IGNodW5rLnN1YnN0cmluZyhzdGFydGksIGktMSk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSA9IHJlUmVzdWx0LmluZGV4KzE7XG4gICAgICAgICAgICBjID0gY2h1bmsuY2hhckF0KHJlUmVzdWx0LmluZGV4KTtcbiAgICAgICAgICAgIGlmICghYykge1xuICAgICAgICAgICAgICB0ZXh0Tm9kZSArPSBjaHVuay5zdWJzdHJpbmcoc3RhcnRpLCBpLTEpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGNhc2UgVFJVRTpcbiAgICAgICAgICBpZiAoIWMpICBjb250aW51ZTsgLy8gc3RyYW5nZSBidWZmZXJzXG4gICAgICAgICAgaWYgKGM9PT0ncicpIHN0YXRlID0gVFJVRTI7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgIHJldHVybiBlbWl0RXJyb3IoICdJbnZhbGlkIHRydWUgc3RhcnRlZCB3aXRoIHQnKyBjKTtcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgY2FzZSBUUlVFMjpcbiAgICAgICAgICBpZiAoIWMpICBjb250aW51ZTtcbiAgICAgICAgICBpZiAoYz09PSd1Jykgc3RhdGUgPSBUUlVFMztcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgcmV0dXJuIGVtaXRFcnJvcignSW52YWxpZCB0cnVlIHN0YXJ0ZWQgd2l0aCB0cicrIGMpO1xuICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBjYXNlIFRSVUUzOlxuICAgICAgICAgIGlmICghYykgY29udGludWU7XG4gICAgICAgICAgaWYoYz09PSdlJykge1xuICAgICAgICAgICAgZW1pdFZhbHVlT3Blbih0cnVlKTtcbiAgICAgICAgICAgIGVtaXRWYWx1ZUNsb3NlKCk7XG4gICAgICAgICAgICBzdGF0ZSA9IHN0YWNrLnBvcCgpIHx8IFZBTFVFO1xuICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgIHJldHVybiBlbWl0RXJyb3IoJ0ludmFsaWQgdHJ1ZSBzdGFydGVkIHdpdGggdHJ1JysgYyk7XG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGNhc2UgRkFMU0U6XG4gICAgICAgICAgaWYgKCFjKSAgY29udGludWU7XG4gICAgICAgICAgaWYgKGM9PT0nYScpIHN0YXRlID0gRkFMU0UyO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICByZXR1cm4gZW1pdEVycm9yKCdJbnZhbGlkIGZhbHNlIHN0YXJ0ZWQgd2l0aCBmJysgYyk7XG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGNhc2UgRkFMU0UyOlxuICAgICAgICAgIGlmICghYykgIGNvbnRpbnVlO1xuICAgICAgICAgIGlmIChjPT09J2wnKSBzdGF0ZSA9IEZBTFNFMztcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgcmV0dXJuIGVtaXRFcnJvcignSW52YWxpZCBmYWxzZSBzdGFydGVkIHdpdGggZmEnKyBjKTtcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgY2FzZSBGQUxTRTM6XG4gICAgICAgICAgaWYgKCFjKSAgY29udGludWU7XG4gICAgICAgICAgaWYgKGM9PT0ncycpIHN0YXRlID0gRkFMU0U0O1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICByZXR1cm4gZW1pdEVycm9yKCdJbnZhbGlkIGZhbHNlIHN0YXJ0ZWQgd2l0aCBmYWwnKyBjKTtcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgY2FzZSBGQUxTRTQ6XG4gICAgICAgICAgaWYgKCFjKSAgY29udGludWU7XG4gICAgICAgICAgaWYgKGM9PT0nZScpIHtcbiAgICAgICAgICAgIGVtaXRWYWx1ZU9wZW4oZmFsc2UpO1xuICAgICAgICAgICAgZW1pdFZhbHVlQ2xvc2UoKTtcbiAgICAgICAgICAgIHN0YXRlID0gc3RhY2sucG9wKCkgfHwgVkFMVUU7XG4gICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICAgcmV0dXJuIGVtaXRFcnJvcignSW52YWxpZCBmYWxzZSBzdGFydGVkIHdpdGggZmFscycrIGMpO1xuICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBjYXNlIE5VTEw6XG4gICAgICAgICAgaWYgKCFjKSAgY29udGludWU7XG4gICAgICAgICAgaWYgKGM9PT0ndScpIHN0YXRlID0gTlVMTDI7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgIHJldHVybiBlbWl0RXJyb3IoJ0ludmFsaWQgbnVsbCBzdGFydGVkIHdpdGggbicrIGMpO1xuICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBjYXNlIE5VTEwyOlxuICAgICAgICAgIGlmICghYykgIGNvbnRpbnVlO1xuICAgICAgICAgIGlmIChjPT09J2wnKSBzdGF0ZSA9IE5VTEwzO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICByZXR1cm4gZW1pdEVycm9yKCdJbnZhbGlkIG51bGwgc3RhcnRlZCB3aXRoIG51JysgYyk7XG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGNhc2UgTlVMTDM6XG4gICAgICAgICAgaWYgKCFjKSBjb250aW51ZTtcbiAgICAgICAgICBpZihjPT09J2wnKSB7XG4gICAgICAgICAgICBlbWl0VmFsdWVPcGVuKG51bGwpO1xuICAgICAgICAgICAgZW1pdFZhbHVlQ2xvc2UoKTtcbiAgICAgICAgICAgIHN0YXRlID0gc3RhY2sucG9wKCkgfHwgVkFMVUU7XG4gICAgICAgICAgfSBlbHNlIFxuICAgICAgICAgICAgIHJldHVybiBlbWl0RXJyb3IoJ0ludmFsaWQgbnVsbCBzdGFydGVkIHdpdGggbnVsJysgYyk7XG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGNhc2UgTlVNQkVSX0RFQ0lNQUxfUE9JTlQ6XG4gICAgICAgICAgaWYoYz09PScuJykge1xuICAgICAgICAgICAgbnVtYmVyTm9kZSArPSBjO1xuICAgICAgICAgICAgc3RhdGUgICAgICAgPSBOVU1CRVJfRElHSVQ7XG4gICAgICAgICAgfSBlbHNlIFxuICAgICAgICAgICAgIHJldHVybiBlbWl0RXJyb3IoJ0xlYWRpbmcgemVybyBub3QgZm9sbG93ZWQgYnkgLicpO1xuICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBjYXNlIE5VTUJFUl9ESUdJVDpcbiAgICAgICAgICBpZignMDEyMzQ1Njc4OScuaW5kZXhPZihjKSAhPT0gLTEpIG51bWJlck5vZGUgKz0gYztcbiAgICAgICAgICBlbHNlIGlmIChjPT09Jy4nKSB7XG4gICAgICAgICAgICBpZihudW1iZXJOb2RlLmluZGV4T2YoJy4nKSE9PS0xKVxuICAgICAgICAgICAgICAgcmV0dXJuIGVtaXRFcnJvcignSW52YWxpZCBudW1iZXIgaGFzIHR3byBkb3RzJyk7XG4gICAgICAgICAgICBudW1iZXJOb2RlICs9IGM7XG4gICAgICAgICAgfSBlbHNlIGlmIChjPT09J2UnIHx8IGM9PT0nRScpIHtcbiAgICAgICAgICAgIGlmKG51bWJlck5vZGUuaW5kZXhPZignZScpIT09LTEgfHxcbiAgICAgICAgICAgICAgIG51bWJlck5vZGUuaW5kZXhPZignRScpIT09LTEgKVxuICAgICAgICAgICAgICAgcmV0dXJuIGVtaXRFcnJvcignSW52YWxpZCBudW1iZXIgaGFzIHR3byBleHBvbmVudGlhbCcpO1xuICAgICAgICAgICAgbnVtYmVyTm9kZSArPSBjO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYz09PVwiK1wiIHx8IGM9PT1cIi1cIikge1xuICAgICAgICAgICAgaWYoIShwPT09J2UnIHx8IHA9PT0nRScpKVxuICAgICAgICAgICAgICAgcmV0dXJuIGVtaXRFcnJvcignSW52YWxpZCBzeW1ib2wgaW4gbnVtYmVyJyk7XG4gICAgICAgICAgICBudW1iZXJOb2RlICs9IGM7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChudW1iZXJOb2RlKSB7XG4gICAgICAgICAgICAgIGVtaXRWYWx1ZU9wZW4ocGFyc2VGbG9hdChudW1iZXJOb2RlKSk7XG4gICAgICAgICAgICAgIGVtaXRWYWx1ZUNsb3NlKCk7XG4gICAgICAgICAgICAgIG51bWJlck5vZGUgPSBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaS0tOyAvLyBnbyBiYWNrIG9uZVxuICAgICAgICAgICAgc3RhdGUgPSBzdGFjay5wb3AoKSB8fCBWQUxVRTtcbiAgICAgICAgICB9XG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuIGVtaXRFcnJvcihcIlVua25vd24gc3RhdGU6IFwiICsgc3RhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocG9zaXRpb24gPj0gYnVmZmVyQ2hlY2tQb3NpdGlvbilcbiAgICAgIGNoZWNrQnVmZmVyTGVuZ3RoKCk7XG4gIH1cbn1cblxuXG4vKiogXG4gKiBBIGJyaWRnZSB1c2VkIHRvIGFzc2lnbiBzdGF0ZWxlc3MgZnVuY3Rpb25zIHRvIGxpc3RlbiB0byBjbGFyaW5ldC5cbiAqIFxuICogQXMgd2VsbCBhcyB0aGUgcGFyYW1ldGVyIGZyb20gY2xhcmluZXQsIGVhY2ggY2FsbGJhY2sgd2lsbCBhbHNvIGJlIHBhc3NlZFxuICogdGhlIHJlc3VsdCBvZiB0aGUgbGFzdCBjYWxsYmFjay5cbiAqIFxuICogVGhpcyBtYXkgYWxzbyBiZSB1c2VkIHRvIGNsZWFyIGFsbCBsaXN0ZW5lcnMgYnkgYXNzaWduaW5nIHplcm8gaGFuZGxlcnM6XG4gKiBcbiAqICAgIGFzY2VudE1hbmFnZXIoIGNsYXJpbmV0LCB7fSApXG4gKi9cbmZ1bmN0aW9uIGFzY2VudE1hbmFnZXIob2JvZUJ1cywgaGFuZGxlcnMpe1xuICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICBcbiAgIHZhciBsaXN0ZW5lcklkID0ge30sXG4gICAgICAgYXNjZW50O1xuXG4gICBmdW5jdGlvbiBzdGF0ZUFmdGVyKGhhbmRsZXIpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihwYXJhbSl7XG4gICAgICAgICBhc2NlbnQgPSBoYW5kbGVyKCBhc2NlbnQsIHBhcmFtKTtcbiAgICAgIH1cbiAgIH1cbiAgIFxuICAgZm9yKCB2YXIgZXZlbnROYW1lIGluIGhhbmRsZXJzICkge1xuXG4gICAgICBvYm9lQnVzKGV2ZW50TmFtZSkub24oc3RhdGVBZnRlcihoYW5kbGVyc1tldmVudE5hbWVdKSwgbGlzdGVuZXJJZCk7XG4gICB9XG4gICBcbiAgIG9ib2VCdXMoTk9ERV9TV0FQKS5vbihmdW5jdGlvbihuZXdOb2RlKSB7XG4gICAgICBcbiAgICAgIHZhciBvbGRIZWFkID0gaGVhZChhc2NlbnQpLFxuICAgICAgICAgIGtleSA9IGtleU9mKG9sZEhlYWQpLFxuICAgICAgICAgIGFuY2VzdG9ycyA9IHRhaWwoYXNjZW50KSxcbiAgICAgICAgICBwYXJlbnROb2RlO1xuXG4gICAgICBpZiggYW5jZXN0b3JzICkge1xuICAgICAgICAgcGFyZW50Tm9kZSA9IG5vZGVPZihoZWFkKGFuY2VzdG9ycykpO1xuICAgICAgICAgcGFyZW50Tm9kZVtrZXldID0gbmV3Tm9kZTtcbiAgICAgIH1cbiAgIH0pO1xuXG4gICBvYm9lQnVzKE5PREVfRFJPUCkub24oZnVuY3Rpb24oKSB7XG5cbiAgICAgIHZhciBvbGRIZWFkID0gaGVhZChhc2NlbnQpLFxuICAgICAgICAgIGtleSA9IGtleU9mKG9sZEhlYWQpLFxuICAgICAgICAgIGFuY2VzdG9ycyA9IHRhaWwoYXNjZW50KSxcbiAgICAgICAgICBwYXJlbnROb2RlO1xuXG4gICAgICBpZiggYW5jZXN0b3JzICkge1xuICAgICAgICAgcGFyZW50Tm9kZSA9IG5vZGVPZihoZWFkKGFuY2VzdG9ycykpO1xuIFxuICAgICAgICAgZGVsZXRlIHBhcmVudE5vZGVba2V5XTtcbiAgICAgIH1cbiAgIH0pO1xuXG4gICBvYm9lQnVzKEFCT1JUSU5HKS5vbihmdW5jdGlvbigpe1xuICAgICAgXG4gICAgICBmb3IoIHZhciBldmVudE5hbWUgaW4gaGFuZGxlcnMgKSB7XG4gICAgICAgICBvYm9lQnVzKGV2ZW50TmFtZSkudW4obGlzdGVuZXJJZCk7XG4gICAgICB9XG4gICB9KTsgICBcbn1cblxuLy8gYmFzZWQgb24gZ2lzdCBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9tb25zdXIvNzA2ODM5XG5cbi8qKlxuICogWG1sSHR0cFJlcXVlc3QncyBnZXRBbGxSZXNwb25zZUhlYWRlcnMoKSBtZXRob2QgcmV0dXJucyBhIHN0cmluZyBvZiByZXNwb25zZVxuICogaGVhZGVycyBhY2NvcmRpbmcgdG8gdGhlIGZvcm1hdCBkZXNjcmliZWQgaGVyZTpcbiAqIGh0dHA6Ly93d3cudzMub3JnL1RSL1hNTEh0dHBSZXF1ZXN0LyN0aGUtZ2V0YWxscmVzcG9uc2VoZWFkZXJzLW1ldGhvZFxuICogVGhpcyBtZXRob2QgcGFyc2VzIHRoYXQgc3RyaW5nIGludG8gYSB1c2VyLWZyaWVuZGx5IGtleS92YWx1ZSBwYWlyIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gcGFyc2VSZXNwb25zZUhlYWRlcnMoaGVhZGVyU3RyKSB7XG4gICB2YXIgaGVhZGVycyA9IHt9O1xuICAgXG4gICBoZWFkZXJTdHIgJiYgaGVhZGVyU3RyLnNwbGl0KCdcXHUwMDBkXFx1MDAwYScpXG4gICAgICAuZm9yRWFjaChmdW5jdGlvbihoZWFkZXJQYWlyKXtcbiAgIFxuICAgICAgICAgLy8gQ2FuJ3QgdXNlIHNwbGl0KCkgaGVyZSBiZWNhdXNlIGl0IGRvZXMgdGhlIHdyb25nIHRoaW5nXG4gICAgICAgICAvLyBpZiB0aGUgaGVhZGVyIHZhbHVlIGhhcyB0aGUgc3RyaW5nIFwiOiBcIiBpbiBpdC5cbiAgICAgICAgIHZhciBpbmRleCA9IGhlYWRlclBhaXIuaW5kZXhPZignXFx1MDAzYVxcdTAwMjAnKTtcbiAgICAgICAgIFxuICAgICAgICAgaGVhZGVyc1toZWFkZXJQYWlyLnN1YnN0cmluZygwLCBpbmRleCldIFxuICAgICAgICAgICAgICAgICAgICAgPSBoZWFkZXJQYWlyLnN1YnN0cmluZyhpbmRleCArIDIpO1xuICAgICAgfSk7XG4gICBcbiAgIHJldHVybiBoZWFkZXJzO1xufVxuXG4vKipcbiAqIERldGVjdCBpZiBhIGdpdmVuIFVSTCBpcyBjcm9zcy1vcmlnaW4gaW4gdGhlIHNjb3BlIG9mIHRoZVxuICogY3VycmVudCBwYWdlLlxuICogXG4gKiBCcm93c2VyIG9ubHkgKHNpbmNlIGNyb3NzLW9yaWdpbiBoYXMgbm8gbWVhbmluZyBpbiBOb2RlLmpzKVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYWdlTG9jYXRpb24gLSBhcyBpbiB3aW5kb3cubG9jYXRpb25cbiAqIEBwYXJhbSB7T2JqZWN0fSBhamF4SG9zdCAtIGFuIG9iamVjdCBsaWtlIHdpbmRvdy5sb2NhdGlvbiBkZXNjcmliaW5nIHRoZSBcbiAqICAgIG9yaWdpbiBvZiB0aGUgdXJsIHRoYXQgd2Ugd2FudCB0byBhamF4IGluXG4gKi9cbmZ1bmN0aW9uIGlzQ3Jvc3NPcmlnaW4ocGFnZUxvY2F0aW9uLCBhamF4SG9zdCkge1xuXG4gICAvKlxuICAgICogTkI6IGRlZmF1bHRQb3J0IG9ubHkga25vd3MgaHR0cCBhbmQgaHR0cHMuXG4gICAgKiBSZXR1cm5zIHVuZGVmaW5lZCBvdGhlcndpc2UuXG4gICAgKi9cbiAgIGZ1bmN0aW9uIGRlZmF1bHRQb3J0KHByb3RvY29sKSB7XG4gICAgICByZXR1cm4geydodHRwOic6ODAsICdodHRwczonOjQ0M31bcHJvdG9jb2xdO1xuICAgfVxuICAgXG4gICBmdW5jdGlvbiBwb3J0T2YobG9jYXRpb24pIHtcbiAgICAgIC8vIHBhZ2VMb2NhdGlvbiBzaG91bGQgYWx3YXlzIGhhdmUgYSBwcm90b2NvbC4gYWpheEhvc3QgaWYgbm8gcG9ydCBvclxuICAgICAgLy8gcHJvdG9jb2wgaXMgc3BlY2lmaWVkLCBzaG91bGQgdXNlIHRoZSBwb3J0IG9mIHRoZSBjb250YWluaW5nIHBhZ2VcbiAgICAgIFxuICAgICAgcmV0dXJuIGxvY2F0aW9uLnBvcnQgfHwgZGVmYXVsdFBvcnQobG9jYXRpb24ucHJvdG9jb2x8fHBhZ2VMb2NhdGlvbi5wcm90b2NvbCk7XG4gICB9XG5cbiAgIC8vIGlmIGFqYXhIb3N0IGRvZXNuJ3QgZ2l2ZSBhIGRvbWFpbiwgcG9ydCBpcyB0aGUgc2FtZSBhcyBwYWdlTG9jYXRpb25cbiAgIC8vIGl0IGNhbid0IGdpdmUgYSBwcm90b2NvbCBidXQgbm90IGEgZG9tYWluXG4gICAvLyBpdCBjYW4ndCBnaXZlIGEgcG9ydCBidXQgbm90IGEgZG9tYWluXG4gICBcbiAgIHJldHVybiAhISggIChhamF4SG9zdC5wcm90b2NvbCAgJiYgKGFqYXhIb3N0LnByb3RvY29sICAhPSBwYWdlTG9jYXRpb24ucHJvdG9jb2wpKSB8fFxuICAgICAgICAgICAgICAgKGFqYXhIb3N0Lmhvc3QgICAgICAmJiAoYWpheEhvc3QuaG9zdCAgICAgICE9IHBhZ2VMb2NhdGlvbi5ob3N0KSkgICAgIHx8XG4gICAgICAgICAgICAgICAoYWpheEhvc3QuaG9zdCAgICAgICYmIChwb3J0T2YoYWpheEhvc3QpICE9IHBvcnRPZihwYWdlTG9jYXRpb24pKSlcbiAgICAgICAgICApO1xufVxuXG4vKiB0dXJuIGFueSB1cmwgaW50byBhbiBvYmplY3QgbGlrZSB3aW5kb3cubG9jYXRpb24gKi9cbmZ1bmN0aW9uIHBhcnNlVXJsT3JpZ2luKHVybCkge1xuICAgLy8gdXJsIGNvdWxkIGJlIGRvbWFpbi1yZWxhdGl2ZVxuICAgLy8gdXJsIGNvdWxkIGdpdmUgYSBkb21haW5cblxuICAgLy8gY3Jvc3Mgb3JpZ2luIG1lYW5zOlxuICAgLy8gICAgc2FtZSBkb21haW5cbiAgIC8vICAgIHNhbWUgcG9ydFxuICAgLy8gICAgc29tZSBwcm90b2NvbFxuICAgLy8gc28sIHNhbWUgZXZlcnl0aGluZyB1cCB0byB0aGUgZmlyc3QgKHNpbmdsZSkgc2xhc2ggXG4gICAvLyBpZiBzdWNoIGlzIGdpdmVuXG4gICAvL1xuICAgLy8gY2FuIGlnbm9yZSBldmVyeXRoaW5nIGFmdGVyIHRoYXQgICBcbiAgIFxuICAgdmFyIFVSTF9IT1NUX1BBVFRFUk4gPSAvKFxcdys6KT8oPzpcXC9cXC8pKFtcXHcuLV0rKT8oPzo6KFxcZCspKT9cXC8/LyxcblxuICAgICAgICAgLy8gaWYgbm8gbWF0Y2gsIHVzZSBhbiBlbXB0eSBhcnJheSBzbyB0aGF0XG4gICAgICAgICAvLyBzdWJleHByZXNzaW9ucyAxLDIsMyBhcmUgYWxsIHVuZGVmaW5lZFxuICAgICAgICAgLy8gYW5kIHdpbGwgdWx0aW1hdGVseSByZXR1cm4gYWxsIGVtcHR5XG4gICAgICAgICAvLyBzdHJpbmdzIGFzIHRoZSBwYXJzZSByZXN1bHQ6XG4gICAgICAgdXJsSG9zdE1hdGNoID0gVVJMX0hPU1RfUEFUVEVSTi5leGVjKHVybCkgfHwgW107XG4gICBcbiAgIHJldHVybiB7XG4gICAgICBwcm90b2NvbDogICB1cmxIb3N0TWF0Y2hbMV0gfHwgJycsXG4gICAgICBob3N0OiAgICAgICB1cmxIb3N0TWF0Y2hbMl0gfHwgJycsXG4gICAgICBwb3J0OiAgICAgICB1cmxIb3N0TWF0Y2hbM10gfHwgJydcbiAgIH07XG59XG5cbmZ1bmN0aW9uIGh0dHBUcmFuc3BvcnQoKXtcbiAgIHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbn1cblxuLyoqXG4gKiBBIHdyYXBwZXIgYXJvdW5kIHRoZSBicm93c2VyIFhtbEh0dHBSZXF1ZXN0IG9iamVjdCB0aGF0IHJhaXNlcyBhbiBcbiAqIGV2ZW50IHdoZW5ldmVyIGEgbmV3IHBhcnQgb2YgdGhlIHJlc3BvbnNlIGlzIGF2YWlsYWJsZS5cbiAqIFxuICogSW4gb2xkZXIgYnJvd3NlcnMgcHJvZ3Jlc3NpdmUgcmVhZGluZyBpcyBpbXBvc3NpYmxlIHNvIGFsbCB0aGUgXG4gKiBjb250ZW50IGlzIGdpdmVuIGluIGEgc2luZ2xlIGNhbGwuIEZvciBuZXdlciBvbmVzIHNldmVyYWwgZXZlbnRzXG4gKiBzaG91bGQgYmUgcmFpc2VkLCBhbGxvd2luZyBwcm9ncmVzc2l2ZSBpbnRlcnByZXRhdGlvbiBvZiB0aGUgcmVzcG9uc2UuXG4gKiAgICAgIFxuICogQHBhcmFtIHtGdW5jdGlvbn0gb2JvZUJ1cyBhbiBldmVudCBidXMgbG9jYWwgdG8gdGhpcyBPYm9lIGluc3RhbmNlXG4gKiBAcGFyYW0ge1hNTEh0dHBSZXF1ZXN0fSB4aHIgdGhlIHhociB0byB1c2UgYXMgdGhlIHRyYW5zcG9ydC4gVW5kZXIgbm9ybWFsXG4gKiAgICAgICAgICBvcGVyYXRpb24sIHdpbGwgaGF2ZSBiZWVuIGNyZWF0ZWQgdXNpbmcgaHR0cFRyYW5zcG9ydCgpIGFib3ZlXG4gKiAgICAgICAgICBidXQgZm9yIHRlc3RzIGEgc3R1YiBjYW4gYmUgcHJvdmlkZWQgaW5zdGVhZC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2Qgb25lIG9mICdHRVQnICdQT1NUJyAnUFVUJyAnUEFUQ0gnICdERUxFVEUnXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsIHRoZSB1cmwgdG8gbWFrZSBhIHJlcXVlc3QgdG9cbiAqIEBwYXJhbSB7U3RyaW5nfE51bGx9IGRhdGEgc29tZSBjb250ZW50IHRvIGJlIHNlbnQgd2l0aCB0aGUgcmVxdWVzdC5cbiAqICAgICAgICAgICAgICAgICAgICAgIE9ubHkgdmFsaWQgaWYgbWV0aG9kIGlzIFBPU1Qgb3IgUFVULlxuICogQHBhcmFtIHtPYmplY3R9IFtoZWFkZXJzXSB0aGUgaHR0cCByZXF1ZXN0IGhlYWRlcnMgdG8gc2VuZFxuICogQHBhcmFtIHtib29sZWFufSB3aXRoQ3JlZGVudGlhbHMgdGhlIFhIUiB3aXRoQ3JlZGVudGlhbHMgcHJvcGVydHkgd2lsbCBiZVxuICogICAgc2V0IHRvIHRoaXMgdmFsdWVcbiAqLyAgXG5mdW5jdGlvbiBzdHJlYW1pbmdIdHRwKG9ib2VCdXMsIHhociwgbWV0aG9kLCB1cmwsIGRhdGEsIGhlYWRlcnMsIHdpdGhDcmVkZW50aWFscykge1xuICAgICAgICAgICBcbiAgIFwidXNlIHN0cmljdFwiO1xuICAgXG4gICB2YXIgZW1pdFN0cmVhbURhdGEgPSBvYm9lQnVzKFNUUkVBTV9EQVRBKS5lbWl0LFxuICAgICAgIGVtaXRGYWlsICAgICAgID0gb2JvZUJ1cyhGQUlMX0VWRU5UKS5lbWl0LFxuICAgICAgIG51bWJlck9mQ2hhcnNBbHJlYWR5R2l2ZW5Ub0NhbGxiYWNrID0gMCxcbiAgICAgICBzdGlsbFRvU2VuZFN0YXJ0RXZlbnQgPSB0cnVlO1xuXG4gICAvLyBXaGVuIGFuIEFCT1JUSU5HIG1lc3NhZ2UgaXMgcHV0IG9uIHRoZSBldmVudCBidXMgYWJvcnQgXG4gICAvLyB0aGUgYWpheCByZXF1ZXN0ICAgICAgICAgXG4gICBvYm9lQnVzKCBBQk9SVElORyApLm9uKCBmdW5jdGlvbigpe1xuICBcbiAgICAgIC8vIGlmIHdlIGtlZXAgdGhlIG9ucmVhZHlzdGF0ZWNoYW5nZSB3aGlsZSBhYm9ydGluZyB0aGUgWEhSIGdpdmVzIFxuICAgICAgLy8gYSBjYWxsYmFjayBsaWtlIGEgc3VjY2Vzc2Z1bCBjYWxsIHNvIGZpcnN0IHJlbW92ZSB0aGlzIGxpc3RlbmVyXG4gICAgICAvLyBieSBhc3NpZ25pbmcgbnVsbDpcbiAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xuICAgICAgICAgICAgXG4gICAgICB4aHIuYWJvcnQoKTtcbiAgIH0pO1xuXG4gICAvKiogXG4gICAgKiBIYW5kbGUgaW5wdXQgZnJvbSB0aGUgdW5kZXJseWluZyB4aHI6IGVpdGhlciBhIHN0YXRlIGNoYW5nZSxcbiAgICAqIHRoZSBwcm9ncmVzcyBldmVudCBvciB0aGUgcmVxdWVzdCBiZWluZyBjb21wbGV0ZS5cbiAgICAqL1xuICAgZnVuY3Rpb24gaGFuZGxlUHJvZ3Jlc3MoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgIHZhciB0ZXh0U29GYXIgPSB4aHIucmVzcG9uc2VUZXh0LFxuICAgICAgICAgIG5ld1RleHQgPSB0ZXh0U29GYXIuc3Vic3RyKG51bWJlck9mQ2hhcnNBbHJlYWR5R2l2ZW5Ub0NhbGxiYWNrKTtcbiAgICAgIFxuICAgICAgXG4gICAgICAvKiBSYWlzZSB0aGUgZXZlbnQgZm9yIG5ldyB0ZXh0LlxuICAgICAgXG4gICAgICAgICBPbiBvbGRlciBicm93c2VycywgdGhlIG5ldyB0ZXh0IGlzIHRoZSB3aG9sZSByZXNwb25zZS4gXG4gICAgICAgICBPbiBuZXdlci9iZXR0ZXIgb25lcywgdGhlIGZyYWdtZW50IHBhcnQgdGhhdCB3ZSBnb3Qgc2luY2UgXG4gICAgICAgICBsYXN0IHByb2dyZXNzLiAqL1xuICAgICAgICAgXG4gICAgICBpZiggbmV3VGV4dCApIHtcbiAgICAgICAgIGVtaXRTdHJlYW1EYXRhKCBuZXdUZXh0ICk7XG4gICAgICB9IFxuXG4gICAgICBudW1iZXJPZkNoYXJzQWxyZWFkeUdpdmVuVG9DYWxsYmFjayA9IGxlbih0ZXh0U29GYXIpO1xuICAgfVxuICAgXG4gICBcbiAgIGlmKCdvbnByb2dyZXNzJyBpbiB4aHIpeyAgLy8gZGV0ZWN0IGJyb3dzZXIgc3VwcG9ydCBmb3IgcHJvZ3Jlc3NpdmUgZGVsaXZlcnlcbiAgICAgIHhoci5vbnByb2dyZXNzID0gaGFuZGxlUHJvZ3Jlc3M7XG4gICB9XG4gICAgICBcbiAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcblxuICAgICAgZnVuY3Rpb24gc2VuZFN0YXJ0SWZOb3RBbHJlYWR5KCkge1xuICAgICAgICAgLy8gSW50ZXJuZXQgRXhwbG9yZXIgaXMgdmVyeSB1bnJlbGlhYmxlIGFzIHRvIHdoZW4geGhyLnN0YXR1cyBldGMgY2FuXG4gICAgICAgICAvLyBiZSByZWFkIHNvIGhhcyB0byBiZSBwcm90ZWN0ZWQgd2l0aCB0cnkvY2F0Y2ggYW5kIHRyaWVkIGFnYWluIG9uIFxuICAgICAgICAgLy8gdGhlIG5leHQgcmVhZHlTdGF0ZSBpZiBpdCBmYWlsc1xuICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgc3RpbGxUb1NlbmRTdGFydEV2ZW50ICYmIG9ib2VCdXMoIEhUVFBfU1RBUlQgKS5lbWl0KFxuICAgICAgICAgICAgICAgeGhyLnN0YXR1cyxcbiAgICAgICAgICAgICAgIHBhcnNlUmVzcG9uc2VIZWFkZXJzKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSkgKTtcbiAgICAgICAgICAgIHN0aWxsVG9TZW5kU3RhcnRFdmVudCA9IGZhbHNlO1xuICAgICAgICAgfSBjYXRjaChlKXsvKiBkbyBub3RoaW5nLCB3aWxsIHRyeSBhZ2FpbiBvbiBuZXh0IHJlYWR5U3RhdGUqL31cbiAgICAgIH1cbiAgICAgIFxuICAgICAgc3dpdGNoKCB4aHIucmVhZHlTdGF0ZSApIHtcbiAgICAgICAgICAgICAgIFxuICAgICAgICAgY2FzZSAyOiAvLyBIRUFERVJTX1JFQ0VJVkVEXG4gICAgICAgICBjYXNlIDM6IC8vIExPQURJTkdcbiAgICAgICAgICAgIHJldHVybiBzZW5kU3RhcnRJZk5vdEFscmVhZHkoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgY2FzZSA0OiAvLyBET05FXG4gICAgICAgICAgICBzZW5kU3RhcnRJZk5vdEFscmVhZHkoKTsgLy8gaWYgeGhyLnN0YXR1cyBoYXNuJ3QgYmVlbiBhdmFpbGFibGUgeWV0LCBpdCBtdXN0IGJlIE5PVywgaHVoIElFP1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBpcyB0aGlzIGEgMnh4IGh0dHAgY29kZT9cbiAgICAgICAgICAgIHZhciBzdWNjZXNzZnVsID0gU3RyaW5nKHhoci5zdGF0dXMpWzBdID09IDI7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmKCBzdWNjZXNzZnVsICkge1xuICAgICAgICAgICAgICAgLy8gSW4gQ2hyb21lIDI5IChub3QgMjgpIG5vIG9ucHJvZ3Jlc3MgaXMgZW1pdHRlZCB3aGVuIGEgcmVzcG9uc2VcbiAgICAgICAgICAgICAgIC8vIGlzIGNvbXBsZXRlIGJlZm9yZSB0aGUgb25sb2FkLiBXZSBuZWVkIHRvIGFsd2F5cyBkbyBoYW5kbGVJbnB1dFxuICAgICAgICAgICAgICAgLy8gaW4gY2FzZSB3ZSBnZXQgdGhlIGxvYWQgYnV0IGhhdmUgbm90IGhhZCBhIGZpbmFsIHByb2dyZXNzIGV2ZW50LlxuICAgICAgICAgICAgICAgLy8gVGhpcyBsb29rcyBsaWtlIGEgYnVnIGFuZCBtYXkgY2hhbmdlIGluIGZ1dHVyZSBidXQgbGV0J3MgdGFrZVxuICAgICAgICAgICAgICAgLy8gdGhlIHNhZmVzdCBhcHByb2FjaCBhbmQgYXNzdW1lIHdlIG1pZ2h0IG5vdCBoYXZlIHJlY2VpdmVkIGEgXG4gICAgICAgICAgICAgICAvLyBwcm9ncmVzcyBldmVudCBmb3IgZWFjaCBwYXJ0IG9mIHRoZSByZXNwb25zZVxuICAgICAgICAgICAgICAgaGFuZGxlUHJvZ3Jlc3MoKTtcbiAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgb2JvZUJ1cyhTVFJFQU1fRU5EKS5lbWl0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICBlbWl0RmFpbCggZXJyb3JSZXBvcnQoXG4gICAgICAgICAgICAgICAgICB4aHIuc3RhdHVzLCBcbiAgICAgICAgICAgICAgICAgIHhoci5yZXNwb25zZVRleHRcbiAgICAgICAgICAgICAgICkpO1xuICAgICAgICAgICAgfVxuICAgICAgfVxuICAgfTtcbiAgIFxuICAgdHJ5e1xuICAgXG4gICAgICB4aHIub3BlbihtZXRob2QsIHVybCwgdHJ1ZSk7XG4gICBcbiAgICAgIGZvciggdmFyIGhlYWRlck5hbWUgaW4gaGVhZGVycyApe1xuICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyTmFtZSwgaGVhZGVyc1toZWFkZXJOYW1lXSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmKCAhaXNDcm9zc09yaWdpbih3aW5kb3cubG9jYXRpb24sIHBhcnNlVXJsT3JpZ2luKHVybCkpICkge1xuICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ1gtUmVxdWVzdGVkLVdpdGgnLCAnWE1MSHR0cFJlcXVlc3QnKTtcbiAgICAgIH1cblxuICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHdpdGhDcmVkZW50aWFscztcbiAgICAgIFxuICAgICAgeGhyLnNlbmQoZGF0YSk7XG4gICAgICBcbiAgIH0gY2F0Y2goIGUgKSB7XG4gICAgICBcbiAgICAgIC8vIFRvIGtlZXAgYSBjb25zaXN0ZW50IGludGVyZmFjZSB3aXRoIE5vZGUsIHdlIGNhbid0IGVtaXQgYW4gZXZlbnQgaGVyZS5cbiAgICAgIC8vIE5vZGUncyBzdHJlYW1pbmcgaHR0cCBhZGFwdG9yIHJlY2VpdmVzIHRoZSBlcnJvciBhcyBhbiBhc3luY2hyb25vdXNcbiAgICAgIC8vIGV2ZW50IHJhdGhlciB0aGFuIGFzIGFuIGV4Y2VwdGlvbi4gSWYgd2UgZW1pdHRlZCBub3csIHRoZSBPYm9lIHVzZXJcbiAgICAgIC8vIGhhcyBoYWQgbm8gY2hhbmNlIHRvIGFkZCBhIC5mYWlsIGxpc3RlbmVyIHNvIHRoZXJlIGlzIG5vIHdheVxuICAgICAgLy8gdGhlIGV2ZW50IGNvdWxkIGJlIHVzZWZ1bC4gRm9yIGJvdGggdGhlc2UgcmVhc29ucyBkZWZlciB0aGVcbiAgICAgIC8vIGZpcmluZyB0byB0aGUgbmV4dCBKUyBmcmFtZS4gIFxuICAgICAgd2luZG93LnNldFRpbWVvdXQoXG4gICAgICAgICBwYXJ0aWFsQ29tcGxldGUoZW1pdEZhaWwsIGVycm9yUmVwb3J0KHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBlKSlcbiAgICAgICwgIDBcbiAgICAgICk7XG4gICB9ICAgICAgICAgICAgXG59XG5cbnZhciBqc29uUGF0aFN5bnRheCA9IChmdW5jdGlvbigpIHtcbiBcbiAgIHZhclxuICAgXG4gICAvKiogXG4gICAgKiBFeHBvcnQgYSByZWd1bGFyIGV4cHJlc3Npb24gYXMgYSBzaW1wbGUgZnVuY3Rpb24gYnkgZXhwb3NpbmcganVzdCBcbiAgICAqIHRoZSBSZWdleCNleGVjLiBUaGlzIGFsbG93cyByZWdleCB0ZXN0cyB0byBiZSB1c2VkIHVuZGVyIHRoZSBzYW1lIFxuICAgICogaW50ZXJmYWNlIGFzIGRpZmZlcmVudGx5IGltcGxlbWVudGVkIHRlc3RzLCBvciBmb3IgYSB1c2VyIG9mIHRoZVxuICAgICogdGVzdHMgdG8gbm90IGNvbmNlcm4gdGhlbXNlbHZlcyB3aXRoIHRoZWlyIGltcGxlbWVudGF0aW9uIGFzIHJlZ3VsYXJcbiAgICAqIGV4cHJlc3Npb25zLlxuICAgICogXG4gICAgKiBUaGlzIGNvdWxkIGFsc28gYmUgZXhwcmVzc2VkIHBvaW50LWZyZWUgYXM6XG4gICAgKiAgIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kLmJpbmQoUmVnRXhwLnByb3RvdHlwZS5leGVjKSxcbiAgICAqICAgXG4gICAgKiBCdXQgdGhhdCdzIGZhciB0b28gY29uZnVzaW5nISAoYW5kIG5vdCBldmVuIHNtYWxsZXIgb25jZSBtaW5pZmllZCBcbiAgICAqIGFuZCBnemlwcGVkKVxuICAgICovXG4gICAgICAgcmVnZXhEZXNjcmlwdG9yID0gZnVuY3Rpb24gcmVnZXhEZXNjcmlwdG9yKHJlZ2V4KSB7XG4gICAgICAgICAgICByZXR1cm4gcmVnZXguZXhlYy5iaW5kKHJlZ2V4KTtcbiAgICAgICB9XG4gICAgICAgXG4gICAvKipcbiAgICAqIEpvaW4gc2V2ZXJhbCByZWd1bGFyIGV4cHJlc3Npb25zIGFuZCBleHByZXNzIGFzIGEgZnVuY3Rpb24uXG4gICAgKiBUaGlzIGFsbG93cyB0aGUgdG9rZW4gcGF0dGVybnMgdG8gcmV1c2UgY29tcG9uZW50IHJlZ3VsYXIgZXhwcmVzc2lvbnNcbiAgICAqIGluc3RlYWQgb2YgYmVpbmcgZXhwcmVzc2VkIGluIGZ1bGwgdXNpbmcgaHVnZSBhbmQgY29uZnVzaW5nIHJlZ3VsYXJcbiAgICAqIGV4cHJlc3Npb25zLlxuICAgICovICAgICAgIFxuICAgLCAgIGpzb25QYXRoQ2xhdXNlID0gdmFyQXJncyhmdW5jdGlvbiggY29tcG9uZW50UmVnZXhlcyApIHtcblxuICAgICAgICAgICAgLy8gVGhlIHJlZ3VsYXIgZXhwcmVzc2lvbnMgYWxsIHN0YXJ0IHdpdGggXiBiZWNhdXNlIHdlIFxuICAgICAgICAgICAgLy8gb25seSB3YW50IHRvIGZpbmQgbWF0Y2hlcyBhdCB0aGUgc3RhcnQgb2YgdGhlIFxuICAgICAgICAgICAgLy8gSlNPTlBhdGggZnJhZ21lbnQgd2UgYXJlIGluc3BlY3RpbmcgICAgICAgICAgIFxuICAgICAgICAgICAgY29tcG9uZW50UmVnZXhlcy51bnNoaWZ0KC9eLyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiAgIHJlZ2V4RGVzY3JpcHRvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlZ0V4cChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudFJlZ2V4ZXMubWFwKGF0dHIoJ3NvdXJjZScpKS5qb2luKCcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICB9KVxuICAgICAgIFxuICAgLCAgIHBvc3NpYmx5Q2FwdHVyaW5nID0gICAgICAgICAgIC8oXFwkPykvXG4gICAsICAgbmFtZWROb2RlID0gICAgICAgICAgICAgICAgICAgLyhbXFx3LV9dK3xcXCopL1xuICAgLCAgIG5hbWVQbGFjZWhvbGRlciA9ICAgICAgICAgICAgIC8oKS9cbiAgICwgICBub2RlSW5BcnJheU5vdGF0aW9uID0gICAgICAgICAvXFxbXCIoW15cIl0rKVwiXFxdL1xuICAgLCAgIG51bWJlcmVkTm9kZUluQXJyYXlOb3RhdGlvbiA9IC9cXFsoXFxkK3xcXCopXFxdL1xuICAgLCAgIGZpZWxkTGlzdCA9ICAgICAgICAgICAgICAgICAgICAgIC97KFtcXHcgXSo/KX0vXG4gICAsICAgb3B0aW9uYWxGaWVsZExpc3QgPSAgICAgICAgICAgLyg/OnsoW1xcdyBdKj8pfSk/L1xuICAgIFxuXG4gICAgICAgLy8gICBmb28gb3IgKiAgICAgICAgICAgICAgICAgIFxuICAgLCAgIGpzb25QYXRoTmFtZWROb2RlSW5PYmplY3ROb3RhdGlvbiAgID0ganNvblBhdGhDbGF1c2UoIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zc2libHlDYXB0dXJpbmcsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZWROb2RlLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbmFsRmllbGRMaXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAvLyAgIFtcImZvb1wiXSAgIFxuICAgLCAgIGpzb25QYXRoTmFtZWROb2RlSW5BcnJheU5vdGF0aW9uICAgID0ganNvblBhdGhDbGF1c2UoIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zc2libHlDYXB0dXJpbmcsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZUluQXJyYXlOb3RhdGlvbiwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25hbEZpZWxkTGlzdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSAgXG5cbiAgICAgICAvLyAgIFsyXSBvciBbKl0gICAgICAgXG4gICAsICAganNvblBhdGhOdW1iZXJlZE5vZGVJbkFycmF5Tm90YXRpb24gPSBqc29uUGF0aENsYXVzZSggXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NzaWJseUNhcHR1cmluZywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1iZXJlZE5vZGVJbkFycmF5Tm90YXRpb24sIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uYWxGaWVsZExpc3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcblxuICAgICAgIC8vICAge2EgYiBjfSAgICAgIFxuICAgLCAgIGpzb25QYXRoUHVyZUR1Y2tUeXBpbmcgICAgICAgICAgICAgID0ganNvblBhdGhDbGF1c2UoIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zc2libHlDYXB0dXJpbmcsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZVBsYWNlaG9sZGVyLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkTGlzdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgXG4gICAgICAgLy8gICAuLlxuICAgLCAgIGpzb25QYXRoRG91YmxlRG90ICAgICAgICAgICAgICAgICAgID0ganNvblBhdGhDbGF1c2UoL1xcLlxcLi8pICAgICAgICAgICAgICAgICAgXG4gICBcbiAgICAgICAvLyAgIC5cbiAgICwgICBqc29uUGF0aERvdCAgICAgICAgICAgICAgICAgICAgICAgICA9IGpzb25QYXRoQ2xhdXNlKC9cXC4vKSAgICAgICAgICAgICAgICAgICAgXG4gICBcbiAgICAgICAvLyAgICFcbiAgICwgICBqc29uUGF0aEJhbmcgICAgICAgICAgICAgICAgICAgICAgICA9IGpzb25QYXRoQ2xhdXNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zc2libHlDYXB0dXJpbmcsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyEvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApICBcbiAgIFxuICAgICAgIC8vICAgbmFkYSFcbiAgICwgICBlbXB0eVN0cmluZyAgICAgICAgICAgICAgICAgICAgICAgICA9IGpzb25QYXRoQ2xhdXNlKC8kLykgICAgICAgICAgICAgICAgICAgICBcbiAgIFxuICAgO1xuICAgXG4gIFxuICAgLyogV2UgZXhwb3J0IG9ubHkgYSBzaW5nbGUgZnVuY3Rpb24uIFdoZW4gY2FsbGVkLCB0aGlzIGZ1bmN0aW9uIGluamVjdHMgXG4gICAgICBpbnRvIGFub3RoZXIgZnVuY3Rpb24gdGhlIGRlc2NyaXB0b3JzIGZyb20gYWJvdmUuICAgICAgICAgICAgIFxuICAgICovXG4gICByZXR1cm4gZnVuY3Rpb24gKGZuKXsgICAgICBcbiAgICAgIHJldHVybiBmbiggICAgICBcbiAgICAgICAgIGxhenlVbmlvbihcbiAgICAgICAgICAgIGpzb25QYXRoTmFtZWROb2RlSW5PYmplY3ROb3RhdGlvblxuICAgICAgICAgLCAganNvblBhdGhOYW1lZE5vZGVJbkFycmF5Tm90YXRpb25cbiAgICAgICAgICwgIGpzb25QYXRoTnVtYmVyZWROb2RlSW5BcnJheU5vdGF0aW9uXG4gICAgICAgICAsICBqc29uUGF0aFB1cmVEdWNrVHlwaW5nIFxuICAgICAgICAgKVxuICAgICAgLCAganNvblBhdGhEb3VibGVEb3RcbiAgICAgICwgIGpzb25QYXRoRG90XG4gICAgICAsICBqc29uUGF0aEJhbmdcbiAgICAgICwgIGVtcHR5U3RyaW5nIFxuICAgICAgKTtcbiAgIH07IFxuXG59KCkpO1xuLyoqXG4gKiBHZXQgYSBuZXcga2V5LT5ub2RlIG1hcHBpbmdcbiAqIFxuICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBrZXlcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fFN0cmluZ3xOdW1iZXJ8bnVsbH0gbm9kZSBhIHZhbHVlIGZvdW5kIGluIHRoZSBqc29uXG4gKi9cbmZ1bmN0aW9uIG5hbWVkTm9kZShrZXksIG5vZGUpIHtcbiAgIHJldHVybiB7a2V5OmtleSwgbm9kZTpub2RlfTtcbn1cblxuLyoqIGdldCB0aGUga2V5IG9mIGEgbmFtZWROb2RlICovXG52YXIga2V5T2YgPSBhdHRyKCdrZXknKTtcblxuLyoqIGdldCB0aGUgbm9kZSBmcm9tIGEgbmFtZWROb2RlICovXG52YXIgbm9kZU9mID0gYXR0cignbm9kZScpO1xuLyoqIFxuICogVGhpcyBmaWxlIHByb3ZpZGVzIHZhcmlvdXMgbGlzdGVuZXJzIHdoaWNoIGNhbiBiZSB1c2VkIHRvIGJ1aWxkIHVwXG4gKiBhIGNoYW5naW5nIGFzY2VudCBiYXNlZCBvbiB0aGUgY2FsbGJhY2tzIHByb3ZpZGVkIGJ5IENsYXJpbmV0LiBJdCBsaXN0ZW5zXG4gKiB0byB0aGUgbG93LWxldmVsIGV2ZW50cyBmcm9tIENsYXJpbmV0IGFuZCBlbWl0cyBoaWdoZXItbGV2ZWwgb25lcy5cbiAqICBcbiAqIFRoZSBidWlsZGluZyB1cCBpcyBzdGF0ZWxlc3Mgc28gdG8gdHJhY2sgYSBKU09OIGZpbGVcbiAqIGFzY2VudE1hbmFnZXIuanMgaXMgcmVxdWlyZWQgdG8gc3RvcmUgdGhlIGFzY2VudCBzdGF0ZVxuICogYmV0d2VlbiBjYWxscy5cbiAqL1xuXG5cblxuLyoqIFxuICogQSBzcGVjaWFsIHZhbHVlIHRvIHVzZSBpbiB0aGUgcGF0aCBsaXN0IHRvIHJlcHJlc2VudCB0aGUgcGF0aCAndG8nIGEgcm9vdCBcbiAqIG9iamVjdCAod2hpY2ggZG9lc24ndCByZWFsbHkgaGF2ZSBhbnkgcGF0aCkuIFRoaXMgcHJldmVudHMgdGhlIG5lZWQgZm9yIFxuICogc3BlY2lhbC1jYXNpbmcgZGV0ZWN0aW9uIG9mIHRoZSByb290IG9iamVjdCBhbmQgYWxsb3dzIGl0IHRvIGJlIHRyZWF0ZWQgXG4gKiBsaWtlIGFueSBvdGhlciBvYmplY3QuIFdlIG1pZ2h0IHRoaW5rIG9mIHRoaXMgYXMgYmVpbmcgc2ltaWxhciB0byB0aGUgXG4gKiAndW5uYW1lZCByb290JyBkb21haW4gXCIuXCIsIGVnIGlmIEkgZ28gdG8gXG4gKiBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy4vd2lraS9Fbi9NYWluX3BhZ2UgdGhlIGRvdCBhZnRlciAnb3JnJyBkZWxpbWluYXRlcyBcbiAqIHRoZSB1bm5hbWVkIHJvb3Qgb2YgdGhlIEROUy5cbiAqIFxuICogVGhpcyBpcyBrZXB0IGFzIGFuIG9iamVjdCB0byB0YWtlIGFkdmFudGFnZSB0aGF0IGluIEphdmFzY3JpcHQncyBPTyBvYmplY3RzIFxuICogYXJlIGd1YXJhbnRlZWQgdG8gYmUgZGlzdGluY3QsIHRoZXJlZm9yZSBubyBvdGhlciBvYmplY3QgY2FuIHBvc3NpYmx5IGNsYXNoIFxuICogd2l0aCB0aGlzIG9uZS4gU3RyaW5ncywgbnVtYmVycyBldGMgcHJvdmlkZSBubyBzdWNoIGd1YXJhbnRlZS4gXG4gKiovXG52YXIgUk9PVF9QQVRIID0ge307XG5cblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgc2V0IG9mIGhhbmRsZXJzIGZvciBjbGFyaW5ldCdzIGV2ZW50cywgYm91bmQgdG8gdGhlIGVtaXQgXG4gKiBmdW5jdGlvbiBnaXZlbi4gIFxuICovIFxuZnVuY3Rpb24gaW5jcmVtZW50YWxDb250ZW50QnVpbGRlciggb2JvZUJ1cyApIHtcblxuICAgdmFyIGVtaXROb2RlT3BlbmVkID0gb2JvZUJ1cyhOT0RFX09QRU5FRCkuZW1pdCxcbiAgICAgICBlbWl0Tm9kZUNsb3NlZCA9IG9ib2VCdXMoTk9ERV9DTE9TRUQpLmVtaXQsXG4gICAgICAgZW1pdFJvb3RPcGVuZWQgPSBvYm9lQnVzKFJPT1RfUEFUSF9GT1VORCkuZW1pdCxcbiAgICAgICBlbWl0Um9vdENsb3NlZCA9IG9ib2VCdXMoUk9PVF9OT0RFX0ZPVU5EKS5lbWl0O1xuXG4gICBmdW5jdGlvbiBhcnJheUluZGljZXNBcmVLZXlzKCBwb3NzaWJseUluY29uc2lzdGVudEFzY2VudCwgbmV3RGVlcGVzdE5vZGUpIHtcbiAgIFxuICAgICAgLyogZm9yIHZhbHVlcyBpbiBhcnJheXMgd2UgYXJlbid0IHByZS13YXJuZWQgb2YgdGhlIGNvbWluZyBwYXRocyBcbiAgICAgICAgIChDbGFyaW5ldCBnaXZlcyBubyBjYWxsIHRvIG9ua2V5IGxpa2UgaXQgZG9lcyBmb3IgdmFsdWVzIGluIG9iamVjdHMpIFxuICAgICAgICAgc28gaWYgd2UgYXJlIGluIGFuIGFycmF5IHdlIG5lZWQgdG8gY3JlYXRlIHRoaXMgcGF0aCBvdXJzZWx2ZXMuIFRoZSBcbiAgICAgICAgIGtleSB3aWxsIGJlIGxlbihwYXJlbnROb2RlKSBiZWNhdXNlIGFycmF5IGtleXMgYXJlIGFsd2F5cyBzZXF1ZW50aWFsIFxuICAgICAgICAgbnVtYmVycy4gKi9cblxuICAgICAgdmFyIHBhcmVudE5vZGUgPSBub2RlT2YoIGhlYWQoIHBvc3NpYmx5SW5jb25zaXN0ZW50QXNjZW50KSk7XG4gICAgICBcbiAgICAgIHJldHVybiAgICAgIGlzT2ZUeXBlKCBBcnJheSwgcGFyZW50Tm9kZSlcbiAgICAgICAgICAgICAgID9cbiAgICAgICAgICAgICAgICAgIGtleUZvdW5kKCAgcG9zc2libHlJbmNvbnNpc3RlbnRBc2NlbnQsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVuKHBhcmVudE5vZGUpLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0RlZXBlc3ROb2RlXG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICA6ICBcbiAgICAgICAgICAgICAgICAgIC8vIG5vdGhpbmcgbmVlZGVkLCByZXR1cm4gdW5jaGFuZ2VkXG4gICAgICAgICAgICAgICAgICBwb3NzaWJseUluY29uc2lzdGVudEFzY2VudCBcbiAgICAgICAgICAgICAgIDtcbiAgIH1cbiAgICAgICAgICAgICAgICAgXG4gICBmdW5jdGlvbiBub2RlT3BlbmVkKCBhc2NlbnQsIG5ld0RlZXBlc3ROb2RlICkge1xuICAgICAgXG4gICAgICBpZiggIWFzY2VudCApIHtcbiAgICAgICAgIC8vIHdlIGRpc2NvdmVyZWQgdGhlIHJvb3Qgbm9kZSwgICAgICAgICBcbiAgICAgICAgIGVtaXRSb290T3BlbmVkKCBuZXdEZWVwZXN0Tm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgcmV0dXJuIGtleUZvdW5kKCBhc2NlbnQsIFJPT1RfUEFUSCwgbmV3RGVlcGVzdE5vZGUpOyAgICAgICAgIFxuICAgICAgfVxuXG4gICAgICAvLyB3ZSBkaXNjb3ZlcmVkIGEgbm9uLXJvb3Qgbm9kZVxuICAgICAgICAgICAgICAgICBcbiAgICAgIHZhciBhcnJheUNvbnNpc3RlbnRBc2NlbnQgID0gYXJyYXlJbmRpY2VzQXJlS2V5cyggYXNjZW50LCBuZXdEZWVwZXN0Tm9kZSksICAgICAgXG4gICAgICAgICAgYW5jZXN0b3JCcmFuY2hlcyAgICAgICA9IHRhaWwoIGFycmF5Q29uc2lzdGVudEFzY2VudCksXG4gICAgICAgICAgcHJldmlvdXNseVVubWFwcGVkTmFtZSA9IGtleU9mKCBoZWFkKCBhcnJheUNvbnNpc3RlbnRBc2NlbnQpKTtcbiAgICAgICAgICBcbiAgICAgIGFwcGVuZEJ1aWx0Q29udGVudCggXG4gICAgICAgICBhbmNlc3RvckJyYW5jaGVzLCBcbiAgICAgICAgIHByZXZpb3VzbHlVbm1hcHBlZE5hbWUsIFxuICAgICAgICAgbmV3RGVlcGVzdE5vZGUgXG4gICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICByZXR1cm4gY29ucyggXG4gICAgICAgICAgICAgICBuYW1lZE5vZGUoIHByZXZpb3VzbHlVbm1hcHBlZE5hbWUsIG5ld0RlZXBlc3ROb2RlICksIFxuICAgICAgICAgICAgICAgYW5jZXN0b3JCcmFuY2hlc1xuICAgICAgKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgfVxuXG5cbiAgIC8qKlxuICAgICogQWRkIGEgbmV3IHZhbHVlIHRvIHRoZSBvYmplY3Qgd2UgYXJlIGJ1aWxkaW5nIHVwIHRvIHJlcHJlc2VudCB0aGVcbiAgICAqIHBhcnNlZCBKU09OXG4gICAgKi9cbiAgIGZ1bmN0aW9uIGFwcGVuZEJ1aWx0Q29udGVudCggYW5jZXN0b3JCcmFuY2hlcywga2V5LCBub2RlICl7XG4gICAgIFxuICAgICAgbm9kZU9mKCBoZWFkKCBhbmNlc3RvckJyYW5jaGVzKSlba2V5XSA9IG5vZGU7XG4gICB9XG5cbiAgICAgXG4gICAvKipcbiAgICAqIEZvciB3aGVuIHdlIGZpbmQgYSBuZXcga2V5IGluIHRoZSBqc29uLlxuICAgICogXG4gICAgKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ8T2JqZWN0fSBuZXdEZWVwZXN0TmFtZSB0aGUga2V5LiBJZiB3ZSBhcmUgaW4gYW4gXG4gICAgKiAgICBhcnJheSB3aWxsIGJlIGEgbnVtYmVyLCBvdGhlcndpc2UgYSBzdHJpbmcuIE1heSB0YWtlIHRoZSBzcGVjaWFsIFxuICAgICogICAgdmFsdWUgUk9PVF9QQVRIIGlmIHRoZSByb290IG5vZGUgaGFzIGp1c3QgYmVlbiBmb3VuZFxuICAgICogICAgXG4gICAgKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ8T2JqZWN0fEFycmF5fE51bGx8dW5kZWZpbmVkfSBbbWF5YmVOZXdEZWVwZXN0Tm9kZV0gXG4gICAgKiAgICB1c3VhbGx5IHRoaXMgd29uJ3QgYmUga25vd24gc28gY2FuIGJlIHVuZGVmaW5lZC4gQ2FuJ3QgdXNlIG51bGwgXG4gICAgKiAgICB0byByZXByZXNlbnQgdW5rbm93biBiZWNhdXNlIG51bGwgaXMgYSB2YWxpZCB2YWx1ZSBpbiBKU09OXG4gICAgKiovICBcbiAgIGZ1bmN0aW9uIGtleUZvdW5kKGFzY2VudCwgbmV3RGVlcGVzdE5hbWUsIG1heWJlTmV3RGVlcGVzdE5vZGUpIHtcblxuICAgICAgaWYoIGFzY2VudCApIHsgLy8gaWYgbm90IHJvb3RcbiAgICAgIFxuICAgICAgICAgLy8gSWYgd2UgaGF2ZSB0aGUga2V5IGJ1dCAodW5sZXNzIGFkZGluZyB0byBhbiBhcnJheSkgbm8ga25vd24gdmFsdWVcbiAgICAgICAgIC8vIHlldC4gUHV0IHRoYXQga2V5IGluIHRoZSBvdXRwdXQgYnV0IGFnYWluc3Qgbm8gZGVmaW5lZCB2YWx1ZTogICAgICBcbiAgICAgICAgIGFwcGVuZEJ1aWx0Q29udGVudCggYXNjZW50LCBuZXdEZWVwZXN0TmFtZSwgbWF5YmVOZXdEZWVwZXN0Tm9kZSApO1xuICAgICAgfVxuICAgXG4gICAgICB2YXIgYXNjZW50V2l0aE5ld1BhdGggPSBjb25zKCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVkTm9kZSggbmV3RGVlcGVzdE5hbWUsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXliZU5ld0RlZXBlc3ROb2RlKSwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc2NlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgIGVtaXROb2RlT3BlbmVkKCBhc2NlbnRXaXRoTmV3UGF0aCk7XG4gXG4gICAgICByZXR1cm4gYXNjZW50V2l0aE5ld1BhdGg7XG4gICB9XG5cblxuICAgLyoqXG4gICAgKiBGb3Igd2hlbiB0aGUgY3VycmVudCBub2RlIGVuZHMuXG4gICAgKi9cbiAgIGZ1bmN0aW9uIG5vZGVDbG9zZWQoIGFzY2VudCApIHtcblxuICAgICAgZW1pdE5vZGVDbG9zZWQoIGFzY2VudCk7XG4gICAgICAgXG4gICAgICByZXR1cm4gdGFpbCggYXNjZW50KSB8fFxuICAgICAgICAgICAgIC8vIElmIHRoZXJlIGFyZSBubyBub2RlcyBsZWZ0IGluIHRoZSBhc2NlbnQgdGhlIHJvb3Qgbm9kZVxuICAgICAgICAgICAgIC8vIGp1c3QgY2xvc2VkLiBFbWl0IGEgc3BlY2lhbCBldmVudCBmb3IgdGhpczogXG4gICAgICAgICAgICAgZW1pdFJvb3RDbG9zZWQobm9kZU9mKGhlYWQoYXNjZW50KSkpO1xuICAgfSAgICAgIFxuXG4gICB2YXIgY29udGVudEJ1aWxkZXJIYW5kbGVycyA9IHt9O1xuICAgY29udGVudEJ1aWxkZXJIYW5kbGVyc1tTQVhfVkFMVUVfT1BFTl0gPSBub2RlT3BlbmVkO1xuICAgY29udGVudEJ1aWxkZXJIYW5kbGVyc1tTQVhfVkFMVUVfQ0xPU0VdID0gbm9kZUNsb3NlZDtcbiAgIGNvbnRlbnRCdWlsZGVySGFuZGxlcnNbU0FYX0tFWV0gPSBrZXlGb3VuZDtcbiAgIHJldHVybiBjb250ZW50QnVpbGRlckhhbmRsZXJzO1xufVxuXG4vKipcbiAqIFRoZSBqc29uUGF0aCBldmFsdWF0b3IgY29tcGlsZXIgdXNlZCBmb3IgT2JvZS5qcy4gXG4gKiBcbiAqIE9uZSBmdW5jdGlvbiBpcyBleHBvc2VkLiBUaGlzIGZ1bmN0aW9uIHRha2VzIGEgU3RyaW5nIEpTT05QYXRoIHNwZWMgYW5kIFxuICogcmV0dXJucyBhIGZ1bmN0aW9uIHRvIHRlc3QgY2FuZGlkYXRlIGFzY2VudHMgZm9yIG1hdGNoZXMuXG4gKiBcbiAqICBTdHJpbmcganNvblBhdGggLT4gKExpc3QgYXNjZW50KSAtPiBCb29sZWFufE9iamVjdFxuICpcbiAqIFRoaXMgZmlsZSBpcyBjb2RlZCBpbiBhIHB1cmUgZnVuY3Rpb25hbCBzdHlsZS4gVGhhdCBpcywgbm8gZnVuY3Rpb24gaGFzIFxuICogc2lkZSBlZmZlY3RzLCBldmVyeSBmdW5jdGlvbiBldmFsdWF0ZXMgdG8gdGhlIHNhbWUgdmFsdWUgZm9yIHRoZSBzYW1lIFxuICogYXJndW1lbnRzIGFuZCBubyB2YXJpYWJsZXMgYXJlIHJlYXNzaWduZWQuXG4gKi8gIFxuLy8gdGhlIGNhbGwgdG8ganNvblBhdGhTeW50YXggaW5qZWN0cyB0aGUgdG9rZW4gc3ludGF4ZXMgdGhhdCBhcmUgbmVlZGVkIFxuLy8gaW5zaWRlIHRoZSBjb21waWxlclxudmFyIGpzb25QYXRoQ29tcGlsZXIgPSBqc29uUGF0aFN5bnRheChmdW5jdGlvbiAocGF0aE5vZGVTeW50YXgsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG91YmxlRG90U3ludGF4LCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvdFN5bnRheCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhbmdTeW50YXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbXB0eVN5bnRheCApIHtcblxuICAgdmFyIENBUFRVUklOR19JTkRFWCA9IDE7XG4gICB2YXIgTkFNRV9JTkRFWCA9IDI7XG4gICB2YXIgRklFTERfTElTVF9JTkRFWCA9IDM7XG5cbiAgIHZhciBoZWFkS2V5ICA9IGNvbXBvc2UyKGtleU9mLCBoZWFkKSxcbiAgICAgICBoZWFkTm9kZSA9IGNvbXBvc2UyKG5vZGVPZiwgaGVhZCk7XG4gICAgICAgICAgICAgICAgICAgXG4gICAvKipcbiAgICAqIENyZWF0ZSBhbiBldmFsdWF0b3IgZnVuY3Rpb24gZm9yIGEgbmFtZWQgcGF0aCBub2RlLCBleHByZXNzZWQgaW4gdGhlXG4gICAgKiBKU09OUGF0aCBsaWtlOlxuICAgICogICAgZm9vXG4gICAgKiAgICBbXCJiYXJcIl1cbiAgICAqICAgIFsyXSAgIFxuICAgICovXG4gICBmdW5jdGlvbiBuYW1lQ2xhdXNlKHByZXZpb3VzRXhwciwgZGV0ZWN0aW9uICkge1xuICAgICBcbiAgICAgIHZhciBuYW1lID0gZGV0ZWN0aW9uW05BTUVfSU5ERVhdLFxuICAgICAgICAgICAgXG4gICAgICAgICAgbWF0Y2hlc05hbWUgPSAoICFuYW1lIHx8IG5hbWUgPT0gJyonICkgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA/ICBhbHdheXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDogIGZ1bmN0aW9uKGFzY2VudCl7cmV0dXJuIGhlYWRLZXkoYXNjZW50KSA9PSBuYW1lfTtcbiAgICAgXG5cbiAgICAgIHJldHVybiBsYXp5SW50ZXJzZWN0aW9uKG1hdGNoZXNOYW1lLCBwcmV2aW91c0V4cHIpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIENyZWF0ZSBhbiBldmFsdWF0b3IgZnVuY3Rpb24gZm9yIGEgYSBkdWNrLXR5cGVkIG5vZGUsIGV4cHJlc3NlZCBsaWtlOlxuICAgICogXG4gICAgKiAgICB7c3BpbiwgdGFzdGUsIGNvbG91cn1cbiAgICAqICAgIC5wYXJ0aWNsZXtzcGluLCB0YXN0ZSwgY29sb3VyfVxuICAgICogICAgKntzcGluLCB0YXN0ZSwgY29sb3VyfVxuICAgICovXG4gICBmdW5jdGlvbiBkdWNrVHlwZUNsYXVzZShwcmV2aW91c0V4cHIsIGRldGVjdGlvbikge1xuXG4gICAgICB2YXIgZmllbGRMaXN0U3RyID0gZGV0ZWN0aW9uW0ZJRUxEX0xJU1RfSU5ERVhdO1xuXG4gICAgICBpZiAoIWZpZWxkTGlzdFN0cikgXG4gICAgICAgICByZXR1cm4gcHJldmlvdXNFeHByOyAvLyBkb24ndCB3cmFwIGF0IGFsbCwgcmV0dXJuIGdpdmVuIGV4cHIgYXMtaXMgICAgICBcblxuICAgICAgdmFyIGhhc0FsbHJlcXVpcmVkRmllbGRzID0gcGFydGlhbENvbXBsZXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzQWxsUHJvcGVydGllcywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnJheUFzTGlzdChmaWVsZExpc3RTdHIuc3BsaXQoL1xcVysvKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICBpc01hdGNoID0gIGNvbXBvc2UyKCBcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc0FsbHJlcXVpcmVkRmllbGRzLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWROb2RlXG4gICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICByZXR1cm4gbGF6eUludGVyc2VjdGlvbihpc01hdGNoLCBwcmV2aW91c0V4cHIpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEV4cHJlc3Npb24gZm9yICQsIHJldHVybnMgdGhlIGV2YWx1YXRvciBmdW5jdGlvblxuICAgICovXG4gICBmdW5jdGlvbiBjYXB0dXJlKCBwcmV2aW91c0V4cHIsIGRldGVjdGlvbiApIHtcblxuICAgICAgLy8gZXh0cmFjdCBtZWFuaW5nIGZyb20gdGhlIGRldGVjdGlvbiAgICAgIFxuICAgICAgdmFyIGNhcHR1cmluZyA9ICEhZGV0ZWN0aW9uW0NBUFRVUklOR19JTkRFWF07XG5cbiAgICAgIGlmICghY2FwdHVyaW5nKSAgICAgICAgICBcbiAgICAgICAgIHJldHVybiBwcmV2aW91c0V4cHI7IC8vIGRvbid0IHdyYXAgYXQgYWxsLCByZXR1cm4gZ2l2ZW4gZXhwciBhcy1pcyAgICAgIFxuICAgICAgXG4gICAgICByZXR1cm4gbGF6eUludGVyc2VjdGlvbihwcmV2aW91c0V4cHIsIGhlYWQpO1xuICAgICAgICAgICAgXG4gICB9ICAgICAgICAgICAgXG4gICAgICBcbiAgIC8qKlxuICAgICogQ3JlYXRlIGFuIGV2YWx1YXRvciBmdW5jdGlvbiB0aGF0IG1vdmVzIG9udG8gdGhlIG5leHQgaXRlbSBvbiB0aGUgXG4gICAgKiBsaXN0cy4gVGhpcyBmdW5jdGlvbiBpcyB0aGUgcGxhY2Ugd2hlcmUgdGhlIGxvZ2ljIHRvIG1vdmUgdXAgYSBcbiAgICAqIGxldmVsIGluIHRoZSBhc2NlbnQgZXhpc3RzLiBcbiAgICAqIFxuICAgICogRWcsIGZvciBKU09OUGF0aCBcIi5mb29cIiB3ZSBuZWVkIHNraXAxKG5hbWVDbGF1c2UoYWx3YXlzLCBbLCdmb28nXSkpXG4gICAgKi9cbiAgIGZ1bmN0aW9uIHNraXAxKHByZXZpb3VzRXhwcikge1xuICAgXG4gICBcbiAgICAgIGlmKCBwcmV2aW91c0V4cHIgPT0gYWx3YXlzICkge1xuICAgICAgICAgLyogSWYgdGhlcmUgaXMgbm8gcHJldmlvdXMgZXhwcmVzc2lvbiB0aGlzIGNvbnN1bWUgY29tbWFuZCBcbiAgICAgICAgICAgIGlzIGF0IHRoZSBzdGFydCBvZiB0aGUganNvblBhdGguXG4gICAgICAgICAgICBTaW5jZSBKU09OUGF0aCBzcGVjaWZpZXMgd2hhdCB3ZSdkIGxpa2UgdG8gZmluZCBidXQgbm90IFxuICAgICAgICAgICAgbmVjZXNzYXJpbHkgZXZlcnl0aGluZyBsZWFkaW5nIGRvd24gdG8gaXQsIHdoZW4gcnVubmluZ1xuICAgICAgICAgICAgb3V0IG9mIEpTT05QYXRoIHRvIGNoZWNrIGFnYWluc3Qgd2UgZGVmYXVsdCB0byB0cnVlICovXG4gICAgICAgICByZXR1cm4gYWx3YXlzO1xuICAgICAgfVxuXG4gICAgICAvKiogcmV0dXJuIHRydWUgaWYgdGhlIGFzY2VudCB3ZSBoYXZlIGNvbnRhaW5zIG9ubHkgdGhlIEpTT04gcm9vdCxcbiAgICAgICAqICBmYWxzZSBvdGhlcndpc2VcbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gbm90QXRSb290KGFzY2VudCl7XG4gICAgICAgICByZXR1cm4gaGVhZEtleShhc2NlbnQpICE9IFJPT1RfUEFUSDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIGxhenlJbnRlcnNlY3Rpb24oXG4gICAgICAgICAgICAgICAvKiBJZiB3ZSdyZSBhbHJlYWR5IGF0IHRoZSByb290IGJ1dCB0aGVyZSBhcmUgbW9yZSBcbiAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb25zIHRvIHNhdGlzZnksIGNhbid0IGNvbnN1bWUgYW55IG1vcmUuIE5vIG1hdGNoLlxuXG4gICAgICAgICAgICAgICAgICBUaGlzIGNoZWNrIGlzIHdoeSBub25lIG9mIHRoZSBvdGhlciBleHBycyBoYXZlIHRvIGJlIGFibGUgXG4gICAgICAgICAgICAgICAgICB0byBoYW5kbGUgZW1wdHkgbGlzdHM7IHNraXAxIGlzIHRoZSBvbmx5IGV2YWx1YXRvciB0aGF0IFxuICAgICAgICAgICAgICAgICAgbW92ZXMgb250byB0aGUgbmV4dCB0b2tlbiBhbmQgaXQgcmVmdXNlcyB0byBkbyBzbyBvbmNlIGl0IFxuICAgICAgICAgICAgICAgICAgcmVhY2hlcyB0aGUgbGFzdCBpdGVtIGluIHRoZSBsaXN0LiAqL1xuICAgICAgICAgICAgICAgbm90QXRSb290LFxuICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAvKiBXZSBhcmUgbm90IGF0IHRoZSByb290IG9mIHRoZSBhc2NlbnQgeWV0LlxuICAgICAgICAgICAgICAgICAgTW92ZSB0byB0aGUgbmV4dCBsZXZlbCBvZiB0aGUgYXNjZW50IGJ5IGhhbmRpbmcgb25seSBcbiAgICAgICAgICAgICAgICAgIHRoZSB0YWlsIHRvIHRoZSBwcmV2aW91cyBleHByZXNzaW9uICovIFxuICAgICAgICAgICAgICAgY29tcG9zZTIocHJldmlvdXNFeHByLCB0YWlsKSBcbiAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgIH0gICBcbiAgIFxuICAgLyoqXG4gICAgKiBDcmVhdGUgYW4gZXZhbHVhdG9yIGZ1bmN0aW9uIGZvciB0aGUgLi4gKGRvdWJsZSBkb3QpIHRva2VuLiBDb25zdW1lc1xuICAgICogemVybyBvciBtb3JlIGxldmVscyBvZiB0aGUgYXNjZW50LCB0aGUgZmV3ZXN0IHRoYXQgYXJlIHJlcXVpcmVkIHRvIGZpbmRcbiAgICAqIGEgbWF0Y2ggd2hlbiBnaXZlbiB0byBwcmV2aW91c0V4cHIuXG4gICAgKi8gICBcbiAgIGZ1bmN0aW9uIHNraXBNYW55KHByZXZpb3VzRXhwcikge1xuXG4gICAgICBpZiggcHJldmlvdXNFeHByID09IGFsd2F5cyApIHtcbiAgICAgICAgIC8qIElmIHRoZXJlIGlzIG5vIHByZXZpb3VzIGV4cHJlc3Npb24gdGhpcyBjb25zdW1lIGNvbW1hbmQgXG4gICAgICAgICAgICBpcyBhdCB0aGUgc3RhcnQgb2YgdGhlIGpzb25QYXRoLlxuICAgICAgICAgICAgU2luY2UgSlNPTlBhdGggc3BlY2lmaWVzIHdoYXQgd2UnZCBsaWtlIHRvIGZpbmQgYnV0IG5vdCBcbiAgICAgICAgICAgIG5lY2Vzc2FyaWx5IGV2ZXJ5dGhpbmcgbGVhZGluZyBkb3duIHRvIGl0LCB3aGVuIHJ1bm5pbmdcbiAgICAgICAgICAgIG91dCBvZiBKU09OUGF0aCB0byBjaGVjayBhZ2FpbnN0IHdlIGRlZmF1bHQgdG8gdHJ1ZSAqLyAgICAgICAgICAgIFxuICAgICAgICAgcmV0dXJuIGFsd2F5cztcbiAgICAgIH1cbiAgICAgICAgICBcbiAgICAgIHZhciBcbiAgICAgICAgICAvLyBJbiBKU09OUGF0aCAuLiBpcyBlcXVpdmFsZW50IHRvICEuLiBzbyBpZiAuLiByZWFjaGVzIHRoZSByb290XG4gICAgICAgICAgLy8gdGhlIG1hdGNoIGhhcyBzdWNjZWVkZWQuIEllLCB3ZSBtaWdodCB3cml0ZSAuLmZvbyBvciAhLi5mb29cbiAgICAgICAgICAvLyBhbmQgYm90aCBzaG91bGQgbWF0Y2ggaWRlbnRpY2FsbHkuXG4gICAgICAgICAgdGVybWluYWxDYXNlV2hlbkFycml2aW5nQXRSb290ID0gcm9vdEV4cHIoKSxcbiAgICAgICAgICB0ZXJtaW5hbENhc2VXaGVuUHJldmlvdXNFeHByZXNzaW9uSXNTYXRpc2ZpZWQgPSBwcmV2aW91c0V4cHIsXG4gICAgICAgICAgcmVjdXJzaXZlQ2FzZSA9IHNraXAxKGZ1bmN0aW9uKGFzY2VudCkge1xuICAgICAgICAgICAgIHJldHVybiBjYXNlcyhhc2NlbnQpO1xuICAgICAgICAgIH0pLFxuXG4gICAgICAgICAgY2FzZXMgPSBsYXp5VW5pb24oXG4gICAgICAgICAgICAgICAgICAgICB0ZXJtaW5hbENhc2VXaGVuQXJyaXZpbmdBdFJvb3RcbiAgICAgICAgICAgICAgICAgICwgIHRlcm1pbmFsQ2FzZVdoZW5QcmV2aW91c0V4cHJlc3Npb25Jc1NhdGlzZmllZFxuICAgICAgICAgICAgICAgICAgLCAgcmVjdXJzaXZlQ2FzZSAgXG4gICAgICAgICAgICAgICAgICApO1xuICAgICAgXG4gICAgICByZXR1cm4gY2FzZXM7XG4gICB9ICAgICAgXG4gICBcbiAgIC8qKlxuICAgICogR2VuZXJhdGUgYW4gZXZhbHVhdG9yIGZvciAhIC0gbWF0Y2hlcyBvbmx5IHRoZSByb290IGVsZW1lbnQgb2YgdGhlIGpzb25cbiAgICAqIGFuZCBpZ25vcmVzIGFueSBwcmV2aW91cyBleHByZXNzaW9ucyBzaW5jZSBub3RoaW5nIG1heSBwcmVjZWRlICEuIFxuICAgICovICAgXG4gICBmdW5jdGlvbiByb290RXhwcigpIHtcbiAgICAgIFxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGFzY2VudCl7XG4gICAgICAgICByZXR1cm4gaGVhZEtleShhc2NlbnQpID09IFJPT1RfUEFUSDtcbiAgICAgIH07XG4gICB9ICAgXG4gICAgICAgICBcbiAgIC8qKlxuICAgICogR2VuZXJhdGUgYSBzdGF0ZW1lbnQgd3JhcHBlciB0byBzaXQgYXJvdW5kIHRoZSBvdXRlcm1vc3QgXG4gICAgKiBjbGF1c2UgZXZhbHVhdG9yLlxuICAgICogXG4gICAgKiBIYW5kbGVzIHRoZSBjYXNlIHdoZXJlIHRoZSBjYXB0dXJpbmcgaXMgaW1wbGljaXQgYmVjYXVzZSB0aGUgSlNPTlBhdGhcbiAgICAqIGRpZCBub3QgY29udGFpbiBhICckJyBieSByZXR1cm5pbmcgdGhlIGxhc3Qgbm9kZS5cbiAgICAqLyAgIFxuICAgZnVuY3Rpb24gc3RhdGVtZW50RXhwcihsYXN0Q2xhdXNlKSB7XG4gICAgICBcbiAgICAgIHJldHVybiBmdW5jdGlvbihhc2NlbnQpIHtcbiAgIFxuICAgICAgICAgLy8ga2ljayBvZmYgdGhlIGV2YWx1YXRpb24gYnkgcGFzc2luZyB0aHJvdWdoIHRvIHRoZSBsYXN0IGNsYXVzZVxuICAgICAgICAgdmFyIGV4cHJNYXRjaCA9IGxhc3RDbGF1c2UoYXNjZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICByZXR1cm4gZXhwck1hdGNoID09PSB0cnVlID8gaGVhZChhc2NlbnQpIDogZXhwck1hdGNoO1xuICAgICAgfTtcbiAgIH0gICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAvKipcbiAgICAqIEZvciB3aGVuIGEgdG9rZW4gaGFzIGJlZW4gZm91bmQgaW4gdGhlIEpTT05QYXRoIGlucHV0LlxuICAgICogQ29tcGlsZXMgdGhlIHBhcnNlciBmb3IgdGhhdCB0b2tlbiBhbmQgcmV0dXJucyBpbiBjb21iaW5hdGlvbiB3aXRoIHRoZVxuICAgICogcGFyc2VyIGFscmVhZHkgZ2VuZXJhdGVkLlxuICAgICogXG4gICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBleHBycyAgYSBsaXN0IG9mIHRoZSBjbGF1c2UgZXZhbHVhdG9yIGdlbmVyYXRvcnMgZm9yXG4gICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIHRva2VuIHRoYXQgd2FzIGZvdW5kXG4gICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwYXJzZXJHZW5lcmF0ZWRTb0ZhciB0aGUgcGFyc2VyIGFscmVhZHkgZm91bmRcbiAgICAqIEBwYXJhbSB7QXJyYXl9IGRldGVjdGlvbiB0aGUgbWF0Y2ggZ2l2ZW4gYnkgdGhlIHJlZ2V4IGVuZ2luZSB3aGVuIFxuICAgICogICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBmZWF0dXJlIHdhcyBmb3VuZFxuICAgICovXG4gICBmdW5jdGlvbiBleHByZXNzaW9uc1JlYWRlciggZXhwcnMsIHBhcnNlckdlbmVyYXRlZFNvRmFyLCBkZXRlY3Rpb24gKSB7XG4gICAgICAgICAgICAgICAgICAgICBcbiAgICAgIC8vIGlmIGV4cHJzIGlzIHplcm8tbGVuZ3RoIGZvbGRSIHdpbGwgcGFzcyBiYWNrIHRoZSBcbiAgICAgIC8vIHBhcnNlckdlbmVyYXRlZFNvRmFyIGFzLWlzIHNvIHdlIGRvbid0IG5lZWQgdG8gdHJlYXQgXG4gICAgICAvLyB0aGlzIGFzIGEgc3BlY2lhbCBjYXNlXG4gICAgICBcbiAgICAgIHJldHVybiAgIGZvbGRSKCBcbiAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCBwYXJzZXJHZW5lcmF0ZWRTb0ZhciwgZXhwciApe1xuICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXhwcihwYXJzZXJHZW5lcmF0ZWRTb0ZhciwgZGV0ZWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgIH0sIFxuICAgICAgICAgICAgICAgICAgcGFyc2VyR2VuZXJhdGVkU29GYXIsIFxuICAgICAgICAgICAgICAgICAgZXhwcnNcbiAgICAgICAgICAgICAgICk7ICAgICAgICAgICAgICAgICAgICAgXG5cbiAgIH1cblxuICAgLyoqIFxuICAgICogIElmIGpzb25QYXRoIG1hdGNoZXMgdGhlIGdpdmVuIGRldGVjdG9yIGZ1bmN0aW9uLCBjcmVhdGVzIGEgZnVuY3Rpb24gd2hpY2hcbiAgICAqICBldmFsdWF0ZXMgYWdhaW5zdCBldmVyeSBjbGF1c2UgaW4gdGhlIGNsYXVzZUV2YWx1YXRvckdlbmVyYXRvcnMuIFRoZVxuICAgICogIGNyZWF0ZWQgZnVuY3Rpb24gaXMgcHJvcGFnYXRlZCB0byB0aGUgb25TdWNjZXNzIGZ1bmN0aW9uLCBhbG9uZyB3aXRoXG4gICAgKiAgdGhlIHJlbWFpbmluZyB1bnBhcnNlZCBKU09OUGF0aCBzdWJzdHJpbmcuXG4gICAgKiAgXG4gICAgKiAgVGhlIGludGVuZGVkIHVzZSBpcyB0byBjcmVhdGUgYSBjbGF1c2VNYXRjaGVyIGJ5IGZpbGxpbmcgaW5cbiAgICAqICB0aGUgZmlyc3QgdHdvIGFyZ3VtZW50cywgdGh1cyBwcm92aWRpbmcgYSBmdW5jdGlvbiB0aGF0IGtub3dzXG4gICAgKiAgc29tZSBzeW50YXggdG8gbWF0Y2ggYW5kIHdoYXQga2luZCBvZiBnZW5lcmF0b3IgdG8gY3JlYXRlIGlmIGl0XG4gICAgKiAgZmluZHMgaXQuIFRoZSBwYXJhbWV0ZXIgbGlzdCBvbmNlIGNvbXBsZXRlZCBpczpcbiAgICAqICBcbiAgICAqICAgIChqc29uUGF0aCwgcGFyc2VyR2VuZXJhdGVkU29GYXIsIG9uU3VjY2VzcylcbiAgICAqICBcbiAgICAqICBvblN1Y2Nlc3MgbWF5IGJlIGNvbXBpbGVKc29uUGF0aFRvRnVuY3Rpb24sIHRvIHJlY3Vyc2l2ZWx5IGNvbnRpbnVlIFxuICAgICogIHBhcnNpbmcgYWZ0ZXIgZmluZGluZyBhIG1hdGNoIG9yIHJldHVybkZvdW5kUGFyc2VyIHRvIHN0b3AgaGVyZS5cbiAgICAqL1xuICAgZnVuY3Rpb24gZ2VuZXJhdGVDbGF1c2VSZWFkZXJJZlRva2VuRm91bmQgKFxuICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuRGV0ZWN0b3IsIGNsYXVzZUV2YWx1YXRvckdlbmVyYXRvcnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uUGF0aCwgcGFyc2VyR2VuZXJhdGVkU29GYXIsIG9uU3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICB2YXIgZGV0ZWN0ZWQgPSB0b2tlbkRldGVjdG9yKGpzb25QYXRoKTtcblxuICAgICAgaWYoZGV0ZWN0ZWQpIHtcbiAgICAgICAgIHZhciBjb21waWxlZFBhcnNlciA9IGV4cHJlc3Npb25zUmVhZGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhdXNlRXZhbHVhdG9yR2VuZXJhdG9ycywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZXJHZW5lcmF0ZWRTb0ZhciwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXRlY3RlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgIFxuICAgICAgICAgICAgIHJlbWFpbmluZ1VucGFyc2VkSnNvblBhdGggPSBqc29uUGF0aC5zdWJzdHIobGVuKGRldGVjdGVkWzBdKSk7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgcmV0dXJuIG9uU3VjY2VzcyhyZW1haW5pbmdVbnBhcnNlZEpzb25QYXRoLCBjb21waWxlZFBhcnNlcik7XG4gICAgICB9ICAgICAgICAgXG4gICB9XG4gICAgICAgICAgICAgICAgIFxuICAgLyoqXG4gICAgKiBQYXJ0aWFsbHkgY29tcGxldGVzIGdlbmVyYXRlQ2xhdXNlUmVhZGVySWZUb2tlbkZvdW5kIGFib3ZlLiBcbiAgICAqL1xuICAgZnVuY3Rpb24gY2xhdXNlTWF0Y2hlcih0b2tlbkRldGVjdG9yLCBleHBycykge1xuICAgICAgICBcbiAgICAgIHJldHVybiAgIHBhcnRpYWxDb21wbGV0ZSggXG4gICAgICAgICAgICAgICAgICBnZW5lcmF0ZUNsYXVzZVJlYWRlcklmVG9rZW5Gb3VuZCwgXG4gICAgICAgICAgICAgICAgICB0b2tlbkRldGVjdG9yLCBcbiAgICAgICAgICAgICAgICAgIGV4cHJzIFxuICAgICAgICAgICAgICAgKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBjbGF1c2VGb3JKc29uUGF0aCBpcyBhIGZ1bmN0aW9uIHdoaWNoIGF0dGVtcHRzIHRvIG1hdGNoIGFnYWluc3QgXG4gICAgKiBzZXZlcmFsIGNsYXVzZSBtYXRjaGVycyBpbiBvcmRlciB1bnRpbCBvbmUgbWF0Y2hlcy4gSWYgbm9uIG1hdGNoIHRoZVxuICAgICoganNvblBhdGggZXhwcmVzc2lvbiBpcyBpbnZhbGlkIGFuZCBhbiBlcnJvciBpcyB0aHJvd24uXG4gICAgKiBcbiAgICAqIFRoZSBwYXJhbWV0ZXIgbGlzdCBpcyB0aGUgc2FtZSBhcyBhIHNpbmdsZSBjbGF1c2VNYXRjaGVyOlxuICAgICogXG4gICAgKiAgICAoanNvblBhdGgsIHBhcnNlckdlbmVyYXRlZFNvRmFyLCBvblN1Y2Nlc3MpXG4gICAgKi8gICAgIFxuICAgdmFyIGNsYXVzZUZvckpzb25QYXRoID0gbGF6eVVuaW9uKFxuXG4gICAgICBjbGF1c2VNYXRjaGVyKHBhdGhOb2RlU3ludGF4ICAgLCBsaXN0KCBjYXB0dXJlLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1Y2tUeXBlQ2xhdXNlLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVDbGF1c2UsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2tpcDEgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAsICBjbGF1c2VNYXRjaGVyKGRvdWJsZURvdFN5bnRheCAgLCBsaXN0KCBza2lwTWFueSkpXG4gICAgICAgXG4gICAgICAgLy8gZG90IGlzIGEgc2VwYXJhdG9yIG9ubHkgKGxpa2Ugd2hpdGVzcGFjZSBpbiBvdGhlciBsYW5ndWFnZXMpIGJ1dCBcbiAgICAgICAvLyByYXRoZXIgdGhhbiBtYWtlIGl0IGEgc3BlY2lhbCBjYXNlLCB1c2UgYW4gZW1wdHkgbGlzdCBvZiBcbiAgICAgICAvLyBleHByZXNzaW9ucyB3aGVuIHRoaXMgdG9rZW4gaXMgZm91bmRcbiAgICwgIGNsYXVzZU1hdGNoZXIoZG90U3ludGF4ICAgICAgICAsIGxpc3QoKSApICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAsICBjbGF1c2VNYXRjaGVyKGJhbmdTeW50YXggICAgICAgLCBsaXN0KCBjYXB0dXJlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9vdEV4cHIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgLCAgY2xhdXNlTWF0Y2hlcihlbXB0eVN5bnRheCAgICAgICwgbGlzdCggc3RhdGVtZW50RXhwcikpXG4gICBcbiAgICwgIGZ1bmN0aW9uIChqc29uUGF0aCkge1xuICAgICAgICAgdGhyb3cgRXJyb3IoJ1wiJyArIGpzb25QYXRoICsgJ1wiIGNvdWxkIG5vdCBiZSB0b2tlbmlzZWQnKSAgICAgIFxuICAgICAgfVxuICAgKTtcblxuXG4gICAvKipcbiAgICAqIE9uZSBvZiB0d28gcG9zc2libGUgdmFsdWVzIGZvciB0aGUgb25TdWNjZXNzIGFyZ3VtZW50IG9mIFxuICAgICogZ2VuZXJhdGVDbGF1c2VSZWFkZXJJZlRva2VuRm91bmQuXG4gICAgKiBcbiAgICAqIFdoZW4gdGhpcyBmdW5jdGlvbiBpcyB1c2VkLCBnZW5lcmF0ZUNsYXVzZVJlYWRlcklmVG9rZW5Gb3VuZCBzaW1wbHkgXG4gICAgKiByZXR1cm5zIHRoZSBjb21waWxlZFBhcnNlciB0aGF0IGl0IG1hZGUsIHJlZ2FyZGxlc3Mgb2YgaWYgdGhlcmUgaXMgXG4gICAgKiBhbnkgcmVtYWluaW5nIGpzb25QYXRoIHRvIGJlIGNvbXBpbGVkLlxuICAgICovXG4gICBmdW5jdGlvbiByZXR1cm5Gb3VuZFBhcnNlcihfcmVtYWluaW5nSnNvblBhdGgsIGNvbXBpbGVkUGFyc2VyKXsgXG4gICAgICByZXR1cm4gY29tcGlsZWRQYXJzZXIgXG4gICB9ICAgICBcbiAgICAgICAgICAgICAgXG4gICAvKipcbiAgICAqIFJlY3Vyc2l2ZWx5IGNvbXBpbGUgYSBKU09OUGF0aCBleHByZXNzaW9uLlxuICAgICogXG4gICAgKiBUaGlzIGZ1bmN0aW9uIHNlcnZlcyBhcyBvbmUgb2YgdHdvIHBvc3NpYmxlIHZhbHVlcyBmb3IgdGhlIG9uU3VjY2VzcyBcbiAgICAqIGFyZ3VtZW50IG9mIGdlbmVyYXRlQ2xhdXNlUmVhZGVySWZUb2tlbkZvdW5kLCBtZWFuaW5nIGNvbnRpbnVlIHRvXG4gICAgKiByZWN1cnNpdmVseSBjb21waWxlLiBPdGhlcndpc2UsIHJldHVybkZvdW5kUGFyc2VyIGlzIGdpdmVuIGFuZFxuICAgICogY29tcGlsYXRpb24gdGVybWluYXRlcy5cbiAgICAqL1xuICAgZnVuY3Rpb24gY29tcGlsZUpzb25QYXRoVG9GdW5jdGlvbiggdW5jb21waWxlZEpzb25QYXRoLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlckdlbmVyYXRlZFNvRmFyICkge1xuXG4gICAgICAvKipcbiAgICAgICAqIE9uIGZpbmRpbmcgYSBtYXRjaCwgaWYgdGhlcmUgaXMgcmVtYWluaW5nIHRleHQgdG8gYmUgY29tcGlsZWRcbiAgICAgICAqIHdlIHdhbnQgdG8gZWl0aGVyIGNvbnRpbnVlIHBhcnNpbmcgdXNpbmcgYSByZWN1cnNpdmUgY2FsbCB0byBcbiAgICAgICAqIGNvbXBpbGVKc29uUGF0aFRvRnVuY3Rpb24uIE90aGVyd2lzZSwgd2Ugd2FudCB0byBzdG9wIGFuZCByZXR1cm4gXG4gICAgICAgKiB0aGUgcGFyc2VyIHRoYXQgd2UgaGF2ZSBmb3VuZCBzbyBmYXIuXG4gICAgICAgKi9cbiAgICAgIHZhciBvbkZpbmQgPSAgICAgIHVuY29tcGlsZWRKc29uUGF0aFxuICAgICAgICAgICAgICAgICAgICAgPyAgY29tcGlsZUpzb25QYXRoVG9GdW5jdGlvbiBcbiAgICAgICAgICAgICAgICAgICAgIDogIHJldHVybkZvdW5kUGFyc2VyO1xuICAgICAgICAgICAgICAgICAgIFxuICAgICAgcmV0dXJuICAgY2xhdXNlRm9ySnNvblBhdGgoIFxuICAgICAgICAgICAgICAgICAgdW5jb21waWxlZEpzb25QYXRoLCBcbiAgICAgICAgICAgICAgICAgIHBhcnNlckdlbmVyYXRlZFNvRmFyLCBcbiAgICAgICAgICAgICAgICAgIG9uRmluZFxuICAgICAgICAgICAgICAgKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgIH1cblxuICAgLyoqXG4gICAgKiBUaGlzIGlzIHRoZSBmdW5jdGlvbiB0aGF0IHdlIGV4cG9zZSB0byB0aGUgcmVzdCBvZiB0aGUgbGlicmFyeS5cbiAgICAqL1xuICAgcmV0dXJuIGZ1bmN0aW9uKGpzb25QYXRoKXtcbiAgICAgICAgXG4gICAgICB0cnkge1xuICAgICAgICAgLy8gS2ljayBvZmYgdGhlIHJlY3Vyc2l2ZSBwYXJzaW5nIG9mIHRoZSBqc29uUGF0aCBcbiAgICAgICAgIHJldHVybiBjb21waWxlSnNvblBhdGhUb0Z1bmN0aW9uKGpzb25QYXRoLCBhbHdheXMpO1xuICAgICAgICAgXG4gICAgICB9IGNhdGNoKCBlICkge1xuICAgICAgICAgdGhyb3cgRXJyb3IoICdDb3VsZCBub3QgY29tcGlsZSBcIicgKyBqc29uUGF0aCArIFxuICAgICAgICAgICAgICAgICAgICAgICdcIiBiZWNhdXNlICcgKyBlLm1lc3NhZ2VcbiAgICAgICAgICk7XG4gICAgICB9XG4gICB9XG5cbn0pO1xuXG4vKipcbiAqIEEgcHViL3N1YiB3aGljaCBpcyByZXNwb25zaWJsZSBmb3IgYSBzaW5nbGUgZXZlbnQgdHlwZS4gQVxuICogbXVsdGktZXZlbnQgdHlwZSBldmVudCBidXMgaXMgY3JlYXRlZCBieSBwdWJTdWIgYnkgY29sbGVjdGluZ1xuICogc2V2ZXJhbCBvZiB0aGVzZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRUeXBlXG4gKiAgICB0aGUgbmFtZSBvZiB0aGUgZXZlbnRzIG1hbmFnZWQgYnkgdGhpcyBzaW5nbGVFdmVudFB1YlN1YlxuICogQHBhcmFtIHtzaW5nbGVFdmVudFB1YlN1Yn0gW25ld0xpc3RlbmVyXVxuICogICAgcGxhY2UgdG8gbm90aWZ5IG9mIG5ldyBsaXN0ZW5lcnNcbiAqIEBwYXJhbSB7c2luZ2xlRXZlbnRQdWJTdWJ9IFtyZW1vdmVMaXN0ZW5lcl1cbiAqICAgIHBsYWNlIHRvIG5vdGlmeSBvZiB3aGVuIGxpc3RlbmVycyBhcmUgcmVtb3ZlZFxuICovXG5mdW5jdGlvbiBzaW5nbGVFdmVudFB1YlN1YihldmVudFR5cGUsIG5ld0xpc3RlbmVyLCByZW1vdmVMaXN0ZW5lcil7XG5cbiAgLyoqIHdlIGFyZSBvcHRpbWlzZWQgZm9yIGVtaXR0aW5nIGV2ZW50cyBvdmVyIGZpcmluZyB0aGVtLlxuICAgKiAgQXMgd2VsbCBhcyB0aGUgdHVwbGUgbGlzdCB3aGljaCBzdG9yZXMgZXZlbnQgaWRzIGFuZFxuICAgKiAgbGlzdGVuZXJzIHRoZXJlIGlzIGEgbGlzdCB3aXRoIGp1c3QgdGhlIGxpc3RlbmVycyB3aGljaFxuICAgKiAgY2FuIGJlIGl0ZXJhdGVkIG1vcmUgcXVpY2tseSB3aGVuIHdlIGFyZSBlbWl0dGluZ1xuICAgKi9cbiAgdmFyIGxpc3RlbmVyVHVwbGVMaXN0LFxuICAgICAgbGlzdGVuZXJMaXN0O1xuXG4gIGZ1bmN0aW9uIGhhc0lkKGlkKXtcbiAgICByZXR1cm4gZnVuY3Rpb24odHVwbGUpIHtcbiAgICAgIHJldHVybiB0dXBsZS5pZCA9PSBpZDtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyXG4gICAgICogQHBhcmFtIHsqfSBsaXN0ZW5lcklkXG4gICAgICogICAgYW4gaWQgdGhhdCB0aGlzIGxpc3RlbmVyIGNhbiBsYXRlciBieSByZW1vdmVkIGJ5LlxuICAgICAqICAgIENhbiBiZSBvZiBhbnkgdHlwZSwgdG8gYmUgY29tcGFyZWQgdG8gb3RoZXIgaWRzIHVzaW5nID09XG4gICAgICovXG4gICAgb246ZnVuY3Rpb24oIGxpc3RlbmVyLCBsaXN0ZW5lcklkICkge1xuXG4gICAgICB2YXIgdHVwbGUgPSB7XG4gICAgICAgIGxpc3RlbmVyOiBsaXN0ZW5lclxuICAgICAgICAsICBpZDogICAgICAgbGlzdGVuZXJJZCB8fCBsaXN0ZW5lciAvLyB3aGVuIG5vIGlkIGlzIGdpdmVuIHVzZSB0aGVcbiAgICAgICAgLy8gbGlzdGVuZXIgZnVuY3Rpb24gYXMgdGhlIGlkXG4gICAgICB9O1xuXG4gICAgICBpZiggbmV3TGlzdGVuZXIgKSB7XG4gICAgICAgIG5ld0xpc3RlbmVyLmVtaXQoZXZlbnRUeXBlLCBsaXN0ZW5lciwgdHVwbGUuaWQpO1xuICAgICAgfVxuXG4gICAgICBsaXN0ZW5lclR1cGxlTGlzdCA9IGNvbnMoIHR1cGxlLCAgICBsaXN0ZW5lclR1cGxlTGlzdCApO1xuICAgICAgbGlzdGVuZXJMaXN0ICAgICAgPSBjb25zKCBsaXN0ZW5lciwgbGlzdGVuZXJMaXN0ICAgICAgKTtcblxuICAgICAgcmV0dXJuIHRoaXM7IC8vIGNoYWluaW5nXG4gICAgfSxcblxuICAgIGVtaXQ6ZnVuY3Rpb24gKCkge1xuICAgICAgYXBwbHlFYWNoKCBsaXN0ZW5lckxpc3QsIGFyZ3VtZW50cyApO1xuICAgIH0sXG5cbiAgICB1bjogZnVuY3Rpb24oIGxpc3RlbmVySWQgKSB7XG5cbiAgICAgIHZhciByZW1vdmVkO1xuXG4gICAgICBsaXN0ZW5lclR1cGxlTGlzdCA9IHdpdGhvdXQoXG4gICAgICAgIGxpc3RlbmVyVHVwbGVMaXN0LFxuICAgICAgICBoYXNJZChsaXN0ZW5lcklkKSxcbiAgICAgICAgZnVuY3Rpb24odHVwbGUpe1xuICAgICAgICAgIHJlbW92ZWQgPSB0dXBsZTtcbiAgICAgICAgfVxuICAgICAgKTtcblxuICAgICAgaWYoIHJlbW92ZWQgKSB7XG4gICAgICAgIGxpc3RlbmVyTGlzdCA9IHdpdGhvdXQoIGxpc3RlbmVyTGlzdCwgZnVuY3Rpb24obGlzdGVuZXIpe1xuICAgICAgICAgIHJldHVybiBsaXN0ZW5lciA9PSByZW1vdmVkLmxpc3RlbmVyO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiggcmVtb3ZlTGlzdGVuZXIgKSB7XG4gICAgICAgICAgcmVtb3ZlTGlzdGVuZXIuZW1pdChldmVudFR5cGUsIHJlbW92ZWQubGlzdGVuZXIsIHJlbW92ZWQuaWQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGxpc3RlbmVyczogZnVuY3Rpb24oKXtcbiAgICAgIC8vIGRpZmZlcnMgZnJvbSBOb2RlIEV2ZW50RW1pdHRlcjogcmV0dXJucyBsaXN0LCBub3QgYXJyYXlcbiAgICAgIHJldHVybiBsaXN0ZW5lckxpc3Q7XG4gICAgfSxcblxuICAgIGhhc0xpc3RlbmVyOiBmdW5jdGlvbihsaXN0ZW5lcklkKXtcbiAgICAgIHZhciB0ZXN0ID0gbGlzdGVuZXJJZD8gaGFzSWQobGlzdGVuZXJJZCkgOiBhbHdheXM7XG5cbiAgICAgIHJldHVybiBkZWZpbmVkKGZpcnN0KCB0ZXN0LCBsaXN0ZW5lclR1cGxlTGlzdCkpO1xuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4gKiBwdWJTdWIgaXMgYSBjdXJyaWVkIGludGVyZmFjZSBmb3IgbGlzdGVuaW5nIHRvIGFuZCBlbWl0dGluZ1xuICogZXZlbnRzLlxuICpcbiAqIElmIHdlIGdldCBhIGJ1czpcbiAqXG4gKiAgICB2YXIgYnVzID0gcHViU3ViKCk7XG4gKlxuICogV2UgY2FuIGxpc3RlbiB0byBldmVudCAnZm9vJyBsaWtlOlxuICpcbiAqICAgIGJ1cygnZm9vJykub24obXlDYWxsYmFjaylcbiAqXG4gKiBBbmQgZW1pdCBldmVudCBmb28gbGlrZTpcbiAqXG4gKiAgICBidXMoJ2ZvbycpLmVtaXQoKVxuICpcbiAqIG9yLCB3aXRoIGEgcGFyYW1ldGVyOlxuICpcbiAqICAgIGJ1cygnZm9vJykuZW1pdCgnYmFyJylcbiAqXG4gKiBBbGwgZnVuY3Rpb25zIGNhbiBiZSBjYWNoZWQgYW5kIGRvbid0IG5lZWQgdG8gYmVcbiAqIGJvdW5kLiBJZTpcbiAqXG4gKiAgICB2YXIgZm9vRW1pdHRlciA9IGJ1cygnZm9vJykuZW1pdFxuICogICAgZm9vRW1pdHRlcignYmFyJyk7ICAvLyBlbWl0IGFuIGV2ZW50XG4gKiAgICBmb29FbWl0dGVyKCdiYXonKTsgIC8vIGVtaXQgYW5vdGhlclxuICpcbiAqIFRoZXJlJ3MgYWxzbyBhbiB1bmN1cnJpZWRbMV0gc2hvcnRjdXQgZm9yIC5lbWl0IGFuZCAub246XG4gKlxuICogICAgYnVzLm9uKCdmb28nLCBjYWxsYmFjaylcbiAqICAgIGJ1cy5lbWl0KCdmb28nLCAnYmFyJylcbiAqXG4gKiBbMV06IGh0dHA6Ly96dm9uLm9yZy9vdGhlci9oYXNrZWxsL091dHB1dHByZWx1ZGUvdW5jdXJyeV9mLmh0bWxcbiAqL1xuZnVuY3Rpb24gcHViU3ViKCl7XG5cbiAgIHZhciBzaW5nbGVzID0ge30sXG4gICAgICAgbmV3TGlzdGVuZXIgPSBuZXdTaW5nbGUoJ25ld0xpc3RlbmVyJyksXG4gICAgICAgcmVtb3ZlTGlzdGVuZXIgPSBuZXdTaW5nbGUoJ3JlbW92ZUxpc3RlbmVyJyk7XG5cbiAgIGZ1bmN0aW9uIG5ld1NpbmdsZShldmVudE5hbWUpIHtcbiAgICAgIHJldHVybiBzaW5nbGVzW2V2ZW50TmFtZV0gPSBzaW5nbGVFdmVudFB1YlN1YihcbiAgICAgICAgIGV2ZW50TmFtZSxcbiAgICAgICAgIG5ld0xpc3RlbmVyLFxuICAgICAgICAgcmVtb3ZlTGlzdGVuZXJcbiAgICAgICk7XG4gICB9XG5cbiAgIC8qKiBwdWJTdWIgaW5zdGFuY2VzIGFyZSBmdW5jdGlvbnMgKi9cbiAgIGZ1bmN0aW9uIHB1YlN1Ykluc3RhbmNlKCBldmVudE5hbWUgKXtcblxuICAgICAgcmV0dXJuIHNpbmdsZXNbZXZlbnROYW1lXSB8fCBuZXdTaW5nbGUoIGV2ZW50TmFtZSApO1xuICAgfVxuXG4gICAvLyBhZGQgY29udmVuaWVuY2UgRXZlbnRFbWl0dGVyLXN0eWxlIHVuY3VycmllZCBmb3JtIG9mICdlbWl0JyBhbmQgJ29uJ1xuICAgWydlbWl0JywgJ29uJywgJ3VuJ10uZm9yRWFjaChmdW5jdGlvbihtZXRob2ROYW1lKXtcblxuICAgICAgcHViU3ViSW5zdGFuY2VbbWV0aG9kTmFtZV0gPSB2YXJBcmdzKGZ1bmN0aW9uKGV2ZW50TmFtZSwgcGFyYW1ldGVycyl7XG4gICAgICAgICBhcHBseSggcGFyYW1ldGVycywgcHViU3ViSW5zdGFuY2UoIGV2ZW50TmFtZSApW21ldGhvZE5hbWVdKTtcbiAgICAgIH0pO1xuICAgfSk7XG5cbiAgIHJldHVybiBwdWJTdWJJbnN0YW5jZTtcbn1cblxuLyoqXG4gKiBUaGlzIGZpbGUgZGVjbGFyZXMgc29tZSBjb25zdGFudHMgdG8gdXNlIGFzIG5hbWVzIGZvciBldmVudCB0eXBlcy5cbiAqL1xuXG52YXIgLy8gdGhlIGV2ZW50cyB3aGljaCBhcmUgbmV2ZXIgZXhwb3J0ZWQgYXJlIGtlcHQgYXMgXG4gICAgLy8gdGhlIHNtYWxsZXN0IHBvc3NpYmxlIHJlcHJlc2VudGF0aW9uLCBpbiBudW1iZXJzOlxuICAgIF9TID0gMSxcblxuICAgIC8vIGZpcmVkIHdoZW5ldmVyIGEgbmV3IG5vZGUgc3RhcnRzIGluIHRoZSBKU09OIHN0cmVhbTpcbiAgICBOT0RFX09QRU5FRCAgICAgPSBfUysrLFxuXG4gICAgLy8gZmlyZWQgd2hlbmV2ZXIgYSBub2RlIGNsb3NlcyBpbiB0aGUgSlNPTiBzdHJlYW06XG4gICAgTk9ERV9DTE9TRUQgICAgID0gX1MrKyxcblxuICAgIC8vIGNhbGxlZCBpZiBhIC5ub2RlIGNhbGxiYWNrIHJldHVybnMgYSB2YWx1ZSAtIFxuICAgIE5PREVfU1dBUCAgICAgICA9IF9TKyssXG4gICAgTk9ERV9EUk9QICAgICAgID0gX1MrKyxcblxuICAgIEZBSUxfRVZFTlQgICAgICA9ICdmYWlsJyxcbiAgIFxuICAgIFJPT1RfTk9ERV9GT1VORCA9IF9TKyssXG4gICAgUk9PVF9QQVRIX0ZPVU5EID0gX1MrKyxcbiAgIFxuICAgIEhUVFBfU1RBUlQgICAgICA9ICdzdGFydCcsXG4gICAgU1RSRUFNX0RBVEEgICAgID0gJ2RhdGEnLFxuICAgIFNUUkVBTV9FTkQgICAgICA9ICdlbmQnLFxuICAgIEFCT1JUSU5HICAgICAgICA9IF9TKyssXG5cbiAgICAvLyBTQVggZXZlbnRzIGJ1dGNoZXJlZCBmcm9tIENsYXJpbmV0XG4gICAgU0FYX0tFWSAgICAgICAgICA9IF9TKyssXG4gICAgU0FYX1ZBTFVFX09QRU4gICA9IF9TKyssXG4gICAgU0FYX1ZBTFVFX0NMT1NFICA9IF9TKys7XG4gICAgXG5mdW5jdGlvbiBlcnJvclJlcG9ydChzdGF0dXNDb2RlLCBib2R5LCBlcnJvcikge1xuICAgdHJ5e1xuICAgICAgdmFyIGpzb25Cb2R5ID0gSlNPTi5wYXJzZShib2R5KTtcbiAgIH1jYXRjaChlKXt9XG5cbiAgIHJldHVybiB7XG4gICAgICBzdGF0dXNDb2RlOnN0YXR1c0NvZGUsXG4gICAgICBib2R5OmJvZHksXG4gICAgICBqc29uQm9keTpqc29uQm9keSxcbiAgICAgIHRocm93bjplcnJvclxuICAgfTtcbn0gICAgXG5cbi8qKiBcbiAqICBUaGUgcGF0dGVybiBhZGFwdG9yIGxpc3RlbnMgZm9yIG5ld0xpc3RlbmVyIGFuZCByZW1vdmVMaXN0ZW5lclxuICogIGV2ZW50cy4gV2hlbiBwYXR0ZXJucyBhcmUgYWRkZWQgb3IgcmVtb3ZlZCBpdCBjb21waWxlcyB0aGUgSlNPTlBhdGhcbiAqICBhbmQgd2lyZXMgdGhlbSB1cC5cbiAqICBcbiAqICBXaGVuIG5vZGVzIGFuZCBwYXRocyBhcmUgZm91bmQgaXQgZW1pdHMgdGhlIGZ1bGx5LXF1YWxpZmllZCBtYXRjaCBcbiAqICBldmVudHMgd2l0aCBwYXJhbWV0ZXJzIHJlYWR5IHRvIHNoaXAgdG8gdGhlIG91dHNpZGUgd29ybGRcbiAqL1xuXG5mdW5jdGlvbiBwYXR0ZXJuQWRhcHRlcihvYm9lQnVzLCBqc29uUGF0aENvbXBpbGVyKSB7XG5cbiAgIHZhciBwcmVkaWNhdGVFdmVudE1hcCA9IHtcbiAgICAgIG5vZGU6b2JvZUJ1cyhOT0RFX0NMT1NFRClcbiAgICwgIHBhdGg6b2JvZUJ1cyhOT0RFX09QRU5FRClcbiAgIH07XG4gICAgIFxuICAgZnVuY3Rpb24gZW1pdE1hdGNoaW5nTm9kZShlbWl0TWF0Y2gsIG5vZGUsIGFzY2VudCkge1xuICAgICAgICAgXG4gICAgICAvKiBcbiAgICAgICAgIFdlJ3JlIG5vdyBjYWxsaW5nIHRvIHRoZSBvdXRzaWRlIHdvcmxkIHdoZXJlIExpc3Atc3R5bGUgXG4gICAgICAgICBsaXN0cyB3aWxsIG5vdCBiZSBmYW1pbGlhci4gQ29udmVydCB0byBzdGFuZGFyZCBhcnJheXMuIFxuICAgXG4gICAgICAgICBBbHNvLCByZXZlcnNlIHRoZSBvcmRlciBiZWNhdXNlIGl0IGlzIG1vcmUgY29tbW9uIHRvIFxuICAgICAgICAgbGlzdCBwYXRocyBcInJvb3QgdG8gbGVhZlwiIHRoYW4gXCJsZWFmIHRvIHJvb3RcIiAgKi9cbiAgICAgIHZhciBkZXNjZW50ICAgICA9IHJldmVyc2VMaXN0KGFzY2VudCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICBlbWl0TWF0Y2goXG4gICAgICAgICBub2RlLFxuICAgICAgICAgXG4gICAgICAgICAvLyBUbyBtYWtlIGEgcGF0aCwgc3RyaXAgb2ZmIHRoZSBsYXN0IGl0ZW0gd2hpY2ggaXMgdGhlIHNwZWNpYWxcbiAgICAgICAgIC8vIFJPT1RfUEFUSCB0b2tlbiBmb3IgdGhlICdwYXRoJyB0byB0aGUgcm9vdCBub2RlICAgICAgICAgIFxuICAgICAgICAgbGlzdEFzQXJyYXkodGFpbChtYXAoa2V5T2YsZGVzY2VudCkpKSwgIC8vIHBhdGhcbiAgICAgICAgIGxpc3RBc0FycmF5KG1hcChub2RlT2YsIGRlc2NlbnQpKSAgICAgICAvLyBhbmNlc3RvcnMgICAgXG4gICAgICApOyAgICAgICAgIFxuICAgfVxuXG4gICAvKiBcbiAgICAqIFNldCB1cCB0aGUgY2F0Y2hpbmcgb2YgZXZlbnRzIHN1Y2ggYXMgTk9ERV9DTE9TRUQgYW5kIE5PREVfT1BFTkVEIGFuZCwgaWYgXG4gICAgKiBtYXRjaGluZyB0aGUgc3BlY2lmaWVkIHBhdHRlcm4sIHByb3BhZ2F0ZSB0byBwYXR0ZXJuLW1hdGNoIGV2ZW50cyBzdWNoIGFzIFxuICAgICogb2JvZUJ1cygnbm9kZTohJylcbiAgICAqIFxuICAgICogXG4gICAgKiBcbiAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZUV2ZW50IFxuICAgICogICAgICAgICAgZWl0aGVyIG9ib2VCdXMoTk9ERV9DTE9TRUQpIG9yIG9ib2VCdXMoTk9ERV9PUEVORUQpLlxuICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY29tcGlsZWRKc29uUGF0aCAgICAgICAgICBcbiAgICAqL1xuICAgZnVuY3Rpb24gYWRkVW5kZXJseWluZ0xpc3RlbmVyKCBmdWxsRXZlbnROYW1lLCBwcmVkaWNhdGVFdmVudCwgY29tcGlsZWRKc29uUGF0aCApe1xuICAgXG4gICAgICB2YXIgZW1pdE1hdGNoID0gb2JvZUJ1cyhmdWxsRXZlbnROYW1lKS5lbWl0O1xuICAgXG4gICAgICBwcmVkaWNhdGVFdmVudC5vbiggZnVuY3Rpb24gKGFzY2VudCkge1xuXG4gICAgICAgICB2YXIgbWF5YmVNYXRjaGluZ01hcHBpbmcgPSBjb21waWxlZEpzb25QYXRoKGFzY2VudCk7XG5cbiAgICAgICAgIC8qIFBvc3NpYmxlIHZhbHVlcyBmb3IgbWF5YmVNYXRjaGluZ01hcHBpbmcgYXJlIG5vdzpcblxuICAgICAgICAgIGZhbHNlOiBcbiAgICAgICAgICB3ZSBkaWQgbm90IG1hdGNoIFxuXG4gICAgICAgICAgYW4gb2JqZWN0L2FycmF5L3N0cmluZy9udW1iZXIvbnVsbDogXG4gICAgICAgICAgd2UgbWF0Y2hlZCBhbmQgaGF2ZSB0aGUgbm9kZSB0aGF0IG1hdGNoZWQuXG4gICAgICAgICAgQmVjYXVzZSBudWxscyBhcmUgdmFsaWQganNvbiB2YWx1ZXMgdGhpcyBjYW4gYmUgbnVsbC5cblxuICAgICAgICAgIHVuZGVmaW5lZDpcbiAgICAgICAgICB3ZSBtYXRjaGVkIGJ1dCBkb24ndCBoYXZlIHRoZSBtYXRjaGluZyBub2RlIHlldC5cbiAgICAgICAgICBpZSwgd2Uga25vdyB0aGVyZSBpcyBhbiB1cGNvbWluZyBub2RlIHRoYXQgbWF0Y2hlcyBidXQgd2UgXG4gICAgICAgICAgY2FuJ3Qgc2F5IGFueXRoaW5nIGVsc2UgYWJvdXQgaXQuIFxuICAgICAgICAgICovXG4gICAgICAgICBpZiAobWF5YmVNYXRjaGluZ01hcHBpbmcgIT09IGZhbHNlKSB7XG5cbiAgICAgICAgICAgIGVtaXRNYXRjaGluZ05vZGUoXG4gICAgICAgICAgICAgICBlbWl0TWF0Y2gsIFxuICAgICAgICAgICAgICAgbm9kZU9mKG1heWJlTWF0Y2hpbmdNYXBwaW5nKSwgXG4gICAgICAgICAgICAgICBhc2NlbnRcbiAgICAgICAgICAgICk7XG4gICAgICAgICB9XG4gICAgICB9LCBmdWxsRXZlbnROYW1lKTtcbiAgICAgXG4gICAgICBvYm9lQnVzKCdyZW1vdmVMaXN0ZW5lcicpLm9uKCBmdW5jdGlvbihyZW1vdmVkRXZlbnROYW1lKXtcblxuICAgICAgICAgLy8gaWYgdGhlIGZ1bGx5IHF1YWxpZmllZCBtYXRjaCBldmVudCBsaXN0ZW5lciBpcyBsYXRlciByZW1vdmVkLCBjbGVhbiB1cCBcbiAgICAgICAgIC8vIGJ5IHJlbW92aW5nIHRoZSB1bmRlcmx5aW5nIGxpc3RlbmVyIGlmIGl0IHdhcyB0aGUgbGFzdCB1c2luZyB0aGF0IHBhdHRlcm46XG4gICAgICBcbiAgICAgICAgIGlmKCByZW1vdmVkRXZlbnROYW1lID09IGZ1bGxFdmVudE5hbWUgKSB7XG4gICAgICAgICBcbiAgICAgICAgICAgIGlmKCAhb2JvZUJ1cyhyZW1vdmVkRXZlbnROYW1lKS5saXN0ZW5lcnMoICApKSB7XG4gICAgICAgICAgICAgICBwcmVkaWNhdGVFdmVudC51biggZnVsbEV2ZW50TmFtZSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgfVxuICAgICAgfSk7ICAgXG4gICB9XG5cbiAgIG9ib2VCdXMoJ25ld0xpc3RlbmVyJykub24oIGZ1bmN0aW9uKGZ1bGxFdmVudE5hbWUpe1xuXG4gICAgICB2YXIgbWF0Y2ggPSAvKG5vZGV8cGF0aCk6KC4qKS8uZXhlYyhmdWxsRXZlbnROYW1lKTtcbiAgICAgIFxuICAgICAgaWYoIG1hdGNoICkge1xuICAgICAgICAgdmFyIHByZWRpY2F0ZUV2ZW50ID0gcHJlZGljYXRlRXZlbnRNYXBbbWF0Y2hbMV1dO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgIGlmKCAhcHJlZGljYXRlRXZlbnQuaGFzTGlzdGVuZXIoIGZ1bGxFdmVudE5hbWUpICkgeyAgXG4gICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIGFkZFVuZGVybHlpbmdMaXN0ZW5lcihcbiAgICAgICAgICAgICAgIGZ1bGxFdmVudE5hbWUsXG4gICAgICAgICAgICAgICBwcmVkaWNhdGVFdmVudCwgXG4gICAgICAgICAgICAgICBqc29uUGF0aENvbXBpbGVyKCBtYXRjaFsyXSApXG4gICAgICAgICAgICApO1xuICAgICAgICAgfVxuICAgICAgfSAgICBcbiAgIH0pXG5cbn1cblxuLyoqXG4gKiBUaGUgaW5zdGFuY2UgQVBJIGlzIHRoZSB0aGluZyB0aGF0IGlzIHJldHVybmVkIHdoZW4gb2JvZSgpIGlzIGNhbGxlZC5cbiAqIGl0IGFsbG93czpcbiAqXG4gKiAgICAtIGxpc3RlbmVycyBmb3IgdmFyaW91cyBldmVudHMgdG8gYmUgYWRkZWQgYW5kIHJlbW92ZWRcbiAqICAgIC0gdGhlIGh0dHAgcmVzcG9uc2UgaGVhZGVyL2hlYWRlcnMgdG8gYmUgcmVhZFxuICovXG5mdW5jdGlvbiBpbnN0YW5jZUFwaShvYm9lQnVzLCBjb250ZW50U291cmNlKXtcblxuICB2YXIgb2JvZUFwaSxcbiAgICAgIGZ1bGx5UXVhbGlmaWVkTmFtZVBhdHRlcm4gPSAvXihub2RlfHBhdGgpOi4vLFxuICAgICAgcm9vdE5vZGVGaW5pc2hlZEV2ZW50ID0gb2JvZUJ1cyhST09UX05PREVfRk9VTkQpLFxuICAgICAgZW1pdE5vZGVEcm9wID0gb2JvZUJ1cyhOT0RFX0RST1ApLmVtaXQsXG4gICAgICBlbWl0Tm9kZVN3YXAgPSBvYm9lQnVzKE5PREVfU1dBUCkuZW1pdCxcblxuICAgICAgLyoqXG4gICAgICAgKiBBZGQgYW55IGtpbmQgb2YgbGlzdGVuZXIgdGhhdCB0aGUgaW5zdGFuY2UgYXBpIGV4cG9zZXNcbiAgICAgICAqL1xuICAgICAgYWRkTGlzdGVuZXIgPSB2YXJBcmdzKGZ1bmN0aW9uKCBldmVudElkLCBwYXJhbWV0ZXJzICl7XG5cbiAgICAgICAgaWYoIG9ib2VBcGlbZXZlbnRJZF0gKSB7XG5cbiAgICAgICAgICAvLyBmb3IgZXZlbnRzIGFkZGVkIGFzIC5vbihldmVudCwgY2FsbGJhY2spLCBpZiB0aGVyZSBpcyBhXG4gICAgICAgICAgLy8gLmV2ZW50KCkgZXF1aXZhbGVudCB3aXRoIHNwZWNpYWwgYmVoYXZpb3VyICwgcGFzcyB0aHJvdWdoXG4gICAgICAgICAgLy8gdG8gdGhhdDpcbiAgICAgICAgICBhcHBseShwYXJhbWV0ZXJzLCBvYm9lQXBpW2V2ZW50SWRdKTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgIC8vIHdlIGhhdmUgYSBzdGFuZGFyZCBOb2RlLmpzIEV2ZW50RW1pdHRlciAyLWFyZ3VtZW50IGNhbGwuXG4gICAgICAgICAgLy8gVGhlIGZpcnN0IHBhcmFtZXRlciBpcyB0aGUgbGlzdGVuZXIuXG4gICAgICAgICAgdmFyIGV2ZW50ID0gb2JvZUJ1cyhldmVudElkKSxcbiAgICAgICAgICAgICAgbGlzdGVuZXIgPSBwYXJhbWV0ZXJzWzBdO1xuXG4gICAgICAgICAgaWYoIGZ1bGx5UXVhbGlmaWVkTmFtZVBhdHRlcm4udGVzdChldmVudElkKSApIHtcblxuICAgICAgICAgICAgLy8gYWxsb3cgZnVsbHktcXVhbGlmaWVkIG5vZGUvcGF0aCBsaXN0ZW5lcnNcbiAgICAgICAgICAgIC8vIHRvIGJlIGFkZGVkXG4gICAgICAgICAgICBhZGRGb3JnZXR0YWJsZUNhbGxiYWNrKGV2ZW50LCBsaXN0ZW5lcik7XG4gICAgICAgICAgfSBlbHNlICB7XG5cbiAgICAgICAgICAgIC8vIHRoZSBldmVudCBoYXMgbm8gc3BlY2lhbCBoYW5kbGluZywgcGFzcyB0aHJvdWdoXG4gICAgICAgICAgICAvLyBkaXJlY3RseSBvbnRvIHRoZSBldmVudCBidXM6XG4gICAgICAgICAgICBldmVudC5vbiggbGlzdGVuZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvYm9lQXBpOyAvLyBjaGFpbmluZ1xuICAgICAgfSksXG5cbiAgICAgIC8qKlxuICAgICAgICogUmVtb3ZlIGFueSBraW5kIG9mIGxpc3RlbmVyIHRoYXQgdGhlIGluc3RhbmNlIGFwaSBleHBvc2VzXG4gICAgICAgKi9cbiAgICAgIHJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24oIGV2ZW50SWQsIHAyLCBwMyApe1xuXG4gICAgICAgIGlmKCBldmVudElkID09ICdkb25lJyApIHtcblxuICAgICAgICAgIHJvb3ROb2RlRmluaXNoZWRFdmVudC51bihwMik7XG5cbiAgICAgICAgfSBlbHNlIGlmKCBldmVudElkID09ICdub2RlJyB8fCBldmVudElkID09ICdwYXRoJyApIHtcblxuICAgICAgICAgIC8vIGFsbG93IHJlbW92YWwgb2Ygbm9kZSBhbmQgcGF0aFxuICAgICAgICAgIG9ib2VCdXMudW4oZXZlbnRJZCArICc6JyArIHAyLCBwMyk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAvLyB3ZSBoYXZlIGEgc3RhbmRhcmQgTm9kZS5qcyBFdmVudEVtaXR0ZXIgMi1hcmd1bWVudCBjYWxsLlxuICAgICAgICAgIC8vIFRoZSBzZWNvbmQgcGFyYW1ldGVyIGlzIHRoZSBsaXN0ZW5lci4gVGhpcyBtYXkgYmUgYSBjYWxsXG4gICAgICAgICAgLy8gdG8gcmVtb3ZlIGEgZnVsbHktcXVhbGlmaWVkIG5vZGUvcGF0aCBsaXN0ZW5lciBidXQgcmVxdWlyZXNcbiAgICAgICAgICAvLyBubyBzcGVjaWFsIGhhbmRsaW5nXG4gICAgICAgICAgdmFyIGxpc3RlbmVyID0gcDI7XG5cbiAgICAgICAgICBvYm9lQnVzKGV2ZW50SWQpLnVuKGxpc3RlbmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvYm9lQXBpOyAvLyBjaGFpbmluZ1xuICAgICAgfTtcblxuICAvKipcbiAgICogQWRkIGEgY2FsbGJhY2ssIHdyYXBwZWQgaW4gYSB0cnkvY2F0Y2ggc28gYXMgdG8gbm90IGJyZWFrIHRoZVxuICAgKiBleGVjdXRpb24gb2YgT2JvZSBpZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIChmYWlsIGV2ZW50cyBhcmVcbiAgICogZmlyZWQgaW5zdGVhZClcbiAgICpcbiAgICogVGhlIGNhbGxiYWNrIGlzIHVzZWQgYXMgdGhlIGxpc3RlbmVyIGlkIHNvIHRoYXQgaXQgY2FuIGxhdGVyIGJlXG4gICAqIHJlbW92ZWQgdXNpbmcgLnVuKGNhbGxiYWNrKVxuICAgKi9cbiAgZnVuY3Rpb24gYWRkUHJvdGVjdGVkQ2FsbGJhY2soZXZlbnROYW1lLCBjYWxsYmFjaykge1xuICAgIG9ib2VCdXMoZXZlbnROYW1lKS5vbihwcm90ZWN0ZWRDYWxsYmFjayhjYWxsYmFjayksIGNhbGxiYWNrKTtcbiAgICByZXR1cm4gb2JvZUFwaTsgLy8gY2hhaW5pbmdcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBjYWxsYmFjayB3aGVyZSwgaWYgLmZvcmdldCgpIGlzIGNhbGxlZCBkdXJpbmcgdGhlIGNhbGxiYWNrJ3NcbiAgICogZXhlY3V0aW9uLCB0aGUgY2FsbGJhY2sgd2lsbCBiZSBkZS1yZWdpc3RlcmVkXG4gICAqL1xuICBmdW5jdGlvbiBhZGRGb3JnZXR0YWJsZUNhbGxiYWNrKGV2ZW50LCBjYWxsYmFjaywgbGlzdGVuZXJJZCkge1xuXG4gICAgLy8gbGlzdGVuZXJJZCBpcyBvcHRpb25hbCBhbmQgaWYgbm90IGdpdmVuLCB0aGUgb3JpZ2luYWxcbiAgICAvLyBjYWxsYmFjayB3aWxsIGJlIHVzZWRcbiAgICBsaXN0ZW5lcklkID0gbGlzdGVuZXJJZCB8fCBjYWxsYmFjaztcblxuICAgIHZhciBzYWZlQ2FsbGJhY2sgPSBwcm90ZWN0ZWRDYWxsYmFjayhjYWxsYmFjayk7XG5cbiAgICBldmVudC5vbiggZnVuY3Rpb24oKSB7XG5cbiAgICAgIHZhciBkaXNjYXJkID0gZmFsc2U7XG5cbiAgICAgIG9ib2VBcGkuZm9yZ2V0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgZGlzY2FyZCA9IHRydWU7XG4gICAgICB9O1xuXG4gICAgICBhcHBseSggYXJndW1lbnRzLCBzYWZlQ2FsbGJhY2sgKTtcblxuICAgICAgZGVsZXRlIG9ib2VBcGkuZm9yZ2V0O1xuXG4gICAgICBpZiggZGlzY2FyZCApIHtcbiAgICAgICAgZXZlbnQudW4obGlzdGVuZXJJZCk7XG4gICAgICB9XG4gICAgfSwgbGlzdGVuZXJJZCk7XG5cbiAgICByZXR1cm4gb2JvZUFwaTsgLy8gY2hhaW5pbmdcbiAgfVxuXG4gIC8qKlxuICAgKiAgd3JhcCBhIGNhbGxiYWNrIHNvIHRoYXQgaWYgaXQgdGhyb3dzLCBPYm9lLmpzIGRvZXNuJ3QgY3Jhc2ggYnV0IGluc3RlYWRcbiAgICogIHRocm93IHRoZSBlcnJvciBpbiBhbm90aGVyIGV2ZW50IGxvb3BcbiAgICovXG4gIGZ1bmN0aW9uIHByb3RlY3RlZENhbGxiYWNrKCBjYWxsYmFjayApIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB0cnl7XG4gICAgICAgIHJldHVybiBjYWxsYmFjay5hcHBseShvYm9lQXBpLCBhcmd1bWVudHMpO1xuICAgICAgfWNhdGNoKGUpICB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGUubWVzc2FnZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGZ1bGx5IHF1YWxpZmllZCBldmVudCBmb3Igd2hlbiBhIHBhdHRlcm4gbWF0Y2hlc1xuICAgKiBlaXRoZXIgYSBub2RlIG9yIGEgcGF0aFxuICAgKlxuICAgKiBAcGFyYW0gdHlwZSB7U3RyaW5nfSBlaXRoZXIgJ25vZGUnIG9yICdwYXRoJ1xuICAgKi9cbiAgZnVuY3Rpb24gZnVsbHlRdWFsaWZpZWRQYXR0ZXJuTWF0Y2hFdmVudCh0eXBlLCBwYXR0ZXJuKSB7XG4gICAgcmV0dXJuIG9ib2VCdXModHlwZSArICc6JyArIHBhdHRlcm4pO1xuICB9XG5cbiAgZnVuY3Rpb24gd3JhcENhbGxiYWNrVG9Td2FwTm9kZUlmU29tZXRoaW5nUmV0dXJuZWQoIGNhbGxiYWNrICkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZXR1cm5WYWx1ZUZyb21DYWxsYmFjayA9IGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgIGlmKCBkZWZpbmVkKHJldHVyblZhbHVlRnJvbUNhbGxiYWNrKSApIHtcblxuICAgICAgICBpZiggcmV0dXJuVmFsdWVGcm9tQ2FsbGJhY2sgPT0gb2JvZS5kcm9wICkge1xuICAgICAgICAgIGVtaXROb2RlRHJvcCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVtaXROb2RlU3dhcChyZXR1cm5WYWx1ZUZyb21DYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBhZGRTaW5nbGVOb2RlT3JQYXRoTGlzdGVuZXIoZXZlbnRJZCwgcGF0dGVybiwgY2FsbGJhY2spIHtcblxuICAgIHZhciBlZmZlY3RpdmVDYWxsYmFjaztcblxuICAgIGlmKCBldmVudElkID09ICdub2RlJyApIHtcbiAgICAgIGVmZmVjdGl2ZUNhbGxiYWNrID0gd3JhcENhbGxiYWNrVG9Td2FwTm9kZUlmU29tZXRoaW5nUmV0dXJuZWQoY2FsbGJhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICBlZmZlY3RpdmVDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIH1cblxuICAgIGFkZEZvcmdldHRhYmxlQ2FsbGJhY2soXG4gICAgICBmdWxseVF1YWxpZmllZFBhdHRlcm5NYXRjaEV2ZW50KGV2ZW50SWQsIHBhdHRlcm4pLFxuICAgICAgZWZmZWN0aXZlQ2FsbGJhY2ssXG4gICAgICBjYWxsYmFja1xuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIHNldmVyYWwgbGlzdGVuZXJzIGF0IGEgdGltZSwgZnJvbSBhIG1hcFxuICAgKi9cbiAgZnVuY3Rpb24gYWRkTXVsdGlwbGVOb2RlT3JQYXRoTGlzdGVuZXJzKGV2ZW50SWQsIGxpc3RlbmVyTWFwKSB7XG5cbiAgICBmb3IoIHZhciBwYXR0ZXJuIGluIGxpc3RlbmVyTWFwICkge1xuICAgICAgYWRkU2luZ2xlTm9kZU9yUGF0aExpc3RlbmVyKGV2ZW50SWQsIHBhdHRlcm4sIGxpc3RlbmVyTWFwW3BhdHRlcm5dKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogaW1wbGVtZW50YXRpb24gYmVoaW5kIC5vblBhdGgoKSBhbmQgLm9uTm9kZSgpXG4gICAqL1xuICBmdW5jdGlvbiBhZGROb2RlT3JQYXRoTGlzdGVuZXJBcGkoIGV2ZW50SWQsIGpzb25QYXRoT3JMaXN0ZW5lck1hcCwgY2FsbGJhY2sgKXtcblxuICAgIGlmKCBpc1N0cmluZyhqc29uUGF0aE9yTGlzdGVuZXJNYXApICkge1xuICAgICAgYWRkU2luZ2xlTm9kZU9yUGF0aExpc3RlbmVyKGV2ZW50SWQsIGpzb25QYXRoT3JMaXN0ZW5lck1hcCwgY2FsbGJhY2spO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIGFkZE11bHRpcGxlTm9kZU9yUGF0aExpc3RlbmVycyhldmVudElkLCBqc29uUGF0aE9yTGlzdGVuZXJNYXApO1xuICAgIH1cblxuICAgIHJldHVybiBvYm9lQXBpOyAvLyBjaGFpbmluZ1xuICB9XG5cblxuICAvLyBzb21lIGludGVyZmFjZSBtZXRob2RzIGFyZSBvbmx5IGZpbGxlZCBpbiBhZnRlciB3ZSByZWNlaXZlXG4gIC8vIHZhbHVlcyBhbmQgYXJlIG5vb3BzIGJlZm9yZSB0aGF0OlxuICBvYm9lQnVzKFJPT1RfUEFUSF9GT1VORCkub24oIGZ1bmN0aW9uKHJvb3ROb2RlKSB7XG4gICAgb2JvZUFwaS5yb290ID0gZnVuY3Rvcihyb290Tm9kZSk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBXaGVuIGNvbnRlbnQgc3RhcnRzIG1ha2UgdGhlIGhlYWRlcnMgcmVhZGFibGUgdGhyb3VnaCB0aGVcbiAgICogaW5zdGFuY2UgQVBJXG4gICAqL1xuICBvYm9lQnVzKEhUVFBfU1RBUlQpLm9uKCBmdW5jdGlvbihfc3RhdHVzQ29kZSwgaGVhZGVycykge1xuXG4gICAgb2JvZUFwaS5oZWFkZXIgPSAgZnVuY3Rpb24obmFtZSkge1xuICAgICAgcmV0dXJuIG5hbWUgPyBoZWFkZXJzW25hbWVdXG4gICAgICAgIDogaGVhZGVyc1xuICAgICAgO1xuICAgIH1cbiAgfSk7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhbmQgcmV0dXJuIHRoZSBwdWJsaWMgQVBJIG9mIHRoZSBPYm9lIGluc3RhbmNlIHRvIGJlXG4gICAqIHJldHVybmVkIHRvIHRoZSBjYWxsaW5nIGFwcGxpY2F0aW9uXG4gICAqL1xuICByZXR1cm4gb2JvZUFwaSA9IHtcbiAgICBvbiAgICAgICAgICAgICA6IGFkZExpc3RlbmVyLFxuICAgIGFkZExpc3RlbmVyICAgIDogYWRkTGlzdGVuZXIsXG4gICAgcmVtb3ZlTGlzdGVuZXIgOiByZW1vdmVMaXN0ZW5lcixcbiAgICBlbWl0ICAgICAgICAgICA6IG9ib2VCdXMuZW1pdCxcblxuICAgIG5vZGUgICAgICAgICAgIDogcGFydGlhbENvbXBsZXRlKGFkZE5vZGVPclBhdGhMaXN0ZW5lckFwaSwgJ25vZGUnKSxcbiAgICBwYXRoICAgICAgICAgICA6IHBhcnRpYWxDb21wbGV0ZShhZGROb2RlT3JQYXRoTGlzdGVuZXJBcGksICdwYXRoJyksXG5cbiAgICBkb25lICAgICAgICAgICA6IHBhcnRpYWxDb21wbGV0ZShhZGRGb3JnZXR0YWJsZUNhbGxiYWNrLCByb290Tm9kZUZpbmlzaGVkRXZlbnQpLFxuICAgIHN0YXJ0ICAgICAgICAgIDogcGFydGlhbENvbXBsZXRlKGFkZFByb3RlY3RlZENhbGxiYWNrLCBIVFRQX1NUQVJUICksXG5cbiAgICAvLyBmYWlsIGRvZXNuJ3QgdXNlIHByb3RlY3RlZENhbGxiYWNrIGJlY2F1c2VcbiAgICAvLyBjb3VsZCBsZWFkIHRvIG5vbi10ZXJtaW5hdGluZyBsb29wc1xuICAgIGZhaWwgICAgICAgICAgIDogb2JvZUJ1cyhGQUlMX0VWRU5UKS5vbixcblxuICAgIC8vIHB1YmxpYyBhcGkgY2FsbGluZyBhYm9ydCBmaXJlcyB0aGUgQUJPUlRJTkcgZXZlbnRcbiAgICBhYm9ydCAgICAgICAgICA6IG9ib2VCdXMoQUJPUlRJTkcpLmVtaXQsXG5cbiAgICAvLyBpbml0aWFsbHkgcmV0dXJuIG5vdGhpbmcgZm9yIGhlYWRlciBhbmQgcm9vdFxuICAgIGhlYWRlciAgICAgICAgIDogbm9vcCxcbiAgICByb290ICAgICAgICAgICA6IG5vb3AsXG5cbiAgICBzb3VyY2UgICAgICAgICA6IGNvbnRlbnRTb3VyY2VcbiAgfTtcbn1cblxuLyoqXG4gKiBUaGlzIGZpbGUgc2l0cyBqdXN0IGJlaGluZCB0aGUgQVBJIHdoaWNoIGlzIHVzZWQgdG8gYXR0YWluIGEgbmV3XG4gKiBPYm9lIGluc3RhbmNlLiBJdCBjcmVhdGVzIHRoZSBuZXcgY29tcG9uZW50cyB0aGF0IGFyZSByZXF1aXJlZFxuICogYW5kIGludHJvZHVjZXMgdGhlbSB0byBlYWNoIG90aGVyLlxuICovXG5cbmZ1bmN0aW9uIHdpcmUgKGh0dHBNZXRob2ROYW1lLCBjb250ZW50U291cmNlLCBib2R5LCBoZWFkZXJzLCB3aXRoQ3JlZGVudGlhbHMpe1xuXG4gICB2YXIgb2JvZUJ1cyA9IHB1YlN1YigpO1xuICAgXG4gICAvLyBXaXJlIHRoZSBpbnB1dCBzdHJlYW0gaW4gaWYgd2UgYXJlIGdpdmVuIGEgY29udGVudCBzb3VyY2UuXG4gICAvLyBUaGlzIHdpbGwgdXN1YWxseSBiZSB0aGUgY2FzZS4gSWYgbm90LCB0aGUgaW5zdGFuY2UgY3JlYXRlZFxuICAgLy8gd2lsbCBoYXZlIHRvIGJlIHBhc3NlZCBjb250ZW50IGZyb20gYW4gZXh0ZXJuYWwgc291cmNlLlxuICBcbiAgIGlmKCBjb250ZW50U291cmNlICkge1xuXG4gICAgICBzdHJlYW1pbmdIdHRwKCBvYm9lQnVzLFxuICAgICAgICAgICAgICAgICAgICAgaHR0cFRyYW5zcG9ydCgpLCBcbiAgICAgICAgICAgICAgICAgICAgIGh0dHBNZXRob2ROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgY29udGVudFNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgIGJvZHksXG4gICAgICAgICAgICAgICAgICAgICBoZWFkZXJzLFxuICAgICAgICAgICAgICAgICAgICAgd2l0aENyZWRlbnRpYWxzXG4gICAgICApO1xuICAgfVxuXG4gICBjbGFyaW5ldChvYm9lQnVzKTtcblxuICAgYXNjZW50TWFuYWdlcihvYm9lQnVzLCBpbmNyZW1lbnRhbENvbnRlbnRCdWlsZGVyKG9ib2VCdXMpKTtcbiAgICAgIFxuICAgcGF0dGVybkFkYXB0ZXIob2JvZUJ1cywganNvblBhdGhDb21waWxlcik7ICAgICAgXG4gICAgICBcbiAgIHJldHVybiBpbnN0YW5jZUFwaShvYm9lQnVzLCBjb250ZW50U291cmNlKTtcbn1cblxuZnVuY3Rpb24gYXBwbHlEZWZhdWx0cyggcGFzc3Rocm91Z2gsIHVybCwgaHR0cE1ldGhvZE5hbWUsIGJvZHksIGhlYWRlcnMsIHdpdGhDcmVkZW50aWFscywgY2FjaGVkICl7XG5cbiAgIGhlYWRlcnMgPSBoZWFkZXJzID9cbiAgICAgIC8vIFNoYWxsb3ctY2xvbmUgdGhlIGhlYWRlcnMgYXJyYXkuIFRoaXMgYWxsb3dzIGl0IHRvIGJlXG4gICAgICAvLyBtb2RpZmllZCB3aXRob3V0IHNpZGUgZWZmZWN0cyB0byB0aGUgY2FsbGVyLiBXZSBkb24ndFxuICAgICAgLy8gd2FudCB0byBjaGFuZ2Ugb2JqZWN0cyB0aGF0IHRoZSB1c2VyIHBhc3NlcyBpbi5cbiAgICAgIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoaGVhZGVycykpXG4gICAgICA6IHt9O1xuXG4gICBpZiggYm9keSApIHtcbiAgICAgIGlmKCAhaXNTdHJpbmcoYm9keSkgKSB7XG5cbiAgICAgICAgIC8vIElmIHRoZSBib2R5IGlzIG5vdCBhIHN0cmluZywgc3RyaW5naWZ5IGl0LiBUaGlzIGFsbG93cyBvYmplY3RzIHRvXG4gICAgICAgICAvLyBiZSBnaXZlbiB3aGljaCB3aWxsIGJlIHNlbnQgYXMgSlNPTi5cbiAgICAgICAgIGJvZHkgPSBKU09OLnN0cmluZ2lmeShib2R5KTtcblxuICAgICAgICAgLy8gRGVmYXVsdCBDb250ZW50LVR5cGUgdG8gSlNPTiB1bmxlc3MgZ2l2ZW4gb3RoZXJ3aXNlLlxuICAgICAgICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSBoZWFkZXJzWydDb250ZW50LVR5cGUnXSB8fCAnYXBwbGljYXRpb24vanNvbic7XG4gICAgICB9XG4gICAgICBoZWFkZXJzWydDb250ZW50LUxlbmd0aCddID0gaGVhZGVyc1snQ29udGVudC1MZW5ndGgnXSB8fCBib2R5Lmxlbmd0aDtcbiAgIH0gZWxzZSB7XG4gICAgICBib2R5ID0gbnVsbDtcbiAgIH1cblxuICAgLy8gc3VwcG9ydCBjYWNoZSBidXN0aW5nIGxpa2UgalF1ZXJ5LmFqYXgoe2NhY2hlOmZhbHNlfSlcbiAgIGZ1bmN0aW9uIG1vZGlmaWVkVXJsKGJhc2VVcmwsIGNhY2hlZCkge1xuXG4gICAgICBpZiggY2FjaGVkID09PSBmYWxzZSApIHtcblxuICAgICAgICAgaWYoIGJhc2VVcmwuaW5kZXhPZignPycpID09IC0xICkge1xuICAgICAgICAgICAgYmFzZVVybCArPSAnPyc7XG4gICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmFzZVVybCArPSAnJic7XG4gICAgICAgICB9XG5cbiAgICAgICAgIGJhc2VVcmwgKz0gJ189JyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGJhc2VVcmw7XG4gICB9XG5cbiAgIHJldHVybiBwYXNzdGhyb3VnaCggaHR0cE1ldGhvZE5hbWUgfHwgJ0dFVCcsIG1vZGlmaWVkVXJsKHVybCwgY2FjaGVkKSwgYm9keSwgaGVhZGVycywgd2l0aENyZWRlbnRpYWxzIHx8IGZhbHNlICk7XG59XG5cbi8vIGV4cG9ydCBwdWJsaWMgQVBJXG5mdW5jdGlvbiBvYm9lKGFyZzEpIHtcblxuICAgLy8gV2UgdXNlIGR1Y2stdHlwaW5nIHRvIGRldGVjdCBpZiB0aGUgcGFyYW1ldGVyIGdpdmVuIGlzIGEgc3RyZWFtLCB3aXRoIHRoZVxuICAgLy8gYmVsb3cgbGlzdCBvZiBwYXJhbWV0ZXJzLlxuICAgLy8gVW5waXBlIGFuZCB1bnNoaWZ0IHdvdWxkIG5vcm1hbGx5IGJlIHByZXNlbnQgb24gYSBzdHJlYW0gYnV0IHRoaXMgYnJlYWtzXG4gICAvLyBjb21wYXRpYmlsaXR5IHdpdGggUmVxdWVzdCBzdHJlYW1zLlxuICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9qaW1oaWdzb24vb2JvZS5qcy9pc3N1ZXMvNjVcbiAgIFxuICAgdmFyIG5vZGVTdHJlYW1NZXRob2ROYW1lcyA9IGxpc3QoJ3Jlc3VtZScsICdwYXVzZScsICdwaXBlJyksXG4gICAgICAgaXNTdHJlYW0gPSBwYXJ0aWFsQ29tcGxldGUoXG4gICAgICAgICAgICAgICAgICAgICBoYXNBbGxQcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgICAsICBub2RlU3RyZWFtTWV0aG9kTmFtZXNcbiAgICAgICAgICAgICAgICAgICk7XG4gICBcbiAgIGlmKCBhcmcxICkge1xuICAgICAgaWYgKGlzU3RyZWFtKGFyZzEpIHx8IGlzU3RyaW5nKGFyZzEpKSB7XG5cbiAgICAgICAgIC8vICBzaW1wbGUgdmVyc2lvbiBmb3IgR0VUcy4gU2lnbmF0dXJlIGlzOlxuICAgICAgICAgLy8gICAgb2JvZSggdXJsIClcbiAgICAgICAgIC8vICBvciwgdW5kZXIgbm9kZTpcbiAgICAgICAgIC8vICAgIG9ib2UoIHJlYWRhYmxlU3RyZWFtIClcbiAgICAgICAgIHJldHVybiBhcHBseURlZmF1bHRzKFxuICAgICAgICAgICAgd2lyZSxcbiAgICAgICAgICAgIGFyZzEgLy8gdXJsXG4gICAgICAgICApO1xuXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAvLyBtZXRob2Qgc2lnbmF0dXJlIGlzOlxuICAgICAgICAgLy8gICAgb2JvZSh7bWV0aG9kOm0sIHVybDp1LCBib2R5OmIsIGhlYWRlcnM6ey4uLn19KVxuXG4gICAgICAgICByZXR1cm4gYXBwbHlEZWZhdWx0cyhcbiAgICAgICAgICAgIHdpcmUsXG4gICAgICAgICAgICBhcmcxLnVybCxcbiAgICAgICAgICAgIGFyZzEubWV0aG9kLFxuICAgICAgICAgICAgYXJnMS5ib2R5LFxuICAgICAgICAgICAgYXJnMS5oZWFkZXJzLFxuICAgICAgICAgICAgYXJnMS53aXRoQ3JlZGVudGlhbHMsXG4gICAgICAgICAgICBhcmcxLmNhY2hlZFxuICAgICAgICAgKTtcbiAgICAgICAgIFxuICAgICAgfVxuICAgfSBlbHNlIHtcbiAgICAgIC8vIHdpcmUgdXAgYSBuby1BSkFYLCBuby1zdHJlYW0gT2JvZS4gV2lsbCBoYXZlIHRvIGhhdmUgY29udGVudCBcbiAgICAgIC8vIGZlZCBpbiBleHRlcm5hbGx5IGFuZCB1c2luZyAuZW1pdC5cbiAgICAgIHJldHVybiB3aXJlKCk7XG4gICB9XG59XG5cbi8qIG9ib2UuZHJvcCBpcyBhIHNwZWNpYWwgdmFsdWUuIElmIGEgbm9kZSBjYWxsYmFjayByZXR1cm5zIHRoaXMgdmFsdWUgdGhlXG4gICBwYXJzZWQgbm9kZSBpcyBkZWxldGVkIGZyb20gdGhlIEpTT05cbiAqL1xub2JvZS5kcm9wID0gZnVuY3Rpb24oKSB7XG4gICByZXR1cm4gb2JvZS5kcm9wO1xufTtcblxuXG4gICBpZiAoIHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kICkge1xuICAgICAgZGVmaW5lKCBcIm9ib2VcIiwgW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG9ib2U7IH0gKTtcbiAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICBtb2R1bGUuZXhwb3J0cyA9IG9ib2U7XG4gICB9IGVsc2Uge1xuICAgICAgd2luZG93Lm9ib2UgPSBvYm9lO1xuICAgfVxufSkoKGZ1bmN0aW9uKCl7XG4gICAvLyBBY2Nlc3MgdG8gdGhlIHdpbmRvdyBvYmplY3QgdGhyb3dzIGFuIGV4Y2VwdGlvbiBpbiBIVE1MNSB3ZWIgd29ya2VycyBzb1xuICAgLy8gcG9pbnQgaXQgdG8gXCJzZWxmXCIgaWYgaXQgcnVucyBpbiBhIHdlYiB3b3JrZXJcbiAgICAgIHRyeSB7XG4gICAgICAgICByZXR1cm4gd2luZG93O1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgICB9XG4gICB9KCkpLCBPYmplY3QsIEFycmF5LCBFcnJvciwgSlNPTik7XG4iLCJpbXBvcnQgeyBDaGVzcyB9IGZyb20gJ2NoZXNzLmpzJztcbmltcG9ydCB7IFB1enpsZSB9IGZyb20gJy4vcHV6emxlJztcblxuZXhwb3J0IGNsYXNzIEFuYWx5c2lzIHtcblxuICBwcml2YXRlIHJlYWRvbmx5IGdhbWVBbmFseXNpc1xuXG4gIGNvbnN0cnVjdG9yKGdhbWVBbmFseXNpcykge1xuICAgIHRoaXMuZ2FtZUFuYWx5c2lzID0gZ2FtZUFuYWx5c2lzO1xuICB9XG5cbiAgcHV6emxlcyhwbGF5ZXI6IHN0cmluZyk6IFB1enpsZVtdIHtcbiAgICBjb25zdCBjaGVzcyA9IG5ldyBDaGVzcygpXG4gICAgdmFyIGZlbnMgOiBhbnlbXSA9IFtdXG4gICAgdGhpcy5nYW1lQW5hbHlzaXMubW92ZXMuc3BsaXQoJyAnKS5mb3JFYWNoKHggPT4ge1xuICAgICBmZW5zLnB1c2goY2hlc3MuZmVuKCkpXG4gICAgIGNoZXNzLm1vdmUoeClcbiAgICB9KVxuICAgIGxldCBtb3ZlcyA9IGNoZXNzLmhpc3Rvcnkoe3ZlcmJvc2U6IHRydWV9KVxuICAgIG1vdmVzLmZvckVhY2goKG1vdmUsaSkgPT4ge1xuICAgICAgaWYgKCh0aGlzLmdhbWVBbmFseXNpcy5hbmFseXNpc1tpXSkgJiYgKHRoaXMuZ2FtZUFuYWx5c2lzLmFuYWx5c2lzW2ldLmp1ZGdtZW50KSkge1xuICAgICAgIGNvbnN0IGJlc3QgPSB0aGlzLmdhbWVBbmFseXNpcy5hbmFseXNpc1tpXS5iZXN0O1xuICAgICAgIHRoaXMuZ2FtZUFuYWx5c2lzLmFuYWx5c2lzW2ldLm1vdmUgPSBtb3ZlXG4gICAgICAgdGhpcy5nYW1lQW5hbHlzaXMuYW5hbHlzaXNbaV0uaGFsZk1vdmUgPSBpKzFcbiAgICAgICB0aGlzLmdhbWVBbmFseXNpcy5hbmFseXNpc1tpXS5mZW4gPSBmZW5zW2ldXG4gICAgICAgdGhpcy5nYW1lQW5hbHlzaXMuYW5hbHlzaXNbaV0uYmVzdCA9IHtmcm9tOmJlc3Quc3Vic3RyaW5nKDAsIDIpLCB0bzpiZXN0LnN1YnN0cmluZygyLCA0KX1cbiAgICAgICB0aGlzLmdhbWVBbmFseXNpcy5hbmFseXNpc1tpXS5zcGVlZCA9IHRoaXMuZ2FtZUFuYWx5c2lzLnNwZWVkXG4gICAgICAgdGhpcy5nYW1lQW5hbHlzaXMuYW5hbHlzaXNbaV0uaWQgPSB0aGlzLmdhbWVBbmFseXNpcy5pZFxuICAgICAgfVxuICAgIH0pXG4gICAgdmFyIHdoaXRlVXNlciA9IHRoaXMuZ2FtZUFuYWx5c2lzLnBsYXllcnMud2hpdGUudXNlclxuICAgIHZhciBwbGF5ZXJDb2xvdXI6IHN0cmluZyA9ICh3aGl0ZVVzZXIgJiYgKHdoaXRlVXNlci5pZCA9PSBwbGF5ZXIpKSA/ICd3JzonYidcbiAgICByZXR1cm4gdGhpcy5nYW1lQW5hbHlzaXMuYW5hbHlzaXMgPSB0aGlzLmdhbWVBbmFseXNpcy5hbmFseXNpc1xuICAgICAgLmZpbHRlcigoeCxpKSAgPT4gaT4wICYmIHRoaXMuZ2FtZUFuYWx5c2lzLmFuYWx5c2lzW2ktMV0uZXZhbCA8IDMwMCAmJiB0aGlzLmdhbWVBbmFseXNpcy5hbmFseXNpc1tpLTFdLmV2YWwgPiAtMzAwKVxuICAgICAgLmZpbHRlcih4ID0+IHguanVkZ21lbnQgJiYgeC5qdWRnbWVudC5uYW1lID09IFwiQmx1bmRlclwiKVxuICAgICAgLmZpbHRlcih4ID0+IHgubW92ZS5jb2xvciA9PSBwbGF5ZXJDb2xvdXIpXG4gICAgICAubWFwKHggPT4gbmV3IFB1enpsZSh4LCB0aGlzLmdhbWVBbmFseXNpcykpXG4gIH1cbn1cbiIsImltcG9ydCB7IENoZXNzIH0gZnJvbSAnY2hlc3MuanMnO1xuaW1wb3J0IHsgUHV6emxlIH0gZnJvbSAnLi9wdXp6bGUnO1xuaW1wb3J0IHsgdG9Db2xvciB9IGZyb20gJy4vdXRpbCdcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbG91cih4OnN0cmluZykge1xuICByZXR1cm4gKHA6IFB1enpsZSkgPT4ge1xuICAgIGNvbnN0IGNoZXNzID0gbmV3IENoZXNzKHAuYW5hbHlzaXMuZmVuKVxuICAgIGlmICh4ID09PSAnJykgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gdG9Db2xvcihjaGVzcykgPT09IHhcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V2ZXJpdHkoeDpzdHJpbmcpIHtcbiAgcmV0dXJuIChwOiBQdXp6bGUpID0+IHtcbiAgICBpZiAoeCA9PT0gJycpIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIHAuYW5hbHlzaXMuanVkZ21lbnQubmFtZSA9PT0gJ0JsdW5kZXInXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBoYXNlKHg6c3RyaW5nKSB7XG4gIHJldHVybiAocDogUHV6emxlKSA9PiB7XG4gICAgaWYgKHggPT09ICcnKSByZXR1cm4gdHJ1ZVxuICAgIGlmICh4ID09ICdPcGVuaW5nJykge1xuICAgICAgcmV0dXJuIHAuYW5hbHlzaXMuaGFsZk1vdmUgPCAyMFxuICAgIH1cbiAgICBpZiAoeCA9PT0gJ0VuZGdhbWUnKSB7XG4gICAgICBjb25zdCBmZW4gPSBwLmFuYWx5c2lzLmZlblxuICAgICAgY29uc3QgcGllY2VzID0gZmVuLnJlcGxhY2UoLyAuKiQvLCcnKS5yZXBsYWNlKC9bMC05IHBQLV0vZywnJylcbiAgICAgIHJldHVybiBwaWVjZXMubGVuZ3RoIDw9IDcgKyA2XG4gICAgfVxuICAgIHJldHVybiAhcGhhc2UoJ09wZW5pbmcnKShwKSAmJiAhKHBoYXNlKCdFbmRnYW1lJykocCkpXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRpbWVjb250cm9sKHg6c3RyaW5nKSB7XG4gIHJldHVybiAocDogUHV6emxlKSA9PiB7XG4gICAgaWYgKHggPT09ICcnKSByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBwLmFuYWx5c2lzLnNwZWVkID09PSB4XG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIG9ib2UgZnJvbSAnb2JvZSc7XG5cbmV4cG9ydCBjbGFzcyBMaWNoZXNzQXBpIHtcblxuICBwcml2YXRlIHJlYWRvbmx5IHVybDogc3RyaW5nXG5cbiAgY29uc3RydWN0b3IodXJsKSB7XG4gICAgdGhpcy51cmwgPSB1cmxcbiAgfVxuXG4gIGdhbWVzKHVzZXIsIGl0ZW1zLCBpdGVtQ2FsbGJhY2ssIGNvbXBsZXRlQ2FsbGJhY2spIHtcblx0XHR2YXIgYWxsOiBhbnlbXSA9IFtdO1xuXHRcdGNvbnN0IGZpeGVkUXVlcnlQYXJhbXMgPSBcIiZwZXJmVHlwZT1yYXBpZCxjbGFzc2ljYWxcIiArXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgICAgIFwiJmFuYWx5c2VkPXRydWUmZXZhbHM9dHJ1ZSZtb3Zlcz10cnVlJnJhdGVkPXRydWVcIlxuXHRcdG9ib2Uoe1xuXHRcdFx0bWV0aG9kOiBcIkdFVFwiLFxuXHRcdFx0dXJsOiB0aGlzLnVybCArIFwiL2dhbWVzL2V4cG9ydC9cIiArIHVzZXIgKyBcIj9tYXg9XCIgKyBpdGVtcyArIGZpeGVkUXVlcnlQYXJhbXMsXG5cdFx0XHRoZWFkZXJzOiB7IEFjY2VwdDogXCJhcHBsaWNhdGlvbi94LW5kanNvblwiIH0sXG5cdFx0fSkubm9kZShcIiFcIiwgZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0YWxsLnB1c2goZGF0YSk7XG5cdFx0XHRpdGVtQ2FsbGJhY2soZGF0YSk7XG5cdFx0fSkub24oXCJlbmRcIiwgZnVuY3Rpb24oe30pIHtcblx0XHRcdGNvbXBsZXRlQ2FsbGJhY2soKTtcblx0XHR9KS5mYWlsKGZ1bmN0aW9uKGVycm9yUmVwb3J0KSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKEpTT04uc3RyaW5naWZ5KGVycm9yUmVwb3J0KSk7XG5cdFx0fSk7XG5cdH1cbn1cbiIsImV4cG9ydCB7IExpY2hlc3NBcGkgfSBmcm9tICcuL2xpY2hlc3NBcGknXG5leHBvcnQgeyBBbmFseXNpcyB9IGZyb20gJy4vYW5hbHlzaXMnXG5leHBvcnQgeyBjb2xvdXIsIHNldmVyaXR5LCBwaGFzZSwgdGltZWNvbnRyb2wgfSBmcm9tICcuL2ZpbHRlcnMnO1xuIiwiaW1wb3J0IHsgQ2hlc3MgfSBmcm9tIFwiY2hlc3MuanNcIlxuaW1wb3J0IHsgQ29sb3IgfSBmcm9tIFwiY2hlc3Nncm91bmQvdHlwZXNcIlxuaW1wb3J0IHsgdG9Db2xvciB9IGZyb20gXCIuL3V0aWxcIlxuXG5leHBvcnQgY2xhc3MgUHV6emxlIHtcbiAgcmVhZG9ubHkgYW5hbHlzaXNcbiAgcHJpdmF0ZSBnYW1lXG5cbiAgY29uc3RydWN0b3IoYW5hbHlzaXMsIGdhbWUpIHtcbiAgICB0aGlzLmFuYWx5c2lzID0gYW5hbHlzaXNcbiAgICB0aGlzLmdhbWUgPSBnYW1lXG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiB0aGlzLnVybCh0aGlzLmFuYWx5c2lzLCB0aGlzLmdhbWUpXG4gIH1cblxuICB1cmwoYW5hbHlzaXMsIGdhbWUpIHtcbiAgICBjb25zdCBjaGVzcyA9IG5ldyBDaGVzcyhhbmFseXNpcy5mZW4pXG4gICAgbGV0IGNvbG9yOiBDb2xvciA9IHRvQ29sb3IoY2hlc3MpXG4gICAgY29uc3QgdHVybk51bWJlciA9IHBhcnNlSW50KGFuYWx5c2lzLmZlbi5tYXRjaCgvXFxkKyQvKVswXSlcbiAgICBsZXQgdmFyaWF0aW9uID0gYW5hbHlzaXMudmFyaWF0aW9uLnNwbGl0KFwiIFwiKVxuICAgIHZhcmlhdGlvbi5mb3JFYWNoKGZ1bmN0aW9uIChtb3ZlKSB7XG4gICAgICBjaGVzcy5tb3ZlKG1vdmUpXG4gICAgfSlcbiAgICBjaGVzcy5oZWFkZXIoJ1doaXRlJywgZ2FtZS5wbGF5ZXJzLndoaXRlLnVzZXIubmFtZSlcbiAgICBjaGVzcy5oZWFkZXIoJ0JsYWNrJywgZ2FtZS5wbGF5ZXJzLmJsYWNrLnVzZXIubmFtZSlcbiAgICBjaGVzcy5oZWFkZXIoJ1doaXRlRWxvJywgZ2FtZS5wbGF5ZXJzLndoaXRlLnJhdGluZy50b1N0cmluZygpKVxuICAgIGNoZXNzLmhlYWRlcignQmxhY2tFbG8nLCBnYW1lLnBsYXllcnMuYmxhY2sucmF0aW5nLnRvU3RyaW5nKCkpXG4gICAgY2hlc3MuaGVhZGVyKCdFdmVudCcsIGBodHRwczovL2xpY2hlc3Mub3JnLyR7YW5hbHlzaXMuaWR9LyR7Y29sb3J9IyR7YW5hbHlzaXMuaGFsZk1vdmUgLSAxfWApXG4gICAgbGV0IGNyZWF0ZWREYXRlID0gbmV3IERhdGUoZ2FtZS5jcmVhdGVkQXQpXG4gICAgbGV0IGNyZWF0ZWREYXRlU3RyaW5nID0gYCR7Y3JlYXRlZERhdGUuZ2V0RnVsbFllYXIoKX0uJHtjcmVhdGVkRGF0ZS5nZXRNb250aCgpKzF9LiR7Y3JlYXRlZERhdGUuZ2V0RGF0ZSgpfWBcbiAgICBjaGVzcy5oZWFkZXIoJ0RhdGUnLCBjcmVhdGVkRGF0ZVN0cmluZylcblxuICAgIGxldCBwZ24gPSBjaGVzcy5wZ24oKVxuICAgIGNvbnN0IGZpcnN0TW92ZSAgPSB2YXJpYXRpb25bMF1cbiAgICBsZXQgdG9SZXBsYWNlID0gYCR7dHVybk51bWJlcn0uICR7Zmlyc3RNb3ZlfWBcbiAgICBsZXQgYmx1bmRlciA9IGAke3R1cm5OdW1iZXJ9LiAke2ZpcnN0TW92ZX0geyBibHVuZGVyOiAke2FuYWx5c2lzLmV2YWwgfHwgYW5hbHlzaXMubWF0ZSB9fSAoJHt0dXJuTnVtYmVyfS4gJHthbmFseXNpcy5tb3ZlLnNhbn0pICR7dHVybk51bWJlcn0uLi4gYFxuXG4gICAgaWYgKGNvbG9yID09ICdibGFjaycpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwicGduXCIscGduKVxuICAgICAgdG9SZXBsYWNlID0gYCR7dHVybk51bWJlcn0uIC4uLiAke2ZpcnN0TW92ZX1gXG4gICAgICBjb25zb2xlLmxvZyhcInRvUmVwbGFjZVwiLHRvUmVwbGFjZSlcbiAgICAgIGJsdW5kZXIgPSBgJHt0dXJuTnVtYmVyfS4gLi4uICR7Zmlyc3RNb3ZlfSB7IGJsdW5kZXI6ICR7YW5hbHlzaXMuZXZhbCB8fCBhbmFseXNpcy5tYXRlIH19ICgke3R1cm5OdW1iZXJ9LiAuLi4gJHthbmFseXNpcy5tb3ZlLnNhbn0pIGBcbiAgICAgIGNvbnNvbGUubG9nKFwiYmx1bmRlclwiLGJsdW5kZXIpXG4gICAgICBwZ24gPSBwZ24ucmVwbGFjZSh0b1JlcGxhY2UsIGJsdW5kZXIpICsgJyAxLTAnXG4gICAgICBjb25zb2xlLmxvZyhcInBnbjJcIixwZ24pXG4gICAgfSBlbHNlIHtcbiAgICAgIHBnbiA9IHBnbi5yZXBsYWNlKHRvUmVwbGFjZSwgYmx1bmRlcikgKyAnIDAtMSdcblxuICAgIH1cblxuXG4gICAgcmV0dXJuIHBnblxuICB9XG5cbn1cbiIsIlxuZXhwb3J0IGZ1bmN0aW9uIHRvRGVzdHMoY2hlc3M6IGFueSkge1xuICBjb25zdCBkZXN0cyA9IHt9O1xuICBjaGVzcy5TUVVBUkVTLmZvckVhY2gocyA9PiB7XG4gICAgY29uc3QgbXMgPSBjaGVzcy5tb3Zlcyh7c3F1YXJlOiBzLCB2ZXJib3NlOiB0cnVlfSk7XG4gICAgaWYgKG1zLmxlbmd0aCkgZGVzdHNbc10gPSBtcy5tYXAobSA9PiBtLnRvKTtcbiAgfSk7XG4gIHJldHVybiBkZXN0cztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQ29sb3IoY2hlc3M6IGFueSkge1xuICByZXR1cm4gKGNoZXNzLnR1cm4oKSA9PT0gJ3cnKSA/ICd3aGl0ZScgOiAnYmxhY2snO1xufVxuIl19
