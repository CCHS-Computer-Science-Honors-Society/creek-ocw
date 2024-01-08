import { type CoursePermissions } from "@/server/permissions";
import React from "react";

export const CoursePermissionsForm = (props: {
  permissions: CoursePermissions[];
}) => {
  const { permissions } = props;

  return (
    <div>
      {permissions.map((permission) => {
        return (
          <div key={permission[0]}>
            <label>
              <input type="checkbox" />
              {permission}
            </label>
          </div>
        );
      })}
    </div>
  );
};
