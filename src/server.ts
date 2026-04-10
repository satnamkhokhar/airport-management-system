import app from './index';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Airport backend running on http://localhost:${PORT}`);
});