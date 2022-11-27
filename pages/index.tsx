import { useState } from "react";
import PageLayout from "../components/PageLayout";

export default function Home() {
  const [form, setForm] = useState({ title: "", description: "" });

  return (
    <PageLayout>
      <div className="flex">
        <section className="basis-1/2">
          <h2 className="text-xl font-bold text-gray-800">Add a new note!</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="bg-slate-300 flex flex-col p-5 rounded mt-2 max-w-md shadow-md"
          >
            <input
              type="text"
              className="outline-none rounded mb-2 p-1"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <textarea
              name=""
              className="outline-none rounded mb-2 p-1"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            ></textarea>
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-500 active:bg-green-600 p-1 rounded text-white w-1/3"
              >
                Add +
              </button>
              <span>Note added!</span>
            </div>
          </form>
        </section>
        <section></section>
      </div>
    </PageLayout>
  );
}
