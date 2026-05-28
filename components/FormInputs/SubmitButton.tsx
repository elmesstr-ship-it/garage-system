import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type submitButtonProps = {
  title: string;
  type?: "submit" | "reset" | "button" | undefined;
  isLoading: boolean;
  titleLoading: string;
  className?: string;
};

export default function SubmitButton({
  title,
  type = "submit",
  isLoading = false,
  titleLoading,
  className
}: submitButtonProps) {
  return (
    <>
      {isLoading ? (
        <Button disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {titleLoading}
        </Button>
      ) : (
        <Button type={type} className={cn("w-full", className)}>
          {title}
        </Button>
      )}
    </>
  );
}
