const module3: any = {};

export const factoryModule3 = (module1: any, module2: any) => {
  module3.module2 = module2;
  module3.module1 = module1;
  module3.clientM3 = Math.random().toFixed(5).toString();

  console.log('!initModule3');
  return module3;
};

export default factoryModule3;