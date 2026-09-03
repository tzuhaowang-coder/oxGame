import {_decorator, Component, Node} from 'cc';
import {EGameTurn} from "db://assets/Scripts/GameManager";
import {ViewManager} from "db://assets/Scripts/ViewManager";

const {ccclass, property} = _decorator;

@ccclass('OXButton')
export class OXButton extends Component {

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


    installButton(index: number, viewManager: ViewManager) {
        this._index = index;
        let action = viewManager.onButtonClick;
        // 訂閱點擊事件
        this.node.on("mouse-down", () => {
            if (this.gridValue == 0 || this.gridValue == 1) return;    // 代表已有圖案

            this.onClickButton(this._index, action);
            console.log('click');
        });
    }


    onDestroy() {
        this.node.targetOff(this);
    }

    update(deltaTime: number) {

    }
}

