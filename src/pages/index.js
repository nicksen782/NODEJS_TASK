import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import axios from 'axios';
// import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

const inter = Inter({ subsets: ['latin'] })
const queryClient = new QueryClient();

const fetchLogs = async () => {
  const { data } = await axios.get('/api/logs');
  return data;
};

function LogAnalyzer() {
  const { data, refetch } = useQuery('logs', fetchLogs, { refetchInterval: 5000 });  // Fetch data every 5 seconds

  return (
    <>
    <Head>
      <title>Create Next App</title>
      <meta name="description" content="Generated by create next app" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main className={`${styles.main} ${inter.className}`}>
      <h1>Log Analyzer</h1>
      {data && (
        <>
          <p>Total records: {data.total}</p>
          <p>Average per minute: {data.avgPerMinute.toFixed(2)}</p>
          <p>Info: {data.types.info}</p>
          <p>Warning: {data.types.warning}</p>
          <p>Error: {data.types.error}</p>
          <p>Log with most words: {data.maxWords.log}</p>
        </>
      )}
    </main>
    </>
  );
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <LogAnalyzer />
    </QueryClientProvider>
  );
}
