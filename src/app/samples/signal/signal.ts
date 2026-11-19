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
                // console.log('Effect triggered. Selected option:', this.changeSelectedOption())

                // this.changeSelectedOption2()

                this.changeShippingMethod()

            })
        })
    }

    options = signal<string[]>(['Air', 'Ground', 'Water'])
    selectedOption = linkedSignal(() => this.options()[0])

    selectedOption2 = linkedSignal<string[], string>({
        source: this.options,
        computation: (newOptions, previous) => {
            if (previous && newOptions.includes(previous.value)) {
                return previous.value
            }
            return newOptions[0]
        }
    })

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

    changeSelectedOption2() {
        console.log('Default selected option 2:', this.selectedOption2())

        this.selectedOption2.set(this.options()[1])
        console.log('Selected option 2 changed to:', this.selectedOption2())
        // selected option 2 is Ground

        this.options.set([...this.options(), 'New Option'])
        console.log('Options updated to:', this.options())
        console.log('Selected option 2 after options update:', this.selectedOption2())
        // still points to the previously selected option if it exists in the updated options list
        // which is due to the computation function defined for the linked signal, ensuring it retains the previous value if it still exists in the updated options list.
    }


    // update the property inside the partent.
    order = signal<Order>({
        id: 1,
        shippingMethod: 'Air'
    })

    shippingMethod = linkedSignal(() => this.order().shippingMethod, {
        set: (newValue) => {
            this.order.update(order => ({ ...order, shippingMethod: newValue }))
        }
    })

    shippingMethodWithoutSet = linkedSignal(() => this.order().shippingMethod)
    // when trying to set a value on a linked signal without a set function, you get: Expected 0 arguments, but got 1.
    // this.shippingMethodWithoutSet('Ground')

    changeShippingMethod() {
        console.log('Default shipping method:', this.shippingMethod())

        this.shippingMethod.set('Ground')
        console.log('Shipping method changed to:', this.shippingMethod())
        console.log('Order after shipping method change:', this.order())
        // shipping method is Ground

        this.order.update(order => ({ ...order, shippingMethod: 'Water' }))
        console.log('Order updated to:', this.order())
        console.log('Shipping method after order update:', this.shippingMethod())
        // shipping method is Water
    }

    
}

interface Order {
    id: number
    shippingMethod: string
}