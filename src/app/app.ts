import { Component, signal } from '@angular/core';
import { SignalComponent } from './samples/signal/signal';
import { ControlFlowComponent } from './samples/control-flow/control-flow';

@Component({
  imports: [SignalComponent, ControlFlowComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('angular-22');
}
