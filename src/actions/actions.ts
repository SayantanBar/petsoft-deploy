"use server";
import prisma from "@/lib/db";
import { PetFormSchema, authSchema, petIdSchema } from "@/lib/validation";
import { signIn, signOut } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { checkAuth, getPetById } from "@/lib/server-utils";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { AuthError } from "next-auth";
import { deflate } from "zlib";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
//-------------- user action -------------//

export async function logIn(prevState: unknown, formData: unknown) {
  if (!(formData instanceof FormData)) {
    return {
      message: "invalid form data",
    };
  }
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return {
            message: "Invalid credentials",
          };
        }
        default: {
          return {
            message: "Error!! Could not sign in",
          };
        }
      }
    }
    throw error;
  }
}

export async function signUp(prevState: unknown, formData: unknown) {
  //check if formData is a FormData type
  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid form data",
    };
  }
  // convert formData to a normal object
  const formDataEntries = Object.fromEntries(formData.entries());
  //validate the form
  const validatedFormData = authSchema.safeParse(formDataEntries);
  if (!validatedFormData.success) {
    return {
      message: "Invalid form data",
    };
  }
  const { email, password } = validatedFormData.data;

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P202") {
        return {
          message: "Email already exist",
        };
      }
    }
    return {
      message: "Email already exist",
    };
  }

  await signIn("credentials", formData);
}

export async function logOut() {
  await signOut({ redirectTo: "/" });
}

//-------------- pet action --------------//
export async function addPet(pet: unknown) {
  //authentication
  const session = await checkAuth();

  const validatedPet = PetFormSchema.safeParse(pet);
  if (!validatedPet.success) {
    return { message: "Invalid pet data!" };
  }
  try {
    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
    revalidatePath("/app", "layout");
  } catch (error) {
    return { message: "could not add pet" };
  }
}

export async function editPet(petId: unknown, newPetData: unknown) {
  //authentication
  const session = await checkAuth();

  //validation
  const validatedPetid = petIdSchema.safeParse(petId);
  const validatedPet = PetFormSchema.safeParse(newPetData);

  if (!validatedPetid.success || !validatedPet.success) {
    return { message: "Invalid pet " };
  }

  //authorization
  const pet = await getPetById(validatedPetid.data);
  if (!pet) {
    return { message: "Pet is not found" };
  }
  if (pet.userId !== session.user.id) {
    return { message: "Not authorized!" };
  }

  //data mutation
  try {
    await prisma.pet.update({
      where: { id: validatedPetid.data },
      data: validatedPet.data,
    });

    revalidatePath("/app", "layout");
  } catch (e) {
    return {
      message: "Can not edit the pet",
    };
  }
}

export async function deletePet(petId: unknown) {
  //authentication check
  const session = await checkAuth();

  const validatedPetid = petIdSchema.safeParse(petId);
  if (!validatedPetid.success) {
    return { message: "Invalid pet data!" };
  }

  // authorization
  const pet = await getPetById(validatedPetid.data);

  if (!pet) {
    return { message: "Pet is not found" };
  }
  if (pet.userId !== session.user.id) {
    return { message: "Not authorized!" };
  }

  try {
    await prisma.pet.delete({ where: { id: validatedPetid.data } });

    revalidatePath("/app", "layout");
  } catch (error) {
    return {
      message: "can not checkout the pet",
    };
  }
}
//366
// payment action

export async function createCheckoutSession() {
  const session = await checkAuth();

  const checkoutSession = await stripe.checkout.sessions.create({
    customer_email: session.user.email,
    line_items: [{ price: "price_1QHRPTGub6RfSLsT3toCTx2q", quantity: 1 }],
    mode: "payment",
    success_url: `${process.env.CANNONICAL_URL}/payment?success=true`,
    cancel_url: `${process.env.CANNONICAL_URL}/payment?canclled=true`,
  });
  redirect(checkoutSession.url);
}
