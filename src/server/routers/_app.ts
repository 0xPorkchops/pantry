import { auth } from "@clerk/nextjs/server";
import { collection, doc, updateDoc, getDoc, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import db from "../db/firestore";
import { Product } from "~/utils/data";
import { procedure, router } from '../trpc';
import { z } from 'zod';
import { utapi } from "../uploadthing";

export const appRouter = router({
  getMyProducts: procedure
    .query(async () => {
        try {
            const user = auth();
      
            if (!user.userId) {
              throw new Error("User not authenticated");
            }
        
            const productsCollectionRef = collection(db, "users", user.userId, "products");
            const productsSnapshot = await getDocs(productsCollectionRef);
        
            const products: Product[] = productsSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()})) as Product[];
      
            return products;
        } catch (e) {
            console.error("Error retrieving products: ", e);
            throw e;
        }
    }),
    addProduct: procedure
    .input(
      z.object({
        productName: z.string(),
        quantity: z.number(),
        note: z.string(),
        location: z.string(),
        image: z.string()
      })
    )
    .mutation(async (opts) => {
        try {
            const user = auth();
            if (!user.userId) {
                throw new Error("User not authenticated");
            }
    
            const productsCollectionRef = collection(db, "users", user.userId, "products");
    
            const newProductRef = doc(productsCollectionRef);
    
            await setDoc(newProductRef, opts.input);
        } catch (e) {
            console.error("Error adding product: ", e);
            throw e;
        }
    }),
    deleteProduct: procedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async (opts) => {
        try {
            const user = auth();
            if (!user.userId) {
                throw new Error("User not authenticated");
            }
    
            const productDocRef = doc(db, "users", user.userId, "products", opts.input.id);

            const productSnapshot = await getDoc(productDocRef);
            const existingImage: string = productSnapshot.get("image");
            if (existingImage) {
              const oldImageKey: string | undefined = new URL(existingImage).pathname.split('/').pop();
              if (oldImageKey) {
                await utapi.deleteFiles(oldImageKey);
              }
            }
    
            await deleteDoc(productDocRef);
        } catch (e) {
            console.error("Error deleting product: ", e);
            throw e;
        }
    }),
    updateProduct: procedure
      .input(
        z.object({
        id: z.string(),
        productName: z.string().optional(),
        quantity: z.number().optional(),
        note: z.string().optional(),
        location: z.string().optional(),
        image: z.string().optional()
        })
      )
      .mutation(async (opts) => {
        try {
          const user = auth();
          if (!user.userId) {
            throw new Error("User not authenticated");
          }
      
          const productDocRef = doc(db, "users", user.userId, "products", opts.input.id);
      
          const productSnapshot = await getDoc(productDocRef);
          if (!productSnapshot.exists()) {
            throw new Error("Product not found");
          }
      
          const { id, ...updatedProduct } = opts.input;

          const existingImage: string = productSnapshot.get("image");
          if (existingImage && existingImage !== updatedProduct.image) {
            const oldImageKey: string | undefined = new URL(existingImage).pathname.split('/').pop();
            if (oldImageKey) {
              await utapi.deleteFiles(oldImageKey);
            }
          }
      
          await updateDoc(productDocRef, updatedProduct);
        } catch (e) {
          console.error("Error updating product: ", e);
          throw e;
        }
      }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;