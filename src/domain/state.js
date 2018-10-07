const state = {
    ready: false,
    boards: {},
}

export const IsLoaded = () => state.ready

export const getAllBoards = () => state.boards

export const getSingleBoard = (id) => state.boards[id]

export default state
