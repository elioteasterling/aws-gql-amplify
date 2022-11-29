import React, { useState, useEffect } from "react";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import { createTodo } from "../graphql/mutations";
import { listTodos } from "../graphql/queries";
import awsExports from "../aws-exports";
import { observer } from "mobx-react-lite";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
  TextField,
} from "@mui/material";
import { useStore } from "../store";
import { DatePicker } from "@mui/lab";
Amplify.configure(awsExports);

const initialState = { name: "", description: "", due: new Date() };

const styles = {
  container: {
    margin: "0 auto",
    display: "block",
    align: "center",
    padding: 20,
  },
  todo: { marginBottom: 15 },
  input: {
    border: "none",
    backgroundColor: "#ddd",
    marginBottom: 10,
    padding: 8,
    fontSize: 18,
  },
  todoName: { fontSize: 20, marginLeft: 10, marginRight: 14 },
  todoDescription: { marginBottom: 0 },
  button: {
    backgroundColor: "black",
    color: "white",
    outline: "none",
    fontSize: 18,
    padding: "12px 0px",
  },
};

const TodoApp = observer((props: any) => {
  const [formState, setFormState] = useState(initialState);
  const store = useStore()

  useEffect(() => {
    fetchTodos();
  });

  function setInput(key: string, value: any) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchTodos() {
    try {
      const todoData: any = await API.graphql(graphqlOperation(listTodos));
      store.todos = todoData.data.listTodos.items;
    } catch (err) {
      console.log("error fetching todos");
    }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return;
      const todo: any = { ...formState };
      const offset = todo.due.getTimezoneOffset()
      const dateWrtTimeZone = new Date(todo.due.getTime() - (offset*60*1000))
      todo.due = dateWrtTimeZone.toISOString().split('T')[0]
      setFormState(initialState);
      await API.graphql(graphqlOperation(createTodo, { input: todo }));
      store.todos.push(todo)
    } catch (err) {
      console.log("error creating todo:", err);
    }
  }

  const isOverDue = (dueDate: Date) => {
    if (!dueDate) return "white"
    return dueDate < new Date() ? "green" : "red"
  }

  return (
    <Card sx={{ margin: "auto" }}>
      <div style={styles.container}>
        <CardHeader>Amplify Todos</CardHeader>
        <CardContent>
          <Input
            style={{ padding: "10px", width: "100%" }}
            onChange={(event) => setInput("name", event.target.value)}
            value={formState.name}
            placeholder="Name"
          />

          <Input
            style={{ padding: "10px", width: "100%" }}
            onChange={(event) => setInput("description", event.target.value)}
            value={formState.description}
            placeholder="Description"
          />
          <DatePicker 
            orientation="landscape"
            openTo="day"
            onChange={(event) => setInput("due", event)} 
            value={formState.due}
            renderInput={(params) => <TextField {...params} />} />
          <br />
          <Button
            style={{ margin: "20px auto", display: "block" }}
            onClick={addTodo}
            variant="contained"
          >
            Create Todo
          </Button>
          <br />
          {store.todos.map((todo: any, index: number) => (
            <div key={todo.id ? todo.id : index} style={styles.todo}>
              <p>
                {" "}
                {index + 1} :<span style={styles.todoName}>{todo.name}</span>
                <span style={styles.todoDescription}>{todo.description}</span>
                <span style={{marginLeft: "20px", color:isOverDue(todo.due)}}>Due Date: {todo.due}</span>
              </p>
            </div>
          ))}
        </CardContent>
      </div>
    </Card>
  );
})

export default TodoApp;
