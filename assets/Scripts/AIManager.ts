import {_decorator, Component} from 'cc';
import {EGameTurn, GameManager} from "db://assets/Scripts/GameManager";

const {ccclass, property} = _decorator;

@ccclass('AIManager')
export class AIManager extends Component {

    private manager: GameManager;

    getManager(manager: GameManager) {
        this.manager = manager;
    }

    // 極值演算法(其實就是窮舉法）
    getAIBestMove(): number {
        let bestScore = -Infinity;
        let bestMove = -1;

        // let emptyCells = this.manager.getLegalCells();
        for (let i = 0; i < 9; i++) {
            if (this.manager.canPut(i)) {
                this.manager.chessMove(i, EGameTurn.AI)
                let score: number = this.miniMax(0, false);
                this.manager.deleteCell(i);

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        return bestMove;
    };


    miniMax(takeTime: number, isAiTurn: boolean): number {

        // 判斷勝負、平手
        if (this.manager.checkWin(EGameTurn.AI)) {
            return 10 - takeTime;
        }
        if (this.manager.checkWin(EGameTurn.Player)) {
            return takeTime - 10;
        }
        if (this.manager.checkDraw()) {
            return 0;
        }

        if (!isAiTurn) {   // 人類下子
            let miniScore = Infinity;

            for (let i = 0; i < 9; i++) {
                if (this.manager.canPut(i)) {
                    this.manager.chessMove(i, EGameTurn.Player);
                    let score: number = this.miniMax(takeTime + 1, true);
                    this.manager.deleteCell(i);
                    miniScore = Math.min(miniScore, score);
                }
            }
            return miniScore;
        }

        if (isAiTurn) {
            let maxScore: number = -Infinity;

            for (let i = 0; i < 9; i++) {
                if (this.manager.canPut(i)) {
                    this.manager.chessMove(i, EGameTurn.AI);
                    let score: number = this.miniMax(takeTime + 1, false);
                    this.manager.deleteCell(i);
                    maxScore = Math.max(maxScore, score);
                }
            }
            return maxScore;
        }
    }
}

