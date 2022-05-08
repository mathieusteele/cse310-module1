import * as React from "react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

// import type { Note } from "~/models/note.server";
// import { deleteArticle } from "~/models/note.server";
// import { getNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";

type ActionData = {
  errors?: {
    title?: string;
    body?: string;
    tags?: string;
  };
};

type Article = {
  id: string;
  title: string;
  body: string;
  tags: string[];
};

type LoaderData = {
  article: Article;
};

interface ArticleParams {
  userId: string;
  id: string;
}

export const getArticle: Function = async ({ userId, id }: ArticleParams) => {
  if (id === "abc123") {
    return {
      id: "abc123",
      title: "How to Clean the Water Heater",
      body: `Bacon ipsum dolor amet jerky leberkas pancetta kielbasa, swine shank landjaeger ground round cupim tri-tip frankfurter turkey t-bone shoulder. Short ribs ball tip sirloin meatloaf, biltong landjaeger pastrami. Pork chop strip steak tongue, ham pancetta kielbasa bacon meatball buffalo meatloaf. Corned beef pork belly andouille, rump fatback bresaola landjaeger shank sirloin ground round jowl biltong pork loin ham.\n
    \n
          Tri-tip doner corned beef sausage flank. Kevin pig shoulder burgdoggen, hamburger swine kielbasa flank jerky landjaeger pancetta bacon frankfurter. Bresaola kevin beef ribs salami turkey, pancetta venison landjaeger pork ribeye tenderloin sirloin brisket cow. Chislic strip steak spare ribs boudin, t-bone meatball corned beef sirloin. Ball tip tail swine jerky burgdoggen strip steak tongue beef ribs venison meatball capicola corned beef landjaeger ribeye shoulder. Rump salami sirloin ribeye sausage prosciutto venison buffalo doner.\n
          \n
          Turkey t-bone tri-tip, tenderloin strip steak sausage short loin picanha pastrami kielbasa swine burgdoggen jerky jowl doner. Landjaeger brisket sausage sirloin meatball andouille pork belly chicken shank t-bone, kielbasa boudin porchetta buffalo. Pastrami leberkas rump landjaeger turkey ball tip tail pork belly kielbasa. Ball tip tail chislic short loin t-bone filet mignon. Shank fatback beef ribs ham picanha strip steak jowl alcatra ball tip burgdoggen.\n
          \n
          Boudin hamburger frankfurter meatloaf flank chuck meatball cupim. Prosciutto salami pig short loin, shankle cupim bacon frankfurter turkey hamburger rump tongue. Alcatra beef ribeye, brisket filet mignon corned beef cow burgdoggen kielbasa. Brisket prosciutto drumstick, leberkas cupim porchetta capicola short ribs bresaola doner chicken cow.\n
          \n
          Cow pork chop t-bone rump. Turkey kevin pork spare ribs. Filet mignon shoulder corned beef flank pig. Cupim t-bone chislic turkey venison. Jowl ball tip strip steak, leberkas ground round short loin ham.\n
          \n
          Does your lorem ipsum text long for something a little meatier? Give our generator a try… it’s tasty!`,
      tags: ["how to", "vinegar", "water heater", "clean", "hot water"],
    };
  }
  if (id === "bcd123") {
    return {
      id: "bcd123",
      title: "How to Refill the Water Softener",
      body: `Bacon ipsum dolor amet tri-tip cow pork chop capicola venison, ham turducken short ribs leberkas. Kevin chuck meatball capicola cupim rump. Jowl strip steak pastrami ground round t-bone prosciutto, cow pork chop. Filet mignon chislic corned beef fatback boudin rump. Filet mignon flank cow beef shank. Landjaeger venison ham frankfurter chislic. Corned beef filet mignon short loin flank, ham frankfurter pork chop turkey brisket alcatra hamburger cupim.
    
          Pastrami salami pork leberkas. Capicola cupim pancetta pork loin swine beef ribs. Pork loin drumstick chislic prosciutto, capicola tail bacon chicken. Chuck tail beef ribs leberkas shoulder tenderloin filet mignon pig beef pork loin. Pancetta pork belly tail turducken meatloaf, sirloin kielbasa pork ham hock tongue pork chop kevin tri-tip leberkas. Jerky chislic bacon shoulder corned beef landjaeger pork loin picanha tongue biltong pork chop burgdoggen strip steak. Drumstick brisket tenderloin, buffalo cow pancetta pork belly short loin bacon ham porchetta andouille.
          
          Landjaeger sirloin pastrami filet mignon, burgdoggen meatball shoulder bresaola tri-tip boudin tongue pig alcatra capicola. Capicola tail frankfurter corned beef spare ribs venison swine ribeye bresaola. Chislic landjaeger pork loin filet mignon ball tip fatback t-bone bacon tail doner tongue. Boudin kevin swine picanha, ham hock beef landjaeger sausage pork belly meatball shank. Venison porchetta cow kielbasa pork loin, fatback pig corned beef salami jerky tenderloin pork belly chuck chicken swine.`,
      tags: [
        "how to",
        "hard water",
        "salt",
        "soft water",
        "water softener",
        "refill",
      ],
    };
  }
  if (id === "cde123") {
    return {
      id: "cde123",
      title: "How to Change the Oil in the Lawn Mower",
      body: `Beef ribs ball tip filet mignon, tri-tip picanha porchetta leberkas turkey venison fatback ground round rump jowl strip steak. Filet mignon sausage salami, beef ball tip buffalo tenderloin pork loin tri-tip beef ribs bacon andouille hamburger. Swine picanha beef ribs pork flank frankfurter turkey tongue, ham brisket hamburger meatloaf. Tri-tip shankle pig venison ham pork chop. Andouille landjaeger leberkas venison. Ribeye hamburger pork belly boudin turkey kevin venison swine beef ribs kielbasa biltong frankfurter. T-bone landjaeger sausage, chislic tongue drumstick biltong shank.
    
          Pastrami ham hock chicken short loin cupim drumstick biltong picanha. Rump short loin ground round tri-tip tail drumstick flank, beef ribs pancetta porchetta meatloaf. Filet mignon drumstick fatback porchetta bacon picanha andouille buffalo bresaola cupim kielbasa meatball landjaeger doner. Chislic sirloin sausage salami, t-bone hamburger frankfurter. Shoulder pancetta sausage shank pastrami cupim kevin.
          
          Prosciutto shank pork cow jerky swine meatloaf, ground round pork chop drumstick buffalo capicola frankfurter shoulder. Meatloaf shankle buffalo, shank beef ribs beef picanha spare ribs kevin corned beef. Short ribs capicola spare ribs chislic. Flank sausage jowl turkey, jerky ball tip turducken cupim hamburger chicken ham kevin tail. Brisket pancetta jerky, meatball pork loin porchetta tail meatloaf bacon boudin ham hock filet mignon.`,
      tags: [
        "how to",
        "grass",
        "lawn care",
        "landscaping",
        "mowing",
        "lawn mower",
      ],
    };
  }
};

export const saveArticle: Function = async (userId: string, id: string) => {
  console.log(`saving:  + ${userId} + ${id}`);
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

  await saveArticle({ userId, id: params.articleId });

  return redirect("/kb");
};

export default function ArticleEditPage() {
  const data = useLoaderData() as LoaderData;
  const actionData = useActionData() as ActionData;
  const titleRef = React.useRef<HTMLInputElement>(null);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);
  const tagsRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus();
    } else if (actionData?.errors?.tags) {
      tagsRef.current?.focus();
    }
  }, [actionData]);

  return (
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

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Tags (each on a line): </span>
          <textarea
            ref={tagsRef}
            name="tags"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
            aria-invalid={actionData?.errors?.tags ? true : undefined}
            aria-errormessage={
              actionData?.errors?.tags ? "tags-error" : undefined
            }
            defaultValue={data.article.tags}
          />
        </label>
        {actionData?.errors?.tags && (
          <div className="pt-1 text-red-700" id="tags-error">
            {actionData.errors.tags}
          </div>
        )}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
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
