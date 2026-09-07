import {_decorator, Button, Component, director, Label, Node, SpriteFrame} from 'cc';
import {OXButton} from "db://assets/Scripts/OXButton";
import {EGameTurn} from "./GameManager";

const {ccclass, property} = _decorator;

@ccclass('ViewManager')
export class ViewManager extends Component {
    @property({type: Button, displayName: `開新遊戲`}) newGameBtn: Button = null;
    @property({type: SpriteFrame, displayName: `０是Ｏ，１是Ｘ`}) OXsprite: SpriteFrame[] = [];
    @property(Label) resultLabel: Label = null;
    private board: Board;

    // 9個按鈕
    @property(Node) buttonParent: Node = null;
    buttons: OXButton[] = [];
    private _playerMove: number = -1;
    
    // 拿去給外部注入用
    public onCellClicked: (index: number) => void = null;

    get playerMove(): number {
        return this._playerMove;
    }

    set playerMove(value: number) {
        this._playerMove = value;
    }

    onLoad() {
        // 改用動態生成 prefab
        this.buttons = this.buttonParent.getComponentsInChildren(OXButton);
        
        // todo: InstallButton()
        this.buttons.forEach((b, sibling) => {
            this.InstallButton(b, sibling);
        });
        
        this.buttons.forEach((b, sibling) => {
            b.installButton(sibling, (index) => this.onButtonClick(index));
            // b.node.on()
        });
    }

    onButtonClick(index: number) {
        if (this.board.canPut(index)) {
            // 傳送資訊給gameManager
            director.emit(`onButtonClicked`, index);
        }
    }

    boardInfoUpdate(newStep: number, currentTurn: EGameTurn) {
        console.log(`currentTurn: ${currentTurn}`);
        let OX = this.OXsprite[currentTurn];
        this.buttons[newStep].showSymbol(OX);
    }

    getBoard(board: Board) {
        this.board = board;
    }

    showResult(currentTurn: EGameTurn) {
        let message: string = "";
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


    private InstallButton(button: Button, sibling: number) {
        const handler = new EventHandler();
        handler.target = this.node;            // 接收事件的 Node (ViewManager 所在的 Node)
        handler.component = 'ViewManager';     // 腳本類別名稱
        handler.handler = 'onBtnClickInternal';// 內部接收處理的 public 函式
        handler.customEventData = sibling; // 💡 注意：customEventData 只能傳 string

        // 2. 推進按鈕的 clickEvents 陣列
        button.clickEvents.push(handler);
    }

    onBtnClickInternal(event: Event, customData: string) {
        const index = parseInt(customData);
        if (this.onCellClicked) {
            this.onCellClicked(index);
        }
    }
}

export class Board {
    private readonly cellsMarkType: EGameTurn[] = new Array(9).fill(EGameTurn.Over);

    private readonly winLines: number[][] = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];


    getCellMarkType(): EGameTurn[] {
        return [...this.cellsMarkType];
    }

    canPut(index: number): boolean {
        return this.cellsMarkType[index] == EGameTurn.Prepare;
    }

    public getCell(index: number): EGameTurn {
        return this.cellsMarkType[index];
    }

    public deleteCell(index: number): void {
        this.cellsMarkType[index] = EGameTurn.Prepare;
    }

    cloneBoard(): Board {
        return
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
}
