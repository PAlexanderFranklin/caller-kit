import { callModule } from 'libkernel';

const danceModule = 'AQDnT1ZRZO4zXffZAkqWJszR7GfRl1f4AlCde1Kti18c5w';

export const createCall = async (call) => {
  const [result, err] = await callModule(danceModule, 'createCall', {call});
  err ? console.error({ err }) : console.log(result);
}