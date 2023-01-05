import S3 from 'aws-sdk/clients/s3'

const s3 = new S3({
  region: 'eu-west-3',
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  signatureVersion: 'v4',
})

export default async function Delete(req, res) {  
  try {
    if (req.method !== 'DELETE') {
      return res.status(405).json({ message: 'Method not allowed' })
    }

    s3.deleteObject({ Bucket: process.env.S3_BUCKET_NAME, Key: req.query.key }).promise()
    res.status(200).json({ message: 'The image was deleted successfully' })
  } catch (e) {
    return res.status(500).json({ message: new Error(e).message })
  }

  res.end()
}