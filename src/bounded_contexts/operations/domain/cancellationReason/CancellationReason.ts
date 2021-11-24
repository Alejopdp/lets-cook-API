export class CancellationReason {
    private _title: string;
    private _comment?: string;
    private _date?: Date;

    constructor(title: string, comment?: string, date?: Date) {
        this._title = title;
        this._comment = comment;
        this._date = date;
    }

    public getHumanTitle(): string {
        const dic: { [title: string]: string } = {
            created_by_error: "Se ha creado por error",
            cant_get_kits_next_week: "No puedo recibir los kits la próxima semana",
            special_diet: "Tengo una dieta especial",
            move_abroad: "Me voy a vivir fuera por tiempo indeterminado",
            dont_like_meal_kits: "No me gustan los kits para cocinar (meal kits)",
            had_problems_with_letscook: "He tenido problemas con Let’s Cook",
            price_too_high: "El precio es muy alto",
            other_reason: "Otra razón",
        };

        return dic[this.title] || "";
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
