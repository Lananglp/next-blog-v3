import { Metadata } from 'next';
import React from 'react'
import Categories from './Categories';

export const metadata: Metadata = {
    title: "Manage your Categories",
};

function page() {
  return (
    <Categories />
  )
}

export default page