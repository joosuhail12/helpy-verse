
import Head from 'next/head';
import { ChatWidget } from '@/widgets/chat'; // Updated import path

export default function Home() {
  return (
    <>
      <Head>
        <title>Chat Widget Demo</title>
        <meta name="description" content="Demo page for the chat widget" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Chat Widget Demo</h1>
        <p className="mb-4">This is a demo page to showcase the chat widget functionality.</p>
        
        {/* The chat widget will be rendered automatically */}
        <ChatWidget 
          workspaceId="demo-workspace-123"
          theme={{
            position: 'right',
            compact: false,
            colors: {
              primary: '#9b87f5'
            }
          }}
        />
      </main>
    </>
  );
}
