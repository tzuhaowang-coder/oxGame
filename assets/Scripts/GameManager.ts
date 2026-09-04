import {_decorator, Component, director, Node} from 'cc';
import {AIManager} from "db://assets/Scripts/AIManager";
import {ViewManager} from "db://assets/Scripts/ViewManager";
import {Board} from "db://assets/Scripts/Board";

const {ccclass, property} = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(AIManager) aiManager: AIManager = null;
    @property(ViewManager) viewManager: ViewManager = null;
    board: Board = null;
    // 判斷換誰
    _currentTurn: EGameTurn = EGameTurn.Prepare;

    private _isGameOver: boolean = true;

    get currentTurn() {
        return this._currentTurn;
    }

    set currentTurn(value: EGameTurn) {
        this._currentTurn = value;

        switch (value) {
            case EGameTurn.AI:
                this.AIThinkingAndMove();

                break;
            case EGameTurn.Prepare:
                this._isGameOver = false;

                break;
            case EGameTurn.Over:
                this._isGameOver = true;
                break;
        }
    }

    onLoad() {
        this.board = new Board();
        this.viewManager.getBoard(this.board);
        this.aiManager.getBoard(this.board);

        director.on(`onButtonClicked`, this.playerChessMove, this);

    }

    newGame() {
        console.log(`new game`);
        this.board.clearAllCells();
        this.viewManager.boardClear();

        // player always go first
        this.currentTurn = EGameTurn.Player;
        this._isGameOver = false;
    }

    playerChessMove(index: number) {
        if ((this._isGameOver) || (this.currentTurn != EGameTurn.Player)) return;   // not my turn

        console.log(`onButtonClicked`);

        this.moveAndUpdate(index);

    }

    private moveAndUpdate(index: number) {

        this.board.chessMove(index, this.currentTurn);
        // 更新畫面
        this.onBoardInfoUpdated(index);

        if (this.board.checkWin(this.currentTurn)) {   // 有人贏了
            console.log(`有人贏了是${this.currentTurn}，${this.board.getCellMarkType()}`);
            this.viewManager.showResult(this.currentTurn);
            this.currentTurn = EGameTurn.Over;

            return;
        }
        if (this.board.checkDraw()) {
            console.log(`平手，${this.board.getCellMarkType()}`);
            this.viewManager.showResult(3);
            this.currentTurn = EGameTurn.Over;
            return;
        }

        this.changeTurn();
    }

    onBoardInfoUpdated(newStep: number): void {
        //todo: 更新盤面
        console.log(`onBoardInfoUpdated`);
        this.viewManager.boardInfoUpdate(newStep, this.currentTurn);
    }

    private AIThinkingAndMove() {
        console.log("AIThinkingAndMove");
        let bestMove = this.aiManager.getAIBestMove();
        this.moveAndUpdate(bestMove);
    }

    private changeTurn() {
        console.log(`changeTurn`);
        this.currentTurn = this.currentTurn == EGameTurn.Player ? EGameTurn.AI : EGameTurn.Player;
    }
}

export enum EGameTurn {
    Player, AI, Over, Prepare
}