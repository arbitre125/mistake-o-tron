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
        pgn = pgn.replace(toReplace, blunder) + ' *';
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY2hlc3MuanMvY2hlc3MuanMiLCJub2RlX21vZHVsZXMvb2JvZS9kaXN0L29ib2UtYnJvd3Nlci5qcyIsInNyYy9hbmFseXNpcy50cyIsInNyYy9maWx0ZXJzLnRzIiwic3JjL2xpY2hlc3NBcGkudHMiLCJzcmMvbWFpbi50cyIsInNyYy9wdXp6bGUudHMiLCJzcmMvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ptREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNscEZBLHFDQUFpQztBQUNqQyxtQ0FBa0M7QUFFbEM7SUFJRSxrQkFBWSxZQUFZO1FBQ3RCLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO0lBQ25DLENBQUM7SUFFRCwwQkFBTyxHQUFQLFVBQVEsTUFBYztRQUF0QixpQkEwQkM7UUF6QkMsSUFBTSxLQUFLLEdBQUcsSUFBSSxnQkFBSyxFQUFFLENBQUE7UUFDekIsSUFBSSxJQUFJLEdBQVcsRUFBRSxDQUFBO1FBQ3JCLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDO1lBQzNDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUE7WUFDdEIsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNkLENBQUMsQ0FBQyxDQUFBO1FBQ0YsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFBO1FBQzFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUMsQ0FBQztZQUNuQixJQUFJLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUNoRixJQUFNLElBQUksR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ2hELEtBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7Z0JBQ3pDLEtBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLEdBQUMsQ0FBQyxDQUFBO2dCQUM1QyxLQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUMzQyxLQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsRUFBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUE7Z0JBQ3pGLEtBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQTtnQkFDN0QsS0FBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEtBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFBO2FBQ3ZEO1FBQ0gsQ0FBQyxDQUFDLENBQUE7UUFDRixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFBO1FBQ3BELElBQUksWUFBWSxHQUFXLENBQUMsU0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUEsQ0FBQyxDQUFBLEdBQUcsQ0FBQTtRQUM1RSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUTthQUMzRCxNQUFNLENBQUMsVUFBQyxDQUFDLEVBQUMsQ0FBQyxJQUFNLE9BQUEsQ0FBQyxHQUFDLENBQUMsSUFBSSxLQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsSUFBSSxLQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFoRyxDQUFnRyxDQUFDO2FBQ2xILE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksU0FBUyxFQUExQyxDQUEwQyxDQUFDO2FBQ3ZELE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLFlBQVksRUFBNUIsQ0FBNEIsQ0FBQzthQUN6QyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxJQUFJLGVBQU0sQ0FBQyxDQUFDLEVBQUUsS0FBSSxDQUFDLFlBQVksQ0FBQyxFQUFoQyxDQUFnQyxDQUFDLENBQUE7SUFDL0MsQ0FBQztJQUNILGVBQUM7QUFBRCxDQW5DQSxBQW1DQyxJQUFBO0FBbkNZLDRCQUFROzs7OztBQ0hyQixxQ0FBaUM7QUFFakMsK0JBQWdDO0FBRWhDLGdCQUF1QixDQUFRO0lBQzdCLE9BQU8sVUFBQyxDQUFTO1FBQ2YsSUFBTSxLQUFLLEdBQUcsSUFBSSxnQkFBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDdkMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUFFLE9BQU8sSUFBSSxDQUFBO1FBQ3pCLE9BQU8sY0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUM3QixDQUFDLENBQUE7QUFDSCxDQUFDO0FBTkQsd0JBTUM7QUFFRCxrQkFBeUIsQ0FBUTtJQUMvQixPQUFPLFVBQUMsQ0FBUztRQUNmLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFBRSxPQUFPLElBQUksQ0FBQTtRQUN6QixPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUE7SUFDL0MsQ0FBQyxDQUFBO0FBQ0gsQ0FBQztBQUxELDRCQUtDO0FBRUQsZUFBc0IsQ0FBUTtJQUM1QixPQUFPLFVBQUMsQ0FBUztRQUNmLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFBRSxPQUFPLElBQUksQ0FBQTtRQUN6QixJQUFJLENBQUMsSUFBSSxTQUFTLEVBQUU7WUFDbEIsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUE7U0FDaEM7UUFDRCxJQUFJLENBQUMsS0FBSyxTQUFTLEVBQUU7WUFDbkIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUE7WUFDMUIsSUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBQyxFQUFFLENBQUMsQ0FBQTtZQUM5RCxPQUFPLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtTQUM5QjtRQUNELE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3ZELENBQUMsQ0FBQTtBQUNILENBQUM7QUFiRCxzQkFhQztBQUVELHFCQUE0QixDQUFRO0lBQ2xDLE9BQU8sVUFBQyxDQUFTO1FBQ2YsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUFFLE9BQU8sSUFBSSxDQUFBO1FBQ3pCLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFBO0lBQy9CLENBQUMsQ0FBQTtBQUNILENBQUM7QUFMRCxrQ0FLQzs7Ozs7QUN2Q0QsMkJBQTZCO0FBRTdCO0lBSUUsb0JBQVksR0FBRztRQUNiLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFBO0lBQ2hCLENBQUM7SUFFRCwwQkFBSyxHQUFMLFVBQU0sSUFBSSxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsZ0JBQWdCO1FBQ2pELElBQUksR0FBRyxHQUFVLEVBQUUsQ0FBQztRQUNwQixJQUFNLGdCQUFnQixHQUFHLDJCQUEyQjtZQUNyQyxpREFBaUQsQ0FBQTtRQUNoRSxJQUFJLENBQUM7WUFDSixNQUFNLEVBQUUsS0FBSztZQUNiLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLGdCQUFnQixHQUFHLElBQUksR0FBRyxPQUFPLEdBQUcsS0FBSyxHQUFHLGdCQUFnQjtZQUM1RSxPQUFPLEVBQUUsRUFBRSxNQUFNLEVBQUUsc0JBQXNCLEVBQUU7U0FDM0MsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBUyxJQUFJO1lBQ3pCLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDZixZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxVQUFTLEVBQUU7WUFDdkIsZ0JBQWdCLEVBQUUsQ0FBQztRQUNwQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBUyxXQUFXO1lBQzNCLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQzVDLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUNGLGlCQUFDO0FBQUQsQ0F6QkEsQUF5QkMsSUFBQTtBQXpCWSxnQ0FBVTs7Ozs7QUNGdkIsMkNBQXlDO0FBQWhDLGtDQUFBLFVBQVUsQ0FBQTtBQUNuQix1Q0FBcUM7QUFBNUIsOEJBQUEsUUFBUSxDQUFBO0FBQ2pCLHFDQUFpRTtBQUF4RCwyQkFBQSxNQUFNLENBQUE7QUFBRSw2QkFBQSxRQUFRLENBQUE7QUFBRSwwQkFBQSxLQUFLLENBQUE7QUFBRSxnQ0FBQSxXQUFXLENBQUE7Ozs7O0FDRjdDLHFDQUFnQztBQUVoQywrQkFBZ0M7QUFFaEM7SUFJRSxnQkFBWSxRQUFRLEVBQUUsSUFBSTtRQUN4QixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTtRQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtJQUNsQixDQUFDO0lBQ0QsdUJBQU0sR0FBTjtRQUNFLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUMzQyxDQUFDO0lBRUQsb0JBQUcsR0FBSCxVQUFJLFFBQVEsRUFBRSxJQUFJO1FBQ2hCLElBQU0sS0FBSyxHQUFHLElBQUksZ0JBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDckMsSUFBSSxLQUFLLEdBQVUsY0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ2pDLElBQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzFELElBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQzdDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJO1lBQzlCLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDbEIsQ0FBQyxDQUFDLENBQUE7UUFDRixLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDbkQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ25ELEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1FBQzlELEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1FBQzlELEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLHlCQUF1QixRQUFRLENBQUMsRUFBRSxTQUFJLEtBQUssVUFBSSxRQUFRLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBRSxDQUFDLENBQUE7UUFDN0YsSUFBSSxXQUFXLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQzFDLElBQUksaUJBQWlCLEdBQU0sV0FBVyxDQUFDLFdBQVcsRUFBRSxVQUFJLFdBQVcsQ0FBQyxRQUFRLEVBQUUsR0FBQyxDQUFDLFVBQUksV0FBVyxDQUFDLE9BQU8sRUFBSSxDQUFBO1FBQzNHLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLGlCQUFpQixDQUFDLENBQUE7UUFFdkMsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBQ3JCLElBQU0sU0FBUyxHQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUMvQixJQUFNLFNBQVMsR0FBTSxVQUFVLFVBQUssU0FBVyxDQUFBO1FBRS9DLElBQU0sT0FBTyxHQUFNLFVBQVUsVUFBSyxTQUFTLHFCQUFlLFFBQVEsQ0FBQyxJQUFJLElBQUksUUFBUSxDQUFDLElBQUksWUFBTyxVQUFVLFVBQUssUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLFVBQUssVUFBVSxTQUFNLENBQUE7UUFDcEosR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQTtRQUM1QyxPQUFPLEdBQUcsQ0FBQTtJQUNaLENBQUM7SUFFSCxhQUFDO0FBQUQsQ0F0Q0EsQUFzQ0MsSUFBQTtBQXRDWSx3QkFBTTs7Ozs7QUNIbkIsaUJBQXdCLEtBQVU7SUFDaEMsSUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ2pCLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQztRQUNyQixJQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUNuRCxJQUFJLEVBQUUsQ0FBQyxNQUFNO1lBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsRUFBRSxFQUFKLENBQUksQ0FBQyxDQUFDO0lBQzlDLENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBUEQsMEJBT0M7QUFFRCxpQkFBd0IsS0FBVTtJQUNoQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUNwRCxDQUFDO0FBRkQsMEJBRUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LCBKZWZmIEhseXdhIChqaGx5d2FAZ21haWwuY29tKVxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXRcbiAqIG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxuICpcbiAqIDEuIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSxcbiAqICAgIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG4gKiAyLiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsXG4gKiAgICB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uXG4gKiAgICBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cbiAqXG4gKiBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTIFwiQVMgSVNcIlxuICogQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRVxuICogSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0VcbiAqIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUIE9XTkVSIE9SIENPTlRSSUJVVE9SUyBCRVxuICogTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUlxuICogQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0ZcbiAqIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTU1xuICogSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT04gQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU5cbiAqIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpXG4gKiBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRVxuICogUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG4gKlxuICotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuLyogbWluaWZpZWQgbGljZW5zZSBiZWxvdyAgKi9cblxuLyogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAoYykgMjAxNiwgSmVmZiBIbHl3YSAoamhseXdhQGdtYWlsLmNvbSlcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBCU0QgbGljZW5zZVxuICogaHR0cHM6Ly9naXRodWIuY29tL2pobHl3YS9jaGVzcy5qcy9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKi9cblxudmFyIENoZXNzID0gZnVuY3Rpb24oZmVuKSB7XG5cbiAgLyoganNoaW50IGluZGVudDogZmFsc2UgKi9cblxuICB2YXIgQkxBQ0sgPSAnYic7XG4gIHZhciBXSElURSA9ICd3JztcblxuICB2YXIgRU1QVFkgPSAtMTtcblxuICB2YXIgUEFXTiA9ICdwJztcbiAgdmFyIEtOSUdIVCA9ICduJztcbiAgdmFyIEJJU0hPUCA9ICdiJztcbiAgdmFyIFJPT0sgPSAncic7XG4gIHZhciBRVUVFTiA9ICdxJztcbiAgdmFyIEtJTkcgPSAnayc7XG5cbiAgdmFyIFNZTUJPTFMgPSAncG5icnFrUE5CUlFLJztcblxuICB2YXIgREVGQVVMVF9QT1NJVElPTiA9ICdybmJxa2Juci9wcHBwcHBwcC84LzgvOC84L1BQUFBQUFBQL1JOQlFLQk5SIHcgS1FrcSAtIDAgMSc7XG5cbiAgdmFyIFBPU1NJQkxFX1JFU1VMVFMgPSBbJzEtMCcsICcwLTEnLCAnMS8yLTEvMicsICcqJ107XG5cbiAgdmFyIFBBV05fT0ZGU0VUUyA9IHtcbiAgICBiOiBbMTYsIDMyLCAxNywgMTVdLFxuICAgIHc6IFstMTYsIC0zMiwgLTE3LCAtMTVdXG4gIH07XG5cbiAgdmFyIFBJRUNFX09GRlNFVFMgPSB7XG4gICAgbjogWy0xOCwgLTMzLCAtMzEsIC0xNCwgIDE4LCAzMywgMzEsICAxNF0sXG4gICAgYjogWy0xNywgLTE1LCAgMTcsICAxNV0sXG4gICAgcjogWy0xNiwgICAxLCAgMTYsICAtMV0sXG4gICAgcTogWy0xNywgLTE2LCAtMTUsICAgMSwgIDE3LCAxNiwgMTUsICAtMV0sXG4gICAgazogWy0xNywgLTE2LCAtMTUsICAgMSwgIDE3LCAxNiwgMTUsICAtMV1cbiAgfTtcblxuICB2YXIgQVRUQUNLUyA9IFtcbiAgICAyMCwgMCwgMCwgMCwgMCwgMCwgMCwgMjQsICAwLCAwLCAwLCAwLCAwLCAwLDIwLCAwLFxuICAgICAwLDIwLCAwLCAwLCAwLCAwLCAwLCAyNCwgIDAsIDAsIDAsIDAsIDAsMjAsIDAsIDAsXG4gICAgIDAsIDAsMjAsIDAsIDAsIDAsIDAsIDI0LCAgMCwgMCwgMCwgMCwyMCwgMCwgMCwgMCxcbiAgICAgMCwgMCwgMCwyMCwgMCwgMCwgMCwgMjQsICAwLCAwLCAwLDIwLCAwLCAwLCAwLCAwLFxuICAgICAwLCAwLCAwLCAwLDIwLCAwLCAwLCAyNCwgIDAsIDAsMjAsIDAsIDAsIDAsIDAsIDAsXG4gICAgIDAsIDAsIDAsIDAsIDAsMjAsIDIsIDI0LCAgMiwyMCwgMCwgMCwgMCwgMCwgMCwgMCxcbiAgICAgMCwgMCwgMCwgMCwgMCwgMiw1MywgNTYsIDUzLCAyLCAwLCAwLCAwLCAwLCAwLCAwLFxuICAgIDI0LDI0LDI0LDI0LDI0LDI0LDU2LCAgMCwgNTYsMjQsMjQsMjQsMjQsMjQsMjQsIDAsXG4gICAgIDAsIDAsIDAsIDAsIDAsIDIsNTMsIDU2LCA1MywgMiwgMCwgMCwgMCwgMCwgMCwgMCxcbiAgICAgMCwgMCwgMCwgMCwgMCwyMCwgMiwgMjQsICAyLDIwLCAwLCAwLCAwLCAwLCAwLCAwLFxuICAgICAwLCAwLCAwLCAwLDIwLCAwLCAwLCAyNCwgIDAsIDAsMjAsIDAsIDAsIDAsIDAsIDAsXG4gICAgIDAsIDAsIDAsMjAsIDAsIDAsIDAsIDI0LCAgMCwgMCwgMCwyMCwgMCwgMCwgMCwgMCxcbiAgICAgMCwgMCwyMCwgMCwgMCwgMCwgMCwgMjQsICAwLCAwLCAwLCAwLDIwLCAwLCAwLCAwLFxuICAgICAwLDIwLCAwLCAwLCAwLCAwLCAwLCAyNCwgIDAsIDAsIDAsIDAsIDAsMjAsIDAsIDAsXG4gICAgMjAsIDAsIDAsIDAsIDAsIDAsIDAsIDI0LCAgMCwgMCwgMCwgMCwgMCwgMCwyMFxuICBdO1xuXG4gIHZhciBSQVlTID0gW1xuICAgICAxNywgIDAsICAwLCAgMCwgIDAsICAwLCAgMCwgMTYsICAwLCAgMCwgIDAsICAwLCAgMCwgIDAsIDE1LCAwLFxuICAgICAgMCwgMTcsICAwLCAgMCwgIDAsICAwLCAgMCwgMTYsICAwLCAgMCwgIDAsICAwLCAgMCwgMTUsICAwLCAwLFxuICAgICAgMCwgIDAsIDE3LCAgMCwgIDAsICAwLCAgMCwgMTYsICAwLCAgMCwgIDAsICAwLCAxNSwgIDAsICAwLCAwLFxuICAgICAgMCwgIDAsICAwLCAxNywgIDAsICAwLCAgMCwgMTYsICAwLCAgMCwgIDAsIDE1LCAgMCwgIDAsICAwLCAwLFxuICAgICAgMCwgIDAsICAwLCAgMCwgMTcsICAwLCAgMCwgMTYsICAwLCAgMCwgMTUsICAwLCAgMCwgIDAsICAwLCAwLFxuICAgICAgMCwgIDAsICAwLCAgMCwgIDAsIDE3LCAgMCwgMTYsICAwLCAxNSwgIDAsICAwLCAgMCwgIDAsICAwLCAwLFxuICAgICAgMCwgIDAsICAwLCAgMCwgIDAsICAwLCAxNywgMTYsIDE1LCAgMCwgIDAsICAwLCAgMCwgIDAsICAwLCAwLFxuICAgICAgMSwgIDEsICAxLCAgMSwgIDEsICAxLCAgMSwgIDAsIC0xLCAtMSwgIC0xLC0xLCAtMSwgLTEsIC0xLCAwLFxuICAgICAgMCwgIDAsICAwLCAgMCwgIDAsICAwLC0xNSwtMTYsLTE3LCAgMCwgIDAsICAwLCAgMCwgIDAsICAwLCAwLFxuICAgICAgMCwgIDAsICAwLCAgMCwgIDAsLTE1LCAgMCwtMTYsICAwLC0xNywgIDAsICAwLCAgMCwgIDAsICAwLCAwLFxuICAgICAgMCwgIDAsICAwLCAgMCwtMTUsICAwLCAgMCwtMTYsICAwLCAgMCwtMTcsICAwLCAgMCwgIDAsICAwLCAwLFxuICAgICAgMCwgIDAsICAwLC0xNSwgIDAsICAwLCAgMCwtMTYsICAwLCAgMCwgIDAsLTE3LCAgMCwgIDAsICAwLCAwLFxuICAgICAgMCwgIDAsLTE1LCAgMCwgIDAsICAwLCAgMCwtMTYsICAwLCAgMCwgIDAsICAwLC0xNywgIDAsICAwLCAwLFxuICAgICAgMCwtMTUsICAwLCAgMCwgIDAsICAwLCAgMCwtMTYsICAwLCAgMCwgIDAsICAwLCAgMCwtMTcsICAwLCAwLFxuICAgIC0xNSwgIDAsICAwLCAgMCwgIDAsICAwLCAgMCwtMTYsICAwLCAgMCwgIDAsICAwLCAgMCwgIDAsLTE3XG4gIF07XG5cbiAgdmFyIFNISUZUUyA9IHsgcDogMCwgbjogMSwgYjogMiwgcjogMywgcTogNCwgazogNSB9O1xuXG4gIHZhciBGTEFHUyA9IHtcbiAgICBOT1JNQUw6ICduJyxcbiAgICBDQVBUVVJFOiAnYycsXG4gICAgQklHX1BBV046ICdiJyxcbiAgICBFUF9DQVBUVVJFOiAnZScsXG4gICAgUFJPTU9USU9OOiAncCcsXG4gICAgS1NJREVfQ0FTVExFOiAnaycsXG4gICAgUVNJREVfQ0FTVExFOiAncSdcbiAgfTtcblxuICB2YXIgQklUUyA9IHtcbiAgICBOT1JNQUw6IDEsXG4gICAgQ0FQVFVSRTogMixcbiAgICBCSUdfUEFXTjogNCxcbiAgICBFUF9DQVBUVVJFOiA4LFxuICAgIFBST01PVElPTjogMTYsXG4gICAgS1NJREVfQ0FTVExFOiAzMixcbiAgICBRU0lERV9DQVNUTEU6IDY0XG4gIH07XG5cbiAgdmFyIFJBTktfMSA9IDc7XG4gIHZhciBSQU5LXzIgPSA2O1xuICB2YXIgUkFOS18zID0gNTtcbiAgdmFyIFJBTktfNCA9IDQ7XG4gIHZhciBSQU5LXzUgPSAzO1xuICB2YXIgUkFOS182ID0gMjtcbiAgdmFyIFJBTktfNyA9IDE7XG4gIHZhciBSQU5LXzggPSAwO1xuXG4gIHZhciBTUVVBUkVTID0ge1xuICAgIGE4OiAgIDAsIGI4OiAgIDEsIGM4OiAgIDIsIGQ4OiAgIDMsIGU4OiAgIDQsIGY4OiAgIDUsIGc4OiAgIDYsIGg4OiAgIDcsXG4gICAgYTc6ICAxNiwgYjc6ICAxNywgYzc6ICAxOCwgZDc6ICAxOSwgZTc6ICAyMCwgZjc6ICAyMSwgZzc6ICAyMiwgaDc6ICAyMyxcbiAgICBhNjogIDMyLCBiNjogIDMzLCBjNjogIDM0LCBkNjogIDM1LCBlNjogIDM2LCBmNjogIDM3LCBnNjogIDM4LCBoNjogIDM5LFxuICAgIGE1OiAgNDgsIGI1OiAgNDksIGM1OiAgNTAsIGQ1OiAgNTEsIGU1OiAgNTIsIGY1OiAgNTMsIGc1OiAgNTQsIGg1OiAgNTUsXG4gICAgYTQ6ICA2NCwgYjQ6ICA2NSwgYzQ6ICA2NiwgZDQ6ICA2NywgZTQ6ICA2OCwgZjQ6ICA2OSwgZzQ6ICA3MCwgaDQ6ICA3MSxcbiAgICBhMzogIDgwLCBiMzogIDgxLCBjMzogIDgyLCBkMzogIDgzLCBlMzogIDg0LCBmMzogIDg1LCBnMzogIDg2LCBoMzogIDg3LFxuICAgIGEyOiAgOTYsIGIyOiAgOTcsIGMyOiAgOTgsIGQyOiAgOTksIGUyOiAxMDAsIGYyOiAxMDEsIGcyOiAxMDIsIGgyOiAxMDMsXG4gICAgYTE6IDExMiwgYjE6IDExMywgYzE6IDExNCwgZDE6IDExNSwgZTE6IDExNiwgZjE6IDExNywgZzE6IDExOCwgaDE6IDExOVxuICB9O1xuXG4gIHZhciBST09LUyA9IHtcbiAgICB3OiBbe3NxdWFyZTogU1FVQVJFUy5hMSwgZmxhZzogQklUUy5RU0lERV9DQVNUTEV9LFxuICAgICAgICB7c3F1YXJlOiBTUVVBUkVTLmgxLCBmbGFnOiBCSVRTLktTSURFX0NBU1RMRX1dLFxuICAgIGI6IFt7c3F1YXJlOiBTUVVBUkVTLmE4LCBmbGFnOiBCSVRTLlFTSURFX0NBU1RMRX0sXG4gICAgICAgIHtzcXVhcmU6IFNRVUFSRVMuaDgsIGZsYWc6IEJJVFMuS1NJREVfQ0FTVExFfV1cbiAgfTtcblxuICB2YXIgYm9hcmQgPSBuZXcgQXJyYXkoMTI4KTtcbiAgdmFyIGtpbmdzID0ge3c6IEVNUFRZLCBiOiBFTVBUWX07XG4gIHZhciB0dXJuID0gV0hJVEU7XG4gIHZhciBjYXN0bGluZyA9IHt3OiAwLCBiOiAwfTtcbiAgdmFyIGVwX3NxdWFyZSA9IEVNUFRZO1xuICB2YXIgaGFsZl9tb3ZlcyA9IDA7XG4gIHZhciBtb3ZlX251bWJlciA9IDE7XG4gIHZhciBoaXN0b3J5ID0gW107XG4gIHZhciBoZWFkZXIgPSB7fTtcblxuICAvKiBpZiB0aGUgdXNlciBwYXNzZXMgaW4gYSBmZW4gc3RyaW5nLCBsb2FkIGl0LCBlbHNlIGRlZmF1bHQgdG9cbiAgICogc3RhcnRpbmcgcG9zaXRpb25cbiAgICovXG4gIGlmICh0eXBlb2YgZmVuID09PSAndW5kZWZpbmVkJykge1xuICAgIGxvYWQoREVGQVVMVF9QT1NJVElPTik7XG4gIH0gZWxzZSB7XG4gICAgbG9hZChmZW4pO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgYm9hcmQgPSBuZXcgQXJyYXkoMTI4KTtcbiAgICBraW5ncyA9IHt3OiBFTVBUWSwgYjogRU1QVFl9O1xuICAgIHR1cm4gPSBXSElURTtcbiAgICBjYXN0bGluZyA9IHt3OiAwLCBiOiAwfTtcbiAgICBlcF9zcXVhcmUgPSBFTVBUWTtcbiAgICBoYWxmX21vdmVzID0gMDtcbiAgICBtb3ZlX251bWJlciA9IDE7XG4gICAgaGlzdG9yeSA9IFtdO1xuICAgIGhlYWRlciA9IHt9O1xuICAgIHVwZGF0ZV9zZXR1cChnZW5lcmF0ZV9mZW4oKSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldCgpIHtcbiAgICBsb2FkKERFRkFVTFRfUE9TSVRJT04pO1xuICB9XG5cbiAgZnVuY3Rpb24gbG9hZChmZW4pIHtcbiAgICB2YXIgdG9rZW5zID0gZmVuLnNwbGl0KC9cXHMrLyk7XG4gICAgdmFyIHBvc2l0aW9uID0gdG9rZW5zWzBdO1xuICAgIHZhciBzcXVhcmUgPSAwO1xuXG4gICAgaWYgKCF2YWxpZGF0ZV9mZW4oZmVuKS52YWxpZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNsZWFyKCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBvc2l0aW9uLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcGllY2UgPSBwb3NpdGlvbi5jaGFyQXQoaSk7XG5cbiAgICAgIGlmIChwaWVjZSA9PT0gJy8nKSB7XG4gICAgICAgIHNxdWFyZSArPSA4O1xuICAgICAgfSBlbHNlIGlmIChpc19kaWdpdChwaWVjZSkpIHtcbiAgICAgICAgc3F1YXJlICs9IHBhcnNlSW50KHBpZWNlLCAxMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgY29sb3IgPSAocGllY2UgPCAnYScpID8gV0hJVEUgOiBCTEFDSztcbiAgICAgICAgcHV0KHt0eXBlOiBwaWVjZS50b0xvd2VyQ2FzZSgpLCBjb2xvcjogY29sb3J9LCBhbGdlYnJhaWMoc3F1YXJlKSk7XG4gICAgICAgIHNxdWFyZSsrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHR1cm4gPSB0b2tlbnNbMV07XG5cbiAgICBpZiAodG9rZW5zWzJdLmluZGV4T2YoJ0snKSA+IC0xKSB7XG4gICAgICBjYXN0bGluZy53IHw9IEJJVFMuS1NJREVfQ0FTVExFO1xuICAgIH1cbiAgICBpZiAodG9rZW5zWzJdLmluZGV4T2YoJ1EnKSA+IC0xKSB7XG4gICAgICBjYXN0bGluZy53IHw9IEJJVFMuUVNJREVfQ0FTVExFO1xuICAgIH1cbiAgICBpZiAodG9rZW5zWzJdLmluZGV4T2YoJ2snKSA+IC0xKSB7XG4gICAgICBjYXN0bGluZy5iIHw9IEJJVFMuS1NJREVfQ0FTVExFO1xuICAgIH1cbiAgICBpZiAodG9rZW5zWzJdLmluZGV4T2YoJ3EnKSA+IC0xKSB7XG4gICAgICBjYXN0bGluZy5iIHw9IEJJVFMuUVNJREVfQ0FTVExFO1xuICAgIH1cblxuICAgIGVwX3NxdWFyZSA9ICh0b2tlbnNbM10gPT09ICctJykgPyBFTVBUWSA6IFNRVUFSRVNbdG9rZW5zWzNdXTtcbiAgICBoYWxmX21vdmVzID0gcGFyc2VJbnQodG9rZW5zWzRdLCAxMCk7XG4gICAgbW92ZV9udW1iZXIgPSBwYXJzZUludCh0b2tlbnNbNV0sIDEwKTtcblxuICAgIHVwZGF0ZV9zZXR1cChnZW5lcmF0ZV9mZW4oKSk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qIFRPRE86IHRoaXMgZnVuY3Rpb24gaXMgcHJldHR5IG11Y2ggY3JhcCAtIGl0IHZhbGlkYXRlcyBzdHJ1Y3R1cmUgYnV0XG4gICAqIGNvbXBsZXRlbHkgaWdub3JlcyBjb250ZW50IChlLmcuIGRvZXNuJ3QgdmVyaWZ5IHRoYXQgZWFjaCBzaWRlIGhhcyBhIGtpbmcpXG4gICAqIC4uLiB3ZSBzaG91bGQgcmV3cml0ZSB0aGlzLCBhbmQgZGl0Y2ggdGhlIHNpbGx5IGVycm9yX251bWJlciBmaWVsZCB3aGlsZVxuICAgKiB3ZSdyZSBhdCBpdFxuICAgKi9cbiAgZnVuY3Rpb24gdmFsaWRhdGVfZmVuKGZlbikge1xuICAgIHZhciBlcnJvcnMgPSB7XG4gICAgICAgMDogJ05vIGVycm9ycy4nLFxuICAgICAgIDE6ICdGRU4gc3RyaW5nIG11c3QgY29udGFpbiBzaXggc3BhY2UtZGVsaW1pdGVkIGZpZWxkcy4nLFxuICAgICAgIDI6ICc2dGggZmllbGQgKG1vdmUgbnVtYmVyKSBtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlci4nLFxuICAgICAgIDM6ICc1dGggZmllbGQgKGhhbGYgbW92ZSBjb3VudGVyKSBtdXN0IGJlIGEgbm9uLW5lZ2F0aXZlIGludGVnZXIuJyxcbiAgICAgICA0OiAnNHRoIGZpZWxkIChlbi1wYXNzYW50IHNxdWFyZSkgaXMgaW52YWxpZC4nLFxuICAgICAgIDU6ICczcmQgZmllbGQgKGNhc3RsaW5nIGF2YWlsYWJpbGl0eSkgaXMgaW52YWxpZC4nLFxuICAgICAgIDY6ICcybmQgZmllbGQgKHNpZGUgdG8gbW92ZSkgaXMgaW52YWxpZC4nLFxuICAgICAgIDc6ICcxc3QgZmllbGQgKHBpZWNlIHBvc2l0aW9ucykgZG9lcyBub3QgY29udGFpbiA4IFxcJy9cXCctZGVsaW1pdGVkIHJvd3MuJyxcbiAgICAgICA4OiAnMXN0IGZpZWxkIChwaWVjZSBwb3NpdGlvbnMpIGlzIGludmFsaWQgW2NvbnNlY3V0aXZlIG51bWJlcnNdLicsXG4gICAgICAgOTogJzFzdCBmaWVsZCAocGllY2UgcG9zaXRpb25zKSBpcyBpbnZhbGlkIFtpbnZhbGlkIHBpZWNlXS4nLFxuICAgICAgMTA6ICcxc3QgZmllbGQgKHBpZWNlIHBvc2l0aW9ucykgaXMgaW52YWxpZCBbcm93IHRvbyBsYXJnZV0uJyxcbiAgICAgIDExOiAnSWxsZWdhbCBlbi1wYXNzYW50IHNxdWFyZScsXG4gICAgfTtcblxuICAgIC8qIDFzdCBjcml0ZXJpb246IDYgc3BhY2Utc2VwZXJhdGVkIGZpZWxkcz8gKi9cbiAgICB2YXIgdG9rZW5zID0gZmVuLnNwbGl0KC9cXHMrLyk7XG4gICAgaWYgKHRva2Vucy5sZW5ndGggIT09IDYpIHtcbiAgICAgIHJldHVybiB7dmFsaWQ6IGZhbHNlLCBlcnJvcl9udW1iZXI6IDEsIGVycm9yOiBlcnJvcnNbMV19O1xuICAgIH1cblxuICAgIC8qIDJuZCBjcml0ZXJpb246IG1vdmUgbnVtYmVyIGZpZWxkIGlzIGEgaW50ZWdlciB2YWx1ZSA+IDA/ICovXG4gICAgaWYgKGlzTmFOKHRva2Vuc1s1XSkgfHwgKHBhcnNlSW50KHRva2Vuc1s1XSwgMTApIDw9IDApKSB7XG4gICAgICByZXR1cm4ge3ZhbGlkOiBmYWxzZSwgZXJyb3JfbnVtYmVyOiAyLCBlcnJvcjogZXJyb3JzWzJdfTtcbiAgICB9XG5cbiAgICAvKiAzcmQgY3JpdGVyaW9uOiBoYWxmIG1vdmUgY291bnRlciBpcyBhbiBpbnRlZ2VyID49IDA/ICovXG4gICAgaWYgKGlzTmFOKHRva2Vuc1s0XSkgfHwgKHBhcnNlSW50KHRva2Vuc1s0XSwgMTApIDwgMCkpIHtcbiAgICAgIHJldHVybiB7dmFsaWQ6IGZhbHNlLCBlcnJvcl9udW1iZXI6IDMsIGVycm9yOiBlcnJvcnNbM119O1xuICAgIH1cblxuICAgIC8qIDR0aCBjcml0ZXJpb246IDR0aCBmaWVsZCBpcyBhIHZhbGlkIGUucC4tc3RyaW5nPyAqL1xuICAgIGlmICghL14oLXxbYWJjZGVmZ2hdWzM2XSkkLy50ZXN0KHRva2Vuc1szXSkpIHtcbiAgICAgIHJldHVybiB7dmFsaWQ6IGZhbHNlLCBlcnJvcl9udW1iZXI6IDQsIGVycm9yOiBlcnJvcnNbNF19O1xuICAgIH1cblxuICAgIC8qIDV0aCBjcml0ZXJpb246IDN0aCBmaWVsZCBpcyBhIHZhbGlkIGNhc3RsZS1zdHJpbmc/ICovXG4gICAgaWYoICEvXihLUT9rP3E/fFFrP3E/fGtxP3xxfC0pJC8udGVzdCh0b2tlbnNbMl0pKSB7XG4gICAgICByZXR1cm4ge3ZhbGlkOiBmYWxzZSwgZXJyb3JfbnVtYmVyOiA1LCBlcnJvcjogZXJyb3JzWzVdfTtcbiAgICB9XG5cbiAgICAvKiA2dGggY3JpdGVyaW9uOiAybmQgZmllbGQgaXMgXCJ3XCIgKHdoaXRlKSBvciBcImJcIiAoYmxhY2spPyAqL1xuICAgIGlmICghL14od3xiKSQvLnRlc3QodG9rZW5zWzFdKSkge1xuICAgICAgcmV0dXJuIHt2YWxpZDogZmFsc2UsIGVycm9yX251bWJlcjogNiwgZXJyb3I6IGVycm9yc1s2XX07XG4gICAgfVxuXG4gICAgLyogN3RoIGNyaXRlcmlvbjogMXN0IGZpZWxkIGNvbnRhaW5zIDggcm93cz8gKi9cbiAgICB2YXIgcm93cyA9IHRva2Vuc1swXS5zcGxpdCgnLycpO1xuICAgIGlmIChyb3dzLmxlbmd0aCAhPT0gOCkge1xuICAgICAgcmV0dXJuIHt2YWxpZDogZmFsc2UsIGVycm9yX251bWJlcjogNywgZXJyb3I6IGVycm9yc1s3XX07XG4gICAgfVxuXG4gICAgLyogOHRoIGNyaXRlcmlvbjogZXZlcnkgcm93IGlzIHZhbGlkPyAqL1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm93cy5sZW5ndGg7IGkrKykge1xuICAgICAgLyogY2hlY2sgZm9yIHJpZ2h0IHN1bSBvZiBmaWVsZHMgQU5EIG5vdCB0d28gbnVtYmVycyBpbiBzdWNjZXNzaW9uICovXG4gICAgICB2YXIgc3VtX2ZpZWxkcyA9IDA7XG4gICAgICB2YXIgcHJldmlvdXNfd2FzX251bWJlciA9IGZhbHNlO1xuXG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHJvd3NbaV0ubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgaWYgKCFpc05hTihyb3dzW2ldW2tdKSkge1xuICAgICAgICAgIGlmIChwcmV2aW91c193YXNfbnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4ge3ZhbGlkOiBmYWxzZSwgZXJyb3JfbnVtYmVyOiA4LCBlcnJvcjogZXJyb3JzWzhdfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3VtX2ZpZWxkcyArPSBwYXJzZUludChyb3dzW2ldW2tdLCAxMCk7XG4gICAgICAgICAgcHJldmlvdXNfd2FzX251bWJlciA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCEvXltwcm5icWtQUk5CUUtdJC8udGVzdChyb3dzW2ldW2tdKSkge1xuICAgICAgICAgICAgcmV0dXJuIHt2YWxpZDogZmFsc2UsIGVycm9yX251bWJlcjogOSwgZXJyb3I6IGVycm9yc1s5XX07XG4gICAgICAgICAgfVxuICAgICAgICAgIHN1bV9maWVsZHMgKz0gMTtcbiAgICAgICAgICBwcmV2aW91c193YXNfbnVtYmVyID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdW1fZmllbGRzICE9PSA4KSB7XG4gICAgICAgIHJldHVybiB7dmFsaWQ6IGZhbHNlLCBlcnJvcl9udW1iZXI6IDEwLCBlcnJvcjogZXJyb3JzWzEwXX07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCh0b2tlbnNbM11bMV0gPT0gJzMnICYmIHRva2Vuc1sxXSA9PSAndycpIHx8XG4gICAgICAgICh0b2tlbnNbM11bMV0gPT0gJzYnICYmIHRva2Vuc1sxXSA9PSAnYicpKSB7XG4gICAgICAgICAgcmV0dXJuIHt2YWxpZDogZmFsc2UsIGVycm9yX251bWJlcjogMTEsIGVycm9yOiBlcnJvcnNbMTFdfTtcbiAgICB9XG5cbiAgICAvKiBldmVyeXRoaW5nJ3Mgb2theSEgKi9cbiAgICByZXR1cm4ge3ZhbGlkOiB0cnVlLCBlcnJvcl9udW1iZXI6IDAsIGVycm9yOiBlcnJvcnNbMF19O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2VuZXJhdGVfZmVuKCkge1xuICAgIHZhciBlbXB0eSA9IDA7XG4gICAgdmFyIGZlbiA9ICcnO1xuXG4gICAgZm9yICh2YXIgaSA9IFNRVUFSRVMuYTg7IGkgPD0gU1FVQVJFUy5oMTsgaSsrKSB7XG4gICAgICBpZiAoYm9hcmRbaV0gPT0gbnVsbCkge1xuICAgICAgICBlbXB0eSsrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGVtcHR5ID4gMCkge1xuICAgICAgICAgIGZlbiArPSBlbXB0eTtcbiAgICAgICAgICBlbXB0eSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNvbG9yID0gYm9hcmRbaV0uY29sb3I7XG4gICAgICAgIHZhciBwaWVjZSA9IGJvYXJkW2ldLnR5cGU7XG5cbiAgICAgICAgZmVuICs9IChjb2xvciA9PT0gV0hJVEUpID9cbiAgICAgICAgICAgICAgICAgcGllY2UudG9VcHBlckNhc2UoKSA6IHBpZWNlLnRvTG93ZXJDYXNlKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICgoaSArIDEpICYgMHg4OCkge1xuICAgICAgICBpZiAoZW1wdHkgPiAwKSB7XG4gICAgICAgICAgZmVuICs9IGVtcHR5O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGkgIT09IFNRVUFSRVMuaDEpIHtcbiAgICAgICAgICBmZW4gKz0gJy8nO1xuICAgICAgICB9XG5cbiAgICAgICAgZW1wdHkgPSAwO1xuICAgICAgICBpICs9IDg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGNmbGFncyA9ICcnO1xuICAgIGlmIChjYXN0bGluZ1tXSElURV0gJiBCSVRTLktTSURFX0NBU1RMRSkgeyBjZmxhZ3MgKz0gJ0snOyB9XG4gICAgaWYgKGNhc3RsaW5nW1dISVRFXSAmIEJJVFMuUVNJREVfQ0FTVExFKSB7IGNmbGFncyArPSAnUSc7IH1cbiAgICBpZiAoY2FzdGxpbmdbQkxBQ0tdICYgQklUUy5LU0lERV9DQVNUTEUpIHsgY2ZsYWdzICs9ICdrJzsgfVxuICAgIGlmIChjYXN0bGluZ1tCTEFDS10gJiBCSVRTLlFTSURFX0NBU1RMRSkgeyBjZmxhZ3MgKz0gJ3EnOyB9XG5cbiAgICAvKiBkbyB3ZSBoYXZlIGFuIGVtcHR5IGNhc3RsaW5nIGZsYWc/ICovXG4gICAgY2ZsYWdzID0gY2ZsYWdzIHx8ICctJztcbiAgICB2YXIgZXBmbGFncyA9IChlcF9zcXVhcmUgPT09IEVNUFRZKSA/ICctJyA6IGFsZ2VicmFpYyhlcF9zcXVhcmUpO1xuXG4gICAgcmV0dXJuIFtmZW4sIHR1cm4sIGNmbGFncywgZXBmbGFncywgaGFsZl9tb3ZlcywgbW92ZV9udW1iZXJdLmpvaW4oJyAnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldF9oZWFkZXIoYXJncykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgaWYgKHR5cGVvZiBhcmdzW2ldID09PSAnc3RyaW5nJyAmJlxuICAgICAgICAgIHR5cGVvZiBhcmdzW2kgKyAxXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaGVhZGVyW2FyZ3NbaV1dID0gYXJnc1tpICsgMV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBoZWFkZXI7XG4gIH1cblxuICAvKiBjYWxsZWQgd2hlbiB0aGUgaW5pdGlhbCBib2FyZCBzZXR1cCBpcyBjaGFuZ2VkIHdpdGggcHV0KCkgb3IgcmVtb3ZlKCkuXG4gICAqIG1vZGlmaWVzIHRoZSBTZXRVcCBhbmQgRkVOIHByb3BlcnRpZXMgb2YgdGhlIGhlYWRlciBvYmplY3QuICBpZiB0aGUgRkVOIGlzXG4gICAqIGVxdWFsIHRvIHRoZSBkZWZhdWx0IHBvc2l0aW9uLCB0aGUgU2V0VXAgYW5kIEZFTiBhcmUgZGVsZXRlZFxuICAgKiB0aGUgc2V0dXAgaXMgb25seSB1cGRhdGVkIGlmIGhpc3RvcnkubGVuZ3RoIGlzIHplcm8sIGllIG1vdmVzIGhhdmVuJ3QgYmVlblxuICAgKiBtYWRlLlxuICAgKi9cbiAgZnVuY3Rpb24gdXBkYXRlX3NldHVwKGZlbikge1xuICAgIGlmIChoaXN0b3J5Lmxlbmd0aCA+IDApIHJldHVybjtcblxuICAgIGlmIChmZW4gIT09IERFRkFVTFRfUE9TSVRJT04pIHtcbiAgICAgIGhlYWRlclsnU2V0VXAnXSA9ICcxJztcbiAgICAgIGhlYWRlclsnRkVOJ10gPSBmZW47XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSBoZWFkZXJbJ1NldFVwJ107XG4gICAgICBkZWxldGUgaGVhZGVyWydGRU4nXTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXQoc3F1YXJlKSB7XG4gICAgdmFyIHBpZWNlID0gYm9hcmRbU1FVQVJFU1tzcXVhcmVdXTtcbiAgICByZXR1cm4gKHBpZWNlKSA/IHt0eXBlOiBwaWVjZS50eXBlLCBjb2xvcjogcGllY2UuY29sb3J9IDogbnVsbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHB1dChwaWVjZSwgc3F1YXJlKSB7XG4gICAgLyogY2hlY2sgZm9yIHZhbGlkIHBpZWNlIG9iamVjdCAqL1xuICAgIGlmICghKCd0eXBlJyBpbiBwaWVjZSAmJiAnY29sb3InIGluIHBpZWNlKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qIGNoZWNrIGZvciBwaWVjZSAqL1xuICAgIGlmIChTWU1CT0xTLmluZGV4T2YocGllY2UudHlwZS50b0xvd2VyQ2FzZSgpKSA9PT0gLTEpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKiBjaGVjayBmb3IgdmFsaWQgc3F1YXJlICovXG4gICAgaWYgKCEoc3F1YXJlIGluIFNRVUFSRVMpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIHNxID0gU1FVQVJFU1tzcXVhcmVdO1xuXG4gICAgLyogZG9uJ3QgbGV0IHRoZSB1c2VyIHBsYWNlIG1vcmUgdGhhbiBvbmUga2luZyAqL1xuICAgIGlmIChwaWVjZS50eXBlID09IEtJTkcgJiZcbiAgICAgICAgIShraW5nc1twaWVjZS5jb2xvcl0gPT0gRU1QVFkgfHwga2luZ3NbcGllY2UuY29sb3JdID09IHNxKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGJvYXJkW3NxXSA9IHt0eXBlOiBwaWVjZS50eXBlLCBjb2xvcjogcGllY2UuY29sb3J9O1xuICAgIGlmIChwaWVjZS50eXBlID09PSBLSU5HKSB7XG4gICAgICBraW5nc1twaWVjZS5jb2xvcl0gPSBzcTtcbiAgICB9XG5cbiAgICB1cGRhdGVfc2V0dXAoZ2VuZXJhdGVfZmVuKCkpO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiByZW1vdmUoc3F1YXJlKSB7XG4gICAgdmFyIHBpZWNlID0gZ2V0KHNxdWFyZSk7XG4gICAgYm9hcmRbU1FVQVJFU1tzcXVhcmVdXSA9IG51bGw7XG4gICAgaWYgKHBpZWNlICYmIHBpZWNlLnR5cGUgPT09IEtJTkcpIHtcbiAgICAgIGtpbmdzW3BpZWNlLmNvbG9yXSA9IEVNUFRZO1xuICAgIH1cblxuICAgIHVwZGF0ZV9zZXR1cChnZW5lcmF0ZV9mZW4oKSk7XG5cbiAgICByZXR1cm4gcGllY2U7XG4gIH1cblxuICBmdW5jdGlvbiBidWlsZF9tb3ZlKGJvYXJkLCBmcm9tLCB0bywgZmxhZ3MsIHByb21vdGlvbikge1xuICAgIHZhciBtb3ZlID0ge1xuICAgICAgY29sb3I6IHR1cm4sXG4gICAgICBmcm9tOiBmcm9tLFxuICAgICAgdG86IHRvLFxuICAgICAgZmxhZ3M6IGZsYWdzLFxuICAgICAgcGllY2U6IGJvYXJkW2Zyb21dLnR5cGVcbiAgICB9O1xuXG4gICAgaWYgKHByb21vdGlvbikge1xuICAgICAgbW92ZS5mbGFncyB8PSBCSVRTLlBST01PVElPTjtcbiAgICAgIG1vdmUucHJvbW90aW9uID0gcHJvbW90aW9uO1xuICAgIH1cblxuICAgIGlmIChib2FyZFt0b10pIHtcbiAgICAgIG1vdmUuY2FwdHVyZWQgPSBib2FyZFt0b10udHlwZTtcbiAgICB9IGVsc2UgaWYgKGZsYWdzICYgQklUUy5FUF9DQVBUVVJFKSB7XG4gICAgICAgIG1vdmUuY2FwdHVyZWQgPSBQQVdOO1xuICAgIH1cbiAgICByZXR1cm4gbW92ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlX21vdmVzKG9wdGlvbnMpIHtcbiAgICBmdW5jdGlvbiBhZGRfbW92ZShib2FyZCwgbW92ZXMsIGZyb20sIHRvLCBmbGFncykge1xuICAgICAgLyogaWYgcGF3biBwcm9tb3Rpb24gKi9cbiAgICAgIGlmIChib2FyZFtmcm9tXS50eXBlID09PSBQQVdOICYmXG4gICAgICAgICAocmFuayh0bykgPT09IFJBTktfOCB8fCByYW5rKHRvKSA9PT0gUkFOS18xKSkge1xuICAgICAgICAgIHZhciBwaWVjZXMgPSBbUVVFRU4sIFJPT0ssIEJJU0hPUCwgS05JR0hUXTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gcGllY2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBtb3Zlcy5wdXNoKGJ1aWxkX21vdmUoYm9hcmQsIGZyb20sIHRvLCBmbGFncywgcGllY2VzW2ldKSk7XG4gICAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICBtb3Zlcy5wdXNoKGJ1aWxkX21vdmUoYm9hcmQsIGZyb20sIHRvLCBmbGFncykpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBtb3ZlcyA9IFtdO1xuICAgIHZhciB1cyA9IHR1cm47XG4gICAgdmFyIHRoZW0gPSBzd2FwX2NvbG9yKHVzKTtcbiAgICB2YXIgc2Vjb25kX3JhbmsgPSB7YjogUkFOS183LCB3OiBSQU5LXzJ9O1xuXG4gICAgdmFyIGZpcnN0X3NxID0gU1FVQVJFUy5hODtcbiAgICB2YXIgbGFzdF9zcSA9IFNRVUFSRVMuaDE7XG4gICAgdmFyIHNpbmdsZV9zcXVhcmUgPSBmYWxzZTtcblxuICAgIC8qIGRvIHdlIHdhbnQgbGVnYWwgbW92ZXM/ICovXG4gICAgdmFyIGxlZ2FsID0gKHR5cGVvZiBvcHRpb25zICE9PSAndW5kZWZpbmVkJyAmJiAnbGVnYWwnIGluIG9wdGlvbnMpID9cbiAgICAgICAgICAgICAgICBvcHRpb25zLmxlZ2FsIDogdHJ1ZTtcblxuICAgIC8qIGFyZSB3ZSBnZW5lcmF0aW5nIG1vdmVzIGZvciBhIHNpbmdsZSBzcXVhcmU/ICovXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAndW5kZWZpbmVkJyAmJiAnc3F1YXJlJyBpbiBvcHRpb25zKSB7XG4gICAgICBpZiAob3B0aW9ucy5zcXVhcmUgaW4gU1FVQVJFUykge1xuICAgICAgICBmaXJzdF9zcSA9IGxhc3Rfc3EgPSBTUVVBUkVTW29wdGlvbnMuc3F1YXJlXTtcbiAgICAgICAgc2luZ2xlX3NxdWFyZSA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvKiBpbnZhbGlkIHNxdWFyZSAqL1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IGZpcnN0X3NxOyBpIDw9IGxhc3Rfc3E7IGkrKykge1xuICAgICAgLyogZGlkIHdlIHJ1biBvZmYgdGhlIGVuZCBvZiB0aGUgYm9hcmQgKi9cbiAgICAgIGlmIChpICYgMHg4OCkgeyBpICs9IDc7IGNvbnRpbnVlOyB9XG5cbiAgICAgIHZhciBwaWVjZSA9IGJvYXJkW2ldO1xuICAgICAgaWYgKHBpZWNlID09IG51bGwgfHwgcGllY2UuY29sb3IgIT09IHVzKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAocGllY2UudHlwZSA9PT0gUEFXTikge1xuICAgICAgICAvKiBzaW5nbGUgc3F1YXJlLCBub24tY2FwdHVyaW5nICovXG4gICAgICAgIHZhciBzcXVhcmUgPSBpICsgUEFXTl9PRkZTRVRTW3VzXVswXTtcbiAgICAgICAgaWYgKGJvYXJkW3NxdWFyZV0gPT0gbnVsbCkge1xuICAgICAgICAgICAgYWRkX21vdmUoYm9hcmQsIG1vdmVzLCBpLCBzcXVhcmUsIEJJVFMuTk9STUFMKTtcblxuICAgICAgICAgIC8qIGRvdWJsZSBzcXVhcmUgKi9cbiAgICAgICAgICB2YXIgc3F1YXJlID0gaSArIFBBV05fT0ZGU0VUU1t1c11bMV07XG4gICAgICAgICAgaWYgKHNlY29uZF9yYW5rW3VzXSA9PT0gcmFuayhpKSAmJiBib2FyZFtzcXVhcmVdID09IG51bGwpIHtcbiAgICAgICAgICAgIGFkZF9tb3ZlKGJvYXJkLCBtb3ZlcywgaSwgc3F1YXJlLCBCSVRTLkJJR19QQVdOKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKiBwYXduIGNhcHR1cmVzICovXG4gICAgICAgIGZvciAoaiA9IDI7IGogPCA0OyBqKyspIHtcbiAgICAgICAgICB2YXIgc3F1YXJlID0gaSArIFBBV05fT0ZGU0VUU1t1c11bal07XG4gICAgICAgICAgaWYgKHNxdWFyZSAmIDB4ODgpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgaWYgKGJvYXJkW3NxdWFyZV0gIT0gbnVsbCAmJlxuICAgICAgICAgICAgICBib2FyZFtzcXVhcmVdLmNvbG9yID09PSB0aGVtKSB7XG4gICAgICAgICAgICAgIGFkZF9tb3ZlKGJvYXJkLCBtb3ZlcywgaSwgc3F1YXJlLCBCSVRTLkNBUFRVUkUpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc3F1YXJlID09PSBlcF9zcXVhcmUpIHtcbiAgICAgICAgICAgICAgYWRkX21vdmUoYm9hcmQsIG1vdmVzLCBpLCBlcF9zcXVhcmUsIEJJVFMuRVBfQ0FQVFVSRSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBqID0gMCwgbGVuID0gUElFQ0VfT0ZGU0VUU1twaWVjZS50eXBlXS5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgIHZhciBvZmZzZXQgPSBQSUVDRV9PRkZTRVRTW3BpZWNlLnR5cGVdW2pdO1xuICAgICAgICAgIHZhciBzcXVhcmUgPSBpO1xuXG4gICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIHNxdWFyZSArPSBvZmZzZXQ7XG4gICAgICAgICAgICBpZiAoc3F1YXJlICYgMHg4OCkgYnJlYWs7XG5cbiAgICAgICAgICAgIGlmIChib2FyZFtzcXVhcmVdID09IG51bGwpIHtcbiAgICAgICAgICAgICAgYWRkX21vdmUoYm9hcmQsIG1vdmVzLCBpLCBzcXVhcmUsIEJJVFMuTk9STUFMKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChib2FyZFtzcXVhcmVdLmNvbG9yID09PSB1cykgYnJlYWs7XG4gICAgICAgICAgICAgIGFkZF9tb3ZlKGJvYXJkLCBtb3ZlcywgaSwgc3F1YXJlLCBCSVRTLkNBUFRVUkUpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogYnJlYWssIGlmIGtuaWdodCBvciBraW5nICovXG4gICAgICAgICAgICBpZiAocGllY2UudHlwZSA9PT0gJ24nIHx8IHBpZWNlLnR5cGUgPT09ICdrJykgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogY2hlY2sgZm9yIGNhc3RsaW5nIGlmOiBhKSB3ZSdyZSBnZW5lcmF0aW5nIGFsbCBtb3Zlcywgb3IgYikgd2UncmUgZG9pbmdcbiAgICAgKiBzaW5nbGUgc3F1YXJlIG1vdmUgZ2VuZXJhdGlvbiBvbiB0aGUga2luZydzIHNxdWFyZVxuICAgICAqL1xuICAgIGlmICgoIXNpbmdsZV9zcXVhcmUpIHx8IGxhc3Rfc3EgPT09IGtpbmdzW3VzXSkge1xuICAgICAgLyoga2luZy1zaWRlIGNhc3RsaW5nICovXG4gICAgICBpZiAoY2FzdGxpbmdbdXNdICYgQklUUy5LU0lERV9DQVNUTEUpIHtcbiAgICAgICAgdmFyIGNhc3RsaW5nX2Zyb20gPSBraW5nc1t1c107XG4gICAgICAgIHZhciBjYXN0bGluZ190byA9IGNhc3RsaW5nX2Zyb20gKyAyO1xuXG4gICAgICAgIGlmIChib2FyZFtjYXN0bGluZ19mcm9tICsgMV0gPT0gbnVsbCAmJlxuICAgICAgICAgICAgYm9hcmRbY2FzdGxpbmdfdG9dICAgICAgID09IG51bGwgJiZcbiAgICAgICAgICAgICFhdHRhY2tlZCh0aGVtLCBraW5nc1t1c10pICYmXG4gICAgICAgICAgICAhYXR0YWNrZWQodGhlbSwgY2FzdGxpbmdfZnJvbSArIDEpICYmXG4gICAgICAgICAgICAhYXR0YWNrZWQodGhlbSwgY2FzdGxpbmdfdG8pKSB7XG4gICAgICAgICAgYWRkX21vdmUoYm9hcmQsIG1vdmVzLCBraW5nc1t1c10gLCBjYXN0bGluZ190byxcbiAgICAgICAgICAgICAgICAgICBCSVRTLktTSURFX0NBU1RMRSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLyogcXVlZW4tc2lkZSBjYXN0bGluZyAqL1xuICAgICAgaWYgKGNhc3RsaW5nW3VzXSAmIEJJVFMuUVNJREVfQ0FTVExFKSB7XG4gICAgICAgIHZhciBjYXN0bGluZ19mcm9tID0ga2luZ3NbdXNdO1xuICAgICAgICB2YXIgY2FzdGxpbmdfdG8gPSBjYXN0bGluZ19mcm9tIC0gMjtcblxuICAgICAgICBpZiAoYm9hcmRbY2FzdGxpbmdfZnJvbSAtIDFdID09IG51bGwgJiZcbiAgICAgICAgICAgIGJvYXJkW2Nhc3RsaW5nX2Zyb20gLSAyXSA9PSBudWxsICYmXG4gICAgICAgICAgICBib2FyZFtjYXN0bGluZ19mcm9tIC0gM10gPT0gbnVsbCAmJlxuICAgICAgICAgICAgIWF0dGFja2VkKHRoZW0sIGtpbmdzW3VzXSkgJiZcbiAgICAgICAgICAgICFhdHRhY2tlZCh0aGVtLCBjYXN0bGluZ19mcm9tIC0gMSkgJiZcbiAgICAgICAgICAgICFhdHRhY2tlZCh0aGVtLCBjYXN0bGluZ190bykpIHtcbiAgICAgICAgICBhZGRfbW92ZShib2FyZCwgbW92ZXMsIGtpbmdzW3VzXSwgY2FzdGxpbmdfdG8sXG4gICAgICAgICAgICAgICAgICAgQklUUy5RU0lERV9DQVNUTEUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogcmV0dXJuIGFsbCBwc2V1ZG8tbGVnYWwgbW92ZXMgKHRoaXMgaW5jbHVkZXMgbW92ZXMgdGhhdCBhbGxvdyB0aGUga2luZ1xuICAgICAqIHRvIGJlIGNhcHR1cmVkKVxuICAgICAqL1xuICAgIGlmICghbGVnYWwpIHtcbiAgICAgIHJldHVybiBtb3ZlcztcbiAgICB9XG5cbiAgICAvKiBmaWx0ZXIgb3V0IGlsbGVnYWwgbW92ZXMgKi9cbiAgICB2YXIgbGVnYWxfbW92ZXMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbW92ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIG1ha2VfbW92ZShtb3Zlc1tpXSk7XG4gICAgICBpZiAoIWtpbmdfYXR0YWNrZWQodXMpKSB7XG4gICAgICAgIGxlZ2FsX21vdmVzLnB1c2gobW92ZXNbaV0pO1xuICAgICAgfVxuICAgICAgdW5kb19tb3ZlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxlZ2FsX21vdmVzO1xuICB9XG5cbiAgLyogY29udmVydCBhIG1vdmUgZnJvbSAweDg4IGNvb3JkaW5hdGVzIHRvIFN0YW5kYXJkIEFsZ2VicmFpYyBOb3RhdGlvblxuICAgKiAoU0FOKVxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHNsb3BweSBVc2UgdGhlIHNsb3BweSBTQU4gZ2VuZXJhdG9yIHRvIHdvcmsgYXJvdW5kIG92ZXJcbiAgICogZGlzYW1iaWd1YXRpb24gYnVncyBpbiBGcml0eiBhbmQgQ2hlc3NiYXNlLiAgU2VlIGJlbG93OlxuICAgKlxuICAgKiByMWJxa2Juci9wcHAycHBwLzJuNS8xQjFwUDMvNFAzLzgvUFBQUDJQUC9STkJRSzFOUiBiIEtRa3EgLSAyIDRcbiAgICogNC4gLi4uIE5nZTcgaXMgb3Zlcmx5IGRpc2FtYmlndWF0ZWQgYmVjYXVzZSB0aGUga25pZ2h0IG9uIGM2IGlzIHBpbm5lZFxuICAgKiA0LiAuLi4gTmU3IGlzIHRlY2huaWNhbGx5IHRoZSB2YWxpZCBTQU5cbiAgICovXG4gIGZ1bmN0aW9uIG1vdmVfdG9fc2FuKG1vdmUsIHNsb3BweSkge1xuXG4gICAgdmFyIG91dHB1dCA9ICcnO1xuXG4gICAgaWYgKG1vdmUuZmxhZ3MgJiBCSVRTLktTSURFX0NBU1RMRSkge1xuICAgICAgb3V0cHV0ID0gJ08tTyc7XG4gICAgfSBlbHNlIGlmIChtb3ZlLmZsYWdzICYgQklUUy5RU0lERV9DQVNUTEUpIHtcbiAgICAgIG91dHB1dCA9ICdPLU8tTyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBkaXNhbWJpZ3VhdG9yID0gZ2V0X2Rpc2FtYmlndWF0b3IobW92ZSwgc2xvcHB5KTtcblxuICAgICAgaWYgKG1vdmUucGllY2UgIT09IFBBV04pIHtcbiAgICAgICAgb3V0cHV0ICs9IG1vdmUucGllY2UudG9VcHBlckNhc2UoKSArIGRpc2FtYmlndWF0b3I7XG4gICAgICB9XG5cbiAgICAgIGlmIChtb3ZlLmZsYWdzICYgKEJJVFMuQ0FQVFVSRSB8IEJJVFMuRVBfQ0FQVFVSRSkpIHtcbiAgICAgICAgaWYgKG1vdmUucGllY2UgPT09IFBBV04pIHtcbiAgICAgICAgICBvdXRwdXQgKz0gYWxnZWJyYWljKG1vdmUuZnJvbSlbMF07XG4gICAgICAgIH1cbiAgICAgICAgb3V0cHV0ICs9ICd4JztcbiAgICAgIH1cblxuICAgICAgb3V0cHV0ICs9IGFsZ2VicmFpYyhtb3ZlLnRvKTtcblxuICAgICAgaWYgKG1vdmUuZmxhZ3MgJiBCSVRTLlBST01PVElPTikge1xuICAgICAgICBvdXRwdXQgKz0gJz0nICsgbW92ZS5wcm9tb3Rpb24udG9VcHBlckNhc2UoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBtYWtlX21vdmUobW92ZSk7XG4gICAgaWYgKGluX2NoZWNrKCkpIHtcbiAgICAgIGlmIChpbl9jaGVja21hdGUoKSkge1xuICAgICAgICBvdXRwdXQgKz0gJyMnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0cHV0ICs9ICcrJztcbiAgICAgIH1cbiAgICB9XG4gICAgdW5kb19tb3ZlKCk7XG5cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9XG5cbiAgLy8gcGFyc2VzIGFsbCBvZiB0aGUgZGVjb3JhdG9ycyBvdXQgb2YgYSBTQU4gc3RyaW5nXG4gIGZ1bmN0aW9uIHN0cmlwcGVkX3Nhbihtb3ZlKSB7XG4gICAgcmV0dXJuIG1vdmUucmVwbGFjZSgvPS8sJycpLnJlcGxhY2UoL1srI10/Wz8hXSokLywnJyk7XG4gIH1cblxuICBmdW5jdGlvbiBhdHRhY2tlZChjb2xvciwgc3F1YXJlKSB7XG4gICAgZm9yICh2YXIgaSA9IFNRVUFSRVMuYTg7IGkgPD0gU1FVQVJFUy5oMTsgaSsrKSB7XG4gICAgICAvKiBkaWQgd2UgcnVuIG9mZiB0aGUgZW5kIG9mIHRoZSBib2FyZCAqL1xuICAgICAgaWYgKGkgJiAweDg4KSB7IGkgKz0gNzsgY29udGludWU7IH1cblxuICAgICAgLyogaWYgZW1wdHkgc3F1YXJlIG9yIHdyb25nIGNvbG9yICovXG4gICAgICBpZiAoYm9hcmRbaV0gPT0gbnVsbCB8fCBib2FyZFtpXS5jb2xvciAhPT0gY29sb3IpIGNvbnRpbnVlO1xuXG4gICAgICB2YXIgcGllY2UgPSBib2FyZFtpXTtcbiAgICAgIHZhciBkaWZmZXJlbmNlID0gaSAtIHNxdWFyZTtcbiAgICAgIHZhciBpbmRleCA9IGRpZmZlcmVuY2UgKyAxMTk7XG5cbiAgICAgIGlmIChBVFRBQ0tTW2luZGV4XSAmICgxIDw8IFNISUZUU1twaWVjZS50eXBlXSkpIHtcbiAgICAgICAgaWYgKHBpZWNlLnR5cGUgPT09IFBBV04pIHtcbiAgICAgICAgICBpZiAoZGlmZmVyZW5jZSA+IDApIHtcbiAgICAgICAgICAgIGlmIChwaWVjZS5jb2xvciA9PT0gV0hJVEUpIHJldHVybiB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAocGllY2UuY29sb3IgPT09IEJMQUNLKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvKiBpZiB0aGUgcGllY2UgaXMgYSBrbmlnaHQgb3IgYSBraW5nICovXG4gICAgICAgIGlmIChwaWVjZS50eXBlID09PSAnbicgfHwgcGllY2UudHlwZSA9PT0gJ2snKSByZXR1cm4gdHJ1ZTtcblxuICAgICAgICB2YXIgb2Zmc2V0ID0gUkFZU1tpbmRleF07XG4gICAgICAgIHZhciBqID0gaSArIG9mZnNldDtcblxuICAgICAgICB2YXIgYmxvY2tlZCA9IGZhbHNlO1xuICAgICAgICB3aGlsZSAoaiAhPT0gc3F1YXJlKSB7XG4gICAgICAgICAgaWYgKGJvYXJkW2pdICE9IG51bGwpIHsgYmxvY2tlZCA9IHRydWU7IGJyZWFrOyB9XG4gICAgICAgICAgaiArPSBvZmZzZXQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWJsb2NrZWQpIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGtpbmdfYXR0YWNrZWQoY29sb3IpIHtcbiAgICByZXR1cm4gYXR0YWNrZWQoc3dhcF9jb2xvcihjb2xvciksIGtpbmdzW2NvbG9yXSk7XG4gIH1cblxuICBmdW5jdGlvbiBpbl9jaGVjaygpIHtcbiAgICByZXR1cm4ga2luZ19hdHRhY2tlZCh0dXJuKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluX2NoZWNrbWF0ZSgpIHtcbiAgICByZXR1cm4gaW5fY2hlY2soKSAmJiBnZW5lcmF0ZV9tb3ZlcygpLmxlbmd0aCA9PT0gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluX3N0YWxlbWF0ZSgpIHtcbiAgICByZXR1cm4gIWluX2NoZWNrKCkgJiYgZ2VuZXJhdGVfbW92ZXMoKS5sZW5ndGggPT09IDA7XG4gIH1cblxuICBmdW5jdGlvbiBpbnN1ZmZpY2llbnRfbWF0ZXJpYWwoKSB7XG4gICAgdmFyIHBpZWNlcyA9IHt9O1xuICAgIHZhciBiaXNob3BzID0gW107XG4gICAgdmFyIG51bV9waWVjZXMgPSAwO1xuICAgIHZhciBzcV9jb2xvciA9IDA7XG5cbiAgICBmb3IgKHZhciBpID0gU1FVQVJFUy5hODsgaTw9IFNRVUFSRVMuaDE7IGkrKykge1xuICAgICAgc3FfY29sb3IgPSAoc3FfY29sb3IgKyAxKSAlIDI7XG4gICAgICBpZiAoaSAmIDB4ODgpIHsgaSArPSA3OyBjb250aW51ZTsgfVxuXG4gICAgICB2YXIgcGllY2UgPSBib2FyZFtpXTtcbiAgICAgIGlmIChwaWVjZSkge1xuICAgICAgICBwaWVjZXNbcGllY2UudHlwZV0gPSAocGllY2UudHlwZSBpbiBwaWVjZXMpID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZWNlc1twaWVjZS50eXBlXSArIDEgOiAxO1xuICAgICAgICBpZiAocGllY2UudHlwZSA9PT0gQklTSE9QKSB7XG4gICAgICAgICAgYmlzaG9wcy5wdXNoKHNxX2NvbG9yKTtcbiAgICAgICAgfVxuICAgICAgICBudW1fcGllY2VzKys7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogayB2cy4gayAqL1xuICAgIGlmIChudW1fcGllY2VzID09PSAyKSB7IHJldHVybiB0cnVlOyB9XG5cbiAgICAvKiBrIHZzLiBrbiAuLi4uIG9yIC4uLi4gayB2cy4ga2IgKi9cbiAgICBlbHNlIGlmIChudW1fcGllY2VzID09PSAzICYmIChwaWVjZXNbQklTSE9QXSA9PT0gMSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGllY2VzW0tOSUdIVF0gPT09IDEpKSB7IHJldHVybiB0cnVlOyB9XG5cbiAgICAvKiBrYiB2cy4ga2Igd2hlcmUgYW55IG51bWJlciBvZiBiaXNob3BzIGFyZSBhbGwgb24gdGhlIHNhbWUgY29sb3IgKi9cbiAgICBlbHNlIGlmIChudW1fcGllY2VzID09PSBwaWVjZXNbQklTSE9QXSArIDIpIHtcbiAgICAgIHZhciBzdW0gPSAwO1xuICAgICAgdmFyIGxlbiA9IGJpc2hvcHMubGVuZ3RoO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBzdW0gKz0gYmlzaG9wc1tpXTtcbiAgICAgIH1cbiAgICAgIGlmIChzdW0gPT09IDAgfHwgc3VtID09PSBsZW4pIHsgcmV0dXJuIHRydWU7IH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBpbl90aHJlZWZvbGRfcmVwZXRpdGlvbigpIHtcbiAgICAvKiBUT0RPOiB3aGlsZSB0aGlzIGZ1bmN0aW9uIGlzIGZpbmUgZm9yIGNhc3VhbCB1c2UsIGEgYmV0dGVyXG4gICAgICogaW1wbGVtZW50YXRpb24gd291bGQgdXNlIGEgWm9icmlzdCBrZXkgKGluc3RlYWQgb2YgRkVOKS4gdGhlXG4gICAgICogWm9icmlzdCBrZXkgd291bGQgYmUgbWFpbnRhaW5lZCBpbiB0aGUgbWFrZV9tb3ZlL3VuZG9fbW92ZSBmdW5jdGlvbnMsXG4gICAgICogYXZvaWRpbmcgdGhlIGNvc3RseSB0aGF0IHdlIGRvIGJlbG93LlxuICAgICAqL1xuICAgIHZhciBtb3ZlcyA9IFtdO1xuICAgIHZhciBwb3NpdGlvbnMgPSB7fTtcbiAgICB2YXIgcmVwZXRpdGlvbiA9IGZhbHNlO1xuXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIHZhciBtb3ZlID0gdW5kb19tb3ZlKCk7XG4gICAgICBpZiAoIW1vdmUpIGJyZWFrO1xuICAgICAgbW92ZXMucHVzaChtb3ZlKTtcbiAgICB9XG5cbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgLyogcmVtb3ZlIHRoZSBsYXN0IHR3byBmaWVsZHMgaW4gdGhlIEZFTiBzdHJpbmcsIHRoZXkncmUgbm90IG5lZWRlZFxuICAgICAgICogd2hlbiBjaGVja2luZyBmb3IgZHJhdyBieSByZXAgKi9cbiAgICAgIHZhciBmZW4gPSBnZW5lcmF0ZV9mZW4oKS5zcGxpdCgnICcpLnNsaWNlKDAsNCkuam9pbignICcpO1xuXG4gICAgICAvKiBoYXMgdGhlIHBvc2l0aW9uIG9jY3VycmVkIHRocmVlIG9yIG1vdmUgdGltZXMgKi9cbiAgICAgIHBvc2l0aW9uc1tmZW5dID0gKGZlbiBpbiBwb3NpdGlvbnMpID8gcG9zaXRpb25zW2Zlbl0gKyAxIDogMTtcbiAgICAgIGlmIChwb3NpdGlvbnNbZmVuXSA+PSAzKSB7XG4gICAgICAgIHJlcGV0aXRpb24gPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIW1vdmVzLmxlbmd0aCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIG1ha2VfbW92ZShtb3Zlcy5wb3AoKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcGV0aXRpb247XG4gIH1cblxuICBmdW5jdGlvbiBwdXNoKG1vdmUpIHtcbiAgICBoaXN0b3J5LnB1c2goe1xuICAgICAgbW92ZTogbW92ZSxcbiAgICAgIGtpbmdzOiB7Yjoga2luZ3MuYiwgdzoga2luZ3Mud30sXG4gICAgICB0dXJuOiB0dXJuLFxuICAgICAgY2FzdGxpbmc6IHtiOiBjYXN0bGluZy5iLCB3OiBjYXN0bGluZy53fSxcbiAgICAgIGVwX3NxdWFyZTogZXBfc3F1YXJlLFxuICAgICAgaGFsZl9tb3ZlczogaGFsZl9tb3ZlcyxcbiAgICAgIG1vdmVfbnVtYmVyOiBtb3ZlX251bWJlclxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gbWFrZV9tb3ZlKG1vdmUpIHtcbiAgICB2YXIgdXMgPSB0dXJuO1xuICAgIHZhciB0aGVtID0gc3dhcF9jb2xvcih1cyk7XG4gICAgcHVzaChtb3ZlKTtcblxuICAgIGJvYXJkW21vdmUudG9dID0gYm9hcmRbbW92ZS5mcm9tXTtcbiAgICBib2FyZFttb3ZlLmZyb21dID0gbnVsbDtcblxuICAgIC8qIGlmIGVwIGNhcHR1cmUsIHJlbW92ZSB0aGUgY2FwdHVyZWQgcGF3biAqL1xuICAgIGlmIChtb3ZlLmZsYWdzICYgQklUUy5FUF9DQVBUVVJFKSB7XG4gICAgICBpZiAodHVybiA9PT0gQkxBQ0spIHtcbiAgICAgICAgYm9hcmRbbW92ZS50byAtIDE2XSA9IG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBib2FyZFttb3ZlLnRvICsgMTZdID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiBpZiBwYXduIHByb21vdGlvbiwgcmVwbGFjZSB3aXRoIG5ldyBwaWVjZSAqL1xuICAgIGlmIChtb3ZlLmZsYWdzICYgQklUUy5QUk9NT1RJT04pIHtcbiAgICAgIGJvYXJkW21vdmUudG9dID0ge3R5cGU6IG1vdmUucHJvbW90aW9uLCBjb2xvcjogdXN9O1xuICAgIH1cblxuICAgIC8qIGlmIHdlIG1vdmVkIHRoZSBraW5nICovXG4gICAgaWYgKGJvYXJkW21vdmUudG9dLnR5cGUgPT09IEtJTkcpIHtcbiAgICAgIGtpbmdzW2JvYXJkW21vdmUudG9dLmNvbG9yXSA9IG1vdmUudG87XG5cbiAgICAgIC8qIGlmIHdlIGNhc3RsZWQsIG1vdmUgdGhlIHJvb2sgbmV4dCB0byB0aGUga2luZyAqL1xuICAgICAgaWYgKG1vdmUuZmxhZ3MgJiBCSVRTLktTSURFX0NBU1RMRSkge1xuICAgICAgICB2YXIgY2FzdGxpbmdfdG8gPSBtb3ZlLnRvIC0gMTtcbiAgICAgICAgdmFyIGNhc3RsaW5nX2Zyb20gPSBtb3ZlLnRvICsgMTtcbiAgICAgICAgYm9hcmRbY2FzdGxpbmdfdG9dID0gYm9hcmRbY2FzdGxpbmdfZnJvbV07XG4gICAgICAgIGJvYXJkW2Nhc3RsaW5nX2Zyb21dID0gbnVsbDtcbiAgICAgIH0gZWxzZSBpZiAobW92ZS5mbGFncyAmIEJJVFMuUVNJREVfQ0FTVExFKSB7XG4gICAgICAgIHZhciBjYXN0bGluZ190byA9IG1vdmUudG8gKyAxO1xuICAgICAgICB2YXIgY2FzdGxpbmdfZnJvbSA9IG1vdmUudG8gLSAyO1xuICAgICAgICBib2FyZFtjYXN0bGluZ190b10gPSBib2FyZFtjYXN0bGluZ19mcm9tXTtcbiAgICAgICAgYm9hcmRbY2FzdGxpbmdfZnJvbV0gPSBudWxsO1xuICAgICAgfVxuXG4gICAgICAvKiB0dXJuIG9mZiBjYXN0bGluZyAqL1xuICAgICAgY2FzdGxpbmdbdXNdID0gJyc7XG4gICAgfVxuXG4gICAgLyogdHVybiBvZmYgY2FzdGxpbmcgaWYgd2UgbW92ZSBhIHJvb2sgKi9cbiAgICBpZiAoY2FzdGxpbmdbdXNdKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gUk9PS1NbdXNdLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChtb3ZlLmZyb20gPT09IFJPT0tTW3VzXVtpXS5zcXVhcmUgJiZcbiAgICAgICAgICAgIGNhc3RsaW5nW3VzXSAmIFJPT0tTW3VzXVtpXS5mbGFnKSB7XG4gICAgICAgICAgY2FzdGxpbmdbdXNdIF49IFJPT0tTW3VzXVtpXS5mbGFnO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogdHVybiBvZmYgY2FzdGxpbmcgaWYgd2UgY2FwdHVyZSBhIHJvb2sgKi9cbiAgICBpZiAoY2FzdGxpbmdbdGhlbV0pIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBST09LU1t0aGVtXS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAobW92ZS50byA9PT0gUk9PS1NbdGhlbV1baV0uc3F1YXJlICYmXG4gICAgICAgICAgICBjYXN0bGluZ1t0aGVtXSAmIFJPT0tTW3RoZW1dW2ldLmZsYWcpIHtcbiAgICAgICAgICBjYXN0bGluZ1t0aGVtXSBePSBST09LU1t0aGVtXVtpXS5mbGFnO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogaWYgYmlnIHBhd24gbW92ZSwgdXBkYXRlIHRoZSBlbiBwYXNzYW50IHNxdWFyZSAqL1xuICAgIGlmIChtb3ZlLmZsYWdzICYgQklUUy5CSUdfUEFXTikge1xuICAgICAgaWYgKHR1cm4gPT09ICdiJykge1xuICAgICAgICBlcF9zcXVhcmUgPSBtb3ZlLnRvIC0gMTY7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlcF9zcXVhcmUgPSBtb3ZlLnRvICsgMTY7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGVwX3NxdWFyZSA9IEVNUFRZO1xuICAgIH1cblxuICAgIC8qIHJlc2V0IHRoZSA1MCBtb3ZlIGNvdW50ZXIgaWYgYSBwYXduIGlzIG1vdmVkIG9yIGEgcGllY2UgaXMgY2FwdHVyZWQgKi9cbiAgICBpZiAobW92ZS5waWVjZSA9PT0gUEFXTikge1xuICAgICAgaGFsZl9tb3ZlcyA9IDA7XG4gICAgfSBlbHNlIGlmIChtb3ZlLmZsYWdzICYgKEJJVFMuQ0FQVFVSRSB8IEJJVFMuRVBfQ0FQVFVSRSkpIHtcbiAgICAgIGhhbGZfbW92ZXMgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBoYWxmX21vdmVzKys7XG4gICAgfVxuXG4gICAgaWYgKHR1cm4gPT09IEJMQUNLKSB7XG4gICAgICBtb3ZlX251bWJlcisrO1xuICAgIH1cbiAgICB0dXJuID0gc3dhcF9jb2xvcih0dXJuKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVuZG9fbW92ZSgpIHtcbiAgICB2YXIgb2xkID0gaGlzdG9yeS5wb3AoKTtcbiAgICBpZiAob2xkID09IG51bGwpIHsgcmV0dXJuIG51bGw7IH1cblxuICAgIHZhciBtb3ZlID0gb2xkLm1vdmU7XG4gICAga2luZ3MgPSBvbGQua2luZ3M7XG4gICAgdHVybiA9IG9sZC50dXJuO1xuICAgIGNhc3RsaW5nID0gb2xkLmNhc3RsaW5nO1xuICAgIGVwX3NxdWFyZSA9IG9sZC5lcF9zcXVhcmU7XG4gICAgaGFsZl9tb3ZlcyA9IG9sZC5oYWxmX21vdmVzO1xuICAgIG1vdmVfbnVtYmVyID0gb2xkLm1vdmVfbnVtYmVyO1xuXG4gICAgdmFyIHVzID0gdHVybjtcbiAgICB2YXIgdGhlbSA9IHN3YXBfY29sb3IodHVybik7XG5cbiAgICBib2FyZFttb3ZlLmZyb21dID0gYm9hcmRbbW92ZS50b107XG4gICAgYm9hcmRbbW92ZS5mcm9tXS50eXBlID0gbW92ZS5waWVjZTsgIC8vIHRvIHVuZG8gYW55IHByb21vdGlvbnNcbiAgICBib2FyZFttb3ZlLnRvXSA9IG51bGw7XG5cbiAgICBpZiAobW92ZS5mbGFncyAmIEJJVFMuQ0FQVFVSRSkge1xuICAgICAgYm9hcmRbbW92ZS50b10gPSB7dHlwZTogbW92ZS5jYXB0dXJlZCwgY29sb3I6IHRoZW19O1xuICAgIH0gZWxzZSBpZiAobW92ZS5mbGFncyAmIEJJVFMuRVBfQ0FQVFVSRSkge1xuICAgICAgdmFyIGluZGV4O1xuICAgICAgaWYgKHVzID09PSBCTEFDSykge1xuICAgICAgICBpbmRleCA9IG1vdmUudG8gLSAxNjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluZGV4ID0gbW92ZS50byArIDE2O1xuICAgICAgfVxuICAgICAgYm9hcmRbaW5kZXhdID0ge3R5cGU6IFBBV04sIGNvbG9yOiB0aGVtfTtcbiAgICB9XG5cblxuICAgIGlmIChtb3ZlLmZsYWdzICYgKEJJVFMuS1NJREVfQ0FTVExFIHwgQklUUy5RU0lERV9DQVNUTEUpKSB7XG4gICAgICB2YXIgY2FzdGxpbmdfdG8sIGNhc3RsaW5nX2Zyb207XG4gICAgICBpZiAobW92ZS5mbGFncyAmIEJJVFMuS1NJREVfQ0FTVExFKSB7XG4gICAgICAgIGNhc3RsaW5nX3RvID0gbW92ZS50byArIDE7XG4gICAgICAgIGNhc3RsaW5nX2Zyb20gPSBtb3ZlLnRvIC0gMTtcbiAgICAgIH0gZWxzZSBpZiAobW92ZS5mbGFncyAmIEJJVFMuUVNJREVfQ0FTVExFKSB7XG4gICAgICAgIGNhc3RsaW5nX3RvID0gbW92ZS50byAtIDI7XG4gICAgICAgIGNhc3RsaW5nX2Zyb20gPSBtb3ZlLnRvICsgMTtcbiAgICAgIH1cblxuICAgICAgYm9hcmRbY2FzdGxpbmdfdG9dID0gYm9hcmRbY2FzdGxpbmdfZnJvbV07XG4gICAgICBib2FyZFtjYXN0bGluZ19mcm9tXSA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vdmU7XG4gIH1cblxuICAvKiB0aGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gdW5pcXVlbHkgaWRlbnRpZnkgYW1iaWd1b3VzIG1vdmVzICovXG4gIGZ1bmN0aW9uIGdldF9kaXNhbWJpZ3VhdG9yKG1vdmUsIHNsb3BweSkge1xuICAgIHZhciBtb3ZlcyA9IGdlbmVyYXRlX21vdmVzKHtsZWdhbDogIXNsb3BweX0pO1xuXG4gICAgdmFyIGZyb20gPSBtb3ZlLmZyb207XG4gICAgdmFyIHRvID0gbW92ZS50bztcbiAgICB2YXIgcGllY2UgPSBtb3ZlLnBpZWNlO1xuXG4gICAgdmFyIGFtYmlndWl0aWVzID0gMDtcbiAgICB2YXIgc2FtZV9yYW5rID0gMDtcbiAgICB2YXIgc2FtZV9maWxlID0gMDtcblxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBtb3Zlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgdmFyIGFtYmlnX2Zyb20gPSBtb3Zlc1tpXS5mcm9tO1xuICAgICAgdmFyIGFtYmlnX3RvID0gbW92ZXNbaV0udG87XG4gICAgICB2YXIgYW1iaWdfcGllY2UgPSBtb3Zlc1tpXS5waWVjZTtcblxuICAgICAgLyogaWYgYSBtb3ZlIG9mIHRoZSBzYW1lIHBpZWNlIHR5cGUgZW5kcyBvbiB0aGUgc2FtZSB0byBzcXVhcmUsIHdlJ2xsXG4gICAgICAgKiBuZWVkIHRvIGFkZCBhIGRpc2FtYmlndWF0b3IgdG8gdGhlIGFsZ2VicmFpYyBub3RhdGlvblxuICAgICAgICovXG4gICAgICBpZiAocGllY2UgPT09IGFtYmlnX3BpZWNlICYmIGZyb20gIT09IGFtYmlnX2Zyb20gJiYgdG8gPT09IGFtYmlnX3RvKSB7XG4gICAgICAgIGFtYmlndWl0aWVzKys7XG5cbiAgICAgICAgaWYgKHJhbmsoZnJvbSkgPT09IHJhbmsoYW1iaWdfZnJvbSkpIHtcbiAgICAgICAgICBzYW1lX3JhbmsrKztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmaWxlKGZyb20pID09PSBmaWxlKGFtYmlnX2Zyb20pKSB7XG4gICAgICAgICAgc2FtZV9maWxlKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYW1iaWd1aXRpZXMgPiAwKSB7XG4gICAgICAvKiBpZiB0aGVyZSBleGlzdHMgYSBzaW1pbGFyIG1vdmluZyBwaWVjZSBvbiB0aGUgc2FtZSByYW5rIGFuZCBmaWxlIGFzXG4gICAgICAgKiB0aGUgbW92ZSBpbiBxdWVzdGlvbiwgdXNlIHRoZSBzcXVhcmUgYXMgdGhlIGRpc2FtYmlndWF0b3JcbiAgICAgICAqL1xuICAgICAgaWYgKHNhbWVfcmFuayA+IDAgJiYgc2FtZV9maWxlID4gMCkge1xuICAgICAgICByZXR1cm4gYWxnZWJyYWljKGZyb20pO1xuICAgICAgfVxuICAgICAgLyogaWYgdGhlIG1vdmluZyBwaWVjZSByZXN0cyBvbiB0aGUgc2FtZSBmaWxlLCB1c2UgdGhlIHJhbmsgc3ltYm9sIGFzIHRoZVxuICAgICAgICogZGlzYW1iaWd1YXRvclxuICAgICAgICovXG4gICAgICBlbHNlIGlmIChzYW1lX2ZpbGUgPiAwKSB7XG4gICAgICAgIHJldHVybiBhbGdlYnJhaWMoZnJvbSkuY2hhckF0KDEpO1xuICAgICAgfVxuICAgICAgLyogZWxzZSB1c2UgdGhlIGZpbGUgc3ltYm9sICovXG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGFsZ2VicmFpYyhmcm9tKS5jaGFyQXQoMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgZnVuY3Rpb24gYXNjaWkoKSB7XG4gICAgdmFyIHMgPSAnICAgKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcXG4nO1xuICAgIGZvciAodmFyIGkgPSBTUVVBUkVTLmE4OyBpIDw9IFNRVUFSRVMuaDE7IGkrKykge1xuICAgICAgLyogZGlzcGxheSB0aGUgcmFuayAqL1xuICAgICAgaWYgKGZpbGUoaSkgPT09IDApIHtcbiAgICAgICAgcyArPSAnICcgKyAnODc2NTQzMjEnW3JhbmsoaSldICsgJyB8JztcbiAgICAgIH1cblxuICAgICAgLyogZW1wdHkgcGllY2UgKi9cbiAgICAgIGlmIChib2FyZFtpXSA9PSBudWxsKSB7XG4gICAgICAgIHMgKz0gJyAuICc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcGllY2UgPSBib2FyZFtpXS50eXBlO1xuICAgICAgICB2YXIgY29sb3IgPSBib2FyZFtpXS5jb2xvcjtcbiAgICAgICAgdmFyIHN5bWJvbCA9IChjb2xvciA9PT0gV0hJVEUpID9cbiAgICAgICAgICAgICAgICAgICAgIHBpZWNlLnRvVXBwZXJDYXNlKCkgOiBwaWVjZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBzICs9ICcgJyArIHN5bWJvbCArICcgJztcbiAgICAgIH1cblxuICAgICAgaWYgKChpICsgMSkgJiAweDg4KSB7XG4gICAgICAgIHMgKz0gJ3xcXG4nO1xuICAgICAgICBpICs9IDg7XG4gICAgICB9XG4gICAgfVxuICAgIHMgKz0gJyAgICstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXFxuJztcbiAgICBzICs9ICcgICAgIGEgIGIgIGMgIGQgIGUgIGYgIGcgIGhcXG4nO1xuXG4gICAgcmV0dXJuIHM7XG4gIH1cblxuICAvLyBjb252ZXJ0IGEgbW92ZSBmcm9tIFN0YW5kYXJkIEFsZ2VicmFpYyBOb3RhdGlvbiAoU0FOKSB0byAweDg4IGNvb3JkaW5hdGVzXG4gIGZ1bmN0aW9uIG1vdmVfZnJvbV9zYW4obW92ZSwgc2xvcHB5KSB7XG4gICAgLy8gc3RyaXAgb2ZmIGFueSBtb3ZlIGRlY29yYXRpb25zOiBlLmcgTmYzKz8hXG4gICAgdmFyIGNsZWFuX21vdmUgPSBzdHJpcHBlZF9zYW4obW92ZSk7XG5cbiAgICAvLyBpZiB3ZSdyZSB1c2luZyB0aGUgc2xvcHB5IHBhcnNlciBydW4gYSByZWdleCB0byBncmFiIHBpZWNlLCB0bywgYW5kIGZyb21cbiAgICAvLyB0aGlzIHNob3VsZCBwYXJzZSBpbnZhbGlkIFNBTiBsaWtlOiBQZTItZTQsIFJjMWM0LCBRZjN4ZjdcbiAgICBpZiAoc2xvcHB5KSB7XG4gICAgICB2YXIgbWF0Y2hlcyA9IGNsZWFuX21vdmUubWF0Y2goLyhbcG5icnFrUE5CUlFLXSk/KFthLWhdWzEtOF0peD8tPyhbYS1oXVsxLThdKShbcXJiblFSQk5dKT8vKTtcbiAgICAgIGlmIChtYXRjaGVzKSB7XG4gICAgICAgIHZhciBwaWVjZSA9IG1hdGNoZXNbMV07XG4gICAgICAgIHZhciBmcm9tID0gbWF0Y2hlc1syXTtcbiAgICAgICAgdmFyIHRvID0gbWF0Y2hlc1szXTtcbiAgICAgICAgdmFyIHByb21vdGlvbiA9IG1hdGNoZXNbNF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIG1vdmVzID0gZ2VuZXJhdGVfbW92ZXMoKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbW92ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIC8vIHRyeSB0aGUgc3RyaWN0IHBhcnNlciBmaXJzdCwgdGhlbiB0aGUgc2xvcHB5IHBhcnNlciBpZiByZXF1ZXN0ZWRcbiAgICAgIC8vIGJ5IHRoZSB1c2VyXG4gICAgICBpZiAoKGNsZWFuX21vdmUgPT09IHN0cmlwcGVkX3Nhbihtb3ZlX3RvX3Nhbihtb3Zlc1tpXSkpKSB8fFxuICAgICAgICAgIChzbG9wcHkgJiYgY2xlYW5fbW92ZSA9PT0gc3RyaXBwZWRfc2FuKG1vdmVfdG9fc2FuKG1vdmVzW2ldLCB0cnVlKSkpKSB7XG4gICAgICAgIHJldHVybiBtb3Zlc1tpXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChtYXRjaGVzICYmXG4gICAgICAgICAgICAoIXBpZWNlIHx8IHBpZWNlLnRvTG93ZXJDYXNlKCkgPT0gbW92ZXNbaV0ucGllY2UpICYmXG4gICAgICAgICAgICBTUVVBUkVTW2Zyb21dID09IG1vdmVzW2ldLmZyb20gJiZcbiAgICAgICAgICAgIFNRVUFSRVNbdG9dID09IG1vdmVzW2ldLnRvICYmXG4gICAgICAgICAgICAoIXByb21vdGlvbiB8fCBwcm9tb3Rpb24udG9Mb3dlckNhc2UoKSA9PSBtb3Zlc1tpXS5wcm9tb3Rpb24pKSB7XG4gICAgICAgICAgcmV0dXJuIG1vdmVzW2ldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuXG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKiBVVElMSVRZIEZVTkNUSU9OU1xuICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgZnVuY3Rpb24gcmFuayhpKSB7XG4gICAgcmV0dXJuIGkgPj4gNDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZpbGUoaSkge1xuICAgIHJldHVybiBpICYgMTU7XG4gIH1cblxuICBmdW5jdGlvbiBhbGdlYnJhaWMoaSl7XG4gICAgdmFyIGYgPSBmaWxlKGkpLCByID0gcmFuayhpKTtcbiAgICByZXR1cm4gJ2FiY2RlZmdoJy5zdWJzdHJpbmcoZixmKzEpICsgJzg3NjU0MzIxJy5zdWJzdHJpbmcocixyKzEpO1xuICB9XG5cbiAgZnVuY3Rpb24gc3dhcF9jb2xvcihjKSB7XG4gICAgcmV0dXJuIGMgPT09IFdISVRFID8gQkxBQ0sgOiBXSElURTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzX2RpZ2l0KGMpIHtcbiAgICByZXR1cm4gJzAxMjM0NTY3ODknLmluZGV4T2YoYykgIT09IC0xO1xuICB9XG5cbiAgLyogcHJldHR5ID0gZXh0ZXJuYWwgbW92ZSBvYmplY3QgKi9cbiAgZnVuY3Rpb24gbWFrZV9wcmV0dHkodWdseV9tb3ZlKSB7XG4gICAgdmFyIG1vdmUgPSBjbG9uZSh1Z2x5X21vdmUpO1xuICAgIG1vdmUuc2FuID0gbW92ZV90b19zYW4obW92ZSwgZmFsc2UpO1xuICAgIG1vdmUudG8gPSBhbGdlYnJhaWMobW92ZS50byk7XG4gICAgbW92ZS5mcm9tID0gYWxnZWJyYWljKG1vdmUuZnJvbSk7XG5cbiAgICB2YXIgZmxhZ3MgPSAnJztcblxuICAgIGZvciAodmFyIGZsYWcgaW4gQklUUykge1xuICAgICAgaWYgKEJJVFNbZmxhZ10gJiBtb3ZlLmZsYWdzKSB7XG4gICAgICAgIGZsYWdzICs9IEZMQUdTW2ZsYWddO1xuICAgICAgfVxuICAgIH1cbiAgICBtb3ZlLmZsYWdzID0gZmxhZ3M7XG5cbiAgICByZXR1cm4gbW92ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb25lKG9iaikge1xuICAgIHZhciBkdXBlID0gKG9iaiBpbnN0YW5jZW9mIEFycmF5KSA/IFtdIDoge307XG5cbiAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBvYmopIHtcbiAgICAgIGlmICh0eXBlb2YgcHJvcGVydHkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGR1cGVbcHJvcGVydHldID0gY2xvbmUob2JqW3Byb3BlcnR5XSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkdXBlW3Byb3BlcnR5XSA9IG9ialtwcm9wZXJ0eV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGR1cGU7XG4gIH1cblxuICBmdW5jdGlvbiB0cmltKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpO1xuICB9XG5cbiAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqIERFQlVHR0lORyBVVElMSVRJRVNcbiAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gIGZ1bmN0aW9uIHBlcmZ0KGRlcHRoKSB7XG4gICAgdmFyIG1vdmVzID0gZ2VuZXJhdGVfbW92ZXMoe2xlZ2FsOiBmYWxzZX0pO1xuICAgIHZhciBub2RlcyA9IDA7XG4gICAgdmFyIGNvbG9yID0gdHVybjtcblxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBtb3Zlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbWFrZV9tb3ZlKG1vdmVzW2ldKTtcbiAgICAgIGlmICgha2luZ19hdHRhY2tlZChjb2xvcikpIHtcbiAgICAgICAgaWYgKGRlcHRoIC0gMSA+IDApIHtcbiAgICAgICAgICB2YXIgY2hpbGRfbm9kZXMgPSBwZXJmdChkZXB0aCAtIDEpO1xuICAgICAgICAgIG5vZGVzICs9IGNoaWxkX25vZGVzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5vZGVzKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHVuZG9fbW92ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBub2RlcztcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIFBVQkxJQyBDT05TVEFOVFMgKGlzIHRoZXJlIGEgYmV0dGVyIHdheSB0byBkbyB0aGlzPylcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgV0hJVEU6IFdISVRFLFxuICAgIEJMQUNLOiBCTEFDSyxcbiAgICBQQVdOOiBQQVdOLFxuICAgIEtOSUdIVDogS05JR0hULFxuICAgIEJJU0hPUDogQklTSE9QLFxuICAgIFJPT0s6IFJPT0ssXG4gICAgUVVFRU46IFFVRUVOLFxuICAgIEtJTkc6IEtJTkcsXG4gICAgU1FVQVJFUzogKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIC8qIGZyb20gdGhlIEVDTUEtMjYyIHNwZWMgKHNlY3Rpb24gMTIuNi40KTpcbiAgICAgICAgICAgICAgICAgKiBcIlRoZSBtZWNoYW5pY3Mgb2YgZW51bWVyYXRpbmcgdGhlIHByb3BlcnRpZXMgLi4uIGlzXG4gICAgICAgICAgICAgICAgICogaW1wbGVtZW50YXRpb24gZGVwZW5kZW50XCJcbiAgICAgICAgICAgICAgICAgKiBzbzogZm9yICh2YXIgc3EgaW4gU1FVQVJFUykgeyBrZXlzLnB1c2goc3EpOyB9IG1pZ2h0IG5vdCBiZVxuICAgICAgICAgICAgICAgICAqIG9yZGVyZWQgY29ycmVjdGx5XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdmFyIGtleXMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gU1FVQVJFUy5hODsgaSA8PSBTUVVBUkVTLmgxOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgIGlmIChpICYgMHg4OCkgeyBpICs9IDc7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICBrZXlzLnB1c2goYWxnZWJyYWljKGkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtleXM7XG4gICAgICAgICAgICAgIH0pKCksXG4gICAgRkxBR1M6IEZMQUdTLFxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIFBVQkxJQyBBUElcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgbG9hZDogZnVuY3Rpb24oZmVuKSB7XG4gICAgICByZXR1cm4gbG9hZChmZW4pO1xuICAgIH0sXG5cbiAgICByZXNldDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcmVzZXQoKTtcbiAgICB9LFxuXG4gICAgbW92ZXM6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIC8qIFRoZSBpbnRlcm5hbCByZXByZXNlbnRhdGlvbiBvZiBhIGNoZXNzIG1vdmUgaXMgaW4gMHg4OCBmb3JtYXQsIGFuZFxuICAgICAgICogbm90IG1lYW50IHRvIGJlIGh1bWFuLXJlYWRhYmxlLiAgVGhlIGNvZGUgYmVsb3cgY29udmVydHMgdGhlIDB4ODhcbiAgICAgICAqIHNxdWFyZSBjb29yZGluYXRlcyB0byBhbGdlYnJhaWMgY29vcmRpbmF0ZXMuICBJdCBhbHNvIHBydW5lcyBhblxuICAgICAgICogdW5uZWNlc3NhcnkgbW92ZSBrZXlzIHJlc3VsdGluZyBmcm9tIGEgdmVyYm9zZSBjYWxsLlxuICAgICAgICovXG5cbiAgICAgIHZhciB1Z2x5X21vdmVzID0gZ2VuZXJhdGVfbW92ZXMob3B0aW9ucyk7XG4gICAgICB2YXIgbW92ZXMgPSBbXTtcblxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHVnbHlfbW92ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblxuICAgICAgICAvKiBkb2VzIHRoZSB1c2VyIHdhbnQgYSBmdWxsIG1vdmUgb2JqZWN0IChtb3N0IGxpa2VseSBub3QpLCBvciBqdXN0XG4gICAgICAgICAqIFNBTlxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAndW5kZWZpbmVkJyAmJiAndmVyYm9zZScgaW4gb3B0aW9ucyAmJlxuICAgICAgICAgICAgb3B0aW9ucy52ZXJib3NlKSB7XG4gICAgICAgICAgbW92ZXMucHVzaChtYWtlX3ByZXR0eSh1Z2x5X21vdmVzW2ldKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbW92ZXMucHVzaChtb3ZlX3RvX3Nhbih1Z2x5X21vdmVzW2ldLCBmYWxzZSkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBtb3ZlcztcbiAgICB9LFxuXG4gICAgaW5fY2hlY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGluX2NoZWNrKCk7XG4gICAgfSxcblxuICAgIGluX2NoZWNrbWF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gaW5fY2hlY2ttYXRlKCk7XG4gICAgfSxcblxuICAgIGluX3N0YWxlbWF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gaW5fc3RhbGVtYXRlKCk7XG4gICAgfSxcblxuICAgIGluX2RyYXc6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGhhbGZfbW92ZXMgPj0gMTAwIHx8XG4gICAgICAgICAgICAgaW5fc3RhbGVtYXRlKCkgfHxcbiAgICAgICAgICAgICBpbnN1ZmZpY2llbnRfbWF0ZXJpYWwoKSB8fFxuICAgICAgICAgICAgIGluX3RocmVlZm9sZF9yZXBldGl0aW9uKCk7XG4gICAgfSxcblxuICAgIGluc3VmZmljaWVudF9tYXRlcmlhbDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gaW5zdWZmaWNpZW50X21hdGVyaWFsKCk7XG4gICAgfSxcblxuICAgIGluX3RocmVlZm9sZF9yZXBldGl0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBpbl90aHJlZWZvbGRfcmVwZXRpdGlvbigpO1xuICAgIH0sXG5cbiAgICBnYW1lX292ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGhhbGZfbW92ZXMgPj0gMTAwIHx8XG4gICAgICAgICAgICAgaW5fY2hlY2ttYXRlKCkgfHxcbiAgICAgICAgICAgICBpbl9zdGFsZW1hdGUoKSB8fFxuICAgICAgICAgICAgIGluc3VmZmljaWVudF9tYXRlcmlhbCgpIHx8XG4gICAgICAgICAgICAgaW5fdGhyZWVmb2xkX3JlcGV0aXRpb24oKTtcbiAgICB9LFxuXG4gICAgdmFsaWRhdGVfZmVuOiBmdW5jdGlvbihmZW4pIHtcbiAgICAgIHJldHVybiB2YWxpZGF0ZV9mZW4oZmVuKTtcbiAgICB9LFxuXG4gICAgZmVuOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBnZW5lcmF0ZV9mZW4oKTtcbiAgICB9LFxuXG4gICAgcGduOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAvKiB1c2luZyB0aGUgc3BlY2lmaWNhdGlvbiBmcm9tIGh0dHA6Ly93d3cuY2hlc3NjbHViLmNvbS9oZWxwL1BHTi1zcGVjXG4gICAgICAgKiBleGFtcGxlIGZvciBodG1sIHVzYWdlOiAucGduKHsgbWF4X3dpZHRoOiA3MiwgbmV3bGluZV9jaGFyOiBcIjxiciAvPlwiIH0pXG4gICAgICAgKi9cbiAgICAgIHZhciBuZXdsaW5lID0gKHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIG9wdGlvbnMubmV3bGluZV9jaGFyID09PSAnc3RyaW5nJykgP1xuICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5uZXdsaW5lX2NoYXIgOiAnXFxuJztcbiAgICAgIHZhciBtYXhfd2lkdGggPSAodHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBvcHRpb25zLm1heF93aWR0aCA9PT0gJ251bWJlcicpID9cbiAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5tYXhfd2lkdGggOiAwO1xuICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgdmFyIGhlYWRlcl9leGlzdHMgPSBmYWxzZTtcblxuICAgICAgLyogYWRkIHRoZSBQR04gaGVhZGVyIGhlYWRlcnJtYXRpb24gKi9cbiAgICAgIGZvciAodmFyIGkgaW4gaGVhZGVyKSB7XG4gICAgICAgIC8qIFRPRE86IG9yZGVyIG9mIGVudW1lcmF0ZWQgcHJvcGVydGllcyBpbiBoZWFkZXIgb2JqZWN0IGlzIG5vdFxuICAgICAgICAgKiBndWFyYW50ZWVkLCBzZWUgRUNNQS0yNjIgc3BlYyAoc2VjdGlvbiAxMi42LjQpXG4gICAgICAgICAqL1xuICAgICAgICByZXN1bHQucHVzaCgnWycgKyBpICsgJyBcXFwiJyArIGhlYWRlcltpXSArICdcXFwiXScgKyBuZXdsaW5lKTtcbiAgICAgICAgaGVhZGVyX2V4aXN0cyA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChoZWFkZXJfZXhpc3RzICYmIGhpc3RvcnkubGVuZ3RoKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKG5ld2xpbmUpO1xuICAgICAgfVxuXG4gICAgICAvKiBwb3AgYWxsIG9mIGhpc3Rvcnkgb250byByZXZlcnNlZF9oaXN0b3J5ICovXG4gICAgICB2YXIgcmV2ZXJzZWRfaGlzdG9yeSA9IFtdO1xuICAgICAgd2hpbGUgKGhpc3RvcnkubGVuZ3RoID4gMCkge1xuICAgICAgICByZXZlcnNlZF9oaXN0b3J5LnB1c2godW5kb19tb3ZlKCkpO1xuICAgICAgfVxuXG4gICAgICB2YXIgbW92ZXMgPSBbXTtcbiAgICAgIHZhciBtb3ZlX3N0cmluZyA9ICcnO1xuXG4gICAgICAvKiBidWlsZCB0aGUgbGlzdCBvZiBtb3Zlcy4gIGEgbW92ZV9zdHJpbmcgbG9va3MgbGlrZTogXCIzLiBlMyBlNlwiICovXG4gICAgICB3aGlsZSAocmV2ZXJzZWRfaGlzdG9yeS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBtb3ZlID0gcmV2ZXJzZWRfaGlzdG9yeS5wb3AoKTtcblxuICAgICAgICAvKiBpZiB0aGUgcG9zaXRpb24gc3RhcnRlZCB3aXRoIGJsYWNrIHRvIG1vdmUsIHN0YXJ0IFBHTiB3aXRoIDEuIC4uLiAqL1xuICAgICAgICBpZiAoIWhpc3RvcnkubGVuZ3RoICYmIG1vdmUuY29sb3IgPT09ICdiJykge1xuICAgICAgICAgIG1vdmVfc3RyaW5nID0gbW92ZV9udW1iZXIgKyAnLiAuLi4nO1xuICAgICAgICB9IGVsc2UgaWYgKG1vdmUuY29sb3IgPT09ICd3Jykge1xuICAgICAgICAgIC8qIHN0b3JlIHRoZSBwcmV2aW91cyBnZW5lcmF0ZWQgbW92ZV9zdHJpbmcgaWYgd2UgaGF2ZSBvbmUgKi9cbiAgICAgICAgICBpZiAobW92ZV9zdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICBtb3Zlcy5wdXNoKG1vdmVfc3RyaW5nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbW92ZV9zdHJpbmcgPSBtb3ZlX251bWJlciArICcuJztcbiAgICAgICAgfVxuXG4gICAgICAgIG1vdmVfc3RyaW5nID0gbW92ZV9zdHJpbmcgKyAnICcgKyBtb3ZlX3RvX3Nhbihtb3ZlLCBmYWxzZSk7XG4gICAgICAgIG1ha2VfbW92ZShtb3ZlKTtcbiAgICAgIH1cblxuICAgICAgLyogYXJlIHRoZXJlIGFueSBvdGhlciBsZWZ0b3ZlciBtb3Zlcz8gKi9cbiAgICAgIGlmIChtb3ZlX3N0cmluZy5sZW5ndGgpIHtcbiAgICAgICAgbW92ZXMucHVzaChtb3ZlX3N0cmluZyk7XG4gICAgICB9XG5cbiAgICAgIC8qIGlzIHRoZXJlIGEgcmVzdWx0PyAqL1xuICAgICAgaWYgKHR5cGVvZiBoZWFkZXIuUmVzdWx0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBtb3Zlcy5wdXNoKGhlYWRlci5SZXN1bHQpO1xuICAgICAgfVxuXG4gICAgICAvKiBoaXN0b3J5IHNob3VsZCBiZSBiYWNrIHRvIHdoYXQgaXMgd2FzIGJlZm9yZSB3ZSBzdGFydGVkIGdlbmVyYXRpbmcgUEdOLFxuICAgICAgICogc28gam9pbiB0b2dldGhlciBtb3Zlc1xuICAgICAgICovXG4gICAgICBpZiAobWF4X3dpZHRoID09PSAwKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQuam9pbignJykgKyBtb3Zlcy5qb2luKCcgJyk7XG4gICAgICB9XG5cbiAgICAgIC8qIHdyYXAgdGhlIFBHTiBvdXRwdXQgYXQgbWF4X3dpZHRoICovXG4gICAgICB2YXIgY3VycmVudF93aWR0aCA9IDA7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1vdmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8qIGlmIHRoZSBjdXJyZW50IG1vdmUgd2lsbCBwdXNoIHBhc3QgbWF4X3dpZHRoICovXG4gICAgICAgIGlmIChjdXJyZW50X3dpZHRoICsgbW92ZXNbaV0ubGVuZ3RoID4gbWF4X3dpZHRoICYmIGkgIT09IDApIHtcblxuICAgICAgICAgIC8qIGRvbid0IGVuZCB0aGUgbGluZSB3aXRoIHdoaXRlc3BhY2UgKi9cbiAgICAgICAgICBpZiAocmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXSA9PT0gJyAnKSB7XG4gICAgICAgICAgICByZXN1bHQucG9wKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzdWx0LnB1c2gobmV3bGluZSk7XG4gICAgICAgICAgY3VycmVudF93aWR0aCA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAoaSAhPT0gMCkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKCcgJyk7XG4gICAgICAgICAgY3VycmVudF93aWR0aCsrO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdC5wdXNoKG1vdmVzW2ldKTtcbiAgICAgICAgY3VycmVudF93aWR0aCArPSBtb3Zlc1tpXS5sZW5ndGg7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQuam9pbignJyk7XG4gICAgfSxcblxuICAgIGxvYWRfcGduOiBmdW5jdGlvbihwZ24sIG9wdGlvbnMpIHtcbiAgICAgIC8vIGFsbG93IHRoZSB1c2VyIHRvIHNwZWNpZnkgdGhlIHNsb3BweSBtb3ZlIHBhcnNlciB0byB3b3JrIGFyb3VuZCBvdmVyXG4gICAgICAvLyBkaXNhbWJpZ3VhdGlvbiBidWdzIGluIEZyaXR6IGFuZCBDaGVzc2Jhc2VcbiAgICAgIHZhciBzbG9wcHkgPSAodHlwZW9mIG9wdGlvbnMgIT09ICd1bmRlZmluZWQnICYmICdzbG9wcHknIGluIG9wdGlvbnMpID9cbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5zbG9wcHkgOiBmYWxzZTtcblxuICAgICAgZnVuY3Rpb24gbWFzayhzdHIpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXFxcL2csICdcXFxcJyk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGhhc19rZXlzKG9iamVjdCkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBwYXJzZV9wZ25faGVhZGVyKGhlYWRlciwgb3B0aW9ucykge1xuICAgICAgICB2YXIgbmV3bGluZV9jaGFyID0gKHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBvcHRpb25zLm5ld2xpbmVfY2hhciA9PT0gJ3N0cmluZycpID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm5ld2xpbmVfY2hhciA6ICdcXHI/XFxuJztcbiAgICAgICAgdmFyIGhlYWRlcl9vYmogPSB7fTtcbiAgICAgICAgdmFyIGhlYWRlcnMgPSBoZWFkZXIuc3BsaXQobmV3IFJlZ0V4cChtYXNrKG5ld2xpbmVfY2hhcikpKTtcbiAgICAgICAgdmFyIGtleSA9ICcnO1xuICAgICAgICB2YXIgdmFsdWUgPSAnJztcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhlYWRlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBrZXkgPSBoZWFkZXJzW2ldLnJlcGxhY2UoL15cXFsoW0EtWl1bQS1aYS16XSopXFxzLipcXF0kLywgJyQxJyk7XG4gICAgICAgICAgdmFsdWUgPSBoZWFkZXJzW2ldLnJlcGxhY2UoL15cXFtbQS1aYS16XStcXHNcIiguKilcIlxcXSQvLCAnJDEnKTtcbiAgICAgICAgICBpZiAodHJpbShrZXkpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGhlYWRlcl9vYmpba2V5XSA9IHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBoZWFkZXJfb2JqO1xuICAgICAgfVxuXG4gICAgICB2YXIgbmV3bGluZV9jaGFyID0gKHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2Ygb3B0aW9ucy5uZXdsaW5lX2NoYXIgPT09ICdzdHJpbmcnKSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMubmV3bGluZV9jaGFyIDogJ1xccj9cXG4nO1xuICAgICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cCgnXihcXFxcWygufCcgKyBtYXNrKG5ld2xpbmVfY2hhcikgKyAnKSpcXFxcXSknICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJygnICsgbWFzayhuZXdsaW5lX2NoYXIpICsgJykqJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICcxLignICsgbWFzayhuZXdsaW5lX2NoYXIpICsgJ3wuKSokJywgJ2cnKTtcblxuICAgICAgLyogZ2V0IGhlYWRlciBwYXJ0IG9mIHRoZSBQR04gZmlsZSAqL1xuICAgICAgdmFyIGhlYWRlcl9zdHJpbmcgPSBwZ24ucmVwbGFjZShyZWdleCwgJyQxJyk7XG5cbiAgICAgIC8qIG5vIGluZm8gcGFydCBnaXZlbiwgYmVnaW5zIHdpdGggbW92ZXMgKi9cbiAgICAgIGlmIChoZWFkZXJfc3RyaW5nWzBdICE9PSAnWycpIHtcbiAgICAgICAgaGVhZGVyX3N0cmluZyA9ICcnO1xuICAgICAgfVxuXG4gICAgICByZXNldCgpO1xuXG4gICAgICAvKiBwYXJzZSBQR04gaGVhZGVyICovXG4gICAgICB2YXIgaGVhZGVycyA9IHBhcnNlX3Bnbl9oZWFkZXIoaGVhZGVyX3N0cmluZywgb3B0aW9ucyk7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gaGVhZGVycykge1xuICAgICAgICBzZXRfaGVhZGVyKFtrZXksIGhlYWRlcnNba2V5XV0pO1xuICAgICAgfVxuXG4gICAgICAvKiBsb2FkIHRoZSBzdGFydGluZyBwb3NpdGlvbiBpbmRpY2F0ZWQgYnkgW1NldHVwICcxJ10gYW5kXG4gICAgICAqIFtGRU4gcG9zaXRpb25dICovXG4gICAgICBpZiAoaGVhZGVyc1snU2V0VXAnXSA9PT0gJzEnKSB7XG4gICAgICAgICAgaWYgKCEoKCdGRU4nIGluIGhlYWRlcnMpICYmIGxvYWQoaGVhZGVyc1snRkVOJ10pKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLyogZGVsZXRlIGhlYWRlciB0byBnZXQgdGhlIG1vdmVzICovXG4gICAgICB2YXIgbXMgPSBwZ24ucmVwbGFjZShoZWFkZXJfc3RyaW5nLCAnJykucmVwbGFjZShuZXcgUmVnRXhwKG1hc2sobmV3bGluZV9jaGFyKSwgJ2cnKSwgJyAnKTtcblxuICAgICAgLyogZGVsZXRlIGNvbW1lbnRzICovXG4gICAgICBtcyA9IG1zLnJlcGxhY2UoLyhcXHtbXn1dK1xcfSkrPy9nLCAnJyk7XG5cbiAgICAgIC8qIGRlbGV0ZSByZWN1cnNpdmUgYW5ub3RhdGlvbiB2YXJpYXRpb25zICovXG4gICAgICB2YXIgcmF2X3JlZ2V4ID0gLyhcXChbXlxcKFxcKV0rXFwpKSs/L2dcbiAgICAgIHdoaWxlIChyYXZfcmVnZXgudGVzdChtcykpIHtcbiAgICAgICAgbXMgPSBtcy5yZXBsYWNlKHJhdl9yZWdleCwgJycpO1xuICAgICAgfVxuXG4gICAgICAvKiBkZWxldGUgbW92ZSBudW1iZXJzICovXG4gICAgICBtcyA9IG1zLnJlcGxhY2UoL1xcZCtcXC4oXFwuXFwuKT8vZywgJycpO1xuXG4gICAgICAvKiBkZWxldGUgLi4uIGluZGljYXRpbmcgYmxhY2sgdG8gbW92ZSAqL1xuICAgICAgbXMgPSBtcy5yZXBsYWNlKC9cXC5cXC5cXC4vZywgJycpO1xuXG4gICAgICAvKiBkZWxldGUgbnVtZXJpYyBhbm5vdGF0aW9uIGdseXBocyAqL1xuICAgICAgbXMgPSBtcy5yZXBsYWNlKC9cXCRcXGQrL2csICcnKTtcblxuICAgICAgLyogdHJpbSBhbmQgZ2V0IGFycmF5IG9mIG1vdmVzICovXG4gICAgICB2YXIgbW92ZXMgPSB0cmltKG1zKS5zcGxpdChuZXcgUmVnRXhwKC9cXHMrLykpO1xuXG4gICAgICAvKiBkZWxldGUgZW1wdHkgZW50cmllcyAqL1xuICAgICAgbW92ZXMgPSBtb3Zlcy5qb2luKCcsJykucmVwbGFjZSgvLCwrL2csICcsJykuc3BsaXQoJywnKTtcbiAgICAgIHZhciBtb3ZlID0gJyc7XG5cbiAgICAgIGZvciAodmFyIGhhbGZfbW92ZSA9IDA7IGhhbGZfbW92ZSA8IG1vdmVzLmxlbmd0aCAtIDE7IGhhbGZfbW92ZSsrKSB7XG4gICAgICAgIG1vdmUgPSBtb3ZlX2Zyb21fc2FuKG1vdmVzW2hhbGZfbW92ZV0sIHNsb3BweSk7XG5cbiAgICAgICAgLyogbW92ZSBub3QgcG9zc2libGUhIChkb24ndCBjbGVhciB0aGUgYm9hcmQgdG8gZXhhbWluZSB0byBzaG93IHRoZVxuICAgICAgICAgKiBsYXRlc3QgdmFsaWQgcG9zaXRpb24pXG4gICAgICAgICAqL1xuICAgICAgICBpZiAobW92ZSA9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1ha2VfbW92ZShtb3ZlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvKiBleGFtaW5lIGxhc3QgbW92ZSAqL1xuICAgICAgbW92ZSA9IG1vdmVzW21vdmVzLmxlbmd0aCAtIDFdO1xuICAgICAgaWYgKFBPU1NJQkxFX1JFU1VMVFMuaW5kZXhPZihtb3ZlKSA+IC0xKSB7XG4gICAgICAgIGlmIChoYXNfa2V5cyhoZWFkZXIpICYmIHR5cGVvZiBoZWFkZXIuUmVzdWx0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHNldF9oZWFkZXIoWydSZXN1bHQnLCBtb3ZlXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBtb3ZlID0gbW92ZV9mcm9tX3Nhbihtb3ZlLCBzbG9wcHkpO1xuICAgICAgICBpZiAobW92ZSA9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1ha2VfbW92ZShtb3ZlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIGhlYWRlcjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gc2V0X2hlYWRlcihhcmd1bWVudHMpO1xuICAgIH0sXG5cbiAgICBhc2NpaTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gYXNjaWkoKTtcbiAgICB9LFxuXG4gICAgdHVybjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdHVybjtcbiAgICB9LFxuXG4gICAgbW92ZTogZnVuY3Rpb24obW92ZSwgb3B0aW9ucykge1xuICAgICAgLyogVGhlIG1vdmUgZnVuY3Rpb24gY2FuIGJlIGNhbGxlZCB3aXRoIGluIHRoZSBmb2xsb3dpbmcgcGFyYW1ldGVyczpcbiAgICAgICAqXG4gICAgICAgKiAubW92ZSgnTnhiNycpICAgICAgPC0gd2hlcmUgJ21vdmUnIGlzIGEgY2FzZS1zZW5zaXRpdmUgU0FOIHN0cmluZ1xuICAgICAgICpcbiAgICAgICAqIC5tb3ZlKHsgZnJvbTogJ2g3JywgPC0gd2hlcmUgdGhlICdtb3ZlJyBpcyBhIG1vdmUgb2JqZWN0IChhZGRpdGlvbmFsXG4gICAgICAgKiAgICAgICAgIHRvIDonaDgnLCAgICAgIGZpZWxkcyBhcmUgaWdub3JlZClcbiAgICAgICAqICAgICAgICAgcHJvbW90aW9uOiAncScsXG4gICAgICAgKiAgICAgIH0pXG4gICAgICAgKi9cblxuICAgICAgLy8gYWxsb3cgdGhlIHVzZXIgdG8gc3BlY2lmeSB0aGUgc2xvcHB5IG1vdmUgcGFyc2VyIHRvIHdvcmsgYXJvdW5kIG92ZXJcbiAgICAgIC8vIGRpc2FtYmlndWF0aW9uIGJ1Z3MgaW4gRnJpdHogYW5kIENoZXNzYmFzZVxuICAgICAgdmFyIHNsb3BweSA9ICh0eXBlb2Ygb3B0aW9ucyAhPT0gJ3VuZGVmaW5lZCcgJiYgJ3Nsb3BweScgaW4gb3B0aW9ucykgP1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnNsb3BweSA6IGZhbHNlO1xuXG4gICAgICB2YXIgbW92ZV9vYmogPSBudWxsO1xuXG4gICAgICBpZiAodHlwZW9mIG1vdmUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIG1vdmVfb2JqID0gbW92ZV9mcm9tX3Nhbihtb3ZlLCBzbG9wcHkpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgbW92ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgdmFyIG1vdmVzID0gZ2VuZXJhdGVfbW92ZXMoKTtcblxuICAgICAgICAvKiBjb252ZXJ0IHRoZSBwcmV0dHkgbW92ZSBvYmplY3QgdG8gYW4gdWdseSBtb3ZlIG9iamVjdCAqL1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbW92ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBpZiAobW92ZS5mcm9tID09PSBhbGdlYnJhaWMobW92ZXNbaV0uZnJvbSkgJiZcbiAgICAgICAgICAgICAgbW92ZS50byA9PT0gYWxnZWJyYWljKG1vdmVzW2ldLnRvKSAmJlxuICAgICAgICAgICAgICAoISgncHJvbW90aW9uJyBpbiBtb3Zlc1tpXSkgfHxcbiAgICAgICAgICAgICAgbW92ZS5wcm9tb3Rpb24gPT09IG1vdmVzW2ldLnByb21vdGlvbikpIHtcbiAgICAgICAgICAgIG1vdmVfb2JqID0gbW92ZXNbaV07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLyogZmFpbGVkIHRvIGZpbmQgbW92ZSAqL1xuICAgICAgaWYgKCFtb3ZlX29iaikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgLyogbmVlZCB0byBtYWtlIGEgY29weSBvZiBtb3ZlIGJlY2F1c2Ugd2UgY2FuJ3QgZ2VuZXJhdGUgU0FOIGFmdGVyIHRoZVxuICAgICAgICogbW92ZSBpcyBtYWRlXG4gICAgICAgKi9cbiAgICAgIHZhciBwcmV0dHlfbW92ZSA9IG1ha2VfcHJldHR5KG1vdmVfb2JqKTtcblxuICAgICAgbWFrZV9tb3ZlKG1vdmVfb2JqKTtcblxuICAgICAgcmV0dXJuIHByZXR0eV9tb3ZlO1xuICAgIH0sXG5cbiAgICB1bmRvOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBtb3ZlID0gdW5kb19tb3ZlKCk7XG4gICAgICByZXR1cm4gKG1vdmUpID8gbWFrZV9wcmV0dHkobW92ZSkgOiBudWxsO1xuICAgIH0sXG5cbiAgICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY2xlYXIoKTtcbiAgICB9LFxuXG4gICAgcHV0OiBmdW5jdGlvbihwaWVjZSwgc3F1YXJlKSB7XG4gICAgICByZXR1cm4gcHV0KHBpZWNlLCBzcXVhcmUpO1xuICAgIH0sXG5cbiAgICBnZXQ6IGZ1bmN0aW9uKHNxdWFyZSkge1xuICAgICAgcmV0dXJuIGdldChzcXVhcmUpO1xuICAgIH0sXG5cbiAgICByZW1vdmU6IGZ1bmN0aW9uKHNxdWFyZSkge1xuICAgICAgcmV0dXJuIHJlbW92ZShzcXVhcmUpO1xuICAgIH0sXG5cbiAgICBwZXJmdDogZnVuY3Rpb24oZGVwdGgpIHtcbiAgICAgIHJldHVybiBwZXJmdChkZXB0aCk7XG4gICAgfSxcblxuICAgIHNxdWFyZV9jb2xvcjogZnVuY3Rpb24oc3F1YXJlKSB7XG4gICAgICBpZiAoc3F1YXJlIGluIFNRVUFSRVMpIHtcbiAgICAgICAgdmFyIHNxXzB4ODggPSBTUVVBUkVTW3NxdWFyZV07XG4gICAgICAgIHJldHVybiAoKHJhbmsoc3FfMHg4OCkgKyBmaWxlKHNxXzB4ODgpKSAlIDIgPT09IDApID8gJ2xpZ2h0JyA6ICdkYXJrJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIGhpc3Rvcnk6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIHZhciByZXZlcnNlZF9oaXN0b3J5ID0gW107XG4gICAgICB2YXIgbW92ZV9oaXN0b3J5ID0gW107XG4gICAgICB2YXIgdmVyYm9zZSA9ICh0eXBlb2Ygb3B0aW9ucyAhPT0gJ3VuZGVmaW5lZCcgJiYgJ3ZlcmJvc2UnIGluIG9wdGlvbnMgJiZcbiAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMudmVyYm9zZSk7XG5cbiAgICAgIHdoaWxlIChoaXN0b3J5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV2ZXJzZWRfaGlzdG9yeS5wdXNoKHVuZG9fbW92ZSgpKTtcbiAgICAgIH1cblxuICAgICAgd2hpbGUgKHJldmVyc2VkX2hpc3RvcnkubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgbW92ZSA9IHJldmVyc2VkX2hpc3RvcnkucG9wKCk7XG4gICAgICAgIGlmICh2ZXJib3NlKSB7XG4gICAgICAgICAgbW92ZV9oaXN0b3J5LnB1c2gobWFrZV9wcmV0dHkobW92ZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1vdmVfaGlzdG9yeS5wdXNoKG1vdmVfdG9fc2FuKG1vdmUpKTtcbiAgICAgICAgfVxuICAgICAgICBtYWtlX21vdmUobW92ZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBtb3ZlX2hpc3Rvcnk7XG4gICAgfVxuXG4gIH07XG59O1xuXG4vKiBleHBvcnQgQ2hlc3Mgb2JqZWN0IGlmIHVzaW5nIG5vZGUgb3IgYW55IG90aGVyIENvbW1vbkpTIGNvbXBhdGlibGVcbiAqIGVudmlyb25tZW50ICovXG5pZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSBleHBvcnRzLkNoZXNzID0gQ2hlc3M7XG4vKiBleHBvcnQgQ2hlc3Mgb2JqZWN0IGZvciBhbnkgUmVxdWlyZUpTIGNvbXBhdGlibGUgZW52aXJvbm1lbnQgKi9cbmlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJykgZGVmaW5lKCBmdW5jdGlvbiAoKSB7IHJldHVybiBDaGVzczsgIH0pO1xuIiwiLy8gVGhpcyBmaWxlIGlzIHRoZSBjb25jYXRlbmF0aW9uIG9mIG1hbnkganMgZmlsZXMuXG4vLyBTZWUgaHR0cDovL2dpdGh1Yi5jb20vamltaGlnc29uL29ib2UuanMgZm9yIHRoZSByYXcgc291cmNlXG5cbi8vIGhhdmluZyBhIGxvY2FsIHVuZGVmaW5lZCwgd2luZG93LCBPYmplY3QgZXRjIGFsbG93cyBzbGlnaHRseSBiZXR0ZXIgbWluaWZpY2F0aW9uOlxuKGZ1bmN0aW9uICAod2luZG93LCBPYmplY3QsIEFycmF5LCBFcnJvciwgSlNPTiwgdW5kZWZpbmVkICkge1xuXG4gICAvLyB2Mi4xLjMtMTUtZzc0MzJiNDlcblxuLypcblxuQ29weXJpZ2h0IChjKSAyMDEzLCBKaW0gSGlnc29uXG5cbkFsbCByaWdodHMgcmVzZXJ2ZWQuXG5cblJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxubW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZVxubWV0OlxuXG4xLiAgUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHRcbiAgICBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG5cbjIuICBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodFxuICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGVcbiAgICBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuXG5USElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTIFwiQVNcbklTXCIgQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURURcblRPLCBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQVxuUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUXG5IT0xERVIgT1IgQ09OVFJJQlVUT1JTIEJFIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsXG5TUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURURcblRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSwgREFUQSwgT1JcblBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OIEFOWSBUSEVPUlkgT0ZcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HXG5ORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVNcblNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuXG4qL1xuXG4vKiogXG4gKiBQYXJ0aWFsbHkgY29tcGxldGUgYSBmdW5jdGlvbi5cbiAqIFxuICogIHZhciBhZGQzID0gcGFydGlhbENvbXBsZXRlKCBmdW5jdGlvbiBhZGQoYSxiKXtyZXR1cm4gYStifSwgMyApO1xuICogIFxuICogIGFkZDMoNCkgLy8gZ2l2ZXMgN1xuICogIFxuICogIGZ1bmN0aW9uIHdyYXAobGVmdCwgcmlnaHQsIGNlbil7cmV0dXJuIGxlZnQgKyBcIiBcIiArIGNlbiArIFwiIFwiICsgcmlnaHQ7fVxuICogIFxuICogIHZhciBwaXJhdGVHcmVldGluZyA9IHBhcnRpYWxDb21wbGV0ZSggd3JhcCAsIFwiSSdtXCIsIFwiLCBhIG1pZ2h0eSBwaXJhdGUhXCIgKTtcbiAqICBcbiAqICBwaXJhdGVHcmVldGluZyhcIkd1eWJydXNoIFRocmVlcHdvb2RcIik7IFxuICogIC8vIGdpdmVzIFwiSSdtIEd1eWJydXNoIFRocmVlcHdvb2QsIGEgbWlnaHR5IHBpcmF0ZSFcIlxuICovXG52YXIgcGFydGlhbENvbXBsZXRlID0gdmFyQXJncyhmdW5jdGlvbiggZm4sIGFyZ3MgKSB7XG5cbiAgICAgIC8vIHRoaXMgaXNuJ3QgdGhlIHNob3J0ZXN0IHdheSB0byB3cml0ZSB0aGlzIGJ1dCBpdCBkb2VzXG4gICAgICAvLyBhdm9pZCBjcmVhdGluZyBhIG5ldyBhcnJheSBlYWNoIHRpbWUgdG8gcGFzcyB0byBmbi5hcHBseSxcbiAgICAgIC8vIG90aGVyd2lzZSBjb3VsZCBqdXN0IGNhbGwgYm91bmRBcmdzLmNvbmNhdChjYWxsQXJncykgICAgICAgXG5cbiAgICAgIHZhciBudW1Cb3VuZEFyZ3MgPSBhcmdzLmxlbmd0aDtcblxuICAgICAgcmV0dXJuIHZhckFyZ3MoZnVuY3Rpb24oIGNhbGxBcmdzICkge1xuICAgICAgICAgXG4gICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxBcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW251bUJvdW5kQXJncyArIGldID0gY2FsbEFyZ3NbaV07XG4gICAgICAgICB9XG4gICAgICAgICBcbiAgICAgICAgIGFyZ3MubGVuZ3RoID0gbnVtQm91bmRBcmdzICsgY2FsbEFyZ3MubGVuZ3RoOyAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICB9KTsgXG4gICB9KSxcblxuLyoqXG4gKiBDb21wb3NlIHplcm8gb3IgbW9yZSBmdW5jdGlvbnM6XG4gKiBcbiAqICAgIGNvbXBvc2UoZjEsIGYyLCBmMykoeCkgPSBmMShmMihmMyh4KSkpKVxuICogXG4gKiBUaGUgbGFzdCAoaW5uZXItbW9zdCkgZnVuY3Rpb24gbWF5IHRha2UgbW9yZSB0aGFuIG9uZSBwYXJhbWV0ZXI6XG4gKiBcbiAqICAgIGNvbXBvc2UoZjEsIGYyLCBmMykoeCx5KSA9IGYxKGYyKGYzKHgseSkpKSlcbiAqL1xuICAgY29tcG9zZSA9IHZhckFyZ3MoZnVuY3Rpb24oZm5zKSB7XG5cbiAgICAgIHZhciBmbnNMaXN0ID0gYXJyYXlBc0xpc3QoZm5zKTtcbiAgIFxuICAgICAgZnVuY3Rpb24gbmV4dChwYXJhbXMsIGN1ckZuKSB7ICBcbiAgICAgICAgIHJldHVybiBbYXBwbHkocGFyYW1zLCBjdXJGbildOyAgIFxuICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICByZXR1cm4gdmFyQXJncyhmdW5jdGlvbihzdGFydFBhcmFtcyl7XG4gICAgICAgIFxuICAgICAgICAgcmV0dXJuIGZvbGRSKG5leHQsIHN0YXJ0UGFyYW1zLCBmbnNMaXN0KVswXTtcbiAgICAgIH0pO1xuICAgfSk7XG5cbi8qKlxuICogQSBtb3JlIG9wdGltaXNlZCB2ZXJzaW9uIG9mIGNvbXBvc2UgdGhhdCB0YWtlcyBleGFjdGx5IHR3byBmdW5jdGlvbnNcbiAqIEBwYXJhbSBmMVxuICogQHBhcmFtIGYyXG4gKi9cbmZ1bmN0aW9uIGNvbXBvc2UyKGYxLCBmMil7XG4gICByZXR1cm4gZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiBmMS5jYWxsKHRoaXMsZjIuYXBwbHkodGhpcyxhcmd1bWVudHMpKTtcbiAgIH1cbn1cblxuLyoqXG4gKiBHZW5lcmljIGZvcm0gZm9yIGEgZnVuY3Rpb24gdG8gZ2V0IGEgcHJvcGVydHkgZnJvbSBhbiBvYmplY3RcbiAqIFxuICogICAgdmFyIG8gPSB7XG4gKiAgICAgICBmb286J2JhcidcbiAqICAgIH1cbiAqICAgIFxuICogICAgdmFyIGdldEZvbyA9IGF0dHIoJ2ZvbycpXG4gKiAgICBcbiAqICAgIGZldEZvbyhvKSAvLyByZXR1cm5zICdiYXInXG4gKiBcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgdGhlIHByb3BlcnR5IG5hbWVcbiAqL1xuZnVuY3Rpb24gYXR0cihrZXkpIHtcbiAgIHJldHVybiBmdW5jdGlvbihvKSB7IHJldHVybiBvW2tleV07IH07XG59XG4gICAgICAgIFxuLyoqXG4gKiBDYWxsIGEgbGlzdCBvZiBmdW5jdGlvbnMgd2l0aCB0aGUgc2FtZSBhcmdzIHVudGlsIG9uZSByZXR1cm5zIGEgXG4gKiB0cnV0aHkgcmVzdWx0LiBTaW1pbGFyIHRvIHRoZSB8fCBvcGVyYXRvci5cbiAqIFxuICogU286XG4gKiAgICAgIGxhenlVbmlvbihbZjEsZjIsZjMgLi4uIGZuXSkoIHAxLCBwMiAuLi4gcG4gKVxuICogICAgICBcbiAqIElzIGVxdWl2YWxlbnQgdG86IFxuICogICAgICBhcHBseShbcDEsIHAyIC4uLiBwbl0sIGYxKSB8fCBcbiAqICAgICAgYXBwbHkoW3AxLCBwMiAuLi4gcG5dLCBmMikgfHwgXG4gKiAgICAgIGFwcGx5KFtwMSwgcDIgLi4uIHBuXSwgZjMpIC4uLiBhcHBseShmbiwgW3AxLCBwMiAuLi4gcG5dKSAgXG4gKiAgXG4gKiBAcmV0dXJucyB0aGUgZmlyc3QgcmV0dXJuIHZhbHVlIHRoYXQgaXMgZ2l2ZW4gdGhhdCBpcyB0cnV0aHkuXG4gKi9cbiAgIHZhciBsYXp5VW5pb24gPSB2YXJBcmdzKGZ1bmN0aW9uKGZucykge1xuXG4gICAgICByZXR1cm4gdmFyQXJncyhmdW5jdGlvbihwYXJhbXMpe1xuICAgXG4gICAgICAgICB2YXIgbWF5YmVWYWx1ZTtcbiAgIFxuICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW4oZm5zKTsgaSsrKSB7XG4gICBcbiAgICAgICAgICAgIG1heWJlVmFsdWUgPSBhcHBseShwYXJhbXMsIGZuc1tpXSk7XG4gICBcbiAgICAgICAgICAgIGlmKCBtYXliZVZhbHVlICkge1xuICAgICAgICAgICAgICAgcmV0dXJuIG1heWJlVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICB9XG4gICAgICB9KTtcbiAgIH0pOyAgIFxuXG4vKipcbiAqIFRoaXMgZmlsZSBkZWNsYXJlcyB2YXJpb3VzIHBpZWNlcyBvZiBmdW5jdGlvbmFsIHByb2dyYW1taW5nLlxuICogXG4gKiBUaGlzIGlzbid0IGEgZ2VuZXJhbCBwdXJwb3NlIGZ1bmN0aW9uYWwgbGlicmFyeSwgdG8ga2VlcCB0aGluZ3Mgc21hbGwgaXRcbiAqIGhhcyBqdXN0IHRoZSBwYXJ0cyB1c2VmdWwgZm9yIE9ib2UuanMuXG4gKi9cblxuXG4vKipcbiAqIENhbGwgYSBzaW5nbGUgZnVuY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gYXJndW1lbnRzIGFycmF5LlxuICogQmFzaWNhbGx5LCBhIGZ1bmN0aW9uYWwtc3R5bGUgdmVyc2lvbiBvZiB0aGUgT08tc3R5bGUgRnVuY3Rpb24jYXBwbHkgZm9yIFxuICogd2hlbiB3ZSBkb24ndCBjYXJlIGFib3V0IHRoZSBjb250ZXh0ICgndGhpcycpIG9mIHRoZSBjYWxsLlxuICogXG4gKiBUaGUgb3JkZXIgb2YgYXJndW1lbnRzIGFsbG93cyBwYXJ0aWFsIGNvbXBsZXRpb24gb2YgdGhlIGFyZ3VtZW50cyBhcnJheVxuICovXG5mdW5jdGlvbiBhcHBseShhcmdzLCBmbikge1xuICAgcmV0dXJuIGZuLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG59XG5cbi8qKlxuICogRGVmaW5lIHZhcmlhYmxlIGFyZ3VtZW50IGZ1bmN0aW9ucyBidXQgY3V0IG91dCBhbGwgdGhhdCB0ZWRpb3VzIG1lc3NpbmcgYWJvdXQgXG4gKiB3aXRoIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBEZWxpdmVycyB0aGUgdmFyaWFibGUtbGVuZ3RoIHBhcnQgb2YgdGhlIGFyZ3VtZW50c1xuICogbGlzdCBhcyBhbiBhcnJheS5cbiAqIFxuICogRWc6XG4gKiBcbiAqIHZhciBteUZ1bmN0aW9uID0gdmFyQXJncyhcbiAqICAgIGZ1bmN0aW9uKCBmaXhlZEFyZ3VtZW50LCBvdGhlckZpeGVkQXJndW1lbnQsIHZhcmlhYmxlTnVtYmVyT2ZBcmd1bWVudHMgKXtcbiAqICAgICAgIGNvbnNvbGUubG9nKCB2YXJpYWJsZU51bWJlck9mQXJndW1lbnRzICk7XG4gKiAgICB9XG4gKiApXG4gKiBcbiAqIG15RnVuY3Rpb24oJ2EnLCAnYicsIDEsIDIsIDMpOyAvLyBsb2dzIFsxLDIsM11cbiAqIFxuICogdmFyIG15T3RoZXJGdW5jdGlvbiA9IHZhckFyZ3MoZnVuY3Rpb24oIHZhcmlhYmxlTnVtYmVyT2ZBcmd1bWVudHMgKXtcbiAqICAgIGNvbnNvbGUubG9nKCB2YXJpYWJsZU51bWJlck9mQXJndW1lbnRzICk7XG4gKiB9KVxuICogXG4gKiBteUZ1bmN0aW9uKDEsIDIsIDMpOyAvLyBsb2dzIFsxLDIsM11cbiAqIFxuICovXG5mdW5jdGlvbiB2YXJBcmdzKGZuKXtcblxuICAgdmFyIG51bWJlck9mRml4ZWRBcmd1bWVudHMgPSBmbi5sZW5ndGggLTEsXG4gICAgICAgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7ICAgICAgICAgIFxuICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgXG4gICBpZiggbnVtYmVyT2ZGaXhlZEFyZ3VtZW50cyA9PSAwICkge1xuICAgICAgLy8gYW4gb3B0aW1pc2VkIGNhc2UgZm9yIHdoZW4gdGhlcmUgYXJlIG5vIGZpeGVkIGFyZ3M6ICAgXG4gICBcbiAgICAgIHJldHVybiBmdW5jdGlvbigpe1xuICAgICAgICAgcmV0dXJuIGZuLmNhbGwodGhpcywgc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcbiAgICAgIH1cbiAgICAgIFxuICAgfSBlbHNlIGlmKCBudW1iZXJPZkZpeGVkQXJndW1lbnRzID09IDEgKSB7XG4gICAgICAvLyBhbiBvcHRpbWlzZWQgY2FzZSBmb3Igd2hlbiB0aGVyZSBhcmUgaXMgb25lIGZpeGVkIGFyZ3M6XG4gICBcbiAgICAgIHJldHVybiBmdW5jdGlvbigpe1xuICAgICAgICAgcmV0dXJuIGZuLmNhbGwodGhpcywgYXJndW1lbnRzWzBdLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgICAgfVxuICAgfVxuICAgXG4gICAvLyBnZW5lcmFsIGNhc2UgICBcblxuICAgLy8gd2Uga25vdyBob3cgbWFueSBhcmd1bWVudHMgZm4gd2lsbCBhbHdheXMgdGFrZS4gQ3JlYXRlIGFcbiAgIC8vIGZpeGVkLXNpemUgYXJyYXkgdG8gaG9sZCB0aGF0IG1hbnksIHRvIGJlIHJlLXVzZWQgb25cbiAgIC8vIGV2ZXJ5IGNhbGwgdG8gdGhlIHJldHVybmVkIGZ1bmN0aW9uXG4gICB2YXIgYXJnc0hvbGRlciA9IEFycmF5KGZuLmxlbmd0aCk7ICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgcmV0dXJuIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bWJlck9mRml4ZWRBcmd1bWVudHM7IGkrKykge1xuICAgICAgICAgYXJnc0hvbGRlcltpXSA9IGFyZ3VtZW50c1tpXTsgICAgICAgICBcbiAgICAgIH1cblxuICAgICAgYXJnc0hvbGRlcltudW1iZXJPZkZpeGVkQXJndW1lbnRzXSA9IFxuICAgICAgICAgc2xpY2UuY2FsbChhcmd1bWVudHMsIG51bWJlck9mRml4ZWRBcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgIHJldHVybiBmbi5hcHBseSggdGhpcywgYXJnc0hvbGRlcik7ICAgICAgXG4gICB9ICAgICAgIFxufVxuXG5cbi8qKlxuICogU3dhcCB0aGUgb3JkZXIgb2YgcGFyYW1ldGVycyB0byBhIGJpbmFyeSBmdW5jdGlvblxuICogXG4gKiBBIGJpdCBsaWtlIHRoaXMgZmxpcDogaHR0cDovL3p2b24ub3JnL290aGVyL2hhc2tlbGwvT3V0cHV0cHJlbHVkZS9mbGlwX2YuaHRtbFxuICovXG5mdW5jdGlvbiBmbGlwKGZuKXtcbiAgIHJldHVybiBmdW5jdGlvbihhLCBiKXtcbiAgICAgIHJldHVybiBmbihiLGEpO1xuICAgfVxufVxuXG5cbi8qKlxuICogQ3JlYXRlIGEgZnVuY3Rpb24gd2hpY2ggaXMgdGhlIGludGVyc2VjdGlvbiBvZiB0d28gb3RoZXIgZnVuY3Rpb25zLlxuICogXG4gKiBMaWtlIHRoZSAmJiBvcGVyYXRvciwgaWYgdGhlIGZpcnN0IGlzIHRydXRoeSwgdGhlIHNlY29uZCBpcyBuZXZlciBjYWxsZWQsXG4gKiBvdGhlcndpc2UgdGhlIHJldHVybiB2YWx1ZSBmcm9tIHRoZSBzZWNvbmQgaXMgcmV0dXJuZWQuXG4gKi9cbmZ1bmN0aW9uIGxhenlJbnRlcnNlY3Rpb24oZm4xLCBmbjIpIHtcblxuICAgcmV0dXJuIGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgIHJldHVybiBmbjEocGFyYW0pICYmIGZuMihwYXJhbSk7XG4gICB9OyAgIFxufVxuXG4vKipcbiAqIEEgZnVuY3Rpb24gd2hpY2ggZG9lcyBub3RoaW5nXG4gKi9cbmZ1bmN0aW9uIG5vb3AoKXt9XG5cbi8qKlxuICogQSBmdW5jdGlvbiB3aGljaCBpcyBhbHdheXMgaGFwcHlcbiAqL1xuZnVuY3Rpb24gYWx3YXlzKCl7cmV0dXJuIHRydWV9XG5cbi8qKlxuICogQ3JlYXRlIGEgZnVuY3Rpb24gd2hpY2ggYWx3YXlzIHJldHVybnMgdGhlIHNhbWVcbiAqIHZhbHVlXG4gKiBcbiAqIHZhciByZXR1cm4zID0gZnVuY3RvcigzKTtcbiAqIFxuICogcmV0dXJuMygpIC8vIGdpdmVzIDNcbiAqIHJldHVybjMoKSAvLyBzdGlsbCBnaXZlcyAzXG4gKiByZXR1cm4zKCkgLy8gd2lsbCBhbHdheXMgZ2l2ZSAzXG4gKi9cbmZ1bmN0aW9uIGZ1bmN0b3IodmFsKXtcbiAgIHJldHVybiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIHZhbDtcbiAgIH1cbn1cblxuLyoqXG4gKiBUaGlzIGZpbGUgZGVmaW5lcyBzb21lIGxvb3NlbHkgYXNzb2NpYXRlZCBzeW50YWN0aWMgc3VnYXIgZm9yIFxuICogSmF2YXNjcmlwdCBwcm9ncmFtbWluZyBcbiAqL1xuXG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiBjYW5kaWRhdGUgaXMgb2YgdHlwZSBUXG4gKi9cbmZ1bmN0aW9uIGlzT2ZUeXBlKFQsIG1heWJlU29tZXRoaW5nKXtcbiAgIHJldHVybiBtYXliZVNvbWV0aGluZyAmJiBtYXliZVNvbWV0aGluZy5jb25zdHJ1Y3RvciA9PT0gVDtcbn1cblxudmFyIGxlbiA9IGF0dHIoJ2xlbmd0aCcpLCAgICBcbiAgICBpc1N0cmluZyA9IHBhcnRpYWxDb21wbGV0ZShpc09mVHlwZSwgU3RyaW5nKTtcblxuLyoqIFxuICogSSBkb24ndCBsaWtlIHNheWluZyB0aGlzOlxuICogXG4gKiAgICBmb28gIT09PSB1bmRlZmluZWRcbiAqICAgIFxuICogYmVjYXVzZSBvZiB0aGUgZG91YmxlLW5lZ2F0aXZlLiBJIGZpbmQgdGhpczpcbiAqIFxuICogICAgZGVmaW5lZChmb28pXG4gKiAgICBcbiAqIGVhc2llciB0byByZWFkLlxuICovIFxuZnVuY3Rpb24gZGVmaW5lZCggdmFsdWUgKSB7XG4gICByZXR1cm4gdmFsdWUgIT09IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgb2JqZWN0IG8gaGFzIGEga2V5IG5hbWVkIGxpa2UgZXZlcnkgcHJvcGVydHkgaW4gXG4gKiB0aGUgcHJvcGVydGllcyBhcnJheS4gV2lsbCBnaXZlIGZhbHNlIGlmIGFueSBhcmUgbWlzc2luZywgb3IgaWYgbyBcbiAqIGlzIG5vdCBhbiBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGhhc0FsbFByb3BlcnRpZXMoZmllbGRMaXN0LCBvKSB7XG5cbiAgIHJldHVybiAgICAgIChvIGluc3RhbmNlb2YgT2JqZWN0KSBcbiAgICAgICAgICAgICYmXG4gICAgICAgICAgICAgICBhbGwoZnVuY3Rpb24gKGZpZWxkKSB7ICAgICAgICAgXG4gICAgICAgICAgICAgICAgICByZXR1cm4gKGZpZWxkIGluIG8pOyAgICAgICAgIFxuICAgICAgICAgICAgICAgfSwgZmllbGRMaXN0KTtcbn1cbi8qKlxuICogTGlrZSBjb25zIGluIExpc3BcbiAqL1xuZnVuY3Rpb24gY29ucyh4LCB4cykge1xuICAgXG4gICAvKiBJbnRlcm5hbGx5IGxpc3RzIGFyZSBsaW5rZWQgMi1lbGVtZW50IEphdmFzY3JpcHQgYXJyYXlzLlxuICAgICAgICAgIFxuICAgICAgSWRlYWxseSB0aGUgcmV0dXJuIGhlcmUgd291bGQgYmUgT2JqZWN0LmZyZWV6ZShbeCx4c10pXG4gICAgICBzbyB0aGF0IGJ1Z3MgcmVsYXRlZCB0byBtdXRhdGlvbiBhcmUgZm91bmQgZmFzdC5cbiAgICAgIEhvd2V2ZXIsIGNvbnMgaXMgcmlnaHQgb24gdGhlIGNyaXRpY2FsIHBhdGggZm9yXG4gICAgICBwZXJmb3JtYW5jZSBhbmQgdGhpcyBzbG93cyBvYm9lLW1hcmsgZG93biBieVxuICAgICAgfjI1JS4gVW5kZXIgdGhlb3JldGljYWwgZnV0dXJlIEpTIGVuZ2luZXMgdGhhdCBmcmVlemUgbW9yZVxuICAgICAgZWZmaWNpZW50bHkgKHBvc3NpYmx5IGV2ZW4gdXNlIGltbXV0YWJpbGl0eSB0b1xuICAgICAgcnVuIGZhc3RlcikgdGhpcyBzaG91bGQgYmUgY29uc2lkZXJlZCBmb3JcbiAgICAgIHJlc3RvcmF0aW9uLlxuICAgKi9cbiAgIFxuICAgcmV0dXJuIFt4LHhzXTtcbn1cblxuLyoqXG4gKiBUaGUgZW1wdHkgbGlzdFxuICovXG52YXIgZW1wdHlMaXN0ID0gbnVsbCxcblxuLyoqXG4gKiBHZXQgdGhlIGhlYWQgb2YgYSBsaXN0LlxuICogXG4gKiBJZSwgaGVhZChjb25zKGEsYikpID0gYVxuICovXG4gICAgaGVhZCA9IGF0dHIoMCksXG5cbi8qKlxuICogR2V0IHRoZSB0YWlsIG9mIGEgbGlzdC5cbiAqIFxuICogSWUsIHRhaWwoY29ucyhhLGIpKSA9IGJcbiAqL1xuICAgIHRhaWwgPSBhdHRyKDEpO1xuXG5cbi8qKiBcbiAqIENvbnZlcnRzIGFuIGFycmF5IHRvIGEgbGlzdCBcbiAqIFxuICogICAgYXNMaXN0KFthLGIsY10pXG4gKiBcbiAqIGlzIGVxdWl2YWxlbnQgdG86XG4gKiAgICBcbiAqICAgIGNvbnMoYSwgY29ucyhiLCBjb25zKGMsIGVtcHR5TGlzdCkpKSBcbiAqKi9cbmZ1bmN0aW9uIGFycmF5QXNMaXN0KGlucHV0QXJyYXkpe1xuXG4gICByZXR1cm4gcmV2ZXJzZUxpc3QoIFxuICAgICAgaW5wdXRBcnJheS5yZWR1Y2UoXG4gICAgICAgICBmbGlwKGNvbnMpLFxuICAgICAgICAgZW1wdHlMaXN0IFxuICAgICAgKVxuICAgKTtcbn1cblxuLyoqXG4gKiBBIHZhcmFyZ3MgdmVyc2lvbiBvZiBhcnJheUFzTGlzdC4gV29ya3MgYSBiaXQgbGlrZSBsaXN0XG4gKiBpbiBMSVNQLlxuICogXG4gKiAgICBsaXN0KGEsYixjKSBcbiAqICAgIFxuICogaXMgZXF1aXZhbGVudCB0bzpcbiAqIFxuICogICAgY29ucyhhLCBjb25zKGIsIGNvbnMoYywgZW1wdHlMaXN0KSkpXG4gKi9cbnZhciBsaXN0ID0gdmFyQXJncyhhcnJheUFzTGlzdCk7XG5cbi8qKlxuICogQ29udmVydCBhIGxpc3QgYmFjayB0byBhIGpzIG5hdGl2ZSBhcnJheVxuICovXG5mdW5jdGlvbiBsaXN0QXNBcnJheShsaXN0KXtcblxuICAgcmV0dXJuIGZvbGRSKCBmdW5jdGlvbihhcnJheVNvRmFyLCBsaXN0SXRlbSl7XG4gICAgICBcbiAgICAgIGFycmF5U29GYXIudW5zaGlmdChsaXN0SXRlbSk7XG4gICAgICByZXR1cm4gYXJyYXlTb0ZhcjtcbiAgICAgICAgICAgXG4gICB9LCBbXSwgbGlzdCApO1xuICAgXG59XG5cbi8qKlxuICogTWFwIGEgZnVuY3Rpb24gb3ZlciBhIGxpc3QgXG4gKi9cbmZ1bmN0aW9uIG1hcChmbiwgbGlzdCkge1xuXG4gICByZXR1cm4gbGlzdFxuICAgICAgICAgICAgPyBjb25zKGZuKGhlYWQobGlzdCkpLCBtYXAoZm4sdGFpbChsaXN0KSkpXG4gICAgICAgICAgICA6IGVtcHR5TGlzdFxuICAgICAgICAgICAgO1xufVxuXG4vKipcbiAqIGZvbGRSIGltcGxlbWVudGF0aW9uLiBSZWR1Y2UgYSBsaXN0IGRvd24gdG8gYSBzaW5nbGUgdmFsdWUuXG4gKiBcbiAqIEBwcmFtIHtGdW5jdGlvbn0gZm4gICAgIChyaWdodEV2YWwsIGN1clZhbCkgLT4gcmVzdWx0IFxuICovXG5mdW5jdGlvbiBmb2xkUihmbiwgc3RhcnRWYWx1ZSwgbGlzdCkge1xuICAgICAgXG4gICByZXR1cm4gbGlzdCBcbiAgICAgICAgICAgID8gZm4oZm9sZFIoZm4sIHN0YXJ0VmFsdWUsIHRhaWwobGlzdCkpLCBoZWFkKGxpc3QpKVxuICAgICAgICAgICAgOiBzdGFydFZhbHVlXG4gICAgICAgICAgICA7XG59XG5cbi8qKlxuICogZm9sZFIgaW1wbGVtZW50YXRpb24uIFJlZHVjZSBhIGxpc3QgZG93biB0byBhIHNpbmdsZSB2YWx1ZS5cbiAqIFxuICogQHByYW0ge0Z1bmN0aW9ufSBmbiAgICAgKHJpZ2h0RXZhbCwgY3VyVmFsKSAtPiByZXN1bHQgXG4gKi9cbmZ1bmN0aW9uIGZvbGRSMShmbiwgbGlzdCkge1xuICAgICAgXG4gICByZXR1cm4gdGFpbChsaXN0KSBcbiAgICAgICAgICAgID8gZm4oZm9sZFIxKGZuLCB0YWlsKGxpc3QpKSwgaGVhZChsaXN0KSlcbiAgICAgICAgICAgIDogaGVhZChsaXN0KVxuICAgICAgICAgICAgO1xufVxuXG5cbi8qKlxuICogUmV0dXJuIGEgbGlzdCBsaWtlIHRoZSBvbmUgZ2l2ZW4gYnV0IHdpdGggdGhlIGZpcnN0IGluc3RhbmNlIGVxdWFsIFxuICogdG8gaXRlbSByZW1vdmVkIFxuICovXG5mdW5jdGlvbiB3aXRob3V0KGxpc3QsIHRlc3QsIHJlbW92ZWRGbikge1xuIFxuICAgcmV0dXJuIHdpdGhvdXRJbm5lcihsaXN0LCByZW1vdmVkRm4gfHwgbm9vcCk7XG4gXG4gICBmdW5jdGlvbiB3aXRob3V0SW5uZXIoc3ViTGlzdCwgcmVtb3ZlZEZuKSB7XG4gICAgICByZXR1cm4gc3ViTGlzdCAgXG4gICAgICAgICA/ICAoIHRlc3QoaGVhZChzdWJMaXN0KSkgXG4gICAgICAgICAgICAgICAgICA/IChyZW1vdmVkRm4oaGVhZChzdWJMaXN0KSksIHRhaWwoc3ViTGlzdCkpIFxuICAgICAgICAgICAgICAgICAgOiBjb25zKGhlYWQoc3ViTGlzdCksIHdpdGhvdXRJbm5lcih0YWlsKHN1Ykxpc3QpLCByZW1vdmVkRm4pKVxuICAgICAgICAgICAgKVxuICAgICAgICAgOiBlbXB0eUxpc3RcbiAgICAgICAgIDtcbiAgIH0gICAgICAgICAgICAgICBcbn1cblxuLyoqIFxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiBmdW5jdGlvbiBob2xkcyBmb3IgZXZlcnkgaXRlbSBpbiBcbiAqIHRoZSBsaXN0LCBmYWxzZSBvdGhlcndpc2UgXG4gKi9cbmZ1bmN0aW9uIGFsbChmbiwgbGlzdCkge1xuICAgXG4gICByZXR1cm4gIWxpc3QgfHwgXG4gICAgICAgICAgKCBmbihoZWFkKGxpc3QpKSAmJiBhbGwoZm4sIHRhaWwobGlzdCkpICk7XG59XG5cbi8qKlxuICogQ2FsbCBldmVyeSBmdW5jdGlvbiBpbiBhIGxpc3Qgb2YgZnVuY3Rpb25zIHdpdGggdGhlIHNhbWUgYXJndW1lbnRzXG4gKiBcbiAqIFRoaXMgZG9lc24ndCBtYWtlIGFueSBzZW5zZSBpZiB3ZSdyZSBkb2luZyBwdXJlIGZ1bmN0aW9uYWwgYmVjYXVzZSBcbiAqIGl0IGRvZXNuJ3QgcmV0dXJuIGFueXRoaW5nLiBIZW5jZSwgdGhpcyBpcyBvbmx5IHJlYWxseSB1c2VmdWwgaWYgdGhlXG4gKiBmdW5jdGlvbnMgYmVpbmcgY2FsbGVkIGhhdmUgc2lkZS1lZmZlY3RzLiBcbiAqL1xuZnVuY3Rpb24gYXBwbHlFYWNoKGZuTGlzdCwgYXJncykge1xuXG4gICBpZiggZm5MaXN0ICkgeyAgXG4gICAgICBoZWFkKGZuTGlzdCkuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICBcbiAgICAgIGFwcGx5RWFjaCh0YWlsKGZuTGlzdCksIGFyZ3MpO1xuICAgfVxufVxuXG4vKipcbiAqIFJldmVyc2UgdGhlIG9yZGVyIG9mIGEgbGlzdFxuICovXG5mdW5jdGlvbiByZXZlcnNlTGlzdChsaXN0KXsgXG5cbiAgIC8vIGpzIHJlLWltcGxlbWVudGF0aW9uIG9mIDNyZCBzb2x1dGlvbiBmcm9tOlxuICAgLy8gICAgaHR0cDovL3d3dy5oYXNrZWxsLm9yZy9oYXNrZWxsd2lraS85OV9xdWVzdGlvbnMvU29sdXRpb25zLzVcbiAgIGZ1bmN0aW9uIHJldmVyc2VJbm5lciggbGlzdCwgcmV2ZXJzZWRBbHJlYWR5ICkge1xuICAgICAgaWYoICFsaXN0ICkge1xuICAgICAgICAgcmV0dXJuIHJldmVyc2VkQWxyZWFkeTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIHJldmVyc2VJbm5lcih0YWlsKGxpc3QpLCBjb25zKGhlYWQobGlzdCksIHJldmVyc2VkQWxyZWFkeSkpXG4gICB9XG5cbiAgIHJldHVybiByZXZlcnNlSW5uZXIobGlzdCwgZW1wdHlMaXN0KTtcbn1cblxuZnVuY3Rpb24gZmlyc3QodGVzdCwgbGlzdCkge1xuICAgcmV0dXJuICAgbGlzdCAmJlxuICAgICAgICAgICAgICAgKHRlc3QoaGVhZChsaXN0KSkgXG4gICAgICAgICAgICAgICAgICA/IGhlYWQobGlzdCkgXG4gICAgICAgICAgICAgICAgICA6IGZpcnN0KHRlc3QsdGFpbChsaXN0KSkpOyBcbn1cblxuLyogXG4gICBUaGlzIGlzIGEgc2xpZ2h0bHkgaGFja2VkLXVwIGJyb3dzZXIgb25seSB2ZXJzaW9uIG9mIGNsYXJpbmV0IFxuICAgXG4gICAgICAqICBzb21lIGZlYXR1cmVzIHJlbW92ZWQgdG8gaGVscCBrZWVwIGJyb3dzZXIgT2JvZSB1bmRlciBcbiAgICAgICAgIHRoZSA1ayBtaWNyby1saWJyYXJ5IGxpbWl0XG4gICAgICAqICBwbHVnIGRpcmVjdGx5IGludG8gZXZlbnQgYnVzXG4gICBcbiAgIEZvciB0aGUgb3JpZ2luYWwgZ28gaGVyZTpcbiAgICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9kc2NhcGUvY2xhcmluZXRcblxuICAgV2UgcmVjZWl2ZSB0aGUgZXZlbnRzOlxuICAgICAgU1RSRUFNX0RBVEFcbiAgICAgIFNUUkVBTV9FTkRcbiAgICAgIFxuICAgV2UgZW1pdCB0aGUgZXZlbnRzOlxuICAgICAgU0FYX0tFWVxuICAgICAgU0FYX1ZBTFVFX09QRU5cbiAgICAgIFNBWF9WQUxVRV9DTE9TRSAgICAgIFxuICAgICAgRkFJTF9FVkVOVCAgICAgIFxuICovXG5cbmZ1bmN0aW9uIGNsYXJpbmV0KGV2ZW50QnVzKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICAgXG4gIHZhciBcbiAgICAgIC8vIHNob3J0Y3V0IHNvbWUgZXZlbnRzIG9uIHRoZSBidXNcbiAgICAgIGVtaXRTYXhLZXkgICAgICAgICAgID0gZXZlbnRCdXMoU0FYX0tFWSkuZW1pdCxcbiAgICAgIGVtaXRWYWx1ZU9wZW4gICAgICAgID0gZXZlbnRCdXMoU0FYX1ZBTFVFX09QRU4pLmVtaXQsXG4gICAgICBlbWl0VmFsdWVDbG9zZSAgICAgICA9IGV2ZW50QnVzKFNBWF9WQUxVRV9DTE9TRSkuZW1pdCxcbiAgICAgIGVtaXRGYWlsICAgICAgICAgICAgID0gZXZlbnRCdXMoRkFJTF9FVkVOVCkuZW1pdCxcbiAgICAgICAgICAgICAgXG4gICAgICBNQVhfQlVGRkVSX0xFTkdUSCA9IDY0ICogMTAyNFxuICAsICAgc3RyaW5nVG9rZW5QYXR0ZXJuID0gL1tcXFxcXCJcXG5dL2dcbiAgLCAgIF9uID0gMFxuICBcbiAgICAgIC8vIHN0YXRlc1xuICAsICAgQkVHSU4gICAgICAgICAgICAgICAgPSBfbisrXG4gICwgICBWQUxVRSAgICAgICAgICAgICAgICA9IF9uKysgLy8gZ2VuZXJhbCBzdHVmZlxuICAsICAgT1BFTl9PQkpFQ1QgICAgICAgICAgPSBfbisrIC8vIHtcbiAgLCAgIENMT1NFX09CSkVDVCAgICAgICAgID0gX24rKyAvLyB9XG4gICwgICBPUEVOX0FSUkFZICAgICAgICAgICA9IF9uKysgLy8gW1xuICAsICAgQ0xPU0VfQVJSQVkgICAgICAgICAgPSBfbisrIC8vIF1cbiAgLCAgIFNUUklORyAgICAgICAgICAgICAgID0gX24rKyAvLyBcIlwiXG4gICwgICBPUEVOX0tFWSAgICAgICAgICAgICA9IF9uKysgLy8gLCBcImFcIlxuICAsICAgQ0xPU0VfS0VZICAgICAgICAgICAgPSBfbisrIC8vIDpcbiAgLCAgIFRSVUUgICAgICAgICAgICAgICAgID0gX24rKyAvLyByXG4gICwgICBUUlVFMiAgICAgICAgICAgICAgICA9IF9uKysgLy8gdVxuICAsICAgVFJVRTMgICAgICAgICAgICAgICAgPSBfbisrIC8vIGVcbiAgLCAgIEZBTFNFICAgICAgICAgICAgICAgID0gX24rKyAvLyBhXG4gICwgICBGQUxTRTIgICAgICAgICAgICAgICA9IF9uKysgLy8gbFxuICAsICAgRkFMU0UzICAgICAgICAgICAgICAgPSBfbisrIC8vIHNcbiAgLCAgIEZBTFNFNCAgICAgICAgICAgICAgID0gX24rKyAvLyBlXG4gICwgICBOVUxMICAgICAgICAgICAgICAgICA9IF9uKysgLy8gdVxuICAsICAgTlVMTDIgICAgICAgICAgICAgICAgPSBfbisrIC8vIGxcbiAgLCAgIE5VTEwzICAgICAgICAgICAgICAgID0gX24rKyAvLyBsXG4gICwgICBOVU1CRVJfREVDSU1BTF9QT0lOVCA9IF9uKysgLy8gLlxuICAsICAgTlVNQkVSX0RJR0lUICAgICAgICAgPSBfbiAgIC8vIFswLTldXG5cbiAgICAgIC8vIHNldHVwIGluaXRpYWwgcGFyc2VyIHZhbHVlc1xuICAsICAgYnVmZmVyQ2hlY2tQb3NpdGlvbiAgPSBNQVhfQlVGRkVSX0xFTkdUSFxuICAsICAgbGF0ZXN0RXJyb3IgICAgICAgICAgICAgICAgXG4gICwgICBjICAgICAgICAgICAgICAgICAgICBcbiAgLCAgIHAgICAgICAgICAgICAgICAgICAgIFxuICAsICAgdGV4dE5vZGUgICAgICAgICAgICAgPSB1bmRlZmluZWRcbiAgLCAgIG51bWJlck5vZGUgICAgICAgICAgID0gXCJcIiAgICAgXG4gICwgICBzbGFzaGVkICAgICAgICAgICAgICA9IGZhbHNlXG4gICwgICBjbG9zZWQgICAgICAgICAgICAgICA9IGZhbHNlXG4gICwgICBzdGF0ZSAgICAgICAgICAgICAgICA9IEJFR0lOXG4gICwgICBzdGFjayAgICAgICAgICAgICAgICA9IFtdXG4gICwgICB1bmljb2RlUyAgICAgICAgICAgICA9IG51bGxcbiAgLCAgIHVuaWNvZGVJICAgICAgICAgICAgID0gMFxuICAsICAgZGVwdGggICAgICAgICAgICAgICAgPSAwXG4gICwgICBwb3NpdGlvbiAgICAgICAgICAgICA9IDBcbiAgLCAgIGNvbHVtbiAgICAgICAgICAgICAgID0gMCAgLy9tb3N0bHkgZm9yIGVycm9yIHJlcG9ydGluZ1xuICAsICAgbGluZSAgICAgICAgICAgICAgICAgPSAxXG4gIDtcblxuICBmdW5jdGlvbiBjaGVja0J1ZmZlckxlbmd0aCAoKSB7XG4gICAgIFxuICAgIHZhciBtYXhBY3R1YWwgPSAwO1xuICAgICBcbiAgICBpZiAodGV4dE5vZGUgIT09IHVuZGVmaW5lZCAmJiB0ZXh0Tm9kZS5sZW5ndGggPiBNQVhfQlVGRkVSX0xFTkdUSCkge1xuICAgICAgZW1pdEVycm9yKFwiTWF4IGJ1ZmZlciBsZW5ndGggZXhjZWVkZWQ6IHRleHROb2RlXCIpO1xuICAgICAgbWF4QWN0dWFsID0gTWF0aC5tYXgobWF4QWN0dWFsLCB0ZXh0Tm9kZS5sZW5ndGgpO1xuICAgIH1cbiAgICBpZiAobnVtYmVyTm9kZS5sZW5ndGggPiBNQVhfQlVGRkVSX0xFTkdUSCkge1xuICAgICAgZW1pdEVycm9yKFwiTWF4IGJ1ZmZlciBsZW5ndGggZXhjZWVkZWQ6IG51bWJlck5vZGVcIik7XG4gICAgICBtYXhBY3R1YWwgPSBNYXRoLm1heChtYXhBY3R1YWwsIG51bWJlck5vZGUubGVuZ3RoKTtcbiAgICB9XG4gICAgIFxuICAgIGJ1ZmZlckNoZWNrUG9zaXRpb24gPSAoTUFYX0JVRkZFUl9MRU5HVEggLSBtYXhBY3R1YWwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBwb3NpdGlvbjtcbiAgfVxuXG4gIGV2ZW50QnVzKFNUUkVBTV9EQVRBKS5vbihoYW5kbGVEYXRhKTtcblxuICAgLyogQXQgdGhlIGVuZCBvZiB0aGUgaHR0cCBjb250ZW50IGNsb3NlIHRoZSBjbGFyaW5ldCBcbiAgICBUaGlzIHdpbGwgcHJvdmlkZSBhbiBlcnJvciBpZiB0aGUgdG90YWwgY29udGVudCBwcm92aWRlZCB3YXMgbm90IFxuICAgIHZhbGlkIGpzb24sIGllIGlmIG5vdCBhbGwgYXJyYXlzLCBvYmplY3RzIGFuZCBTdHJpbmdzIGNsb3NlZCBwcm9wZXJseSAqL1xuICBldmVudEJ1cyhTVFJFQU1fRU5EKS5vbihoYW5kbGVTdHJlYW1FbmQpOyAgIFxuXG4gIGZ1bmN0aW9uIGVtaXRFcnJvciAoZXJyb3JTdHJpbmcpIHtcbiAgICAgaWYgKHRleHROb2RlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZW1pdFZhbHVlT3Blbih0ZXh0Tm9kZSk7XG4gICAgICAgIGVtaXRWYWx1ZUNsb3NlKCk7XG4gICAgICAgIHRleHROb2RlID0gdW5kZWZpbmVkO1xuICAgICB9XG5cbiAgICAgbGF0ZXN0RXJyb3IgPSBFcnJvcihlcnJvclN0cmluZyArIFwiXFxuTG46IFwiK2xpbmUrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlxcbkNvbDogXCIrY29sdW1uK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcXG5DaHI6IFwiK2MpO1xuICAgICBcbiAgICAgZW1pdEZhaWwoZXJyb3JSZXBvcnQodW5kZWZpbmVkLCB1bmRlZmluZWQsIGxhdGVzdEVycm9yKSk7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVTdHJlYW1FbmQoKSB7XG4gICAgaWYoIHN0YXRlID09IEJFR0lOICkge1xuICAgICAgLy8gSGFuZGxlIHRoZSBjYXNlIHdoZXJlIHRoZSBzdHJlYW0gY2xvc2VzIHdpdGhvdXQgZXZlciByZWNlaXZpbmdcbiAgICAgIC8vIGFueSBpbnB1dC4gVGhpcyBpc24ndCBhbiBlcnJvciAtIHJlc3BvbnNlIGJvZGllcyBjYW4gYmUgYmxhbmssXG4gICAgICAvLyBwYXJ0aWN1bGFybHkgZm9yIDIwNCBodHRwIHJlc3BvbnNlc1xuICAgICAgXG4gICAgICAvLyBCZWNhdXNlIG9mIGhvdyBPYm9lIGlzIGN1cnJlbnRseSBpbXBsZW1lbnRlZCwgd2UgcGFyc2UgYVxuICAgICAgLy8gY29tcGxldGVseSBlbXB0eSBzdHJlYW0gYXMgY29udGFpbmluZyBhbiBlbXB0eSBvYmplY3QuXG4gICAgICAvLyBUaGlzIGlzIGJlY2F1c2UgT2JvZSdzIGRvbmUgZXZlbnQgaXMgb25seSBmaXJlZCB3aGVuIHRoZVxuICAgICAgLy8gcm9vdCBvYmplY3Qgb2YgdGhlIEpTT04gc3RyZWFtIGNsb3Nlcy5cbiAgICAgIFxuICAgICAgLy8gVGhpcyBzaG91bGQgYmUgZGVjb3VwbGVkIGFuZCBhdHRhY2hlZCBpbnN0ZWFkIHRvIHRoZSBpbnB1dCBzdHJlYW1cbiAgICAgIC8vIGZyb20gdGhlIGh0dHAgKG9yIHdoYXRldmVyKSByZXNvdXJjZSBlbmRpbmcuXG4gICAgICAvLyBJZiB0aGlzIGRlY291cGxpbmcgY291bGQgaGFwcGVuIHRoZSBTQVggcGFyc2VyIGNvdWxkIHNpbXBseSBlbWl0XG4gICAgICAvLyB6ZXJvIGV2ZW50cyBvbiBhIGNvbXBsZXRlbHkgZW1wdHkgaW5wdXQuXG4gICAgICBlbWl0VmFsdWVPcGVuKHt9KTtcbiAgICAgIGVtaXRWYWx1ZUNsb3NlKCk7XG5cbiAgICAgIGNsb3NlZCA9IHRydWU7XG4gICAgICByZXR1cm47XG4gICAgfVxuICBcbiAgICBpZiAoc3RhdGUgIT09IFZBTFVFIHx8IGRlcHRoICE9PSAwKVxuICAgICAgZW1pdEVycm9yKFwiVW5leHBlY3RlZCBlbmRcIik7XG4gXG4gICAgaWYgKHRleHROb2RlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGVtaXRWYWx1ZU9wZW4odGV4dE5vZGUpO1xuICAgICAgZW1pdFZhbHVlQ2xvc2UoKTtcbiAgICAgIHRleHROb2RlID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAgXG4gICAgY2xvc2VkID0gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHdoaXRlc3BhY2UoYyl7XG4gICAgIHJldHVybiBjID09ICdcXHInIHx8IGMgPT0gJ1xcbicgfHwgYyA9PSAnICcgfHwgYyA9PSAnXFx0JztcbiAgfVxuICAgXG4gIGZ1bmN0aW9uIGhhbmRsZURhdGEgKGNodW5rKSB7XG4gICAgICAgICBcbiAgICAvLyB0aGlzIHVzZWQgdG8gdGhyb3cgdGhlIGVycm9yIGJ1dCBpbnNpZGUgT2JvZSB3ZSB3aWxsIGhhdmUgYWxyZWFkeVxuICAgIC8vIGdvdHRlbiB0aGUgZXJyb3Igd2hlbiBpdCB3YXMgZW1pdHRlZC4gVGhlIGltcG9ydGFudCB0aGluZyBpcyB0b1xuICAgIC8vIG5vdCBjb250aW51ZSB3aXRoIHRoZSBwYXJzZS5cbiAgICBpZiAobGF0ZXN0RXJyb3IpXG4gICAgICByZXR1cm47XG4gICAgICBcbiAgICBpZiAoY2xvc2VkKSB7XG4gICAgICAgcmV0dXJuIGVtaXRFcnJvcihcIkNhbm5vdCB3cml0ZSBhZnRlciBjbG9zZVwiKTtcbiAgICB9XG5cbiAgICB2YXIgaSA9IDA7XG4gICAgYyA9IGNodW5rWzBdOyBcblxuICAgIHdoaWxlIChjKSB7XG4gICAgICBpZiAoaSA+IDApIHtcbiAgICAgICAgcCA9IGM7XG4gICAgICB9XG4gICAgICBjID0gY2h1bmtbaSsrXTtcbiAgICAgIGlmKCFjKSBicmVhaztcblxuICAgICAgcG9zaXRpb24gKys7XG4gICAgICBpZiAoYyA9PSBcIlxcblwiKSB7XG4gICAgICAgIGxpbmUgKys7XG4gICAgICAgIGNvbHVtbiA9IDA7XG4gICAgICB9IGVsc2UgY29sdW1uICsrO1xuICAgICAgc3dpdGNoIChzdGF0ZSkge1xuXG4gICAgICAgIGNhc2UgQkVHSU46XG4gICAgICAgICAgaWYgKGMgPT09IFwie1wiKSBzdGF0ZSA9IE9QRU5fT0JKRUNUO1xuICAgICAgICAgIGVsc2UgaWYgKGMgPT09IFwiW1wiKSBzdGF0ZSA9IE9QRU5fQVJSQVk7XG4gICAgICAgICAgZWxzZSBpZiAoIXdoaXRlc3BhY2UoYykpXG4gICAgICAgICAgICByZXR1cm4gZW1pdEVycm9yKFwiTm9uLXdoaXRlc3BhY2UgYmVmb3JlIHtbLlwiKTtcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgY2FzZSBPUEVOX0tFWTpcbiAgICAgICAgY2FzZSBPUEVOX09CSkVDVDpcbiAgICAgICAgICBpZiAod2hpdGVzcGFjZShjKSkgY29udGludWU7XG4gICAgICAgICAgaWYoc3RhdGUgPT09IE9QRU5fS0VZKSBzdGFjay5wdXNoKENMT1NFX0tFWSk7XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZihjID09PSAnfScpIHtcbiAgICAgICAgICAgICAgZW1pdFZhbHVlT3Blbih7fSk7XG4gICAgICAgICAgICAgIGVtaXRWYWx1ZUNsb3NlKCk7XG4gICAgICAgICAgICAgIHN0YXRlID0gc3RhY2sucG9wKCkgfHwgVkFMVUU7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSBlbHNlICBzdGFjay5wdXNoKENMT1NFX09CSkVDVCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKGMgPT09ICdcIicpXG4gICAgICAgICAgICAgc3RhdGUgPSBTVFJJTkc7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgIHJldHVybiBlbWl0RXJyb3IoXCJNYWxmb3JtZWQgb2JqZWN0IGtleSBzaG91bGQgc3RhcnQgd2l0aCBcXFwiIFwiKTtcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgY2FzZSBDTE9TRV9LRVk6XG4gICAgICAgIGNhc2UgQ0xPU0VfT0JKRUNUOlxuICAgICAgICAgIGlmICh3aGl0ZXNwYWNlKGMpKSBjb250aW51ZTtcblxuICAgICAgICAgIGlmKGM9PT0nOicpIHtcbiAgICAgICAgICAgIGlmKHN0YXRlID09PSBDTE9TRV9PQkpFQ1QpIHtcbiAgICAgICAgICAgICAgc3RhY2sucHVzaChDTE9TRV9PQkpFQ1QpO1xuXG4gICAgICAgICAgICAgICBpZiAodGV4dE5vZGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgLy8gd2FzIHByZXZpb3VzbHkgKGluIHVwc3RyZWFtIENsYXJpbmV0KSBvbmUgZXZlbnRcbiAgICAgICAgICAgICAgICAgIC8vICAtIG9iamVjdCBvcGVuIGNhbWUgd2l0aCB0aGUgdGV4dCBvZiB0aGUgZmlyc3RcbiAgICAgICAgICAgICAgICAgIGVtaXRWYWx1ZU9wZW4oe30pO1xuICAgICAgICAgICAgICAgICAgZW1pdFNheEtleSh0ZXh0Tm9kZSk7XG4gICAgICAgICAgICAgICAgICB0ZXh0Tm9kZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIGRlcHRoKys7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgaWYgKHRleHROb2RlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgIGVtaXRTYXhLZXkodGV4dE5vZGUpO1xuICAgICAgICAgICAgICAgICAgdGV4dE5vZGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAgc3RhdGUgID0gVkFMVUU7XG4gICAgICAgICAgfSBlbHNlIGlmIChjPT09J30nKSB7XG4gICAgICAgICAgICAgaWYgKHRleHROb2RlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBlbWl0VmFsdWVPcGVuKHRleHROb2RlKTtcbiAgICAgICAgICAgICAgICBlbWl0VmFsdWVDbG9zZSgpO1xuICAgICAgICAgICAgICAgIHRleHROb2RlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICBlbWl0VmFsdWVDbG9zZSgpO1xuICAgICAgICAgICAgZGVwdGgtLTtcbiAgICAgICAgICAgIHN0YXRlID0gc3RhY2sucG9wKCkgfHwgVkFMVUU7XG4gICAgICAgICAgfSBlbHNlIGlmKGM9PT0nLCcpIHtcbiAgICAgICAgICAgIGlmKHN0YXRlID09PSBDTE9TRV9PQkpFQ1QpXG4gICAgICAgICAgICAgIHN0YWNrLnB1c2goQ0xPU0VfT0JKRUNUKTtcbiAgICAgICAgICAgICBpZiAodGV4dE5vZGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGVtaXRWYWx1ZU9wZW4odGV4dE5vZGUpO1xuICAgICAgICAgICAgICAgIGVtaXRWYWx1ZUNsb3NlKCk7XG4gICAgICAgICAgICAgICAgdGV4dE5vZGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgfVxuICAgICAgICAgICAgIHN0YXRlICA9IE9QRU5fS0VZO1xuICAgICAgICAgIH0gZWxzZSBcbiAgICAgICAgICAgICByZXR1cm4gZW1pdEVycm9yKCdCYWQgb2JqZWN0Jyk7XG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGNhc2UgT1BFTl9BUlJBWTogLy8gYWZ0ZXIgYW4gYXJyYXkgdGhlcmUgYWx3YXlzIGEgdmFsdWVcbiAgICAgICAgY2FzZSBWQUxVRTpcbiAgICAgICAgICBpZiAod2hpdGVzcGFjZShjKSkgY29udGludWU7XG4gICAgICAgICAgaWYoc3RhdGU9PT1PUEVOX0FSUkFZKSB7XG4gICAgICAgICAgICBlbWl0VmFsdWVPcGVuKFtdKTtcbiAgICAgICAgICAgIGRlcHRoKys7ICAgICAgICAgICAgIFxuICAgICAgICAgICAgc3RhdGUgPSBWQUxVRTtcbiAgICAgICAgICAgIGlmKGMgPT09ICddJykge1xuICAgICAgICAgICAgICBlbWl0VmFsdWVDbG9zZSgpO1xuICAgICAgICAgICAgICBkZXB0aC0tO1xuICAgICAgICAgICAgICBzdGF0ZSA9IHN0YWNrLnBvcCgpIHx8IFZBTFVFO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHN0YWNrLnB1c2goQ0xPU0VfQVJSQVkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIGlmKGMgPT09ICdcIicpIHN0YXRlID0gU1RSSU5HO1xuICAgICAgICAgIGVsc2UgaWYoYyA9PT0gJ3snKSBzdGF0ZSA9IE9QRU5fT0JKRUNUO1xuICAgICAgICAgIGVsc2UgaWYoYyA9PT0gJ1snKSBzdGF0ZSA9IE9QRU5fQVJSQVk7XG4gICAgICAgICAgZWxzZSBpZihjID09PSAndCcpIHN0YXRlID0gVFJVRTtcbiAgICAgICAgICBlbHNlIGlmKGMgPT09ICdmJykgc3RhdGUgPSBGQUxTRTtcbiAgICAgICAgICBlbHNlIGlmKGMgPT09ICduJykgc3RhdGUgPSBOVUxMO1xuICAgICAgICAgIGVsc2UgaWYoYyA9PT0gJy0nKSB7IC8vIGtlZXAgYW5kIGNvbnRpbnVlXG4gICAgICAgICAgICBudW1iZXJOb2RlICs9IGM7XG4gICAgICAgICAgfSBlbHNlIGlmKGM9PT0nMCcpIHtcbiAgICAgICAgICAgIG51bWJlck5vZGUgKz0gYztcbiAgICAgICAgICAgIHN0YXRlID0gTlVNQkVSX0RJR0lUO1xuICAgICAgICAgIH0gZWxzZSBpZignMTIzNDU2Nzg5Jy5pbmRleE9mKGMpICE9PSAtMSkge1xuICAgICAgICAgICAgbnVtYmVyTm9kZSArPSBjO1xuICAgICAgICAgICAgc3RhdGUgPSBOVU1CRVJfRElHSVQ7XG4gICAgICAgICAgfSBlbHNlICAgICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gZW1pdEVycm9yKFwiQmFkIHZhbHVlXCIpO1xuICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBjYXNlIENMT1NFX0FSUkFZOlxuICAgICAgICAgIGlmKGM9PT0nLCcpIHtcbiAgICAgICAgICAgIHN0YWNrLnB1c2goQ0xPU0VfQVJSQVkpO1xuICAgICAgICAgICAgIGlmICh0ZXh0Tm9kZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgZW1pdFZhbHVlT3Blbih0ZXh0Tm9kZSk7XG4gICAgICAgICAgICAgICAgZW1pdFZhbHVlQ2xvc2UoKTtcbiAgICAgICAgICAgICAgICB0ZXh0Tm9kZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgc3RhdGUgID0gVkFMVUU7XG4gICAgICAgICAgfSBlbHNlIGlmIChjPT09J10nKSB7XG4gICAgICAgICAgICAgaWYgKHRleHROb2RlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBlbWl0VmFsdWVPcGVuKHRleHROb2RlKTtcbiAgICAgICAgICAgICAgICBlbWl0VmFsdWVDbG9zZSgpO1xuICAgICAgICAgICAgICAgIHRleHROb2RlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICBlbWl0VmFsdWVDbG9zZSgpO1xuICAgICAgICAgICAgZGVwdGgtLTtcbiAgICAgICAgICAgIHN0YXRlID0gc3RhY2sucG9wKCkgfHwgVkFMVUU7XG4gICAgICAgICAgfSBlbHNlIGlmICh3aGl0ZXNwYWNlKGMpKVxuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICBlbHNlIFxuICAgICAgICAgICAgIHJldHVybiBlbWl0RXJyb3IoJ0JhZCBhcnJheScpO1xuICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBjYXNlIFNUUklORzpcbiAgICAgICAgICBpZiAodGV4dE5vZGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICB0ZXh0Tm9kZSA9IFwiXCI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gdGhhbmtzIHRoZWpoLCB0aGlzIGlzIGFuIGFib3V0IDUwJSBwZXJmb3JtYW5jZSBpbXByb3ZlbWVudC5cbiAgICAgICAgICB2YXIgc3RhcnRpICAgICAgICAgICAgICA9IGktMTtcbiAgICAgICAgICAgXG4gICAgICAgICAgU1RSSU5HX0JJR0xPT1A6IHdoaWxlICh0cnVlKSB7XG5cbiAgICAgICAgICAgIC8vIHplcm8gbWVhbnMgXCJubyB1bmljb2RlIGFjdGl2ZVwiLiAxLTQgbWVhbiBcInBhcnNlIHNvbWUgbW9yZVwiLiBlbmQgYWZ0ZXIgNC5cbiAgICAgICAgICAgIHdoaWxlICh1bmljb2RlSSA+IDApIHtcbiAgICAgICAgICAgICAgdW5pY29kZVMgKz0gYztcbiAgICAgICAgICAgICAgYyA9IGNodW5rLmNoYXJBdChpKyspO1xuICAgICAgICAgICAgICBpZiAodW5pY29kZUkgPT09IDQpIHtcbiAgICAgICAgICAgICAgICAvLyBUT0RPIHRoaXMgbWlnaHQgYmUgc2xvdz8gd2VsbCwgcHJvYmFibHkgbm90IHVzZWQgdG9vIG9mdGVuIGFueXdheVxuICAgICAgICAgICAgICAgIHRleHROb2RlICs9IFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQodW5pY29kZVMsIDE2KSk7XG4gICAgICAgICAgICAgICAgdW5pY29kZUkgPSAwO1xuICAgICAgICAgICAgICAgIHN0YXJ0aSA9IGktMTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB1bmljb2RlSSsrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vIHdlIGNhbiBqdXN0IGJyZWFrIGhlcmU6IG5vIHN0dWZmIHdlIHNraXBwZWQgdGhhdCBzdGlsbCBoYXMgdG8gYmUgc2xpY2VkIG91dCBvciBzb1xuICAgICAgICAgICAgICBpZiAoIWMpIGJyZWFrIFNUUklOR19CSUdMT09QO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGMgPT09ICdcIicgJiYgIXNsYXNoZWQpIHtcbiAgICAgICAgICAgICAgc3RhdGUgPSBzdGFjay5wb3AoKSB8fCBWQUxVRTtcbiAgICAgICAgICAgICAgdGV4dE5vZGUgKz0gY2h1bmsuc3Vic3RyaW5nKHN0YXJ0aSwgaS0xKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYyA9PT0gJ1xcXFwnICYmICFzbGFzaGVkKSB7XG4gICAgICAgICAgICAgIHNsYXNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgICB0ZXh0Tm9kZSArPSBjaHVuay5zdWJzdHJpbmcoc3RhcnRpLCBpLTEpO1xuICAgICAgICAgICAgICAgYyA9IGNodW5rLmNoYXJBdChpKyspO1xuICAgICAgICAgICAgICBpZiAoIWMpIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNsYXNoZWQpIHtcbiAgICAgICAgICAgICAgc2xhc2hlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgIGlmIChjID09PSAnbicpIHsgdGV4dE5vZGUgKz0gJ1xcbic7IH1cbiAgICAgICAgICAgICAgZWxzZSBpZiAoYyA9PT0gJ3InKSB7IHRleHROb2RlICs9ICdcXHInOyB9XG4gICAgICAgICAgICAgIGVsc2UgaWYgKGMgPT09ICd0JykgeyB0ZXh0Tm9kZSArPSAnXFx0JzsgfVxuICAgICAgICAgICAgICBlbHNlIGlmIChjID09PSAnZicpIHsgdGV4dE5vZGUgKz0gJ1xcZic7IH1cbiAgICAgICAgICAgICAgZWxzZSBpZiAoYyA9PT0gJ2InKSB7IHRleHROb2RlICs9ICdcXGInOyB9XG4gICAgICAgICAgICAgIGVsc2UgaWYgKGMgPT09ICd1Jykge1xuICAgICAgICAgICAgICAgIC8vIFxcdXh4eHguIG1laCFcbiAgICAgICAgICAgICAgICB1bmljb2RlSSA9IDE7XG4gICAgICAgICAgICAgICAgdW5pY29kZVMgPSAnJztcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0ZXh0Tm9kZSArPSBjO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGMgPSBjaHVuay5jaGFyQXQoaSsrKTtcbiAgICAgICAgICAgICAgc3RhcnRpID0gaS0xO1xuICAgICAgICAgICAgICBpZiAoIWMpIGJyZWFrO1xuICAgICAgICAgICAgICBlbHNlIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzdHJpbmdUb2tlblBhdHRlcm4ubGFzdEluZGV4ID0gaTtcbiAgICAgICAgICAgIHZhciByZVJlc3VsdCA9IHN0cmluZ1Rva2VuUGF0dGVybi5leGVjKGNodW5rKTtcbiAgICAgICAgICAgIGlmICghcmVSZXN1bHQpIHtcbiAgICAgICAgICAgICAgaSA9IGNodW5rLmxlbmd0aCsxO1xuICAgICAgICAgICAgICB0ZXh0Tm9kZSArPSBjaHVuay5zdWJzdHJpbmcoc3RhcnRpLCBpLTEpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkgPSByZVJlc3VsdC5pbmRleCsxO1xuICAgICAgICAgICAgYyA9IGNodW5rLmNoYXJBdChyZVJlc3VsdC5pbmRleCk7XG4gICAgICAgICAgICBpZiAoIWMpIHtcbiAgICAgICAgICAgICAgdGV4dE5vZGUgKz0gY2h1bmsuc3Vic3RyaW5nKHN0YXJ0aSwgaS0xKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBjYXNlIFRSVUU6XG4gICAgICAgICAgaWYgKCFjKSAgY29udGludWU7IC8vIHN0cmFuZ2UgYnVmZmVyc1xuICAgICAgICAgIGlmIChjPT09J3InKSBzdGF0ZSA9IFRSVUUyO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICByZXR1cm4gZW1pdEVycm9yKCAnSW52YWxpZCB0cnVlIHN0YXJ0ZWQgd2l0aCB0JysgYyk7XG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGNhc2UgVFJVRTI6XG4gICAgICAgICAgaWYgKCFjKSAgY29udGludWU7XG4gICAgICAgICAgaWYgKGM9PT0ndScpIHN0YXRlID0gVFJVRTM7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgIHJldHVybiBlbWl0RXJyb3IoJ0ludmFsaWQgdHJ1ZSBzdGFydGVkIHdpdGggdHInKyBjKTtcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgY2FzZSBUUlVFMzpcbiAgICAgICAgICBpZiAoIWMpIGNvbnRpbnVlO1xuICAgICAgICAgIGlmKGM9PT0nZScpIHtcbiAgICAgICAgICAgIGVtaXRWYWx1ZU9wZW4odHJ1ZSk7XG4gICAgICAgICAgICBlbWl0VmFsdWVDbG9zZSgpO1xuICAgICAgICAgICAgc3RhdGUgPSBzdGFjay5wb3AoKSB8fCBWQUxVRTtcbiAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgICByZXR1cm4gZW1pdEVycm9yKCdJbnZhbGlkIHRydWUgc3RhcnRlZCB3aXRoIHRydScrIGMpO1xuICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBjYXNlIEZBTFNFOlxuICAgICAgICAgIGlmICghYykgIGNvbnRpbnVlO1xuICAgICAgICAgIGlmIChjPT09J2EnKSBzdGF0ZSA9IEZBTFNFMjtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgcmV0dXJuIGVtaXRFcnJvcignSW52YWxpZCBmYWxzZSBzdGFydGVkIHdpdGggZicrIGMpO1xuICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBjYXNlIEZBTFNFMjpcbiAgICAgICAgICBpZiAoIWMpICBjb250aW51ZTtcbiAgICAgICAgICBpZiAoYz09PSdsJykgc3RhdGUgPSBGQUxTRTM7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgIHJldHVybiBlbWl0RXJyb3IoJ0ludmFsaWQgZmFsc2Ugc3RhcnRlZCB3aXRoIGZhJysgYyk7XG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGNhc2UgRkFMU0UzOlxuICAgICAgICAgIGlmICghYykgIGNvbnRpbnVlO1xuICAgICAgICAgIGlmIChjPT09J3MnKSBzdGF0ZSA9IEZBTFNFNDtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgcmV0dXJuIGVtaXRFcnJvcignSW52YWxpZCBmYWxzZSBzdGFydGVkIHdpdGggZmFsJysgYyk7XG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGNhc2UgRkFMU0U0OlxuICAgICAgICAgIGlmICghYykgIGNvbnRpbnVlO1xuICAgICAgICAgIGlmIChjPT09J2UnKSB7XG4gICAgICAgICAgICBlbWl0VmFsdWVPcGVuKGZhbHNlKTtcbiAgICAgICAgICAgIGVtaXRWYWx1ZUNsb3NlKCk7XG4gICAgICAgICAgICBzdGF0ZSA9IHN0YWNrLnBvcCgpIHx8IFZBTFVFO1xuICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgIHJldHVybiBlbWl0RXJyb3IoJ0ludmFsaWQgZmFsc2Ugc3RhcnRlZCB3aXRoIGZhbHMnKyBjKTtcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgY2FzZSBOVUxMOlxuICAgICAgICAgIGlmICghYykgIGNvbnRpbnVlO1xuICAgICAgICAgIGlmIChjPT09J3UnKSBzdGF0ZSA9IE5VTEwyO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICByZXR1cm4gZW1pdEVycm9yKCdJbnZhbGlkIG51bGwgc3RhcnRlZCB3aXRoIG4nKyBjKTtcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgY2FzZSBOVUxMMjpcbiAgICAgICAgICBpZiAoIWMpICBjb250aW51ZTtcbiAgICAgICAgICBpZiAoYz09PSdsJykgc3RhdGUgPSBOVUxMMztcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgcmV0dXJuIGVtaXRFcnJvcignSW52YWxpZCBudWxsIHN0YXJ0ZWQgd2l0aCBudScrIGMpO1xuICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBjYXNlIE5VTEwzOlxuICAgICAgICAgIGlmICghYykgY29udGludWU7XG4gICAgICAgICAgaWYoYz09PSdsJykge1xuICAgICAgICAgICAgZW1pdFZhbHVlT3BlbihudWxsKTtcbiAgICAgICAgICAgIGVtaXRWYWx1ZUNsb3NlKCk7XG4gICAgICAgICAgICBzdGF0ZSA9IHN0YWNrLnBvcCgpIHx8IFZBTFVFO1xuICAgICAgICAgIH0gZWxzZSBcbiAgICAgICAgICAgICByZXR1cm4gZW1pdEVycm9yKCdJbnZhbGlkIG51bGwgc3RhcnRlZCB3aXRoIG51bCcrIGMpO1xuICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBjYXNlIE5VTUJFUl9ERUNJTUFMX1BPSU5UOlxuICAgICAgICAgIGlmKGM9PT0nLicpIHtcbiAgICAgICAgICAgIG51bWJlck5vZGUgKz0gYztcbiAgICAgICAgICAgIHN0YXRlICAgICAgID0gTlVNQkVSX0RJR0lUO1xuICAgICAgICAgIH0gZWxzZSBcbiAgICAgICAgICAgICByZXR1cm4gZW1pdEVycm9yKCdMZWFkaW5nIHplcm8gbm90IGZvbGxvd2VkIGJ5IC4nKTtcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgY2FzZSBOVU1CRVJfRElHSVQ6XG4gICAgICAgICAgaWYoJzAxMjM0NTY3ODknLmluZGV4T2YoYykgIT09IC0xKSBudW1iZXJOb2RlICs9IGM7XG4gICAgICAgICAgZWxzZSBpZiAoYz09PScuJykge1xuICAgICAgICAgICAgaWYobnVtYmVyTm9kZS5pbmRleE9mKCcuJykhPT0tMSlcbiAgICAgICAgICAgICAgIHJldHVybiBlbWl0RXJyb3IoJ0ludmFsaWQgbnVtYmVyIGhhcyB0d28gZG90cycpO1xuICAgICAgICAgICAgbnVtYmVyTm9kZSArPSBjO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYz09PSdlJyB8fCBjPT09J0UnKSB7XG4gICAgICAgICAgICBpZihudW1iZXJOb2RlLmluZGV4T2YoJ2UnKSE9PS0xIHx8XG4gICAgICAgICAgICAgICBudW1iZXJOb2RlLmluZGV4T2YoJ0UnKSE9PS0xIClcbiAgICAgICAgICAgICAgIHJldHVybiBlbWl0RXJyb3IoJ0ludmFsaWQgbnVtYmVyIGhhcyB0d28gZXhwb25lbnRpYWwnKTtcbiAgICAgICAgICAgIG51bWJlck5vZGUgKz0gYztcbiAgICAgICAgICB9IGVsc2UgaWYgKGM9PT1cIitcIiB8fCBjPT09XCItXCIpIHtcbiAgICAgICAgICAgIGlmKCEocD09PSdlJyB8fCBwPT09J0UnKSlcbiAgICAgICAgICAgICAgIHJldHVybiBlbWl0RXJyb3IoJ0ludmFsaWQgc3ltYm9sIGluIG51bWJlcicpO1xuICAgICAgICAgICAgbnVtYmVyTm9kZSArPSBjO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobnVtYmVyTm9kZSkge1xuICAgICAgICAgICAgICBlbWl0VmFsdWVPcGVuKHBhcnNlRmxvYXQobnVtYmVyTm9kZSkpO1xuICAgICAgICAgICAgICBlbWl0VmFsdWVDbG9zZSgpO1xuICAgICAgICAgICAgICBudW1iZXJOb2RlID0gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGktLTsgLy8gZ28gYmFjayBvbmVcbiAgICAgICAgICAgIHN0YXRlID0gc3RhY2sucG9wKCkgfHwgVkFMVUU7XG4gICAgICAgICAgfVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiBlbWl0RXJyb3IoXCJVbmtub3duIHN0YXRlOiBcIiArIHN0YXRlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBvc2l0aW9uID49IGJ1ZmZlckNoZWNrUG9zaXRpb24pXG4gICAgICBjaGVja0J1ZmZlckxlbmd0aCgpO1xuICB9XG59XG5cblxuLyoqIFxuICogQSBicmlkZ2UgdXNlZCB0byBhc3NpZ24gc3RhdGVsZXNzIGZ1bmN0aW9ucyB0byBsaXN0ZW4gdG8gY2xhcmluZXQuXG4gKiBcbiAqIEFzIHdlbGwgYXMgdGhlIHBhcmFtZXRlciBmcm9tIGNsYXJpbmV0LCBlYWNoIGNhbGxiYWNrIHdpbGwgYWxzbyBiZSBwYXNzZWRcbiAqIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgY2FsbGJhY2suXG4gKiBcbiAqIFRoaXMgbWF5IGFsc28gYmUgdXNlZCB0byBjbGVhciBhbGwgbGlzdGVuZXJzIGJ5IGFzc2lnbmluZyB6ZXJvIGhhbmRsZXJzOlxuICogXG4gKiAgICBhc2NlbnRNYW5hZ2VyKCBjbGFyaW5ldCwge30gKVxuICovXG5mdW5jdGlvbiBhc2NlbnRNYW5hZ2VyKG9ib2VCdXMsIGhhbmRsZXJzKXtcbiAgIFwidXNlIHN0cmljdFwiO1xuICAgXG4gICB2YXIgbGlzdGVuZXJJZCA9IHt9LFxuICAgICAgIGFzY2VudDtcblxuICAgZnVuY3Rpb24gc3RhdGVBZnRlcihoYW5kbGVyKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24ocGFyYW0pe1xuICAgICAgICAgYXNjZW50ID0gaGFuZGxlciggYXNjZW50LCBwYXJhbSk7XG4gICAgICB9XG4gICB9XG4gICBcbiAgIGZvciggdmFyIGV2ZW50TmFtZSBpbiBoYW5kbGVycyApIHtcblxuICAgICAgb2JvZUJ1cyhldmVudE5hbWUpLm9uKHN0YXRlQWZ0ZXIoaGFuZGxlcnNbZXZlbnROYW1lXSksIGxpc3RlbmVySWQpO1xuICAgfVxuICAgXG4gICBvYm9lQnVzKE5PREVfU1dBUCkub24oZnVuY3Rpb24obmV3Tm9kZSkge1xuICAgICAgXG4gICAgICB2YXIgb2xkSGVhZCA9IGhlYWQoYXNjZW50KSxcbiAgICAgICAgICBrZXkgPSBrZXlPZihvbGRIZWFkKSxcbiAgICAgICAgICBhbmNlc3RvcnMgPSB0YWlsKGFzY2VudCksXG4gICAgICAgICAgcGFyZW50Tm9kZTtcblxuICAgICAgaWYoIGFuY2VzdG9ycyApIHtcbiAgICAgICAgIHBhcmVudE5vZGUgPSBub2RlT2YoaGVhZChhbmNlc3RvcnMpKTtcbiAgICAgICAgIHBhcmVudE5vZGVba2V5XSA9IG5ld05vZGU7XG4gICAgICB9XG4gICB9KTtcblxuICAgb2JvZUJ1cyhOT0RFX0RST1ApLm9uKGZ1bmN0aW9uKCkge1xuXG4gICAgICB2YXIgb2xkSGVhZCA9IGhlYWQoYXNjZW50KSxcbiAgICAgICAgICBrZXkgPSBrZXlPZihvbGRIZWFkKSxcbiAgICAgICAgICBhbmNlc3RvcnMgPSB0YWlsKGFzY2VudCksXG4gICAgICAgICAgcGFyZW50Tm9kZTtcblxuICAgICAgaWYoIGFuY2VzdG9ycyApIHtcbiAgICAgICAgIHBhcmVudE5vZGUgPSBub2RlT2YoaGVhZChhbmNlc3RvcnMpKTtcbiBcbiAgICAgICAgIGRlbGV0ZSBwYXJlbnROb2RlW2tleV07XG4gICAgICB9XG4gICB9KTtcblxuICAgb2JvZUJ1cyhBQk9SVElORykub24oZnVuY3Rpb24oKXtcbiAgICAgIFxuICAgICAgZm9yKCB2YXIgZXZlbnROYW1lIGluIGhhbmRsZXJzICkge1xuICAgICAgICAgb2JvZUJ1cyhldmVudE5hbWUpLnVuKGxpc3RlbmVySWQpO1xuICAgICAgfVxuICAgfSk7ICAgXG59XG5cbi8vIGJhc2VkIG9uIGdpc3QgaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vbW9uc3VyLzcwNjgzOVxuXG4vKipcbiAqIFhtbEh0dHBSZXF1ZXN0J3MgZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkgbWV0aG9kIHJldHVybnMgYSBzdHJpbmcgb2YgcmVzcG9uc2VcbiAqIGhlYWRlcnMgYWNjb3JkaW5nIHRvIHRoZSBmb3JtYXQgZGVzY3JpYmVkIGhlcmU6XG4gKiBodHRwOi8vd3d3LnczLm9yZy9UUi9YTUxIdHRwUmVxdWVzdC8jdGhlLWdldGFsbHJlc3BvbnNlaGVhZGVycy1tZXRob2RcbiAqIFRoaXMgbWV0aG9kIHBhcnNlcyB0aGF0IHN0cmluZyBpbnRvIGEgdXNlci1mcmllbmRseSBrZXkvdmFsdWUgcGFpciBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlUmVzcG9uc2VIZWFkZXJzKGhlYWRlclN0cikge1xuICAgdmFyIGhlYWRlcnMgPSB7fTtcbiAgIFxuICAgaGVhZGVyU3RyICYmIGhlYWRlclN0ci5zcGxpdCgnXFx1MDAwZFxcdTAwMGEnKVxuICAgICAgLmZvckVhY2goZnVuY3Rpb24oaGVhZGVyUGFpcil7XG4gICBcbiAgICAgICAgIC8vIENhbid0IHVzZSBzcGxpdCgpIGhlcmUgYmVjYXVzZSBpdCBkb2VzIHRoZSB3cm9uZyB0aGluZ1xuICAgICAgICAgLy8gaWYgdGhlIGhlYWRlciB2YWx1ZSBoYXMgdGhlIHN0cmluZyBcIjogXCIgaW4gaXQuXG4gICAgICAgICB2YXIgaW5kZXggPSBoZWFkZXJQYWlyLmluZGV4T2YoJ1xcdTAwM2FcXHUwMDIwJyk7XG4gICAgICAgICBcbiAgICAgICAgIGhlYWRlcnNbaGVhZGVyUGFpci5zdWJzdHJpbmcoMCwgaW5kZXgpXSBcbiAgICAgICAgICAgICAgICAgICAgID0gaGVhZGVyUGFpci5zdWJzdHJpbmcoaW5kZXggKyAyKTtcbiAgICAgIH0pO1xuICAgXG4gICByZXR1cm4gaGVhZGVycztcbn1cblxuLyoqXG4gKiBEZXRlY3QgaWYgYSBnaXZlbiBVUkwgaXMgY3Jvc3Mtb3JpZ2luIGluIHRoZSBzY29wZSBvZiB0aGVcbiAqIGN1cnJlbnQgcGFnZS5cbiAqIFxuICogQnJvd3NlciBvbmx5IChzaW5jZSBjcm9zcy1vcmlnaW4gaGFzIG5vIG1lYW5pbmcgaW4gTm9kZS5qcylcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcGFnZUxvY2F0aW9uIC0gYXMgaW4gd2luZG93LmxvY2F0aW9uXG4gKiBAcGFyYW0ge09iamVjdH0gYWpheEhvc3QgLSBhbiBvYmplY3QgbGlrZSB3aW5kb3cubG9jYXRpb24gZGVzY3JpYmluZyB0aGUgXG4gKiAgICBvcmlnaW4gb2YgdGhlIHVybCB0aGF0IHdlIHdhbnQgdG8gYWpheCBpblxuICovXG5mdW5jdGlvbiBpc0Nyb3NzT3JpZ2luKHBhZ2VMb2NhdGlvbiwgYWpheEhvc3QpIHtcblxuICAgLypcbiAgICAqIE5COiBkZWZhdWx0UG9ydCBvbmx5IGtub3dzIGh0dHAgYW5kIGh0dHBzLlxuICAgICogUmV0dXJucyB1bmRlZmluZWQgb3RoZXJ3aXNlLlxuICAgICovXG4gICBmdW5jdGlvbiBkZWZhdWx0UG9ydChwcm90b2NvbCkge1xuICAgICAgcmV0dXJuIHsnaHR0cDonOjgwLCAnaHR0cHM6Jzo0NDN9W3Byb3RvY29sXTtcbiAgIH1cbiAgIFxuICAgZnVuY3Rpb24gcG9ydE9mKGxvY2F0aW9uKSB7XG4gICAgICAvLyBwYWdlTG9jYXRpb24gc2hvdWxkIGFsd2F5cyBoYXZlIGEgcHJvdG9jb2wuIGFqYXhIb3N0IGlmIG5vIHBvcnQgb3JcbiAgICAgIC8vIHByb3RvY29sIGlzIHNwZWNpZmllZCwgc2hvdWxkIHVzZSB0aGUgcG9ydCBvZiB0aGUgY29udGFpbmluZyBwYWdlXG4gICAgICBcbiAgICAgIHJldHVybiBsb2NhdGlvbi5wb3J0IHx8IGRlZmF1bHRQb3J0KGxvY2F0aW9uLnByb3RvY29sfHxwYWdlTG9jYXRpb24ucHJvdG9jb2wpO1xuICAgfVxuXG4gICAvLyBpZiBhamF4SG9zdCBkb2Vzbid0IGdpdmUgYSBkb21haW4sIHBvcnQgaXMgdGhlIHNhbWUgYXMgcGFnZUxvY2F0aW9uXG4gICAvLyBpdCBjYW4ndCBnaXZlIGEgcHJvdG9jb2wgYnV0IG5vdCBhIGRvbWFpblxuICAgLy8gaXQgY2FuJ3QgZ2l2ZSBhIHBvcnQgYnV0IG5vdCBhIGRvbWFpblxuICAgXG4gICByZXR1cm4gISEoICAoYWpheEhvc3QucHJvdG9jb2wgICYmIChhamF4SG9zdC5wcm90b2NvbCAgIT0gcGFnZUxvY2F0aW9uLnByb3RvY29sKSkgfHxcbiAgICAgICAgICAgICAgIChhamF4SG9zdC5ob3N0ICAgICAgJiYgKGFqYXhIb3N0Lmhvc3QgICAgICAhPSBwYWdlTG9jYXRpb24uaG9zdCkpICAgICB8fFxuICAgICAgICAgICAgICAgKGFqYXhIb3N0Lmhvc3QgICAgICAmJiAocG9ydE9mKGFqYXhIb3N0KSAhPSBwb3J0T2YocGFnZUxvY2F0aW9uKSkpXG4gICAgICAgICAgKTtcbn1cblxuLyogdHVybiBhbnkgdXJsIGludG8gYW4gb2JqZWN0IGxpa2Ugd2luZG93LmxvY2F0aW9uICovXG5mdW5jdGlvbiBwYXJzZVVybE9yaWdpbih1cmwpIHtcbiAgIC8vIHVybCBjb3VsZCBiZSBkb21haW4tcmVsYXRpdmVcbiAgIC8vIHVybCBjb3VsZCBnaXZlIGEgZG9tYWluXG5cbiAgIC8vIGNyb3NzIG9yaWdpbiBtZWFuczpcbiAgIC8vICAgIHNhbWUgZG9tYWluXG4gICAvLyAgICBzYW1lIHBvcnRcbiAgIC8vICAgIHNvbWUgcHJvdG9jb2xcbiAgIC8vIHNvLCBzYW1lIGV2ZXJ5dGhpbmcgdXAgdG8gdGhlIGZpcnN0IChzaW5nbGUpIHNsYXNoIFxuICAgLy8gaWYgc3VjaCBpcyBnaXZlblxuICAgLy9cbiAgIC8vIGNhbiBpZ25vcmUgZXZlcnl0aGluZyBhZnRlciB0aGF0ICAgXG4gICBcbiAgIHZhciBVUkxfSE9TVF9QQVRURVJOID0gLyhcXHcrOik/KD86XFwvXFwvKShbXFx3Li1dKyk/KD86OihcXGQrKSk/XFwvPy8sXG5cbiAgICAgICAgIC8vIGlmIG5vIG1hdGNoLCB1c2UgYW4gZW1wdHkgYXJyYXkgc28gdGhhdFxuICAgICAgICAgLy8gc3ViZXhwcmVzc2lvbnMgMSwyLDMgYXJlIGFsbCB1bmRlZmluZWRcbiAgICAgICAgIC8vIGFuZCB3aWxsIHVsdGltYXRlbHkgcmV0dXJuIGFsbCBlbXB0eVxuICAgICAgICAgLy8gc3RyaW5ncyBhcyB0aGUgcGFyc2UgcmVzdWx0OlxuICAgICAgIHVybEhvc3RNYXRjaCA9IFVSTF9IT1NUX1BBVFRFUk4uZXhlYyh1cmwpIHx8IFtdO1xuICAgXG4gICByZXR1cm4ge1xuICAgICAgcHJvdG9jb2w6ICAgdXJsSG9zdE1hdGNoWzFdIHx8ICcnLFxuICAgICAgaG9zdDogICAgICAgdXJsSG9zdE1hdGNoWzJdIHx8ICcnLFxuICAgICAgcG9ydDogICAgICAgdXJsSG9zdE1hdGNoWzNdIHx8ICcnXG4gICB9O1xufVxuXG5mdW5jdGlvbiBodHRwVHJhbnNwb3J0KCl7XG4gICByZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG59XG5cbi8qKlxuICogQSB3cmFwcGVyIGFyb3VuZCB0aGUgYnJvd3NlciBYbWxIdHRwUmVxdWVzdCBvYmplY3QgdGhhdCByYWlzZXMgYW4gXG4gKiBldmVudCB3aGVuZXZlciBhIG5ldyBwYXJ0IG9mIHRoZSByZXNwb25zZSBpcyBhdmFpbGFibGUuXG4gKiBcbiAqIEluIG9sZGVyIGJyb3dzZXJzIHByb2dyZXNzaXZlIHJlYWRpbmcgaXMgaW1wb3NzaWJsZSBzbyBhbGwgdGhlIFxuICogY29udGVudCBpcyBnaXZlbiBpbiBhIHNpbmdsZSBjYWxsLiBGb3IgbmV3ZXIgb25lcyBzZXZlcmFsIGV2ZW50c1xuICogc2hvdWxkIGJlIHJhaXNlZCwgYWxsb3dpbmcgcHJvZ3Jlc3NpdmUgaW50ZXJwcmV0YXRpb24gb2YgdGhlIHJlc3BvbnNlLlxuICogICAgICBcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG9ib2VCdXMgYW4gZXZlbnQgYnVzIGxvY2FsIHRvIHRoaXMgT2JvZSBpbnN0YW5jZVxuICogQHBhcmFtIHtYTUxIdHRwUmVxdWVzdH0geGhyIHRoZSB4aHIgdG8gdXNlIGFzIHRoZSB0cmFuc3BvcnQuIFVuZGVyIG5vcm1hbFxuICogICAgICAgICAgb3BlcmF0aW9uLCB3aWxsIGhhdmUgYmVlbiBjcmVhdGVkIHVzaW5nIGh0dHBUcmFuc3BvcnQoKSBhYm92ZVxuICogICAgICAgICAgYnV0IGZvciB0ZXN0cyBhIHN0dWIgY2FuIGJlIHByb3ZpZGVkIGluc3RlYWQuXG4gKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kIG9uZSBvZiAnR0VUJyAnUE9TVCcgJ1BVVCcgJ1BBVENIJyAnREVMRVRFJ1xuICogQHBhcmFtIHtTdHJpbmd9IHVybCB0aGUgdXJsIHRvIG1ha2UgYSByZXF1ZXN0IHRvXG4gKiBAcGFyYW0ge1N0cmluZ3xOdWxsfSBkYXRhIHNvbWUgY29udGVudCB0byBiZSBzZW50IHdpdGggdGhlIHJlcXVlc3QuXG4gKiAgICAgICAgICAgICAgICAgICAgICBPbmx5IHZhbGlkIGlmIG1ldGhvZCBpcyBQT1NUIG9yIFBVVC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbaGVhZGVyc10gdGhlIGh0dHAgcmVxdWVzdCBoZWFkZXJzIHRvIHNlbmRcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gd2l0aENyZWRlbnRpYWxzIHRoZSBYSFIgd2l0aENyZWRlbnRpYWxzIHByb3BlcnR5IHdpbGwgYmVcbiAqICAgIHNldCB0byB0aGlzIHZhbHVlXG4gKi8gIFxuZnVuY3Rpb24gc3RyZWFtaW5nSHR0cChvYm9lQnVzLCB4aHIsIG1ldGhvZCwgdXJsLCBkYXRhLCBoZWFkZXJzLCB3aXRoQ3JlZGVudGlhbHMpIHtcbiAgICAgICAgICAgXG4gICBcInVzZSBzdHJpY3RcIjtcbiAgIFxuICAgdmFyIGVtaXRTdHJlYW1EYXRhID0gb2JvZUJ1cyhTVFJFQU1fREFUQSkuZW1pdCxcbiAgICAgICBlbWl0RmFpbCAgICAgICA9IG9ib2VCdXMoRkFJTF9FVkVOVCkuZW1pdCxcbiAgICAgICBudW1iZXJPZkNoYXJzQWxyZWFkeUdpdmVuVG9DYWxsYmFjayA9IDAsXG4gICAgICAgc3RpbGxUb1NlbmRTdGFydEV2ZW50ID0gdHJ1ZTtcblxuICAgLy8gV2hlbiBhbiBBQk9SVElORyBtZXNzYWdlIGlzIHB1dCBvbiB0aGUgZXZlbnQgYnVzIGFib3J0IFxuICAgLy8gdGhlIGFqYXggcmVxdWVzdCAgICAgICAgIFxuICAgb2JvZUJ1cyggQUJPUlRJTkcgKS5vbiggZnVuY3Rpb24oKXtcbiAgXG4gICAgICAvLyBpZiB3ZSBrZWVwIHRoZSBvbnJlYWR5c3RhdGVjaGFuZ2Ugd2hpbGUgYWJvcnRpbmcgdGhlIFhIUiBnaXZlcyBcbiAgICAgIC8vIGEgY2FsbGJhY2sgbGlrZSBhIHN1Y2Nlc3NmdWwgY2FsbCBzbyBmaXJzdCByZW1vdmUgdGhpcyBsaXN0ZW5lclxuICAgICAgLy8gYnkgYXNzaWduaW5nIG51bGw6XG4gICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbDtcbiAgICAgICAgICAgIFxuICAgICAgeGhyLmFib3J0KCk7XG4gICB9KTtcblxuICAgLyoqIFxuICAgICogSGFuZGxlIGlucHV0IGZyb20gdGhlIHVuZGVybHlpbmcgeGhyOiBlaXRoZXIgYSBzdGF0ZSBjaGFuZ2UsXG4gICAgKiB0aGUgcHJvZ3Jlc3MgZXZlbnQgb3IgdGhlIHJlcXVlc3QgYmVpbmcgY29tcGxldGUuXG4gICAgKi9cbiAgIGZ1bmN0aW9uIGhhbmRsZVByb2dyZXNzKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICB2YXIgdGV4dFNvRmFyID0geGhyLnJlc3BvbnNlVGV4dCxcbiAgICAgICAgICBuZXdUZXh0ID0gdGV4dFNvRmFyLnN1YnN0cihudW1iZXJPZkNoYXJzQWxyZWFkeUdpdmVuVG9DYWxsYmFjayk7XG4gICAgICBcbiAgICAgIFxuICAgICAgLyogUmFpc2UgdGhlIGV2ZW50IGZvciBuZXcgdGV4dC5cbiAgICAgIFxuICAgICAgICAgT24gb2xkZXIgYnJvd3NlcnMsIHRoZSBuZXcgdGV4dCBpcyB0aGUgd2hvbGUgcmVzcG9uc2UuIFxuICAgICAgICAgT24gbmV3ZXIvYmV0dGVyIG9uZXMsIHRoZSBmcmFnbWVudCBwYXJ0IHRoYXQgd2UgZ290IHNpbmNlIFxuICAgICAgICAgbGFzdCBwcm9ncmVzcy4gKi9cbiAgICAgICAgIFxuICAgICAgaWYoIG5ld1RleHQgKSB7XG4gICAgICAgICBlbWl0U3RyZWFtRGF0YSggbmV3VGV4dCApO1xuICAgICAgfSBcblxuICAgICAgbnVtYmVyT2ZDaGFyc0FscmVhZHlHaXZlblRvQ2FsbGJhY2sgPSBsZW4odGV4dFNvRmFyKTtcbiAgIH1cbiAgIFxuICAgXG4gICBpZignb25wcm9ncmVzcycgaW4geGhyKXsgIC8vIGRldGVjdCBicm93c2VyIHN1cHBvcnQgZm9yIHByb2dyZXNzaXZlIGRlbGl2ZXJ5XG4gICAgICB4aHIub25wcm9ncmVzcyA9IGhhbmRsZVByb2dyZXNzO1xuICAgfVxuICAgICAgXG4gICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgIGZ1bmN0aW9uIHNlbmRTdGFydElmTm90QWxyZWFkeSgpIHtcbiAgICAgICAgIC8vIEludGVybmV0IEV4cGxvcmVyIGlzIHZlcnkgdW5yZWxpYWJsZSBhcyB0byB3aGVuIHhoci5zdGF0dXMgZXRjIGNhblxuICAgICAgICAgLy8gYmUgcmVhZCBzbyBoYXMgdG8gYmUgcHJvdGVjdGVkIHdpdGggdHJ5L2NhdGNoIGFuZCB0cmllZCBhZ2FpbiBvbiBcbiAgICAgICAgIC8vIHRoZSBuZXh0IHJlYWR5U3RhdGUgaWYgaXQgZmFpbHNcbiAgICAgICAgIHRyeXtcbiAgICAgICAgICAgIHN0aWxsVG9TZW5kU3RhcnRFdmVudCAmJiBvYm9lQnVzKCBIVFRQX1NUQVJUICkuZW1pdChcbiAgICAgICAgICAgICAgIHhoci5zdGF0dXMsXG4gICAgICAgICAgICAgICBwYXJzZVJlc3BvbnNlSGVhZGVycyh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpICk7XG4gICAgICAgICAgICBzdGlsbFRvU2VuZFN0YXJ0RXZlbnQgPSBmYWxzZTtcbiAgICAgICAgIH0gY2F0Y2goZSl7LyogZG8gbm90aGluZywgd2lsbCB0cnkgYWdhaW4gb24gbmV4dCByZWFkeVN0YXRlKi99XG4gICAgICB9XG4gICAgICBcbiAgICAgIHN3aXRjaCggeGhyLnJlYWR5U3RhdGUgKSB7XG4gICAgICAgICAgICAgICBcbiAgICAgICAgIGNhc2UgMjogLy8gSEVBREVSU19SRUNFSVZFRFxuICAgICAgICAgY2FzZSAzOiAvLyBMT0FESU5HXG4gICAgICAgICAgICByZXR1cm4gc2VuZFN0YXJ0SWZOb3RBbHJlYWR5KCk7XG4gICAgICAgICAgICBcbiAgICAgICAgIGNhc2UgNDogLy8gRE9ORVxuICAgICAgICAgICAgc2VuZFN0YXJ0SWZOb3RBbHJlYWR5KCk7IC8vIGlmIHhoci5zdGF0dXMgaGFzbid0IGJlZW4gYXZhaWxhYmxlIHlldCwgaXQgbXVzdCBiZSBOT1csIGh1aCBJRT9cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gaXMgdGhpcyBhIDJ4eCBodHRwIGNvZGU/XG4gICAgICAgICAgICB2YXIgc3VjY2Vzc2Z1bCA9IFN0cmluZyh4aHIuc3RhdHVzKVswXSA9PSAyO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiggc3VjY2Vzc2Z1bCApIHtcbiAgICAgICAgICAgICAgIC8vIEluIENocm9tZSAyOSAobm90IDI4KSBubyBvbnByb2dyZXNzIGlzIGVtaXR0ZWQgd2hlbiBhIHJlc3BvbnNlXG4gICAgICAgICAgICAgICAvLyBpcyBjb21wbGV0ZSBiZWZvcmUgdGhlIG9ubG9hZC4gV2UgbmVlZCB0byBhbHdheXMgZG8gaGFuZGxlSW5wdXRcbiAgICAgICAgICAgICAgIC8vIGluIGNhc2Ugd2UgZ2V0IHRoZSBsb2FkIGJ1dCBoYXZlIG5vdCBoYWQgYSBmaW5hbCBwcm9ncmVzcyBldmVudC5cbiAgICAgICAgICAgICAgIC8vIFRoaXMgbG9va3MgbGlrZSBhIGJ1ZyBhbmQgbWF5IGNoYW5nZSBpbiBmdXR1cmUgYnV0IGxldCdzIHRha2VcbiAgICAgICAgICAgICAgIC8vIHRoZSBzYWZlc3QgYXBwcm9hY2ggYW5kIGFzc3VtZSB3ZSBtaWdodCBub3QgaGF2ZSByZWNlaXZlZCBhIFxuICAgICAgICAgICAgICAgLy8gcHJvZ3Jlc3MgZXZlbnQgZm9yIGVhY2ggcGFydCBvZiB0aGUgcmVzcG9uc2VcbiAgICAgICAgICAgICAgIGhhbmRsZVByb2dyZXNzKCk7XG4gICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgIG9ib2VCdXMoU1RSRUFNX0VORCkuZW1pdCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgZW1pdEZhaWwoIGVycm9yUmVwb3J0KFxuICAgICAgICAgICAgICAgICAgeGhyLnN0YXR1cywgXG4gICAgICAgICAgICAgICAgICB4aHIucmVzcG9uc2VUZXh0XG4gICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgIH1cbiAgICAgIH1cbiAgIH07XG4gICBcbiAgIHRyeXtcbiAgIFxuICAgICAgeGhyLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xuICAgXG4gICAgICBmb3IoIHZhciBoZWFkZXJOYW1lIGluIGhlYWRlcnMgKXtcbiAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlck5hbWUsIGhlYWRlcnNbaGVhZGVyTmFtZV0pO1xuICAgICAgfVxuICAgICAgXG4gICAgICBpZiggIWlzQ3Jvc3NPcmlnaW4od2luZG93LmxvY2F0aW9uLCBwYXJzZVVybE9yaWdpbih1cmwpKSApIHtcbiAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdYLVJlcXVlc3RlZC1XaXRoJywgJ1hNTEh0dHBSZXF1ZXN0Jyk7XG4gICAgICB9XG5cbiAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB3aXRoQ3JlZGVudGlhbHM7XG4gICAgICBcbiAgICAgIHhoci5zZW5kKGRhdGEpO1xuICAgICAgXG4gICB9IGNhdGNoKCBlICkge1xuICAgICAgXG4gICAgICAvLyBUbyBrZWVwIGEgY29uc2lzdGVudCBpbnRlcmZhY2Ugd2l0aCBOb2RlLCB3ZSBjYW4ndCBlbWl0IGFuIGV2ZW50IGhlcmUuXG4gICAgICAvLyBOb2RlJ3Mgc3RyZWFtaW5nIGh0dHAgYWRhcHRvciByZWNlaXZlcyB0aGUgZXJyb3IgYXMgYW4gYXN5bmNocm9ub3VzXG4gICAgICAvLyBldmVudCByYXRoZXIgdGhhbiBhcyBhbiBleGNlcHRpb24uIElmIHdlIGVtaXR0ZWQgbm93LCB0aGUgT2JvZSB1c2VyXG4gICAgICAvLyBoYXMgaGFkIG5vIGNoYW5jZSB0byBhZGQgYSAuZmFpbCBsaXN0ZW5lciBzbyB0aGVyZSBpcyBubyB3YXlcbiAgICAgIC8vIHRoZSBldmVudCBjb3VsZCBiZSB1c2VmdWwuIEZvciBib3RoIHRoZXNlIHJlYXNvbnMgZGVmZXIgdGhlXG4gICAgICAvLyBmaXJpbmcgdG8gdGhlIG5leHQgSlMgZnJhbWUuICBcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KFxuICAgICAgICAgcGFydGlhbENvbXBsZXRlKGVtaXRGYWlsLCBlcnJvclJlcG9ydCh1bmRlZmluZWQsIHVuZGVmaW5lZCwgZSkpXG4gICAgICAsICAwXG4gICAgICApO1xuICAgfSAgICAgICAgICAgIFxufVxuXG52YXIganNvblBhdGhTeW50YXggPSAoZnVuY3Rpb24oKSB7XG4gXG4gICB2YXJcbiAgIFxuICAgLyoqIFxuICAgICogRXhwb3J0IGEgcmVndWxhciBleHByZXNzaW9uIGFzIGEgc2ltcGxlIGZ1bmN0aW9uIGJ5IGV4cG9zaW5nIGp1c3QgXG4gICAgKiB0aGUgUmVnZXgjZXhlYy4gVGhpcyBhbGxvd3MgcmVnZXggdGVzdHMgdG8gYmUgdXNlZCB1bmRlciB0aGUgc2FtZSBcbiAgICAqIGludGVyZmFjZSBhcyBkaWZmZXJlbnRseSBpbXBsZW1lbnRlZCB0ZXN0cywgb3IgZm9yIGEgdXNlciBvZiB0aGVcbiAgICAqIHRlc3RzIHRvIG5vdCBjb25jZXJuIHRoZW1zZWx2ZXMgd2l0aCB0aGVpciBpbXBsZW1lbnRhdGlvbiBhcyByZWd1bGFyXG4gICAgKiBleHByZXNzaW9ucy5cbiAgICAqIFxuICAgICogVGhpcyBjb3VsZCBhbHNvIGJlIGV4cHJlc3NlZCBwb2ludC1mcmVlIGFzOlxuICAgICogICBGdW5jdGlvbi5wcm90b3R5cGUuYmluZC5iaW5kKFJlZ0V4cC5wcm90b3R5cGUuZXhlYyksXG4gICAgKiAgIFxuICAgICogQnV0IHRoYXQncyBmYXIgdG9vIGNvbmZ1c2luZyEgKGFuZCBub3QgZXZlbiBzbWFsbGVyIG9uY2UgbWluaWZpZWQgXG4gICAgKiBhbmQgZ3ppcHBlZClcbiAgICAqL1xuICAgICAgIHJlZ2V4RGVzY3JpcHRvciA9IGZ1bmN0aW9uIHJlZ2V4RGVzY3JpcHRvcihyZWdleCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlZ2V4LmV4ZWMuYmluZChyZWdleCk7XG4gICAgICAgfVxuICAgICAgIFxuICAgLyoqXG4gICAgKiBKb2luIHNldmVyYWwgcmVndWxhciBleHByZXNzaW9ucyBhbmQgZXhwcmVzcyBhcyBhIGZ1bmN0aW9uLlxuICAgICogVGhpcyBhbGxvd3MgdGhlIHRva2VuIHBhdHRlcm5zIHRvIHJldXNlIGNvbXBvbmVudCByZWd1bGFyIGV4cHJlc3Npb25zXG4gICAgKiBpbnN0ZWFkIG9mIGJlaW5nIGV4cHJlc3NlZCBpbiBmdWxsIHVzaW5nIGh1Z2UgYW5kIGNvbmZ1c2luZyByZWd1bGFyXG4gICAgKiBleHByZXNzaW9ucy5cbiAgICAqLyAgICAgICBcbiAgICwgICBqc29uUGF0aENsYXVzZSA9IHZhckFyZ3MoZnVuY3Rpb24oIGNvbXBvbmVudFJlZ2V4ZXMgKSB7XG5cbiAgICAgICAgICAgIC8vIFRoZSByZWd1bGFyIGV4cHJlc3Npb25zIGFsbCBzdGFydCB3aXRoIF4gYmVjYXVzZSB3ZSBcbiAgICAgICAgICAgIC8vIG9ubHkgd2FudCB0byBmaW5kIG1hdGNoZXMgYXQgdGhlIHN0YXJ0IG9mIHRoZSBcbiAgICAgICAgICAgIC8vIEpTT05QYXRoIGZyYWdtZW50IHdlIGFyZSBpbnNwZWN0aW5nICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbXBvbmVudFJlZ2V4ZXMudW5zaGlmdCgvXi8pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gICByZWdleERlc2NyaXB0b3IoXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWdFeHAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRSZWdleGVzLm1hcChhdHRyKCdzb3VyY2UnKSkuam9pbignJylcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgfSlcbiAgICAgICBcbiAgICwgICBwb3NzaWJseUNhcHR1cmluZyA9ICAgICAgICAgICAvKFxcJD8pL1xuICAgLCAgIG5hbWVkTm9kZSA9ICAgICAgICAgICAgICAgICAgIC8oW1xcdy1fXSt8XFwqKS9cbiAgICwgICBuYW1lUGxhY2Vob2xkZXIgPSAgICAgICAgICAgICAvKCkvXG4gICAsICAgbm9kZUluQXJyYXlOb3RhdGlvbiA9ICAgICAgICAgL1xcW1wiKFteXCJdKylcIlxcXS9cbiAgICwgICBudW1iZXJlZE5vZGVJbkFycmF5Tm90YXRpb24gPSAvXFxbKFxcZCt8XFwqKVxcXS9cbiAgICwgICBmaWVsZExpc3QgPSAgICAgICAgICAgICAgICAgICAgICAveyhbXFx3IF0qPyl9L1xuICAgLCAgIG9wdGlvbmFsRmllbGRMaXN0ID0gICAgICAgICAgIC8oPzp7KFtcXHcgXSo/KX0pPy9cbiAgICBcblxuICAgICAgIC8vICAgZm9vIG9yICogICAgICAgICAgICAgICAgICBcbiAgICwgICBqc29uUGF0aE5hbWVkTm9kZUluT2JqZWN0Tm90YXRpb24gICA9IGpzb25QYXRoQ2xhdXNlKCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc3NpYmx5Q2FwdHVyaW5nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVkTm9kZSwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25hbEZpZWxkTGlzdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgLy8gICBbXCJmb29cIl0gICBcbiAgICwgICBqc29uUGF0aE5hbWVkTm9kZUluQXJyYXlOb3RhdGlvbiAgICA9IGpzb25QYXRoQ2xhdXNlKCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc3NpYmx5Q2FwdHVyaW5nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVJbkFycmF5Tm90YXRpb24sIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uYWxGaWVsZExpc3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgIFxuXG4gICAgICAgLy8gICBbMl0gb3IgWypdICAgICAgIFxuICAgLCAgIGpzb25QYXRoTnVtYmVyZWROb2RlSW5BcnJheU5vdGF0aW9uID0ganNvblBhdGhDbGF1c2UoIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zc2libHlDYXB0dXJpbmcsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtYmVyZWROb2RlSW5BcnJheU5vdGF0aW9uLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbmFsRmllbGRMaXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG5cbiAgICAgICAvLyAgIHthIGIgY30gICAgICBcbiAgICwgICBqc29uUGF0aFB1cmVEdWNrVHlwaW5nICAgICAgICAgICAgICA9IGpzb25QYXRoQ2xhdXNlKCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc3NpYmx5Q2FwdHVyaW5nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVQbGFjZWhvbGRlciwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZExpc3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgIFxuICAgICAgIC8vICAgLi5cbiAgICwgICBqc29uUGF0aERvdWJsZURvdCAgICAgICAgICAgICAgICAgICA9IGpzb25QYXRoQ2xhdXNlKC9cXC5cXC4vKSAgICAgICAgICAgICAgICAgIFxuICAgXG4gICAgICAgLy8gICAuXG4gICAsICAganNvblBhdGhEb3QgICAgICAgICAgICAgICAgICAgICAgICAgPSBqc29uUGF0aENsYXVzZSgvXFwuLykgICAgICAgICAgICAgICAgICAgIFxuICAgXG4gICAgICAgLy8gICAhXG4gICAsICAganNvblBhdGhCYW5nICAgICAgICAgICAgICAgICAgICAgICAgPSBqc29uUGF0aENsYXVzZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc3NpYmx5Q2FwdHVyaW5nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8hL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSAgXG4gICBcbiAgICAgICAvLyAgIG5hZGEhXG4gICAsICAgZW1wdHlTdHJpbmcgICAgICAgICAgICAgICAgICAgICAgICAgPSBqc29uUGF0aENsYXVzZSgvJC8pICAgICAgICAgICAgICAgICAgICAgXG4gICBcbiAgIDtcbiAgIFxuICBcbiAgIC8qIFdlIGV4cG9ydCBvbmx5IGEgc2luZ2xlIGZ1bmN0aW9uLiBXaGVuIGNhbGxlZCwgdGhpcyBmdW5jdGlvbiBpbmplY3RzIFxuICAgICAgaW50byBhbm90aGVyIGZ1bmN0aW9uIHRoZSBkZXNjcmlwdG9ycyBmcm9tIGFib3ZlLiAgICAgICAgICAgICBcbiAgICAqL1xuICAgcmV0dXJuIGZ1bmN0aW9uIChmbil7ICAgICAgXG4gICAgICByZXR1cm4gZm4oICAgICAgXG4gICAgICAgICBsYXp5VW5pb24oXG4gICAgICAgICAgICBqc29uUGF0aE5hbWVkTm9kZUluT2JqZWN0Tm90YXRpb25cbiAgICAgICAgICwgIGpzb25QYXRoTmFtZWROb2RlSW5BcnJheU5vdGF0aW9uXG4gICAgICAgICAsICBqc29uUGF0aE51bWJlcmVkTm9kZUluQXJyYXlOb3RhdGlvblxuICAgICAgICAgLCAganNvblBhdGhQdXJlRHVja1R5cGluZyBcbiAgICAgICAgIClcbiAgICAgICwgIGpzb25QYXRoRG91YmxlRG90XG4gICAgICAsICBqc29uUGF0aERvdFxuICAgICAgLCAganNvblBhdGhCYW5nXG4gICAgICAsICBlbXB0eVN0cmluZyBcbiAgICAgICk7XG4gICB9OyBcblxufSgpKTtcbi8qKlxuICogR2V0IGEgbmV3IGtleS0+bm9kZSBtYXBwaW5nXG4gKiBcbiAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0ga2V5XG4gKiBAcGFyYW0ge09iamVjdHxBcnJheXxTdHJpbmd8TnVtYmVyfG51bGx9IG5vZGUgYSB2YWx1ZSBmb3VuZCBpbiB0aGUganNvblxuICovXG5mdW5jdGlvbiBuYW1lZE5vZGUoa2V5LCBub2RlKSB7XG4gICByZXR1cm4ge2tleTprZXksIG5vZGU6bm9kZX07XG59XG5cbi8qKiBnZXQgdGhlIGtleSBvZiBhIG5hbWVkTm9kZSAqL1xudmFyIGtleU9mID0gYXR0cigna2V5Jyk7XG5cbi8qKiBnZXQgdGhlIG5vZGUgZnJvbSBhIG5hbWVkTm9kZSAqL1xudmFyIG5vZGVPZiA9IGF0dHIoJ25vZGUnKTtcbi8qKiBcbiAqIFRoaXMgZmlsZSBwcm92aWRlcyB2YXJpb3VzIGxpc3RlbmVycyB3aGljaCBjYW4gYmUgdXNlZCB0byBidWlsZCB1cFxuICogYSBjaGFuZ2luZyBhc2NlbnQgYmFzZWQgb24gdGhlIGNhbGxiYWNrcyBwcm92aWRlZCBieSBDbGFyaW5ldC4gSXQgbGlzdGVuc1xuICogdG8gdGhlIGxvdy1sZXZlbCBldmVudHMgZnJvbSBDbGFyaW5ldCBhbmQgZW1pdHMgaGlnaGVyLWxldmVsIG9uZXMuXG4gKiAgXG4gKiBUaGUgYnVpbGRpbmcgdXAgaXMgc3RhdGVsZXNzIHNvIHRvIHRyYWNrIGEgSlNPTiBmaWxlXG4gKiBhc2NlbnRNYW5hZ2VyLmpzIGlzIHJlcXVpcmVkIHRvIHN0b3JlIHRoZSBhc2NlbnQgc3RhdGVcbiAqIGJldHdlZW4gY2FsbHMuXG4gKi9cblxuXG5cbi8qKiBcbiAqIEEgc3BlY2lhbCB2YWx1ZSB0byB1c2UgaW4gdGhlIHBhdGggbGlzdCB0byByZXByZXNlbnQgdGhlIHBhdGggJ3RvJyBhIHJvb3QgXG4gKiBvYmplY3QgKHdoaWNoIGRvZXNuJ3QgcmVhbGx5IGhhdmUgYW55IHBhdGgpLiBUaGlzIHByZXZlbnRzIHRoZSBuZWVkIGZvciBcbiAqIHNwZWNpYWwtY2FzaW5nIGRldGVjdGlvbiBvZiB0aGUgcm9vdCBvYmplY3QgYW5kIGFsbG93cyBpdCB0byBiZSB0cmVhdGVkIFxuICogbGlrZSBhbnkgb3RoZXIgb2JqZWN0LiBXZSBtaWdodCB0aGluayBvZiB0aGlzIGFzIGJlaW5nIHNpbWlsYXIgdG8gdGhlIFxuICogJ3VubmFtZWQgcm9vdCcgZG9tYWluIFwiLlwiLCBlZyBpZiBJIGdvIHRvIFxuICogaHR0cDovL2VuLndpa2lwZWRpYS5vcmcuL3dpa2kvRW4vTWFpbl9wYWdlIHRoZSBkb3QgYWZ0ZXIgJ29yZycgZGVsaW1pbmF0ZXMgXG4gKiB0aGUgdW5uYW1lZCByb290IG9mIHRoZSBETlMuXG4gKiBcbiAqIFRoaXMgaXMga2VwdCBhcyBhbiBvYmplY3QgdG8gdGFrZSBhZHZhbnRhZ2UgdGhhdCBpbiBKYXZhc2NyaXB0J3MgT08gb2JqZWN0cyBcbiAqIGFyZSBndWFyYW50ZWVkIHRvIGJlIGRpc3RpbmN0LCB0aGVyZWZvcmUgbm8gb3RoZXIgb2JqZWN0IGNhbiBwb3NzaWJseSBjbGFzaCBcbiAqIHdpdGggdGhpcyBvbmUuIFN0cmluZ3MsIG51bWJlcnMgZXRjIHByb3ZpZGUgbm8gc3VjaCBndWFyYW50ZWUuIFxuICoqL1xudmFyIFJPT1RfUEFUSCA9IHt9O1xuXG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IHNldCBvZiBoYW5kbGVycyBmb3IgY2xhcmluZXQncyBldmVudHMsIGJvdW5kIHRvIHRoZSBlbWl0IFxuICogZnVuY3Rpb24gZ2l2ZW4uICBcbiAqLyBcbmZ1bmN0aW9uIGluY3JlbWVudGFsQ29udGVudEJ1aWxkZXIoIG9ib2VCdXMgKSB7XG5cbiAgIHZhciBlbWl0Tm9kZU9wZW5lZCA9IG9ib2VCdXMoTk9ERV9PUEVORUQpLmVtaXQsXG4gICAgICAgZW1pdE5vZGVDbG9zZWQgPSBvYm9lQnVzKE5PREVfQ0xPU0VEKS5lbWl0LFxuICAgICAgIGVtaXRSb290T3BlbmVkID0gb2JvZUJ1cyhST09UX1BBVEhfRk9VTkQpLmVtaXQsXG4gICAgICAgZW1pdFJvb3RDbG9zZWQgPSBvYm9lQnVzKFJPT1RfTk9ERV9GT1VORCkuZW1pdDtcblxuICAgZnVuY3Rpb24gYXJyYXlJbmRpY2VzQXJlS2V5cyggcG9zc2libHlJbmNvbnNpc3RlbnRBc2NlbnQsIG5ld0RlZXBlc3ROb2RlKSB7XG4gICBcbiAgICAgIC8qIGZvciB2YWx1ZXMgaW4gYXJyYXlzIHdlIGFyZW4ndCBwcmUtd2FybmVkIG9mIHRoZSBjb21pbmcgcGF0aHMgXG4gICAgICAgICAoQ2xhcmluZXQgZ2l2ZXMgbm8gY2FsbCB0byBvbmtleSBsaWtlIGl0IGRvZXMgZm9yIHZhbHVlcyBpbiBvYmplY3RzKSBcbiAgICAgICAgIHNvIGlmIHdlIGFyZSBpbiBhbiBhcnJheSB3ZSBuZWVkIHRvIGNyZWF0ZSB0aGlzIHBhdGggb3Vyc2VsdmVzLiBUaGUgXG4gICAgICAgICBrZXkgd2lsbCBiZSBsZW4ocGFyZW50Tm9kZSkgYmVjYXVzZSBhcnJheSBrZXlzIGFyZSBhbHdheXMgc2VxdWVudGlhbCBcbiAgICAgICAgIG51bWJlcnMuICovXG5cbiAgICAgIHZhciBwYXJlbnROb2RlID0gbm9kZU9mKCBoZWFkKCBwb3NzaWJseUluY29uc2lzdGVudEFzY2VudCkpO1xuICAgICAgXG4gICAgICByZXR1cm4gICAgICBpc09mVHlwZSggQXJyYXksIHBhcmVudE5vZGUpXG4gICAgICAgICAgICAgICA/XG4gICAgICAgICAgICAgICAgICBrZXlGb3VuZCggIHBvc3NpYmx5SW5jb25zaXN0ZW50QXNjZW50LCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlbihwYXJlbnROb2RlKSwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdEZWVwZXN0Tm9kZVxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgOiAgXG4gICAgICAgICAgICAgICAgICAvLyBub3RoaW5nIG5lZWRlZCwgcmV0dXJuIHVuY2hhbmdlZFxuICAgICAgICAgICAgICAgICAgcG9zc2libHlJbmNvbnNpc3RlbnRBc2NlbnQgXG4gICAgICAgICAgICAgICA7XG4gICB9XG4gICAgICAgICAgICAgICAgIFxuICAgZnVuY3Rpb24gbm9kZU9wZW5lZCggYXNjZW50LCBuZXdEZWVwZXN0Tm9kZSApIHtcbiAgICAgIFxuICAgICAgaWYoICFhc2NlbnQgKSB7XG4gICAgICAgICAvLyB3ZSBkaXNjb3ZlcmVkIHRoZSByb290IG5vZGUsICAgICAgICAgXG4gICAgICAgICBlbWl0Um9vdE9wZW5lZCggbmV3RGVlcGVzdE5vZGUpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgIHJldHVybiBrZXlGb3VuZCggYXNjZW50LCBST09UX1BBVEgsIG5ld0RlZXBlc3ROb2RlKTsgICAgICAgICBcbiAgICAgIH1cblxuICAgICAgLy8gd2UgZGlzY292ZXJlZCBhIG5vbi1yb290IG5vZGVcbiAgICAgICAgICAgICAgICAgXG4gICAgICB2YXIgYXJyYXlDb25zaXN0ZW50QXNjZW50ICA9IGFycmF5SW5kaWNlc0FyZUtleXMoIGFzY2VudCwgbmV3RGVlcGVzdE5vZGUpLCAgICAgIFxuICAgICAgICAgIGFuY2VzdG9yQnJhbmNoZXMgICAgICAgPSB0YWlsKCBhcnJheUNvbnNpc3RlbnRBc2NlbnQpLFxuICAgICAgICAgIHByZXZpb3VzbHlVbm1hcHBlZE5hbWUgPSBrZXlPZiggaGVhZCggYXJyYXlDb25zaXN0ZW50QXNjZW50KSk7XG4gICAgICAgICAgXG4gICAgICBhcHBlbmRCdWlsdENvbnRlbnQoIFxuICAgICAgICAgYW5jZXN0b3JCcmFuY2hlcywgXG4gICAgICAgICBwcmV2aW91c2x5VW5tYXBwZWROYW1lLCBcbiAgICAgICAgIG5ld0RlZXBlc3ROb2RlIFxuICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgcmV0dXJuIGNvbnMoIFxuICAgICAgICAgICAgICAgbmFtZWROb2RlKCBwcmV2aW91c2x5VW5tYXBwZWROYW1lLCBuZXdEZWVwZXN0Tm9kZSApLCBcbiAgICAgICAgICAgICAgIGFuY2VzdG9yQnJhbmNoZXNcbiAgICAgICk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgIH1cblxuXG4gICAvKipcbiAgICAqIEFkZCBhIG5ldyB2YWx1ZSB0byB0aGUgb2JqZWN0IHdlIGFyZSBidWlsZGluZyB1cCB0byByZXByZXNlbnQgdGhlXG4gICAgKiBwYXJzZWQgSlNPTlxuICAgICovXG4gICBmdW5jdGlvbiBhcHBlbmRCdWlsdENvbnRlbnQoIGFuY2VzdG9yQnJhbmNoZXMsIGtleSwgbm9kZSApe1xuICAgICBcbiAgICAgIG5vZGVPZiggaGVhZCggYW5jZXN0b3JCcmFuY2hlcykpW2tleV0gPSBub2RlO1xuICAgfVxuXG4gICAgIFxuICAgLyoqXG4gICAgKiBGb3Igd2hlbiB3ZSBmaW5kIGEgbmV3IGtleSBpbiB0aGUganNvbi5cbiAgICAqIFxuICAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfE9iamVjdH0gbmV3RGVlcGVzdE5hbWUgdGhlIGtleS4gSWYgd2UgYXJlIGluIGFuIFxuICAgICogICAgYXJyYXkgd2lsbCBiZSBhIG51bWJlciwgb3RoZXJ3aXNlIGEgc3RyaW5nLiBNYXkgdGFrZSB0aGUgc3BlY2lhbCBcbiAgICAqICAgIHZhbHVlIFJPT1RfUEFUSCBpZiB0aGUgcm9vdCBub2RlIGhhcyBqdXN0IGJlZW4gZm91bmRcbiAgICAqICAgIFxuICAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfE9iamVjdHxBcnJheXxOdWxsfHVuZGVmaW5lZH0gW21heWJlTmV3RGVlcGVzdE5vZGVdIFxuICAgICogICAgdXN1YWxseSB0aGlzIHdvbid0IGJlIGtub3duIHNvIGNhbiBiZSB1bmRlZmluZWQuIENhbid0IHVzZSBudWxsIFxuICAgICogICAgdG8gcmVwcmVzZW50IHVua25vd24gYmVjYXVzZSBudWxsIGlzIGEgdmFsaWQgdmFsdWUgaW4gSlNPTlxuICAgICoqLyAgXG4gICBmdW5jdGlvbiBrZXlGb3VuZChhc2NlbnQsIG5ld0RlZXBlc3ROYW1lLCBtYXliZU5ld0RlZXBlc3ROb2RlKSB7XG5cbiAgICAgIGlmKCBhc2NlbnQgKSB7IC8vIGlmIG5vdCByb290XG4gICAgICBcbiAgICAgICAgIC8vIElmIHdlIGhhdmUgdGhlIGtleSBidXQgKHVubGVzcyBhZGRpbmcgdG8gYW4gYXJyYXkpIG5vIGtub3duIHZhbHVlXG4gICAgICAgICAvLyB5ZXQuIFB1dCB0aGF0IGtleSBpbiB0aGUgb3V0cHV0IGJ1dCBhZ2FpbnN0IG5vIGRlZmluZWQgdmFsdWU6ICAgICAgXG4gICAgICAgICBhcHBlbmRCdWlsdENvbnRlbnQoIGFzY2VudCwgbmV3RGVlcGVzdE5hbWUsIG1heWJlTmV3RGVlcGVzdE5vZGUgKTtcbiAgICAgIH1cbiAgIFxuICAgICAgdmFyIGFzY2VudFdpdGhOZXdQYXRoID0gY29ucyggXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lZE5vZGUoIG5ld0RlZXBlc3ROYW1lLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF5YmVOZXdEZWVwZXN0Tm9kZSksIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNjZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICBlbWl0Tm9kZU9wZW5lZCggYXNjZW50V2l0aE5ld1BhdGgpO1xuIFxuICAgICAgcmV0dXJuIGFzY2VudFdpdGhOZXdQYXRoO1xuICAgfVxuXG5cbiAgIC8qKlxuICAgICogRm9yIHdoZW4gdGhlIGN1cnJlbnQgbm9kZSBlbmRzLlxuICAgICovXG4gICBmdW5jdGlvbiBub2RlQ2xvc2VkKCBhc2NlbnQgKSB7XG5cbiAgICAgIGVtaXROb2RlQ2xvc2VkKCBhc2NlbnQpO1xuICAgICAgIFxuICAgICAgcmV0dXJuIHRhaWwoIGFzY2VudCkgfHxcbiAgICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gbm9kZXMgbGVmdCBpbiB0aGUgYXNjZW50IHRoZSByb290IG5vZGVcbiAgICAgICAgICAgICAvLyBqdXN0IGNsb3NlZC4gRW1pdCBhIHNwZWNpYWwgZXZlbnQgZm9yIHRoaXM6IFxuICAgICAgICAgICAgIGVtaXRSb290Q2xvc2VkKG5vZGVPZihoZWFkKGFzY2VudCkpKTtcbiAgIH0gICAgICBcblxuICAgdmFyIGNvbnRlbnRCdWlsZGVySGFuZGxlcnMgPSB7fTtcbiAgIGNvbnRlbnRCdWlsZGVySGFuZGxlcnNbU0FYX1ZBTFVFX09QRU5dID0gbm9kZU9wZW5lZDtcbiAgIGNvbnRlbnRCdWlsZGVySGFuZGxlcnNbU0FYX1ZBTFVFX0NMT1NFXSA9IG5vZGVDbG9zZWQ7XG4gICBjb250ZW50QnVpbGRlckhhbmRsZXJzW1NBWF9LRVldID0ga2V5Rm91bmQ7XG4gICByZXR1cm4gY29udGVudEJ1aWxkZXJIYW5kbGVycztcbn1cblxuLyoqXG4gKiBUaGUganNvblBhdGggZXZhbHVhdG9yIGNvbXBpbGVyIHVzZWQgZm9yIE9ib2UuanMuIFxuICogXG4gKiBPbmUgZnVuY3Rpb24gaXMgZXhwb3NlZC4gVGhpcyBmdW5jdGlvbiB0YWtlcyBhIFN0cmluZyBKU09OUGF0aCBzcGVjIGFuZCBcbiAqIHJldHVybnMgYSBmdW5jdGlvbiB0byB0ZXN0IGNhbmRpZGF0ZSBhc2NlbnRzIGZvciBtYXRjaGVzLlxuICogXG4gKiAgU3RyaW5nIGpzb25QYXRoIC0+IChMaXN0IGFzY2VudCkgLT4gQm9vbGVhbnxPYmplY3RcbiAqXG4gKiBUaGlzIGZpbGUgaXMgY29kZWQgaW4gYSBwdXJlIGZ1bmN0aW9uYWwgc3R5bGUuIFRoYXQgaXMsIG5vIGZ1bmN0aW9uIGhhcyBcbiAqIHNpZGUgZWZmZWN0cywgZXZlcnkgZnVuY3Rpb24gZXZhbHVhdGVzIHRvIHRoZSBzYW1lIHZhbHVlIGZvciB0aGUgc2FtZSBcbiAqIGFyZ3VtZW50cyBhbmQgbm8gdmFyaWFibGVzIGFyZSByZWFzc2lnbmVkLlxuICovICBcbi8vIHRoZSBjYWxsIHRvIGpzb25QYXRoU3ludGF4IGluamVjdHMgdGhlIHRva2VuIHN5bnRheGVzIHRoYXQgYXJlIG5lZWRlZCBcbi8vIGluc2lkZSB0aGUgY29tcGlsZXJcbnZhciBqc29uUGF0aENvbXBpbGVyID0ganNvblBhdGhTeW50YXgoZnVuY3Rpb24gKHBhdGhOb2RlU3ludGF4LCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvdWJsZURvdFN5bnRheCwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb3RTeW50YXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYW5nU3ludGF4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW1wdHlTeW50YXggKSB7XG5cbiAgIHZhciBDQVBUVVJJTkdfSU5ERVggPSAxO1xuICAgdmFyIE5BTUVfSU5ERVggPSAyO1xuICAgdmFyIEZJRUxEX0xJU1RfSU5ERVggPSAzO1xuXG4gICB2YXIgaGVhZEtleSAgPSBjb21wb3NlMihrZXlPZiwgaGVhZCksXG4gICAgICAgaGVhZE5vZGUgPSBjb21wb3NlMihub2RlT2YsIGhlYWQpO1xuICAgICAgICAgICAgICAgICAgIFxuICAgLyoqXG4gICAgKiBDcmVhdGUgYW4gZXZhbHVhdG9yIGZ1bmN0aW9uIGZvciBhIG5hbWVkIHBhdGggbm9kZSwgZXhwcmVzc2VkIGluIHRoZVxuICAgICogSlNPTlBhdGggbGlrZTpcbiAgICAqICAgIGZvb1xuICAgICogICAgW1wiYmFyXCJdXG4gICAgKiAgICBbMl0gICBcbiAgICAqL1xuICAgZnVuY3Rpb24gbmFtZUNsYXVzZShwcmV2aW91c0V4cHIsIGRldGVjdGlvbiApIHtcbiAgICAgXG4gICAgICB2YXIgbmFtZSA9IGRldGVjdGlvbltOQU1FX0lOREVYXSxcbiAgICAgICAgICAgIFxuICAgICAgICAgIG1hdGNoZXNOYW1lID0gKCAhbmFtZSB8fCBuYW1lID09ICcqJyApIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAgYWx3YXlzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA6ICBmdW5jdGlvbihhc2NlbnQpe3JldHVybiBoZWFkS2V5KGFzY2VudCkgPT0gbmFtZX07XG4gICAgIFxuXG4gICAgICByZXR1cm4gbGF6eUludGVyc2VjdGlvbihtYXRjaGVzTmFtZSwgcHJldmlvdXNFeHByKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBDcmVhdGUgYW4gZXZhbHVhdG9yIGZ1bmN0aW9uIGZvciBhIGEgZHVjay10eXBlZCBub2RlLCBleHByZXNzZWQgbGlrZTpcbiAgICAqIFxuICAgICogICAge3NwaW4sIHRhc3RlLCBjb2xvdXJ9XG4gICAgKiAgICAucGFydGljbGV7c3BpbiwgdGFzdGUsIGNvbG91cn1cbiAgICAqICAgICp7c3BpbiwgdGFzdGUsIGNvbG91cn1cbiAgICAqL1xuICAgZnVuY3Rpb24gZHVja1R5cGVDbGF1c2UocHJldmlvdXNFeHByLCBkZXRlY3Rpb24pIHtcblxuICAgICAgdmFyIGZpZWxkTGlzdFN0ciA9IGRldGVjdGlvbltGSUVMRF9MSVNUX0lOREVYXTtcblxuICAgICAgaWYgKCFmaWVsZExpc3RTdHIpIFxuICAgICAgICAgcmV0dXJuIHByZXZpb3VzRXhwcjsgLy8gZG9uJ3Qgd3JhcCBhdCBhbGwsIHJldHVybiBnaXZlbiBleHByIGFzLWlzICAgICAgXG5cbiAgICAgIHZhciBoYXNBbGxyZXF1aXJlZEZpZWxkcyA9IHBhcnRpYWxDb21wbGV0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc0FsbFByb3BlcnRpZXMsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyYXlBc0xpc3QoZmllbGRMaXN0U3RyLnNwbGl0KC9cXFcrLykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgaXNNYXRjaCA9ICBjb21wb3NlMiggXG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNBbGxyZXF1aXJlZEZpZWxkcywgXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkTm9kZVxuICAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgcmV0dXJuIGxhenlJbnRlcnNlY3Rpb24oaXNNYXRjaCwgcHJldmlvdXNFeHByKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBFeHByZXNzaW9uIGZvciAkLCByZXR1cm5zIHRoZSBldmFsdWF0b3IgZnVuY3Rpb25cbiAgICAqL1xuICAgZnVuY3Rpb24gY2FwdHVyZSggcHJldmlvdXNFeHByLCBkZXRlY3Rpb24gKSB7XG5cbiAgICAgIC8vIGV4dHJhY3QgbWVhbmluZyBmcm9tIHRoZSBkZXRlY3Rpb24gICAgICBcbiAgICAgIHZhciBjYXB0dXJpbmcgPSAhIWRldGVjdGlvbltDQVBUVVJJTkdfSU5ERVhdO1xuXG4gICAgICBpZiAoIWNhcHR1cmluZykgICAgICAgICAgXG4gICAgICAgICByZXR1cm4gcHJldmlvdXNFeHByOyAvLyBkb24ndCB3cmFwIGF0IGFsbCwgcmV0dXJuIGdpdmVuIGV4cHIgYXMtaXMgICAgICBcbiAgICAgIFxuICAgICAgcmV0dXJuIGxhenlJbnRlcnNlY3Rpb24ocHJldmlvdXNFeHByLCBoZWFkKTtcbiAgICAgICAgICAgIFxuICAgfSAgICAgICAgICAgIFxuICAgICAgXG4gICAvKipcbiAgICAqIENyZWF0ZSBhbiBldmFsdWF0b3IgZnVuY3Rpb24gdGhhdCBtb3ZlcyBvbnRvIHRoZSBuZXh0IGl0ZW0gb24gdGhlIFxuICAgICogbGlzdHMuIFRoaXMgZnVuY3Rpb24gaXMgdGhlIHBsYWNlIHdoZXJlIHRoZSBsb2dpYyB0byBtb3ZlIHVwIGEgXG4gICAgKiBsZXZlbCBpbiB0aGUgYXNjZW50IGV4aXN0cy4gXG4gICAgKiBcbiAgICAqIEVnLCBmb3IgSlNPTlBhdGggXCIuZm9vXCIgd2UgbmVlZCBza2lwMShuYW1lQ2xhdXNlKGFsd2F5cywgWywnZm9vJ10pKVxuICAgICovXG4gICBmdW5jdGlvbiBza2lwMShwcmV2aW91c0V4cHIpIHtcbiAgIFxuICAgXG4gICAgICBpZiggcHJldmlvdXNFeHByID09IGFsd2F5cyApIHtcbiAgICAgICAgIC8qIElmIHRoZXJlIGlzIG5vIHByZXZpb3VzIGV4cHJlc3Npb24gdGhpcyBjb25zdW1lIGNvbW1hbmQgXG4gICAgICAgICAgICBpcyBhdCB0aGUgc3RhcnQgb2YgdGhlIGpzb25QYXRoLlxuICAgICAgICAgICAgU2luY2UgSlNPTlBhdGggc3BlY2lmaWVzIHdoYXQgd2UnZCBsaWtlIHRvIGZpbmQgYnV0IG5vdCBcbiAgICAgICAgICAgIG5lY2Vzc2FyaWx5IGV2ZXJ5dGhpbmcgbGVhZGluZyBkb3duIHRvIGl0LCB3aGVuIHJ1bm5pbmdcbiAgICAgICAgICAgIG91dCBvZiBKU09OUGF0aCB0byBjaGVjayBhZ2FpbnN0IHdlIGRlZmF1bHQgdG8gdHJ1ZSAqL1xuICAgICAgICAgcmV0dXJuIGFsd2F5cztcbiAgICAgIH1cblxuICAgICAgLyoqIHJldHVybiB0cnVlIGlmIHRoZSBhc2NlbnQgd2UgaGF2ZSBjb250YWlucyBvbmx5IHRoZSBKU09OIHJvb3QsXG4gICAgICAgKiAgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIG5vdEF0Um9vdChhc2NlbnQpe1xuICAgICAgICAgcmV0dXJuIGhlYWRLZXkoYXNjZW50KSAhPSBST09UX1BBVEg7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHJldHVybiBsYXp5SW50ZXJzZWN0aW9uKFxuICAgICAgICAgICAgICAgLyogSWYgd2UncmUgYWxyZWFkeSBhdCB0aGUgcm9vdCBidXQgdGhlcmUgYXJlIG1vcmUgXG4gICAgICAgICAgICAgICAgICBleHByZXNzaW9ucyB0byBzYXRpc2Z5LCBjYW4ndCBjb25zdW1lIGFueSBtb3JlLiBObyBtYXRjaC5cblxuICAgICAgICAgICAgICAgICAgVGhpcyBjaGVjayBpcyB3aHkgbm9uZSBvZiB0aGUgb3RoZXIgZXhwcnMgaGF2ZSB0byBiZSBhYmxlIFxuICAgICAgICAgICAgICAgICAgdG8gaGFuZGxlIGVtcHR5IGxpc3RzOyBza2lwMSBpcyB0aGUgb25seSBldmFsdWF0b3IgdGhhdCBcbiAgICAgICAgICAgICAgICAgIG1vdmVzIG9udG8gdGhlIG5leHQgdG9rZW4gYW5kIGl0IHJlZnVzZXMgdG8gZG8gc28gb25jZSBpdCBcbiAgICAgICAgICAgICAgICAgIHJlYWNoZXMgdGhlIGxhc3QgaXRlbSBpbiB0aGUgbGlzdC4gKi9cbiAgICAgICAgICAgICAgIG5vdEF0Um9vdCxcbiAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgLyogV2UgYXJlIG5vdCBhdCB0aGUgcm9vdCBvZiB0aGUgYXNjZW50IHlldC5cbiAgICAgICAgICAgICAgICAgIE1vdmUgdG8gdGhlIG5leHQgbGV2ZWwgb2YgdGhlIGFzY2VudCBieSBoYW5kaW5nIG9ubHkgXG4gICAgICAgICAgICAgICAgICB0aGUgdGFpbCB0byB0aGUgcHJldmlvdXMgZXhwcmVzc2lvbiAqLyBcbiAgICAgICAgICAgICAgIGNvbXBvc2UyKHByZXZpb3VzRXhwciwgdGFpbCkgXG4gICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICB9ICAgXG4gICBcbiAgIC8qKlxuICAgICogQ3JlYXRlIGFuIGV2YWx1YXRvciBmdW5jdGlvbiBmb3IgdGhlIC4uIChkb3VibGUgZG90KSB0b2tlbi4gQ29uc3VtZXNcbiAgICAqIHplcm8gb3IgbW9yZSBsZXZlbHMgb2YgdGhlIGFzY2VudCwgdGhlIGZld2VzdCB0aGF0IGFyZSByZXF1aXJlZCB0byBmaW5kXG4gICAgKiBhIG1hdGNoIHdoZW4gZ2l2ZW4gdG8gcHJldmlvdXNFeHByLlxuICAgICovICAgXG4gICBmdW5jdGlvbiBza2lwTWFueShwcmV2aW91c0V4cHIpIHtcblxuICAgICAgaWYoIHByZXZpb3VzRXhwciA9PSBhbHdheXMgKSB7XG4gICAgICAgICAvKiBJZiB0aGVyZSBpcyBubyBwcmV2aW91cyBleHByZXNzaW9uIHRoaXMgY29uc3VtZSBjb21tYW5kIFxuICAgICAgICAgICAgaXMgYXQgdGhlIHN0YXJ0IG9mIHRoZSBqc29uUGF0aC5cbiAgICAgICAgICAgIFNpbmNlIEpTT05QYXRoIHNwZWNpZmllcyB3aGF0IHdlJ2QgbGlrZSB0byBmaW5kIGJ1dCBub3QgXG4gICAgICAgICAgICBuZWNlc3NhcmlseSBldmVyeXRoaW5nIGxlYWRpbmcgZG93biB0byBpdCwgd2hlbiBydW5uaW5nXG4gICAgICAgICAgICBvdXQgb2YgSlNPTlBhdGggdG8gY2hlY2sgYWdhaW5zdCB3ZSBkZWZhdWx0IHRvIHRydWUgKi8gICAgICAgICAgICBcbiAgICAgICAgIHJldHVybiBhbHdheXM7XG4gICAgICB9XG4gICAgICAgICAgXG4gICAgICB2YXIgXG4gICAgICAgICAgLy8gSW4gSlNPTlBhdGggLi4gaXMgZXF1aXZhbGVudCB0byAhLi4gc28gaWYgLi4gcmVhY2hlcyB0aGUgcm9vdFxuICAgICAgICAgIC8vIHRoZSBtYXRjaCBoYXMgc3VjY2VlZGVkLiBJZSwgd2UgbWlnaHQgd3JpdGUgLi5mb28gb3IgIS4uZm9vXG4gICAgICAgICAgLy8gYW5kIGJvdGggc2hvdWxkIG1hdGNoIGlkZW50aWNhbGx5LlxuICAgICAgICAgIHRlcm1pbmFsQ2FzZVdoZW5BcnJpdmluZ0F0Um9vdCA9IHJvb3RFeHByKCksXG4gICAgICAgICAgdGVybWluYWxDYXNlV2hlblByZXZpb3VzRXhwcmVzc2lvbklzU2F0aXNmaWVkID0gcHJldmlvdXNFeHByLFxuICAgICAgICAgIHJlY3Vyc2l2ZUNhc2UgPSBza2lwMShmdW5jdGlvbihhc2NlbnQpIHtcbiAgICAgICAgICAgICByZXR1cm4gY2FzZXMoYXNjZW50KTtcbiAgICAgICAgICB9KSxcblxuICAgICAgICAgIGNhc2VzID0gbGF6eVVuaW9uKFxuICAgICAgICAgICAgICAgICAgICAgdGVybWluYWxDYXNlV2hlbkFycml2aW5nQXRSb290XG4gICAgICAgICAgICAgICAgICAsICB0ZXJtaW5hbENhc2VXaGVuUHJldmlvdXNFeHByZXNzaW9uSXNTYXRpc2ZpZWRcbiAgICAgICAgICAgICAgICAgICwgIHJlY3Vyc2l2ZUNhc2UgIFxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgIFxuICAgICAgcmV0dXJuIGNhc2VzO1xuICAgfSAgICAgIFxuICAgXG4gICAvKipcbiAgICAqIEdlbmVyYXRlIGFuIGV2YWx1YXRvciBmb3IgISAtIG1hdGNoZXMgb25seSB0aGUgcm9vdCBlbGVtZW50IG9mIHRoZSBqc29uXG4gICAgKiBhbmQgaWdub3JlcyBhbnkgcHJldmlvdXMgZXhwcmVzc2lvbnMgc2luY2Ugbm90aGluZyBtYXkgcHJlY2VkZSAhLiBcbiAgICAqLyAgIFxuICAgZnVuY3Rpb24gcm9vdEV4cHIoKSB7XG4gICAgICBcbiAgICAgIHJldHVybiBmdW5jdGlvbihhc2NlbnQpe1xuICAgICAgICAgcmV0dXJuIGhlYWRLZXkoYXNjZW50KSA9PSBST09UX1BBVEg7XG4gICAgICB9O1xuICAgfSAgIFxuICAgICAgICAgXG4gICAvKipcbiAgICAqIEdlbmVyYXRlIGEgc3RhdGVtZW50IHdyYXBwZXIgdG8gc2l0IGFyb3VuZCB0aGUgb3V0ZXJtb3N0IFxuICAgICogY2xhdXNlIGV2YWx1YXRvci5cbiAgICAqIFxuICAgICogSGFuZGxlcyB0aGUgY2FzZSB3aGVyZSB0aGUgY2FwdHVyaW5nIGlzIGltcGxpY2l0IGJlY2F1c2UgdGhlIEpTT05QYXRoXG4gICAgKiBkaWQgbm90IGNvbnRhaW4gYSAnJCcgYnkgcmV0dXJuaW5nIHRoZSBsYXN0IG5vZGUuXG4gICAgKi8gICBcbiAgIGZ1bmN0aW9uIHN0YXRlbWVudEV4cHIobGFzdENsYXVzZSkge1xuICAgICAgXG4gICAgICByZXR1cm4gZnVuY3Rpb24oYXNjZW50KSB7XG4gICBcbiAgICAgICAgIC8vIGtpY2sgb2ZmIHRoZSBldmFsdWF0aW9uIGJ5IHBhc3NpbmcgdGhyb3VnaCB0byB0aGUgbGFzdCBjbGF1c2VcbiAgICAgICAgIHZhciBleHByTWF0Y2ggPSBsYXN0Q2xhdXNlKGFzY2VudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgcmV0dXJuIGV4cHJNYXRjaCA9PT0gdHJ1ZSA/IGhlYWQoYXNjZW50KSA6IGV4cHJNYXRjaDtcbiAgICAgIH07XG4gICB9ICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgLyoqXG4gICAgKiBGb3Igd2hlbiBhIHRva2VuIGhhcyBiZWVuIGZvdW5kIGluIHRoZSBKU09OUGF0aCBpbnB1dC5cbiAgICAqIENvbXBpbGVzIHRoZSBwYXJzZXIgZm9yIHRoYXQgdG9rZW4gYW5kIHJldHVybnMgaW4gY29tYmluYXRpb24gd2l0aCB0aGVcbiAgICAqIHBhcnNlciBhbHJlYWR5IGdlbmVyYXRlZC5cbiAgICAqIFxuICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZXhwcnMgIGEgbGlzdCBvZiB0aGUgY2xhdXNlIGV2YWx1YXRvciBnZW5lcmF0b3JzIGZvclxuICAgICogICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSB0b2tlbiB0aGF0IHdhcyBmb3VuZFxuICAgICogQHBhcmFtIHtGdW5jdGlvbn0gcGFyc2VyR2VuZXJhdGVkU29GYXIgdGhlIHBhcnNlciBhbHJlYWR5IGZvdW5kXG4gICAgKiBAcGFyYW0ge0FycmF5fSBkZXRlY3Rpb24gdGhlIG1hdGNoIGdpdmVuIGJ5IHRoZSByZWdleCBlbmdpbmUgd2hlbiBcbiAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgZmVhdHVyZSB3YXMgZm91bmRcbiAgICAqL1xuICAgZnVuY3Rpb24gZXhwcmVzc2lvbnNSZWFkZXIoIGV4cHJzLCBwYXJzZXJHZW5lcmF0ZWRTb0ZhciwgZGV0ZWN0aW9uICkge1xuICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAvLyBpZiBleHBycyBpcyB6ZXJvLWxlbmd0aCBmb2xkUiB3aWxsIHBhc3MgYmFjayB0aGUgXG4gICAgICAvLyBwYXJzZXJHZW5lcmF0ZWRTb0ZhciBhcy1pcyBzbyB3ZSBkb24ndCBuZWVkIHRvIHRyZWF0IFxuICAgICAgLy8gdGhpcyBhcyBhIHNwZWNpYWwgY2FzZVxuICAgICAgXG4gICAgICByZXR1cm4gICBmb2xkUiggXG4gICAgICAgICAgICAgICAgICBmdW5jdGlvbiggcGFyc2VyR2VuZXJhdGVkU29GYXIsIGV4cHIgKXtcbiAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV4cHIocGFyc2VyR2VuZXJhdGVkU29GYXIsIGRldGVjdGlvbik7XG4gICAgICAgICAgICAgICAgICB9LCBcbiAgICAgICAgICAgICAgICAgIHBhcnNlckdlbmVyYXRlZFNvRmFyLCBcbiAgICAgICAgICAgICAgICAgIGV4cHJzXG4gICAgICAgICAgICAgICApOyAgICAgICAgICAgICAgICAgICAgIFxuXG4gICB9XG5cbiAgIC8qKiBcbiAgICAqICBJZiBqc29uUGF0aCBtYXRjaGVzIHRoZSBnaXZlbiBkZXRlY3RvciBmdW5jdGlvbiwgY3JlYXRlcyBhIGZ1bmN0aW9uIHdoaWNoXG4gICAgKiAgZXZhbHVhdGVzIGFnYWluc3QgZXZlcnkgY2xhdXNlIGluIHRoZSBjbGF1c2VFdmFsdWF0b3JHZW5lcmF0b3JzLiBUaGVcbiAgICAqICBjcmVhdGVkIGZ1bmN0aW9uIGlzIHByb3BhZ2F0ZWQgdG8gdGhlIG9uU3VjY2VzcyBmdW5jdGlvbiwgYWxvbmcgd2l0aFxuICAgICogIHRoZSByZW1haW5pbmcgdW5wYXJzZWQgSlNPTlBhdGggc3Vic3RyaW5nLlxuICAgICogIFxuICAgICogIFRoZSBpbnRlbmRlZCB1c2UgaXMgdG8gY3JlYXRlIGEgY2xhdXNlTWF0Y2hlciBieSBmaWxsaW5nIGluXG4gICAgKiAgdGhlIGZpcnN0IHR3byBhcmd1bWVudHMsIHRodXMgcHJvdmlkaW5nIGEgZnVuY3Rpb24gdGhhdCBrbm93c1xuICAgICogIHNvbWUgc3ludGF4IHRvIG1hdGNoIGFuZCB3aGF0IGtpbmQgb2YgZ2VuZXJhdG9yIHRvIGNyZWF0ZSBpZiBpdFxuICAgICogIGZpbmRzIGl0LiBUaGUgcGFyYW1ldGVyIGxpc3Qgb25jZSBjb21wbGV0ZWQgaXM6XG4gICAgKiAgXG4gICAgKiAgICAoanNvblBhdGgsIHBhcnNlckdlbmVyYXRlZFNvRmFyLCBvblN1Y2Nlc3MpXG4gICAgKiAgXG4gICAgKiAgb25TdWNjZXNzIG1heSBiZSBjb21waWxlSnNvblBhdGhUb0Z1bmN0aW9uLCB0byByZWN1cnNpdmVseSBjb250aW51ZSBcbiAgICAqICBwYXJzaW5nIGFmdGVyIGZpbmRpbmcgYSBtYXRjaCBvciByZXR1cm5Gb3VuZFBhcnNlciB0byBzdG9wIGhlcmUuXG4gICAgKi9cbiAgIGZ1bmN0aW9uIGdlbmVyYXRlQ2xhdXNlUmVhZGVySWZUb2tlbkZvdW5kIChcbiAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbkRldGVjdG9yLCBjbGF1c2VFdmFsdWF0b3JHZW5lcmF0b3JzLFxuICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAganNvblBhdGgsIHBhcnNlckdlbmVyYXRlZFNvRmFyLCBvblN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgdmFyIGRldGVjdGVkID0gdG9rZW5EZXRlY3Rvcihqc29uUGF0aCk7XG5cbiAgICAgIGlmKGRldGVjdGVkKSB7XG4gICAgICAgICB2YXIgY29tcGlsZWRQYXJzZXIgPSBleHByZXNzaW9uc1JlYWRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXVzZUV2YWx1YXRvckdlbmVyYXRvcnMsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VyR2VuZXJhdGVkU29GYXIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGV0ZWN0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICBcbiAgICAgICAgICAgICByZW1haW5pbmdVbnBhcnNlZEpzb25QYXRoID0ganNvblBhdGguc3Vic3RyKGxlbihkZXRlY3RlZFswXSkpOyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgIHJldHVybiBvblN1Y2Nlc3MocmVtYWluaW5nVW5wYXJzZWRKc29uUGF0aCwgY29tcGlsZWRQYXJzZXIpO1xuICAgICAgfSAgICAgICAgIFxuICAgfVxuICAgICAgICAgICAgICAgICBcbiAgIC8qKlxuICAgICogUGFydGlhbGx5IGNvbXBsZXRlcyBnZW5lcmF0ZUNsYXVzZVJlYWRlcklmVG9rZW5Gb3VuZCBhYm92ZS4gXG4gICAgKi9cbiAgIGZ1bmN0aW9uIGNsYXVzZU1hdGNoZXIodG9rZW5EZXRlY3RvciwgZXhwcnMpIHtcbiAgICAgICAgXG4gICAgICByZXR1cm4gICBwYXJ0aWFsQ29tcGxldGUoIFxuICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVDbGF1c2VSZWFkZXJJZlRva2VuRm91bmQsIFxuICAgICAgICAgICAgICAgICAgdG9rZW5EZXRlY3RvciwgXG4gICAgICAgICAgICAgICAgICBleHBycyBcbiAgICAgICAgICAgICAgICk7XG4gICB9XG5cbiAgIC8qKlxuICAgICogY2xhdXNlRm9ySnNvblBhdGggaXMgYSBmdW5jdGlvbiB3aGljaCBhdHRlbXB0cyB0byBtYXRjaCBhZ2FpbnN0IFxuICAgICogc2V2ZXJhbCBjbGF1c2UgbWF0Y2hlcnMgaW4gb3JkZXIgdW50aWwgb25lIG1hdGNoZXMuIElmIG5vbiBtYXRjaCB0aGVcbiAgICAqIGpzb25QYXRoIGV4cHJlc3Npb24gaXMgaW52YWxpZCBhbmQgYW4gZXJyb3IgaXMgdGhyb3duLlxuICAgICogXG4gICAgKiBUaGUgcGFyYW1ldGVyIGxpc3QgaXMgdGhlIHNhbWUgYXMgYSBzaW5nbGUgY2xhdXNlTWF0Y2hlcjpcbiAgICAqIFxuICAgICogICAgKGpzb25QYXRoLCBwYXJzZXJHZW5lcmF0ZWRTb0Zhciwgb25TdWNjZXNzKVxuICAgICovICAgICBcbiAgIHZhciBjbGF1c2VGb3JKc29uUGF0aCA9IGxhenlVbmlvbihcblxuICAgICAgY2xhdXNlTWF0Y2hlcihwYXRoTm9kZVN5bnRheCAgICwgbGlzdCggY2FwdHVyZSwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdWNrVHlwZUNsYXVzZSwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lQ2xhdXNlLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNraXAxICkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgLCAgY2xhdXNlTWF0Y2hlcihkb3VibGVEb3RTeW50YXggICwgbGlzdCggc2tpcE1hbnkpKVxuICAgICAgIFxuICAgICAgIC8vIGRvdCBpcyBhIHNlcGFyYXRvciBvbmx5IChsaWtlIHdoaXRlc3BhY2UgaW4gb3RoZXIgbGFuZ3VhZ2VzKSBidXQgXG4gICAgICAgLy8gcmF0aGVyIHRoYW4gbWFrZSBpdCBhIHNwZWNpYWwgY2FzZSwgdXNlIGFuIGVtcHR5IGxpc3Qgb2YgXG4gICAgICAgLy8gZXhwcmVzc2lvbnMgd2hlbiB0aGlzIHRva2VuIGlzIGZvdW5kXG4gICAsICBjbGF1c2VNYXRjaGVyKGRvdFN5bnRheCAgICAgICAgLCBsaXN0KCkgKSAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgLCAgY2xhdXNlTWF0Y2hlcihiYW5nU3ludGF4ICAgICAgICwgbGlzdCggY2FwdHVyZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RFeHByKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICwgIGNsYXVzZU1hdGNoZXIoZW1wdHlTeW50YXggICAgICAsIGxpc3QoIHN0YXRlbWVudEV4cHIpKVxuICAgXG4gICAsICBmdW5jdGlvbiAoanNvblBhdGgpIHtcbiAgICAgICAgIHRocm93IEVycm9yKCdcIicgKyBqc29uUGF0aCArICdcIiBjb3VsZCBub3QgYmUgdG9rZW5pc2VkJykgICAgICBcbiAgICAgIH1cbiAgICk7XG5cblxuICAgLyoqXG4gICAgKiBPbmUgb2YgdHdvIHBvc3NpYmxlIHZhbHVlcyBmb3IgdGhlIG9uU3VjY2VzcyBhcmd1bWVudCBvZiBcbiAgICAqIGdlbmVyYXRlQ2xhdXNlUmVhZGVySWZUb2tlbkZvdW5kLlxuICAgICogXG4gICAgKiBXaGVuIHRoaXMgZnVuY3Rpb24gaXMgdXNlZCwgZ2VuZXJhdGVDbGF1c2VSZWFkZXJJZlRva2VuRm91bmQgc2ltcGx5IFxuICAgICogcmV0dXJucyB0aGUgY29tcGlsZWRQYXJzZXIgdGhhdCBpdCBtYWRlLCByZWdhcmRsZXNzIG9mIGlmIHRoZXJlIGlzIFxuICAgICogYW55IHJlbWFpbmluZyBqc29uUGF0aCB0byBiZSBjb21waWxlZC5cbiAgICAqL1xuICAgZnVuY3Rpb24gcmV0dXJuRm91bmRQYXJzZXIoX3JlbWFpbmluZ0pzb25QYXRoLCBjb21waWxlZFBhcnNlcil7IFxuICAgICAgcmV0dXJuIGNvbXBpbGVkUGFyc2VyIFxuICAgfSAgICAgXG4gICAgICAgICAgICAgIFxuICAgLyoqXG4gICAgKiBSZWN1cnNpdmVseSBjb21waWxlIGEgSlNPTlBhdGggZXhwcmVzc2lvbi5cbiAgICAqIFxuICAgICogVGhpcyBmdW5jdGlvbiBzZXJ2ZXMgYXMgb25lIG9mIHR3byBwb3NzaWJsZSB2YWx1ZXMgZm9yIHRoZSBvblN1Y2Nlc3MgXG4gICAgKiBhcmd1bWVudCBvZiBnZW5lcmF0ZUNsYXVzZVJlYWRlcklmVG9rZW5Gb3VuZCwgbWVhbmluZyBjb250aW51ZSB0b1xuICAgICogcmVjdXJzaXZlbHkgY29tcGlsZS4gT3RoZXJ3aXNlLCByZXR1cm5Gb3VuZFBhcnNlciBpcyBnaXZlbiBhbmRcbiAgICAqIGNvbXBpbGF0aW9uIHRlcm1pbmF0ZXMuXG4gICAgKi9cbiAgIGZ1bmN0aW9uIGNvbXBpbGVKc29uUGF0aFRvRnVuY3Rpb24oIHVuY29tcGlsZWRKc29uUGF0aCwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZXJHZW5lcmF0ZWRTb0ZhciApIHtcblxuICAgICAgLyoqXG4gICAgICAgKiBPbiBmaW5kaW5nIGEgbWF0Y2gsIGlmIHRoZXJlIGlzIHJlbWFpbmluZyB0ZXh0IHRvIGJlIGNvbXBpbGVkXG4gICAgICAgKiB3ZSB3YW50IHRvIGVpdGhlciBjb250aW51ZSBwYXJzaW5nIHVzaW5nIGEgcmVjdXJzaXZlIGNhbGwgdG8gXG4gICAgICAgKiBjb21waWxlSnNvblBhdGhUb0Z1bmN0aW9uLiBPdGhlcndpc2UsIHdlIHdhbnQgdG8gc3RvcCBhbmQgcmV0dXJuIFxuICAgICAgICogdGhlIHBhcnNlciB0aGF0IHdlIGhhdmUgZm91bmQgc28gZmFyLlxuICAgICAgICovXG4gICAgICB2YXIgb25GaW5kID0gICAgICB1bmNvbXBpbGVkSnNvblBhdGhcbiAgICAgICAgICAgICAgICAgICAgID8gIGNvbXBpbGVKc29uUGF0aFRvRnVuY3Rpb24gXG4gICAgICAgICAgICAgICAgICAgICA6ICByZXR1cm5Gb3VuZFBhcnNlcjtcbiAgICAgICAgICAgICAgICAgICBcbiAgICAgIHJldHVybiAgIGNsYXVzZUZvckpzb25QYXRoKCBcbiAgICAgICAgICAgICAgICAgIHVuY29tcGlsZWRKc29uUGF0aCwgXG4gICAgICAgICAgICAgICAgICBwYXJzZXJHZW5lcmF0ZWRTb0ZhciwgXG4gICAgICAgICAgICAgICAgICBvbkZpbmRcbiAgICAgICAgICAgICAgICk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICB9XG5cbiAgIC8qKlxuICAgICogVGhpcyBpcyB0aGUgZnVuY3Rpb24gdGhhdCB3ZSBleHBvc2UgdG8gdGhlIHJlc3Qgb2YgdGhlIGxpYnJhcnkuXG4gICAgKi9cbiAgIHJldHVybiBmdW5jdGlvbihqc29uUGF0aCl7XG4gICAgICAgIFxuICAgICAgdHJ5IHtcbiAgICAgICAgIC8vIEtpY2sgb2ZmIHRoZSByZWN1cnNpdmUgcGFyc2luZyBvZiB0aGUganNvblBhdGggXG4gICAgICAgICByZXR1cm4gY29tcGlsZUpzb25QYXRoVG9GdW5jdGlvbihqc29uUGF0aCwgYWx3YXlzKTtcbiAgICAgICAgIFxuICAgICAgfSBjYXRjaCggZSApIHtcbiAgICAgICAgIHRocm93IEVycm9yKCAnQ291bGQgbm90IGNvbXBpbGUgXCInICsganNvblBhdGggKyBcbiAgICAgICAgICAgICAgICAgICAgICAnXCIgYmVjYXVzZSAnICsgZS5tZXNzYWdlXG4gICAgICAgICApO1xuICAgICAgfVxuICAgfVxuXG59KTtcblxuLyoqXG4gKiBBIHB1Yi9zdWIgd2hpY2ggaXMgcmVzcG9uc2libGUgZm9yIGEgc2luZ2xlIGV2ZW50IHR5cGUuIEFcbiAqIG11bHRpLWV2ZW50IHR5cGUgZXZlbnQgYnVzIGlzIGNyZWF0ZWQgYnkgcHViU3ViIGJ5IGNvbGxlY3RpbmdcbiAqIHNldmVyYWwgb2YgdGhlc2UuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50VHlwZVxuICogICAgdGhlIG5hbWUgb2YgdGhlIGV2ZW50cyBtYW5hZ2VkIGJ5IHRoaXMgc2luZ2xlRXZlbnRQdWJTdWJcbiAqIEBwYXJhbSB7c2luZ2xlRXZlbnRQdWJTdWJ9IFtuZXdMaXN0ZW5lcl1cbiAqICAgIHBsYWNlIHRvIG5vdGlmeSBvZiBuZXcgbGlzdGVuZXJzXG4gKiBAcGFyYW0ge3NpbmdsZUV2ZW50UHViU3VifSBbcmVtb3ZlTGlzdGVuZXJdXG4gKiAgICBwbGFjZSB0byBub3RpZnkgb2Ygd2hlbiBsaXN0ZW5lcnMgYXJlIHJlbW92ZWRcbiAqL1xuZnVuY3Rpb24gc2luZ2xlRXZlbnRQdWJTdWIoZXZlbnRUeXBlLCBuZXdMaXN0ZW5lciwgcmVtb3ZlTGlzdGVuZXIpe1xuXG4gIC8qKiB3ZSBhcmUgb3B0aW1pc2VkIGZvciBlbWl0dGluZyBldmVudHMgb3ZlciBmaXJpbmcgdGhlbS5cbiAgICogIEFzIHdlbGwgYXMgdGhlIHR1cGxlIGxpc3Qgd2hpY2ggc3RvcmVzIGV2ZW50IGlkcyBhbmRcbiAgICogIGxpc3RlbmVycyB0aGVyZSBpcyBhIGxpc3Qgd2l0aCBqdXN0IHRoZSBsaXN0ZW5lcnMgd2hpY2hcbiAgICogIGNhbiBiZSBpdGVyYXRlZCBtb3JlIHF1aWNrbHkgd2hlbiB3ZSBhcmUgZW1pdHRpbmdcbiAgICovXG4gIHZhciBsaXN0ZW5lclR1cGxlTGlzdCxcbiAgICAgIGxpc3RlbmVyTGlzdDtcblxuICBmdW5jdGlvbiBoYXNJZChpZCl7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHR1cGxlKSB7XG4gICAgICByZXR1cm4gdHVwbGUuaWQgPT0gaWQ7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lclxuICAgICAqIEBwYXJhbSB7Kn0gbGlzdGVuZXJJZFxuICAgICAqICAgIGFuIGlkIHRoYXQgdGhpcyBsaXN0ZW5lciBjYW4gbGF0ZXIgYnkgcmVtb3ZlZCBieS5cbiAgICAgKiAgICBDYW4gYmUgb2YgYW55IHR5cGUsIHRvIGJlIGNvbXBhcmVkIHRvIG90aGVyIGlkcyB1c2luZyA9PVxuICAgICAqL1xuICAgIG9uOmZ1bmN0aW9uKCBsaXN0ZW5lciwgbGlzdGVuZXJJZCApIHtcblxuICAgICAgdmFyIHR1cGxlID0ge1xuICAgICAgICBsaXN0ZW5lcjogbGlzdGVuZXJcbiAgICAgICAgLCAgaWQ6ICAgICAgIGxpc3RlbmVySWQgfHwgbGlzdGVuZXIgLy8gd2hlbiBubyBpZCBpcyBnaXZlbiB1c2UgdGhlXG4gICAgICAgIC8vIGxpc3RlbmVyIGZ1bmN0aW9uIGFzIHRoZSBpZFxuICAgICAgfTtcblxuICAgICAgaWYoIG5ld0xpc3RlbmVyICkge1xuICAgICAgICBuZXdMaXN0ZW5lci5lbWl0KGV2ZW50VHlwZSwgbGlzdGVuZXIsIHR1cGxlLmlkKTtcbiAgICAgIH1cblxuICAgICAgbGlzdGVuZXJUdXBsZUxpc3QgPSBjb25zKCB0dXBsZSwgICAgbGlzdGVuZXJUdXBsZUxpc3QgKTtcbiAgICAgIGxpc3RlbmVyTGlzdCAgICAgID0gY29ucyggbGlzdGVuZXIsIGxpc3RlbmVyTGlzdCAgICAgICk7XG5cbiAgICAgIHJldHVybiB0aGlzOyAvLyBjaGFpbmluZ1xuICAgIH0sXG5cbiAgICBlbWl0OmZ1bmN0aW9uICgpIHtcbiAgICAgIGFwcGx5RWFjaCggbGlzdGVuZXJMaXN0LCBhcmd1bWVudHMgKTtcbiAgICB9LFxuXG4gICAgdW46IGZ1bmN0aW9uKCBsaXN0ZW5lcklkICkge1xuXG4gICAgICB2YXIgcmVtb3ZlZDtcblxuICAgICAgbGlzdGVuZXJUdXBsZUxpc3QgPSB3aXRob3V0KFxuICAgICAgICBsaXN0ZW5lclR1cGxlTGlzdCxcbiAgICAgICAgaGFzSWQobGlzdGVuZXJJZCksXG4gICAgICAgIGZ1bmN0aW9uKHR1cGxlKXtcbiAgICAgICAgICByZW1vdmVkID0gdHVwbGU7XG4gICAgICAgIH1cbiAgICAgICk7XG5cbiAgICAgIGlmKCByZW1vdmVkICkge1xuICAgICAgICBsaXN0ZW5lckxpc3QgPSB3aXRob3V0KCBsaXN0ZW5lckxpc3QsIGZ1bmN0aW9uKGxpc3RlbmVyKXtcbiAgICAgICAgICByZXR1cm4gbGlzdGVuZXIgPT0gcmVtb3ZlZC5saXN0ZW5lcjtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYoIHJlbW92ZUxpc3RlbmVyICkge1xuICAgICAgICAgIHJlbW92ZUxpc3RlbmVyLmVtaXQoZXZlbnRUeXBlLCByZW1vdmVkLmxpc3RlbmVyLCByZW1vdmVkLmlkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBsaXN0ZW5lcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAvLyBkaWZmZXJzIGZyb20gTm9kZSBFdmVudEVtaXR0ZXI6IHJldHVybnMgbGlzdCwgbm90IGFycmF5XG4gICAgICByZXR1cm4gbGlzdGVuZXJMaXN0O1xuICAgIH0sXG5cbiAgICBoYXNMaXN0ZW5lcjogZnVuY3Rpb24obGlzdGVuZXJJZCl7XG4gICAgICB2YXIgdGVzdCA9IGxpc3RlbmVySWQ/IGhhc0lkKGxpc3RlbmVySWQpIDogYWx3YXlzO1xuXG4gICAgICByZXR1cm4gZGVmaW5lZChmaXJzdCggdGVzdCwgbGlzdGVuZXJUdXBsZUxpc3QpKTtcbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogcHViU3ViIGlzIGEgY3VycmllZCBpbnRlcmZhY2UgZm9yIGxpc3RlbmluZyB0byBhbmQgZW1pdHRpbmdcbiAqIGV2ZW50cy5cbiAqXG4gKiBJZiB3ZSBnZXQgYSBidXM6XG4gKlxuICogICAgdmFyIGJ1cyA9IHB1YlN1YigpO1xuICpcbiAqIFdlIGNhbiBsaXN0ZW4gdG8gZXZlbnQgJ2ZvbycgbGlrZTpcbiAqXG4gKiAgICBidXMoJ2ZvbycpLm9uKG15Q2FsbGJhY2spXG4gKlxuICogQW5kIGVtaXQgZXZlbnQgZm9vIGxpa2U6XG4gKlxuICogICAgYnVzKCdmb28nKS5lbWl0KClcbiAqXG4gKiBvciwgd2l0aCBhIHBhcmFtZXRlcjpcbiAqXG4gKiAgICBidXMoJ2ZvbycpLmVtaXQoJ2JhcicpXG4gKlxuICogQWxsIGZ1bmN0aW9ucyBjYW4gYmUgY2FjaGVkIGFuZCBkb24ndCBuZWVkIHRvIGJlXG4gKiBib3VuZC4gSWU6XG4gKlxuICogICAgdmFyIGZvb0VtaXR0ZXIgPSBidXMoJ2ZvbycpLmVtaXRcbiAqICAgIGZvb0VtaXR0ZXIoJ2JhcicpOyAgLy8gZW1pdCBhbiBldmVudFxuICogICAgZm9vRW1pdHRlcignYmF6Jyk7ICAvLyBlbWl0IGFub3RoZXJcbiAqXG4gKiBUaGVyZSdzIGFsc28gYW4gdW5jdXJyaWVkWzFdIHNob3J0Y3V0IGZvciAuZW1pdCBhbmQgLm9uOlxuICpcbiAqICAgIGJ1cy5vbignZm9vJywgY2FsbGJhY2spXG4gKiAgICBidXMuZW1pdCgnZm9vJywgJ2JhcicpXG4gKlxuICogWzFdOiBodHRwOi8venZvbi5vcmcvb3RoZXIvaGFza2VsbC9PdXRwdXRwcmVsdWRlL3VuY3VycnlfZi5odG1sXG4gKi9cbmZ1bmN0aW9uIHB1YlN1Yigpe1xuXG4gICB2YXIgc2luZ2xlcyA9IHt9LFxuICAgICAgIG5ld0xpc3RlbmVyID0gbmV3U2luZ2xlKCduZXdMaXN0ZW5lcicpLFxuICAgICAgIHJlbW92ZUxpc3RlbmVyID0gbmV3U2luZ2xlKCdyZW1vdmVMaXN0ZW5lcicpO1xuXG4gICBmdW5jdGlvbiBuZXdTaW5nbGUoZXZlbnROYW1lKSB7XG4gICAgICByZXR1cm4gc2luZ2xlc1tldmVudE5hbWVdID0gc2luZ2xlRXZlbnRQdWJTdWIoXG4gICAgICAgICBldmVudE5hbWUsXG4gICAgICAgICBuZXdMaXN0ZW5lcixcbiAgICAgICAgIHJlbW92ZUxpc3RlbmVyXG4gICAgICApO1xuICAgfVxuXG4gICAvKiogcHViU3ViIGluc3RhbmNlcyBhcmUgZnVuY3Rpb25zICovXG4gICBmdW5jdGlvbiBwdWJTdWJJbnN0YW5jZSggZXZlbnROYW1lICl7XG5cbiAgICAgIHJldHVybiBzaW5nbGVzW2V2ZW50TmFtZV0gfHwgbmV3U2luZ2xlKCBldmVudE5hbWUgKTtcbiAgIH1cblxuICAgLy8gYWRkIGNvbnZlbmllbmNlIEV2ZW50RW1pdHRlci1zdHlsZSB1bmN1cnJpZWQgZm9ybSBvZiAnZW1pdCcgYW5kICdvbidcbiAgIFsnZW1pdCcsICdvbicsICd1biddLmZvckVhY2goZnVuY3Rpb24obWV0aG9kTmFtZSl7XG5cbiAgICAgIHB1YlN1Ykluc3RhbmNlW21ldGhvZE5hbWVdID0gdmFyQXJncyhmdW5jdGlvbihldmVudE5hbWUsIHBhcmFtZXRlcnMpe1xuICAgICAgICAgYXBwbHkoIHBhcmFtZXRlcnMsIHB1YlN1Ykluc3RhbmNlKCBldmVudE5hbWUgKVttZXRob2ROYW1lXSk7XG4gICAgICB9KTtcbiAgIH0pO1xuXG4gICByZXR1cm4gcHViU3ViSW5zdGFuY2U7XG59XG5cbi8qKlxuICogVGhpcyBmaWxlIGRlY2xhcmVzIHNvbWUgY29uc3RhbnRzIHRvIHVzZSBhcyBuYW1lcyBmb3IgZXZlbnQgdHlwZXMuXG4gKi9cblxudmFyIC8vIHRoZSBldmVudHMgd2hpY2ggYXJlIG5ldmVyIGV4cG9ydGVkIGFyZSBrZXB0IGFzIFxuICAgIC8vIHRoZSBzbWFsbGVzdCBwb3NzaWJsZSByZXByZXNlbnRhdGlvbiwgaW4gbnVtYmVyczpcbiAgICBfUyA9IDEsXG5cbiAgICAvLyBmaXJlZCB3aGVuZXZlciBhIG5ldyBub2RlIHN0YXJ0cyBpbiB0aGUgSlNPTiBzdHJlYW06XG4gICAgTk9ERV9PUEVORUQgICAgID0gX1MrKyxcblxuICAgIC8vIGZpcmVkIHdoZW5ldmVyIGEgbm9kZSBjbG9zZXMgaW4gdGhlIEpTT04gc3RyZWFtOlxuICAgIE5PREVfQ0xPU0VEICAgICA9IF9TKyssXG5cbiAgICAvLyBjYWxsZWQgaWYgYSAubm9kZSBjYWxsYmFjayByZXR1cm5zIGEgdmFsdWUgLSBcbiAgICBOT0RFX1NXQVAgICAgICAgPSBfUysrLFxuICAgIE5PREVfRFJPUCAgICAgICA9IF9TKyssXG5cbiAgICBGQUlMX0VWRU5UICAgICAgPSAnZmFpbCcsXG4gICBcbiAgICBST09UX05PREVfRk9VTkQgPSBfUysrLFxuICAgIFJPT1RfUEFUSF9GT1VORCA9IF9TKyssXG4gICBcbiAgICBIVFRQX1NUQVJUICAgICAgPSAnc3RhcnQnLFxuICAgIFNUUkVBTV9EQVRBICAgICA9ICdkYXRhJyxcbiAgICBTVFJFQU1fRU5EICAgICAgPSAnZW5kJyxcbiAgICBBQk9SVElORyAgICAgICAgPSBfUysrLFxuXG4gICAgLy8gU0FYIGV2ZW50cyBidXRjaGVyZWQgZnJvbSBDbGFyaW5ldFxuICAgIFNBWF9LRVkgICAgICAgICAgPSBfUysrLFxuICAgIFNBWF9WQUxVRV9PUEVOICAgPSBfUysrLFxuICAgIFNBWF9WQUxVRV9DTE9TRSAgPSBfUysrO1xuICAgIFxuZnVuY3Rpb24gZXJyb3JSZXBvcnQoc3RhdHVzQ29kZSwgYm9keSwgZXJyb3IpIHtcbiAgIHRyeXtcbiAgICAgIHZhciBqc29uQm9keSA9IEpTT04ucGFyc2UoYm9keSk7XG4gICB9Y2F0Y2goZSl7fVxuXG4gICByZXR1cm4ge1xuICAgICAgc3RhdHVzQ29kZTpzdGF0dXNDb2RlLFxuICAgICAgYm9keTpib2R5LFxuICAgICAganNvbkJvZHk6anNvbkJvZHksXG4gICAgICB0aHJvd246ZXJyb3JcbiAgIH07XG59ICAgIFxuXG4vKiogXG4gKiAgVGhlIHBhdHRlcm4gYWRhcHRvciBsaXN0ZW5zIGZvciBuZXdMaXN0ZW5lciBhbmQgcmVtb3ZlTGlzdGVuZXJcbiAqICBldmVudHMuIFdoZW4gcGF0dGVybnMgYXJlIGFkZGVkIG9yIHJlbW92ZWQgaXQgY29tcGlsZXMgdGhlIEpTT05QYXRoXG4gKiAgYW5kIHdpcmVzIHRoZW0gdXAuXG4gKiAgXG4gKiAgV2hlbiBub2RlcyBhbmQgcGF0aHMgYXJlIGZvdW5kIGl0IGVtaXRzIHRoZSBmdWxseS1xdWFsaWZpZWQgbWF0Y2ggXG4gKiAgZXZlbnRzIHdpdGggcGFyYW1ldGVycyByZWFkeSB0byBzaGlwIHRvIHRoZSBvdXRzaWRlIHdvcmxkXG4gKi9cblxuZnVuY3Rpb24gcGF0dGVybkFkYXB0ZXIob2JvZUJ1cywganNvblBhdGhDb21waWxlcikge1xuXG4gICB2YXIgcHJlZGljYXRlRXZlbnRNYXAgPSB7XG4gICAgICBub2RlOm9ib2VCdXMoTk9ERV9DTE9TRUQpXG4gICAsICBwYXRoOm9ib2VCdXMoTk9ERV9PUEVORUQpXG4gICB9O1xuICAgICBcbiAgIGZ1bmN0aW9uIGVtaXRNYXRjaGluZ05vZGUoZW1pdE1hdGNoLCBub2RlLCBhc2NlbnQpIHtcbiAgICAgICAgIFxuICAgICAgLyogXG4gICAgICAgICBXZSdyZSBub3cgY2FsbGluZyB0byB0aGUgb3V0c2lkZSB3b3JsZCB3aGVyZSBMaXNwLXN0eWxlIFxuICAgICAgICAgbGlzdHMgd2lsbCBub3QgYmUgZmFtaWxpYXIuIENvbnZlcnQgdG8gc3RhbmRhcmQgYXJyYXlzLiBcbiAgIFxuICAgICAgICAgQWxzbywgcmV2ZXJzZSB0aGUgb3JkZXIgYmVjYXVzZSBpdCBpcyBtb3JlIGNvbW1vbiB0byBcbiAgICAgICAgIGxpc3QgcGF0aHMgXCJyb290IHRvIGxlYWZcIiB0aGFuIFwibGVhZiB0byByb290XCIgICovXG4gICAgICB2YXIgZGVzY2VudCAgICAgPSByZXZlcnNlTGlzdChhc2NlbnQpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgZW1pdE1hdGNoKFxuICAgICAgICAgbm9kZSxcbiAgICAgICAgIFxuICAgICAgICAgLy8gVG8gbWFrZSBhIHBhdGgsIHN0cmlwIG9mZiB0aGUgbGFzdCBpdGVtIHdoaWNoIGlzIHRoZSBzcGVjaWFsXG4gICAgICAgICAvLyBST09UX1BBVEggdG9rZW4gZm9yIHRoZSAncGF0aCcgdG8gdGhlIHJvb3Qgbm9kZSAgICAgICAgICBcbiAgICAgICAgIGxpc3RBc0FycmF5KHRhaWwobWFwKGtleU9mLGRlc2NlbnQpKSksICAvLyBwYXRoXG4gICAgICAgICBsaXN0QXNBcnJheShtYXAobm9kZU9mLCBkZXNjZW50KSkgICAgICAgLy8gYW5jZXN0b3JzICAgIFxuICAgICAgKTsgICAgICAgICBcbiAgIH1cblxuICAgLyogXG4gICAgKiBTZXQgdXAgdGhlIGNhdGNoaW5nIG9mIGV2ZW50cyBzdWNoIGFzIE5PREVfQ0xPU0VEIGFuZCBOT0RFX09QRU5FRCBhbmQsIGlmIFxuICAgICogbWF0Y2hpbmcgdGhlIHNwZWNpZmllZCBwYXR0ZXJuLCBwcm9wYWdhdGUgdG8gcGF0dGVybi1tYXRjaCBldmVudHMgc3VjaCBhcyBcbiAgICAqIG9ib2VCdXMoJ25vZGU6IScpXG4gICAgKiBcbiAgICAqIFxuICAgICogXG4gICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGVFdmVudCBcbiAgICAqICAgICAgICAgIGVpdGhlciBvYm9lQnVzKE5PREVfQ0xPU0VEKSBvciBvYm9lQnVzKE5PREVfT1BFTkVEKS5cbiAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbXBpbGVkSnNvblBhdGggICAgICAgICAgXG4gICAgKi9cbiAgIGZ1bmN0aW9uIGFkZFVuZGVybHlpbmdMaXN0ZW5lciggZnVsbEV2ZW50TmFtZSwgcHJlZGljYXRlRXZlbnQsIGNvbXBpbGVkSnNvblBhdGggKXtcbiAgIFxuICAgICAgdmFyIGVtaXRNYXRjaCA9IG9ib2VCdXMoZnVsbEV2ZW50TmFtZSkuZW1pdDtcbiAgIFxuICAgICAgcHJlZGljYXRlRXZlbnQub24oIGZ1bmN0aW9uIChhc2NlbnQpIHtcblxuICAgICAgICAgdmFyIG1heWJlTWF0Y2hpbmdNYXBwaW5nID0gY29tcGlsZWRKc29uUGF0aChhc2NlbnQpO1xuXG4gICAgICAgICAvKiBQb3NzaWJsZSB2YWx1ZXMgZm9yIG1heWJlTWF0Y2hpbmdNYXBwaW5nIGFyZSBub3c6XG5cbiAgICAgICAgICBmYWxzZTogXG4gICAgICAgICAgd2UgZGlkIG5vdCBtYXRjaCBcblxuICAgICAgICAgIGFuIG9iamVjdC9hcnJheS9zdHJpbmcvbnVtYmVyL251bGw6IFxuICAgICAgICAgIHdlIG1hdGNoZWQgYW5kIGhhdmUgdGhlIG5vZGUgdGhhdCBtYXRjaGVkLlxuICAgICAgICAgIEJlY2F1c2UgbnVsbHMgYXJlIHZhbGlkIGpzb24gdmFsdWVzIHRoaXMgY2FuIGJlIG51bGwuXG5cbiAgICAgICAgICB1bmRlZmluZWQ6XG4gICAgICAgICAgd2UgbWF0Y2hlZCBidXQgZG9uJ3QgaGF2ZSB0aGUgbWF0Y2hpbmcgbm9kZSB5ZXQuXG4gICAgICAgICAgaWUsIHdlIGtub3cgdGhlcmUgaXMgYW4gdXBjb21pbmcgbm9kZSB0aGF0IG1hdGNoZXMgYnV0IHdlIFxuICAgICAgICAgIGNhbid0IHNheSBhbnl0aGluZyBlbHNlIGFib3V0IGl0LiBcbiAgICAgICAgICAqL1xuICAgICAgICAgaWYgKG1heWJlTWF0Y2hpbmdNYXBwaW5nICE9PSBmYWxzZSkge1xuXG4gICAgICAgICAgICBlbWl0TWF0Y2hpbmdOb2RlKFxuICAgICAgICAgICAgICAgZW1pdE1hdGNoLCBcbiAgICAgICAgICAgICAgIG5vZGVPZihtYXliZU1hdGNoaW5nTWFwcGluZyksIFxuICAgICAgICAgICAgICAgYXNjZW50XG4gICAgICAgICAgICApO1xuICAgICAgICAgfVxuICAgICAgfSwgZnVsbEV2ZW50TmFtZSk7XG4gICAgIFxuICAgICAgb2JvZUJ1cygncmVtb3ZlTGlzdGVuZXInKS5vbiggZnVuY3Rpb24ocmVtb3ZlZEV2ZW50TmFtZSl7XG5cbiAgICAgICAgIC8vIGlmIHRoZSBmdWxseSBxdWFsaWZpZWQgbWF0Y2ggZXZlbnQgbGlzdGVuZXIgaXMgbGF0ZXIgcmVtb3ZlZCwgY2xlYW4gdXAgXG4gICAgICAgICAvLyBieSByZW1vdmluZyB0aGUgdW5kZXJseWluZyBsaXN0ZW5lciBpZiBpdCB3YXMgdGhlIGxhc3QgdXNpbmcgdGhhdCBwYXR0ZXJuOlxuICAgICAgXG4gICAgICAgICBpZiggcmVtb3ZlZEV2ZW50TmFtZSA9PSBmdWxsRXZlbnROYW1lICkge1xuICAgICAgICAgXG4gICAgICAgICAgICBpZiggIW9ib2VCdXMocmVtb3ZlZEV2ZW50TmFtZSkubGlzdGVuZXJzKCAgKSkge1xuICAgICAgICAgICAgICAgcHJlZGljYXRlRXZlbnQudW4oIGZ1bGxFdmVudE5hbWUgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cbiAgICAgIH0pOyAgIFxuICAgfVxuXG4gICBvYm9lQnVzKCduZXdMaXN0ZW5lcicpLm9uKCBmdW5jdGlvbihmdWxsRXZlbnROYW1lKXtcblxuICAgICAgdmFyIG1hdGNoID0gLyhub2RlfHBhdGgpOiguKikvLmV4ZWMoZnVsbEV2ZW50TmFtZSk7XG4gICAgICBcbiAgICAgIGlmKCBtYXRjaCApIHtcbiAgICAgICAgIHZhciBwcmVkaWNhdGVFdmVudCA9IHByZWRpY2F0ZUV2ZW50TWFwW21hdGNoWzFdXTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICBpZiggIXByZWRpY2F0ZUV2ZW50Lmhhc0xpc3RlbmVyKCBmdWxsRXZlbnROYW1lKSApIHsgIFxuICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBhZGRVbmRlcmx5aW5nTGlzdGVuZXIoXG4gICAgICAgICAgICAgICBmdWxsRXZlbnROYW1lLFxuICAgICAgICAgICAgICAgcHJlZGljYXRlRXZlbnQsIFxuICAgICAgICAgICAgICAganNvblBhdGhDb21waWxlciggbWF0Y2hbMl0gKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgIH1cbiAgICAgIH0gICAgXG4gICB9KVxuXG59XG5cbi8qKlxuICogVGhlIGluc3RhbmNlIEFQSSBpcyB0aGUgdGhpbmcgdGhhdCBpcyByZXR1cm5lZCB3aGVuIG9ib2UoKSBpcyBjYWxsZWQuXG4gKiBpdCBhbGxvd3M6XG4gKlxuICogICAgLSBsaXN0ZW5lcnMgZm9yIHZhcmlvdXMgZXZlbnRzIHRvIGJlIGFkZGVkIGFuZCByZW1vdmVkXG4gKiAgICAtIHRoZSBodHRwIHJlc3BvbnNlIGhlYWRlci9oZWFkZXJzIHRvIGJlIHJlYWRcbiAqL1xuZnVuY3Rpb24gaW5zdGFuY2VBcGkob2JvZUJ1cywgY29udGVudFNvdXJjZSl7XG5cbiAgdmFyIG9ib2VBcGksXG4gICAgICBmdWxseVF1YWxpZmllZE5hbWVQYXR0ZXJuID0gL14obm9kZXxwYXRoKTouLyxcbiAgICAgIHJvb3ROb2RlRmluaXNoZWRFdmVudCA9IG9ib2VCdXMoUk9PVF9OT0RFX0ZPVU5EKSxcbiAgICAgIGVtaXROb2RlRHJvcCA9IG9ib2VCdXMoTk9ERV9EUk9QKS5lbWl0LFxuICAgICAgZW1pdE5vZGVTd2FwID0gb2JvZUJ1cyhOT0RFX1NXQVApLmVtaXQsXG5cbiAgICAgIC8qKlxuICAgICAgICogQWRkIGFueSBraW5kIG9mIGxpc3RlbmVyIHRoYXQgdGhlIGluc3RhbmNlIGFwaSBleHBvc2VzXG4gICAgICAgKi9cbiAgICAgIGFkZExpc3RlbmVyID0gdmFyQXJncyhmdW5jdGlvbiggZXZlbnRJZCwgcGFyYW1ldGVycyApe1xuXG4gICAgICAgIGlmKCBvYm9lQXBpW2V2ZW50SWRdICkge1xuXG4gICAgICAgICAgLy8gZm9yIGV2ZW50cyBhZGRlZCBhcyAub24oZXZlbnQsIGNhbGxiYWNrKSwgaWYgdGhlcmUgaXMgYVxuICAgICAgICAgIC8vIC5ldmVudCgpIGVxdWl2YWxlbnQgd2l0aCBzcGVjaWFsIGJlaGF2aW91ciAsIHBhc3MgdGhyb3VnaFxuICAgICAgICAgIC8vIHRvIHRoYXQ6XG4gICAgICAgICAgYXBwbHkocGFyYW1ldGVycywgb2JvZUFwaVtldmVudElkXSk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAvLyB3ZSBoYXZlIGEgc3RhbmRhcmQgTm9kZS5qcyBFdmVudEVtaXR0ZXIgMi1hcmd1bWVudCBjYWxsLlxuICAgICAgICAgIC8vIFRoZSBmaXJzdCBwYXJhbWV0ZXIgaXMgdGhlIGxpc3RlbmVyLlxuICAgICAgICAgIHZhciBldmVudCA9IG9ib2VCdXMoZXZlbnRJZCksXG4gICAgICAgICAgICAgIGxpc3RlbmVyID0gcGFyYW1ldGVyc1swXTtcblxuICAgICAgICAgIGlmKCBmdWxseVF1YWxpZmllZE5hbWVQYXR0ZXJuLnRlc3QoZXZlbnRJZCkgKSB7XG5cbiAgICAgICAgICAgIC8vIGFsbG93IGZ1bGx5LXF1YWxpZmllZCBub2RlL3BhdGggbGlzdGVuZXJzXG4gICAgICAgICAgICAvLyB0byBiZSBhZGRlZFxuICAgICAgICAgICAgYWRkRm9yZ2V0dGFibGVDYWxsYmFjayhldmVudCwgbGlzdGVuZXIpO1xuICAgICAgICAgIH0gZWxzZSAge1xuXG4gICAgICAgICAgICAvLyB0aGUgZXZlbnQgaGFzIG5vIHNwZWNpYWwgaGFuZGxpbmcsIHBhc3MgdGhyb3VnaFxuICAgICAgICAgICAgLy8gZGlyZWN0bHkgb250byB0aGUgZXZlbnQgYnVzOlxuICAgICAgICAgICAgZXZlbnQub24oIGxpc3RlbmVyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb2JvZUFwaTsgLy8gY2hhaW5pbmdcbiAgICAgIH0pLFxuXG4gICAgICAvKipcbiAgICAgICAqIFJlbW92ZSBhbnkga2luZCBvZiBsaXN0ZW5lciB0aGF0IHRoZSBpbnN0YW5jZSBhcGkgZXhwb3Nlc1xuICAgICAgICovXG4gICAgICByZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKCBldmVudElkLCBwMiwgcDMgKXtcblxuICAgICAgICBpZiggZXZlbnRJZCA9PSAnZG9uZScgKSB7XG5cbiAgICAgICAgICByb290Tm9kZUZpbmlzaGVkRXZlbnQudW4ocDIpO1xuXG4gICAgICAgIH0gZWxzZSBpZiggZXZlbnRJZCA9PSAnbm9kZScgfHwgZXZlbnRJZCA9PSAncGF0aCcgKSB7XG5cbiAgICAgICAgICAvLyBhbGxvdyByZW1vdmFsIG9mIG5vZGUgYW5kIHBhdGhcbiAgICAgICAgICBvYm9lQnVzLnVuKGV2ZW50SWQgKyAnOicgKyBwMiwgcDMpO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgLy8gd2UgaGF2ZSBhIHN0YW5kYXJkIE5vZGUuanMgRXZlbnRFbWl0dGVyIDItYXJndW1lbnQgY2FsbC5cbiAgICAgICAgICAvLyBUaGUgc2Vjb25kIHBhcmFtZXRlciBpcyB0aGUgbGlzdGVuZXIuIFRoaXMgbWF5IGJlIGEgY2FsbFxuICAgICAgICAgIC8vIHRvIHJlbW92ZSBhIGZ1bGx5LXF1YWxpZmllZCBub2RlL3BhdGggbGlzdGVuZXIgYnV0IHJlcXVpcmVzXG4gICAgICAgICAgLy8gbm8gc3BlY2lhbCBoYW5kbGluZ1xuICAgICAgICAgIHZhciBsaXN0ZW5lciA9IHAyO1xuXG4gICAgICAgICAgb2JvZUJ1cyhldmVudElkKS51bihsaXN0ZW5lcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb2JvZUFwaTsgLy8gY2hhaW5pbmdcbiAgICAgIH07XG5cbiAgLyoqXG4gICAqIEFkZCBhIGNhbGxiYWNrLCB3cmFwcGVkIGluIGEgdHJ5L2NhdGNoIHNvIGFzIHRvIG5vdCBicmVhayB0aGVcbiAgICogZXhlY3V0aW9uIG9mIE9ib2UgaWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biAoZmFpbCBldmVudHMgYXJlXG4gICAqIGZpcmVkIGluc3RlYWQpXG4gICAqXG4gICAqIFRoZSBjYWxsYmFjayBpcyB1c2VkIGFzIHRoZSBsaXN0ZW5lciBpZCBzbyB0aGF0IGl0IGNhbiBsYXRlciBiZVxuICAgKiByZW1vdmVkIHVzaW5nIC51bihjYWxsYmFjaylcbiAgICovXG4gIGZ1bmN0aW9uIGFkZFByb3RlY3RlZENhbGxiYWNrKGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICBvYm9lQnVzKGV2ZW50TmFtZSkub24ocHJvdGVjdGVkQ2FsbGJhY2soY2FsbGJhY2spLCBjYWxsYmFjayk7XG4gICAgcmV0dXJuIG9ib2VBcGk7IC8vIGNoYWluaW5nXG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgY2FsbGJhY2sgd2hlcmUsIGlmIC5mb3JnZXQoKSBpcyBjYWxsZWQgZHVyaW5nIHRoZSBjYWxsYmFjaydzXG4gICAqIGV4ZWN1dGlvbiwgdGhlIGNhbGxiYWNrIHdpbGwgYmUgZGUtcmVnaXN0ZXJlZFxuICAgKi9cbiAgZnVuY3Rpb24gYWRkRm9yZ2V0dGFibGVDYWxsYmFjayhldmVudCwgY2FsbGJhY2ssIGxpc3RlbmVySWQpIHtcblxuICAgIC8vIGxpc3RlbmVySWQgaXMgb3B0aW9uYWwgYW5kIGlmIG5vdCBnaXZlbiwgdGhlIG9yaWdpbmFsXG4gICAgLy8gY2FsbGJhY2sgd2lsbCBiZSB1c2VkXG4gICAgbGlzdGVuZXJJZCA9IGxpc3RlbmVySWQgfHwgY2FsbGJhY2s7XG5cbiAgICB2YXIgc2FmZUNhbGxiYWNrID0gcHJvdGVjdGVkQ2FsbGJhY2soY2FsbGJhY2spO1xuXG4gICAgZXZlbnQub24oIGZ1bmN0aW9uKCkge1xuXG4gICAgICB2YXIgZGlzY2FyZCA9IGZhbHNlO1xuXG4gICAgICBvYm9lQXBpLmZvcmdldCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGRpc2NhcmQgPSB0cnVlO1xuICAgICAgfTtcblxuICAgICAgYXBwbHkoIGFyZ3VtZW50cywgc2FmZUNhbGxiYWNrICk7XG5cbiAgICAgIGRlbGV0ZSBvYm9lQXBpLmZvcmdldDtcblxuICAgICAgaWYoIGRpc2NhcmQgKSB7XG4gICAgICAgIGV2ZW50LnVuKGxpc3RlbmVySWQpO1xuICAgICAgfVxuICAgIH0sIGxpc3RlbmVySWQpO1xuXG4gICAgcmV0dXJuIG9ib2VBcGk7IC8vIGNoYWluaW5nXG4gIH1cblxuICAvKipcbiAgICogIHdyYXAgYSBjYWxsYmFjayBzbyB0aGF0IGlmIGl0IHRocm93cywgT2JvZS5qcyBkb2Vzbid0IGNyYXNoIGJ1dCBpbnN0ZWFkXG4gICAqICB0aHJvdyB0aGUgZXJyb3IgaW4gYW5vdGhlciBldmVudCBsb29wXG4gICAqL1xuICBmdW5jdGlvbiBwcm90ZWN0ZWRDYWxsYmFjayggY2FsbGJhY2sgKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdHJ5e1xuICAgICAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkob2JvZUFwaSwgYXJndW1lbnRzKTtcbiAgICAgIH1jYXRjaChlKSAge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlLm1lc3NhZ2UpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBmdWxseSBxdWFsaWZpZWQgZXZlbnQgZm9yIHdoZW4gYSBwYXR0ZXJuIG1hdGNoZXNcbiAgICogZWl0aGVyIGEgbm9kZSBvciBhIHBhdGhcbiAgICpcbiAgICogQHBhcmFtIHR5cGUge1N0cmluZ30gZWl0aGVyICdub2RlJyBvciAncGF0aCdcbiAgICovXG4gIGZ1bmN0aW9uIGZ1bGx5UXVhbGlmaWVkUGF0dGVybk1hdGNoRXZlbnQodHlwZSwgcGF0dGVybikge1xuICAgIHJldHVybiBvYm9lQnVzKHR5cGUgKyAnOicgKyBwYXR0ZXJuKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHdyYXBDYWxsYmFja1RvU3dhcE5vZGVJZlNvbWV0aGluZ1JldHVybmVkKCBjYWxsYmFjayApIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmV0dXJuVmFsdWVGcm9tQ2FsbGJhY2sgPSBjYWxsYmFjay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICBpZiggZGVmaW5lZChyZXR1cm5WYWx1ZUZyb21DYWxsYmFjaykgKSB7XG5cbiAgICAgICAgaWYoIHJldHVyblZhbHVlRnJvbUNhbGxiYWNrID09IG9ib2UuZHJvcCApIHtcbiAgICAgICAgICBlbWl0Tm9kZURyb3AoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbWl0Tm9kZVN3YXAocmV0dXJuVmFsdWVGcm9tQ2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYWRkU2luZ2xlTm9kZU9yUGF0aExpc3RlbmVyKGV2ZW50SWQsIHBhdHRlcm4sIGNhbGxiYWNrKSB7XG5cbiAgICB2YXIgZWZmZWN0aXZlQ2FsbGJhY2s7XG5cbiAgICBpZiggZXZlbnRJZCA9PSAnbm9kZScgKSB7XG4gICAgICBlZmZlY3RpdmVDYWxsYmFjayA9IHdyYXBDYWxsYmFja1RvU3dhcE5vZGVJZlNvbWV0aGluZ1JldHVybmVkKGNhbGxiYWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWZmZWN0aXZlQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICB9XG5cbiAgICBhZGRGb3JnZXR0YWJsZUNhbGxiYWNrKFxuICAgICAgZnVsbHlRdWFsaWZpZWRQYXR0ZXJuTWF0Y2hFdmVudChldmVudElkLCBwYXR0ZXJuKSxcbiAgICAgIGVmZmVjdGl2ZUNhbGxiYWNrLFxuICAgICAgY2FsbGJhY2tcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBzZXZlcmFsIGxpc3RlbmVycyBhdCBhIHRpbWUsIGZyb20gYSBtYXBcbiAgICovXG4gIGZ1bmN0aW9uIGFkZE11bHRpcGxlTm9kZU9yUGF0aExpc3RlbmVycyhldmVudElkLCBsaXN0ZW5lck1hcCkge1xuXG4gICAgZm9yKCB2YXIgcGF0dGVybiBpbiBsaXN0ZW5lck1hcCApIHtcbiAgICAgIGFkZFNpbmdsZU5vZGVPclBhdGhMaXN0ZW5lcihldmVudElkLCBwYXR0ZXJuLCBsaXN0ZW5lck1hcFtwYXR0ZXJuXSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIGltcGxlbWVudGF0aW9uIGJlaGluZCAub25QYXRoKCkgYW5kIC5vbk5vZGUoKVxuICAgKi9cbiAgZnVuY3Rpb24gYWRkTm9kZU9yUGF0aExpc3RlbmVyQXBpKCBldmVudElkLCBqc29uUGF0aE9yTGlzdGVuZXJNYXAsIGNhbGxiYWNrICl7XG5cbiAgICBpZiggaXNTdHJpbmcoanNvblBhdGhPckxpc3RlbmVyTWFwKSApIHtcbiAgICAgIGFkZFNpbmdsZU5vZGVPclBhdGhMaXN0ZW5lcihldmVudElkLCBqc29uUGF0aE9yTGlzdGVuZXJNYXAsIGNhbGxiYWNrKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICBhZGRNdWx0aXBsZU5vZGVPclBhdGhMaXN0ZW5lcnMoZXZlbnRJZCwganNvblBhdGhPckxpc3RlbmVyTWFwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb2JvZUFwaTsgLy8gY2hhaW5pbmdcbiAgfVxuXG5cbiAgLy8gc29tZSBpbnRlcmZhY2UgbWV0aG9kcyBhcmUgb25seSBmaWxsZWQgaW4gYWZ0ZXIgd2UgcmVjZWl2ZVxuICAvLyB2YWx1ZXMgYW5kIGFyZSBub29wcyBiZWZvcmUgdGhhdDpcbiAgb2JvZUJ1cyhST09UX1BBVEhfRk9VTkQpLm9uKCBmdW5jdGlvbihyb290Tm9kZSkge1xuICAgIG9ib2VBcGkucm9vdCA9IGZ1bmN0b3Iocm9vdE5vZGUpO1xuICB9KTtcblxuICAvKipcbiAgICogV2hlbiBjb250ZW50IHN0YXJ0cyBtYWtlIHRoZSBoZWFkZXJzIHJlYWRhYmxlIHRocm91Z2ggdGhlXG4gICAqIGluc3RhbmNlIEFQSVxuICAgKi9cbiAgb2JvZUJ1cyhIVFRQX1NUQVJUKS5vbiggZnVuY3Rpb24oX3N0YXR1c0NvZGUsIGhlYWRlcnMpIHtcblxuICAgIG9ib2VBcGkuaGVhZGVyID0gIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHJldHVybiBuYW1lID8gaGVhZGVyc1tuYW1lXVxuICAgICAgICA6IGhlYWRlcnNcbiAgICAgIDtcbiAgICB9XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgYW5kIHJldHVybiB0aGUgcHVibGljIEFQSSBvZiB0aGUgT2JvZSBpbnN0YW5jZSB0byBiZVxuICAgKiByZXR1cm5lZCB0byB0aGUgY2FsbGluZyBhcHBsaWNhdGlvblxuICAgKi9cbiAgcmV0dXJuIG9ib2VBcGkgPSB7XG4gICAgb24gICAgICAgICAgICAgOiBhZGRMaXN0ZW5lcixcbiAgICBhZGRMaXN0ZW5lciAgICA6IGFkZExpc3RlbmVyLFxuICAgIHJlbW92ZUxpc3RlbmVyIDogcmVtb3ZlTGlzdGVuZXIsXG4gICAgZW1pdCAgICAgICAgICAgOiBvYm9lQnVzLmVtaXQsXG5cbiAgICBub2RlICAgICAgICAgICA6IHBhcnRpYWxDb21wbGV0ZShhZGROb2RlT3JQYXRoTGlzdGVuZXJBcGksICdub2RlJyksXG4gICAgcGF0aCAgICAgICAgICAgOiBwYXJ0aWFsQ29tcGxldGUoYWRkTm9kZU9yUGF0aExpc3RlbmVyQXBpLCAncGF0aCcpLFxuXG4gICAgZG9uZSAgICAgICAgICAgOiBwYXJ0aWFsQ29tcGxldGUoYWRkRm9yZ2V0dGFibGVDYWxsYmFjaywgcm9vdE5vZGVGaW5pc2hlZEV2ZW50KSxcbiAgICBzdGFydCAgICAgICAgICA6IHBhcnRpYWxDb21wbGV0ZShhZGRQcm90ZWN0ZWRDYWxsYmFjaywgSFRUUF9TVEFSVCApLFxuXG4gICAgLy8gZmFpbCBkb2Vzbid0IHVzZSBwcm90ZWN0ZWRDYWxsYmFjayBiZWNhdXNlXG4gICAgLy8gY291bGQgbGVhZCB0byBub24tdGVybWluYXRpbmcgbG9vcHNcbiAgICBmYWlsICAgICAgICAgICA6IG9ib2VCdXMoRkFJTF9FVkVOVCkub24sXG5cbiAgICAvLyBwdWJsaWMgYXBpIGNhbGxpbmcgYWJvcnQgZmlyZXMgdGhlIEFCT1JUSU5HIGV2ZW50XG4gICAgYWJvcnQgICAgICAgICAgOiBvYm9lQnVzKEFCT1JUSU5HKS5lbWl0LFxuXG4gICAgLy8gaW5pdGlhbGx5IHJldHVybiBub3RoaW5nIGZvciBoZWFkZXIgYW5kIHJvb3RcbiAgICBoZWFkZXIgICAgICAgICA6IG5vb3AsXG4gICAgcm9vdCAgICAgICAgICAgOiBub29wLFxuXG4gICAgc291cmNlICAgICAgICAgOiBjb250ZW50U291cmNlXG4gIH07XG59XG5cbi8qKlxuICogVGhpcyBmaWxlIHNpdHMganVzdCBiZWhpbmQgdGhlIEFQSSB3aGljaCBpcyB1c2VkIHRvIGF0dGFpbiBhIG5ld1xuICogT2JvZSBpbnN0YW5jZS4gSXQgY3JlYXRlcyB0aGUgbmV3IGNvbXBvbmVudHMgdGhhdCBhcmUgcmVxdWlyZWRcbiAqIGFuZCBpbnRyb2R1Y2VzIHRoZW0gdG8gZWFjaCBvdGhlci5cbiAqL1xuXG5mdW5jdGlvbiB3aXJlIChodHRwTWV0aG9kTmFtZSwgY29udGVudFNvdXJjZSwgYm9keSwgaGVhZGVycywgd2l0aENyZWRlbnRpYWxzKXtcblxuICAgdmFyIG9ib2VCdXMgPSBwdWJTdWIoKTtcbiAgIFxuICAgLy8gV2lyZSB0aGUgaW5wdXQgc3RyZWFtIGluIGlmIHdlIGFyZSBnaXZlbiBhIGNvbnRlbnQgc291cmNlLlxuICAgLy8gVGhpcyB3aWxsIHVzdWFsbHkgYmUgdGhlIGNhc2UuIElmIG5vdCwgdGhlIGluc3RhbmNlIGNyZWF0ZWRcbiAgIC8vIHdpbGwgaGF2ZSB0byBiZSBwYXNzZWQgY29udGVudCBmcm9tIGFuIGV4dGVybmFsIHNvdXJjZS5cbiAgXG4gICBpZiggY29udGVudFNvdXJjZSApIHtcblxuICAgICAgc3RyZWFtaW5nSHR0cCggb2JvZUJ1cyxcbiAgICAgICAgICAgICAgICAgICAgIGh0dHBUcmFuc3BvcnQoKSwgXG4gICAgICAgICAgICAgICAgICAgICBodHRwTWV0aG9kTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRTb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICBib2R5LFxuICAgICAgICAgICAgICAgICAgICAgaGVhZGVycyxcbiAgICAgICAgICAgICAgICAgICAgIHdpdGhDcmVkZW50aWFsc1xuICAgICAgKTtcbiAgIH1cblxuICAgY2xhcmluZXQob2JvZUJ1cyk7XG5cbiAgIGFzY2VudE1hbmFnZXIob2JvZUJ1cywgaW5jcmVtZW50YWxDb250ZW50QnVpbGRlcihvYm9lQnVzKSk7XG4gICAgICBcbiAgIHBhdHRlcm5BZGFwdGVyKG9ib2VCdXMsIGpzb25QYXRoQ29tcGlsZXIpOyAgICAgIFxuICAgICAgXG4gICByZXR1cm4gaW5zdGFuY2VBcGkob2JvZUJ1cywgY29udGVudFNvdXJjZSk7XG59XG5cbmZ1bmN0aW9uIGFwcGx5RGVmYXVsdHMoIHBhc3N0aHJvdWdoLCB1cmwsIGh0dHBNZXRob2ROYW1lLCBib2R5LCBoZWFkZXJzLCB3aXRoQ3JlZGVudGlhbHMsIGNhY2hlZCApe1xuXG4gICBoZWFkZXJzID0gaGVhZGVycyA/XG4gICAgICAvLyBTaGFsbG93LWNsb25lIHRoZSBoZWFkZXJzIGFycmF5LiBUaGlzIGFsbG93cyBpdCB0byBiZVxuICAgICAgLy8gbW9kaWZpZWQgd2l0aG91dCBzaWRlIGVmZmVjdHMgdG8gdGhlIGNhbGxlci4gV2UgZG9uJ3RcbiAgICAgIC8vIHdhbnQgdG8gY2hhbmdlIG9iamVjdHMgdGhhdCB0aGUgdXNlciBwYXNzZXMgaW4uXG4gICAgICBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGhlYWRlcnMpKVxuICAgICAgOiB7fTtcblxuICAgaWYoIGJvZHkgKSB7XG4gICAgICBpZiggIWlzU3RyaW5nKGJvZHkpICkge1xuXG4gICAgICAgICAvLyBJZiB0aGUgYm9keSBpcyBub3QgYSBzdHJpbmcsIHN0cmluZ2lmeSBpdC4gVGhpcyBhbGxvd3Mgb2JqZWN0cyB0b1xuICAgICAgICAgLy8gYmUgZ2l2ZW4gd2hpY2ggd2lsbCBiZSBzZW50IGFzIEpTT04uXG4gICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkoYm9keSk7XG5cbiAgICAgICAgIC8vIERlZmF1bHQgQ29udGVudC1UeXBlIHRvIEpTT04gdW5sZXNzIGdpdmVuIG90aGVyd2lzZS5cbiAgICAgICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gaGVhZGVyc1snQ29udGVudC1UeXBlJ10gfHwgJ2FwcGxpY2F0aW9uL2pzb24nO1xuICAgICAgfVxuICAgICAgaGVhZGVyc1snQ29udGVudC1MZW5ndGgnXSA9IGhlYWRlcnNbJ0NvbnRlbnQtTGVuZ3RoJ10gfHwgYm9keS5sZW5ndGg7XG4gICB9IGVsc2Uge1xuICAgICAgYm9keSA9IG51bGw7XG4gICB9XG5cbiAgIC8vIHN1cHBvcnQgY2FjaGUgYnVzdGluZyBsaWtlIGpRdWVyeS5hamF4KHtjYWNoZTpmYWxzZX0pXG4gICBmdW5jdGlvbiBtb2RpZmllZFVybChiYXNlVXJsLCBjYWNoZWQpIHtcblxuICAgICAgaWYoIGNhY2hlZCA9PT0gZmFsc2UgKSB7XG5cbiAgICAgICAgIGlmKCBiYXNlVXJsLmluZGV4T2YoJz8nKSA9PSAtMSApIHtcbiAgICAgICAgICAgIGJhc2VVcmwgKz0gJz8nO1xuICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJhc2VVcmwgKz0gJyYnO1xuICAgICAgICAgfVxuXG4gICAgICAgICBiYXNlVXJsICs9ICdfPScgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBiYXNlVXJsO1xuICAgfVxuXG4gICByZXR1cm4gcGFzc3Rocm91Z2goIGh0dHBNZXRob2ROYW1lIHx8ICdHRVQnLCBtb2RpZmllZFVybCh1cmwsIGNhY2hlZCksIGJvZHksIGhlYWRlcnMsIHdpdGhDcmVkZW50aWFscyB8fCBmYWxzZSApO1xufVxuXG4vLyBleHBvcnQgcHVibGljIEFQSVxuZnVuY3Rpb24gb2JvZShhcmcxKSB7XG5cbiAgIC8vIFdlIHVzZSBkdWNrLXR5cGluZyB0byBkZXRlY3QgaWYgdGhlIHBhcmFtZXRlciBnaXZlbiBpcyBhIHN0cmVhbSwgd2l0aCB0aGVcbiAgIC8vIGJlbG93IGxpc3Qgb2YgcGFyYW1ldGVycy5cbiAgIC8vIFVucGlwZSBhbmQgdW5zaGlmdCB3b3VsZCBub3JtYWxseSBiZSBwcmVzZW50IG9uIGEgc3RyZWFtIGJ1dCB0aGlzIGJyZWFrc1xuICAgLy8gY29tcGF0aWJpbGl0eSB3aXRoIFJlcXVlc3Qgc3RyZWFtcy5cbiAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vamltaGlnc29uL29ib2UuanMvaXNzdWVzLzY1XG4gICBcbiAgIHZhciBub2RlU3RyZWFtTWV0aG9kTmFtZXMgPSBsaXN0KCdyZXN1bWUnLCAncGF1c2UnLCAncGlwZScpLFxuICAgICAgIGlzU3RyZWFtID0gcGFydGlhbENvbXBsZXRlKFxuICAgICAgICAgICAgICAgICAgICAgaGFzQWxsUHJvcGVydGllc1xuICAgICAgICAgICAgICAgICAgLCAgbm9kZVN0cmVhbU1ldGhvZE5hbWVzXG4gICAgICAgICAgICAgICAgICApO1xuICAgXG4gICBpZiggYXJnMSApIHtcbiAgICAgIGlmIChpc1N0cmVhbShhcmcxKSB8fCBpc1N0cmluZyhhcmcxKSkge1xuXG4gICAgICAgICAvLyAgc2ltcGxlIHZlcnNpb24gZm9yIEdFVHMuIFNpZ25hdHVyZSBpczpcbiAgICAgICAgIC8vICAgIG9ib2UoIHVybCApXG4gICAgICAgICAvLyAgb3IsIHVuZGVyIG5vZGU6XG4gICAgICAgICAvLyAgICBvYm9lKCByZWFkYWJsZVN0cmVhbSApXG4gICAgICAgICByZXR1cm4gYXBwbHlEZWZhdWx0cyhcbiAgICAgICAgICAgIHdpcmUsXG4gICAgICAgICAgICBhcmcxIC8vIHVybFxuICAgICAgICAgKTtcblxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgLy8gbWV0aG9kIHNpZ25hdHVyZSBpczpcbiAgICAgICAgIC8vICAgIG9ib2Uoe21ldGhvZDptLCB1cmw6dSwgYm9keTpiLCBoZWFkZXJzOnsuLi59fSlcblxuICAgICAgICAgcmV0dXJuIGFwcGx5RGVmYXVsdHMoXG4gICAgICAgICAgICB3aXJlLFxuICAgICAgICAgICAgYXJnMS51cmwsXG4gICAgICAgICAgICBhcmcxLm1ldGhvZCxcbiAgICAgICAgICAgIGFyZzEuYm9keSxcbiAgICAgICAgICAgIGFyZzEuaGVhZGVycyxcbiAgICAgICAgICAgIGFyZzEud2l0aENyZWRlbnRpYWxzLFxuICAgICAgICAgICAgYXJnMS5jYWNoZWRcbiAgICAgICAgICk7XG4gICAgICAgICBcbiAgICAgIH1cbiAgIH0gZWxzZSB7XG4gICAgICAvLyB3aXJlIHVwIGEgbm8tQUpBWCwgbm8tc3RyZWFtIE9ib2UuIFdpbGwgaGF2ZSB0byBoYXZlIGNvbnRlbnQgXG4gICAgICAvLyBmZWQgaW4gZXh0ZXJuYWxseSBhbmQgdXNpbmcgLmVtaXQuXG4gICAgICByZXR1cm4gd2lyZSgpO1xuICAgfVxufVxuXG4vKiBvYm9lLmRyb3AgaXMgYSBzcGVjaWFsIHZhbHVlLiBJZiBhIG5vZGUgY2FsbGJhY2sgcmV0dXJucyB0aGlzIHZhbHVlIHRoZVxuICAgcGFyc2VkIG5vZGUgaXMgZGVsZXRlZCBmcm9tIHRoZSBKU09OXG4gKi9cbm9ib2UuZHJvcCA9IGZ1bmN0aW9uKCkge1xuICAgcmV0dXJuIG9ib2UuZHJvcDtcbn07XG5cblxuICAgaWYgKCB0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCApIHtcbiAgICAgIGRlZmluZSggXCJvYm9lXCIsIFtdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBvYm9lOyB9ICk7XG4gICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgICAgbW9kdWxlLmV4cG9ydHMgPSBvYm9lO1xuICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5vYm9lID0gb2JvZTtcbiAgIH1cbn0pKChmdW5jdGlvbigpe1xuICAgLy8gQWNjZXNzIHRvIHRoZSB3aW5kb3cgb2JqZWN0IHRocm93cyBhbiBleGNlcHRpb24gaW4gSFRNTDUgd2ViIHdvcmtlcnMgc29cbiAgIC8vIHBvaW50IGl0IHRvIFwic2VsZlwiIGlmIGl0IHJ1bnMgaW4gYSB3ZWIgd29ya2VyXG4gICAgICB0cnkge1xuICAgICAgICAgcmV0dXJuIHdpbmRvdztcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgfVxuICAgfSgpKSwgT2JqZWN0LCBBcnJheSwgRXJyb3IsIEpTT04pO1xuIiwiaW1wb3J0IHsgQ2hlc3MgfSBmcm9tICdjaGVzcy5qcyc7XG5pbXBvcnQgeyBQdXp6bGUgfSBmcm9tICcuL3B1enpsZSc7XG5cbmV4cG9ydCBjbGFzcyBBbmFseXNpcyB7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBnYW1lQW5hbHlzaXNcblxuICBjb25zdHJ1Y3RvcihnYW1lQW5hbHlzaXMpIHtcbiAgICB0aGlzLmdhbWVBbmFseXNpcyA9IGdhbWVBbmFseXNpcztcbiAgfVxuXG4gIHB1enpsZXMocGxheWVyOiBzdHJpbmcpOiBQdXp6bGVbXSB7XG4gICAgY29uc3QgY2hlc3MgPSBuZXcgQ2hlc3MoKVxuICAgIHZhciBmZW5zIDogYW55W10gPSBbXVxuICAgIHRoaXMuZ2FtZUFuYWx5c2lzLm1vdmVzLnNwbGl0KCcgJykuZm9yRWFjaCh4ID0+IHtcbiAgICAgZmVucy5wdXNoKGNoZXNzLmZlbigpKVxuICAgICBjaGVzcy5tb3ZlKHgpXG4gICAgfSlcbiAgICBsZXQgbW92ZXMgPSBjaGVzcy5oaXN0b3J5KHt2ZXJib3NlOiB0cnVlfSlcbiAgICBtb3Zlcy5mb3JFYWNoKChtb3ZlLGkpID0+IHtcbiAgICAgIGlmICgodGhpcy5nYW1lQW5hbHlzaXMuYW5hbHlzaXNbaV0pICYmICh0aGlzLmdhbWVBbmFseXNpcy5hbmFseXNpc1tpXS5qdWRnbWVudCkpIHtcbiAgICAgICBjb25zdCBiZXN0ID0gdGhpcy5nYW1lQW5hbHlzaXMuYW5hbHlzaXNbaV0uYmVzdDtcbiAgICAgICB0aGlzLmdhbWVBbmFseXNpcy5hbmFseXNpc1tpXS5tb3ZlID0gbW92ZVxuICAgICAgIHRoaXMuZ2FtZUFuYWx5c2lzLmFuYWx5c2lzW2ldLmhhbGZNb3ZlID0gaSsxXG4gICAgICAgdGhpcy5nYW1lQW5hbHlzaXMuYW5hbHlzaXNbaV0uZmVuID0gZmVuc1tpXVxuICAgICAgIHRoaXMuZ2FtZUFuYWx5c2lzLmFuYWx5c2lzW2ldLmJlc3QgPSB7ZnJvbTpiZXN0LnN1YnN0cmluZygwLCAyKSwgdG86YmVzdC5zdWJzdHJpbmcoMiwgNCl9XG4gICAgICAgdGhpcy5nYW1lQW5hbHlzaXMuYW5hbHlzaXNbaV0uc3BlZWQgPSB0aGlzLmdhbWVBbmFseXNpcy5zcGVlZFxuICAgICAgIHRoaXMuZ2FtZUFuYWx5c2lzLmFuYWx5c2lzW2ldLmlkID0gdGhpcy5nYW1lQW5hbHlzaXMuaWRcbiAgICAgIH1cbiAgICB9KVxuICAgIHZhciB3aGl0ZVVzZXIgPSB0aGlzLmdhbWVBbmFseXNpcy5wbGF5ZXJzLndoaXRlLnVzZXJcbiAgICB2YXIgcGxheWVyQ29sb3VyOiBzdHJpbmcgPSAod2hpdGVVc2VyICYmICh3aGl0ZVVzZXIuaWQgPT0gcGxheWVyKSkgPyAndyc6J2InXG4gICAgcmV0dXJuIHRoaXMuZ2FtZUFuYWx5c2lzLmFuYWx5c2lzID0gdGhpcy5nYW1lQW5hbHlzaXMuYW5hbHlzaXNcbiAgICAgIC5maWx0ZXIoKHgsaSkgID0+IGk+MCAmJiB0aGlzLmdhbWVBbmFseXNpcy5hbmFseXNpc1tpLTFdLmV2YWwgPCAzMDAgJiYgdGhpcy5nYW1lQW5hbHlzaXMuYW5hbHlzaXNbaS0xXS5ldmFsID4gLTMwMClcbiAgICAgIC5maWx0ZXIoeCA9PiB4Lmp1ZGdtZW50ICYmIHguanVkZ21lbnQubmFtZSA9PSBcIkJsdW5kZXJcIilcbiAgICAgIC5maWx0ZXIoeCA9PiB4Lm1vdmUuY29sb3IgPT0gcGxheWVyQ29sb3VyKVxuICAgICAgLm1hcCh4ID0+IG5ldyBQdXp6bGUoeCwgdGhpcy5nYW1lQW5hbHlzaXMpKVxuICB9XG59XG4iLCJpbXBvcnQgeyBDaGVzcyB9IGZyb20gJ2NoZXNzLmpzJztcbmltcG9ydCB7IFB1enpsZSB9IGZyb20gJy4vcHV6emxlJztcbmltcG9ydCB7IHRvQ29sb3IgfSBmcm9tICcuL3V0aWwnXG5cbmV4cG9ydCBmdW5jdGlvbiBjb2xvdXIoeDpzdHJpbmcpIHtcbiAgcmV0dXJuIChwOiBQdXp6bGUpID0+IHtcbiAgICBjb25zdCBjaGVzcyA9IG5ldyBDaGVzcyhwLmFuYWx5c2lzLmZlbilcbiAgICBpZiAoeCA9PT0gJycpIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIHRvQ29sb3IoY2hlc3MpID09PSB4XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldmVyaXR5KHg6c3RyaW5nKSB7XG4gIHJldHVybiAocDogUHV6emxlKSA9PiB7XG4gICAgaWYgKHggPT09ICcnKSByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBwLmFuYWx5c2lzLmp1ZGdtZW50Lm5hbWUgPT09ICdCbHVuZGVyJ1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwaGFzZSh4OnN0cmluZykge1xuICByZXR1cm4gKHA6IFB1enpsZSkgPT4ge1xuICAgIGlmICh4ID09PSAnJykgcmV0dXJuIHRydWVcbiAgICBpZiAoeCA9PSAnT3BlbmluZycpIHtcbiAgICAgIHJldHVybiBwLmFuYWx5c2lzLmhhbGZNb3ZlIDwgMjBcbiAgICB9XG4gICAgaWYgKHggPT09ICdFbmRnYW1lJykge1xuICAgICAgY29uc3QgZmVuID0gcC5hbmFseXNpcy5mZW5cbiAgICAgIGNvbnN0IHBpZWNlcyA9IGZlbi5yZXBsYWNlKC8gLiokLywnJykucmVwbGFjZSgvWzAtOSBwUC1dL2csJycpXG4gICAgICByZXR1cm4gcGllY2VzLmxlbmd0aCA8PSA3ICsgNlxuICAgIH1cbiAgICByZXR1cm4gIXBoYXNlKCdPcGVuaW5nJykocCkgJiYgIShwaGFzZSgnRW5kZ2FtZScpKHApKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aW1lY29udHJvbCh4OnN0cmluZykge1xuICByZXR1cm4gKHA6IFB1enpsZSkgPT4ge1xuICAgIGlmICh4ID09PSAnJykgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gcC5hbmFseXNpcy5zcGVlZCA9PT0geFxuICB9XG59XG4iLCJpbXBvcnQgKiBhcyBvYm9lIGZyb20gJ29ib2UnO1xuXG5leHBvcnQgY2xhc3MgTGljaGVzc0FwaSB7XG5cbiAgcHJpdmF0ZSByZWFkb25seSB1cmw6IHN0cmluZ1xuXG4gIGNvbnN0cnVjdG9yKHVybCkge1xuICAgIHRoaXMudXJsID0gdXJsXG4gIH1cblxuICBnYW1lcyh1c2VyLCBpdGVtcywgaXRlbUNhbGxiYWNrLCBjb21wbGV0ZUNhbGxiYWNrKSB7XG5cdFx0dmFyIGFsbDogYW55W10gPSBbXTtcblx0XHRjb25zdCBmaXhlZFF1ZXJ5UGFyYW1zID0gXCImcGVyZlR5cGU9cmFwaWQsY2xhc3NpY2FsXCIgK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICAgICBcIiZhbmFseXNlZD10cnVlJmV2YWxzPXRydWUmbW92ZXM9dHJ1ZSZyYXRlZD10cnVlXCJcblx0XHRvYm9lKHtcblx0XHRcdG1ldGhvZDogXCJHRVRcIixcblx0XHRcdHVybDogdGhpcy51cmwgKyBcIi9nYW1lcy9leHBvcnQvXCIgKyB1c2VyICsgXCI/bWF4PVwiICsgaXRlbXMgKyBmaXhlZFF1ZXJ5UGFyYW1zLFxuXHRcdFx0aGVhZGVyczogeyBBY2NlcHQ6IFwiYXBwbGljYXRpb24veC1uZGpzb25cIiB9LFxuXHRcdH0pLm5vZGUoXCIhXCIsIGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdGFsbC5wdXNoKGRhdGEpO1xuXHRcdFx0aXRlbUNhbGxiYWNrKGRhdGEpO1xuXHRcdH0pLm9uKFwiZW5kXCIsIGZ1bmN0aW9uKHt9KSB7XG5cdFx0XHRjb21wbGV0ZUNhbGxiYWNrKCk7XG5cdFx0fSkuZmFpbChmdW5jdGlvbihlcnJvclJlcG9ydCkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihKU09OLnN0cmluZ2lmeShlcnJvclJlcG9ydCkpO1xuXHRcdH0pO1xuXHR9XG59XG4iLCJleHBvcnQgeyBMaWNoZXNzQXBpIH0gZnJvbSAnLi9saWNoZXNzQXBpJ1xuZXhwb3J0IHsgQW5hbHlzaXMgfSBmcm9tICcuL2FuYWx5c2lzJ1xuZXhwb3J0IHsgY29sb3VyLCBzZXZlcml0eSwgcGhhc2UsIHRpbWVjb250cm9sIH0gZnJvbSAnLi9maWx0ZXJzJztcbiIsImltcG9ydCB7IENoZXNzIH0gZnJvbSBcImNoZXNzLmpzXCJcbmltcG9ydCB7IENvbG9yIH0gZnJvbSBcImNoZXNzZ3JvdW5kL3R5cGVzXCJcbmltcG9ydCB7IHRvQ29sb3IgfSBmcm9tIFwiLi91dGlsXCJcblxuZXhwb3J0IGNsYXNzIFB1enpsZSB7XG4gIHJlYWRvbmx5IGFuYWx5c2lzXG4gIHByaXZhdGUgZ2FtZVxuXG4gIGNvbnN0cnVjdG9yKGFuYWx5c2lzLCBnYW1lKSB7XG4gICAgdGhpcy5hbmFseXNpcyA9IGFuYWx5c2lzXG4gICAgdGhpcy5nYW1lID0gZ2FtZVxuICB9XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gdGhpcy51cmwodGhpcy5hbmFseXNpcywgdGhpcy5nYW1lKVxuICB9XG5cbiAgdXJsKGFuYWx5c2lzLCBnYW1lKSB7XG4gICAgY29uc3QgY2hlc3MgPSBuZXcgQ2hlc3MoYW5hbHlzaXMuZmVuKVxuICAgIGxldCBjb2xvcjogQ29sb3IgPSB0b0NvbG9yKGNoZXNzKVxuICAgIGNvbnN0IHR1cm5OdW1iZXIgPSBwYXJzZUludChhbmFseXNpcy5mZW4ubWF0Y2goL1xcZCskLylbMF0pXG4gICAgbGV0IHZhcmlhdGlvbiA9IGFuYWx5c2lzLnZhcmlhdGlvbi5zcGxpdChcIiBcIilcbiAgICB2YXJpYXRpb24uZm9yRWFjaChmdW5jdGlvbiAobW92ZSkge1xuICAgICAgY2hlc3MubW92ZShtb3ZlKVxuICAgIH0pXG4gICAgY2hlc3MuaGVhZGVyKCdXaGl0ZScsIGdhbWUucGxheWVycy53aGl0ZS51c2VyLm5hbWUpXG4gICAgY2hlc3MuaGVhZGVyKCdCbGFjaycsIGdhbWUucGxheWVycy5ibGFjay51c2VyLm5hbWUpXG4gICAgY2hlc3MuaGVhZGVyKCdXaGl0ZUVsbycsIGdhbWUucGxheWVycy53aGl0ZS5yYXRpbmcudG9TdHJpbmcoKSlcbiAgICBjaGVzcy5oZWFkZXIoJ0JsYWNrRWxvJywgZ2FtZS5wbGF5ZXJzLmJsYWNrLnJhdGluZy50b1N0cmluZygpKVxuICAgIGNoZXNzLmhlYWRlcignRXZlbnQnLCBgaHR0cHM6Ly9saWNoZXNzLm9yZy8ke2FuYWx5c2lzLmlkfS8ke2NvbG9yfSMke2FuYWx5c2lzLmhhbGZNb3ZlIC0gMX1gKVxuICAgIGxldCBjcmVhdGVkRGF0ZSA9IG5ldyBEYXRlKGdhbWUuY3JlYXRlZEF0KVxuICAgIGxldCBjcmVhdGVkRGF0ZVN0cmluZyA9IGAke2NyZWF0ZWREYXRlLmdldEZ1bGxZZWFyKCl9LiR7Y3JlYXRlZERhdGUuZ2V0TW9udGgoKSsxfS4ke2NyZWF0ZWREYXRlLmdldERhdGUoKX1gXG4gICAgY2hlc3MuaGVhZGVyKCdEYXRlJywgY3JlYXRlZERhdGVTdHJpbmcpXG5cbiAgICBsZXQgcGduID0gY2hlc3MucGduKClcbiAgICBjb25zdCBmaXJzdE1vdmUgID0gdmFyaWF0aW9uWzBdXG4gICAgY29uc3QgdG9SZXBsYWNlID0gYCR7dHVybk51bWJlcn0uICR7Zmlyc3RNb3ZlfWBcblxuICAgIGNvbnN0IGJsdW5kZXIgPSBgJHt0dXJuTnVtYmVyfS4gJHtmaXJzdE1vdmV9IHsgYmx1bmRlcjogJHthbmFseXNpcy5ldmFsIHx8IGFuYWx5c2lzLm1hdGUgfX0gKCR7dHVybk51bWJlcn0uICR7YW5hbHlzaXMubW92ZS5zYW59KSAke3R1cm5OdW1iZXJ9Li4uIGBcbiAgICBwZ24gPSBwZ24ucmVwbGFjZSh0b1JlcGxhY2UsIGJsdW5kZXIpICsgJyAqJ1xuICAgIHJldHVybiBwZ25cbiAgfVxuXG59XG4iLCJcbmV4cG9ydCBmdW5jdGlvbiB0b0Rlc3RzKGNoZXNzOiBhbnkpIHtcbiAgY29uc3QgZGVzdHMgPSB7fTtcbiAgY2hlc3MuU1FVQVJFUy5mb3JFYWNoKHMgPT4ge1xuICAgIGNvbnN0IG1zID0gY2hlc3MubW92ZXMoe3NxdWFyZTogcywgdmVyYm9zZTogdHJ1ZX0pO1xuICAgIGlmIChtcy5sZW5ndGgpIGRlc3RzW3NdID0gbXMubWFwKG0gPT4gbS50byk7XG4gIH0pO1xuICByZXR1cm4gZGVzdHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0NvbG9yKGNoZXNzOiBhbnkpIHtcbiAgcmV0dXJuIChjaGVzcy50dXJuKCkgPT09ICd3JykgPyAnd2hpdGUnIDogJ2JsYWNrJztcbn1cbiJdfQ==
