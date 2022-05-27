import type { NextPage } from 'next'
import Layout from '../components/layout'

import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'

type Props = InferGetServerSidePropsType<typeof getServerSideProps>
interface dict { [key: string ]: string }

const Home: NextPage<Props> = ({res}) => {
  const router = useRouter()
  const {cluster_name} = router.query

  //console.log(res)

  return (
    <Layout>
      <div className="">
        <main data-theme="white" className="h-screen flex justify-center items-center">
          <div className='bg-neutral-content'>   aa
          {JSON.stringify(res)}
          <button className="btn btn-square btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>




          </div>
        </main>
      </div>
    </Layout>
  )
}

export default Home


export const getServerSideProps: GetServerSideProps = async context => {
  //console.log('query: ', context.query)
  const keyword = context.query

  const requestOptions = {
    method: "POST",
    headers: {'Content-Type' : 'application/json'},
    body: JSON.stringify(keyword)
  }

  console.log(requestOptions)

  const fetchUrl = "http://backend:7777/api/latestdataset"
  //const response = await fetch(fetchUrl, requestOptions)
  const response = ""
  if (response.ok) {
    var res:dict = await response.json()
  } else {
    var res:dict = { 'list' : '' }
  }

  console.log(res)

  return {
    props: { res }
  }
}

