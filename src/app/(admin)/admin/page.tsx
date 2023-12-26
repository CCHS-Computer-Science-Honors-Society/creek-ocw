import React, { cache } from "react";
import { z } from "zod";
import { api } from "@/trpc/server";
import { UserForm } from "./UserForm";
import { db } from "@/server/db";
import { NameSearch, EmailSearch } from "./_components/Search";

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
const fetchUsers = cache(api.admin.getUsers.query);

export default async function Page(props: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { searchParams } = props;
  const { name, email } = searchParamsSchema.parse(searchParams);

  const data = await fetchUsers({
    name: name,
    email: email,
  });

  const courses = await fetch();

  return (
    <div className="flex flex-col p-20">
      <SearchBar />
      <div className="flex flex-col p-10">
        {data.map((user) => {
          return <UserRow courses={courses} data={user} key={user.id} />;
        })}
      </div>
    </div>
  );
}

const SearchBar = () => {
  return (
    <div className="flex gap-4 p-10">
      <NameSearch />
      <EmailSearch />
    </div>
  );
};
