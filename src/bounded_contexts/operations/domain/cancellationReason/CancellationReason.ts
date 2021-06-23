export class CancellationReason {
    private _title: string;
    private _comment?: string;

    constructor(title: string, comment?: string) {
        this._title = title;
        this._comment = comment;
    }

    /**
     * Getter title
     * @return {string}
     */
    public get title(): string {
        return this._title;
    }

    /**
     * Getter comment
     * @return {string | undefined}
     */
    public get comment(): string | undefined {
        return this._comment;
    }

    /**
     * Setter title
     * @param {string} value
     */
    public set title(value: string) {
        this._title = value;
    }

    /**
     * Setter title
     * @param {string | undefined} value
     */
    public set comment(value: string | undefined) {
        this._comment = value;
    }
}
