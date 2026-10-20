import { PostForm } from "../post-form";

import { AdminHeader } from "@/components/admin/ui";

export const metadata = { title: "Nouvel article" };

const emptyTranslation = {
  slug: "",
  title: "",
  excerpt: "",
  body: "",
  categoryLabel: "",
  seoTitle: "",
  seoDescription: "",
};

/** Format attendu par <input type="datetime-local">. */
function toLocalInput(date: Date) {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function NewPostPage() {
  return (
    <>
      <AdminHeader
        title="Nouvel article"
        back={{ href: "/admin/posts", label: "Journal" }}
      />
      <PostForm
        post={{
          key: "",
          category: "engineering",
          published: false,
          publishedAt: toLocalInput(new Date()),
          coverImage: null,
          translations: {
            FR: { ...emptyTranslation },
            EN: { ...emptyTranslation },
            ES: { ...emptyTranslation },
          },
        }}
      />
    </>
  );
}
