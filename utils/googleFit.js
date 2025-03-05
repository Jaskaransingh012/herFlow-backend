const { google } = require('googleapis');
const oauth2Client = require('../config/googleAuth');

async function getStepData(accessToken, startTimeMillis, endTimeMillis) {
  oauth2Client.setCredentials({ access_token: accessToken });
  const fitness = google.fitness({ version: 'v1', auth: oauth2Client });

  const res = await fitness.users.dataSources.datasets.get({
    userId: 'me',
    dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
    datasetId: `${startTimeMillis}-${endTimeMillis}`,
  });

  const points = res.data.point || [];
  const stepCount = points.reduce((total, point) => total + (point.value[0].intVal || 0), 0);
  return stepCount;
}

module.exports = { getStepData };