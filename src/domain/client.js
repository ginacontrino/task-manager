import storage from './storage.js'

const boards = {
    getAll: () => {
        return storage.get('boards', [])
    },
    save: (boards) => {
        storage.set('boards', boards)
    },
}

export default { boards }
