import { api } from "@/trpc/server";
import React, { cache } from "react";
import { UserPickerForm } from "./UserPickerForm";

const fetch = cache(api.user.findAll.query);
export const UserPicker = async (props: { userId: string }) => {
  const data = await fetch();

  return (
    <div>
      <UserPickerForm userId={props.userId} data={data} />
    </div>
  );
};
