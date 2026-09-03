import {EGameTurn} from "db://assets/Scriipts/GameManager";

export class Board {
    private readonly cellsMarkType: EGameTurn[] = new Array(9).fill(EGameTurn.Prepare);

    private readonly winLines: number[][] = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 5, 8], [3, 5, 7]];

    public getCell(index: number): EGameTurn {
        return this.cellsMarkType[index];
    }

    public deleteCell(index: number): void {
        this.cellsMarkType[index] = EGameTurn.Prepare;
    }

    chessMove(index: number, whoseTurn: EGameTurn): void {
        this.cellsMarkType[index] = whoseTurn;
    }

    checkWin(markType: EGameTurn) {
        for (let i = 0; i < this.winLines.length; i++) {
            let line = this.winLines[i];
            if (line[0] === markType &&
                line[1] === markType &&
                line[2] === markType) {
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