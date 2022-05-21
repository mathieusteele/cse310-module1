import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import * as React from "react";

import { getArticleListItems } from "~/models/article.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  articleListItems: Awaited<ReturnType<typeof getArticleListItems>>;
};

function FilterIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-gray-400"
      aria-hidden={true}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
      />
    </svg>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const articleListItems = await getArticleListItems({ userId });
  return json<LoaderData>({ articleListItems });
};

export default function KnowledgebasePage() {
  const data = useLoaderData() as LoaderData;
  const [searchTerm, setSearchTerm] = React.useState("");

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
          <form className="mt-6 flex space-x-4" action="#">
            <div className="min-w-0 flex-1">
              <label htmlFor="search" className="sr-only">
                Filter
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FilterIcon />
                </div>
                <input
                  type="search"
                  name="search"
                  id="search"
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event?.target.value)}
                />
              </div>
            </div>
          </form>

          {/* Filter:
          <input
            type="text"
            name="searchTerm"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event?.target.value)}
          /> */}
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + Add
          </Link>
          <hr />
          {data.articleListItems.length === 0 ? (
            <p className="p-4">No articles yet</p>
          ) : (
            <ol>
              {data.articleListItems
                .filter((article) =>
                  article.tags.find((tag) => tag.name.includes(searchTerm))
                )
                .map((article) => (
                  <li key={article.id}>
                    <NavLink
                      className={({ isActive }) =>
                        `block border-b p-4 text-xl ${
                          isActive ? "bg-white" : ""
                        }`
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
