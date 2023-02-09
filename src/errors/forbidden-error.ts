import { ApplicationError } from "@/protocols";

export function forbiddenError(): ApplicationError {
  return {
    name: "forbidenError",
    message: "Cannot acess the information!",
  };
}
