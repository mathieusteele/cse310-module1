import * as React from "react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useCatch,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import type { ArticleWithTags } from "~/models/article.server";
import { deleteTag } from "~/models/article.server";
import type { ArticleTag } from "@prisma/client";
import { requireUserId } from "~/session.server";
import { getArticle } from "~/models/article.server";
import { updateArticle } from "~/models/article.server";
import { createTag } from "~/models/article.server";

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden={true}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}

type ActionData = {
  errors?: {
    title?: string;
    body?: string;
    tag?: string;
  };
};

type LoaderData = {
  article: ArticleWithTags;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.articleId, "articleId not found");

  const article = await getArticle({ userId, id: params.articleId });
  if (!article) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ article });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.articleId, "articleId not found");

  let formData = await request.formData();
  let { _action } = Object.fromEntries(formData);

  let response;
  if (_action === "update_article") {
    const title = formData.get("title");
    const body = formData.get("body");

    if (typeof title !== "string" || title.length === 0) {
      return json<ActionData>(
        { errors: { title: "Title is required" } },
        { status: 400 }
      );
    }

    if (typeof body !== "string" || body.length === 0) {
      return json<ActionData>(
        { errors: { body: "Body is required" } },
        { status: 400 }
      );
    }
    response = await updateArticle({
      userId,
      id: params.articleId,
      title,
      body,
    });
    return redirect(`/kb/${response.id}`);
  } else if (_action === "create_tag") {
    const tag = formData.get("tag");

    if (typeof tag !== "string" || tag.length === 0) {
      return json<ActionData>(
        { errors: { tag: "Tag is required" } },
        { status: 400 }
      );
    }
    response = await createTag({
      name: tag,
      articleId: params.articleId,
      userId,
    });
    return redirect(`/kb/${params.articleId}/edit`);
  } else if (_action === "delete_tag") {
    const tagId = formData.get("tagId");

    if (typeof tagId !== "string" || tagId.length === 0) {
      return json<ActionData>(
        { errors: { tag: "Tag ID is required" } },
        { status: 400 }
      );
    }
    response = await deleteTag({
      id: tagId,
      userId,
    });

    return redirect(`/kb/${params.articleId}/edit`);
  } else {
    return redirect("/kb");
  }
};

export default function ArticleEditPage() {
  const data = useLoaderData();
  const actionData = useActionData() as ActionData;
  const titleRef = React.useRef<HTMLInputElement>(null);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);
  const tagRef = React.useRef<HTMLInputElement>(null);

  let transition = useTransition();

  React.useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus();
    } else if (actionData?.errors?.tag) {
      tagRef.current?.focus();
    }
  }, [actionData]);

  if (transition.submission) {
    let name = transition.submission.formData.get("tag");
    if (typeof name === "string") {
      return <span>Creating Tag</span>;
    }
  }

  return (
    <>
      <h1 className="mb-6 text-4xl font-bold">Editing Article</h1>
      <Form
        method="post"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "100%",
        }}
      >
        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Title: </span>
            <input
              ref={titleRef}
              name="title"
              className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
              aria-invalid={actionData?.errors?.title ? true : undefined}
              aria-errormessage={
                actionData?.errors?.title ? "title-error" : undefined
              }
              defaultValue={data.article.title}
            />
          </label>
          {actionData?.errors?.title && (
            <div className="pt-1 text-red-700" id="title-error">
              {actionData.errors.title}
            </div>
          )}
        </div>

        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Body: </span>
            <textarea
              ref={bodyRef}
              name="body"
              rows={8}
              className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
              aria-invalid={actionData?.errors?.body ? true : undefined}
              aria-errormessage={
                actionData?.errors?.body ? "body-error" : undefined
              }
              defaultValue={data.article.body}
            />
          </label>
          {actionData?.errors?.body && (
            <div className="pt-1 text-red-700" id="body-error">
              {actionData.errors.body}
            </div>
          )}
        </div>

        <div className="text-right">
          <button
            type="submit"
            name="_action"
            value="update_article"
            className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Save
          </button>
        </div>
      </Form>
      Tags:
      {data.article.tags.map((tag: ArticleTag) => (
        <Form key={tag.id} method="post" className="mx-5 inline">
          <input type="hidden" name="tagId" value={tag.id} />
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-lg font-medium capitalize text-gray-800">
            {tag.name}
          </span>
          <button
            type="submit"
            name="_action"
            value="delete_tag"
            className="inline-flex items-center rounded bg-white px-2.5 py-1.5 font-medium text-red-700 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <TrashIcon />
          </button>
        </Form>
      ))}
      <Form method="post" className="mt-10">
        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Add a Tag: </span>
            <input
              ref={tagRef}
              name="tag"
              className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
              aria-invalid={actionData?.errors?.tag ? true : undefined}
              aria-errormessage={
                actionData?.errors?.tag ? "tag-error" : undefined
              }
            />
          </label>
          {actionData?.errors?.tag && (
            <div className="pt-1 text-red-700" id="tag-error">
              {actionData.errors.tag}
            </div>
          )}
        </div>

        <div className="text-right">
          <button
            type="submit"
            name="_action"
            value="create_tag"
            className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Save
          </button>
        </div>
      </Form>
    </>
  );
}

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
