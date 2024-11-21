const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const base64topdf = require('base64topdf');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

// GET Endpoint
app.get('/bfhl', (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// POST Endpoint
app.post('/bfhl', (req, res) => {
  const { data, file_b64 } = req.body;
  const response = {
    is_success: true,
    user_id: 'bhoomika_chouhan_17022004',
    email: 'bhoomika.chouhan@cdgi.edu.in',
    roll_number: '0832CS211049',
    numbers: [],
    alphabets: [],
    highest_lowercase_alphabet: [],
    is_prime_found: false,
    file_valid: false,
    file_mime_type: null,
    file_size_kb: null
  };

  // Separate numbers and alphabets
  if (data) {
    data.forEach((item) => {
      if (!isNaN(item)) {
        response.numbers.push(item);
        if (isPrime(parseInt(item))) {
          response.is_prime_found = true;
        }
      } else if (isNaN(item)) {
        response.alphabets.push(item);
        if (item === item.toLowerCase() && item >= 'a' && item <= 'z') {
          if (
            response.highest_lowercase_alphabet.length === 0 ||
            item > response.highest_lowercase_alphabet[0]
          ) {
            response.highest_lowercase_alphabet = [item];
          }
        }
      }
    });
  }

  // File handling
  if (file_b64) {
    try {
      const filePath = base64topdf.base64Decode(file_b64, './uploaded_file');
      const fs = require('fs');
      const fileStats = fs.statSync(filePath);

      response.file_valid = true;
      response.file_mime_type = getMimeType(filePath);
      response.file_size_kb = (fileStats.size / 1024).toFixed(2);
    } catch (err) {
      response.is_success = false;
    }
  }

  res.json(response);
});

// Helper Functions
function isPrime(num) {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function getMimeType(filePath) {
  const mime = require('mime-types');
  return mime.lookup(filePath);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
