"use client"
import React from "react";
import { assets} from "@/assets/assets";
import { FaShoppingBag, FaBox, FaShoppingCart, FaHome } from 'react-icons/fa';
import Link from "next/link"
import { signIn, signOut, useSession } from 'next-auth/react'
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

const Navbar = () => {

  const { isSeller, router } = useAppContext();
  const { data: session } = useSession()
  const user = session?.user

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push('/')}
        src={assets.logo}
        alt="logo"
      />

      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">Home</Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">Shop</Link>
        <Link href="/" className="hover:text-gray-900 transition">About Us</Link>
        <Link href="/" className="hover:text-gray-900 transition">Contact</Link>

        {isSeller && (
          <button
            onClick={() => router.push('/seller')}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </button>
        )}
      </div>

      <ul className="hidden md:flex items-center gap-4">
        <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
        {user ? (
          <>
            <button
              onClick={() => router.push('/cart')}
              className="hover:text-gray-900 transition flex items-center gap-1"
            >
              <FaShoppingCart /> Cart
            </button>
            <button
              onClick={() => router.push('/my-orders')}
              className="hover:text-gray-900 transition flex items-center gap-1"
            >
              <FaShoppingBag /> My Orders
            </button>
            <button
              onClick={() => signOut()}
              className="hover:text-red-500 transition flex items-center gap-1"
            >
              🔓 Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn()}
            className="flex items-center gap-2 hover:text-gray-900 transition"
          >
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>
        )}
      </ul>

      {/* Mobile Menu */}
      <div className="flex items-center md:hidden gap-3">
        {isSeller && (
          <button
            onClick={() => router.push('/seller')}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </button>
        )}

        {user ? (
          <>
            <button onClick={() => router.push('/')}><FaHome /></button>
            <button onClick={() => router.push('/all-products')}><FaBox /></button>
            <button onClick={() => router.push('/cart')}><FaShoppingCart /></button>
            <button onClick={() => router.push('/my-orders')}><FaShoppingBag /></button>
            <button onClick={() => signOut()} className="text-sm text-red-500">Logout</button>
          </>
        ) : (
          <button
            onClick={() => signIn()}
            className="flex items-center gap-2 hover:text-gray-900 transition"
          >
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;