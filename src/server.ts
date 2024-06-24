import app from "./app";
import dotenv from 'dotenv';
import 'colors';

// Load env vars
dotenv.config();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
      );
});