const module2: any = {};

export const factoryModule2 = (module1: any) => {
  module2.module1 = module1;
  module2.clientM2 = Math.random().toFixed(5).toString();

  console.log('!initModule2');
  return module2;
};

export default factoryModule2;