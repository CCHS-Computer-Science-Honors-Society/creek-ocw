import React, { cache } from "react";
import { z } from "zod";
import Search from "./search";
import EmailSearch from "./EmailSearch";
import { api } from "@/trpc/server";
import { UserForm } from "./UserForm";
import { db } from "@/server/db";

const searchParamsSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
});

async function getData() {
  const data = await db.query.course.findMany({
    columns: {
      id: true,
      name: true,
    },
  });

  return data;
}

const fetch = cache(getData);
const fetchUser = cache(api.admin.getUser.query);

export default async function Page(props: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { searchParams } = props;
  const { name, email } = searchParamsSchema.parse(searchParams);

  const data = await fetchUser({
    name: name,
    email: email,
  });

  const courses = await fetch();

  return (
    <div className="flex flex-col p-20">
      <SearchBar />
      <div className="flex flex-col p-10">
        {data.map((user) => {
          return <UserForm courses={courses} data={user} key={user.id} />;
        })}
      </div>
    </div>
  );
}

const SearchBar = () => {
  return (
    <div className="flex p-10">
      <Search />
      <EmailSearch />
    </div>
  );
};
