"use server";

import { revalidatePath } from "next/cache";
import {
  addCategory,
  createOrder,
  deleteProduct,
  renameCategory,
  saveProduct,
  setOrderStatus,
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
  return { ok: true };
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
