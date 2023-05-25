import { colorConsole, console } from "tracer";

export const SuperConsole = process.env.NODE_ENV === "development" ? colorConsole() : console() 