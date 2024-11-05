"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "./ui/textarea";
import { usePetContext } from "@/lib/hook";
import PetFormBtn from "./pet-form-btn";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { default_image_url } from "@/lib/constant";
import { PetFormSchema } from "@/lib/validation";
import { PetFormType } from "@/lib/validation";

export type PetFormProps = {
  actionType: "add" | "edit";
  onFormSubmission: () => void;
};

const PetForm = ({ actionType, onFormSubmission }: PetFormProps) => {
  const { selectedPet, handleNewPet, handleEditPet } = usePetContext();

  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<PetFormType>({
    resolver: zodResolver(PetFormSchema),
    defaultValues:
      actionType === "edit"
        ? {
            name: selectedPet?.name,
            age: selectedPet?.age,
            imageUrl: selectedPet?.imageUrl,
            ownerName: selectedPet?.ownerName,
            notes: selectedPet?.notes,
          }
        : undefined,
  });
  return (
    <form
      className="flex flex-col"
      action={async () => {
        const result = await trigger();
        if (!result) return;
        onFormSubmission();
        // to collect the all form data
        const petData = getValues();
        petData.imageUrl = petData.imageUrl || default_image_url;
        console.log(petData);
        if (actionType === "add") {
          await handleNewPet(petData);
        } else if (actionType === "edit") {
          await handleEditPet(selectedPet!.id, petData);
        }
      }}
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input id="ownerName" {...register("ownerName")} />

          {errors.ownerName && (
            <p className="text-red-500">{errors.ownerName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image Url</Label>
          <Input id="imageUrl" {...register("imageUrl")} />

          {errors.imageUrl && (
            <p className="text-red-500">{errors.imageUrl.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input id="age" {...register("age")} />

          {errors.age && <p className="text-red-500">{errors.age.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" rows={3} {...register("notes")} />

          {errors.notes && (
            <p className="text-red-500">{errors.notes.message}</p>
          )}
        </div>
      </div>
      <PetFormBtn actionType={actionType} />
    </form>
  );
};

export default PetForm;
