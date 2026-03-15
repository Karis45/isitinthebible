// app/bible-myths/page.tsx
import { Metadata } from "next";
import BibleMythsClient from "./BibleMythsClient";

export const metadata: Metadata = {
  title: "30 Things People Think Are in the Bible (But Aren't)",
  description:
    "From 'God helps those who help themselves' to the Rapture — a definitive guide to common Bible myths, misquotes, and doctrines that aren't in Scripture.",
};

export default function Page() {
  return <BibleMythsClient />;
}