import React from 'react'
import Layout from './../Layout'

const Page = ({reputation, ...props}) => <Layout>
  <div>
    <p>{reputation}</p>
  </div>
</Layout>

export default Page