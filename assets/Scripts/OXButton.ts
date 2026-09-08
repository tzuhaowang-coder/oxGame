import {_decorator, Component, Node, Sprite, SpriteFrame} from 'cc';
import {EGameTurn} from "db://assets/Scripts/GameManager";

const {ccclass, property} = _decorator;

@ccclass('OXButton')
export class OXButton extends Component {
    private mark: Sprite;

    onLoad() {
        this.mark = this.node.getComponent(Sprite);
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

    // onDestroy() {
    //     this.node.targetOff(this);
    // }

    showSymbol(OX: SpriteFrame) {
        this.mark.spriteFrame = OX;
    }

    clearSymbol() {
        this.mark.spriteFrame = null;
    }
}

