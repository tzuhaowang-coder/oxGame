import {_decorator, Button, Component, EventHandler, instantiate, Label, Prefab, SpriteFrame, Node, tween} from 'cc';
import {AIManager} from "db://assets/Scripts/AIManager";
import {OXButton} from "db://assets/Scripts/OXButton";

const {ccclass, property} = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Button) resetGameButton: Button = null;
    @property(AIManager) aiManager: AIManager = null;
    @property({type: SpriteFrame, displayName: `０是Ｏ，１是Ｘ`}) OXsprite: SpriteFrame[] = [];
    @property(Label) resultLabel: Label = null;

    // 9個按鈕
    @property(Node) buttonParent: Node = null;
    @property(Prefab) preButton: Node = null;

    private readonly cellsMarkType: EGameTurn[] = new Array(9).fill(EGameTurn.Over);

    private readonly winLines: number[][] = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

    buttons: OXButton[] = [];

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
                let firstMove: boolean = this.aiFirstMove();
                if (firstMove) {
                    let rate = Math.random();
                    let noobMove = rate >= 0.3; // 7成機率亂下
                    if (noobMove) {
                        this.scheduleOnce(() => {
                            this.aiNoobMove();
                        }, 0.5);
                    } else {
                        this.scheduleOnce(() => {
                            this.AIThinkingAndMove();
                        }, 0.5);
                    }
                } else {
                    this.scheduleOnce(() => {
                        this.AIThinkingAndMove();
                    }, 0.5);
                }


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
        this.installResetBtn();

        for (let i = 0; i < 9; i++) {
            this.buttonParent.addChild(instantiate(this.preButton));
        }
        this.buttons = this.buttonParent.getComponentsInChildren(OXButton);

        this.aiManager.getManager(this);

        this.buttons.forEach((b, sibling) => {
            let btn = b.getComponent(Button);
            b.installButton(this, sibling);
        });
    }

    private moveAndUpdate(index: number) {

        // 下子
        this.chessMove(index, this.currentTurn);

        // 更新畫面
        this.boardInfoUpdate(index, this.currentTurn);

        if (this.checkWin(this.currentTurn)) {   // 有人贏了
            console.log(`有人贏了是${this.currentTurn}，${this.cellsMarkType}`);
            this.showResult(this.currentTurn);
            this.currentTurn = EGameTurn.Over;

            return;
        }
        if (this.checkDraw()) {
            console.log(`平手，${this.cellsMarkType}`);
            this.showResult(3);
            this.currentTurn = EGameTurn.Over;
            return;
        }

        this.changeTurn();
    }

    playerChessMove(event: Event, data: string) {
        let index = parseInt(data);
        if ((this._isGameOver) || (this.currentTurn != EGameTurn.Player)) {
            return;
        }   // not my turn

        console.log(`onButtonClicked`);

        this.moveAndUpdate(index);
    }

    private AIThinkingAndMove() {
        console.log("AIThinkingAndMove");
        let bestMove = this.aiManager.getAIBestMove();
        this.moveAndUpdate(bestMove);
    }

    private aiNoobMove() {
        console.log("AI NoobMove");
        let move = this.getAINoobMove();
        this.moveAndUpdate(move);
    }

    private getAINoobMove(): number {
        let noobMovesArray = [1, 3, 5, 7];

        let validMoves = noobMovesArray.filter(index => this.canPut(index));
        let randomPickIndex = Math.floor(Math.random() * validMoves.length);

        return validMoves[randomPickIndex];
    }

    private changeTurn() {
        console.log(`changeTurn`);
        this.currentTurn = this.currentTurn == EGameTurn.Player ? EGameTurn.AI : EGameTurn.Player;
    }

    newGame() {
        console.log(`new game`);
        this.clearAllCells();
        this.boardClear();

        // player always go first
        this.currentTurn = EGameTurn.Player;
        this._isGameOver = false;
    }


    private installResetBtn() {
        const handler = new EventHandler();
        handler.target = this.node;
        handler.component = `GameManager`;
        handler.handler = `newGame`;
        handler.customEventData = ``;

        this.resetGameButton.clickEvents.push(handler);
    }

    boardInfoUpdate(newStep: number, currentTurn: EGameTurn) {
        console.log(`currentTurn: ${currentTurn}`);
        let OX = this.OXsprite[currentTurn];
        this.buttons[newStep].showSymbol(OX);
    }

    showResult(currentTurn: EGameTurn) {
        let message: string;
        switch (currentTurn) {
            case 0:     //O
                message = `O wins`;
                break;
            case 1:     //X
                message = `X Wins`;
                break;
            default:    // draw
                message = `Draw`;
                break;
        }
        this.resultLabel.string = message;
    }

    boardClear() {
        this.buttons.forEach(b => b.clearSymbol());
        this.resultLabel.string = ``;
    }

    canPut(index: number): boolean {
        return this.cellsMarkType[index] == EGameTurn.Prepare;
    }

    deleteCell(index: number): void {
        this.cellsMarkType[index] = EGameTurn.Prepare;
    }

    chessMove(index: number, whoseTurn: EGameTurn): void {
        this.cellsMarkType[index] = whoseTurn;
    }

    checkWin(markType: EGameTurn) {
        // console.log(`markType is ${markType}}`)
        for (let i = 0; i < this.winLines.length; i++) {
            let line = this.winLines[i];
            if (this.cellsMarkType[line[0]] === markType &&
                this.cellsMarkType[line[1]] === markType &&
                this.cellsMarkType[line[2]] === markType) {
                return true;
            }
        }
        return false;
    }

    checkDraw(): boolean {

        // 如果沒分出勝負但是所有的格子都填滿了，就是平手
        return this.cellsMarkType.every((cell: EGameTurn) => {
            return cell !== EGameTurn.Prepare;
        })
    }

    clearAllCells(): void {
        this.cellsMarkType.fill(EGameTurn.Prepare);
    }

    aiFirstMove(): boolean {
        let count = 0;
        for (let i = 0; i < this.cellsMarkType.length; i++) {
            if (!this.canPut(i)) {
                count++;
            }
            if (count > 1) {
                return false;
            }
        }
        return true;
    }
}

export enum EGameTurn {
    Player, AI, Over, Prepare
}