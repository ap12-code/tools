/**
 * 文字列読み取り用のユーティリティクラス
 */
export class StringReader {
    private data: string;
    private cursor: number;

    constructor(data: string) {
        this.data = data;
        this.cursor = 0;
    }

    /**
     * 入力文字列を返します
     * @returns 文字列
     */
    public getString(): string {
        return this.data;
    }

    /**
     * 入力文字列のうち、残りを返します
     * @returns 文字列
     */
    public getRemaining(): string {
        return this.data.substring(this.cursor);
    }

    /**
     * カーソルを指定位置に設定します
     * @param cursor 位置
     */
    public setCursor(cursor: number) {
        this.cursor = cursor;
    }

    /**
     * カーソルの位置を返します
     * @returns 位置
     */
    public getCursor(): number {
        return this.cursor;
    }

    /**
     * 残りの文字数を返します
     * @returns 文字数
     */
    public getRemainingLength(): number {
        return this.data.length - this.cursor;
    }

    /**
     * 入力の文字数の長さを返します
     * @returns 文字数
     */
    public getTotalLength(): number {
        return this.data.length;
    }

    /**
     * 読み取れるかどうかを返します
     * @param length 文字数
     * @returns 読み取れるか
     */
    public canRead(length?: number): boolean {
        return this.cursor + (length ?? 1) <= this.data.length;
    }

    /**
     * 指定/現在位置の文字を返します
     * @param offset 現在位置からのオフセット
     * @returns 文字
     */
    public peek(offset?: number): string {
        return this.data.charAt(this.cursor + (offset ?? 0));
    }

    /**
     * 文字を読み取ります
     * @param v 読み取る文字数
     * @returns 読み取った文字
     */
    public read(): string {
        return this.data.charAt(this.cursor++);
    }

    /**
     * 1文字飛ばします
     */
    public skip() {
        this.cursor++;
    }

    public readStringUntil(terminator: string): string {
        let result = "";
        while (this.canRead()) {
            let c = this.read();
            if (c == terminator) {
                return result;
            } else {
                result += c;
            }
        }

        return result;
    }
}
