import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const requestOptions = {
    method: "POST",
    headers: {'Content-Type' : 'application/json'},
    body: JSON.stringify(req.body)
  }

  const response = await fetch("http://backend:7777/api/connect", requestOptions)
  const data = await response.json()

  // response.status > success 200
  res.status(response.status).json(data);
}
