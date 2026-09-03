import {_decorator, Button, Component, Node} from 'cc';
import {OXButton} from "db://assets/Scriipts/OXButton";
import {GameManager} from "db://assets/Scriipts/GameManager";
import {Board} from "db://assets/Scriipts/Board";

const {ccclass, property} = _decorator;

@ccclass('ViewManager')
export class ViewManager extends Component {

    private board: Board;
    
    // 9個按鈕
    @property(Node) buttonParent: Node = null;
    buttons: OXButton[] = [];
    private _playerMove: number = -1;
    get playerMove(): number {
        return this._playerMove;
    }

    private set playerMove(value: number) {
        this._playerMove = value;
    }

    onLoad() {
        this.buttons = this.buttonParent.getComponentsInChildren(OXButton);
        this.buttons.forEach((b, sibling) => {
            b.installButton(sibling, this);
        });
    }

    onButtonClick(index: number) {
        // todo: 傳送資訊給gameManager
        this.playerMove = index;
    }

    boardInfoUpdate() {

    }

    getBoard(board: Board) {
        this.board = board;
    }
}

