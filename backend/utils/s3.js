import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Configure AWS S3
const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: 'AKIA6D6JBV5POJQ7BHZP',
    secretAccessKey: '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',
  },
});

// Function to upload image to S3
export const uploadToS3 = async (fileContent, fileName) => {
  const params = {
    Bucket: "zauvijekimages",
    Key: fileName, // File name you want to save as in S3
    Body: fileContent,
    ACL: 'public-read', // Make the file publicly readable
    ContentType: 'image/jpeg', // Change if needed based on file type
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    const url = `https://zauvijekimages.s3.ap-south-1.amazonaws.com/${fileName}`;
    return url; // This will be the public URL
  } catch (error) {
    console.error('Error uploading to S3', error);
    throw error;
  }
};
