import type {
    Category,
    CreateCategoryInput,
    UpdateCategoryInput
} from "../types/category.type";
import { supabase } from "../lib/supabase";

export const getCategories = async () => {
    const { data , error } = await supabase
    .from("categories")
    .select("id, name, created_at")
    .order("created_at", { ascending: false });
    
    if(error) {
        throw new Error("Failed to load categories")
    }
    return data as Category[];

}

export const createCategory = async (input: CreateCategoryInput) => {
    const { data, error } = await supabase
    .from("categories")
    .insert({
        name:input.name
    })
    .select("id, name, created_at")
    .single();

    if(error) {
        throw new Error("Failed to create category")
    }
    return data as Category;
}

export const updateCategory = async (
    id:string,
    input: UpdateCategoryInput
) => {
    const { data, error } = await supabase
    .from("categories")
    .update({
       name:input.name
    })
    .eq("id", id)
    .select("id, name, created_at")
    .single();

    if(error) {
        throw new Error("Failed to update category")
    }
    return data as Category;

}

export const deleteCategory = async (id:string) => {
    const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id",id);

    if(error){
        throw new Error("Failed to delete category")
    }
    return {
        id
    };
};
