# Overview

I have heard many people talking about the merits of Prisma as a cloud database tool with a good blend of usability and capability. It has been especially touted for it's developer friendly integrations with TypeScript. It is a natural fit for a Remix project and I decided that I would implement the backend / database for my knowledgebase project with Prisma.

Knowledgebase was conceived as a personal knowledge management tool. It could be adapted in a corporate environment or implemented by an individual who wants to record paragraph-format content. The entries that are submitted to the knowledgebase as articles become searchable by the user that created them, so they can easily be referenced when needed. The article data is stored in a cloud database and protected behind a user authentication system. Upon logging in, a user is invited to create an article consisting of a title, body content, and tags. The tags are search indexed and are the way that the article content is recalled.

I chose to build this knowledge management tool because at my workplace we use a MediaWiki installation for a team knowledge management and I wanted to see how difficult it would be to build a simplified version using some of the concepts of a wiki.

{Provide a link to your YouTube demonstration.  It should be a 4-5 minute demo of the software running, a walkthrough of the code, and a view of the cloud database.}

[Demonstration Video](https://youtu.be/Z7asCjewIfw)

# Cloud Database

The cloud database that I am using is called Prisma. Prisma can integrate with well known data storage platforms and traditional databases including the popular MongoDB, Postgres, MySQL, SQLite, and others. By wrapping the CRUD operations with a simpler, safer javascript object-relational mapper (ORM), Prisma gives the developer an easy way to query data and perform mutations.

The data structure includes tables for Users and a password table for authentication, there is a table of Articles, and lastly a table of ArticleTags. Each user can have multiple articles, and each article can have multiple tags.

# Development Environment

I developed the knowledgebase application with the Remix Indie Stack. I first built the web application pages individually with example data not using a database. This allowed me to lay out the application pages and identify where the forms should be and how they should work.

More recently, the second phase of the project involved identifying the appropriate structure of the database to represent it in the Prisma Schema. The schema is the Prisma way of defining the shape of the data and the associated relations. After a few iterations, I think that the data schema is appropriately represented in this tool. I used Prisma Studio to visualize the database data to confirm that entries were showing up in the database and it was helpful when troubleshooting a mistake in one of my mutations.

The programming for the database interactions was done predominantly in TypeScript.

# Useful Websites

* [Prisma Docs](https://www.prisma.io/docs/)
* [Remix Run Docs](https://remix.run/docs/en/v1)

# Future Work

* At present, the article content is displayed in one paragraph and it does not lend itself well to longer form content. I would like to implement some form of formatting options such as MarkDown or similar.
* It would be nice if multiple users on a team could collaborate to maintain the article content.
* With some artificial intelligence, It might be possible to automatically suggest appropriate tags that would be a good fit for article content.
* Allowing images and hyperlinks would make this more useful as a wiki replacement.