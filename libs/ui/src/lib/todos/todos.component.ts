import { Component, OnInit, Input } from '@angular/core';
import { Todo } from '@wallaby2190/data';

@Component({
  selector: 'wallaby2190-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})

export class TodosComponent implements OnInit {
  @Input() todos: Todo[];

  constructor() {}

  ngOnInit() {}
}
