import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type SubmitButtonProps = {
  title: string;
  type?: "submit" | "reset" | "button";
  isLoading: boolean;
  titleLoading: string;
  className?: string;
};

export default function SubmitButton({
  title,
  type = "submit",
  isLoading = false,
  titleLoading,
  className,
}: SubmitButtonProps) {
  return (
    <Button
      type={type}
      disabled={isLoading}
      className={cn("w-full flex items-center justify-center", className)}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {titleLoading}
        </>
      ) : (
        title
      )}
    </Button>
  );
}