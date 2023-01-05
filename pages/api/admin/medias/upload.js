import S3 from 'aws-sdk/clients/s3'

const s3 = new S3({
  region: 'eu-west-3',
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  signatureVersion: 'v4',
})

export default async function Upload(req, res) {
  try {
    const post = await s3.createPresignedPost({
      Bucket: process.env.S3_BUCKET_NAME,
      Fields: {
        key: req.query.key,
        'Content-Type': req.query.fileType
      },
      Expires: 60, // 1 minute
    })

    res.status(200).json(post)
  } catch (e) {
    return res.status(500).json({ message: new Error(e).message })
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8mb',
    },
  },
}