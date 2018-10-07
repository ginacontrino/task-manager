import { IsLoaded } from './../domain/state'
import { createBoard, getBoards } from './../domain/actions'

export default {
    data() {
        return {
            showBoardInput: false,
            boardForm: { name: '' }
        }
    },
    computed: {
        loaded: () => IsLoaded(),
        boards: () => getBoards(),
    },
    methods: {
        create() {
            createBoard(this.boardForm.name)
            this.toggleBoardInputField()
        },
        toggleBoardInputField() {
            this.showBoardInput = !this.showBoardInput
        },
        closeBoardInputField() {
            this.showBoardInput = false
        }
    },
    template: `
    <div v-if="loaded">
        <div class="topBar">Dashboard</div>
        <div class="main">
            <ul>
              <li v-for="board in boards" class="boardList__item-wrapper">
                <router-link :to="board.id" class="boardList__block boardList__item">{{ board.name }}</router-link>
              </li>
              <li class="boardList__item-wrapper">
                <div class="boardList__block boardList__addBoard-item">
                 <div v-if="!showBoardInput" v-on:click="toggleBoardInputField()" style="cursor: pointer">Add new board..</div>
                 <div v-else>
                    <input v-model="boardForm.name" v-on:keyup.esc="closeBoardInputField()" v-on:keyup.enter="create()" placeholder="e.g. Tim's board">
                    <div v-if="boardForm.name.length > 0" v-on:click="create()" class="addButton">
                        Add board <i class="fas fa-plus-square"></i>
                    </div>
                    </div>
                  </div>
              </li>
            </ul>
       </div>
    </div>`
}