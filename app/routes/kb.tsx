import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

type LoaderData = {
  articles: { id: string; title: string }[];
};

export const loader: LoaderFunction = async ({ request }) => {
  // For now, we hard-code the menu items.
  // Later, they will be populated from a database.
  const articles = [
    { id: "abc123", title: "How to Clean the Water Heater" },
    { id: "bcd123", title: "How to Refill the Water Softener" },
    { id: "cde123", title: "How to Change the oil in the Lawn Mower" },
  ];
  return json<LoaderData>({ articles });
};

export default function KnowledgebasePage() {
  const data = useLoaderData() as LoaderData;

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Knowledgebase Articles</Link>
        </h1>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + Add
          </Link>

          <hr />

          {data.articles.length === 0 ? (
            <p className="p-4">No notes yet</p>
          ) : (
            <ol>
              {data.articles.map((article) => (
                <li key={article.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={article.id}
                  >
                    📝 {article.title}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
