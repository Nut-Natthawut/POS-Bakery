import { Router } from "express";
import { checkAdmin, checkAuth } from "../middleware/auth.middleware";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../services/category.service";


const categoryRouter = Router();

//get all categories api
categoryRouter.get("/" , checkAuth , async (_req,res) => {
    try{
        const categories = await getCategories();
        return res.status(200).json({
            message: "Categories loaded successfully",
            data: categories
        })
    }catch{
        return res.status(500).json({
            message: "Failed to load categories"
        });

    }
});

//create category api
categoryRouter.post("/", checkAuth,checkAdmin , async (req,res) => {
    try{
        const { name } = req.body;
        if(!name){
            return res.status(400).json({
                message:"Category name is required"
            });
        }
        const category = await createCategory({ name });
        return res.status(201).json({
            message:"Category created successfully",
            data:category
        });
    }catch{
        return res.status(500).json({
            message:"Failed to create categories"
        });
    }
})

//update category api
categoryRouter.put("/:id", checkAuth,checkAdmin , async (req,res) => {
    try{
        const { id } = req.params;
        const { name } = req.body;
        if(!name){
            return res.status(400).json({
                message:"Category name is required"
            });
        }
        const category = await updateCategory(id as string, { name });
        return res.status(200).json({
            message:"Category updated successfully",
            data:category
        });
    }catch{
        return res.status(500).json({
            message:"Failed to update category"
        });
    }
});

//delete category api
categoryRouter.delete("/:id", checkAuth , checkAdmin, async (req,res) => {
    try{
        const { id } = req.params;
        const result = await deleteCategory(id as string);
        return res.status(200).json({
            message:"Category deleted successfully",
            data:result
        });
    }catch{
        return res.status(500).json({
            message:"Failed to delete category"
        });
    }
}) 

export default categoryRouter;