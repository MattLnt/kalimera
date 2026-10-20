import { notFound } from "next/navigation";

import { PostForm, type PostFormData } from "../post-form";

import { AdminHeader } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Modifier un article" };

const emptyTranslation = {
  slug: "",
  title: "",
  excerpt: "",
  body: "",
  categoryLabel: "",
  seoTitle: "",
  seoDescription: "",
};

function toLocalInput(date: Date) {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: { translations: true, coverImage: true },
  });
  if (!post) notFound();

  const translations: PostFormData["translations"] = {
    FR: { ...emptyTranslation },
    EN: { ...emptyTranslation },
    ES: { ...emptyTranslation },
  };

  for (const translation of post.translations) {
    translations[translation.locale] = {
      slug: translation.slug,
      title: translation.title,
      excerpt: translation.excerpt,
      body: translation.body,
      categoryLabel: translation.categoryLabel,
      seoTitle: translation.seoTitle ?? "",
      seoDescription: translation.seoDescription ?? "",
    };
  }

  return (
    <>
      <AdminHeader
        title={translations.FR.title || post.key}
        back={{ href: "/admin/posts", label: "Journal" }}
      />
      <PostForm
        post={{
          id: post.id,
          key: post.key,
          category: post.category,
          published: post.published,
          publishedAt: post.publishedAt ? toLocalInput(post.publishedAt) : "",
          coverImage: post.coverImage
            ? {
                id: post.coverImage.id,
                url: post.coverImage.url,
                width: post.coverImage.width,
                height: post.coverImage.height,
              }
            : null,
          translations,
        }}
      />
    </>
  );
}
