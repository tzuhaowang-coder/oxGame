import {_decorator, Component, Node, Sprite, SpriteFrame, SpriteRenderer} from 'cc';
import {EGameTurn} from "db://assets/Scripts/GameManager";

const {ccclass, property} = _decorator;

@ccclass('OXButton')
export class OXButton extends Component {
    private mark: Sprite;

    onLoad() {
        this.mark = this.node.getComponent(Sprite);
    }

    // delegate
    onClickButton(index: number, event: (para: number) => void) {
        event(index);
    }

    get gridValue(): EGameTurn {
        return this._gridValue;
    }

    set gridValue(value: number) {
        this._gridValue = value;
        // todo: 
    }

    private _index: number = -1;

    // 有值的時候就是已經有圖案
    private _gridValue: number = undefined;


    installButton(index: number, onClick: (index: any) => void) {
        this._index = index;

        // 訂閱點擊事件
        this.node.on("mouse-down", () => {
            if (this.gridValue == 0 || this.gridValue == 1) return;    // 代表已有圖案

            this.onClickButton(this._index, onClick);
            // console.log('click');
        });
    }


    onDestroy() {
        this.node.targetOff(this);
    }

    showSymbol(OX: SpriteFrame) {
        this.mark.spriteFrame = OX;
    }

    clearSymbol() {
        this.mark.spriteFrame = null;        
    }
}

