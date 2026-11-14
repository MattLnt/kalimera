"use client";

import { useOptimistic, useTransition } from "react";

import { setMessageStatus } from "./actions";

import { PillSelect } from "@/components/admin/board/pill";
import { messageStatusOptions } from "@/lib/crm/vivid";

/** Pastille de statut d'une demande, modifiable d'un clic. */
export function MessageStatus({ id, status }: { id: string; status: string }) {
  const [, startTransition] = useTransition();
  const [value, setValue] = useOptimistic(status);
  return (
    <PillSelect
      value={value}
      options={messageStatusOptions}
      label="Statut de la demande"
      onChange={(next) =>
        startTransition(async () => {
          setValue(next);
          await setMessageStatus(id, next);
        })
      }
    />
  );
}
