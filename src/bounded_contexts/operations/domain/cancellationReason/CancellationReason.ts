export class CancellationReason {
    private _title: string;
    private _comment?: string;
    private _date?: Date;

    constructor(title: string, comment?: string, date?: Date) {
        this._title = title;
        this._comment = comment;
        this._date = date;
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
     * Getter date
     * @return {Date | undefined}
     */
    public get date(): Date | undefined {
        return this._date;
    }

    /**
     * Setter title
     * @param {string} value
     */
    public set title(value: string) {
        this._title = value;
    }

    /**
     * Setter comment
     * @param {string | undefined} value
     */
    public set comment(value: string | undefined) {
        this._comment = value;
    }

    /**
     * Setter date
     * @param {Date | undefined} value
     */
    public set date(value: Date | undefined) {
        this._date = value;
    }
}
