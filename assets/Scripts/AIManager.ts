import {_decorator, Component} from 'cc';
import {Board} from "db://assets/Scripts/Board";
import {EGameTurn} from "db://assets/Scripts/GameManager";

const {ccclass, property} = _decorator;

@ccclass('AIManager')
export class AIManager extends Component {

    private board: Board;

    getBoard(board: Board) {
        this.board = board;
    }

    // 極值演算法(其實就是窮舉法）
    getAIBestMove(): number {
        let bestScore = -Infinity;
        let bestMove = -1;

        // let emptyCells = this.board.getLegalCells();
        for (let i = 0; i < 9; i++) {
            if (this.board.canPut(i)) {
                this.board.chessMove(i, EGameTurn.AI)
                let score: number = this.MiniMax(this.board, 0, false);
                this.board.deleteCell(i);

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        return bestMove;
    };


    MiniMax(board: Board, takeTime: number, isAiTurn: boolean): number {

        // 判斷勝負、平手
        if (board.checkWin(EGameTurn.AI)) return 10 - takeTime;
        if (board.checkWin(EGameTurn.Player)) return takeTime - 10;
        if (board.checkDraw()) return 0;

        if (!isAiTurn) {   // 人類下子
            let miniScore = Infinity;

            for (let i = 0; i < 9; i++) {
                if (board.canPut(i)) {
                    board.chessMove(i, EGameTurn.Player);
                    let score: number = this.MiniMax(board, takeTime + 1, true);
                    board.deleteCell(i);
                    miniScore = Math.min(miniScore, score);
                }
            }
            return miniScore;
        }

        if (isAiTurn) {
            let maxScore: number = -Infinity;

            for (let i = 0; i < 9; i++) {
                if (board.canPut(i)) {
                    board.chessMove(i, EGameTurn.AI);
                    let score: number = this.MiniMax(board, takeTime + 1, false);
                    board.deleteCell(i);
                    maxScore = Math.max(maxScore, score);
                }
            }
            return maxScore;
        }
    }
}

