import { combineSelectors } from '../createSelectors';

interface Todo {
    title: string;
    isComplete: string;
}

type TodoState = {
    todos: Todo[];
};

// =

interface User {
    displayName: string;
    email: string;
}

interface UserState {
    users: User[];
}

// =

interface State {
    todo: TodoState;
    users: UserState;
}

// ---

const state = ({} as unknown) as State;

const selectFirstTodo = (state: TodoState): Todo | undefined => state.todos[0];
const selectFirstUser = (state: UserState): User | undefined => state.users[0];

const ssMap = {
    todo: {
        selectFirstTodo,
    },
    users: {
        selectFirstUser,
    },
    asd: { selectFirstUser },
};

const combibedSelectors = combineSelectors<State, typeof ssMap>(ssMap);

combibedSelectors.todo.selectFirstTodo(state)?.isComplete;
let a = combibedSelectors.asd.selectFirstUser(state);
