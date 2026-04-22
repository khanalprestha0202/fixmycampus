const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json([
    { id: 1, title: 'How to describe an issue clearly', content: 'Be specific about what is broken, where it is located, and when you first noticed it. Include any safety risks.', category: 'Reporting Tips' },
    { id: 2, title: 'What information is needed', content: 'You will need: building name, room number or location, category of issue, brief description, and your contact email.', category: 'Required Information' },
    { id: 3, title: 'Safety hazards - report immediately', content: 'If you see exposed wiring, flooding, gas smells, or structural damage - mark as Critical priority and contact security immediately on 999.', category: 'Safety' },
    { id: 4, title: 'Photo guidelines', content: 'If attaching a photo link, ensure it clearly shows the issue. Do not include people in photos. Use Google Drive or Imgur for hosting.', category: 'Photos' },
    { id: 5, title: 'Tracking your report', content: 'Once submitted, your report will have a status: New, In Progress, or Resolved. Check the dashboard for updates.', category: 'Tracking' },
    { id: 6, title: 'Privacy and data use', content: 'Your name and email are stored securely and only used to update you on your report. Data is never shared with third parties.', category: 'Privacy' }
  ]);
});

module.exports = router;