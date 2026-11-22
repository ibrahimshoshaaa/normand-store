"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, signAdminCookie } from "./admin-auth";
import {
  addCategory,
  createOrder,
  deleteProduct,
  renameCategory,
  saveProduct,
  setOrderStatus,
  subscribeNewsletter,
  type NewOrderInput,
  type ProductInput,
} from "./store";

export async function placeOrderAction(input: NewOrderInput) {
  const order = await createOrder(input);
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  return { code: order.code, totalCents: order.totalCents };
}

export async function updateOrderStatusAction(code: string, status: string) {
  await setOrderStatus(code, status);
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${code}`);
  return { ok: true };
}

export async function subscribeAction(email: string) {
  await subscribeNewsletter(email);
  revalidatePath("/admin/subscribers");
  return { ok: true };
}

// ---- admin gate -------------------------------------------------------------
export async function adminLoginAction(
  _prev: { error: string | null },
  formData: FormData,
): Promise<{ error: string | null }> {
  const next = (formData.get("next") as string) || "/admin";
  const password = process.env.ADMIN_PASSWORD;
  // No password configured — the admin is open (the layout shows a warning).
  if (!password) redirect(next);
  const provided = String(formData.get("password") ?? "");
  // Compare SHA-256 digests with a timing-safe comparison (equal lengths).
  const hash = (s: string) => createHash("sha256").update(s).digest();
  if (!timingSafeEqual(hash(provided), hash(password))) {
    return { error: "Wrong password. Try again." };
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, await signAdminCookie(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });
  redirect(next);
}

export async function adminLogoutAction() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

export async function saveProductAction(slug: string | null, input: ProductInput) {
  const product = await saveProduct(slug, input);
  revalidatePath("/shop");
  revalidatePath("/");
  revalidatePath("/admin/products");
  return { slug: product.slug };
}

export async function deleteProductAction(slug: string) {
  await deleteProduct(slug);
  revalidatePath("/shop");
  revalidatePath("/");
  revalidatePath("/admin/products");
  return { ok: true };
}

export async function renameCategoryAction(slug: string, newName: string) {
  await renameCategory(slug, newName);
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/categories");
  return { ok: true };
}

export async function addCategoryAction(name: string) {
  await addCategory(name);
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/categories");
  return { ok: true };
}
