import {_decorator, Button, Component, EventHandler, Node, Sprite, SpriteFrame} from 'cc';
import {GameManager} from "db://assets/Scripts/GameManager";

const {ccclass, property} = _decorator;

@ccclass('OXButton')
export class OXButton extends Component {
    private mark: Sprite;

    onLoad() {
        this.mark = this.node.getComponent(Sprite);
    }

    // onDestroy() {
    //     this.node.targetOff(this);
    // }

    showSymbol(OX: SpriteFrame) {
        this.mark.spriteFrame = OX;
    }

    clearSymbol() {
        this.mark.spriteFrame = null;
    }

    installButton(gameManager: GameManager, sibling: number) {
        const handler = new EventHandler();
        handler.target = gameManager.node;            // 接收事件的 Node (ViewManager 所在的 Node)
        handler.component = 'GameManager';     // 腳本類別名稱
        handler.handler = `playerChessMove`;// 內部接收處理的 public 函式
        handler.customEventData = sibling.toString(); // 💡 注意：customEventData 只能傳 string

        // 2. 推進按鈕的 clickEvents 陣列
        this.getComponent(Button).clickEvents.push(handler);
    }
}

