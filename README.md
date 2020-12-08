# Comsel - combine Redux selectors

## Installation

```
npm install comsel
```

## Usage

`combineSelectors` allow to create reusable "local" selectors only aware of their slice state.

For example, consider the following Redux state:

```typescript
interface Todo {
    title: string;
    isComplete: string;
}

type TodoState = {
    todos: Todo[];
};

interface User {
    displayName: string;
    email: string;
}

interface UserState {
    users: User[];
}

interface State {
    todo: TodoState;
    users: UserState;
}
```

You can create a couple of selectors:

```typescript
const selectFirstTodo = (state: TodoState): Todo | undefined => state.todos[0];
const selectFirstUser = (state: UserState): User | undefined => state.users[0];
```

Note, that each selector uses its own slice state (`TodoState` and `UserState` respectively), so they incapsulate a behavior without being aware of the global `State`.

`combineSelectors` allows to transform the selectors so that they could be invoked with global state:

```typescript
import { combineSelectors } from 'comsel';

const selectorsMap = {
    todo: {
        selectFirstTodo,
    },
    users: {
        selectFirstUser,
    },
};
const combinedSelectors = combineSelectors<State, typeof selectorsMap>(
    selectorsMap
);
```

Now you can use the selectors like the following:

```typescript
// Assuming there is a `state: State` variable
combinedSelectors.todo.selectFirstTodo(state); // => Todo|undefined
combinedSelectors.users.selectFirstUser(state); // => User|undefined
```
