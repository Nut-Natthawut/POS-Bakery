import { useEffect, useState } from "react"
import { DataTableShell } from "../components/ui/DataTableShell"
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../services/categoryApi"
import type { Category } from "../types/category"

export const CategoriesPage = () => {
    //state สำหรับเก็บข้อมูล
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
    //state สำหรับเปิด/ปิดฟอร์ม
  const [isFormOpen, setIsFormOpen] = useState(false);
    //state สำหรับเก็บข้อมูลที่กำลังแก้ไข
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");

    // โหลดหมวดหมู่ทั้งหมดเพื่อแสดงในตาราง
    const loadCategories = async () => {
        try {
        setIsLoading(true);
        setError("");

        const result = await getCategories();
        setCategories(result.data);
        } catch (error) {
        setError(
            error instanceof Error ? error.message : "Load categories failed",
        );
        } finally {
        setIsLoading(false);
        }
    };

    // โหลดข้อมูลครั้งแรกเมื่อเข้า CategoriesPage
    useEffect(() => {
        loadCategories();
    }, []);

    // ล้างค่าฟอร์ม
    const clearForm = () => {
        setName("");
    };

    // เปิดฟอร์มเพิ่มหมวดหมู่
    const openCreateForm = () => {
        clearForm();
        setEditingCategory(null);
        setIsFormOpen(true);
    };

    // เปิดฟอร์มแก้ไขหมวดหมู่
    const openEditForm = (category: Category) => {
        setEditingCategory(category);
        setName(category.name);
        setIsFormOpen(true);
    };

    // ปิดฟอร์มและล้าง state
    const closeForm = () => {
        clearForm();
        setEditingCategory(null);
        setIsFormOpen(false);
    };

    // เพิ่ม/แก้ไขหมวดหมู่
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // ตรวจสอบชื่อหมวดหมู่ก่อนส่งไป backend
      if (!name.trim()) {
        setError("Category name is required");
        return;
      }

      try {
        setIsSubmitting(true);
        setError("");

        if (editingCategory) {
          await updateCategory(editingCategory.id, { name: name.trim() });
        } else {
          await createCategory({ name: name.trim() });
        }

        closeForm();
        await loadCategories();
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Save category failed",
        );
      } finally {
        setIsSubmitting(false);
      }
    };

    // ลบหมวดหมู่
    const handleDelete = async (id: string) => {
      const confirmed = window.confirm("Delete this category?");

      if (!confirmed) {
        return;
      }

      try {
        setError("");
        await deleteCategory(id);
        await loadCategories();
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Delete category failed",
        );
      }
    };

    return (
      <section className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-black/45">Menu Management</p>
            <h1 className="text-2xl font-semibold tracking-normal text-[#1d1d1f]">
              Categories
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-black/55">
              จัดการหมวดหมู่สินค้าสำหรับใช้ในเมนูและฟอร์มสินค้า
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
          >
            Add Category
          </button>
        </div>

        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {isFormOpen ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-md border border-black/10 bg-white p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold">
              {editingCategory ? "Edit Category" : "Add Category"}
            </h2>

            <div className="space-y-1">
              <label className="text-sm font-medium text-black/70">
                Category Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Drink"
                className="w-full rounded-md border border-black/10 px-3 py-2"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-md border px-4 py-2 text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}

        {isLoading ? (
          <div className="space-y-3">
            <div className="h-16 animate-pulse rounded-md border bg-black/5" />
            <div className="h-16 animate-pulse rounded-md border bg-black/5" />
            <div className="h-16 animate-pulse rounded-md border bg-black/5" />
          </div>
        ) : (
          <DataTableShell
            title="Category List"
            description="จัดการหมวดหมู่ที่ใช้ในเมนูสินค้า"
          >
            {categories.length === 0 ? (
              <div className="rounded-md border border-dashed px-4 py-8 text-center text-sm text-black/60">
                ยังไม่มีหมวดหมู่สินค้าในระบบ
              </div>
            ) : (
              <table className="min-w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b bg-black/[0.03]">
                    <th className="px-4 py-3 font-medium text-black/65">
                      Name
                    </th>
                    <th className="px-4 py-3 font-medium text-black/65">
                      Created At
                    </th>
                    <th className="px-4 py-3 font-medium text-black/65">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b last:border-b-0">
                      <td className="px-4 py-3 font-medium">{category.name}</td>
                      <td className="px-4 py-3">
                        {new Date(category.created_at).toLocaleString()}
                      </td>
                      <td className="space-x-2 px-4 py-3">
                        <button
                          type="button"
                          onClick={() => openEditForm(category)}
                          className="rounded-md border border-black/15 px-3 py-1 text-sm hover:bg-black/5"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(category.id)}
                          className="rounded-md border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </DataTableShell>
        )}
      </section>
    );
};
