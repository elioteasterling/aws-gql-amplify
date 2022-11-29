import { FC, useContext, createContext } from "react";
import { makeAutoObservable } from "mobx";

interface Todo {
    id: number
    description: string
    due: Date
}

class TodoStore {

    todos: Array<Todo> = []

    constructor() {
        makeAutoObservable(this)
    }

    addTodo(t: Todo) {
        this.todos.push(t)
    }
}

const StoreContext = createContext<TodoStore>(new TodoStore())

const StoreProvider: FC<{store: TodoStore}> = ({store, children}) => {
    return (
        <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    );
};

const useStore = () => useContext(StoreContext)

export { TodoStore, StoreProvider, useStore }