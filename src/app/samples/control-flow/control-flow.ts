import { Component, signal, computed, resource } from '@angular/core'

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


    // resource sample
    userId = signal<number>(1)

    userResource = resource({
        params: () => ({id: this.userId()}),
        loader: ({ params }) => this.fetchUser(params)
    })

    username = computed(() => {
        if (this.userResource.hasValue()) {
            return this.userResource.value()?.name
        }
        return ''
    })

    fetchUser(params: { id: number }): Promise<User> {
        return fetch(`https://jsonplaceholder.typicode.com/users/${params.id}`).then(res => res.json())

        /**
         * {
            "id": 1,
            "name": "Leanne Graham",
            "username": "Bret",
            "email": "Sincere@april.biz",
            "address": {
                "street": "Kulas Light",
                "suite": "Apt. 556",
                "city": "Gwenborough",
                "zipcode": "92998-3874",
                "geo": {
                "lat": "-37.3159",
                "lng": "81.1496"
                }
            },
            "phone": "1-770-736-8031 x56442",
            "website": "hildegard.org",
            "company": {
                "name": "Romaguera-Crona",
                "catchPhrase": "Multi-layered client-server neural-net",
                "bs": "harness real-time e-markets"
            }
            }
         * 
         * 
         */
    }

    // stream sample
    updateSeq = signal(0)
    updateHistory = signal<StreamUpdate[]>([])
    userUpdates = signal<{ value: StreamUpdate }>({
        value: {
            value: 'Tom',
            seq: 0,
            at: new Date().toLocaleTimeString()
        }
    })

    pushUpdate(value: string) {
        const seq = this.updateSeq() + 1
        const update: StreamUpdate = {
            value,
            seq,
            at: new Date().toLocaleTimeString()
        }

        this.updateSeq.set(seq)
        this.userUpdates.set({ value: update })
        this.updateHistory.update(history => [update, ...history])
    }

    userUpdateResource = resource({
        stream: () => this.userUpdates
    })
}

interface StreamUpdate {
    value: string
    seq: number
    at: string
}


interface User {
    id: number
    name: string
    username: string
    email: string
    address: {
        street: string
        suite: string
        city: string
        zipcode: string
        geo: {
            lat: string
            lng: string
        }
    }
    phone: string
    website: string
    company: {
        name: string
        catchPhrase: string
        bs: string
    }
}