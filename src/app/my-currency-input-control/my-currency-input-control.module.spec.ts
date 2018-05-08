import { MyCurrencyInputControlModule } from './my-currency-input-control.module';

describe('MyCurrencyInputControlModule', () => {
  let myCurrencyInputControlModule: MyCurrencyInputControlModule;

  beforeEach(() => {
    myCurrencyInputControlModule = new MyCurrencyInputControlModule();
  });

  it('should create an instance', () => {
    expect(myCurrencyInputControlModule).toBeTruthy();
  });
});
