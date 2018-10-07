import {
    updateColumn,
    deleteColumn,
    addTaskToColumn,
} from '../domain/actions'
import task from './task'

export default {
    props: ['column'],
    data() {
        return {
            columnForm: { name: this.column.name },
            taskForm: { name: '' },
            showColumnNameForm: false,
            showNewTaskForm: false,
        }
    },
    computed: {
        tasks() {
            return this.column.tasks
        },
        tasksLength() {
            return Object.keys(this.column.tasks).length
        },
    },
    methods: {
        remove() {
            deleteColumn(this.column)
        },
        update() {
            updateColumn(this.column.boardId, { id: this.column.id, name: this.columnForm.name })
        },
        closeUpdateName() {
            this.showColumnNameForm = false
        },
        openUpdateName() {
            this.showColumnNameForm = true
        },
        toggleUpdateName() {
            this.showColumnNameForm = !this.showColumnNameForm
        },
        addTask(){
            addTaskToColumn(this.column.boardId, this.column.id, this.taskForm.name)
            this.taskForm.name = ''
        },
        getTaskObject(task) {
            return { ...task, columnId: this.column.id, boardId: this.column.boardId }
        },
        toggleTaskInput() {
            this.taskForm.name = ''
            this.showNewTaskForm = !this.showNewTaskForm
        },

    },
    components: { task },
    template: `<div class="columnList__item" :id="'column__' + column.id">
            <div style="height:40px">
                <div style="float: left">
                  <span>({{ tasksLength }})</span>
                  <input class="column__name"
                     id="columnFormNameInput"
                     v-model="columnForm.name" 
                     :readonly="!showColumnNameForm" 
                     v-on:change="update()"
                     v-on:keyup.enter="closeUpdateName()"
                     v-on:keyup.esc="closeUpdateName()"
                     v-on:click="openUpdateName()"
                     > 
                </div>
                
                <div style="float: right;">
                    <i class="fas fa-pencil-alt" id="updateName" v-on:click="toggleUpdateName()" style="cursor: pointer;margin-right:5px"></i>
                    <i class="fas fa-times deleteButton" id="deleteColumn" v-on:click="remove()"></i>
                </div>
            </div>

            <ul class="taskList">
                <li class="taskList__item-wrapper" v-for="task in tasks" :key="task.id">
                    <task v-bind:task="getTaskObject(task)"></task>
                </li>
            </ul>
                 
            <div style="overflow: auto">
                <div v-if="!showNewTaskForm" style="cursor: pointer" v-on:click="toggleTaskInput()">Add task..</div>
                <div v-else>
                    <input class="taskList__item" v-on:keyup.enter="addTask()" v-on:keyup.esc="toggleTaskInput()" v-model="taskForm.name" placeholder="e.g. Meet Bob">
                    <div  v-if="taskForm.name.length > 0" v-on:click="addTask()" class="addButton">
                        Add task <i class="fas fa-plus-square"></i>
                    </div>
                </div>
            </div>
        </div>`
}