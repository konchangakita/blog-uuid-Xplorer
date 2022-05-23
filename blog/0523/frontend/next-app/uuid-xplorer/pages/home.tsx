import type { NextPage } from 'next'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'

type Props = InferGetServerSidePropsType<typeof getServerSideProps>
interface dict { [key: string ]: string }

const Home: NextPage<Props> = ({res}) => {
  const router = useRouter()
  const {cluster_name} = router.query

  //console.log(res)

  return (
    <div className="">
      <main data-theme="white" className="h-screen flex justify-center items-center">
        {JSON.stringify(res)}
      </main>
    </div>
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
  const response = await fetch(fetchUrl, requestOptions)
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

