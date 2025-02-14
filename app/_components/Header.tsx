import React, { useState, useRef } from 'react';
import {
    Navbar, 
    NavbarBrand, 
    NavbarContent, 
    NavbarItem, 
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem
} from "@nextui-org/navbar";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@nextui-org/button';
import { UserButton, useUser } from '@clerk/nextjs';
import { FaCrown } from 'react-icons/fa';

function Header() {
    const { user, isSignedIn } = useUser();

    // Estado para controlar qué submenú está abierto
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
    
    // Ref para almacenar el temporizador
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const MenuList = [
        { name: 'Home', path: '/' },
        { 
            name: 'Create Story', 
            path: '/create-story',
            subItems: [
                { name: 'Interactive Stories', path: '/create-story/interactive-stories', icon: <FaCrown /> }
            ]
        },
        { name: 'Explore Stories', path: '/explore' },
        { name: 'Contact Us', path: '/contact-us' }
    ];

    // Funciones para manejar la apertura y el cierre del submenú
    const handleMouseEnter = (name: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setOpenSubmenu(name);
    };

    const handleMouseLeave = () => {
        // Añadir un pequeño retraso antes de cerrar el submenú
        timeoutRef.current = setTimeout(() => {
            setOpenSubmenu(null);
        }, 300); // Espera de 300ms
    };

    return (
        <Navbar maxWidth='full'>
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label="Open menu"
                    className='sm:hidden'
                />
                <NavbarBrand>
                    <Image src={'/logo.svg'} alt='logo' width={40} height={40} />
                    <h2 className='font-bold text-2xl text-primary ml-3'>StelarBooks AI</h2>
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent justify='center' className='hidden sm:flex'>
                {MenuList.map((item) => (
                    <div 
                        key={item.name}
                        className='relative group'
                        onMouseEnter={() => item.subItems && handleMouseEnter(item.name)}
                        onMouseLeave={() => item.subItems && handleMouseLeave()}
                    >
                        <NavbarItem
                            className='text-xl text-primary font-medium hover:underline mx-2'
                        >
                            <Link href={item.path}>
                                {item.name}
                            </Link>
                        </NavbarItem>
                        {item.subItems && openSubmenu === item.name && (
                            <div 
                                className="absolute top-full left-0 mt-2 p-3 bg-white shadow-lg rounded-md transition-all duration-200 ease-in-out opacity-0 invisible group-hover:opacity-100 group-hover:visible"
                                style={{ minWidth: '200px', border: '1px solid #e0e0e0' }}
                            >
                                {item.subItems.map((subItem) => (
                                    <Link key={subItem.name} href={subItem.path}>
                                        <div className='flex items-center p-3 hover:bg-gray-100 rounded-md transition-colors duration-150 cursor-pointer'>
                                            <span className='mr-2 text-yellow-500'>{subItem.icon}</span>
                                            <p className='text-lg text-primary font-medium'>{subItem.name}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </NavbarContent>
            <NavbarContent justify='end'>
                <Link href={'/dashboard'}>
                    <Button color='primary'>
                        {isSignedIn ? 'Dashboard' : 'Get Started'}
                    </Button>
                </Link>
                <UserButton />
            </NavbarContent>
            <NavbarMenu>
                {MenuList.map((item) => (
                    <React.Fragment key={item.name}>
                        <NavbarMenuItem>
                            <Link href={item.path}>
                                {item.name}
                            </Link>
                        </NavbarMenuItem>
                        {item.subItems && item.subItems.map((subItem) => (
                            <NavbarMenuItem key={subItem.name}>
                                <Link href={subItem.path}>
                                    {subItem.name}
                                </Link>
                            </NavbarMenuItem>
                        ))}
                    </React.Fragment>
                ))}
            </NavbarMenu>
        </Navbar>
    );
}

export default Header;
