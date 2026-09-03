import {_decorator, Component, Node} from 'cc';
import {Board} from "db://assets/Scriipts/Board";
import {AIManager} from "db://assets/Scriipts/AIManager";
import {ViewManager} from "db://assets/Scriipts/ViewManager";

const {ccclass, property} = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(AIManager) aiManager: AIManager = null;
    @property(ViewManager) viewManager: ViewManager = null;
    board: Board = null;
    // 判斷換誰
    _currentTurn: EGameTurn = EGameTurn.Prepare;

    private _isGameOver: boolean = false;

    onBoardInfoUpdated(): void {
        
    }

    get currentTurn() {
        return this._currentTurn;
    }

    set currentTurn(value: EGameTurn) {
        this._currentTurn = value;

        switch (value) {
            case EGameTurn.AI:
                let index = this.aiManager.getAIBestMove();
                this.doChessMove(index);

                break;
            case EGameTurn.Prepare:
                this._isGameOver = true;
                break;
        }
    }

    start() {
        this.board = new Board();
        this.viewManager.getBoard(this.board);
    }

    doChessMove(index: number) {
        this.board.chessMove(index, this._currentTurn);
    }
}

export enum EGameTurn {
    Player, AI, Over, Prepare
}