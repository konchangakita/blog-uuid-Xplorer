import styles from '../styles/layout.module.css'

import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { ReactElement } from 'react'
import { useRouter } from 'next/router'

type LayoutProps = Required<{
  readonly children: ReactElement
}>

const Layout: NextPage<LayoutProps> = ({children}) => {
  const router = useRouter()
  const { cluster, user} = router.query
  const contentsUrl = '/home?cluster=' + router.query.cluster + '&user=' + router.query.user

  return (
    <>
      <div className="navbar bg-neutral text-neutral-content ">
        <div className='w-2/6 flex'>
          <div className="">
            <button className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
          <div className="">
            <Link href={contentsUrl} >
              <a data-tip="Go Home" className="tooltip tooltip-bottom"><Image src="/uuid-xplorer_logo-neg.png" alt="uuid xplorer logo neg" width={200} height={32}  /></a>
            </Link>
          </div>
        </div>
      </div>
      {children}
    </>
  )
}

export default Layout