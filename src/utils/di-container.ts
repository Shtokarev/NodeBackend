import parseFunction from 'parse-function';

interface DIImportedModule {
  default: Function;
}

const parser = parseFunction({
  ecmaVersion: 2017,
});

export class DependencyInjectionContainer {
  dependencies: { [name: string]: unknown } = {};
  factories: { [name: string]: DIImportedModule } = {};

  register = (name: string, dependency: string) => {
    this.dependencies[name] = dependency;
  }

  factory = (name: string, factory: DIImportedModule) => {
    this.factories[name] = factory;
  }

  get = async (name: string) => {
    if (!this.dependencies[name]) {
      const factory = this.factories[name].default;

      this.dependencies[name] = factory && this.inject(factory);

      if (this.dependencies[name] instanceof Promise) {
        this.dependencies[name] = await this.dependencies[name];
      }

      if (!this.dependencies[name]) {
        throw new Error(`Cannot find module ${name}`);
      }
    }

    return this.dependencies[name];
  }

  inject = (factory: Function) => {
    const args = parser.parse(factory).args;
    console.log(args);

    const fnArgs = parser.parse(factory).args.map((dependency: string) => this.get(dependency));
    return factory(...fnArgs);
  }
}

