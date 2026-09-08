import {_decorator, Button, Component, director, EventHandler, instantiate, Label, Node, Prefab, SpriteFrame} from 'cc';
import {OXButton} from "db://assets/Scripts/OXButton";
import {EGameTurn} from "./GameManager";
import {Board} from "./Board";

const {ccclass, property} = _decorator;

@ccclass('ViewManager')
export class ViewManager extends Component {
    @property({type: Button, displayName: `開新遊戲`}) newGameBtn: Button = null;
    @property({type: SpriteFrame, displayName: `０是Ｏ，１是Ｘ`}) OXsprite: SpriteFrame[] = [];
    @property(Label) resultLabel: Label = null;
    private board: Board;

    // 9個按鈕
    @property(Node) buttonParent: Node = null;
    @property(Prefab) preButton: Node = null;

    buttons: OXButton[] = [];
    
    // 拿去給外部注入用
    public onCellClicked: (index: number) => void = null;

    onLoad() {
        // 改用動態生成 prefab
        // Node.Instantiate()        
        for (let i = 0; i < 9; i++) {
            this.buttonParent.addChild(instantiate(this.preButton));
        }
        this.buttons = this.buttonParent.getComponentsInChildren(OXButton);

        // todo: InstallButton()
        this.buttons.forEach((b, sibling) => {
            let btn = b.getComponent(Button);
            this.InstallButton(btn, sibling);
        });
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


    private InstallButton(button: Button, sibling: number) {
        const handler = new EventHandler();
        handler.target = this.node;            // 接收事件的 Node (ViewManager 所在的 Node)
        handler.component = 'ViewManager';     // 腳本類別名稱
        handler.handler = 'onBtnClickInternal';// 內部接收處理的 public 函式
        handler.customEventData = sibling.toString(); // 💡 注意：customEventData 只能傳 string

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

