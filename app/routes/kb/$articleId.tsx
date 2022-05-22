import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { requireUserId } from "~/session.server";

import type { ArticleWithTags } from "~/models/article.server";
import { deleteArticle } from "~/models/article.server";
import { getArticle } from "~/models/article.server";
import type { ArticleTag } from "@prisma/client";

interface LoaderData {
  article: ArticleWithTags;
}

// Get article from the id in the URL
export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.articleId, "articleId not found");

  const article = await getArticle({ userId, id: params.articleId });
  if (!article) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ article });
};

// Handle deletes
export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.articleId, "articleId not found");

  await deleteArticle({ userId, id: params.articleId });

  return redirect("/kb");
};

export default function ArticleDetailsPage() {
  const data = useLoaderData();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.article.title}</h3>
      <p className="py-6">{data.article.body}</p>
      <p className="py-6">
        Tags:{" "}
        {data.article.tags.map((tag: ArticleTag) => (
          <span
            key={tag.id}
            className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium capitalize text-gray-800"
          >
            {tag.name}
          </span>
        ))}
      </p>
      <hr className="my-4" />
      <div className="inline px-2">
        <Link
          to="edit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Edit
        </Link>
      </div>
      <Form
        method="post"
        className="inline px-2"
        onSubmit={(e) =>
          window.confirm(
            "Are you sure you want to delete? This cannot be undone"
          )
            ? ""
            : e.preventDefault()
        }
      >
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

// show more helpful messages
export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Article not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
