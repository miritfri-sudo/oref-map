const https = require('https');

exports.handler = async (event) => {
  const type = event.queryStringParameters?.type || 'active';
  
  const urls = {
    active: 'https://www.oref.org.il/WarningMessages/alert/alerts.json',
    history: 'https://www.oref.org.il/WarningMessages/History/AlertsHistory.json'
  };
  
  const url = urls[type] || urls.active;
  
  return new Promise((resolve) => {
    const options = {
      headers: {
        'Referer': 'https://www.oref.org.il/',
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'he-IL,he;q=0.9',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
      }
    };
    
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache, no-store'
          },
          body: data || 'null'
        });
      });
    }).on('error', (err) => {
      resolve({
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: err.message })
      });
    });
  });
};
