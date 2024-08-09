import "server-only";
import db from "./db/firestore";
import { collection, doc, updateDoc, getDoc } from "firebase/firestore";
import { auth } from "@clerk/nextjs/server";
import { Product } from "~/utils/data";

export async function getMyProducts(): Promise<Product[]> {
    try {
      const user = auth();
      

      if (!user.userId) {
        throw new Error("User not authenticated");
      }
  
      const userDocRef = doc(collection(db, "users"), user.userId);
      const userDoc = await getDoc(userDocRef);
  
      if (!userDoc.exists()) {
        throw new Error("User document does not exist");
      }
  
      const userData = userDoc.data();
      const products: Product[] = userData.products as Product[] || [];

      return products;
      } catch (e) {
      console.error("Error retrieving products: ", e);
      throw e;
    }
  }

export async function addProduct(productName: string, quantity: number, location: string, note: string, image: string) {
    try {
        const user = auth();
        if (!user.userId) {
            throw new Error("User not authenticated");
        }

        const userDocRef = doc(collection(db, "users"), user.userId);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            throw new Error("User document does not exist");
        }

        const userData = userDoc.data();
        const products: Product[] = userData.products as Product[] || [];

        const newProduct: Product = {
            id: products.length,
            productName,
            quantity,
            location,
            note,
            image,
        };

        products.push(newProduct);

        await updateDoc(userDocRef, {
            products: products,
        });

        console.log(`Product added to user ${user.userId}'s products list`);
    } catch (e) {
        console.error("Error adding product: ", e);
    }
}
export async function deleteProduct(productId: number) {
    try {
        const user = auth();
        if (!user.userId) {
            throw new Error("User not authenticated");
        }

        const userDocRef = doc(collection(db, "users"), user.userId);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            throw new Error("User document does not exist");
        }

        const userData = userDoc.data();
        const products: Product[] = userData.products as Product[] || [];

        if (productId >= 0 && productId < products.length) {
            products.splice(productId, 1);
        } else {
            throw new Error("Invalid product ID");
        }

        await updateDoc(userDocRef, {
            products: products,
        });

        console.log(`Product with ID ${productId} deleted from user ${user.userId}'s products list`);
    } catch (e) {
        console.error("Error deleting product: ", e);
    }
}