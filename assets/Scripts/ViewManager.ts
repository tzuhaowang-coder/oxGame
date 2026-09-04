import {_decorator, Button, Component, director, Label, Node, SpriteFrame} from 'cc';
import {Board} from "db://assets/Scripts/Board";
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
    get playerMove(): number {
        return this._playerMove;
    }

    set playerMove(value: number) {
        this._playerMove = value;
    }

    onLoad() {
        console.log('onLoad');

        this.buttons = this.buttonParent.getComponentsInChildren(OXButton);
        this.buttons.forEach((b, sibling) => {
            b.installButton(sibling, (index) => this.onButtonClick(index));
        });
    }

    onButtonClick(index: number) {

        // 傳送資訊給gameManager
        director.emit(`onButtonClicked`, index);
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
        this.buttons.forEach(b=>b.clearSymbol());
    }
}

