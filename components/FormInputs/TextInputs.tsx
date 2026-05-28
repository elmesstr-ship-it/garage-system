import Link from "next/link";
import { Label } from "../ui/label";
import {Input} from "../ui/input"
import { cn } from "@/lib/utils";

type TextInputsProps = {
  label: string;
  register: any;
  name: string;
  type?: string;
  errors: any;
  placeholder: string;
  page?: string;
  className?: string;
  isRequired?: boolean;
};
export default function TextInputs({
  label,
  register,
  name,
  type = "text",
  errors,
  placeholder,
  page,
  className = "col-span-full",
  isRequired = true,
}: TextInputsProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      {type === "password" && page === "login" ? (
        <div className="flex items-center">
          <Label htmlFor={`${name}`}>{label}</Label>
          <Link
            href="#"
            className="ml-auto text-sm underline-offset-2 hover:underline"
          >
            Forgot your password?
          </Link>
        </div>
      ) : (
        <Label htmlFor={`${name}`}>{label}</Label>
      )}

      <Input
        {...register(`${name}`, { required: isRequired })}
        id={`${name}`}
        name={`${name}`}
        type={`${type}`}
        autoComplete="name"
        placeholder={placeholder}
      />
      {errors[`${name}`] && isRequired && (
        <span className="text-red-600 text-sm">{label} is required</span>
      )}
    </div>
  );
}
