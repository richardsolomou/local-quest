import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
} from "@ras-sh/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import packageJson from "../../package.json" with { type: "json" };

export const Route = createFileRoute("/")({
  component: Home,
});

type Todo = {
  id: string;
  text: string;
  isCompleted: boolean;
};

function TodoForm({ onAdd }: { onAdd: (text: string) => void }) {
  const [newTodo, setNewTodo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      onAdd(newTodo);
      setNewTodo("");
    }
  };

  return (
    <form className="flex gap-4" onSubmit={handleSubmit}>
      <Input
        className="flex-1"
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="What needs to be done?"
        value={newTodo}
      />
      <Button size="default" type="submit">
        Add Todo
      </Button>
    </form>
  );
}

function TodoItem({
  todo,
  onToggle,
  onDelete,
}: {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="group flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:border-zinc-700 hover:bg-zinc-900/70">
      <Checkbox
        checked={todo.isCompleted}
        onCheckedChange={() => onToggle(todo.id)}
      />
      <span
        className={`flex-1 text-sm transition-colors ${
          todo.isCompleted ? "text-zinc-500 line-through" : "text-zinc-200"
        }`}
      >
        {todo.text}
      </span>
      <Button
        className="opacity-0 transition-opacity group-hover:opacity-100"
        onClick={() => onDelete(todo.id)}
        size="sm"
        variant="ghost"
      >
        Delete
      </Button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-zinc-800 border-dashed bg-zinc-900/30 py-12">
      <p className="font-medium text-sm text-zinc-400">No todos yet</p>
      <p className="text-xs text-zinc-500">
        Add your first todo to get started
      </p>
    </div>
  );
}

function TodoList({
  todos,
  onToggle,
  onDelete,
}: {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  if (todos.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          onDelete={onDelete}
          onToggle={onToggle}
          todo={todo}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      isCompleted: false,
    };
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-8 py-12 sm:space-y-16 md:py-20">
      <main className="space-y-16">
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="secondary">Template</Badge>
            <Badge variant="outline">v{packageJson.version}</Badge>
          </div>
          <h1 className="mb-8 font-bold text-4xl tracking-tight">
            🚀 ras.sh TanStack Start Template
          </h1>

          <div className="space-y-4">
            <p className="text-lg text-zinc-300 leading-relaxed">
              A production-ready template for building full-stack applications
              with{" "}
              <a
                className="underline transition-colors hover:text-zinc-100"
                href="https://tanstack.com/start"
                rel="noopener"
                target="_blank"
              >
                TanStack Start
              </a>
              . Configured with best practices and modern tooling.
            </p>
            <p className="text-sm text-zinc-400">
              Start building by editing{" "}
              <code className="rounded bg-zinc-800 px-2 py-1 text-sm">
                src/routes/index.tsx
              </code>
            </p>
          </div>
        </section>

        <section>
          <Card className="border-zinc-800">
            <CardHeader className="border-zinc-800 border-b pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Todo List</CardTitle>
                  <CardDescription className="mt-1.5">
                    A simple todo list to showcase the UI components
                  </CardDescription>
                </div>
                {todos.length > 0 && (
                  <Badge className="text-xs" variant="secondary">
                    {todos.filter((t) => !t.isCompleted).length} active
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <TodoForm onAdd={addTodo} />
                <TodoList
                  onDelete={deleteTodo}
                  onToggle={toggleTodo}
                  todos={todos}
                />
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="mb-6 border-zinc-800/50 border-b pb-2 font-bold text-2xl text-zinc-100">
            Learn More
          </h2>
          <div className="space-y-3 text-zinc-300">
            <a
              className="block underline transition-colors hover:text-zinc-100"
              href="https://tanstack.com/start/latest/docs/framework/react/overview"
              rel="noopener"
              target="_blank"
            >
              TanStack Start Documentation →
            </a>
            <a
              className="block underline transition-colors hover:text-zinc-100"
              href="https://ras.sh"
              rel="noopener"
              target="_blank"
            >
              More templates by ras.sh →
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
