import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

//fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons'

const Index: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main data-theme="white" className="flex text-center items-center h-screen">
        <div className='w-1/2'>
          <div className='m-10'><Image src="/uuid-xplorer_logo.png" alt="uuid xplorer logo" width={494} height={80} /></div>
        </div>

        <div className="w-1/2 bg-primary h-screen flex justify-center items-center flex flex-col">
          <div className="form-control mt-20">
            <form >
              <div className='flex flex-col'>
                <input type="text" placeholder="Cluster IP" className="input input-info input-bordered m-1 w-64 text-lg" />
                <input type="text" placeholder="username" className="input input-info input-bordered m-1 w-64 text-lg" />
                <div className='m-1 relative'>
                  <input type="password" placeholder="Password" className="input input-info input-bordered w-64 text-lg" />
                  <button type="submit" className="absolute inset-y-2 right-2 opacity-20 hover:opacity-100"><FontAwesomeIcon icon={faArrowCircleRight} size="2x" /></button>
                </div>
              </div>
            </form>
          </div>
        </div>

      </main>
      <footer className="text-center text-sm">Copyright (C) konchangakita. All Rights Reserved.</footer>
    </div>
  )
}

export default Index