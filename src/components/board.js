import { IsLoaded } from '../domain/state'
import {
    getBoard,
    updateBoard,
    deleteBoard,
    addColumnToBoard,
} from '../domain/actions'
import column from "./column"

export default {
    data() {
        return {
            board: {},
            boardForm: { name: '' },
            columnForm: { name: '' },
            showColumnForm: false,
            toggleName: false,
        }
    },
    mounted() {
        this.board = getBoard(this.$router.history.current.params.id)

        this.boardForm.name = this.board.name
    },
    computed: {
        loaded: () => IsLoaded(),
        columns() {
            return this.board.columns
        },
    },
    methods: {
        returnToDashboard() {
            this.$router.push('/')
        },
        remove() {
            deleteBoard(this.board.id)
            this.returnToDashboard()
        },
        updateBoardName() {
            updateBoard(this.board.id, this.boardForm.name)
            this.toggleUpdateName()
        },
        toggleUpdateName() {
            this.toggleName = !this.toggleName
        },
        addColumn(id, name) {
            addColumnToBoard(this.board.id, this.columnForm.name)
            this.columnForm.name = ''
        },
        toggleColumnForm() {
            this.showColumnForm = !this.showColumnForm
        },
        closeColumnForm() {
            this.showColumnForm = false
        },
        getColumnObject(column) {
            return { ...column, boardId: this.board.id }
        }
    },
    components: { column },
    template: `
    <div v-if="loaded" :id='"board__" + board.id'>
         <div class="topBar">
           <div style="float: left">
               <span v-if="!toggleName" v-on:click="toggleUpdateName()" style="cursor: pointer">{{ board.name }}</span>
               <div v-else>
               <input v-model="boardForm.name" type="text">
               
               <button v-on:click="updateBoardName()">Update</button>
               </div>
           </div>
           <div v-on:click="remove()" class="deleteButton" style="float:right;">
               delete this board <i class="fas fa-times" ></i>
           </div>
         </div>
         
         <div class="main">
             <div v-on:click="returnToDashboard()" class="link">Back to dashboard</div>
             
             <ul>
                 <li class="columnList__item-wrapper" v-for="column in columns" :key="column.id">
                   <column v-bind:column="getColumnObject(column)"></column>
                 </li>
                 
                 <li class="columnList__item-wrapper">
                   <div class="columnList__addColumn-item">
                    <div v-if="!showColumnForm" id="columnForm" v-on:click="toggleColumnForm()" style="cursor: pointer">Add column..</div>
                    
                    <div v-else>
                       <input id="columnFormInput" v-on:keyup.esc="closeColumnForm()" v-on:keyup.enter="addColumn()" v-model="columnForm.name" placeholder="e.g. Todos" type="text" class="taskList__item">
                       <div id="columnFormSubmitButton" v-if="columnForm.name.length > 0" v-on:click="addColumn()" class="addButton">
                       Add column <i class="fas fa-plus-square"></i></div>
                       </div>
                    </div>
                 </li>
             </ul>
         </div>
    </div>`
}