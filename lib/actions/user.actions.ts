"use server";

import { revalidatePath } from "next/cache";
import { CreateUserParams, UpdateUserParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import User from "../database/models/user.model";
import Event from "@/lib/database/models/event.model";
import Order from "../database/models/order.model";

export const createUser = async (user: CreateUserParams) => {
  try {
    await connectToDatabase();
    const newUser = await User.create(user);
    // https://mongoosejs.com/docs/api/document.html#Document.prototype.toJSON()
    // Document.prototype.toJSON()
    // [options.flattenObjectIds=false] «Boolean» if true, convert any ObjectIds in the result to 24 character hex strings.
    // return JSON.parse(JSON.stringify(newUser, null, 2)); // ayni isi gorur
    return newUser.toJSON({ flattenObjectIds: true });
  } catch (error) {
    handleError(error);
  }
};

export async function getUserById(userId: string) {
  try {
    await connectToDatabase();

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");
    // return JSON.parse(JSON.stringify(user, null , 2)); ayni isi gorur
    return user.toJSON({ flattenObjectIds: true });
  } catch (error) {
    handleError(error);
  }
}

export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User update failed");
    // return JSON.parse(JSON.stringify(updatedUser, null, 2)); // ayni isi gorur
    return updatedUser.toJSON({ flattenObjectIds: true });
  } catch (error) {
    handleError(error);
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // * Promise.all kullanıldığında, bu promise'lar aynı anda başlatılır, ancak JavaScript'in asenkron doğası gereği, bunların her birinin tamamlanma süreleri farklı olabilir. Promise.all metodu, tüm promise'lar başarıyla tamamlandığında, bu promise'ların sonuçlarını içeren bir array döndürür. Eğer promise'lerden herhangi biri reddedilirse (reject olursa), Promise.all hemen bir hata ile reddedilir ve kalan promise'lerin sonuçları göz ardı edilir. Bu durum, Promise.all'in "hepsi ya da hiçbiri" mantığıyla çalıştığını gösterir.
    // https://github.com/Godofbrowser/axios-refresh-multiple-request/blob/master/src/auth.interceptor.js
    // Unlink relationships
    await Promise.all([
      // Update the 'events' collection to remove references to the user
      // https://www.mongodb.com/docs/manual/reference/operator/update/pull/
      // The  $pull operator removes from an existing array all instances of a value or values that match a specified condition.
      // https://www.mongodb.com/docs/manual/reference/operator/update/pull/#examples
      Event.updateMany(
        { _id: { $in: userToDelete.events } },
        { $pull: { organizer: userToDelete._id } }
      ),

      // Update the 'orders' collection to remove references to the user
      // https://www.mongodb.com/docs/manual/reference/operator/update/unset/
      // The  $unset operator deletes a particular field.
      // https://www.mongodb.com/docs/manual/reference/operator/update/unset/#example
      Order.updateMany(
        { _id: { $in: userToDelete.orders } },
        { $unset: { buyer: 1 } }
      ),
    ]);

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
}
