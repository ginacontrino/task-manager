import { mount } from '@vue/test-utils'
import { stub } from 'sinon'
import state from './../src/domain/state'
import uuid from './../src/utils/uuid'
import Board from '../src/components/board';

describe('Column integration test', () => {

    let uuidStub

    beforeEach(() => {
        uuidStub = stub(uuid, 'generate')
        uuidStub.returns('2')
        state.ready = true
    });

    afterEach(() => {
        uuidStub.restore()
    })

    it('CRUD board with columns', () => {
        // Given there is a board saved in the state
        state.boards = {
            '1234': { id: '1234', name: 'my board', columns: {} },
            '4321': { id: '4321', name: 'my second board', columns: {} }
        }


        // When I 'visit' board with id 1234
        const wrapper = mount(Board, {
            mocks: {
                $router: {
                    push: () => {},
                    history: {
                        current: {
                            params: {
                                id: '1234'
                            }
                        }
                    },
                }
            }
        })

        // When I then add a column under name 'todos'
        const columnForm = wrapper.find('#columnForm')
        columnForm.trigger('click')
        wrapper.find('#columnFormInput').setValue('todos')

        const columnFormSubmitButton = wrapper.find('#columnFormSubmitButton')
        columnFormSubmitButton.trigger('click')

        // Then I expect the column to be added to the board
        expect(state.boards[1234].columns[2]).toEqual({ name: 'todos', id: '2', tasks: {} })

        // When I then change the name of the column
        const column = wrapper.find('#column__2')
        column.trigger('click')

        const input = column.find('#columnFormNameInput')
        input.setValue('updated name')
        input.trigger('change')

        // Then I expect the name of the column to be updated
        expect(state.boards[1234].columns[2]).toEqual({ name: 'updated name', id: '2', tasks: {} })

        // When I click the delete column button
        const deleteColumnButton = column.find('#deleteColumn')
        deleteColumnButton.trigger('click')

        // Then I expect the column to be deleted
        expect(state.boards[1234]).toEqual({ id: '1234', name: 'my board', columns: {} })
    })
})