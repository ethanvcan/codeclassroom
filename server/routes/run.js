const express = require('express');
const router = express.Router();
const fs = require('fs');
const { exec } = require('child_process');

router.post('/', (req, res) => {
    const { code, input, expectedOutput } = req.body;
    const filename = `temp_${Date.now()}.py`;
  
    fs.writeFileSync(filename, code);
  
    exec(`python3 ${filename}`, { input }, (err, stdout, stderr) => {
      fs.unlinkSync(filename); // cleanup
  
      let output = (stderr || stdout || '').trim();
  
      // Clean internal Python paths if there's an error
      if (stderr) {
        output = output
          .split('\n')
          .filter(line => !line.includes('temp_'))
          .join('\n')
          .trim();
      }
  
      // Compare against expected output
      const correct = expectedOutput?.trim() === stdout?.trim();

      res.json({ output, correct });
    });
  });
  

module.exports = router;
