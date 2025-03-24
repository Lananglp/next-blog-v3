import { Metadata } from "next";
import Dashboard from "./dashboard";

const pageTitle = "Admin Dashboard";

export const metadata: Metadata = {
  title: pageTitle,
};

const Page = () => {
  return (
    <Dashboard pageTitle={pageTitle} />
  )
}

export default Page;