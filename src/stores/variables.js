import EventEmitter from 'events'

class VariablesStore extends EventEmitter {

    constructor() {
        super()
        this.dataValues = {}
    }

    emitChange() { this.emit('change') }

    set(key, value) {
        if (!key) { throw new Error('RequiredArgumentError') }
        this.dataValues[key] = value
    }
    get(key) {
        if (key === undefined) return this.dataValues
        return this.dataValues[key]
    }

}

var store = new VariablesStore()

export default store
