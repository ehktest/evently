import { Document, Schema, model, models } from "mongoose";

export interface ICategory extends Document {
  _id: string;
  namge: string;
}

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
});

const Category = models.Category || model("Category", CategorySchema);

export default Category;
// import Category, { ICategory } from '@/lib/database/models/category.model.ts';
// import CustomCategoryModel, { ICategory } from '@/lib/database/models/category.model.ts'; // default export dilenen isimle import edilebilir.
