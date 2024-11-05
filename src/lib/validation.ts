import { object, z } from "zod";
import { default_image_url } from "./constant";
export const PetFormSchema = z
  .object({
    name: z.string().trim().min(1, { message: "Name is required" }).max(50),

    ownerName: z
      .string()
      .trim()
      .min(1, { message: "Owner Name is required" })
      .max(50),

    age: z.coerce.number().int().positive().max(50),

    notes: z.union([z.literal(""), z.string().trim().max(300)]),

    imageUrl: z.union([
      z.literal(""),
      z.string().trim().url({ message: "Url must be a valid url" }),
    ]),
  })
  .transform((data) => ({
    ...data,
    imageUrl: data.imageUrl || default_image_url,
  }));

export type PetFormType = z.infer<typeof PetFormSchema>;

export const petIdSchema = z.string().cuid();

export const authSchema = z.object({
  email: z.string().email().max(100),
  password: z.string().max(100),
});

export type TAuth = z.infer<typeof authSchema>;
