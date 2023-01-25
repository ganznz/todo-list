export default class Todo {
    #description;
    #status = false;

    constructor(description) {
        this.#description = description;
    };

    get description() { return this.#description };
    get status() { return this.#status };

    set description(value) { this.#description = value };
    set status(value) { this.#status = value };

    toggleStatus = () => {
        this.status = this.status == false ? true : false;
    }
}