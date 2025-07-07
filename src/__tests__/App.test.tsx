import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { describe, expect, it } from "vitest";

describe("ToDo App", () => {
  it("adds a new todo", async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/what needs to be done/i);
    await userEvent.type(input, "Test task{enter}");

    expect(screen.getByText("Test task")).toBeInTheDocument();
  });

  it("marks a todo as completed", async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/what needs to be done/i);

    await userEvent.type(input, "Complete me{enter}");
    const item = screen.getByText("Complete me");

    await userEvent.click(item);

    expect(item).toHaveClass("done");
  });

  it("filters completed tasks", async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/what needs to be done/i);

    await userEvent.type(input, "Task A{enter}");
    await userEvent.type(input, "Task B{enter}");

    const taskA = screen.getByText("Task A");

    await userEvent.click(taskA);

    const completedFilter = screen.getByRole("button", {
      name: /^Completed$/i,
    });
    await userEvent.click(completedFilter);

    expect(screen.getByText("Task A")).toBeInTheDocument();
    expect(screen.queryByText("Task B")).not.toBeInTheDocument();
  });

  it("filters active tasks", async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/what needs to be done/i);

    await userEvent.type(input, "Task A{enter}");
    await userEvent.type(input, "Task B{enter}");

    const taskA = screen.getByText("Task A");

    await userEvent.click(taskA);

    const activeFilter = screen.getByRole("button", { name: /active/i });
    await userEvent.click(activeFilter);

    expect(screen.getByText("Task B")).toBeInTheDocument();
    expect(screen.queryByText("Task A")).not.toBeInTheDocument();
  });

  it("clears completed tasks", async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/what needs to be done/i);

    await userEvent.type(input, "Clean me{enter}");
    const task = screen.getByText("Clean me");

    await userEvent.click(task);

    const clearButton = screen.getByRole("button", {
      name: /clear completed/i,
    });
    await userEvent.click(clearButton);

    expect(screen.queryByText("Clean me")).not.toBeInTheDocument();
  });
});
