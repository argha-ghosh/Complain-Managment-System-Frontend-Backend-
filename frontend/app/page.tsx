import Header from "@/components/header";
import Head from "next/head";
import Link from "next/link";
import Page from '../.next/dev/types/routes';

export default function Home() {
  return (
    <>
      <Header props={{ page: "home" }} />
      <h1> Welcome to my home page</h1>
      <p> This is the home page paragraph</p>
    </>
  );
}
