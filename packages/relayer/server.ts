import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware to parse JSON request body
app.use(bodyParser.json());

// Route to handle incoming data from the frontend
app.post('/receive-data', (req: Request, res: Response) => {
  try {
    const { message, fromAddress } = req.body;

    // Check if required fields are provided
    if (!message || !fromAddress) {
      return res.status(400).json({ error: 'Missing message or fromAddress' });
    }

    // Log the data for now (you can add further processing here)
    console.log(`Received message: ${message} from: ${fromAddress}`);

    // Respond with a success message
    return res.status(200).json({ status: 'Message received', message, fromAddress });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
