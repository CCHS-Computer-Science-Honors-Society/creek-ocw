"use client";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { handleError } from "@/lib/utils";
import { createUnit } from "@/server/api/actions/units";
import { createUnitSchema } from "@/server/db/schema";
import { useAction } from "next-safe-action/hook";
import React from "react";
import { toast } from "sonner";

export const CreateUnitForm = (props: { courseId: string }) => {
  const { courseId } = props;
  const { execute } = useAction(createUnit, {
    onSuccess: () => {
      toast.success("Successfuly Created Unit");
    },
    onError: (err) => {
      handleError(err);
    },
  });
  return (
    <div>
      <AutoForm
        formSchema={createUnitSchema.omit({
          id: true,
          courseId: true,
        })}
        fieldConfig={{
          unitNumber: {
            fieldType: "number",
          },
        }}
        onSubmit={(v) =>
          execute({
            ...v,
            courseId,
          })
        }
      >
        <AutoFormSubmit />
      </AutoForm>
    </div>
  );
};
