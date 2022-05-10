import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const response = await fetch("http://backend:7777/api/fetchtest")
  const data = await response.json()

  console.log("status: ", response.status)
  console.log({data})

  // response.status > success 200
  res.status(response.status).json({data});
};
