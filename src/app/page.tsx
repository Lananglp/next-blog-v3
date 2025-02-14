import Footer from "@/components/footer";
import Header from "@/components/header";
import Template from "@/components/template-custom";
import Link from "next/link";


export default function Home() {
  return (
    <Template>
      <section className="mx-auto max-w-3xl pt-12">
        <h1 className="text-white text-xl mb-3">Home Page</h1>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magnam explicabo architecto natus veritatis ratione voluptatem hic, maiores dolorum corporis suscipit enim. Vitae, cumque? Corrupti, tenetur labore culpa enim consequuntur nisi.</p>
      </section>
    </Template>
  );
}
