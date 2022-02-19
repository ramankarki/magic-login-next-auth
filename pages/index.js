import { signOut, useSession } from 'next-auth/react';
import { Heading, Text, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';

import styles from '../styles/home.module.scss';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    router.prefetch('/auth/signin');
  });

  return (
    <main className={styles.container}>
      <Head>
        <title>Login with Raman Magic NextAuth</title>
      </Head>
      <Heading as={'h1'}>
        Magic Link Authentication in Next.js with NextAuth and MongoDB
      </Heading>
      {status === 'authenticated' ? (
        <>
          <Text>Logged in as {session.user.email}</Text>
          <Button onClick={signOut}>Logout</Button>
        </>
      ) : typeof window !== 'undefined' ? (
        <Button isLoading={status === 'loading'}>
          <Link
            href={'/auth/signin?callbackUrl=' + window?.location.origin || ''}
            prefetch
          >
            Login
          </Link>
        </Button>
      ) : (
        ''
      )}
    </main>
  );
}
