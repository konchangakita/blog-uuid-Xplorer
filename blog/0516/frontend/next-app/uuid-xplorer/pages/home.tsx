import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const Index: NextPage = () => {
  const router = useRouter()
  const {cluster} = router.query
  return (
    <div className="">
      <main data-theme="white" className="h-screen flex justify-center items-center">
        {cluster}
      </main>
    </div>
  )
}

export default Index
