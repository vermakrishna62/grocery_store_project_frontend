"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Cookies from 'cookie_js';


const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () =>{
        Cookies.remove(['user', 'email','pass','fn','ln']);

        router.push("/")
    }

    return (
        <header className="bg-white">
            <nav className="flex justify-between items-center w-[92%] mx-auto">
                <div>
                <h1 className='text-2xl font-bold my-5'>Grocery Store Dashboard</h1>
                </div>
                <div className={`nav-links duration-500 md:static absolute bg-white md:min-h-fit min-h-[60vh] left-0 top-${isMenuOpen ? '9%' : '-100%'} md:w-auto w-full flex items-center px-5`}>
                    {/* <ul className="flex md:flex-row flex-col md:items-center md:gap-[4vw] gap-8">
                        <li>
                            <a className="hover:text-gray-500" href="#">Products</a>
                        </li>
                        <li>
                            <a className="hover:text-gray-500" href="#">Solution</a>
                        </li>
                        <li>
                            <a className="hover:text-gray-500" href="#">Resource</a>
                        </li>
                        <li>
                            <a className="hover:text-gray-500" href="#">Developers</a>
                        </li>
                        <li>
                            <a className="hover:text-gray-500" href="#">Pricing</a>
                        </li>
                    </ul> */}
                </div>
                <div className="flex items-center gap-6">
                    <button onClick={handleLogout} className="bg-orange-400 text-white px-5 py-2 rounded-full ">Logout</button>
                   
                </div>
            </nav>
        </header>
    );
};

export default Header;
