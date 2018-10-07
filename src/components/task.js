import {
    updateTask,
    deleteTask,
} from "../domain/actions"

export default {
    props: ['task'],
    data() {
        return {
            taskForm: { name: this.task.name },
            showTaskNameForm: false,
        }
    },
    methods: {
        remove() {
            deleteTask(this.task)
        },
        update() {
            updateTask(this.task.boardId, this.task.columnId, { id: this.task.id, name: this.taskForm.name })
        },
        toggleUpdateName() {
            this.showTaskNameForm = !this.showTaskNameForm
        },
        closeUpdateName() {
            this.showTaskNameForm = false
        },
        openUpdateName() {
            this.showTaskNameForm = true
        }
    },
    template: `<div>
        <div class="taskList__item">
             <input
                     v-model="taskForm.name" 
                     :readonly="!showTaskNameForm" 
                     v-on:change="update()"
                     v-on:keyup.enter="closeUpdateName()"
                     v-on:keyup.esc="closeUpdateName()"
                     v-on:click="openUpdateName()"
                     > 
            <div style="float: right;">
                <i class="fas fa-pencil-alt" v-on:click="toggleUpdateName()" style="cursor: pointer;margin-right:5px"></i>
                <i class="fas fa-times deleteButton" v-on:click="remove()"></i>
            </div>
        </div>
      </div>`
}