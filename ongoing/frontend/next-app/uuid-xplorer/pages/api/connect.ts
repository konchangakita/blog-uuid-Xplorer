import { Console } from 'console';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const requestOptions = {
    method: "POST",
    headers: {'Content-Type' : 'application/json'},
    body: JSON.stringify(req.body)
  }

  const response = await fetch("http://backend:7777/api/fetchtest")

  console.log(response.status)
  const data = await response.json()
  // response.status > success 200
  res.status(400).json(data);
};
