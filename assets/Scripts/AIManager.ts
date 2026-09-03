import {_decorator, Component, Node} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('AIManager')
export class AIManager extends Component {

    // 極值演算法
    getAIBestMove(): number {
        return 0;
    };

    MiniMax(): number {
        return 0;
    }
}

