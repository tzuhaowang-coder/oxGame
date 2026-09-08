import {_decorator, Component, Node, Sprite, SpriteFrame} from 'cc';
import {EGameTurn} from "db://assets/Scripts/GameManager";

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
}

