import { Component, signal, computed, effect, linkedSignal, untracked } from '@angular/core'

@Component({
    selector: 'app-signal',
    templateUrl: './signal.html',
    styleUrls: ['./signal.css']
})
export class SignalComponent {
    // normal signal and computed
    count = signal(0)

    list = signal<number[]>([])

    multipleCount = computed(() => this.count() * 2)

    increment() {
        this.count.set(this.count() + 1)
        this.list.set([...this.list(), this.count()])

        // test the linked signal effect
        this.changeSelectedOption()
    }

    // linked signal

    constructor() {
        // this will cause initialization of the linked signal effect if uncommented
        // effect(() => {
        //     console.log('Effect triggered. Selected option:', this.changeSelectedOption())
        // })
        
        effect(() => {
            // can use untracked to avoid triggering the effect recursively
            untracked(() => {
                console.log('Effect triggered. Selected option:', this.changeSelectedOption())
            })
        })
    }

    options = signal<string[]>(['Air', 'Ground', 'Water'])
    selectedOption = linkedSignal(() => this.options()[0])

    changeSelectedOption() {
        console.log('Default selected option:', this.selectedOption())
        // selected option is Air

        this.selectedOption.set(this.options()[1])
        console.log('Selected option changed to:', this.selectedOption())
        // selected option is Ground

        this.options.set([...this.options(), 'New Option'])
        console.log('Options updated to:', this.options())
        console.log('Selected option after options update:', this.selectedOption())
        // selected option is Air, because the linked signal still points to the first option in the updated list

        this.options.set(['Duck', 'Checken', "Goose"])
        console.log('Options updated to:', this.options())
        console.log('Selected option after options update:', this.selectedOption())
        // selected option is Duck.
    }

}