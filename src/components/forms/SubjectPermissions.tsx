"use client";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import AutoForm from "../ui/auto-form";
import { toast } from "sonner";
import { handleError } from "@/lib/utils";
import { api } from "@/trpc/react";
import {
  subject_permissions,
  type SubjectPermission,
} from "@/server/permissions"; // Assuming similar structure as course_permissions
import { Button } from "../ui/button";

export function ManageSubjectPermissions(props: {
  user: {
    userId: string;
    currentPermission: SubjectPermission[];
  };
  subjectId: string;
}) {
  const { user, subjectId } = props;
  const router = useRouter();

  const [initialValues, setInitialValues] = useState<Partial<FormSchema>>({});

  useEffect(() => {
    setInitialValues(getDefaultValues());
  }, [user.currentPermission]);

  // Define form schema with optional boolean fields for subject permissions
  const formSchema = z.object(
    subject_permissions.reduce(
      (acc, permission) => {
        acc[permission] = z.boolean().optional();
        return acc;
      },
      {} as Record<SubjectPermission, z.ZodOptional<z.ZodBoolean>>,
    ),
  );
  type FormSchema = z.infer<typeof formSchema>;

  const getDefaultValues = useCallback(() => {
    return formSchema.parse(
      subject_permissions.reduce((acc, permission) => {
        acc[permission] = user.currentPermission.includes(permission);
        return acc;
      }, {} as Partial<FormSchema>),
    );
  }, [user.currentPermission, formSchema]);

  const { mutate } = api.user.updateSubjectPermissions.useMutation({
    // Update this API call
    onSuccess() {
      toast.success("Permissions updated");
    },
    onError(error) {
      handleError(error);
    },
  });

  function handleSubmit(values: FormSchema) {
    const isDifferent = subject_permissions.some(
      (permission) => initialValues[permission] !== values[permission],
    );
    if (!isDifferent) return;
    const updatedPermissions = new Set(user.currentPermission);

    for (const permission of subject_permissions) {
      if (values[permission]) {
        updatedPermissions.add(permission);
      } else {
        updatedPermissions.delete(permission);
      }
    }

    mutate({
      subjectId: subjectId,
      userId: user.userId,
      permissions: Array.from(updatedPermissions),
    });
    router.refresh();
  }

  function handleGiveAllPermissions() {
    const allPermissions = subject_permissions.reduce((acc, permission) => {
      if (permission !== "none") {
        acc[permission] = true;
      }
      return acc;
    }, {} as Partial<FormSchema>);

    setInitialValues(allPermissions);
    handleSubmit(allPermissions as FormSchema);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-start gap-20">
        <Button onClick={handleGiveAllPermissions} variant={"outline"}>
          Give all permissions
        </Button>
      </div>
      <AutoForm
        values={getDefaultValues()}
        formSchema={formSchema}
        onValuesChange={(values) => handleSubmit(values as FormSchema)}
      ></AutoForm>
    </div>
  );
}
