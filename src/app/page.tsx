'use client'
import Modal from "@/components/modal-custom";
import Template from "@/components/template-custom";
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react";
import { createPortal } from "react-dom";

export default function Home() {

  const [open, setOpen] = useState(false);

  return (
    <Template>
      <section className="mx-auto max-w-3xl pt-12">
        <h1 className="text-white text-xl mb-3">Home Page</h1>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magnam explicabo architecto natus veritatis ratione voluptatem hic, maiores dolorum corporis suscipit enim. Vitae, cumque? Corrupti, tenetur labore culpa enim consequuntur nisi.</p>
        <button type="button" onClick={() => setOpen(!open)}>haiii!!</button>
          <div className="bg-red-500">
          <AnimatePresence>
            {open ?
              <motion.div key={'50gosjb50wi'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed start-4 bottom-4 bg-red-500">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, quas.
                <button type="button" onClick={() => setOpen(false)}>closeeee!!!</button>
              </motion.div>
              : null}
          </AnimatePresence>
                <Modal open={open} title="testing cuy" key={'50gosjb50wi'} onClose={() => setOpen(false)}>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veritatis laudantium fugiat a dignissimos expedita ipsa quibusdam ab totam cumque aspernatur inventore, cum saepe, debitis, commodi reprehenderit ex consectetur quis sint.
                </Modal>
          </div>
      </section>
    </Template>
  );
}