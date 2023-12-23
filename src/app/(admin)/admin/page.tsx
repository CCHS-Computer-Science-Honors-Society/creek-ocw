import React from "react";
import { z } from "zod";
import Search from "./search";
import EmailSearch from "./EmailSearch";
import { api } from "@/trpc/server";
import { UserForm } from "./UserForm";

const searchParamsSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
});

export default async function Page(props: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { searchParams } = props;
  const { name, email } = searchParamsSchema.parse(searchParams);

  const data = await api.admin.getUser.query({
    name: name,
    email: email,
  });

  return (
    <div className="flex flex-col p-20">
      <SearchBar />
      <div className="flex flex-col p-10">
        {data.map((user) => {
          return <UserForm data={user} key={user.id} />;
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
