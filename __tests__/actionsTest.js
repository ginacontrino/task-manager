import { stub } from 'sinon'
import {
    getBoard,
    createBoard,
    updateBoard,
    deleteBoard,
    addColumnToBoard,
    updateColumn,
    deleteColumn,
    addTaskToColumn,
    updateTask, deleteTask
} from './../src/domain/actions'
import state from './../src/domain/state'
import client from './../src/domain/client'
import uuid from './../src/utils/uuid'

describe('Actions', () => {

    describe('Board', () => {

        const exampleBoard1 = { id: '1', name: 'my board', columns: {} }
        const exampleBoard2 = { id: '2', name: 'my board', columns: {} }

        describe('Gets a single board', () => {

            beforeEach(() => {
                state.boards = { '1': exampleBoard1 }
            })

            it('returns the board object', () => {
                expect(getBoard('1')).toEqual(exampleBoard1)
            })

            it('throws error if board not found', () => {
                expect(() => getBoard('someIncorrectId')).toThrowError('board not found with id: someIncorrectId')

            })
        })

        describe('Creates a new board', () => {
            let uuidStub
            let clientStub

            beforeEach(() => {
                clientStub = stub(client.boards, 'save')
                uuidStub = stub(uuid, 'generate')
                uuidStub.returns('1')
            })

            afterEach(() => {
                clientStub.restore()
                uuidStub.restore()
            })

            it('Creates new board and saves it', () => {
                createBoard('my cool board')

                const expectedBoard = { id: '1', name: 'my cool board', columns: {} }

                expect(state.boards['1']).toEqual(expectedBoard)
                expect(clientStub.getCall(0).args[0]).toEqual({ '1': { ...expectedBoard } })
            })

            it('throws error if invalid name was provided', () => {
                expect(() => createBoard()).toThrowError('invalid name')
            })
        })

        describe('Updates a board', () => {
            let clientStub

            beforeEach(() => {
                state.boards = { '1': exampleBoard1 }
                clientStub = stub(client.boards, 'save')
            })

            afterEach(() => {
                clientStub.restore()
            })

            it('Updates a board by its ID and saves updated board collection', () => {
                updateBoard('1', "gina's board")

                expect(state.boards['1'].name).toEqual("gina's board")
                expect(clientStub.getCall(0).args[0]).toEqual({ '1': { id: '1', name: "gina's board", columns: {} } })
            })

            it('throws error if board not found', () => {
                expect(() => updateBoard('someIncorrectId', "gina's board")).toThrowError('board not found with id: someIncorrectId')
            })

            it('throws error if invalid name was provided', () => {
                expect(() => updateBoard('1', '')).toThrowError('invalid name')
            })
        })

        describe('Deletes a board', () => {
            let clientStub

            beforeEach(() => {
                state.boards = { '1': exampleBoard1, '2': exampleBoard2 }
                clientStub = stub(client.boards, 'save')
            })

            afterEach(() => {
                clientStub.restore()
            })

            it('Deletes a board by its ID and saves updated board collection', () => {
                deleteBoard('1')

                expect(state.boards).toEqual({ '2': exampleBoard2 })
                expect(clientStub.getCall(0).args[0]).toEqual({ '2': exampleBoard2 })
            })

            it('throws error if board not found', () => {
                expect(() => deleteBoard('someIncorrectId')).toThrowError('board not found with id: someIncorrectId')
            })
        })
    })


    describe('Column', () => {
        const exampleColumn = { id: '2', name: 'todos', tasks: {} }
        const exampleBoard1 = { id: '1', name: 'my board', columns: {} }
        const exampleBoard2 = { id: '1', name: 'my board', columns: { '2': exampleColumn } }

        describe('Creates a column', () => {
            let uuidStub
            let clientStub

            beforeEach(() => {
                state.boards = { '1': exampleBoard1 }
                clientStub = stub(client.boards, 'save')
                uuidStub = stub(uuid, 'generate')
                uuidStub.returns('2')
            })

            afterEach(() => {
                clientStub.restore()
                uuidStub.restore()
            })

            it('Adds a column to a given board', () => {
                addColumnToBoard('1', 'todos')

                const expectedColumn = exampleColumn
                const expectedBoard = exampleBoard1

                expect(state.boards['1'].columns).toEqual({ '2': expectedColumn })
                expect(clientStub.getCall(0).args[0]).toEqual({ '1': expectedBoard })
            })

            it('throws error if board not found', () => {
                expect(() => addColumnToBoard('someIncorrectId', 'todos')).toThrowError('board not found with id: someIncorrectId')
            })
        })

        describe('Updates a column', () => {
            let clientStub

            beforeEach(() => {
                state.boards = { '1': exampleBoard2 }
                clientStub = stub(client.boards, 'save')
            })

            afterEach(() => {
                clientStub.restore()
            })

            it('Adds a column to a given board', () => {
                updateColumn('1', { id: '2', name: 'my todos' })

                const expectedColumn = { id: '2', name: 'my todos', tasks: {} }
                exampleBoard1.columns['2'] = expectedColumn
                const expectedBoard = exampleBoard1

                expect(state.boards['1'].columns).toEqual({ '2': expectedColumn })
                expect(clientStub.getCall(0).args[0]).toEqual({ '1': expectedBoard })
            })

            it('throws error if board not found', () => {
                expect(() => updateColumn('someIncorrectId', {
                    id: '2',
                    name: 'my todos'
                })).toThrowError('board not found with id: someIncorrectId')
            })

            it('throws error if column not found', () => {
                expect(() => updateColumn('1', {
                    id: 'someIncorrectId',
                    name: 'my todos'
                })).toThrowError('column not found with id: someIncorrectId')
            })

            it('throws error if invalid name was provided', () => {
                expect(() => updateColumn('1', { id: '2', name: '' })).toThrowError('invalid name')
            })
        })

        describe('Deletes a column', () => {
            let clientStub

            beforeEach(() => {
                state.boards = {
                    '1': {
                        id: '2',
                        name: 'my board',
                        columns: { '2': exampleColumn, '3': exampleColumn }
                    }
                }

                clientStub = stub(client.boards, 'save')
            })

            afterEach(() => {
                clientStub.restore()
            })

            it('Deletes a column from a board', () => {
                deleteColumn({ boardId: '1', id: '2' })

                const expectedBoard = { id: '2', name: 'my board', columns: { '3': exampleColumn } }

                expect(state.boards['1'].columns).toEqual({ '3': exampleColumn })
                expect(clientStub.getCall(0).args[0]).toEqual({ '1': expectedBoard })
            })

            it('throws error if board not found', () => {
                expect(() => deleteColumn({
                    boardId: 'someIncorrectId',
                    id: '2'
                })).toThrowError('board not found with id: someIncorrectId')
            })

            it('throws error if column not found', () => {
                expect(() => deleteColumn({
                    boardId: '1',
                    id: 'someIncorrectId'
                })).toThrowError('column not found with id: someIncorrectId')
            })
        })
    })

    describe('Task', () => {
        const exampleTask = { id: '3', name: 'do groceries' }
        const exampleColumn1 = { id: '2', name: 'todos', tasks: {} }
        const exampleBoard = { id: '1', name: 'my board', columns: { '2': exampleColumn1 } }

        describe('Creates a task', () => {
            let uuidStub
            let clientStub

            beforeEach(() => {
                state.boards = { '1': exampleBoard }
                clientStub = stub(client.boards, 'save')
                uuidStub = stub(uuid, 'generate')
                uuidStub.returns('3')
            })

            afterEach(() => {
                clientStub.restore()
                uuidStub.restore()
            })

            it('Adds a task to a given column and board', () => {
                addTaskToColumn('1', '2', 'do groceries')

                exampleBoard.columns['2'].tasks = { '3': exampleTask }
                const expectedBoard = exampleBoard

                expect(state.boards['1'].columns['2'].tasks).toEqual({ '3': exampleTask })
                expect(clientStub.getCall(0).args[0]).toEqual({ '1': expectedBoard })
            })

            it('throws error if board not found', () => {
                expect(() => addTaskToColumn('someIncorrectId', '2', 'do groceries')).toThrowError('board not found with id: someIncorrectId')
            })

            it('throws error if column not found', () => {
                expect(() => addTaskToColumn('1', 'someIncorrectId', 'do groceries')).toThrowError('column not found with id: someIncorrectId')
            })

            it('throws error if invalid name was provided', () => {
                expect(() => addTaskToColumn('1', '2', '')).toThrowError('invalid name')
            })
        })

        describe('Updates a task', () => {
            let clientStub

            beforeEach(() => {
                exampleBoard.columns['2'].tasks = { '3': exampleTask }
                state.boards = { '1': exampleBoard }

                clientStub = stub(client.boards, 'save')
            })

            afterEach(() => {
                clientStub.restore()
            })

            it('updates a task of a given column and board', () => {
                updateTask('1', '2', { id: '3', name: 'do groceries at 12' })

                const expectedTask = { id: '3', name: 'do groceries at 12' }
                exampleBoard.columns['2'].tasks = { '3': expectedTask }
                const expectedBoard = exampleBoard

                expect(state.boards['1'].columns['2'].tasks).toEqual({ '3': expectedTask })
                expect(clientStub.getCall(0).args[0]).toEqual({ '1': expectedBoard })
            })

            it('throws error if board not found', () => {
                expect(() => updateTask('someIncorrectId', '2', {
                    id: '3',
                    name: 'do groceries at 12'
                })).toThrowError('board not found with id: someIncorrectId')
            })

            it('throws error if column not found', () => {
                expect(() => updateTask('1', 'someIncorrectId', {
                    id: '3',
                    name: 'do groceries at 12'
                })).toThrowError('column not found with id: someIncorrectId')
            })

            it('throws error if task not found', () => {
                expect(() => updateTask('1', '2', {
                    id: 'someIncorrectId',
                    name: 'do groceries at 12'
                })).toThrowError('task not found with id: someIncorrectId')
            })

            it('throws error if invalid name was provided', () => {
                expect(() => updateTask('1', '2', { id: '3', name: '' })).toThrowError('invalid name')
            })
        })

        describe('Deletes a task', () => {
            let clientStub

            beforeEach(() => {
                exampleBoard.columns['2'].tasks = { '3': exampleTask, '4': exampleTask }
                state.boards = { '1': exampleBoard }

                clientStub = stub(client.boards, 'save')
            })

            afterEach(() => {
                clientStub.restore()
            })

            it('Deletes a task from a given column and board', () => {
                deleteTask({ boardId: '1', columnId: '2', id: '3' })

                exampleBoard.columns['2'].tasks = { '4': exampleTask }
                const expectedBoard = exampleBoard

                expect(state.boards['1'].columns['2'].tasks).toEqual({ '4': exampleTask })
                expect(clientStub.getCall(0).args[0]).toEqual({ '1': expectedBoard })
            })

            it('throws error if board not found', () => {
                expect(() => deleteTask({
                    boardId: 'someIncorrectId',
                    columnId: '2',
                    id: '3'
                })).toThrowError('board not found with id: someIncorrectId')
            })

            it('throws error if column not found', () => {
                expect(() => deleteTask({
                    boardId: '1',
                    columnId: 'someIncorrectId',
                    id: '3'
                })).toThrowError('column not found with id: someIncorrectId')
            })

            it('throws error if task not found', () => {
                expect(() => deleteTask({
                    boardId: '1',
                    columnId: '2',
                    id: 'someIncorrectId'
                })).toThrowError('task not found with id: someIncorrectId')
            })
        })
    })
})