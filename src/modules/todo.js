export default class Todo {
    #description;
    #status = false;
    #index;

    constructor(description, index) {
        this.#description = description;
        this.#index = index
    };

    get description() { return this.#description };
    get status() { return this.#status };
    get index() { return this.#index };

    set description(value) { this.#description = value };
    set status(value) { this.#status = value };
    set index(value) { this.#index = value };

    toggleStatus = () => {
        this.status = this.status == false ? true : false;
    }
}