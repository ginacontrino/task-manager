import client from './client'
import uuid from './../utils/uuid'
import state, { getSingleBoard, getAllBoards } from './state'

export const Bootstrap = () => {
    state.boards = client.boards.getAll()
    state.ready = true
}

export const getBoards = () => getAllBoards()

export const getBoard = (id) => {
    const board = getSingleBoard(id)
    if (!board) {
        throw Error(`board not found with id: ${id}`)
    }

    return board
}


export const getColumn = (boardId, columnId) => {
    const board = getBoard(boardId)

    const column = board.columns[columnId]
    if (!column) {
        throw Error(`column not found with id: ${columnId}`)
    }

    return column
}

export const getTask = (boardId, columnId, taskId) => {
    const column = getColumn(boardId, columnId)

    const task = column.tasks[taskId]
    if (!task) {
        throw Error(`task not found with id: ${taskId}`)
    }

    return task
}

export const createBoard = (name) => {
    assertValidName(name)

    const id = uuid.generate()

    // replace for reactivity
    state.boards = { ...state.boards, [id]: { name, id, columns: {} }}

    client.boards.save(state.boards)
}

export const updateBoard = (id, name) => {
    assertValidName(name)

    const board = getBoard(id)
    board.name = name

    // replace for reactivity
    state.boards = { ...state.boards, [board.id]: board }

    client.boards.save(state.boards)
}

export const deleteBoard = (id) => {
    const board = getBoard(id)

    const boards = { ...state.boards }
    delete boards[board.id]

    // replace for reactivity
    state.boards = boards

    client.boards.save(state.boards)
}


export const addColumnToBoard = (id, name) => {
    assertValidName(name)

    const board = getBoard(id)

    const columnId = uuid.generate()

    // replace for reactivity
    board.columns = { ...board.columns, [columnId]: { name, id: columnId, tasks: {} }}

    client.boards.save(state.boards)
}


export const updateColumn = (boardId, { id, name }) => {
    assertValidName(name)

    const column = getColumn(boardId, id)
    column.name = name

    client.boards.save(state.boards)
}


export const deleteColumn = ({ boardId, id }) => {
    const board = getBoard(boardId)
    const column = getColumn(boardId, id)

    const columns = { ...board.columns }
    delete columns[column.id]

    // replace for reactivity
    board.columns = columns

    client.boards.save(state.boards)
}

export const addTaskToColumn = (boardId, columnId, name) => {
    assertValidName(name)

    const column = getColumn(boardId, columnId)

    const taskId = uuid.generate()

    // replace for reactivity
    column.tasks = { ...column.tasks, [taskId]: { name, id: taskId }}

    client.boards.save(state.boards)
}

export const updateTask = (boardId, columnId, { id, name }) => {
    assertValidName(name)

    const task = getTask(boardId, columnId, id)

    task.name = name

    client.boards.save(state.boards)
}

export const deleteTask = ({ boardId, columnId, id }) => {
    const column = getColumn(boardId, columnId)
    const task = getTask(boardId, columnId, id)

    const tasks = { ...column.tasks }
    delete tasks[task.id]

    // replace for reactivity
    column.tasks = tasks

    client.boards.save(state.boards)
}

const assertValidName = (name) => {
    if (typeof name !== 'string' || name.trim() === '') {
        throw Error('invalid name')
    }
}