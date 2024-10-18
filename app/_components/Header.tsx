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
            subItems: isSignedIn ? [ // Solo muestra el submenú si el usuario está autenticado
                { name: 'Interactive Stories', path: '/create-story/interactive-stories' }
            ] : []
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
        }, 500); // Espera de 500ms
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
                        className='relative'
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
                        {item.subItems && item.subItems.length > 0 && openSubmenu === item.name && (
                            <div 
                                className="absolute top-full left-0 mt-2 p-2 bg-white shadow-lg rounded-md transition-opacity duration-200 ease-in-out"
                                onMouseEnter={() => handleMouseEnter(item.name)}
                                onMouseLeave={() => handleMouseLeave()}
                            >
                                {item.subItems.map((subItem) => (
                                    <Link key={subItem.name} href={subItem.path}>
                                        <p className='text-lg text-primary font-medium hover:underline my-1'>{subItem.name}</p>
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
