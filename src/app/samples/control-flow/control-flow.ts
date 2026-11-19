import { Component, signal, computed, effect } from '@angular/core'

@Component({
    selector: 'app-control-flow',
    templateUrl: './control-flow.html',
    styleUrls: ['./control-flow.css']
})
export class ControlFlowComponent {

    // for @for @empty
    todos = signal<string[]>([
        'Learn Angular',
        'Build a project',
        'Write tests'
    ])

    addTodo(todo: string) {
        this.todos.set([...this.todos(), todo])
    }

    removeTodo(index: number) {
        this.todos.set(this.todos().filter((_, i) => i !== index))
        this.selectedTodos.set(this.selectedTodos().filter((_, i) => i !== index))
    }

    // for @switch @case @default
    selectedTodos = signal<string[]>([])

    selectTodo(checked: boolean, todo: string) {
        if (checked) {
            if (this.selectedTodos().includes(todo)) {
                return
            }
            this.selectedTodos.set([...this.selectedTodos(), todo])
        } else {
            this.selectedTodos.set(this.selectedTodos().filter(t => t !== todo))
        }
    }
}