const module1: any = {};

export const factoryModule1 = () => {
  module1.clientM1 = Math.random().toFixed(5).toString();

  console.log('!initModule1');
  return module1;
};

export default factoryModule1;