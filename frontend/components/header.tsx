"use client";
import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';


export default function Header({ props }: { props?: any }) {
    const page = props?.page || "unknown page";
    useEffect(() => {
        document.title = page
    }, []);

    return (
        <>
            <Head>
                <title>My App</title>
            </Head>
            <header>
                <h1>You are in {page} </h1>
                {/* <nav>
                    <Link href="/">Home</Link> |
                    <Link href="/ZoneOfficer/Complaint/CreateComplain">Create Complain</Link> |
                    <Link href="/ZoneOfficer/Complaint/EditComplain">Edit Complain</Link> |
                    <Link href="/ZoneOfficer/AllOfficers">All Officers</Link> |
                    <Link href="/ZoneOfficer/EditOfficer">Edit Officer</Link> |
                    <Link href="/ZoneOfficer/SignUp">Sign Up</Link>
                </nav> */}
            </header>
        </>
    );
}