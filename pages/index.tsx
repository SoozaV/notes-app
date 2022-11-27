import { GetServerSideProps } from "next";
import { prisma } from "../lib/prisma";
import { useState } from "react";
import PageLayout from "../components/PageLayout";
import { useRouter } from "next/router";

type FormData = {
  id: string;
  title: string;
  content: string;
};

type Notes = {
  notes: {
    id: string;
    title: string;
    content: string;
  }[];
};

export default function Home({ notes }: Notes) {
  const [noteResponse, setNoteResponse] = useState("");
  const [form, setForm] = useState<FormData>({
    id: "",
    title: "",
    content: "",
  });

  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  };

  async function create(data: FormData) {
    try {
      const res = await fetch(`${process.env.API_URL}/api/create`, {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      setForm({ id: "", title: "", content: "" });
      refreshData();
      return await res.json();
    } catch (error) {
      console.log("Failure!: ", error);
    }
  }

  async function selectNote(note: FormData) {
    setForm({ id: note.id, title: note.title, content: note.content });
  }

  async function updateNote(note: FormData) {
    try {
      const res = await fetch(`${process.env.API_URL}/api/note/${note.id}`, {
        body: JSON.stringify(note),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
      });
      setForm({ id: "", title: "", content: "" });
      refreshData();
      return await res
        .json()
        .then(({ message }) => setNoteResponse(message))
        .then(() => {
          setTimeout(() => {
            setNoteResponse("");
          }, 4000);
        });
    } catch (error) {
      console.log("Error while updating!: ", error);
    }
  }

  async function deleteNote(id: string) {
    try {
      const res = await fetch(`${process.env.API_URL}/api/note/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
      });
      refreshData();
      setForm({ id: "", title: "", content: "" });
      return await res
        .json()
        .then(({ message }) => setNoteResponse(message))
        .then(() => {
          setTimeout(() => {
            setNoteResponse("");
          }, 4000);
        });
    } catch (error) {
      console.log("Failure!: ", error);
    }
  }

  const handleSubmit = async (data: FormData) => {
    try {
      create(data)
        .then(({ message }) => setNoteResponse(message))
        .then(() => {
          setTimeout(() => {
            setNoteResponse("");
          }, 4000);
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
              {!form.id ? (
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-500 active:bg-green-600 p-1 rounded text-white w-1/3"
                >
                  Add +
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    updateNote(form);
                  }}
                  className="bg-green-600 hover:bg-green-500 active:bg-green-600 p-1 rounded text-white w-1/3"
                >
                  Update
                </button>
              )}

              {form.id && (
                <button
                  onClick={() => {
                    setForm({ id: "", title: "", content: "" });
                  }}
                  className="bg-red-700 hover:bg-red-600 active:bg-red-700 p-1 px-3 text-white rounded"
                >
                  Cancel
                </button>
              )}
              {!form.id && <span id="note-response">{noteResponse}</span>}
            </div>
          </form>
        </section>
        <section className="basis-1/2">
          <ul className="bg-slate-200 rounded p-4">
            {notes.length ? (
              notes.map((note) => (
                <li
                  key={note.id}
                  className="p-2 border-b last:border-b-0 hover:bg-gray-100 border-gray-300"
                >
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg capitalize font-bold text-gray-800">
                        {note.title}
                      </h3>
                      <p>{note.content}</p>
                    </div>
                    <button
                      onClick={() => selectNote(note)}
                      className="bg-green-700 hover:bg-green-600 active:bg-green-700 px-3 text-white rounded mr-1 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="bg-red-700 hover:bg-red-600 active:bg-red-700 px-3 text-white rounded"
                    >
                      X
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <h3 className="text-center font-bold">
                Let&apos;s add your first note! &#40;:
              </h3>
            )}
          </ul>
        </section>
      </div>
    </PageLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const notes = await prisma.note.findMany({
    select: {
      id: true,
      title: true,
      content: true,
    },
  });

  return {
    props: {
      notes,
    },
  };
};
