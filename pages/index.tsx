import { useState } from "react";
import PageLayout from "../components/PageLayout";

type FormData = {
  id: string;
  title: string;
  content: string;
};

export default function Home() {
  const [noteResponse, setNoteResponse] = useState("");
  const [form, setForm] = useState<FormData>({
    id: "",
    title: "",
    content: "",
  });

  async function create(data: FormData) {
    try {
      const res = await fetch("http://localhost:3000/api/create", {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      setForm({ id: "", title: "", content: "" });
      return await res.json();
    } catch (error) {
      console.log("Failure!: ", error);
    }
  }

  const handleSubmit = async (data: FormData) => {
    try {
      create(data)
        .then(({ message }) => setNoteResponse(message))
        .then(() => {
          const noteResponseSpan = document.getElementById("note-response");
          noteResponseSpan?.classList.toggle("hidden");
          setTimeout(() => {
            noteResponseSpan?.classList.toggle("hidden");
          }, 3000);
        });
    } catch (error) {
      console.log("Failure!: ", error);
    }
  };

  return (
    <PageLayout>
      <div className="flex">
        <section className="basis-1/2">
          <h2 className="text-xl font-bold text-gray-800">Add a new note!</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(form);
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
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            ></textarea>
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-500 active:bg-green-600 p-1 rounded text-white w-1/3"
              >
                Add +
              </button>
              <span id="note-response" className="hidden transition-all duration-1000">
                {noteResponse}
              </span>
            </div>
          </form>
        </section>
        <section></section>
      </div>
    </PageLayout>
  );
}
